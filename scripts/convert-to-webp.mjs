#!/usr/bin/env node
/**
 * Convert all JPEG assets to WebP with quality optimization.
 * Keeps originals, creates .webp siblings.
 * Resizes large images to max 1920px width for web performance.
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const ASSETS_DIR = new URL('../public/assets', import.meta.url).pathname;
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(fullPath);
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      yield fullPath;
    }
  }
}

async function convertFile(filePath) {
  const outPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
  const name = basename(filePath);

  try {
    const metadata = await sharp(filePath).metadata();
    let pipeline = sharp(filePath);

    // Resize if wider than MAX_WIDTH
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    await pipeline
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outPath);

    const origSize = (await stat(filePath)).size;
    const newSize = (await stat(outPath)).size;
    const savings = ((1 - newSize / origSize) * 100).toFixed(1);

    console.log(
      `✓ ${name} → .webp | ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% saved)`
    );
    return { origSize, newSize };
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`);
    return { origSize: 0, newSize: 0 };
  }
}

async function main() {
  console.log(`\n🔄 Converting JPEG/PNG → WebP (quality: ${WEBP_QUALITY}, max-width: ${MAX_WIDTH}px)\n`);
  console.log(`📂 Source: ${ASSETS_DIR}\n`);

  let totalOrig = 0;
  let totalNew = 0;
  let count = 0;

  for await (const filePath of walkDir(ASSETS_DIR)) {
    const result = await convertFile(filePath);
    totalOrig += result.origSize;
    totalNew += result.newSize;
    count++;
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Total: ${count} files converted`);
  console.log(`   Original: ${(totalOrig / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`   WebP:     ${(totalNew / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`   Saved:    ${((1 - totalNew / totalOrig) * 100).toFixed(1)}%`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main();
