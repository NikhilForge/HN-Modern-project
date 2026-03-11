# Quick Start Guide - HN Modern

Get HN Modern running in 5 minutes!

## Prerequisites

- ✅ Node.js 18 or higher
- ✅ A Supabase account (free)
- ✅ Git installed

## Step-by-Step Setup

### 1️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, and Supabase client.

### 2️⃣ Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details
   - Wait for database to provision (~2 minutes)

2. **Get Your API Credentials**
   - Go to Settings → API
   - Copy these two values:
     - Project URL (looks like: `https://xxxxx.supabase.co`)
     - `anon/public` key (long string)

3. **Run Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `database-schema.sql`
   - Paste and run in SQL editor
   - You should see "Success" messages

4. **Configure OAuth Providers**
   
   **For Google:**
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your Google OAuth credentials (or use Supabase's defaults for testing)
   - Add `http://localhost:3000/auth/callback` to redirect URLs
   
   **For GitHub:**
   - Go to Authentication → Providers → GitHub
   - Enable GitHub provider
   - Create GitHub OAuth App at github.com/settings/developers
   - Add Client ID and Secret
   - Set callback URL: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### 3️⃣ Configure Environment Variables

Create `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_HACKER_NEWS_API_BASE=https://hacker-news.firebaseio.com/v0

# Replace these with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: AI Summary (placeholder for now)
AI_SUMMARY_API_KEY=YOUR_API_KEY_HERE
AI_SUMMARY_ENDPOINT=YOUR_ENDPOINT_HERE
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎉 You're Done!

You should now see:
- ✅ Homepage with Hacker News stories
- ✅ Dark mode toggle working
- ✅ Category filters
- ✅ Sign In button (try signing in!)

## Testing the Features

### Test Dark Mode
1. Click the moon/sun icon in navbar
2. Theme should toggle
3. Refresh page - theme should persist

### Test Authentication
1. Click "Sign In" button
2. Choose Google or GitHub
3. Complete OAuth flow
4. You'll be redirected back to homepage
5. Your profile pic should appear in navbar

### Test Bookmarks
1. Make sure you're logged in
2. Click star icon on any story
3. Click your profile pic → Bookmarks
4. You should see your saved story

### Test Comments
1. Click on any story
2. Scroll down to see comments
3. Try collapsing/expanding threads

## Common Issues

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure there are no extra spaces
- Restart dev server: `npm run dev`

### Supabase authentication not working
- Verify OAuth providers are enabled in Supabase
- Check redirect URLs match exactly
- Clear browser cache and cookies

### TypeScript errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Dark mode not persisting
- Check browser localStorage is enabled
- Try a different browser

## Next Steps

- ✨ Explore the codebase
- 🎨 Customize the theme in `tailwind.config.js`
- 🔧 Integrate real AI summary API
- 🚀 Deploy to Vercel

## Need Help?

- 📖 Check the full [README.md](./README.md)
- 🐛 Open an issue on GitHub
- 📧 Contact the maintainers

---

Happy hacking! 🚀
