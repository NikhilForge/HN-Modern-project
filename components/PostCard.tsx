'use client';

import Link from 'next/link';
import { ArrowUp, MessageSquare, ExternalLink, Star } from 'lucide-react';
import { Post } from '@/types/post';
import { formatRelativeTime, formatCompactNumber, extractDomain, getCategoryColor } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  isBookmarked?: boolean;
  onBookmark?: (postId: number) => void;
  userLoggedIn?: boolean;
}

export default function PostCard({ post, isBookmarked = false, onBookmark, userLoggedIn }: PostCardProps) {
  const domain = extractDomain(post.url);
  const categoryColor = getCategoryColor(post.category || 'Other');

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (userLoggedIn && onBookmark) {
      onBookmark(post.id);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-hn-orange-500/50 dark:hover:border-hn-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-hn-orange-500/10 overflow-hidden animate-slide-up">
      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-hn-orange-500 to-hn-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-5">
        {/* Header: Category and Bookmark */}
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium border ${categoryColor}`}>
            {post.category || 'Other'}
          </span>
          
          {userLoggedIn && (
            <button
              onClick={handleBookmarkClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Star 
                className={`w-5 h-5 ${isBookmarked ? 'fill-hn-orange-500 text-hn-orange-500' : 'text-gray-400'}`}
              />
            </button>
          )}
        </div>

        {/* Title */}
        <Link href={`/article/${post.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-hn-orange-500 dark:group-hover:text-hn-orange-400 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Domain */}
        {domain && (
          <a 
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-hn-orange-500 dark:hover:text-hn-orange-400 mb-3 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-mono">{domain}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {/* Footer: Stats and Author */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {/* Upvotes */}
            <div className="flex items-center space-x-1">
              <ArrowUp className="w-4 h-4" />
              <span className="font-medium">{formatCompactNumber(post.score)}</span>
            </div>

            {/* Comments */}
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{formatCompactNumber(post.descendants || 0)}</span>
            </div>
          </div>

          {/* Author and Time */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-mono text-xs">{post.by}</span>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="text-xs">{formatRelativeTime(post.time)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
