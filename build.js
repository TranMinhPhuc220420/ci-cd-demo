/**
 * build.js
 * A simple "build" step for a plain HTML/CSS/JS project:
 * - Create the dist/ directory
 * - Copy the static files (index.html, style.css, script.js, utils.js) into dist/
 * - Stamp version = commit hash (read from the GITHUB_SHA env var when running in CI)
 *
 * In a real project this step could be replaced by webpack/vite/rollup...
 * but here it is kept simple so interns can easily follow the CI/CD flow.
 */

const fs = require("fs");
const path = require("path");

const SRC_FILES = ["index.html", "style.css", "script.js", "utils.js"];
const DIST_DIR = path.join(__dirname, "dist");

function main() {
  // 1. Create (or clean) the dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR);

  // 2. Copy each file into dist/
  SRC_FILES.forEach((file) => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(DIST_DIR, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file} -> dist/${file}`);
  });

  // 3. Stamp the version (short commit SHA) into index.html in dist/
  const version = (process.env.GITHUB_SHA || "local-build").slice(0, 7);
  const indexPath = path.join(DIST_DIR, "index.html");
  let html = fs.readFileSync(indexPath, "utf-8");
  html = html.replace("version: dev", `version: ${version}`);
  fs.writeFileSync(indexPath, html);

  console.log(`\n✅ Build complete. Version: ${version}`);
  console.log(`📦 Output: ${DIST_DIR}`);
}

main();
