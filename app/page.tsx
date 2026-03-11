'use client';

import { useEffect, useState } from 'react';
import { getTopStories, categorizeStory } from '@/services/hackernews';
import { Post, Category } from '@/types/post';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { getCurrentUser, isPostSaved, savePost, unsavePost } from '@/services/supabase';
import { User } from '@/types/user';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());

  // Fetch user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const stories = await getTopStories(30);
        
        // Add categories to posts
        const categorizedPosts = stories.map(story => ({
          ...story,
          category: categorizeStory(story),
        }));
        
        setPosts(categorizedPosts);
        setFilteredPosts(categorizedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Check bookmarked status for posts
  useEffect(() => {
    async function checkBookmarks() {
      if (!user) return;

      const bookmarked = new Set<number>();
      for (const post of posts) {
        const saved = await isPostSaved(user.id, post.id.toString());
        if (saved) {
          bookmarked.add(post.id);
        }
      }
      setBookmarkedPosts(bookmarked);
    }

    checkBookmarks();
  }, [user, posts]);

  // Filter posts by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  }, [selectedCategory, posts]);

  const handleBookmark = async (postId: number) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (bookmarkedPosts.has(postId)) {
        await unsavePost(user.id, postId.toString());
        setBookmarkedPosts(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      } else {
        await savePost(user.id, postId.toString(), post.title, post.url);
        setBookmarkedPosts(prev => new Set(prev).add(postId));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Trending Stories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The best stories from Hacker News, modernized
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Posts Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isBookmarked={bookmarkedPosts.has(post.id)}
                onBookmark={handleBookmark}
                userLoggedIn={!!user}
              />
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No posts found in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
