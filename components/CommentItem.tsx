'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Comment } from '@/types/post';
import { formatRelativeTime } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  children?: React.ReactNode;
}

export default function CommentItem({ comment, depth = 0, children }: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Don't render deleted or dead comments
  if (comment.deleted || comment.dead) {
    return null;
  }

  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : '';
  const borderColor = depth % 2 === 0 ? 'border-blue-500/20' : 'border-purple-500/20';

  return (
    <div className={`${indentClass} mb-4`}>
      <div className={`pl-4 border-l-2 ${borderColor}`}>
        {/* Comment Header */}
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            aria-label={isCollapsed ? 'Expand thread' : 'Collapse thread'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <span className="font-mono text-sm font-medium text-hn-orange-500 dark:text-hn-orange-400">
            {comment.by}
          </span>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatRelativeTime(comment.time)}
          </span>

          {comment.kids && comment.kids.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              [{comment.kids.length} {comment.kids.length === 1 ? 'reply' : 'replies'}]
            </span>
          )}
        </div>

        {/* Comment Body */}
        {!isCollapsed && (
          <>
            <div
              className="prose prose-sm dark:prose-invert max-w-none mb-3 text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />

            {/* Nested Replies */}
            {children && (
              <div className="mt-3">
                {children}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
