"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import { useUserStore } from '@/stores/userStore';

// Mock data for sports logs
const initialLogs = [
  { 
    id: '1', 
    sport: 'Básquetbol',
    date: '2023-10-15',
    time: '18:00 - 20:00',
    location: 'Cancha Principal',
    instructor: 'Juan Pérez',
    attendees_count: 12,
    notes: 'Entrenamiento regular. Enfoque en ejercicios defensivos.',
    file_url: '/mock-files/basketball-log-20231015.pdf'
  },
  { 
    id: '2', 
    sport: 'Fútbol',
    date: '2023-10-16',
    time: '17:00 - 19:00',
    location: 'Campo A',
    instructor: 'María García',
    attendees_count: 18,
    notes: 'Partido amistoso con el equipo de Ingeniería. Resultado: 3-2.',
    file_url: '/mock-files/soccer-log-20231016.pdf'
  },
  { 
    id: '3', 
    sport: 'Natación',
    date: '2023-10-17',
    time: '08:00 - 10:00',
    location: 'Piscina Olímpica',
    instructor: 'Roberto Johnson',
    attendees_count: 8,
    notes: 'Entrenamiento de resistencia. 2000m de distancia total.',
    file_url: '/mock-files/swimming-log-20231017.pdf'
  },
  { 
    id: '4', 
    sport: 'Vóley',
    date: '2023-10-18',
    time: '19:00 - 21:00',
    location: 'Gimnasio B',
    instructor: 'Sara Williams',
    attendees_count: 14,
    notes: 'Práctica para el próximo torneo. Trabajo en saques y bloqueos.',
    file_url: '/mock-files/volleyball-log-20231018.pdf'
  },
  { 
    id: '5', 
    sport: 'Tenis',
    date: '2023-10-19',
    time: '16:00 - 18:00',
    location: 'Canchas de Tenis',
    instructor: 'David Brown',
    attendees_count: 6,
    notes: 'Mejora de técnica individual. Enfoque en revés.',
    file_url: '/mock-files/tennis-log-20231019.pdf'
  }
];

// Sports options for filtering
const sportOptions = [
  'Todos los Deportes',
  'Básquetbol',
  'Fútbol',
  'Natación',
  'Vóley',
  'Tenis'
];

export default function SportsLogsManagement() {
  const user = useUserStore((state: any) => state.user);
  const [logs, setLogs] = useState(initialLogs);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [sportFilter, setSportFilter] = useState('Todos los Deportes');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter logs based on selected filters
  const filteredLogs = logs.filter(log => {
    // Sport filter
    if (sportFilter !== 'Todos los Deportes' && log.sport !== sportFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter && log.date !== dateFilter) {
      return false;
    }
    
    // Search query (search in sport, location, instructor, and notes)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.sport.toLowerCase().includes(query) ||
        log.location.toLowerCase().includes(query) ||
        log.instructor.toLowerCase().includes(query) ||
        log.notes.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Get the selected log details
  const selectedLogDetails = selectedLog 
    ? logs.find(log => log.id === selectedLog)
    : null;
  
  // Handle log download
  const handleDownload = (fileUrl: string) => {
    // In a real application, this would trigger a file download
    // For this mock, we'll just show an alert
    alert(`Descargando archivo desde: ${fileUrl}`);
    
    // In a real application, you would use something like:
    // window.open(fileUrl, '_blank');
    // or
    // const link = document.createElement('a');
    // link.href = fileUrl;
    // link.download = fileUrl.split('/').pop() || 'sports-log.pdf';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };
  
  return (
    <ProtectedRoute allowedRoles={['admin', 'sports']}>
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Registros Deportivos</h1>
            
            <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <p className="text-gray-500">Ver y descargar registros de actividades deportivas</p>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {/* Sport filter */}
                <select
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value)}
                  className="rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                >
                  {sportOptions.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
                
                {/* Date filter */}
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                />
                
                {/* Search box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar registros..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 pl-8"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-6">
              <div className="bg-surface rounded-2xl shadow-sm border border-black/[.08] dark:border-white/[.12] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deporte
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha y Hora
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Instructor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asistentes
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLogs.map((log) => (
                        <tr 
                          key={log.id} 
                          className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedLog === log.id ? 'bg-primary/5' : ''}`}
                          onClick={() => setSelectedLog(log.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{log.sport}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{log.date}</div>
                            <div className="text-sm text-gray-500">{log.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{log.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{log.instructor}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{log.attendees_count} participantes</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(log.file_url);
                              }}
                              className="text-primary hover:text-primary/80 transition-colors duration-150"
                            >
                              Descargar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {selectedLogDetails && (
              <div className="mt-8">
                <div className="bg-surface rounded-2xl shadow-sm border border-black/[.08] dark:border-white/[.12] overflow-hidden">
                  <div className="px-6 py-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Detalles del Registro: {selectedLogDetails.sport} - {selectedLogDetails.date}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {selectedLogDetails.time} en {selectedLogDetails.location}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedLogDetails.file_url)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar Registro
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-6 py-5 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Instructor
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {selectedLogDetails.instructor}
                        </dd>
                      </div>
                      <div className="bg-white px-6 py-5 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Asistencia
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {selectedLogDetails.attendees_count} participantes
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-6 py-5 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Notas
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {selectedLogDetails.notes}
                        </dd>
                      </div>
                      <div className="bg-white px-6 py-5 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Archivo de Registro
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          <div className="flex items-center">
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="ml-2 flex-1 w-0 truncate">
                              {selectedLogDetails.file_url.split('/').pop()}
                            </span>
                            <div className="ml-4 flex-shrink-0">
                              <button
                                onClick={() => handleDownload(selectedLogDetails.file_url)}
                                className="font-medium text-primary hover:text-primary/80 transition-colors duration-150"
                              >
                                Descargar
                              </button>
                            </div>
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 