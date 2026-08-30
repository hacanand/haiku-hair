// One-off build tool: pre-renders the copilot's fixed voice lines via Groq's
// Orpheus TTS so the app never pays TTS latency/cost at runtime — it just
// plays a static file from /public/audio. Re-run this only if the scripts
// below change. Needs GROQ_API_KEY in the environment.
//
// Usage: node --env-file=.env scripts/generate-tts.mjs

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("GROQ_API_KEY missing in env");
  process.exit(1);
}

const VOICE = "autumn";
const MODEL = "canopylabs/orpheus-v1-english";

const LINES = {
  welcome:
    "Namaste! Main aapki thodi si madad karungi is intake form ko bharne mein, kabhi bol kar, kabhi bas tap karke. Bas do minute lagenge. Shuru karein?",
  "beat-a":
    "Bataiye, hair loss kab shuru hua tha, umar kitni thi tab, aur kitne time se chal raha hai? Aur family mein kisi ko, jaise papa, mummy ya bhai-behen ko, aisi hi problem rahi hai?",
  "beat-b":
    "Pichhle 6 mahine mein kuch aisa hua jo bataana zaroori ho, bahut stress, weight loss, bukhaar ya koi illness, surgery, ya kahin shift hona?",
  "beat-c":
    "Ab apni roz ki routine bataiye, smoking ya alcohol lete hain? Paani hard hai ghar ka? Baal kitni baar dhote hain? Aur koi salon treatment jaise keratin ya rebonding karwaya hai?",
  "beat-d":
    "Kya kisi purane treatment se koi side effect hua, ya wo aapke liye kaam nahi kiya? Apne shabdon mein bataiye.",
  done: "Bahut badhiya! Aapki saari details doctor ke paas pahunch gayi hain. Consultation mein milte hain!",
};

const outDir = path.join(process.cwd(), "public", "audio");
await mkdir(outDir, { recursive: true });

for (const [name, text] of Object.entries(LINES)) {
  process.stdout.write(`Generating ${name}... `);
  const res = await fetch("https://api.groq.com/openai/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: text,
      voice: VOICE,
      response_format: "wav",
    }),
  });
  if (!res.ok) {
    console.error(`FAILED (${res.status}): ${await res.text()}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(outDir, `${name}.wav`), buf);
  console.log(`${(buf.length / 1024).toFixed(0)}kb`);
}
