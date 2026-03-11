'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User as UserIcon, BookmarkIcon, LogOut, ArrowLeft } from 'lucide-react';
import { getCurrentUser, signOut, getSavedPostsCount } from '@/services/supabase';
import { User } from '@/types/user';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        setUser(currentUser);
        const count = await getSavedPostsCount(currentUser.id);
        setBookmarkCount(count);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar user={user} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-hn-orange-500/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-hn-orange-500 to-hn-orange-400 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {user.name || 'Hacker News User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user.email}
              </p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Member since</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bookmarks Card */}
          <Link 
            href="/bookmarks"
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-hn-orange-500/50 transition-all hover:shadow-lg group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-hn-orange-500/10 rounded-lg group-hover:bg-hn-orange-500/20 transition-colors">
                <BookmarkIcon className="w-6 h-6 text-hn-orange-500" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {bookmarkCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Saved Posts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View your bookmarked stories
            </p>
          </Link>

          {/* Activity Card (Placeholder) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 opacity-50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-500/10 rounded-lg">
                <UserIcon className="w-6 h-6 text-gray-500" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                -
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Activity
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
