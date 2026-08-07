# 🧠 Brain Hunt Telugu AI Studio

Production Next.js 15 + Prisma + Supabase + Vercel AI Studio.
No terminal / computer అవసరం లేదు — ఇది mobile browser లోనే deploy చేయగలరు.

---

## Part 1 Status: ✅ Architecture Complete

- Folder structure (App Router: `(main)` user side, `(dashboard)` owner side, `api/*` routes)
- `package.json` — అన్ని production dependencies
- `prisma/schema.prisma` — Owner, ProviderConfig, Generation, AITool, ThemeSetting, StorageFile, AuditLog, RateLimitLog, BackupRecord
- `lib/env.ts` — startup env validation (zod) — తప్పు .env ఉంటే build fail అవుతుంది, silent bugs కాదు
- `lib/prisma.ts`, `lib/supabase.ts` — DB & Storage clients (server-only service-role client separated from browser client)
- PWA manifest + next-pwa wired in `next.config.mjs`
- Minimal boot page to confirm the build works

---

## Deploy చేయడం (Mobile, no terminal)

### Step 1 — GitHub repo create చేయండి
1. github.com → mobile browser లో login → **New repository**
2. Name: `brain-hunt-telugu-ai-studio` → Private → Create
3. ఈ మొత్తం project folder ని GitHub web upload ద్వారా push చేయండి
   (web UI: repo → "Add file" → "Upload files" → అన్ని files/folders select చేసి commit)

### Step 2 — Supabase project create చేయండి
1. supabase.com → mobile browser → **New Project**
2. Database password పెట్టండి, region: Mumbai/Singapore (దగ్గరగా ఉండేది)
3. Project Settings → **Database** → Connection string → `DATABASE_URL` మరియు `DIRECT_URL` కాపీ చేయండి
4. Project Settings → **API** → `NEXT_PUBLIC_SUPABASE_URL`, `anon key`, `service_role key` కాపీ చేయండి
5. Storage → **New bucket** → name: `brain-hunt-media` → Public (లేదా private, Part 2 లో signed URLs వాడతాం)

### Step 3 — Vercel కి deploy చేయండి
1. vercel.com → mobile browser → **Add New Project**
2. GitHub repo `brain-hunt-telugu-ai-studio` ని import చేయండి
3. **Environment Variables** section లో `.env.example` లో ఉన్న ప్రతి key ని add చేయండి:
   - Supabase వి Step 2 నుండి
   - `JWT_SECRET` → ఏదైనా 32+ character random string
   - `OWNER_SESSION_COOKIE_NAME` → `bh_owner_session`
   - మీ 4 API keys: `OPENAI_API_KEY`, `GOOGLE_AI_API_KEY`, `FAL_API_KEY`, `RUNWAY_API_KEY` (or `STABILITY_API_KEY`/`PIKA_API_KEY` — మీ దగ్గర ఉన్నవి)
   - `NEXT_PUBLIC_APP_URL` → deploy అయ్యాక వచ్చే Vercel URL (మొదట ఏదైనా placeholder పెట్టి, deploy అయ్యాక update చేయవచ్చు)
4. **Deploy** నొక్కండి

### Step 4 — Database migrate చేయండి
Vercel build automatically `prisma generate` run చేస్తుంది (package.json `postinstall`), కానీ actual tables create చేయడానికి:
1. Vercel Project → Settings → అక్కడ ఒక one-time "Deploy Hook" లేదా
2. సులభమైన మార్గం: Supabase Dashboard → **SQL Editor** → నేను ఇచ్చే migration SQL ని run చేయడం (Part 2 లో ఇస్తాను)

> Terminal అవసరమైన `npx prisma migrate dev` command కి mobile-friendly alternative ని Part 2 లో (Backend & Database) చూపిస్తాను — Supabase SQL Editor ద్వారా లేదా GitHub Actions ద్వారా.

---

## తర్వాత ఏమిటి

- **Part 2**: Backend & Database — API routes, Owner auth (JWT), migration SQL, rate limiting
- **Part 3**: Image AI — OpenAI/Google/Fal.ai switchable generation, real storage upload
- **Part 4**: Video AI
- **Part 5**: Owner Dashboard UI
- **Part 6**: AI Tool Builder + Theme Studio
- **Part 7**: PWA + App Builder
- **Part 8**: Testing + Production hardening

**Rule #4 ప్రకారం** — Part 2 పూర్తయ్యి, మీరు confirm చేసిన తర్వాతే Part 3 మొదలుపెడతాం.
