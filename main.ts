// One-Line Office Joke: 24-Hour Sprint
// Writes a single original one-line joke about office life to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Node 22, stdlib only, deterministic: the same text every run.
// (Unlike the office printer in the joke, this script never jams.)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve everything from this script's location, never process.cwd().
const scriptDir = dirname(fileURLToPath(import.meta.url));
void scriptDir;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const inputDir = process.env.MAKEFUN_INPUT_DIR || "/input";
void inputDir;

// The joke: one sentence, one line, 82 characters —
// a setup everyone in an office recognises (the printer jams)
// and a punchline that lands (only on urgent documents, so it
// must be able to read). A specific office detail, not a generic
// complaint about work.
const JOKE =
  "The office printer only jams on urgent documents, which is how I know it can read.";

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), JOKE, "utf8");
