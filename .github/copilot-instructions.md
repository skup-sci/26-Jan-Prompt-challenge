# Copilot / AI Agent Instructions — Multilingual Mandi

This file contains concise, actionable knowledge for an AI coding agent to be productive in this repository.

Keep changes small, preserve existing patterns, and run the dev checks described below after edits.

## Big picture (what this repo is)
- React + TypeScript single-page app (create-react-app + react-app-rewired).
- Voice-first UI for local mandi vendors: primary interaction is a large circular microphone.
- Key areas:
  - `src/components` — UI components (notably `VoiceInterface.tsx`, `LanguageSelector.tsx`).
  - `src/hooks` — reusable hooks: `useVoiceRecognition.ts`, `useSpeechSynthesis.ts`, `useLocalization.ts`.
  - `src/services` — app services and business logic: `LocalizationService.ts`, `TranslationService.ts`, `NegotiationService.ts`, `SessionManager.tsx`.
  - `src/tests` — property-based tests (fast-check) and unit tests.

## Developer workflows / commands
- Install: `npm install` (run from repo root)
- Start dev server: `npm start` (uses `react-app-rewired`)
- Build: `npm run build`
- Test: `npm test` (Jest configured; note `transformIgnorePatterns` for `fast-check`)

Note: Use Chrome for manual testing of Web Speech APIs (SpeechRecognition & speechSynthesis). Browser voices load async — check `speechSynthesis.getVoices()`.

## Important conventions & patterns
- Localization: use `useLocalization()` hook and `t('key')` for all visible text. Add keys in `src/services/LocalizationService.ts` and update README localization docs under `src/services/README_LOCALIZATION.md`.
- Voice flow state machine is centralized in `VoiceInterface.tsx` (states: `idle`, `listening`, `processing`, `responding`, `error`). Keep state transitions predictable and driven by hooks (`useVoiceRecognition`, `useSpeechSynthesis`).
- Hooks should be single-responsibility and return immutable callback handles. Avoid re-calling hooks twice — destructure and reuse returned handlers.
- Accessibility: text state must include `aria-live="polite"` and primary controls must be keyboard-focusable. Respect `prefers-reduced-motion` where animations are present.

## Integration points & external dependencies
- Web Speech API (browser) — used in `useVoiceRecognition.ts` and `useSpeechSynthesis.ts`.
- Optional cloud services (not implemented): TTS/STT providers (OpenAI TTS, Google WaveNet). If adding cloud TTS, create a server-side endpoint (e.g., `server/api/tts`) — never embed API keys in client code.
- Google Cloud Translate library is present as a dependency but the repo uses a mock translation layer in `TranslationService.ts` (see comments). For production, move heavy APIs to a backend service.

## Quick debugging tips
- If recognition fails, open DevTools console; check `window.SpeechRecognition` or `window.webkitSpeechRecognition` availability.
- For TTS, inspect `speechSynthesis.getVoices()`; voices may be empty until `onvoiceschanged` fires.
- Common local dev pitfalls: `node_modules` may need fresh install when native libs change. Use `npm cache clean --force` then `rm -r node_modules && npm install` if packages appear corrupted.

## Testing, Mocks & Project-specific patterns
- Tests: Unit tests use Jest + React Testing Library; property tests use `fast-check` (see `src/tests/*`). Jest is configured in `package.json` with `transformIgnorePatterns` to allow `fast-check` to be processed.
- Voice flow testing: Mock browser APIs in tests: stub `window.SpeechRecognition`/`webkitSpeechRecognition` and `window.speechSynthesis`. The hooks expose small, testable primitives (`useVoiceRecognition` returns `startListening/stopListening` & `transcript`; `useSpeechSynthesis.speak()` returns a Promise that resolves on end) — assert state transitions in `VoiceInterface` and await `speak()` where needed.
- Translation & caching: `TranslationService` uses mock translations by default and preserves commercial terms. Results are cached in `localStorage` under `mandi_translation_cache` (LRU-like eviction at `MAX_CACHE_SIZE`). The service logs a warning if translation exceeds ~2s — add tests that assert timeout/logging if you change timing behavior.
- Adding languages: Update three places when adding a language:
  1. `SUPPORTED_LANGUAGES` in `src/services/TranslationService.ts`
  2. `UI_TRANSLATIONS` in `src/services/LocalizationService.ts` (add keys and translated strings)
  3. (Optional) add phrase mappings in `mockTranslation` for better dev UX
