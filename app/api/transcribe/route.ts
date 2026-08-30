import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const audio = form.get("audio");
    if (!(audio instanceof Blob)) {
      return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
    }
    const text = await transcribeAudio(audio, "answer.webm");
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[transcribe] failed", err);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
