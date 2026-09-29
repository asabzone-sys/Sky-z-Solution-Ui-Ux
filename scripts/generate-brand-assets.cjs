/**
 * Regenerates ALL web brand assets from the master logo files.
 *
 * Masters (huge, 40MP — never shipped to the web, see /brand-masters):
 *   C:/Users/asabs/Downloads/KY Z.png      lockup artwork on black
 *   C:/Users/asabs/Downloads/KY Z (1).png  the SAME artwork on white
 *   C:/Users/asabs/Downloads/KY Z (3).png  transparent square mark
 *
 * The artwork is only downsampled (sharp/lanczos) and alpha-recovered —
 * never recolored, redrawn, or distorted.
 *
 * Outputs:
 *   public/skyz-mark.png / .webp            320x384 mark (loader, header)
 *   public/skyz-mark-96.webp                96px mark (loader source set)
 *   public/favicon-96.png, favicon.ico, apple-touch-icon.png
 *   public/brand/lockup-transparent.{png,webp}   full-color transparent lockup (footer)
 *   public/brand/lockup-on-black.{png,webp}      provenance copy (dark bg)
 *   public/brand/lockup-on-white.png             provenance copy (light bg)
 *   public/brand/mark-master.{png,webp}          1024px transparent square mark
 *
 * Key technique — two-matte alpha recovery: the black-bg and white-bg renders
 * are pixel-aligned copies of one artwork. For each pixel pair:
 *   C_black = a*I,  C_white = a*I + (1-a)*255
 *   => a = 1 - (C_white - C_black)/255,  I = C_black / a
 * This recovers the exact artwork (colored mark + grayscale text + AA edges)
 * with no haloing.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DL = 'C:/Users/asabs/Downloads';
const BLACK = path.join(DL, 'KY Z.png');
const WHITE = path.join(DL, 'KY Z (1).png');
const MARK = path.join(DL, 'KY Z (3).png');

const OUT_PUBLIC = 'public';
const OUT_BRAND = path.join(OUT_PUBLIC, 'brand');

async function run() {
  fs.mkdirSync(OUT_BRAND, { recursive: true });

  /* ---------- 1. full-color transparent lockup (two-matte recovery) ---------- */
  const W = 1600;
  const b = await sharp(BLACK).resize({ width: W }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = await sharp(WHITE).resize({ width: W }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: bw, height: bh, channels: bc } = b.info;
  if (bw !== w.info.width || bh !== w.info.height) throw new Error('master alignment mismatch');

  const out = Buffer.alloc(bw * bh * 4);
  for (let i = 0; i < bw * bh; i++) {
    const bi = i * bc, wi = i * w.info.channels;
    // per-channel alpha, averaged for robustness against compression noise
    const aR = 1 - (w.data[wi + 2] - b.data[bi + 2]) / 255;
    const aG = 1 - (w.data[wi + 1] - b.data[bi + 1]) / 255;
    const aB = 1 - (w.data[wi] - b.data[bi]) / 255;
    let a = (aR + aG + aB) / 3;
    a = Math.max(0, Math.min(1, a));
    const A = Math.round(a * 255);
    const inv = 1 / Math.max(a, 0.004);
    out[i * 4]     = Math.min(255, Math.max(0, Math.round(b.data[bi] * inv)));
    out[i * 4 + 1] = Math.min(255, Math.max(0, Math.round(b.data[bi + 1] * inv)));
    out[i * 4 + 2] = Math.min(255, Math.max(0, Math.round(b.data[bi + 2] * inv)));
    out[i * 4 + 3] = A;
  }

  const lockup = sharp(out, { raw: { width: bw, height: bh, channels: 4 } });
  const lockupBuf = await lockup.png().toBuffer();
  await sharp(lockupBuf).webp({ quality: 90 }).toFile(path.join(OUT_BRAND, 'lockup-transparent.webp'));
  await sharp(lockupBuf).toFile(path.join(OUT_BRAND, 'lockup-transparent.png'));

  /* ---------- 2. provenance copies (as-rendered on solid backgrounds) ---------- */
  await sharp(BLACK).resize({ width: 2400 }).png().toFile(path.join(OUT_BRAND, 'lockup-on-black.png'));
  await sharp(BLACK).resize({ width: 2400 }).webp({ quality: 90 }).toFile(path.join(OUT_BRAND, 'lockup-on-black.webp'));
  await sharp(WHITE).resize({ width: 2400 }).png().toFile(path.join(OUT_BRAND, 'lockup-on-white.png'));

  /* ---------- 3. mark assets (transparent square source) ---------- */
  const markBuf = await sharp(MARK).png().toBuffer();
  await sharp(markBuf).resize(1024, 1024, { fit: 'inside' }).png().toFile(path.join(OUT_BRAND, 'mark-master.png'));
  await sharp(markBuf).resize(1024, 1024, { fit: 'inside' }).webp({ quality: 90 }).toFile(path.join(OUT_BRAND, 'mark-master.webp'));

  // site mark: 320x384 canvas (matches the original file's aspect contract)
  await sharp(markBuf)
    .resize(320, 384, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(OUT_PUBLIC, 'skyz-mark.png'));
  await sharp(markBuf)
    .resize(320, 384, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_PUBLIC, 'skyz-mark.webp'));
  await sharp(markBuf).resize(96, 96, { fit: 'inside' }).webp({ quality: 90 }).toFile(path.join(OUT_PUBLIC, 'skyz-mark-96.webp'));

  /* ---------- 4. favicons ---------- */
  await sharp(markBuf).resize(96, 96, { fit: 'inside' }).png().toFile(path.join(OUT_PUBLIC, 'favicon-96.png'));
  await sharp(markBuf).resize(180, 180, { fit: 'inside' }).png().toFile(path.join(OUT_PUBLIC, 'apple-touch-icon.png'));
  await writeIco(path.join(OUT_PUBLIC, 'favicon.ico'), markBuf, [16, 32, 48]);

  console.log('brand assets regenerated.');
}

/* minimal multi-size PNG-format ICO writer */
async function writeIco(outPath, pngSrc, sizes) {
  const frames = [];
  for (const s of sizes) {
    const png = await sharp(pngSrc).resize(s, s, { fit: 'inside' }).png().toBuffer();
    frames.push({ s, png });
  }
  const headerSize = 6 + 16 * frames.length;
  const total = headerSize + frames.reduce((n, f) => n + f.png.length, 0);
  const buf = Buffer.alloc(total);
  buf.writeUInt16LE(0, 0);            // reserved
  buf.writeUInt16LE(1, 2);            // type: icon
  buf.writeUInt16LE(frames.length, 4);
  let offset = headerSize;
  frames.forEach((f, i) => {
    const e = 6 + 16 * i;
    buf[e] = f.s; buf[e + 1] = f.s;   // width/height (0 means 256; all < 256 here)
    buf[e + 2] = 0; buf[e + 3] = 0;   // palette, reserved
    buf.writeUInt16LE(1, e + 4);      // planes
    buf.writeUInt16LE(32, e + 6);     // bpp
    buf.writeUInt32LE(f.png.length, e + 8);
    buf.writeUInt32LE(offset, e + 12);
    offset += f.png.length;
    f.png.copy(buf, offset - f.png.length);
  });
  fs.writeFileSync(outPath, buf);
}

run().catch(e => { console.error('FAIL', e); process.exit(1); });
