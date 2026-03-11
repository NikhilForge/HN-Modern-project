# Project Structure - HN Modern

Complete overview of the project architecture and file organization.

## 📁 Directory Structure

```
hn-modern/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with global styles
│   ├── page.tsx                 # Homepage (trending stories)
│   ├── globals.css              # Global CSS and Tailwind directives
│   │
│   ├── article/                 # Article pages
│   │   └── [id]/
│   │       └── page.tsx         # Dynamic article detail page
│   │
│   ├── auth/                    # Authentication routes
│   │   └── callback/
│   │       └── route.ts         # OAuth callback handler
│   │
│   ├── bookmarks/               # Saved posts
│   │   └── page.tsx             # Bookmarks list page
│   │
│   ├── login/                   # Authentication
│   │   └── page.tsx             # Login page with OAuth
│   │
│   └── profile/                 # User profile
│       └── page.tsx             # Profile page
│
├── components/                   # Reusable UI components
│   ├── Navbar.tsx               # Top navigation bar
│   ├── PostCard.tsx             # Story card component
│   ├── CategoryFilter.tsx       # Category filter bar
│   ├── CommentThread.tsx        # Comment tree container
│   ├── CommentItem.tsx          # Individual comment
│   ├── AISummaryBox.tsx         # AI summary display
│   └── LoadingSkeleton.tsx      # Loading state placeholder
│
├── services/                     # API integrations
│   ├── hackernews.ts            # Hacker News API client
│   ├── ai-summary.ts            # AI summarization service
│   └── supabase.ts              # Supabase client & helpers
│
├── types/                        # TypeScript definitions
│   ├── post.ts                  # Post and comment types
│   └── user.ts                  # User and auth types
│
├── lib/                          # Utility functions
│   ├── utils.ts                 # Helper functions
│   └── useDarkMode.ts           # Dark mode hook
│
├── public/                       # Static assets
│   └── (images, icons, etc.)
│
├── .env.local.example           # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── next.config.js               # Next.js configuration
│
├── database-schema.sql          # Supabase database schema
│
└── Documentation/
    ├── README.md                # Main documentation
    ├── QUICKSTART.md            # Quick start guide
    ├── FEATURES.md              # Feature documentation
    ├── DEPLOYMENT.md            # Deployment guide
    └── PROJECT_STRUCTURE.md     # This file
```

---

## 🎯 Key Directories Explained

### `/app` - Next.js App Router

The `app` directory uses Next.js 13+ App Router with file-based routing.

**Key Files:**
- `layout.tsx` - Root layout, wraps all pages
- `page.tsx` - Route handler for `/`
- `[dynamic]` - Dynamic route segments

**Routing Examples:**
```
/                    → app/page.tsx
/article/123         → app/article/[id]/page.tsx
/login               → app/login/page.tsx
/bookmarks           → app/bookmarks/page.tsx
/auth/callback       → app/auth/callback/route.ts
```

### `/components` - UI Components

Reusable React components following atomic design principles.

**Component Categories:**

**Layout Components:**
- `Navbar.tsx` - Global navigation

**Display Components:**
- `PostCard.tsx` - Story display
- `CommentItem.tsx` - Single comment
- `CommentThread.tsx` - Comment tree
- `AISummaryBox.tsx` - AI summary

**Interactive Components:**
- `CategoryFilter.tsx` - Filter controls
- `LoadingSkeleton.tsx` - Loading state

**Component Design Principles:**
```typescript
// ✅ Good: Single responsibility
function PostCard({ post, onBookmark }) {
  // Handles post display only
}

// ✅ Good: Prop-driven
function CategoryFilter({ selected, onChange }) {
  // Controlled component
}

// ✅ Good: Composition
function CommentThread({ commentIds }) {
  return comments.map(c => <CommentItem key={c.id} comment={c} />);
}
```

### `/services` - API Layer

External API integrations and business logic.

**Service Files:**

**`hackernews.ts`** - Hacker News API
```typescript
export async function getTopStories(limit: number): Promise<HNStory[]>
export async function getStoryDetails(id: number): Promise<HNStory>
export async function getComments(ids: number[]): Promise<HNStory[]>
export function categorizeStory(story: HNStory): Category
```

**`supabase.ts`** - Authentication & Database
```typescript
export async function signInWithProvider(provider: 'google' | 'github')
export async function getCurrentUser(): Promise<User | null>
export async function savePost(userId, postId, title, url)
export async function getSavedPosts(userId): Promise<SavedPost[]>
```

**`ai-summary.ts`** - AI Integration
```typescript
export async function generateSummary(url: string): Promise<SummaryResponse>
```

**Design Pattern:**
- Pure functions where possible
- Clear error handling
- Typed responses
- No side effects in services

### `/types` - TypeScript Definitions

Central type definitions for the entire app.

**`post.ts`** - Story and comment types
```typescript
interface HNStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  time: number;
  descendants?: number;
  kids?: number[];
}

type Category = 'AI' | 'Programming' | 'Startups' | ...;
```

