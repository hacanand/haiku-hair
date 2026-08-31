import { NextResponse } from "next/server";
import { extractStructured } from "@/lib/groq";
import { BEATS } from "@/lib/beats";
import { sanitizeBeatResult, sanitizeLikelySex } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { beatId, transcript } = (await request.json()) as {
      beatId?: keyof typeof BEATS;
      transcript?: string;
    };

    const beat = beatId ? BEATS[beatId] : undefined;
    if (!beat) {
      return NextResponse.json({ error: "Unknown beatId" }, { status: 400 });
    }
    if (!transcript || !transcript.trim()) {
      return NextResponse.json({ error: "Empty transcript" }, { status: 400 });
    }

    const raw = await extractStructured({
      systemPrompt: beat.systemPrompt,
      transcript,
      schemaName: `beat_${beat.id.toLowerCase()}`,
      jsonSchema: beat.jsonSchema,
    });

    // Defense in depth: even with strict json_schema, coerce to a
    // guaranteed-safe shape before it ever touches client state.
    const result = sanitizeBeatResult(beat.fields, raw);

    // Beat A only — that's the first thing the patient says and the only
    // beat that runs before the sex-gate screen, so it's the only one worth
    // asking Groq for this. Kept separate from `result`: a gender pre-fill
    // signal, never mixed into the chip-rendering field list since it's not
    // a chip — the client only ever uses it to pre-select (never silently
    // commit) the sex-gate card, which the patient still confirms.
    const likely_sex = beat.id === "A" ? sanitizeLikelySex(raw.likely_sex) : null;

    return NextResponse.json({ result, likely_sex });
  } catch (err) {
    console.error("[extract] failed", err);
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 });
  }
}
