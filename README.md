# RepurposeAI — Setup Guide

> Turn transcripts into Reels scripts, Tweet threads, LinkedIn posts & Carousels in 30 seconds.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`:

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API |
| `OPENAI_API_KEY` | platform.openai.com/api-keys |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → API Keys |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as RAZORPAY_KEY_ID |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → Webhooks |
| `RAZORPAY_PLAN_ID` | Created below in step 5 |

---

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Enable **Google OAuth**:
   - Go to Auth → Providers → Google
   - Add your Google OAuth credentials
   - Set redirect URL: `https://your-domain.com/auth/callback`
4. Enable **Storage**:
   - Create a bucket called `videos` (public = false)

---

### 4. Set up OpenAI

1. Get your API key at [platform.openai.com](https://platform.openai.com)
2. Make sure you have access to `gpt-4o`
3. Set a monthly spend limit for safety

---

### 5. Set up Razorpay

1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from Dashboard → Settings → API Keys
3. **Create a Plan:**
   ```bash
   curl -X POST https://api.razorpay.com/v1/plans \
     -u YOUR_KEY_ID:YOUR_KEY_SECRET \
     -H "Content-Type: application/json" \
     -d '{
       "period": "monthly",
       "interval": 1,
       "item": {
         "name": "RepurposeAI Pro",
         "amount": 79900,
         "currency": "INR"
       }
     }'
   ```
   Copy the `id` from the response → set as `RAZORPAY_PLAN_ID`

4. **Set up Webhook:**
   - Go to Razorpay Dashboard → Webhooks
   - Add URL: `https://your-domain.com/api/webhooks/razorpay`
   - Select events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`
   - Copy the webhook secret → set as `RAZORPAY_WEBHOOK_SECRET`

---

### 6. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Custom Glass UI |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth) |
| AI | OpenAI GPT-4o |
| Payments | Razorpay Subscriptions |
| Hosting | Vercel (recommended) |

---

## 🏗️ Architecture

```
app/
├── page.tsx              # Landing page
├── login/page.tsx        # Google OAuth login
├── auth/callback/        # OAuth callback handler
├── app/
│   ├── layout.tsx        # Protected layout + sidebar
│   ├── page.tsx          # Dashboard (project list)
│   ├── new/page.tsx      # New project form
│   ├── project/[id]/     # Results page with tabs
│   └── billing/page.tsx  # Razorpay checkout
└── api/
    ├── projects/         # CRUD for projects
    ├── generate/         # OpenAI generation + credit check
    ├── billing/          # Razorpay subscription creation
    └── webhooks/razorpay/ # Payment webhook handler
```

---

## 💳 Pricing & Credits

- **Free tier**: 3 generations (no subscription required)
- **Pro (₹799/mo)**: 60 generations/month
- Each "Generate" click = 1 credit (regardless of how many platforms selected)

---

## 🚢 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set all environment variables in Vercel dashboard under Project Settings → Environment Variables.

Update your Supabase allowed redirect URLs and Razorpay webhook URL to your production domain.

---

## 🎨 Customization

- **Colors**: Edit `tailwind.config.ts` → brand colors
- **Credits limit**: Edit `app/api/generate/route.ts` → `PRO_CREDITS` constant
- **AI model**: Edit `lib/openai.ts` → change `gpt-4o` to `gpt-3.5-turbo` for cheaper generation
- **Pricing**: Edit landing page + Razorpay plan amount

---

## 📝 Output Schema

The AI returns strict JSON matching this schema:

```typescript
{
  reels: {
    scripts: [{ hook, beats[], broll[], on_screen_text[], caption, hashtags[] }]
  },
  tweets: {
    tweets: string[]
  },
  linkedin: {
    posts: [{ hook, body, cta }]
  },
  carousel: {
    slides: [{ title, body, visual_hint }],
    caption: string,
    cta: string
  }
}
```

---

Built with ❤️ for creators, coaches, and founders who ship fast.
