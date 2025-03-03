import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user with matching credentials
          const user = mockUsers.find(
            u => u.email === email && u.password === password
          );
          
          if (user) {
            // Remove password from user object before storing
            const { password, ...userWithoutPassword } = user;
            set({ user: userWithoutPassword as User, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ 
              error: 'Credenciales incorrectas. Por favor verifica tu email y contraseña.', 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          set({ 
            error: 'Error al iniciar sesión. Por favor intenta nuevamente.', 
            isLoading: false 
          });
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },
      
      checkAuth: async () => {
        // In a real app, this would verify the token with the server
        const { user } = get();
        return !!user;
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
); 