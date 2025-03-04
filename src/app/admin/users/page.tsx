"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';
import AdminSearchFilter from '@/app/components/admin/AdminSearchFilter';
import { AllowedRoles } from '@/stores/user/modules';

// Define interfaces for type safety
interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status?: string;
}

export default function UsersAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ceitba.org.ar/api/v1/user/all');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError("Error al cargar los usuarios. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuarios según la búsqueda
  const filteredUsers = users.filter((user: User) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      (user.roles && user.roles.some((role: string) => role.toLowerCase().includes(query)))
    );
  });

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'Nombre',
      accessor: 'name',
      cell: (user: User) => {
        const initials = user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '';
        
        return (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {initials}
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Email',
      accessor: 'email',
      cell: (user: User) => (
        <div className="text-sm text-gray-900">{user.email}</div>
      )
    },
    {
      header: 'Roles',
      accessor: 'roles',
      cell: (user: User) => (
        <div>
          {user.roles && user.roles.map((role: string, index: number) => (
            <span 
              key={index}
              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-1"
            >
              {role}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: 'status',
      cell: (user: User) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {user.status || 'Activo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: () => (
        <div className="text-right">
          <AdminButton variant="secondary" size="sm">
            Editar
          </AdminButton>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={[AllowedRoles.IT, AllowedRoles.DIRECTIVOS]}>
      <AdminLayout>
        <AdminPageHeader 
          title="Gestión de Usuarios" 
          description="Administra cuentas de usuario y permisos"
          action={
            <AdminButton>
              Agregar Usuario
            </AdminButton>
          }
        />
        
        <div className="mt-6 mb-4">
          <AdminSearchFilter
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar usuarios..."
          />
        </div>
        
        <AdminCard>
          <AdminCardHeader 
            title="Usuarios" 
            description="Todos los usuarios registrados en el sistema"
          />
          
          {loading ? (
            <div className="p-6 text-center">Cargando usuarios...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
            <AdminTable 
              columns={columns}
              data={filteredUsers}
            />
          )}
        </AdminCard>
      </AdminLayout>
    </ProtectedRoute>
  );
} 