"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user/userStore';
import { AllowedRoles } from '@/stores/user/modules';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: AllowedRoles[] | AllowedRoles.ALL;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, hasAnyRole } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (!isAuthenticated) {
          const isAuthed = await checkAuth();
          if (!isAuthed) {
            router.push('/login');
            return;
          }
        }

        // Check if user has IT role (admin access) or has any of the allowed roles
        const isIT = user?.role?.branch === AllowedRoles.IT;
        const isDirectivo = user?.role?.branch === AllowedRoles.DIRECTIVOS;
       
        // TODO: HECKEAR LO HIZO COPILOT!!!!!
        // IT and Directivos have access to everything
        if (isIT || isDirectivo) {
          setHasAccess(true);
        } else if (allowedRoles === AllowedRoles.ALL) {
          // If 'all' is specified, any authenticated user has access
          setHasAccess(true);
        } else if (Array.isArray(allowedRoles)) {
          // Otherwise check if user has any of the allowed roles
          setHasAccess(hasAnyRole(allowedRoles));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking access:', error);
        router.push('/login');
      }
    };

    checkAccess();
  }, [router, isAuthenticated, checkAuth, user, hasAnyRole, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-gray">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V8m0 0V6m0 2h2m-2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-2 text-2xl font-bold text-textDefault">Acceso Denegado</h2>
          <p className="mt-2 text-gray">No tienes permisos para acceder a esta sección. Contacta al administrador si crees que esto es un error.</p>
          <button 
            onClick={() => router.push('/admin')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Volver al Panel Principal
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 