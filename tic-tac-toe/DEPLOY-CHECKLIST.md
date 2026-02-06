# Tic-Tac-Toe Deploy Checklist

This checklist covers deploying the Tic-Tac-Toe game and its Python Worker to production on `www.asifrasool.net`.

## 1) Deploy the Worker
- From the repo root:
  - `cd workers/tic-tac-toe`
  - `npx wrangler deploy`
- Confirm the Worker name is `tic-tac-toe-agent`.

## 2) Add the Worker Route (Cloudflare)
- Cloudflare Dashboard → **Workers & Pages** → **Workers**
- Select `tic-tac-toe-agent`
- **Triggers** → **Routes** → **Add route**
- Route: `www.asifrasool.net/api/tic-tac-toe/*`
- Failure mode: **Fail closed (block)**

## 3) Set Pages Environment Variable
- Cloudflare Dashboard → **Workers & Pages** → your Pages project
- **Settings** → **Environment variables**
- Add `VITE_TTT_API_BASE` with value `/api/tic-tac-toe/move`
- Apply to **Production** (and **Preview** if desired)

## 4) Redeploy Pages
- Push the latest commit to GitHub **or** click **Retry deployment**
- Verify `https://www.asifrasool.net/games`

## 5) Local Development (optional)
- Start the Worker locally:
  - `cd workers/tic-tac-toe`
  - `npx wrangler dev`
- Start the site locally:
  - `npm run dev`
- Visit `http://localhost:5173/games`

## Troubleshooting
- If `/games` shows “Agent is offline,” check:
  - Worker route exists and points to `tic-tac-toe-agent`
  - `VITE_TTT_API_BASE` is set to `/api/tic-tac-toe/move`
  - Worker is deployed successfully
