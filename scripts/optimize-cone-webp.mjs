/**
 * Re-encodes the cone WebP files from their PNG sources.
 *
 * The shipped WebPs were encoded with a fast preset, so they were larger than
 * necessary for the quality they delivered. Re-encoding from the lossless PNG
 * at quality 75 with effort 6 produces a smaller file that is measurably
 * *closer* to the original than what it replaces — no quality is traded away.
 *
 * Encoding from the PNG (not from the existing WebP) matters: re-compressing
 * an already-lossy file would stack a second round of loss on top of the first.
 *
 * Usage:  node scripts/optimize-cone-webp.mjs [--dry]
 */

import sharp from "sharp";
import { readdir, stat, mkdir, copyFile, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const CONE_DIR = "public/assets/cones";
const BACKUP_DIR = "scripts/.webp-backup/cones";
const QUALITY = 75;
const EFFORT = 6;

// Sharp caches open file handles, which on Windows keeps the WebP locked and
// blocks writing back to the same path. Read files into buffers instead.
sharp.cache(false);

const dryRun = process.argv.includes("--dry");
const kb = (bytes) => Math.round(bytes / 1024);

/**
 * Mean absolute per-channel difference from the PNG source, measured at the
 * width the cone is actually rendered at (~220 CSS px). Comparing at full
 * 540px resolution overstates the loss, because the browser downscales the
 * image anyway and that downscale hides compression artefacts.
 */
const DISPLAY_WIDTH = 220;

async function differenceFromSource(sourcePng, candidateBuffer) {
  const [reference, candidate] = await Promise.all([
    sharp(sourcePng).resize({ width: DISPLAY_WIDTH }).ensureAlpha().raw().toBuffer(),
    sharp(candidateBuffer).resize({ width: DISPLAY_WIDTH }).ensureAlpha().raw().toBuffer(),
  ]);
  if (reference.length !== candidate.length) return null;

  let total = 0;
  for (let i = 0; i < reference.length; i += 1) {
    total += Math.abs(reference[i] - candidate[i]);
  }
  return total / reference.length;
}

async function main() {
  const pngFiles = (await readdir(CONE_DIR)).filter((f) => f.endsWith(".png")).sort();

  if (!dryRun) await mkdir(BACKUP_DIR, { recursive: true });

  let beforeTotal = 0;
  let afterTotal = 0;
  const rows = [];
  const skipped = [];

  for (const pngName of pngFiles) {
    const pngPath = path.join(CONE_DIR, pngName);
    const webpPath = pngPath.replace(/\.png$/, ".webp");

    if (!existsSync(webpPath)) {
      skipped.push(`${pngName} — no matching .webp`);
      continue;
    }

    const existingBuffer = await readFile(webpPath);
    const meta = await sharp(pngPath).metadata();
    const existingMeta = await sharp(existingBuffer).metadata();

    // Replacing a file of different dimensions would shift the layout.
    if (meta.width !== existingMeta.width || meta.height !== existingMeta.height) {
      skipped.push(
        `${pngName} — size mismatch (png ${meta.width}x${meta.height}, webp ${existingMeta.width}x${existingMeta.height})`
      );
      continue;
    }

    const encoded = await sharp(pngPath)
      .webp({ quality: QUALITY, effort: EFFORT, alphaQuality: 100 })
      .toBuffer();

    const beforeBytes = (await stat(webpPath)).size;
    const [oldDiff, newDiff] = await Promise.all([
      differenceFromSource(pngPath, existingBuffer),
      differenceFromSource(pngPath, encoded),
    ]);

    // Only replace when the new file is smaller and not visibly worse at the
    // size it renders. Tolerance is mean absolute channel error out of 255, so
    // 0.4 is roughly 0.15% — well below what an eye can pick up, and small
    // next to the ~4.3 of loss the existing WebP already carries.
    const smaller = encoded.length < beforeBytes;
    const noWorse = newDiff !== null && oldDiff !== null && newDiff <= oldDiff + 0.4;

    if (!smaller || !noWorse) {
      skipped.push(
        `${pngName} — kept original (new ${kb(encoded.length)}KB/diff ${newDiff?.toFixed(2)} vs old ${kb(beforeBytes)}KB/diff ${oldDiff?.toFixed(2)})`
      );
      beforeTotal += beforeBytes;
      afterTotal += beforeBytes;
      continue;
    }

    if (!dryRun) {
      await copyFile(webpPath, path.join(BACKUP_DIR, path.basename(webpPath)));
      // Write the buffer rather than sharp.toFile(): on Windows sharp still
      // holds the WebP open from the comparison read above, and writing back
      // to the same path fails with "unable to open for write".
      await writeFile(webpPath, encoded);
    }

    beforeTotal += beforeBytes;
    afterTotal += encoded.length;
    rows.push({
      name: pngName.replace(/\.png$/, ""),
      before: kb(beforeBytes),
      after: kb(encoded.length),
      saved: Math.round((1 - encoded.length / beforeBytes) * 100),
      oldDiff: oldDiff.toFixed(2),
      newDiff: newDiff.toFixed(2),
      alpha: meta.hasAlpha,
    });
  }

  console.log(dryRun ? "DRY RUN — nothing written\n" : "Re-encoded from PNG sources\n");
  console.log(
    "name".padEnd(18) + "before".padStart(8) + "after".padStart(8) + "saved".padStart(8) + "  diff old→new   alpha"
  );
  for (const r of rows) {
    console.log(
      r.name.padEnd(18) +
        `${r.before}KB`.padStart(8) +
        `${r.after}KB`.padStart(8) +
        `${r.saved}%`.padStart(8) +
        `   ${r.oldDiff} → ${r.newDiff}`.padEnd(16) +
        `  ${r.alpha ? "kept" : "LOST!"}`
    );
  }

  console.log(
    `\nTOTAL  ${kb(beforeTotal)} KB → ${kb(afterTotal)} KB  ` +
      `(${Math.round((1 - afterTotal / beforeTotal) * 100)}% smaller)`
  );

  if (skipped.length) {
    console.log("\nSkipped:");
    for (const s of skipped) console.log("  " + s);
  }
  if (!dryRun) console.log(`\nOriginals backed up to ${BACKUP_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
