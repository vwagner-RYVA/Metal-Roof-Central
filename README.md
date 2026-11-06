# Metal Roof Central website

One-page marketing site for Metal Roof Central, LLC (Florida metal roofing distributor).
Plain HTML/CSS/JS, hosted on Cloudflare, deployed automatically from this repository.

Live site: https://metal-roof-central.pages.dev

## Get the project onto your computer
1. Install [Git](https://git-scm.com/download/win) and sign in to GitHub (same account is fine).
2. Clone it:
   ```
   git clone https://github.com/vwagner-RYVA/Metal-Roof-Central.git
   cd Metal-Roof-Central
   ```
3. Preview locally (Windows PowerShell, no Node needed):
   ```
   powershell -ExecutionPolicy Bypass -File serve.ps1
   ```
   then open http://localhost:8532

## Making a change safely
1. `git pull` to get the latest.
2. Create a branch: `git switch -c short-description-of-change`
3. Edit files under `public/` and check them in the local preview.
4. Commit and push the branch, then open a pull request on GitHub.
5. Cloudflare Pages builds a preview link for the branch (it appears as a check on the pull request); look at it, then merge. **Merging (or pushing) to `main` publishes the live site within a couple of minutes.**

Editing text only? You can also open the file on GitHub and press `.` to use the in-browser editor.

## Read this before editing
- `CLAUDE.md` holds the project rules, decisions and "keep these in sync" checklist
  (for example, a price appears in several places). Claude Code reads it automatically.
- Never commit passwords, API keys or client login details. Use the team password manager.
- The client's intake PDF is private and git-ignored.

## Layout
- `public/` — the website (`index.html`, `css/`, `js/`, `images/`, `llms.txt`, `robots.txt`, `sitemap.xml`)
- `wrangler.jsonc`, `worker/wrangler.jsonc` — Cloudflare configuration
- `serve.ps1` — local preview server
