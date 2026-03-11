# Deployment Guide - HN Modern

Complete guide to deploying HN Modern to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps and is made by the Next.js team.

#### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Code pushed to GitHub repository

#### Steps

**1. Connect to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**2. Configure Environment Variables**

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_HACKER_NEWS_API_BASE=https://hacker-news.firebaseio.com/v0
AI_SUMMARY_API_KEY=your-api-key (optional)
AI_SUMMARY_ENDPOINT=your-endpoint (optional)
```

**3. Update Supabase OAuth Settings**

In Supabase Dashboard:
1. Go to Authentication → URL Configuration
2. Add your Vercel domain to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

**4. Deploy**
```bash
# Production deployment
vercel --prod
```

**Automatic Deployments:**
- Connect GitHub repository in Vercel
- Every push to main → automatic deployment
- Pull requests get preview deployments

---

### Option 2: Netlify

#### Steps

**1. Install Netlify CLI**
```bash
npm install netlify-cli -g
```

**2. Create netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**3. Deploy**
```bash
netlify deploy --prod
```

**4. Configure Environment Variables**
Same as Vercel, add in Netlify dashboard under Site Settings → Environment Variables

---

### Option 3: Self-Hosted (Docker)

#### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_HACKER_NEWS_API_BASE=${NEXT_PUBLIC_HACKER_NEWS_API_BASE}
    restart: unless-stopped
```

#### Deploy
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## ⚙️ Production Configuration

### next.config.js

Update for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
  },
  // Enable SWC minification
  swcMinify: true,
  // Strict mode
  reactStrictMode: true,
}

module.exports = nextConfig
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] All environment variables set correctly
- [ ] OAuth redirect URLs updated
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Supabase RLS policies enabled
- [ ] API keys are server-side only (not NEXT_PUBLIC_)
- [ ] Content Security Policy configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented

---

## 📊 Monitoring & Analytics

### Error Tracking

**Sentry Integration:**
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Analytics

**Google Analytics:**
```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
```

### Performance Monitoring

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔧 Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={user.avatar_url}
  alt="Avatar"
  width={96}
  height={96}
  priority
/>
```

### Code Splitting

```typescript
// Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

### Caching Strategy

**Vercel Edge Caching:**
```typescript
// app/api/posts/route.ts
export const revalidate = 300; // 5 minutes
```

---

## 🌍 CDN Configuration

### Cloudflare (Optional)

1. Point domain to Vercel/Netlify
2. Enable Cloudflare proxy
3. Configure caching rules:
   - Cache static assets: 1 year
   - Cache API responses: 5 minutes
   - Cache HTML: No cache

### Cache Headers

```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📱 Domain Configuration

### Custom Domain

**Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records
4. Wait for SSL certificate

**DNS Records:**
```
A     @      76.76.21.21
CNAME www    cname.vercel-dns.com
```

---

## 🐛 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Environment Variables Not Working:**
- Check variable names (NEXT_PUBLIC_ prefix for client-side)
- Restart dev server after changes
- Verify in Vercel dashboard

**OAuth Redirect Issues:**
- Verify redirect URLs in Supabase
- Check for trailing slashes
- Ensure HTTPS in production

**Supabase Connection:**
```typescript
// Test connection
const { data, error } = await supabase.from('users').select('count');
console.log({ data, error });
```

---

## 📈 Scaling Considerations

### Database

**Supabase:**
- Free tier: 500MB database
- Pro tier: Unlimited
- Consider database indexes
- Monitor query performance

### API Rate Limits

**Hacker News API:**
- No official rate limits
- Implement client-side caching
- Use request throttling

### Serverless Functions

**Vercel:**
- Free: 100GB-hrs/month
- Pro: 1000GB-hrs/month
- Monitor function execution time

---

## ✅ Pre-Launch Checklist

- [ ] All features tested in production-like environment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] OAuth providers configured
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error tracking set up
- [ ] Performance tested (Lighthouse score > 90)
- [ ] SEO meta tags added
- [ ] Favicon and social preview images
- [ ] robots.txt and sitemap.xml
- [ ] Terms of Service and Privacy Policy
- [ ] Contact information added

---

## 🎉 Post-Deployment

### Monitor

- [ ] Check error logs daily
- [ ] Monitor performance metrics
- [ ] Review analytics data
- [ ] User feedback collection

### Maintenance

- [ ] Weekly dependency updates
- [ ] Security patches applied
- [ ] Database backups verified
- [ ] Uptime monitoring

---

Your app is now live! 🚀

For support, check the [README](./README.md) or open an issue.
