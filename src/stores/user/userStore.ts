import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { AllowedRoles, User } from './modules';
import { fetchUserDetails } from '@/app/api/api';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; // Track when user data was last fetched
  hasRole: (role: AllowedRoles) => boolean;
  hasAnyRole: (roles: AllowedRoles[]) => boolean;
  setUser: (email: string) => Promise<void>;
  clearUser: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  initializeFromStorage: () => void;
}

// Cache expiration time (5 minutes in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastFetched: null,

      // Initialize the store from persisted storage
      initializeFromStorage: () => {
        const { user, lastFetched } = get();
        if (user && lastFetched) {
          // If we have user data in storage, set authenticated to true
          set({ isAuthenticated: true });
        }
      },

      hasRole: (role: AllowedRoles) => {
        const { user } = get();
        if (!user || !user.role) return false;
        return user.role.branch === role; 
      },

      hasAnyRole: (roles: AllowedRoles[]) => {
        const { user } = get();
        if (!user || !user.role) return false;
        return roles.some(role => user.role?.branch === role);
      },

      setUser: async (email: string) => {
        if (!email) return;
        
        const { user, lastFetched } = get();
        const now = Date.now();
        
        // If we already have user data for this email and it's recent, don't fetch again
        if (
          user && 
          user.email === email && 
          lastFetched && 
          (now - lastFetched) < CACHE_EXPIRATION
        ) {
          set({ isAuthenticated: true, error: null });
          return;
        }
        
        try {
          set({ isLoading: true });
          const userDetails = await fetchUserDetails(email);
          
          // Ensure the user object has all required properties
          if (!userDetails.role) {
            throw new Error('User role information is missing');
          }
          
          set({ 
            user: userDetails, 
            isAuthenticated: true, 
            error: null,
            lastFetched: now,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Error setting user:', error);
          set({ 
            error: error.message || 'Error fetching user details',
            isLoading: false
          });
        }
      },
      
      clearUser: () => {
        set({ user: null, isAuthenticated: false, error: null, lastFetched: null });
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false, error: null, lastFetched: null });
        } catch (error: any) {
          set({ error: error.message });
        }
      },
      
      checkAuth: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return false;

          const { user, lastFetched } = get();
          const now = Date.now();
          
          // If we already have user data for this email and it's recent, don't fetch again
          if (
            user && 
            user.email === session.user.email && 
            lastFetched && 
            (now - lastFetched) < CACHE_EXPIRATION
          ) {
            set({ isAuthenticated: true });
            return true;
          }
          
          // Otherwise fetch fresh user data
          const userDetails = await fetchUserDetails(session.user.email!);
          set({
            user: userDetails,
            isAuthenticated: true,
            lastFetched: now
          });

          return true;
        } catch (error) {
          console.error('Error checking auth:', error);
          throw error;
        }
      }
    }),
    {
      // Name is used to identify the storage in the browser
      name: 'user-storage',
      // Persist user data and the timestamp of when it was last fetched
      partialize: (state) => ({ 
        user: state.user,
        lastFetched: state.lastFetched
      }),
      // Add an onRehydrateStorage callback to initialize the store when it's loaded from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeFromStorage();
        }
      }
    }
  )
); 

