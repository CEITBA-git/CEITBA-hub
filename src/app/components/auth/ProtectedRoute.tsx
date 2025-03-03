"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user/userStore';
import { AllowedRoles } from '@/stores/user/modules';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AllowedRoles[];
}

export const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, checkAuth, hasAnyRole } = useUserStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = () => {
      setIsLoading(true);
      
      // Check if user is authenticated
      checkAuth()
        .then(isAuthenticated => {
          if (!isAuthenticated) {
            // Redirect to login page with return URL
            router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            return;
          }
          
          // Check if user has required role
          if (allowedRoles.length > 0) {
            if (hasAnyRole(allowedRoles)) {
              setIsAuthorized(true);
            } else {
              setIsAuthorized(false);
            }
          } else {
            setIsAuthorized(true);
          }
          
          setIsLoading(false);
        });
    };
    
    verifyAuth();
  }, [user, router, allowedRoles, checkAuth, hasAnyRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Acceso denegado</h3>
              <div className="mt-2 text-sm">
                <p>No tienes los permisos necesarios para acceder a esta página.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Volver al Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 