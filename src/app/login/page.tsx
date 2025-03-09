"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/user/userStore';
import type { AuthError } from '@supabase/supabase-js';

interface LoginError {
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser, clearUser, user, isAuthenticated } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is already authenticated, redirect to admin
    if (isAuthenticated && user) {
      router.push('/admin');
      return;
    }

    // Check for authentication state on component mount
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          const email = data.session.user.email;
          if (email?.endsWith('@itba.edu.ar')) {
            await setUser(data.session.user.email as string);
            router.push('/admin');
          } else if (email) {
            // User is logged in but doesn't have ITBA email
            await supabase.auth.signOut();
            setError('No tienes permisos para acceder a este sistema, se requiere un correo ITBA.');
            clearUser();
          }
        }
      } catch (error) {
        const loginError = error as LoginError;
        setError(loginError.message || 'Error checking authentication');
      }
    };
    
    checkAuth();
  }, [router, setUser, clearUser, isAuthenticated, user]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `https://ceitba.org.ar/auth/callback`,
          queryParams: {
            hd: 'itba.edu.ar' 
          }
        },
      });

      if (!error) {
        // IMPORTANT! Set user data from Google provider to our public.user table
        await supabase.rpc('sync_google_user_data');
      }
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message || 'Error al iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-textDefault">
            CEITBA Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray">
            Inicia sesión para acceder al panel de administración
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <div className="flex flex-col space-y-4">
            <p className="text-center text-sm text-gray-600 mb-4">
              Utiliza tu cuenta institucional de ITBA para acceder al sistema
            </p>
            
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-gray/20 rounded-md shadow-sm text-sm font-medium text-textDefault bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
              </span>
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Solo se permite el acceso con cuentas institucionales de ITBA (@itba.edu.ar)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 