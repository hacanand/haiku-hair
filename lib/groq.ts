// Server-only Groq helpers. Import only from app/api/**/route.ts — never
// from client components, since this reads GROQ_API_KEY.
//
// Why raw fetch instead of the groq-sdk package: two OpenAI-compatible REST
// calls (chat completions, audio transcription) don't need a client
// wrapper — fewer deps, full control over the request shape (structured
// outputs, reasoning_effort) and easier to read for a small app.

const GROQ_BASE = "https://api.groq.com/openai/v1";

// gpt-oss-120b: fast, supports strict json_schema structured outputs and
// tunable reasoning effort — kept low here since this is extraction, not
// open-ended reasoning, so we want speed over chain-of-thought depth.
const CHAT_MODEL = "openai/gpt-oss-120b";
const TRANSCRIBE_MODEL = "whisper-large-v3-turbo";

function apiKey() {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set");
  return key;
}

export async function transcribeAudio(file: Blob, filename: string): Promise<string> {
  const form = new FormData();
  form.append("file", file, filename);
  form.append("model", TRANSCRIBE_MODEL);
  form.append("response_format", "json");

  const res = await fetch(`${GROQ_BASE}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}` },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Groq transcription failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { text?: string };
  return data.text?.trim() ?? "";
}

export async function extractStructured(opts: {
  systemPrompt: string;
  transcript: string;
  schemaName: string;
  jsonSchema: Record<string, unknown>;
}): Promise<Record<string, unknown>> {
  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content: `You extract structured intake data from a patient's spoken (Hinglish) answer at a hair & scalp clinic. Only fill a field when it is actually said or a very clear paraphrase — never guess or infer a value that wasn't mentioned; use null (or an empty array) instead. ${opts.systemPrompt}`,
        },
        { role: "user", content: opts.transcript },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: opts.schemaName, strict: true, schema: opts.jsonSchema },
      },
      reasoning_effort: "low",
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq extraction failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq extraction returned no content");
  return JSON.parse(content);
}
