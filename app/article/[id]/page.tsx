'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUp, MessageSquare, ExternalLink, Clock } from 'lucide-react';
import { getStoryDetails } from '@/services/hackernews';
import { HNStory } from '@/types/post';
import { formatRelativeTime, extractDomain } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import AISummaryBox from '@/components/AISummaryBox';
import CommentThread from '@/components/CommentThread';
import { getCurrentUser } from '@/services/supabase';
import { User } from '@/types/user';

export default function ArticlePage() {
  const params = useParams();
  const [story, setStory] = useState<HNStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  useEffect(() => {
    async function fetchStory() {
      try {
        setLoading(true);
        const storyId = parseInt(params.id as string);
        const storyData = await getStoryDetails(storyId);
        setStory(storyData);
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar user={user} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar user={user} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Story not found
          </p>
        </div>
      </div>
    );
  }

  const domain = extractDomain(story.url);

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

        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center space-x-1">
              <span className="font-mono text-hn-orange-500 dark:text-hn-orange-400">
                {story.by}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatRelativeTime(story.time)}</span>
            </div>

            <div className="flex items-center space-x-1">
              <ArrowUp className="w-4 h-4" />
              <span>{story.score} points</span>
            </div>

            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{story.descendants || 0} comments</span>
            </div>
          </div>

          {story.url && (
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-hn-orange-500 hover:bg-hn-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              <span>Read Original Article</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {domain && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Source: <span className="font-mono">{domain}</span>
            </p>
          )}

          {/* Text content for Ask HN or Show HN posts */}
          {story.text && (
            <div 
              className="mt-6 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: story.text }}
            />
          )}
        </article>

        {/* AI Summary */}
        {story.url && (
          <AISummaryBox url={story.url} title={story.title} />
        )}

        {/* Comments Section */}
        {story.kids && story.kids.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <CommentThread commentIds={story.kids} />
          </div>
        )}

        {(!story.kids || story.kids.length === 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to discuss this story on Hacker News!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
