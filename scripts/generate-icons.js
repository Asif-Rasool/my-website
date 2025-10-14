// Generates favicon and app icon sizes from a source image.
// Prefers public/favicon.png; falls back to src/assets/asifrasool-logo.png.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const pubDir = path.join(root, 'public');
const srcDir = path.join(root, 'src', 'assets');

const candidates = [
  path.join(pubDir, 'favicon-source.png'),
  path.join(pubDir, 'favicon.png'),
  path.join(srcDir, 'asifrasool-logo.png'),
];

const input = candidates.find((p) => fs.existsSync(p));
if (!input) {
  console.error('No source image found. Place one of:', candidates.join(', '));
  process.exit(1);
}

if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

const outputs = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'favicon.png', size: 512 },
];

const PAD = 0.08; // 8% safe area padding for maskable shapes

async function main() {
  const meta = await sharp(input).metadata();
  const hasAlpha = Boolean(meta.hasAlpha);

  for (const { name, size } of outputs) {
    const bg = hasAlpha ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 };
    const inner = Math.round(size * (1 - PAD * 2));

    // Create square canvas and place contained logo with padding
    const canvas = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bg,
      },
    });

    const logo = await sharp(input)
      .resize(inner, inner, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const topLeft = Math.round((size - inner) / 2);
    const outPath = path.join(pubDir, name);
    await canvas.composite([{ input: logo, top: topLeft, left: topLeft }]).png({ compressionLevel: 9 }).toFile(outPath);
    console.log('Wrote', path.relative(root, outPath));
  }

  console.log('Icon generation complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

