# CI/CD Demo — Task Manager (HTML/CSS/JS)

A sample project to understand the **basic CI/CD flow** with GitHub Actions.
The app itself is intentionally simple (a to-do list); the focus is the **pipeline**, not the app.

## 1. What does this project do?

A simple Task Manager web app: add / mark as done / delete tasks,
stored in `localStorage`. No backend required.

```
index.html    -> UI
style.css     -> UI
utils.js      -> pure functions, easy to test
script.js     -> DOM handling, calls functions in utils.js
utils.test.js -> unit tests for utils.js (Jest)
build.js      -> the "build" step producing the dist/ directory
.eslintrc.json-> code style check configuration
```

> 💡 Why split out `utils.js`? DOM handling code (`script.js`) is hard to test.
> Pure functions (that don't touch the DOM) like `calculateStats()` and `createTask()`
> are easy and fast to test. This is a good habit to apply in real projects.

## 2. Run it locally

```bash
npm install       # install dependencies
npm run lint      # check code style
npm test          # run unit tests
npm run build     # build into the dist/ directory
```

Open `index.html` directly in a browser to see the app run.

## 3. CI/CD pipeline (`.github/workflows/deploy.yml`)

This is the main part. The pipeline has **2 jobs**:

### Job `ci` — runs on every push and Pull Request

| Step | What it does | Why it's needed |
|---|---|---|
| 1. Checkout code | Fetch the code from the repo onto the runner | The runner is an empty machine; it needs the code to do anything |
| 2. Setup Node.js | Install a fixed Node.js version | Ensures every run uses the same version, avoiding "works on my machine" issues |
| 3. Install dependencies | `npm ci` (not `npm install`) | `npm ci` installs the exact versions in `package-lock.json` → **reproducible build** |
| 4. Lint | `npm run lint` | Catch syntax / style errors early, before merging |
| 5. Test | `npm test` | Make sure the code doesn't break existing functionality |
| 6. Build | `npm run build` | Produce the actual build that will be deployed (the `dist/` directory) |
| 7. Upload artifact | Save `dist/` | So the `deploy` job reuses the **exact** built & tested output, without building twice |

➡️ If **any step fails**, the following steps do not run, the job is considered failed,
and the `deploy` job will **not run** either. This is the whole point of CI: block
broken code before it goes any further.

### Job `deploy` — runs ONLY when:
- The `ci` job passed (`needs: ci`)
- It is a push (not a PR) to the `main` branch (`if: github.ref == 'refs/heads/main' ...`)

Separating this condition means: PRs only run checks (CI), while deploy (CD)
only happens once code is merged into `main` — avoiding accidental deploys of
unreviewed code.

This job downloads the built artifact, then deploys it to **cPanel over FTP**.

## 4. How to enable this pipeline for real

1. Push this project to a GitHub repo.
2. Add the following secrets under **Settings → Secrets and variables → Actions**:
   - `FTP_SERVER` — the FTP host (e.g. `ftp.yourdomain.com` or an IP)
   - `FTP_USERNAME` — the FTP account
   - `FTP_PASSWORD` — the FTP password
   - `FTP_SERVER_DIR` — the target directory on the host (e.g. `/public_html/`, with a trailing `/`)
3. Push code to `main` → open the **Actions** tab to watch the pipeline run live,
   step by step.
4. Once the `deploy` job finishes, the app will be published to the configured FTP directory.

## 5. Suggested exercises for interns

- [ ] Change one line of code to make lint fail → see where the pipeline blocks.
- [ ] Change `utils.js` to break the logic → see how the test fails.
- [ ] Add a new function to `utils.js` and write a matching test.
- [ ] Create a Pull Request instead of pushing straight to `main` → observe:
      the `ci` job runs but the `deploy` job does **not**.
- [ ] Add a new step to the workflow, e.g. checking formatting with Prettier.
- [ ] (Advanced) Add a CI status badge to the top of this README.

## 6. Applying this to real projects

When interns build their own projects, the principles are the same:

```
checkout -> install -> lint -> test -> build -> (if on main) -> deploy
```

Only the specific tools differ (React instead of vanilla JS, deploying to a
server/Docker instead of cPanel...), but **the order and the reason for each step
are the same**.
