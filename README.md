# CI/CD Demo — Task Manager (HTML/CSS/JS)

Project mẫu để hiểu **luồng CI/CD cơ bản** bằng GitHub Actions.
App thật ra rất đơn giản (to-do list), trọng tâm là **pipeline**, không phải app.

## 1. Project này làm gì?

Một Task Manager web đơn giản: thêm / tick hoàn thành / xoá công việc,
lưu vào `localStorage`. Không cần backend.

```
index.html    -> giao diện
style.css     -> giao diện
utils.js      -> các hàm thuần (pure function), dễ test
script.js     -> xử lý DOM, gọi các hàm trong utils.js
utils.test.js -> unit test cho utils.js (Jest)
build.js      -> bước "build" ra thư mục dist/
.eslintrc.json-> cấu hình kiểm tra code style
```

> 💡 Vì sao tách `utils.js` riêng? Hàm xử lý DOM (`script.js`) rất khó test.
> Hàm thuần (không đụng DOM) như `calculateStats()`, `createTask()` thì test dễ
> và nhanh. Đây là thói quen nên áp dụng vào project thật.

## 2. Chạy thử ở máy local

```bash
npm install       # cài dependencies
npm run lint      # kiểm tra code style
npm test          # chạy unit test
npm run build     # build ra thư mục dist/
```

Mở `index.html` trực tiếp bằng trình duyệt để xem app chạy.

## 3. Pipeline CI/CD (`.github/workflows/ci-cd.yml`)

Đây là phần chính. Pipeline có **2 job**:

### Job `ci` — chạy với MỌI push và Pull Request

| Bước | Việc làm | Tại sao cần |
|---|---|---|
| 1. Checkout code | Tải code từ repo vào máy chạy (runner) | Runner là máy trống, phải có code mới làm được gì |
| 2. Setup Node.js | Cài Node.js version cố định (20) | Đảm bảo mọi lần chạy dùng đúng 1 version, tránh lỗi "chạy máy tôi thì được" |
| 3. Install dependencies | `npm ci` (không phải `npm install`) | `npm ci` cài đúng version ghi trong `package-lock.json` → **reproducible build** |
| 4. Lint | `npm run lint` | Bắt lỗi cú pháp / style sớm, trước khi merge |
| 5. Test | `npm test` | Đảm bảo code không phá vỡ chức năng đã có |
| 6. Build | `npm run build` | Tạo ra bản build thực sự sẽ deploy (thư mục `dist/`) |
| 7. Upload artifact | Lưu `dist/` lại | Để job `deploy` dùng lại **chính xác** bản đã build & test, không build lại lần 2 |

➡️ Nếu **bất kỳ bước nào fail**, các bước sau không chạy, job coi như thất bại,
và job `deploy` cũng sẽ **không chạy**. Đây chính là ý nghĩa của CI: chặn code
lỗi trước khi nó đi xa hơn.

### Job `deploy` — CHỈ chạy khi:
- Job `ci` đã pass (`needs: ci`)
- Là push (không phải PR) vào nhánh `main` (`if: github.ref == 'refs/heads/main' ...`)

Việc tách điều kiện này ra giúp: PR chỉ chạy kiểm tra (CI), còn deploy (CD)
chỉ xảy ra khi code đã được merge vào `main` — tránh deploy nhầm code chưa
review.

Job này tải lại artifact đã build, rồi deploy lên **GitHub Pages**.

## 4. Cách bật để pipeline này chạy thật

1. Push project này lên 1 GitHub repo.
2. Vào **Settings → Pages → Build and deployment → Source**, chọn
   **GitHub Actions**.
3. Push code lên `main` → vào tab **Actions** để xem pipeline chạy trực tiếp,
   từng bước một.
4. Sau khi job `deploy` xong, link app sẽ hiện ở output của bước
   "Deploy to GitHub Pages" (hoặc Settings → Pages).

## 5. Bài tập gợi ý cho thực tập sinh

- [ ] Thử sửa 1 dòng code làm lint fail → xem pipeline chặn ở bước nào.
- [ ] Thử sửa `utils.js` làm sai logic → xem test fail như thế nào.
- [ ] Thêm 1 hàm mới vào `utils.js` + viết test tương ứng.
- [ ] Thử tạo Pull Request thay vì push thẳng vào `main` → quan sát:
      job `ci` chạy nhưng job `deploy` **không** chạy.
- [ ] Thêm 1 bước mới vào workflow, ví dụ: kiểm tra format bằng Prettier.
- [ ] (Nâng cao) Thêm badge trạng thái CI vào đầu README này.

## 6. Áp dụng vào project thực tế

Khi thực tập sinh làm project riêng, nguyên tắc tương tự:

```
checkout -> install -> lint -> test -> build -> (nếu ở main) -> deploy
```

Chỉ khác công cụ cụ thể (React thay vì vanilla JS, deploy lên server/Docker
thay vì GitHub Pages...), nhưng **thứ tự và lý do từng bước là giống nhau**.
