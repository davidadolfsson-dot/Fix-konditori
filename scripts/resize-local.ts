import sharp from "sharp";

const INPUT = "public/raksmorgas_full.jpg";
const OUTPUT = "public/raksmorgas.jpg";
const TARGET_WIDTH = 600;

const resized = await sharp(INPUT)
  .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
  .jpeg({ quality: 82 })
  .toFile(OUTPUT);

console.log(`Resized: ${(resized.size / 1024).toFixed(0)} KB`);
