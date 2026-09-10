/**
 * Static export for GitHub Pages and other static hosts.
 *
 * Runs the plain Next.js build with STATIC_EXPORT=1, which switches
 * `next.config.ts` into `output: "export"` mode and writes the site to `out/`.
 *
 * Written as a script so the environment variable works the same way on
 * Windows, macOS, and Linux.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const env = { ...process.env, STATIC_EXPORT: "1" };

const child = spawn(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env,
});

child.on("exit", (code) => {
  if (code !== 0) {
    process.exit(code ?? 1);
  }

  const outDir = join(process.cwd(), "out");
  console.log(
    existsSync(outDir)
      ? `\nStatic export written to ${outDir}\nPreview it with: npx serve out\n`
      : "\nBuild finished, but no out/ directory was produced.\n",
  );
});
