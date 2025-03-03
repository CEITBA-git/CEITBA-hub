"use client";

import React from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { useUserStore } from '@/stores/userStore';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import Link from 'next/link';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminCardContent from '@/app/components/admin/AdminCardContent';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminButton from '@/app/components/admin/AdminButton';

export default function AdminDashboard() {
  const user = useUserStore((state: any) => state.user);
  
  return (
    <ProtectedRoute allowedRoles={['admin', 'sports', 'organization']}>
      <AdminLayout>
        <AdminPageHeader 
          title="Panel de Administración" 
          description="Bienvenido al panel de administración del CEITBA"
        />
        
        <div className="mt-6">
          <AdminCard>
            <AdminCardHeader 
              title={`Bienvenido, ${user?.name}`} 
              description={`Has iniciado sesión como: ${user?.roles.join(', ')}`}
            />
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-6 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Email
                  </dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {user?.email}
                  </dd>
                </div>
                <div className="bg-white px-6 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    ID de Usuario
                  </dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {user?.id}
                  </dd>
                </div>
              </dl>
            </div>
          </AdminCard>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AdminCard>
            <AdminCardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
                  <div className="mt-2">
                    <Link href="/admin/users">
                      <AdminButton variant="primary" size="sm">
                        Ver Usuarios
                      </AdminButton>
                    </Link>
                  </div>
                </div>
              </div>
            </AdminCardContent>
          </AdminCard>
          
          <AdminCard>
            <AdminCardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Deportes</h3>
                  <div className="mt-2">
                    <Link href="/admin/sports">
                      <AdminButton variant="primary" size="sm">
                        Gestionar Deportes
                      </AdminButton>
                    </Link>
                  </div>
                </div>
              </div>
            </AdminCardContent>
          </AdminCard>
          
          <AdminCard>
            <AdminCardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Beneficios</h3>
                  <div className="mt-2">
                    <Link href="/admin/benefits">
                      <AdminButton variant="primary" size="sm">
                        Gestionar Beneficios
                      </AdminButton>
                    </Link>
                  </div>
                </div>
              </div>
            </AdminCardContent>
          </AdminCard>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 