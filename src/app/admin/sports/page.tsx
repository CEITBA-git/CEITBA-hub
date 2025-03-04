"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';
import AdminSearchFilter from '@/app/components/admin/AdminSearchFilter';
import Link from 'next/link';
import { AllowedRoles } from '@/stores/user/modules';

// Define interfaces for type safety
interface Sport {
  id: string;
  name: string;
  members: string;
  status: string;
}

export default function SportsAdminPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchSports = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call:
        // const response = await axios.get('https://ceitba.org.ar/api/v1/sports');
        // setSports(response.data);
        
        // For now, we'll use mock data but in a way that simulates an API call
        setTimeout(() => {
          const mockSports = [
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
          setSports(mockSports);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Error fetching sports:', err);
        setError('Error al cargar los deportes. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  // Filter sports based on search query
  const filteredSports = sports.filter((sport: Sport) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      sport.name.toLowerCase().includes(query) ||
      sport.status.toLowerCase().includes(query)
    );
  });

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'Nombre',
      accessor: 'name',
      cell: (sport: Sport) => (
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
      cell: (sport: Sport) => (
        <div className="text-sm text-gray-900">{sport.members}</div>
      )
    },
    {
      header: 'Estado',
      accessor: 'status',
      cell: (sport: Sport) => (
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
    <ProtectedRoute allowedRoles={[AllowedRoles.DEPORTES, AllowedRoles.DIRECTIVOS, AllowedRoles.IT]}>
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
        
        <div className="mt-6 mb-4">
          <AdminSearchFilter
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar deportes..."
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6">
          <AdminCard>
            <AdminCardHeader 
              title="Deportes" 
              description="Todas las actividades deportivas disponibles"
            />
            {loading ? (
              <div className="p-6 text-center">Cargando deportes...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              <AdminTable 
                columns={columns}
                data={filteredSports}
              />
            )}
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