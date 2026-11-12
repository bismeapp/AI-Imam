import { useEffect, useRef, useState } from "react";
import { AlertCircle, BookOpen, Loader2, Mic, MicOff, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

type SpeechRecognitionEventLike = Event & { results: { [index: number]: { [index: number]: { transcript: string } } } };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [answer, setAnswer] = useState<{ text: string; sources: string[] } | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const askMutation = trpc.imam.ask.useMutation({
    onSuccess: result => setAnswer(result),
  });

  const supportsVoice = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const toggleVoice = () => {
    if (!supportsVoice) {
      setVoiceMessage("Voice input is not available in this browser. You can type your question instead.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = event => {
      const transcript = Array.from({ length: Object.keys(event.results).length }, (_, index) => event.results[index]?.[0]?.transcript || "").join(" ");
      if (transcript.trim()) setQuestion(transcript.trim());
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceMessage("We could not hear that clearly. Please try again or type your question.");
    };
    recognitionRef.current = recognition;
    setVoiceMessage("");
    setIsListening(true);
    recognition.start();
  };

  const submitQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim() || askMutation.isPending) return;
    setAnswer(null);
    setVoiceMessage("");
    askMutation.mutate({ question: question.trim() });
  };

  return (
    <main data-layer="Ask Imam" data-node-id="513-4064" className="imam-shell">
      <section className="imam-page" aria-labelledby="page-title">
        <img data-layer="BR Logo 2026 - Black-TRANSP 1" data-node-id="513-4196" className="brand-logo" src="/513-4196.webp" alt="Bisme Radio" />

        <header className="hero-copy">
          <h1 data-layer="Ask Imam Now" data-node-id="513-4197" id="page-title">Ask Imam Now</h1>
          <p data-layer="(in any language)" data-node-id="513-4200" className="language-note">(in any language)</p>
          <h2 data-layer="Bisme Radio’s AI Platform" data-node-id="513-4201">Bisme Radio’s AI Platform</h2>
          <p data-layer="Bisme Radio introduces ‘Ask Imam’, a revolutionary AI-powered state-of-the art platform delivering authentic Islamic knowledge with instant Islamic insights, expert fatwas, and comprehensive education, anytime, anywhere at your fingertips." data-node-id="513-4203" className="intro-copy">
            Bisme Radio introduces ‘Ask Imam’,<br />
            a revolutionary AI-powered state-of-the art platform delivering authentic Islamic knowledge with instant Islamic insights, expert fatwas, and comprehensive education, anytime, anywhere at your fingertips.
          </p>
        </header>

        <form className="question-form" onSubmit={submitQuestion}>
          <div className={`question-box ${isListening ? "is-listening" : ""}`} data-layer="White BG" data-node-id="513-4236">
            <label htmlFor="imam-question" className="sr-only">Ask in any language</label>
            <textarea
              id="imam-question"
              value={question}
              onChange={event => setQuestion(event.target.value)}
              placeholder="Ask in any language..."
              aria-describedby="voice-status"
              disabled={askMutation.isPending}
            />
            <button className="voice-button" type="button" onClick={toggleVoice} aria-label={isListening ? "Stop voice input" : "Start voice input"} aria-pressed={isListening}>
              {isListening ? <MicOff size={22} strokeWidth={1.8} /> : <img data-layer="Group 123260" data-node-id="513-4292" src="/513-4292.svg" alt="" />}
            </button>
            {isListening && <span className="listening-pill">Listening…</span>}
          </div>
          <button className="send-button" data-layer="White BG" data-node-id="513-4271" type="submit" disabled={!question.trim() || askMutation.isPending}>
            {askMutation.isPending ? <><Loader2 className="spin" size={20} /> THINKING</> : "SEND"}
          </button>
        </form>

        <p id="voice-status" className={`voice-status ${voiceMessage ? "visible" : ""}`} role="status">{voiceMessage || (isListening ? "Speak naturally; your words will appear above." : "")}</p>

        {askMutation.isError && (
          <div className="answer-card error-card" role="alert"><AlertCircle size={18} /><span>We could not complete that answer right now. Please try again with the same question.</span></div>
        )}

        {answer && (
          <article className="answer-card" aria-live="polite">
            <div className="answer-heading"><Sparkles size={17} /><span>AI Imam’s response</span></div>
            <p>{answer.text}</p>
            <div className="sources-heading"><BookOpen size={15} /> Sources</div>
            <ul>{answer.sources.map(source => <li key={source}>{source}</li>)}</ul>
            <p className="scholar-note">For complex, sensitive, or personal matters, please verify this guidance with a qualified scholar.</p>
          </article>
        )}

        <a className="donation-prompt" href="#support" data-layer="Please click here to donate and support our cause." data-node-id="513-4329">
          <span className="donation-badge" data-node-id="513-4371"><img data-layer="icons 9" data-node-id="513-4330" src="/513-4330.webp" alt="" /></span>
          <span>Please click here to<br /><strong>donate and support</strong> our cause.</span>
        </a>
        <span id="support" className="sr-only">Thank you for supporting Bisme Radio.</span>
      </section>
    </main>
  );
}
