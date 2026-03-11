import { createClient } from '@supabase/supabase-js';
import { User, SavedPost } from '@/types/user';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sign in with OAuth provider
 * @param provider - 'google' or 'github'
 */
export async function signInWithProvider(provider: 'google' | 'github') {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Get current user
 * @returns User object or null
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
    created_at: user.created_at || new Date().toISOString()
  };
}

/**
 * Save a post to bookmarks
 * @param userId - User ID
 * @param postId - Post ID
 * @param title - Post title
 * @param url - Post URL
 */
export async function savePost(userId: string, postId: string, title: string, url?: string) {
  const { data, error } = await supabase
    .from('saved_posts')
    .insert({
      user_id: userId,
      post_id: postId,
      title: title,
      url: url,
      saved_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving post:', error);
    throw error;
  }
  
  return data;
}

/**
 * Remove a post from bookmarks
 * @param userId - User ID
 * @param postId - Post ID
 */
export async function unsavePost(userId: string, postId: string) {
  const { error } = await supabase
    .from('saved_posts')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);
  
  if (error) {
    console.error('Error unsaving post:', error);
    throw error;
  }
}

/**
 * Check if a post is saved
 * @param userId - User ID
 * @param postId - Post ID
 * @returns Boolean indicating if post is saved
 */
export async function isPostSaved(userId: string, postId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking if post is saved:', error);
    return false;
  }
  
  return !!data;
}

/**
 * Get all saved posts for a user
 * @param userId - User ID
 * @returns Array of saved posts
 */
export async function getSavedPosts(userId: string): Promise<SavedPost[]> {
  const { data, error } = await supabase
    .from('saved_posts')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching saved posts:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get saved posts count for a user
 * @param userId - User ID
 * @returns Count of saved posts
 */
export async function getSavedPostsCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('saved_posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching saved posts count:', error);
    return 0;
  }
  
  return count || 0;
}