- Preservation rules: When adding domain-specific terms (units, commodity names), update `COMMERCIAL_TERMS` in `TranslationService.ts` so they are preserved across translations.
- Local dev notes: Use Chrome when testing speech APIs (voices may load asynchronously — `speechSynthesis.onvoiceschanged` is handled in `useSpeechSynthesis`). For flaky voice tests, stub `onvoiceschanged` and provide deterministic voices.

## Small concrete examples (copy-ready)

- Map UI language to recognition/TTS locale (pattern used in `VoiceInterface.tsx`):
```ts
const langToLocale = (code: string | undefined) => code?.startsWith('hi') ? 'hi-IN' : 'en-IN';
recognition.setLanguage(langToLocale(currentLanguage));
```

- Choose a cloud TTS flow (server-side):
  - server: `POST /api/tts` -> call provider (WaveNet/OpenAI) -> return audio blob
  - client: fetch blob -> `const url = URL.createObjectURL(blob); new Audio(url).play();`

## File signposts (where to look first)
- `src/components/VoiceInterface.tsx` — primary mic UI, state machine, and `speak`/listen integration
- `src/hooks/useVoiceRecognition.ts` — STT lifecycle, `setLanguage`, and error handling
- `src/hooks/useSpeechSynthesis.ts` — `speak()` returns a Promise; voice selection and `onvoiceschanged` handling
- `src/services/TranslationService.ts` — translation, mock flow, `COMMERCIAL_TERMS`, cache (`mandi_translation_cache`)
- `src/services/LocalizationService.ts` — UI keys; add new keys here when changing visible text
- `src/services/NegotiationService.ts` & `src/services/PriceDiscoveryService.ts` — domain logic for negotiation templates and price parsing
- `src/tests/VoiceInterface.property.test.ts` — property-driven tests to follow as examples

**Tip:** Search for `mock` and `TODO` to find intentional dev shortcuts and places that must be replaced for production.

## Safety & privacy guidance for agents
- Never add secrets or API keys to client/source files. Any external API key must be configured on a server and read from process env.
- If proposing cloud TTS/STT integration, include an opt-in consent UI and a short privacy text before enabling.

## Editing style for AI agents
- Make minimal, incremental PRs. Each PR should:
  1. Explain behavioral changes in the PR description (voice text, state transitions).
  2. Include a short smoke test: which UI flows to verify locally.
  3. Add/modify localization keys when any visible text changes.

**PR checklist for AI agents:**
- Run `npm test` and include/coordinate property tests when changing logic that affects many inputs.
- Run the app (`npm start`) in Chrome and perform a short manual smoke test for voice/TTS flows (verify `speak()`/`startListening()` interactions).
- Update `src/services/LocalizationService.ts` and `README_LOCALIZATION.md` for visible text changes.
- Add or update unit/property tests (`src/tests/*`) for the behavior and include mock stubs for `SpeechRecognition` / `speechSynthesis` when applicable.
- Do not add secrets or API keys to client source files; add server endpoints and request env/config approval if needed.

## When to ask the human
- If a change needs a new external service (cloud TTS/STT) or billing access.
- If you must add a persistent backend (create `server/`), confirm hosting and secrets strategy.

---
If anything above is unclear or you want examples expanded (tests, a sample server endpoint for TTS, or an E2E test skeleton), say which area and I will add a short implementation next.
