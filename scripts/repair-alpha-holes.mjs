// The actual bug behind the "white dots/patches": these cutout PNGs were
// background-removed by some automated matting pass that, in busy areas
// like overlapping hair strands, punched small fully-transparent holes
// *inside* what should be solid hair — not a soft edge, a hard alpha=0
// island fully enclosed by opaque pixels. On a white page that's invisible;
// on any other background it renders as jagged white confetti.
//
// Fix, per image:
//  1. Flood-fill "background-ish" pixels (alpha < threshold) inward from the
//     four borders — that reaches only the *real* background.
//  2. Any background-ish pixel the flood-fill never reached is a spurious
//     enclosed hole. Multi-source BFS out from the real foreground fills
//     each hole with its nearest foreground pixel's colour and alpha=255.
//  3. Then decontaminate the true foreground/background edge (the normal,
//     legitimate soft antialiased silhouette) against an assumed white
//     matte, so it doesn't carry a white tint onto a non-white page either.
//
// Usage: node scripts/repair-alpha-holes.mjs [file1.png file2.png ...]
//        (no args = every RGBA PNG under public/images)

import sharp from "sharp";
import { readdir, rename } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "images");
const FG_THRESHOLD = 128;
const BG = 255; // assumed original matte colour for edge decontamination
const ALPHA_FLOOR = 6;

function repairHoles(data, info) {
  const { width, height, channels } = info;
  const total = width * height;
  const isFg = new Uint8Array(total);
  for (let i = 0; i < total; i++) isFg[i] = data[i * channels + 3] >= FG_THRESHOLD ? 1 : 0;

  const idx = (x, y) => y * width + x;
  const neighborsOf = (i) => {
    const x = i % width;
    const y = (i / width) | 0;
    const out = [];
    if (x > 0) out.push(i - 1);
    if (x < width - 1) out.push(i + 1);
    if (y > 0) out.push(i - width);
    if (y < height - 1) out.push(i + width);
    return out;
  };

  // Step 1: border flood-fill through non-foreground pixels -> "true background"
  const trueBg = new Uint8Array(total);
  const q1 = new Int32Array(total);
  let h1 = 0,
    t1 = 0;
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const i = idx(x, y);
      if (!isFg[i] && !trueBg[i]) {
        trueBg[i] = 1;
        q1[t1++] = i;
      }
    }
  }
  for (let y = 0; y < height; y++) {
    for (const x of [0, width - 1]) {
      const i = idx(x, y);
      if (!isFg[i] && !trueBg[i]) {
        trueBg[i] = 1;
        q1[t1++] = i;
      }
    }
  }
  while (h1 < t1) {
    const i = q1[h1++];
    for (const n of neighborsOf(i)) {
      if (!isFg[n] && !trueBg[n]) {
        trueBg[n] = 1;
        q1[t1++] = n;
      }
    }
  }

  // Step 2/3: multi-source BFS from real foreground, filling only holes
  // (non-foreground, non-true-background) with the nearest source colour.
  const filled = new Uint8Array(total);
  const q2 = new Int32Array(total);
  let h2 = 0,
    t2 = 0;
  let holeCount = 0;
  for (let i = 0; i < total; i++) {
    if (isFg[i]) {
      filled[i] = 1;
      q2[t2++] = i;
    } else if (!trueBg[i]) {
      holeCount++;
    }
  }
  while (h2 < t2) {
    const i = q2[h2++];
    const ci = i * channels;
    for (const n of neighborsOf(i)) {
      if (!filled[n] && !trueBg[n] && !isFg[n]) {
        const cn = n * channels;
        data[cn] = data[ci];
        data[cn + 1] = data[ci + 1];
        data[cn + 2] = data[ci + 2];
        data[cn + 3] = 255;
        filled[n] = 1;
        q2[t2++] = n;
      }
    }
  }
  return holeCount;
}

function decontaminateEdges(data, info) {
  const { width, height, channels } = info;
  const total = width * height;
  for (let i = 0; i < total; i++) {
    const base = i * channels;
    const a = data[base + 3];
    if (a === 255 || a <= ALPHA_FLOOR) continue;
    const aNorm = a / 255;
    for (let c = 0; c < 3; c++) {
      const blended = data[base + c];
      let original = (blended - BG * (1 - aNorm)) / aNorm;
      original = Math.max(0, Math.min(255, Math.round(original)));
      data[base + c] = original;
    }
  }
}

async function processFile(filePath) {
  const img = sharp(filePath);
  const meta = await img.metadata();
  if (!meta.hasAlpha) {
    console.log(`skip (no alpha): ${path.basename(filePath)}`);
    return;
  }
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  if (info.channels < 4) {
    console.log(`skip (unexpected channels): ${path.basename(filePath)}`);
    return;
  }
  const holeCount = repairHoles(data, info);
  decontaminateEdges(data, info);
  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toFile(filePath + ".tmp");
  await rename(filePath + ".tmp", filePath);
  const pct = ((100 * holeCount) / (info.width * info.height)).toFixed(2);
  console.log(`repaired: ${path.basename(filePath)} (filled ${holeCount}px holes, ${pct}%)`);
}

const argFiles = process.argv.slice(2);
const targets = argFiles.length
  ? argFiles.map((f) => path.join(DIR, f))
  : (await readdir(DIR)).filter((f) => f.endsWith(".png")).map((f) => path.join(DIR, f));

for (const file of targets) {
  await processFile(file);
}
