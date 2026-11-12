# AI Imam — implementation plan

## Product scope
AI Imam is a mobile-first, interactive Q&A experience for asking Islamic questions in any language by text or supported browser voice recognition. It presents respectful, clearly sourced answers grounded in the Quran, Sahih Hadith, and Sharia law, with a persistent reminder to verify sensitive or complex matters with a qualified scholar.

## Design direction
The supplied Figma frame is the approved visual reference, so no alternate style exploration is needed.

- **Design Movement:** Editorial Islamic radio landing page with warm paper-like calm and high-contrast green/gold accents.
- **Core Principles:** Faithful proportions, generous breathing room, legible centered typography, and restrained interaction feedback that never overwhelms the source layout.
- **Color Philosophy:** Cream creates a welcoming study-room atmosphere; deep green signals trust and spiritual grounding; gold marks actions and listening.
- **Layout Paradigm:** A narrow, centered single-column mobile canvas that preserves the 390×844 composition while expanding gracefully on larger screens.
- **Signature Elements:** Bisme Radio logo lockup, gold-outlined question field with mic control, and deep-green pill CTA with gold lettering.
- **Interaction Philosophy:** Text and voice input feel like one calm invitation; loading and answer states appear inline without moving the core form unexpectedly.
- **Animation:** Subtle mic pulse while listening, gentle answer reveal, and no decorative motion that competes with reading.
- **Typography System:** Inter throughout; 23px bold green headings, 15px medium body copy, and 20px semibold gold CTA label, matching the reference.
- **Brand Essence:** A respectful first stop for everyday Islamic learning, for curious Muslims seeking accessible answers; grounded, warm, practical.
- **Brand Voice:** Headlines are direct and reassuring; CTAs are simple and inviting. Example lines: “Ask Imam Now” and “Bring your question, in any language.”
- **Wordmark & Logo:** Preserve the supplied Bisme Radio artwork as the visual anchor rather than replacing it with text-only branding.
- **Signature Brand Color:** Deep radio green `#005a3c`, paired with gold `#d9a928`.

## Implementation approach
- Run the supplied `setup-figma.py` to copy all exported assets and the original JSX into the React page, then refactor only the layout wrappers and interactive affordances needed for responsive behavior.
- Keep all supplied copy and local asset references; add semantic form controls, accessible labels, and responsive CSS around the source composition.
- Implement speech recognition with the browser Web Speech API when available, including a clear unsupported-browser fallback.
- Implement the answer request through the server-side AI service so credentials never reach the browser. The server prompt will require Quran, Sahih Hadith, and Sharia grounding, source citations, respectful uncertainty, and scholar verification guidance; the client will show a stable fallback message if the service is unavailable.
- Serve `/manus-routes.json` with the root route declaration and set project logo metadata.

## Project structure
- `client/src/pages/Home.tsx`: main Figma-faithful Q&A experience and interaction state.
- `client/src/index.css`: visual system, responsive layout, input/button states, and answer styling.
- `client/index.html`: Inter font loading and page metadata.
- `server/routers.ts`: public `imam.ask` procedure that calls the managed LLM endpoint.
- `public/`: exported Figma assets and route manifest.
- `plan.md`, `TODO.md`: approved product/design plan and outcome tracking.
