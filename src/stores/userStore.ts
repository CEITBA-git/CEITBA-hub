import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export type Role = 'admin' | 'sports' | 'organization' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  avatar?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@admin.com',
    password: 'admin123',
    name: 'Admin User',
    roles: ['admin']
  },
  {
    id: '2',
    email: 'sports@example.com',
    password: 'sports123',
    name: 'Sports Manager',
    roles: ['sports']
  },
  {
    id: '3',
    email: 'organization@example.com',
    password: 'org123',
    name: 'Organization Manager',
    roles: ['organization']
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      hasRole: (role: Role) => {
        const { user } = get();
        if (!user) return false;
        return user.roles.includes(role);
      },
      
      hasAnyRole: (roles: Role[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.some(role => user.roles.includes(role));
      },
      
      setUser: (user: User) => {
        set({ user, isAuthenticated: true, error: null });
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
          if (session) {
            const { user } = session;
            set({
              user: {
                id: user.id,
                email: user.email || '',
                name: user.user_metadata.full_name || user.email?.split('@')[0] || '',
                roles: user.user_metadata.roles || ['member'],
                avatar: user.user_metadata.avatar_url
              },
              isAuthenticated: true
            });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
); 