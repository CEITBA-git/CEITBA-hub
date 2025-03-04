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
import { AllowedRoles } from '@/stores/user/modules';

// Define interfaces for type safety
interface Event {
  id: string;
  name: string;
  organization: string;
  location: string;
  date: string;
  time: string;
  attendees: string;
  status: string;
}

export default function OrganizationAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call:
        // const response = await fetch('https://ceitba.org.ar/api/v1/events');
        // const data = await response.json();
        // setEvents(data);
        
        // For now, we'll use mock data but in a way that simulates an API call
        setTimeout(() => {
          const mockEvents = [
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
          setEvents(mockEvents);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Error al cargar los eventos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter((event: Event) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      event.name.toLowerCase().includes(query) ||
      event.organization.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );
  });

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'Evento',
      accessor: 'name',
      cell: (event: Event) => (
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
      cell: (event: Event) => (
        <div className="text-sm text-gray-900">{event.organization}</div>
      )
    },
    {
      header: 'Fecha',
      accessor: 'date',
      cell: (event: Event) => (
        <div>
          <div className="text-sm text-gray-900">{event.date}</div>
          <div className="text-sm text-gray-500">{event.time}</div>
        </div>
      )
    },
    {
      header: 'Asistentes',
      accessor: 'attendees',
      cell: (event: Event) => (
        <div className="text-sm text-gray-900">{event.attendees}</div>
      )
    },
    {
      header: 'Estado',
      accessor: 'status',
      cell: (event: Event) => (
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
        
        <div className="mt-6 mb-4">
          <AdminSearchFilter
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar eventos..."
          />
        </div>
        
        <div className="mt-6">
          <AdminCard>
            <AdminCardHeader 
              title="Eventos" 
              description="Eventos próximos y pasados de la organización"
            />
            {loading ? (
              <div className="p-6 text-center">Cargando eventos...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              <AdminTable 
                columns={columns}
                data={filteredEvents}
              />
            )}
          </AdminCard>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 