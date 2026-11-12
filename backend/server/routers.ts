import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { z } from "zod";

const answerSchema = z.object({
  text: z.string(),
  sources: z.array(z.string()),
});

const fallbackAnswer = {
  text: "I’m sorry, I could not reach the Islamic Answer service just now. Please try again shortly. For a personal or complex matter, consult a qualified scholar who can understand your circumstances.",
  sources: ["Quran and Sahih Hadith references are provided when the answer service is available."],
};

function parseAnswer(content: string) {
  const answerMatch = content.match(/(?:ANSWER|RESPONSE)\s*:\s*([\s\S]*?)(?=\n\s*SOURCES?\s*:|$)/i);
  const sourcesMatch = content.match(/SOURCES?\s*:\s*([\s\S]*)/i);
  const text = (answerMatch?.[1] || content).trim();
  const sources = (sourcesMatch?.[1] || "")
    .split("\n")
    .map(line => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
  return { text, sources: sources.length ? sources : ["Quran and Sahih Hadith references as noted in the response."] };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  imam: router({
    ask: publicProcedure.input(z.object({ question: z.string().trim().min(2).max(2000) })).mutation(async ({ input }) => {
      if (!ENV.forgeApiUrl || !ENV.forgeApiKey) return fallbackAnswer;
      try {
        const response = await fetch(`${ENV.forgeApiUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ENV.forgeApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "You are AI Imam, a careful Islamic education assistant. First detect the language and script of the user’s question, then answer in that same language. For Tanglish—Tamil written with Latin/English letters—always answer in standard Tamil using Tamil script, not Tanglish, while preserving key Arabic Islamic terms accurately. For other transliterated languages, answer in that language’s normal native script when possible. For mixed-language questions, answer primarily in the dominant language used by the user; do not default to English unless the user asks in English. Understand informal spelling, code-switching, and regional phrasing. Ground the response only in the Quran, authenticated Sahih Hadith, and established Sharia principles. Do not invent citations, issue a definitive personal fatwa, or present differences of scholarly opinion as settled. If the question is sensitive, personal, medical, legal, financial, or asks for a binding ruling, clearly say that a qualified scholar should review the details. Return exactly this plain-text format: ANSWER: followed by a concise answer in 2–4 short paragraphs, then SOURCES: followed by 1–4 bullet lines naming the surah/ayah or hadith collection and reference. Keep the ANSWER and SOURCES headings in English for reliable parsing, but write the answer and source descriptions in the user’s requested language/script.",
              },
              { role: "user", content: input.question },
            ],
          }),
        });
        if (!response.ok) throw new Error(`LLM request failed with ${response.status}`);
        const body = await response.json() as { error?: { message?: string }; choices?: Array<{ message?: { content?: string } }> };
        const content = body.choices?.[0]?.message?.content?.trim();
        if (!content) throw new Error(body.error?.message || "No answer returned");
        return answerSchema.parse(parseAnswer(content));
      } catch (error) {
        console.error("[AI Imam] answer request failed:", error);
        return fallbackAnswer;
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
