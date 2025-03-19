
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  email: string | null;
}

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error signing up:", error);
    return { 
      success: false, 
      error: error.message || "Failed to sign up" 
    };
  }
};

/**
 * Sign in an existing user
 */
export const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error signing in:", error);
    return { 
      success: false, 
      error: error.message || "Failed to sign in" 
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error signing out:", error);
    return { 
      success: false, 
      error: error.message || "Failed to sign out" 
    };
  }
};

/**
 * Get the current user profile
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Get additional profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }
    
    return {
      id: user.id,
      email: user.email,
      username: profileData?.username || user.email?.split('@')[0] || null,
      avatarUrl: profileData?.avatar_url || null
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  profile: { username?: string; avatarUrl?: string }
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("User not authenticated");
    }
    
    const updates = {
      ...(profile.username ? { username: profile.username } : {}),
      ...(profile.avatarUrl ? { avatar_url: profile.avatarUrl } : {}),
      updated_at: new Date().toISOString() // Convert Date to ISO string
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update profile" 
    };
  }
};

/**
 * Reset password for a user
 */
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return { 
      success: false, 
      error: error.message || "Failed to reset password" 
    };
  }
};

/**
 * Update user password
 */
export const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating password:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update password" 
    };
  }
};
