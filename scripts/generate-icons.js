// Generates favicon and app icon sizes from a source image.
// Prefers public/favicon.png; falls back to src/assets/asifrasool-logo.png.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = process.cwd();
const pubDir = path.join(root, 'public');
const srcDir = path.join(root, 'src', 'assets');

const candidates = [
  path.join(pubDir, 'favicon-source.svg'),
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

// Padding per size to maximize legibility at tiny sizes
const PAD_DEFAULT = 0.06;
const PAD_BY_SIZE = new Map([
  [16, 0.02],
  [32, 0.04],
  [180, 0.06],
]);

// Dark brand background used to fill the outer canvas so no white rim appears
const DARK_BG = { r: 11, g: 45, b: 79, alpha: 1 }; // #0b2d4f

async function main() {
  const meta = await sharp(input).metadata();
  const hasAlpha = Boolean(meta.hasAlpha);

  for (const { name, size } of outputs) {
    // Always use dark background to the canvas edge for consistent dark favicon
    // (the source may have its own background too; this avoids a white border from padding)
    const bg = DARK_BG;
    const pad = PAD_BY_SIZE.get(size) ?? PAD_DEFAULT;
    const inner = Math.round(size * (1 - pad * 2));

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

  // Build multi-size ICO for broad compatibility
  const icoPath = path.join(pubDir, 'favicon.ico');
  const icoBuf = await pngToIco([
    path.join(pubDir, 'favicon-16x16.png'),
    path.join(pubDir, 'favicon-32x32.png'),
  ]);
  fs.writeFileSync(icoPath, icoBuf);
  console.log('Wrote', path.relative(root, icoPath));

  console.log('Icon generation complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
