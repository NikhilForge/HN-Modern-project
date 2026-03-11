'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { generateSummary, SummaryResponse } from '@/services/ai-summary';

interface AISummaryBoxProps {
  url?: string;
  title: string;
}

export default function AISummaryBox({ url, title }: AISummaryBoxProps) {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSummary() {

      if (!url) {
        setSummary({
          summary: 'No URL available for this post. This appears to be a text-only submission.',
          status: 'error'
        });
        return;
      }

      try {
        setLoading(true);

        // ✅ FIX: send both url AND title
        const result = await generateSummary(url, title);

        setSummary(result);

      } catch (error) {

        console.error("Summary error:", error);

        setSummary({
          summary: 'Failed to generate summary. Please try again later.',
          status: 'error'
        });

      } finally {
        setLoading(false);
      }
    }

    fetchSummary();

  }, [url, title]); // ✅ update if either changes


  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 dark:border-purple-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Generating AI summary...
          </span>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const isPlaceholder = summary.status === 'placeholder';
  const isError = summary.status === 'error';

  return (
    <div
      className={`
      rounded-xl p-6 mb-8 border
      ${
        isPlaceholder
          ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 dark:border-amber-500/30'
          : isError
          ? 'bg-red-500/10 border-red-500/20 dark:border-red-500/30'
          : 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 dark:border-purple-500/30'
      }
    `}
    >
      <div className="flex items-start space-x-3">

        <div
          className={`
          p-2 rounded-lg
          ${
            isPlaceholder
              ? 'bg-amber-500/20'
              : isError
              ? 'bg-red-500/20'
              : 'bg-purple-500/20'
          }
        `}
        >
          {isError ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Sparkles
              className={`w-5 h-5 ${
                isPlaceholder ? 'text-amber-500' : 'text-purple-500'
              }`}
            />
          )}
        </div>

        <div className="flex-1">

          <h3
            className={`
            font-semibold mb-2
            ${
              isPlaceholder
                ? 'text-amber-700 dark:text-amber-400'
                : isError
                ? 'text-red-700 dark:text-red-400'
                : 'text-purple-700 dark:text-purple-400'
            }
          `}
          >
            {isPlaceholder
              ? 'AI Summary (Placeholder)'
              : isError
              ? 'Summary Unavailable'
              : 'AI Summary'}
          </h3>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {summary.summary}
          </p>

          {isPlaceholder && (
            <p className="mt-3 text-sm text-amber-600 dark:text-amber-500 italic">
              Configure AI_SUMMARY_API_KEY in your environment to enable this feature.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}