**`user.ts`** - User and auth types
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  title: string;
  url?: string;
  saved_at: string;
}
```

### `/lib` - Utilities

Helper functions and custom hooks.

**`utils.ts`** - Pure utility functions
```typescript
formatRelativeTime(timestamp: number): string
formatCompactNumber(num: number): string
extractDomain(url: string): string
getCategoryColor(category: string): string
truncateText(text: string, maxLength: number): string
```

**`useDarkMode.ts`** - Custom React hook
```typescript
function useDarkMode() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggleTheme = () => { /* ... */ };
  return { theme, toggleTheme, mounted };
}
```

---

## 🏗️ Architecture Patterns

### Data Flow

```
User Interaction
      ↓
   Component
      ↓
   Service
      ↓
  External API / Database
      ↓
   Component Updates
      ↓
  UI Re-renders
```

### Component Hierarchy

```
App Layout (layout.tsx)
  └── Navbar
  └── Page Component
      └── PostCard (multiple)
          └── BookmarkButton
      └── CategoryFilter
      └── LoadingSkeleton

Article Page
  └── Navbar
  └── Article Header
  └── AISummaryBox
  └── CommentThread
      └── CommentItem (nested)
```

### State Management

**Local State:**
```typescript
// Component-level state with useState
const [posts, setPosts] = useState<Post[]>([]);
```

**Shared State:**
```typescript
// Props drilling for simple cases
<PostCard post={post} onBookmark={handleBookmark} />
```

**Server State:**
```typescript
// Direct API calls in components
useEffect(() => {
  async function fetchData() {
    const data = await getTopStories();
    setPosts(data);
  }
  fetchData();
}, []);
```

---

## 🎨 Styling Architecture

### Tailwind Organization

**Utility-First:**
```tsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-6">
```

**Custom Classes:**
```css
/* globals.css */
.prose {
  @apply text-gray-700 dark:text-gray-300;
}
```

**Theme Configuration:**
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'hn-orange': {
        500: '#ff6600',
      },
    },
  },
}
```

---

## 🔒 Security Architecture

### Row-Level Security (RLS)

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own saved posts" 
  ON saved_posts FOR SELECT 
  USING (auth.uid() = user_id);
```

### Environment Variables

**Public (NEXT_PUBLIC_):**
- Exposed to browser
- OK for API endpoints
- Never for secrets

**Private:**
- Server-side only
- For API keys
- Secure by default

---

## 📊 Data Models

### Hacker News Story

```typescript
{
  id: number;           // Unique story ID
  title: string;        // Story title
  url?: string;         // External link (optional)
  by: string;           // Author username
  score: number;        // Upvotes
  time: number;         // Unix timestamp
  descendants?: number; // Comment count
  kids?: number[];      // Comment IDs
  category?: Category;  // Auto-categorized
}
```

### User Profile

```typescript
{
  id: string;          // UUID from Supabase Auth
  email: string;       // User email
  name?: string;       // Display name
  avatar_url?: string; // Profile picture
  created_at: string;  // Registration date
}
```

### Saved Post

```typescript
{
  id: string;          // UUID
  user_id: string;     // References users.id
  post_id: string;     // HN story ID
  title: string;       // Cached title
  url?: string;        // Cached URL
  saved_at: string;    // Bookmark timestamp
}
```

---

## 🧪 Testing Strategy

### Component Tests

```typescript
// PostCard.test.tsx
describe('PostCard', () => {
  it('renders post title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
  });
});
```

### Service Tests

```typescript
// hackernews.test.ts
describe('getTopStories', () => {
  it('fetches and returns stories', async () => {
    const stories = await getTopStories(10);
    expect(stories).toHaveLength(10);
  });
});
```

---

## 📦 Build & Deploy

### Build Process

```bash
1. npm install       # Install dependencies
2. npm run build     # Build for production
3. npm start         # Start production server
```

### Output Structure

```
.next/
├── cache/           # Build cache
├── server/          # Server-side code
├── static/          # Static assets
└── standalone/      # Standalone build (Docker)
```

---

## 🔄 Development Workflow

### Adding a New Feature

1. **Create types** (`/types`)
2. **Add service** (`/services`)
3. **Build component** (`/components`)
4. **Create page** (`/app`)
5. **Test locally**
6. **Deploy**

### Example: Adding Search

```typescript
// 1. types/search.ts
export interface SearchResult {
  id: number;
  title: string;
  relevance: number;
}

// 2. services/search.ts
export async function searchStories(query: string): Promise<SearchResult[]> {
  // Implementation
}

// 3. components/SearchBar.tsx
export function SearchBar({ onSearch }) {
  // Component
}

// 4. app/search/page.tsx
export default function SearchPage() {
  // Page implementation
}
```

---

## 📝 Code Standards

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts`
- Pages: `page.tsx`
- Layouts: `layout.tsx`

### Import Order

```typescript
// 1. External libraries
import { useState } from 'react';
import Link from 'next/link';

// 2. Internal services
import { getTopStories } from '@/services/hackernews';

// 3. Internal components
import Navbar from '@/components/Navbar';

// 4. Types
import { Post } from '@/types/post';

// 5. Utilities
import { formatDate } from '@/lib/utils';
```

---

## 🎓 Learning Path

### For New Developers

1. Start with `/types` - Understand data models
2. Review `/services` - See API integrations
3. Explore `/components` - Study UI patterns
4. Check `/app` - Understand routing
5. Read `/lib` - Learn utilities

### For Contributors

1. Read `README.md` - Overview
2. Follow `QUICKSTART.md` - Setup
3. Review `FEATURES.md` - Capabilities
4. Check this file - Architecture
5. See `DEPLOYMENT.md` - Going live

---

This structure is designed for:
- ✅ Easy navigation
- ✅ Clear separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Developer experience

Happy coding! 🚀
