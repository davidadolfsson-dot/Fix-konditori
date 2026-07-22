import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SOURCE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/a/aa/Stor_r%C3%A4ksm%C3%B6rg%C3%A5s_p%C3%A5_M%C3%B6ssebergsg%C3%A5rden_2591.jpg";
const OUTPUT_PATH = "public/raksmorgas.jpg";
const TARGET_WIDTH = 600;

async function main() {
  console.log("Downloading...");
  const res = await fetch(SOURCE_URL, {
    headers: { "User-Agent": "FixKonditoriWebsite/1.0" },
  });
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(`Downloaded ${(buf.length / 1024 / 1024).toFixed(1)} MB`);

  console.log(`Resizing to ${TARGET_WIDTH}px wide...`);
  const resized = await sharp(buf)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  writeFileSync(OUTPUT_PATH, resized);
  console.log(
    `Saved ${OUTPUT_PATH} (${(resized.length / 1024).toFixed(1)} KB)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
