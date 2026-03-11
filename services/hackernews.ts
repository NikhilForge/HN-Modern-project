import { HNStory, Category } from '@/types/post';

const BASE_URL =
  process.env.NEXT_PUBLIC_HACKER_NEWS_API_BASE ||
  'https://hacker-news.firebaseio.com/v0';

/**
 * Fetch top story IDs from Hacker News
 */
export async function getTopStoryIds(): Promise<number[]> {
  try {
    const response = await fetch(`${BASE_URL}/topstories.json`);

    if (!response.ok) {
      throw new Error('Failed to fetch top stories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching top story IDs:', error);
    throw error;
  }
}

/**
 * Fetch a single story by ID
 */
export async function getStoryDetails(id: number): Promise<HNStory> {
  try {
    const response = await fetch(`${BASE_URL}/item/${id}.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch story ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch top stories with details
 */
export async function getTopStories(limit: number = 20): Promise<HNStory[]> {
  try {
    const storyIds = await getTopStoryIds();
    const limitedIds = storyIds.slice(0, limit);

    const stories = await Promise.all(
      limitedIds.map((id) => getStoryDetails(id))
    );

    return stories.filter((story) => story && story.title);
  } catch (error) {
    console.error('Error fetching top stories:', error);
    throw error;
  }
}

/**
 * Fetch comments for a story
 */
export async function getComments(commentIds: number[]): Promise<HNStory[]> {
  try {
    const comments = await Promise.all(
      commentIds.map((id) => getStoryDetails(id))
    );

    // Safe check for deleted comments
    return comments.filter(
      (comment) =>
        comment &&
        !(comment as any).deleted &&
        !(comment as any).dead
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

/**
 * Categorize a story based on its title and URL
 */
export function categorizeStory(story: HNStory): Category {
  const title = story.title?.toLowerCase() || '';
  const url = story.url?.toLowerCase() || '';

  // AI
  if (
    title.includes('ai ') ||
    title.includes('gpt') ||
    title.includes('llm') ||
    title.includes('machine learning') ||
    title.includes('neural') ||
    title.includes('openai') ||
    title.includes('anthropic')
  ) {
    return 'AI';
  }

  // Programming
  if (
    title.includes('python') ||
    title.includes('javascript') ||
    title.includes('rust') ||
    title.includes('go ') ||
    title.includes('programming') ||
    title.includes('code') ||
    title.includes('developer')
  ) {
    return 'Programming';
  }

  // Startups
  if (
    title.includes('startup') ||
    title.includes('founder') ||
    title.includes('vc ') ||
    title.includes('funding') ||
    title.includes('yc ')
  ) {
    return 'Startups';
  }

  // Open Source
  if (
    title.includes('open source') ||
    title.includes('github') ||
    title.includes('oss') ||
    url.includes('github.com')
  ) {
    return 'Open Source';
  }

  // Security
  if (
    title.includes('security') ||
    title.includes('vulnerability') ||
    title.includes('breach') ||
    title.includes('hack') ||
    title.includes('crypto')
  ) {
    return 'Security';
  }

  return 'Other';
}