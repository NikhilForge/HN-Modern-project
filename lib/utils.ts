import { formatDistanceToNow } from 'date-fns';

/**
 * Format Unix timestamp to relative time
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
}

/**
 * Format number with compact notation (1000 -> 1k)
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * Extract domain from URL
 * @param url - Full URL
 * @returns Domain name
 */
export function extractDomain(url?: string): string {
  if (!url) return '';
  
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
}

/**
 * Get category color
 * @param category - Category name
 * @returns Tailwind color classes
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'AI': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Programming': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Startups': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Open Source': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Security': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Other': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  
  return colors[category] || colors['Other'];
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
