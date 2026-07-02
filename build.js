/**
 * build.js
 * Bước "build" đơn giản cho project HTML/CSS/JS thuần:
 * - Tạo thư mục dist/
 * - Copy các file tĩnh (index.html, style.css, script.js, utils.js) vào dist/
 * - Gắn version = mã commit (lấy từ biến môi trường GITHUB_SHA nếu chạy trong CI)
 *
 * Với project thực tế, bước này có thể thay bằng webpack/vite/rollup...
 * nhưng ở đây giữ đơn giản để thực tập sinh dễ hiểu luồng CI/CD.
 */

const fs = require("fs");
const path = require("path");

const SRC_FILES = ["index.html", "style.css", "script.js", "utils.js"];
const DIST_DIR = path.join(__dirname, "dist");

function main() {
  // 1. Tạo (hoặc làm sạch) thư mục dist
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR);

  // 2. Copy từng file vào dist/
  SRC_FILES.forEach((file) => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(DIST_DIR, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file} -> dist/${file}`);
  });

  // 3. Gắn version (commit SHA rút gọn) vào index.html trong dist/
  const version = (process.env.GITHUB_SHA || "local-build").slice(0, 7);
  const indexPath = path.join(DIST_DIR, "index.html");
  let html = fs.readFileSync(indexPath, "utf-8");
  html = html.replace("version: dev", `version: ${version}`);
  fs.writeFileSync(indexPath, html);

  console.log(`\n✅ Build hoàn tất. Version: ${version}`);
  console.log(`📦 Output: ${DIST_DIR}`);
}

main();
