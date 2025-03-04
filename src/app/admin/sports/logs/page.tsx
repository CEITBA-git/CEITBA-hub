"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminTable from '@/app/components/admin/AdminTable';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminSearchFilter from '@/app/components/admin/AdminSearchFilter';
import Link from 'next/link';
import { AllowedRoles } from '@/stores/user/modules';

export default function SportsLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Datos de ejemplo para la tabla de registros de clases
  const classLogsData = [
    {
      id: '1',
      sport: 'Fútbol',
      date: '15/06/2023',
      time: '14:30 - 16:00',
      instructor: 'Carlos Rodríguez',
      attendees: 18,
      location: 'Cancha Principal',
      activities: 'Entrenamiento táctico, práctica de penales'
    },
    {
      id: '2',
      sport: 'Básquetbol',
      date: '14/06/2023',
      time: '10:15 - 12:00',
      instructor: 'María García',
      attendees: 12,
      location: 'Gimnasio Cubierto',
      activities: 'Ejercicios de tiro, partido amistoso'
    },
    {
      id: '3',
      sport: 'Tenis',
      date: '13/06/2023',
      time: '16:45 - 18:30',
      instructor: 'Juan Pérez',
      attendees: 8,
      location: 'Canchas de Tenis',
      activities: 'Técnica de saque, juego de dobles'
    },
    {
      id: '4',
      sport: 'Natación',
      date: '12/06/2023',
      time: '09:30 - 11:00',
      instructor: 'Ana Martínez',
      attendees: 15,
      location: 'Piscina Olímpica',
      activities: 'Técnica de respiración, entrenamiento de resistencia'
    },
    {
      id: '5',
      sport: 'Vóley',
      date: '11/06/2023',
      time: '11:20 - 13:00',
      instructor: 'Roberto Sánchez',
      attendees: 14,
      location: 'Cancha de Vóley',
      activities: 'Práctica de saques, partido interno'
    }
  ];

  // Filtrar registros según la búsqueda
  const filteredLogs = classLogsData.filter(log => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      log.sport.toLowerCase().includes(query) ||
      log.instructor.toLowerCase().includes(query) ||
      log.activities.toLowerCase().includes(query) ||
      log.location.toLowerCase().includes(query)
    );
  });

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'Deporte',
      accessor: 'sport',
      cell: (log: any) => (
        <div className="text-sm font-medium text-gray-900">{log.sport}</div>
      )
    },
    {
      header: 'Fecha y Hora',
      accessor: 'date',
      cell: (log: any) => (
        <div>
          <div className="text-sm text-gray-900">{log.date}</div>
          <div className="text-sm text-gray-500">{log.time}</div>
        </div>
      )
    },
    {
      header: 'Instructor',
      accessor: 'instructor',
      cell: (log: any) => (
        <div className="text-sm text-gray-900">{log.instructor}</div>
      )
    },
    {
      header: 'Asistentes',
      accessor: 'attendees',
      cell: (log: any) => (
        <div className="text-sm text-gray-900">{log.attendees} personas</div>
      )
    },
    {
      header: 'Ubicación',
      accessor: 'location',
      cell: (log: any) => (
        <div className="text-sm text-gray-900">{log.location}</div>
      )
    },
    {
      header: 'Actividades',
      accessor: 'activities',
      cell: (log: any) => (
        <div className="text-sm text-gray-500 max-w-xs truncate">{log.activities}</div>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: () => (
        <div className="text-right">
          <AdminButton variant="secondary" size="sm" className="mr-2">
            Ver asistencia
          </AdminButton>
          <AdminButton variant="secondary" size="sm">
            Editar
          </AdminButton>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={[AllowedRoles.DEPORTES, AllowedRoles.DIRECTIVOS, AllowedRoles.IT]}>
      <AdminLayout>
        <AdminPageHeader 
          title="Registros de Clases Deportivas" 
          description="Registro de asistencia y actividades de cada clase"
          action={
            <div className="flex space-x-3">
              <AdminButton>
                Registrar Nueva Clase
              </AdminButton>
              <Link href="/admin/sports">
                <AdminButton variant="secondary">
                  Volver a Deportes
                </AdminButton>
              </Link>
            </div>
          }
        />
        
        <div className="mt-6 mb-4">
          <AdminSearchFilter
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar en registros..."
          />
        </div>
        
        <AdminCard>
          <AdminCardHeader 
            title="Clases Recientes" 
            description="Registro de las últimas clases deportivas realizadas"
          />
          <AdminTable 
            columns={columns}
            data={filteredLogs}
          />
        </AdminCard>
      </AdminLayout>
    </ProtectedRoute>
  );
} 