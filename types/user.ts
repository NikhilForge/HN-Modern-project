// User profile interface
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

// Saved post interface (from Supabase database)
export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  title: string;
  url?: string;
  saved_at: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}
