"use client";

import React from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';
import Link from 'next/link';

export default function SportsAdminPage() {
  // Datos de ejemplo para la tabla de deportes
  const sportsData = [
    {
      id: '1',
      name: 'Fútbol',
      members: '42 miembros',
      status: 'Activo'
    },
    {
      id: '2',
      name: 'Básquetbol',
      members: '28 miembros',
      status: 'Activo'
    },
    {
      id: '3',
      name: 'Tenis',
      members: '15 miembros',
      status: 'Activo'
    },
    {
      id: '4',
      name: 'Natación',
      members: '30 miembros',
      status: 'Activo'
    },
    {
      id: '5',
      name: 'Vóley',
      members: '24 miembros',
      status: 'Inactivo'
    }
  ];

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'Nombre',
      accessor: 'name',
      cell: (sport: any) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-textDefault">{sport.name}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Miembros',
      accessor: 'members',
      cell: (sport: any) => (
        <div className="text-sm text-gray-900">{sport.members}</div>
      )
    },
    {
      header: 'Estado',
      accessor: 'status',
      cell: (sport: any) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          sport.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {sport.status}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: () => (
        <div className="text-right">
          <AdminButton variant="secondary" size="sm" className="mr-2">Editar</AdminButton>
          <AdminButton variant="secondary" size="sm">Ver</AdminButton>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'sports']}>
      <AdminLayout>
        <AdminPageHeader 
          title="Gestión de Deportes" 
          description="Administra las actividades deportivas y equipos"
          action={
            <AdminButton>
              Agregar Deporte
            </AdminButton>
          }
        />
        
        <div className="mt-6 grid grid-cols-1 gap-6">
          <AdminCard>
            <AdminCardHeader 
              title="Deportes" 
              description="Todas las actividades deportivas disponibles"
            />
            <AdminTable 
              columns={columns}
              data={sportsData}
            />
          </AdminCard>
          
          <Link href="/admin/sports/logs">
            <AdminButton variant="secondary">
              Ver Registros de Deportes
            </AdminButton>
          </Link>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 