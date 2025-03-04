"use client";

import React from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';
import { AllowedRoles } from '@/stores/user/modules';

export default function OrganizationAdminPage() {
  // Datos de ejemplo para la tabla de eventos
  const eventData = [
    {
      id: '1',
      name: 'Conferencia Anual',
      organization: 'CEITBA',
      location: 'Auditorio Principal',
      date: '15 de junio, 2023',
      time: '9:00 - 17:00',
      attendees: '120 registrados',
      status: 'Próximo'
    },
    {
      id: '2',
      name: 'Serie de Talleres',
      organization: 'Club de Robótica',
      location: 'Sala 101',
      date: '10 de julio, 2023',
      time: '14:00 - 16:00',
      attendees: '45 registrados',
      status: 'Próximo'
    },
    {
      id: '3',
      name: 'Hackathon 2023',
      organization: 'IEEE',
      location: 'Campus Central',
      date: '5 de agosto, 2023',
      time: '10:00 - 22:00',
      attendees: '80 registrados',
      status: 'Próximo'
    }
  ];

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'Evento',
      accessor: 'name',
      cell: (event: any) => (
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{event.name}</div>
            <div className="text-sm text-gray-500">{event.location}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Organización',
      accessor: 'organization',
      cell: (event: any) => (
        <div className="text-sm text-gray-900">{event.organization}</div>
      )
    },
    {
      header: 'Fecha',
      accessor: 'date',
      cell: (event: any) => (
        <div>
          <div className="text-sm text-gray-900">{event.date}</div>
          <div className="text-sm text-gray-500">{event.time}</div>
        </div>
      )
    },
    {
      header: 'Asistentes',
      accessor: 'attendees',
      cell: (event: any) => (
        <div className="text-sm text-gray-900">{event.attendees}</div>
      )
    },
    {
      header: 'Estado',
      accessor: 'status',
      cell: (event: any) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {event.status}
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
    <ProtectedRoute allowedRoles={[AllowedRoles.IT, AllowedRoles.DIRECTIVOS, AllowedRoles.EVENTOS]}>
      <AdminLayout>
        <AdminPageHeader 
          title="Organizaciones y Eventos" 
          description="Gestiona organizaciones y eventos"
          action={
            <AdminButton>
              Crear Evento
            </AdminButton>
          }
        />
        
        <div className="mt-6">
          <AdminCard>
            <AdminCardHeader 
              title="Eventos" 
              description="Eventos próximos y pasados de la organización"
            />
            <AdminTable 
              columns={columns}
              data={eventData}
            />
          </AdminCard>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 