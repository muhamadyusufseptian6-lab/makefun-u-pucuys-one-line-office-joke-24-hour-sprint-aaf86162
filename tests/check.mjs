// TDD-lite checks for the office-joke entry (Node 22, stdlib only).
// Run: node tests/check.mjs  (from the entry dir)
// It runs main.ts twice into two temp dirs and checks the gate:
// entry.txt is UTF-8 text, 1-200 chars, not only whitespace, one line,
// deterministic (same bytes both runs), and main.ts imports stdlib only.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const root = dirname(dir);
let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

const run = (outDir) =>
  spawnSync(process.execPath, [join(root, "main.ts")], {
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: outDir },
    encoding: "utf8",
  });

const out1 = mkdtempSync(join(tmpdir(), "office-joke-a-"));
const out2 = mkdtempSync(join(tmpdir(), "office-joke-b-"));
const r1 = run(out1);
const r2 = run(out2);
check("main.ts exits 0 (run 1)", r1.status === 0, r1.stderr.trim());
check("main.ts exits 0 (run 2)", r2.status === 0, r2.stderr.trim());

const text1 = readFileSync(join(out1, "entry.txt"), "utf8");
const text2 = readFileSync(join(out2, "entry.txt"), "utf8");
check("entry.txt is 1-200 chars", text1.length >= 1 && text1.length <= 200, `${text1.length} chars`);
check("entry.txt is not only whitespace", text1.trim().length > 0);
check("entry.txt is a single line", !text1.includes("\n") && !text1.includes("\r"));
check("deterministic: identical bytes across runs", text1 === text2);
check("joke mentions office life", /office|printer|meeting|boss/i.test(text1));

const src = readFileSync(join(root, "main.ts"), "utf8");
const imports = [...src.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
check(
  "main.ts imports stdlib only",
  imports.every((m) => m.startsWith("node:")),
  imports.join(", ") || "(no imports)"
);

rmSync(out1, { recursive: true, force: true });
rmSync(out2, { recursive: true, force: true });
console.log(failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
