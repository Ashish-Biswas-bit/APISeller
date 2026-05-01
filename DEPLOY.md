# Deploy to Vercel Guide

## Quick Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Project Root
```bash
cd "e:\My Totel Project\API"
vercel
```

## Environment Variables Setup

After first deploy, add these in Vercel Dashboard (Project Settings → Environment Variables):

### Required Variables:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_KEY` | Service role key | Supabase Dashboard → Project Settings → API |
| `BINANCE_API_KEY` | Binance Pay API key | Binance Merchant Dashboard |
| `BINANCE_SECRET_KEY` | Binance Pay secret | Binance Merchant Dashboard |
| `BINANCE_MERCHANT_ID` | Merchant ID | Binance Merchant Dashboard |
| `BINANCE_PAY_WEBHOOK_SECRET` | Webhook secret | Generate random string |
| `FRONTEND_URL` | Your Vercel domain | Vercel deployment URL |

### Optional Variables:

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | For Stripe payments (legacy) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |

## Alternative: Deploy Frontend Only

If you want to deploy frontend and backend separately:

### Frontend to Vercel:
```bash
cd frontend
vercel
```

### Backend to Railway/Render:
See backend deployment options below.

## Full Stack Deployment (Recommended)

### Step 1: Prepare Your Project

Ensure your `vercel.json` is in the root directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "frontend/dist" }
    },
    {
      "src": "backend/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/src/index.js" },
    { "src": "/webhooks/(.*)", "dest": "backend/src/index.js" },
    { "src": "/(.*)", "dest": "frontend/dist/$1" }
  ]
}
```

### Step 2: Update API URLs in Frontend

Edit `frontend/src/lib/supabase.js` and other API files to use relative URLs:
```javascript
// Change from:
const API_URL = 'http://localhost:5000/api'

// To:
const API_URL = '/api'
```

### Step 3: Deploy

```bash
vercel --prod
```

### Step 4: Configure Binance Webhook

In Binance Merchant Dashboard, set webhook URL to:
```
https://your-project.vercel.app/api/binance/webhook
```

## Backend Alternative Deployment

If Vercel Serverless has issues with your backend, deploy backend separately:

### Option A: Railway (Recommended)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy backend
cd backend
railway login
railway init
railway up
```

### Option B: Render
1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set root directory to `backend`
5. Add environment variables

### Option C: Fly.io
```bash
# Install Fly CLI
winget install flyctl

# Deploy backend
cd backend
fly launch
fly deploy
```

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API endpoints respond (test: `/api/health`)
- [ ] Supabase connection works
- [ ] Binance Pay integration works
- [ ] Webhook endpoints receive callbacks
- [ ] User can complete purchase flow
- [ ] API keys generated after payment

## Troubleshooting

### Issue: CORS errors
**Fix:** Ensure backend CORS allows your Vercel domain:
```javascript
// backend/src/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-domain.vercel.app',
  credentials: true
}))
```

### Issue: 404 on API routes
**Fix:** Check `vercel.json` routes configuration. Ensure backend is built correctly.

### Issue: Environment variables not working
**Fix:** 
1. Redeploy after adding env vars
2. Use `process.env.VAR_NAME` in backend
3. Use `import.meta.env.VITE_VAR_NAME` in frontend

### Issue: Binance webhook not working
**Fix:** 
1. Verify webhook URL is correct
2. Check webhook signature verification
3. View Vercel function logs

## Domain Configuration (Optional)

### Custom Domain:
1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel Dashboard: Settings → Domains
3. Add your domain
4. Update DNS records as instructed

## Monitoring

### Vercel Analytics:
- Dashboard shows performance metrics
- Function invocation logs
- Error tracking

### Add Uptime Monitoring:
- UptimeRobot (free)
- Pingdom
- Set to check every 5 minutes

## Security Checklist

- [ ] All API keys stored as env vars (not in code)
- [ ] Supabase RLS policies enabled
- [ ] CORS restricted to specific domains
- [ ] Rate limiting enabled
- [ ] HTTPS only
- [ ] Webhook signatures verified

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Check function logs in Vercel Dashboard
