# HN Modern - Modern Hacker News Redesign

A modern, beautiful redesign of Hacker News with improved UI/UX and developer-friendly features. Built for a hackathon project.

![HN Modern](./docs/preview.png)

## ✨ Features

- **🎨 Modern UI**: Beautiful card-based layout with smooth animations
- **🌓 Dark Mode**: Toggle between light and dark themes (persisted in localStorage)
- **🏷️ Category Filtering**: Filter stories by AI, Programming, Startups, Open Source, Security
- **💬 Improved Comments**: Collapsible threaded comments with better readability
- **⭐ Bookmarks**: Save stories for later (requires authentication)
- **🤖 AI Summaries**: Get quick 2-3 sentence summaries of articles (placeholder)
- **🔐 Authentication**: Sign in with Google or GitHub via Supabase
- **📱 Responsive**: Works perfectly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication & Database)
- **Data Source**: Official Hacker News API
- **UI Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

### Step 1: Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your `Project URL` and `anon/public` key
4. Run the SQL schema (see `database-schema.sql`)

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Update the values:

```env
# Hacker News API (already configured)
NEXT_PUBLIC_HACKER_NEWS_API_BASE=https://hacker-news.firebaseio.com/v0

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Summary API (optional - placeholder for now)
AI_SUMMARY_API_KEY=YOUR_API_KEY_HERE
AI_SUMMARY_ENDPOINT=YOUR_ENDPOINT_HERE
```

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🗄️ Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- See database-schema.sql file for complete schema
```

This creates:
- `users` table for user profiles
- `saved_posts` table for bookmarks

## 📱 Pages & Routes

- `/` - Homepage with trending stories
- `/article/[id]` - Individual article page with comments
- `/login` - Authentication page
- `/profile` - User profile page
- `/bookmarks` - Saved posts page
- `/auth/callback` - OAuth callback handler

## 🎯 Key Components

### Navbar
- Logo and navigation links
- Dark mode toggle
- User authentication status
- Responsive mobile menu

### PostCard
- Story title, author, time
- Upvotes and comment count
- Category tag
- Bookmark button (requires login)
- Hover animations

### CategoryFilter
- Filter stories by category
- Client-side filtering
- Active state highlighting

### CommentThread
- Nested, collapsible comments
- Thread depth visualization
- Author and timestamp

### AISummaryBox
- AI-powered article summaries
- Placeholder implementation
- Error handling

## 🔧 API Services

### Hacker News Service (`services/hackernews.ts`)

```typescript
// Fetch top stories
const stories = await getTopStories(20);

// Get story details
const story = await getStoryDetails(storyId);

// Get comments
const comments = await getComments(commentIds);

// Categorize story
const category = categorizeStory(story);
```

### Supabase Service (`services/supabase.ts`)

```typescript
// Authentication
await signInWithProvider('google');
await signOut();
const user = await getCurrentUser();

// Bookmarks
await savePost(userId, postId, title, url);
await unsavePost(userId, postId);
const saved = await isPostSaved(userId, postId);
const posts = await getSavedPosts(userId);
```

### AI Summary Service (`services/ai-summary.ts`)

```typescript
// Generate summary (placeholder)
const summary = await generateSummary(articleUrl);
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the theme:

```javascript
colors: {
  'hn-orange': {
    400: '#ff7a33',
    500: '#ff6600',  // Primary HN orange
    600: '#e65c00',
  },
}
```

### Typography

The app uses:
- **Headings**: JetBrains Mono (monospace) for a developer aesthetic
- **Body**: Inter (sans-serif) for readability

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Make sure to add all environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_HACKER_NEWS_API_BASE`

## 🔐 Authentication Flow

1. User clicks "Sign In" button
2. Redirects to `/login` page
3. User selects Google or GitHub
4. Supabase handles OAuth flow
5. User redirected to `/auth/callback`
6. Session established, redirected to homepage

## 📊 Future Enhancements

- [ ] Implement actual AI summarization API
- [ ] Add search functionality
- [ ] User comments and upvoting
- [ ] Email notifications for saved stories
- [ ] Reading list export
- [ ] Keyboard shortcuts
- [ ] PWA support for offline reading
- [ ] Social sharing features

## 🐛 Known Issues

- AI summary is currently a placeholder (needs API integration)
- Some HN stories don't have URLs (text posts)
- Comment threading can be deep (UX consideration)

## 📝 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- [Hacker News](https://news.ycombinator.com/) for the API
- [Supabase](https://supabase.com/) for authentication and database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 💬 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ by a developer, for developers.
