# Part 2 files — ఎలా అప్‌లోడ్ చేయాలి

ఈ zip లో ఉన్న ఫైల్స్ (అదే ఫోల్డర్ నిర్మాణంతో):

```
lib/env.ts
lib/prisma.ts
lib/supabase.ts
lib/auth.ts          (ఇప్పటికే ఉన్నదాన్ని replace చేస్తుంది — extra helpers జోడించబడ్డాయి)
lib/rate-limit.ts
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
app/api/auth/me/route.ts
app/api/auth/setup/route.ts
prisma/migration.sql   (కోడ్ ఫైల్ కాదు — Supabase SQL Editor లో run చేయాలి)
.env.example
```

## స్టెప్స్

1. **GitHub repo ఓపెన్ చేయండి** → ప్రతి ఫైల్ దగ్గరకు వెళ్ళి (ఉదా: `lib/env.ts`) → పెన్సిల్ (✏️) ఐకాన్ నొక్కి ఎడిట్ చేయండి → ఇక్కడి కంటెంట్ పేస్ట్ చేయండి → "Commit changes"
   - ఫైల్ ఇంకా లేకపోతే: repo లో ఆ ఫోల్డర్ దగ్గర **"Add file" → "Create new file"** → పేరు టైప్ చేయండి (ఉదా: `lib/rate-limit.ts`) → కంటెంట్ పేస్ట్ చేయండి → Commit

2. **`prisma/migration.sql`** ఫైల్ మాత్రం GitHub కి పెట్టక్కర్లేదు — దీన్ని **Supabase Dashboard → SQL Editor → New query** లో paste చేసి **Run** నొక్కండి. ఇది మీ database లో అన్ని tables create చేస్తుంది.

3. **Vercel Environment Variables** లో ఇవి కూడా add చేయండి (ఇప్పటికే లేకపోతే):
   - `NEXT_PUBLIC_APP_URL` → మీ Vercel deploy URL (`https://brain-hunt-telugu-ai-studio.vercel.app`)
   - `OWNER_SESSION_COOKIE_NAME` → `bh_owner_session`
   - `JWT_SECRET` → ఇప్పటికే ఉంటే పర్వాలేదు, లేకపోతే ఏదైనా 32+ character random string

4. అన్ని ఫైల్స్ commit అయ్యాక, Vercel automatic గా redeploy చేస్తుంది.

5. **మొదటి Owner account create చేయడానికి** (ఒక్కసారి మాత్రమే పని చేస్తుంది):
   బ్రౌజర్‌లో ఇలా POST request పంపాలి (లేదా నేను తర్వాత ఒక సింపుల్ `/setup` పేజీ UI రాస్తాను):
   ```
   POST https://your-app.vercel.app/api/auth/setup
   Body: { "email": "you@example.com", "password": "yourpassword123" }
   ```
   ఇది UI లేకుండా directly చేయడం కష్టం — కాబట్టి తర్వాతి రిప్లైలో నేను ఒక simple `/setup` మరియు `/login` పేజీలు (React forms) కూడా రాసిస్తాను.
