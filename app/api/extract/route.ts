import { NextResponse } from "next/server";
import { extractStructured } from "@/lib/groq";
import { BEATS } from "@/lib/beats";
import { sanitizeBeatResult } from "@/lib/validation";

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

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[extract] failed", err);
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 });
  }
}
