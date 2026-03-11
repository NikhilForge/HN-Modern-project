// Hacker News Story Interface
export interface HNStory {
  id: number;
  title: string;
  url?: string;
  by: string; // author
  score: number;
  time: number; // Unix timestamp
  descendants?: number; // comment count
  kids?: number[]; // comment IDs
  type: 'story' | 'comment' | 'job' | 'poll' | 'pollopt';
  text?: string; // HTML content for text posts
}

// Post with categorization
export interface Post extends HNStory {
  category?: Category;
  isBookmarked?: boolean;
}

// Category type
export type Category = 
  | 'AI' 
  | 'Programming' 
  | 'Startups' 
  | 'Open Source' 
  | 'Security'
  | 'Other';

// Comment interface
export interface Comment {
  id: number;
  by: string;
  text: string;
  time: number;
  parent: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
}
