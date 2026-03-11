'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/types/post';
import { getComments } from '@/services/hackernews';
import CommentItem from './CommentItem';
import { Loader2 } from 'lucide-react';

interface CommentThreadProps {
  commentIds: number[];
}

export default function CommentThread({ commentIds }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        const fetchedComments = await getComments(commentIds);
        setComments(fetchedComments as unknown as Comment[]);
      } catch (err) {
        setError('Failed to load comments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (commentIds && commentIds.length > 0) {
      fetchComments();
    } else {
      setLoading(false);
    }
  }, [commentIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-hn-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Comments ({comments.length})
      </h2>
      
      {comments.map((comment) => (
        <RenderComment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function RenderComment({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  useEffect(() => {
    async function fetchReplies() {
      if (comment.kids && comment.kids.length > 0) {
        try {
          setLoadingReplies(true);
          const fetchedReplies = await getComments(comment.kids);
          setComments(fetchedComments as unknown as Comment[]);
        } catch (err) {
          console.error('Failed to load replies:', err);
        } finally {
          setLoadingReplies(false);
        }
      }
    }

    fetchReplies();
  }, [comment.kids]);

  return (
    <CommentItem comment={comment} depth={depth}>
      {loadingReplies && comment.kids && comment.kids.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading replies...</span>
        </div>
      )}
      
      {replies.map((reply) => (
        <RenderComment key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </CommentItem>
  );
}
