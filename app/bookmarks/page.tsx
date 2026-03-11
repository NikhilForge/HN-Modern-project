'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { getCurrentUser, getSavedPosts } from '@/services/supabase';
import { SavedPost, User } from '@/types/user';
import Navbar from '@/components/Navbar';
import { formatRelativeTime, extractDomain } from '@/lib/utils';

export default function BookmarksPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        setUser(currentUser);
        const posts = await getSavedPosts(currentUser.id);
        setSavedPosts(posts);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar user={user} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-hn-orange-500 dark:hover:text-hn-orange-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-hn-orange-500/10 rounded-lg">
            <Bookmark className="w-8 h-8 text-hn-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Saved Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {savedPosts.length} {savedPosts.length === 1 ? 'story' : 'stories'} bookmarked
            </p>
          </div>
        </div>

        {/* Saved Posts List */}
        {savedPosts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Bookmark className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No saved posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start bookmarking interesting stories to read later
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-hn-orange-500 hover:bg-hn-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Browse Stories
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-hn-orange-500/50 transition-all hover:shadow-lg group"
              >
                <Link href={`/article/${post.post_id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-hn-orange-500 dark:group-hover:text-hn-orange-400 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-hn-orange-500 dark:hover:text-hn-orange-400 transition-colors font-mono"
                  >
                    {extractDomain(post.url)}
                  </a>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Saved {formatRelativeTime(new Date(post.saved_at).getTime() / 1000)}
                  </span>
                  
                  <Link
                    href={`/article/${post.post_id}`}
                    className="text-sm font-medium text-hn-orange-500 hover:text-hn-orange-600 dark:hover:text-hn-orange-400 transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
