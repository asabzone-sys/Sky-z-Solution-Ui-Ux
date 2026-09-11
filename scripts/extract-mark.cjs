const sharp = require('sharp');
const fs = require('fs');
const SRC = 'C:/Users/asabs/Downloads/ChatGPT Image Sep 11, 2026, 11_22_24 PM.png';

(async () => {
  // The mark occupies roughly the upper-center of the 1536x1024 concept image.
  const region = await sharp(SRC)
    .extract({ left: 560, top: 150, width: 420, height: 390 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = region.info;
  const src = region.data;
  const out = Buffer.alloc(w * h * 4);

  for (let i = 0; i < w * h; i++) {
    const r = src[i * channels], g = src[i * channels + 1], b = src[i * channels + 2];
    // Distance from white → alpha ramp. Colorful mark pixels stay opaque,
    // near-white background fades out smoothly (soft edges, no halo jaggies).
    const dist = 255 - Math.min(r, g, b);
    const soft = Math.max(0, Math.min(1, (dist - 12) / 55)); // smoothstep 12..67
    const a = Math.round(255 * soft * soft * (3 - 2 * soft));
    out[i * 4] = r; out[i * 4 + 1] = g; out[i * 4 + 2] = b; out[i * 4 + 3] = a;
  }

  const trimmed = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .trim()
    .png()
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  fs.mkdirSync('public', { recursive: true });
  await sharp(trimmed).resize(384, 384, { fit: 'inside' }).png({ compressionLevel: 9 }).toFile('public/skyz-mark.png');
  await sharp(trimmed).resize(192, 192, { fit: 'inside' }).webp({ quality: 90 }).toFile('public/skyz-mark.webp');
  await sharp(trimmed).resize(96, 96, { fit: 'inside' }).webp({ quality: 90 }).toFile('public/skyz-mark-96.webp');
  console.log('mark:', meta.width + 'x' + meta.height);
  for (const f of ['skyz-mark.png', 'skyz-mark.webp', 'skyz-mark-96.webp']) {
    console.log(f, fs.statSync('public/' + f).size, 'bytes');
  }
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
