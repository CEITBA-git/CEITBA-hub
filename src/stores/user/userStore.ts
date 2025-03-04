import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { AllowedRoles, Role, User } from './modules';
import { fetchUserDetails } from '@/app/api/api';


interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasRole: (role: AllowedRoles) => boolean;
  hasAnyRole: (roles: AllowedRoles[]) => boolean;
  setUser: (email: string) => Promise<void>;
  clearUser: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      hasRole: (role: AllowedRoles) => {
        const { user } = get();
        if (!user) return false;
        return user.role?.branch === role; 
      },

      hasAnyRole: (roles: AllowedRoles[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.some(role => user.role?.branch === role);
      },

      setUser: async (email: string) => {
        if (!email) return;
        console.log('email', email);
        const userDetails = await fetchUserDetails(email);
        set({ user: userDetails, isAuthenticated: true, error: null });
      },
      
      clearUser: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false, error: null });
        } catch (error: any) {
          set({ error: error.message });
        }
      },
      
      checkAuth: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return false;

          const userDetails = await fetchUserDetails(session.user.email!);
          set({
            user: userDetails,
            isAuthenticated: true
          });

          return true;

        } catch (error) {
          throw error;
        }
      }
    }),
    {
      // Name is used to identify the storage in the browser
      name: 'user-storage',
      // Partialize is used to only persist the user object
      partialize: (state) => ({ user: state.user }),
    }
  )
); 

