import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "../public/icons");

const outputs = [
  { input: "icon.svg", output: "favicon-32.png", size: 32 },
  { input: "icon.svg", output: "icon-192.png", size: 192 },
  { input: "icon.svg", output: "apple-touch-icon.png", size: 180 },
  { input: "icon.svg", output: "icon-512.png", size: 512 },
  { input: "icon-maskable.svg", output: "icon-maskable-512.png", size: 512 },
];

for (const { input, output, size } of outputs) {
  const svg = await readFile(join(iconsDir, input));
  const png = await sharp(svg).resize(size, size).png().toBuffer();
  await writeFile(join(iconsDir, output), png);
  console.log(`✓ ${output} (${size}×${size})`);
}

// 浏览器标签页用 SVG favicon
await writeFile(join(iconsDir, "../favicon.svg"), await readFile(join(iconsDir, "icon.svg")));
console.log("✓ favicon.svg");
