# GenoRoot Hair & Scalp Intake

A voice-and-tap copilot that gets a patient through a 16-question hair & scalp
intake before their consultation — talking for the questions that are easiest
to say, tapping for the ones that are easiest to point at, and never a
"chat with a bot" screen.

## How to run it

```bash
npm install
cp .env.example .env      # then fill in the two keys below
npm run dev
```

Open `http://localhost:3000`. Works on a phone on the same network too —
mic recording needs either `localhost` or HTTPS, which `next dev` gives you
locally; the deployed link is HTTPS by default.

Required env vars (`.env`, never committed):

| Key | Used for |
|---|---|
| `GROQ_API_KEY` | speech-to-text, structured extraction, and the pre-rendered voice prompts |
| `UPLOADCARE_PUBLIC_API_KEY` / `UPLOADCARE_SECRET_API_KEY` | reserved — see "Bought vs built" below |

The four voice-prompt audio clips are **pre-rendered**, not fetched live —
see `scripts/generate-tts.mjs` if you ever change the prompt scripts and need
to regenerate `public/audio/*.wav`.

## The shape of the flow

One continuous vertical flow, not two apps stitched together. The patient
never picks a mode — the screen underneath them just reshapes per question:

- **4 voice beats** (Sections A hair story, C10 life changes, C11 routine,
  D14 past treatment) — speak, get back editable chips, confirm, continue.
- **9 tap screens** for the rest (Q5–9, 12–13, 15–16) — big touch targets,
  illustrated where an illustration earns its place (conditions, sample
  type, pattern, past-6-months events), a fast per-row wizard for the two
  product/procedure tables instead of one long scrolling grid.
- **One review screen** at the end with a **Form view / Data view** toggle —
  the only legitimate second "mode" in the whole app, because it's two ways
  of looking at the *finished* result, not two ways of answering. Tap any
  row to jump back and fix it, then continue lands you back on review.
- Progress bar, back button and the primary CTA sit in the same place on
  every single screen.

Answers persist to `localStorage` (Zustand + `persist`) so a patient who gets
interrupted mid-form — a call, a dropped signal, closing the tab by
accident — picks up exactly where they left off.

## Your choices

**Models & services**

- **Groq `whisper-large-v3-turbo`** for transcription. Fast enough that the
  "Samajh rahe hain…" spinner is genuinely brief, and handles Hinglish
  code-switching (Hindi + English in the same sentence) well out of the box.
- **Groq `openai/gpt-oss-120b`** for extraction, called with
  `response_format: json_schema` (strict) and `reasoning_effort: "low"`. The
  strict schema means the model literally cannot return a value outside the
  form's own enums — no "PCOS" vs "PCOS/PCOD" drift to clean up later — and
  low reasoning effort keeps latency down since this is constrained
  extraction, not open-ended reasoning. See `lib/beats.ts` for the four
  per-beat schemas and `lib/groq.ts` for the call.
- **Groq `canopylabs/orpheus-v1-english`** (voice "autumn") for the
  copilot's spoken prompts — **pre-rendered once** at build time
  (`scripts/generate-tts.mjs`) into `public/audio/*.wav` rather than called
  per patient. That turns a ~5–7s TTS round trip into an instant local file
  play, at zero per-visit cost and zero runtime dependency on the TTS API.
  Falls back to the browser's built-in `SpeechSynthesis` if a clip ever
  fails to load.
- **Zustand + `persist`** for state, not React context or prop drilling —
  the intake is one long-lived state machine (16 questions, conditional
  steps, jump-back-to-edit) and `persist(localStorage)` gets "resume where
  I left off" for free.
- **Zod, schema-derived from `take-home-assignment.json` itself**
  (`lib/validation.ts`) rather than a hand-written parallel schema. The
  validator is *built by walking the JSON file's own `type`/`options`
  fields*, so it can't quietly drift from the graded schema — see "How you
  tested the fill" below.

**Bought vs built**

- Bought: Groq for STT/LLM/TTS (all three off one key, one bill, one very
  fast provider — didn't stand up a separate transcription service or pay
  for a dedicated TTS vendor).
- Built: the chip/sheet interaction system, the per-row product/procedure
  wizard, the review screen, and the JSON-schema-derived validator — these
  are the actual product, so they're first-party.
- **Uploadcare key provided but not wired in**: the brief's illustrations
  already ship as local files in `public/images/` (one per condition,
  pattern, sample type, etc. — see `lib/schema.ts`'s image maps), served
  and optimized by `next/image` with zero network dependency. Routing them
  through Uploadcare first would add a network hop and a second point of
  failure for no visible benefit at this scale, so I left the key
  configured but unused rather than force an integration that doesn't earn
  its place. With more images or user-uploaded photos, Uploadcare's
  transform-on-the-fly CDN would be the right call.

## How you tested the fill

1. **Schema-derived validation, not a parallel copy.** `lib/validation.ts`
   walks `take-home-assignment.json` at runtime and builds a Zod schema
   directly from each question's declared `type`/`options` — so "does the
   answer match the graded form" is a checked fact on the review screen
   (look for the "Validated against the clinic's schema" badge), not
   something I eyeballed once and hoped stayed true.
2. **Defense in depth on extraction.** Even though Groq's structured output
   is schema-constrained, `/api/extract` runs the response through
   `sanitizeBeatResult()` field-by-field before it ever reaches client
   state — any unexpected value is coerced to `null`/`[]` rather than
   corrupting the form.
3. **Manual voice-beat testing** with scripted Hinglish sentences per beat
   (age/duration/family history in one breath, "kuch nahi" for the
   life-changes beat, a smoking+salon combo for the routine beat) checked
   against the chips that came back, including the deliberately-not-said
   fields staying dashed instead of being guessed.
4. **`Data view` on the review screen** doubles as a manual test surface —
   the exact JSON that would be submitted is one tap away at any point, so
   a mismatch is visible immediately instead of hidden behind a form UI.
5. `next build` + `tsc --noEmit` + `eslint` clean as a baseline; this
   sandbox couldn't run a full browser click-through (no system Chromium
   libs, no root) — see below.

## What I'd improve with one more week

- **Real browser + device QA.** I verified the API layer end-to-end (real
  Groq calls through the actual Next.js routes) and read every component
  path closely, but this sandbox had no way to launch a real browser, so I
  never got a visual pass on a real phone. That's the first thing I'd do.
- **Deep-link review edits to the exact row**, not just the step — jumping
  back to fix one product in a 5-row table currently restarts that table's
  wizard from row 1.
- **Barge-in on the voice prompts** — let the patient start talking over
  the prompt audio instead of waiting for it to finish.
- **A nurse-facing "flagged for follow-up" pass** — e.g. auto-flag sudden
  shedding + recent fever, or PCOS + irregular cycle, as a one-line note
  for the doctor, since the brief explicitly asks for a *complete, accurate
  picture*, not just complete data.
- **Real submission target.** Right now "Submit" finalizes local state and
  moves to the done screen; a real deploy needs an endpoint (or EMR
  webhook) to actually deliver the JSON to the clinic.
