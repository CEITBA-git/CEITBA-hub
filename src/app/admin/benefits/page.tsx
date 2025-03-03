"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import { useUserStore } from '@/stores/userStore';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminCardContent from '@/app/components/admin/AdminCardContent';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminFormField from '@/app/components/admin/AdminFormField';
import AdminTable from '@/app/components/admin/AdminTable';

// Mock data for benefits based on your database schema
const initialBenefits = [
  { 
    id: '1', 
    name: 'Descuento en Gimnasio', 
    inscription_url: 'https://example.com/gym-signup',
    max_capacity: 100,
    notes: 'Válido para todos los miembros. Muestra tu tarjeta de membresía en la recepción del gimnasio.',
    price: 1500
  },
  { 
    id: '2', 
    name: 'Acceso a Piscina', 
    inscription_url: 'https://example.com/pool-access',
    max_capacity: 50,
    notes: 'Disponible de lunes a viernes, de 8am a 8pm.',
    price: 2000
  },
  { 
    id: '3', 
    name: 'Cursos de Idiomas', 
    inscription_url: 'https://example.com/language-courses',
    max_capacity: 30,
    notes: 'Cursos disponibles de inglés, francés y alemán.',
    price: 3500
  },
];

// Mock data for benefit times
const initialBenefitTimes = [
  { 
    id: '1', 
    benefit_id: '1', 
    day: 'Lunes', 
    hour_from: '09:00', 
    hour_to: '21:00', 
    place: 'Gimnasio Principal',
    place_url: 'https://maps.example.com/main-gym'
  },
  { 
    id: '2', 
    benefit_id: '1', 
    day: 'Miércoles', 
    hour_from: '09:00', 
    hour_to: '21:00', 
    place: 'Gimnasio Principal',
    place_url: 'https://maps.example.com/main-gym'
  },
  { 
    id: '3', 
    benefit_id: '2', 
    day: 'Martes', 
    hour_from: '08:00', 
    hour_to: '20:00', 
    place: 'Piscina',
    place_url: 'https://maps.example.com/pool'
  },
  { 
    id: '4', 
    benefit_id: '2', 
    day: 'Jueves', 
    hour_from: '08:00', 
    hour_to: '20:00', 
    place: 'Piscina',
    place_url: 'https://maps.example.com/pool'
  },
  { 
    id: '5', 
    benefit_id: '3', 
    day: 'Lunes', 
    hour_from: '18:00', 
    hour_to: '20:00', 
    place: 'Centro de Idiomas',
    place_url: 'https://maps.example.com/language-center'
  },
  { 
    id: '6', 
    benefit_id: '3', 
    day: 'Viernes', 
    hour_from: '18:00', 
    hour_to: '20:00', 
    place: 'Centro de Idiomas',
    place_url: 'https://maps.example.com/language-center'
  },
];

// Day options in Spanish
const dayOptions = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

export default function BenefitsManagement() {
  const user = useUserStore((state: any) => state.user);
  const [benefits, setBenefits] = useState(initialBenefits);
  const [benefitTimes, setBenefitTimes] = useState(initialBenefitTimes);
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [newBenefit, setNewBenefit] = useState({
    name: '',
    inscription_url: '',
    max_capacity: 0,
    notes: '',
    price: 0
  });
  const [newTime, setNewTime] = useState({
    benefit_id: '',
    day: 'Lunes',
    hour_from: '',
    hour_to: '',
    place: '',
    place_url: ''
  });
  
  // Reset new time benefit_id when selected benefit changes
  React.useEffect(() => {
    if (selectedBenefit) {
      setNewTime({...newTime, benefit_id: selectedBenefit});
    }
  }, [selectedBenefit]);
  
  const handleAddBenefit = () => {
    const id = Date.now().toString();
    setBenefits([
      ...benefits,
      {
        id,
        ...newBenefit
      }
    ]);
    setNewBenefit({
      name: '',
      inscription_url: '',
      max_capacity: 0,
      notes: '',
      price: 0
    });
    setIsAddingBenefit(false);
    setSelectedBenefit(id);
  };
  
  const handleAddTime = () => {
    setBenefitTimes([
      ...benefitTimes,
      {
        id: Date.now().toString(),
        ...newTime
      }
    ]);
    setNewTime({
      benefit_id: selectedBenefit || '',
      day: 'Lunes',
      hour_from: '',
      hour_to: '',
      place: '',
      place_url: ''
    });
    setIsAddingTime(false);
  };
  
  const handleDeleteBenefit = (id: string) => {
    setBenefits(benefits.filter(benefit => benefit.id !== id));
    setBenefitTimes(benefitTimes.filter(time => time.benefit_id !== id));
    if (selectedBenefit === id) {
      setSelectedBenefit(null);
    }
  };
  
  const handleDeleteTime = (id: string) => {
    setBenefitTimes(benefitTimes.filter(time => time.id !== id));
  };
  
  // Get the selected benefit details
  const selectedBenefitDetails = selectedBenefit 
    ? benefits.find(benefit => benefit.id === selectedBenefit)
    : null;
  
  // Get times for the selected benefit
  const filteredTimes = selectedBenefit
    ? benefitTimes.filter(time => time.benefit_id === selectedBenefit)
    : [];
  
  // Table columns for times
  const timeColumns = [
    {
      header: 'Día',
      accessor: 'day',
      cell: (time: any) => (
        <div className="text-sm font-medium text-gray-900">{time.day}</div>
      )
    },
    {
      header: 'Horario',
      accessor: 'time',
      cell: (time: any) => (
        <div className="text-sm text-gray-900">{time.hour_from} - {time.hour_to}</div>
      )
    },
    {
      header: 'Ubicación',
      accessor: 'place',
      cell: (time: any) => (
        <div>
          <div className="text-sm text-gray-900">{time.place}</div>
          <div className="text-xs text-gray-500">
            <a href={time.place_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors duration-150">
              Ver Ubicación
            </a>
          </div>
        </div>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: (time: any) => (
        <div className="text-right">
          <AdminButton
            variant="danger"
            size="sm"
            onClick={() => handleDeleteTime(time.id)}
          >
            Eliminar
          </AdminButton>
        </div>
      )
    }
  ];
  
  return (
    <ProtectedRoute allowedRoles={['admin', 'organization']}>
      <AdminLayout>
        <AdminPageHeader 
          title="Gestión de Beneficios" 
          description="Administra los beneficios disponibles para los miembros"
          action={
            <AdminButton
              onClick={() => setIsAddingBenefit(true)}
              icon={
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Agregar Beneficio
            </AdminButton>
          }
        />
        
        {isAddingBenefit && (
          <AdminCard className="mt-6">
            <AdminCardHeader 
              title="Agregar Nuevo Beneficio" 
            />
            <AdminCardContent>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <AdminFormField
                  label="Nombre"
                  id="name"
                  required
                  className="sm:col-span-3"
                >
                  <input
                    type="text"
                    id="name"
                    value={newBenefit.name}
                    onChange={(e) => setNewBenefit({...newBenefit, name: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                    required
                  />
                </AdminFormField>

                <AdminFormField
                  label="URL de Inscripción"
                  id="inscription_url"
                  className="sm:col-span-3"
                >
                  <input
                    type="text"
                    id="inscription_url"
                    value={newBenefit.inscription_url}
                    onChange={(e) => setNewBenefit({...newBenefit, inscription_url: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                  />
                </AdminFormField>

                <AdminFormField
                  label="Capacidad Máxima"
                  id="max_capacity"
                  className="sm:col-span-2"
                >
                  <input
                    type="number"
                    id="max_capacity"
                    value={newBenefit.max_capacity}
                    onChange={(e) => setNewBenefit({...newBenefit, max_capacity: parseInt(e.target.value)})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                  />
                </AdminFormField>

                <AdminFormField
                  label="Precio"
                  id="price"
                  className="sm:col-span-2"
                >
                  <input
                    type="number"
                    id="price"
                    value={newBenefit.price}
                    onChange={(e) => setNewBenefit({...newBenefit, price: parseInt(e.target.value)})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                  />
                </AdminFormField>

                <AdminFormField
                  label="Notas"
                  id="notes"
                  className="sm:col-span-6"
                >
                  <textarea
                    id="notes"
                    rows={3}
                    value={newBenefit.notes}
                    onChange={(e) => setNewBenefit({...newBenefit, notes: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                  />
                </AdminFormField>
              </div>
              
              <div className="mt-5 flex justify-end space-x-3">
                <AdminButton
                  variant="secondary"
                  onClick={() => setIsAddingBenefit(false)}
                >
                  Cancelar
                </AdminButton>
                <AdminButton
                  onClick={handleAddBenefit}
                >
                  Guardar
                </AdminButton>
              </div>
            </AdminCardContent>
          </AdminCard>
        )}
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AdminCard>
              <AdminCardHeader 
                title="Beneficios" 
              />
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {benefits.map((benefit) => (
                    <li 
                      key={benefit.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedBenefit === benefit.id ? 'bg-primary/5' : ''}`}
                      onClick={() => setSelectedBenefit(benefit.id)}
                    >
                      <div className="px-6 py-4">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium text-gray-900">{benefit.name}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBenefit(benefit.id);
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors duration-150"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Capacidad: {benefit.max_capacity} | Precio: ${benefit.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </AdminCard>
          </div>
          
          <div className="lg:col-span-2">
            {selectedBenefitDetails ? (
              <AdminCard>
                <AdminCardHeader 
                  title={selectedBenefitDetails.name}
                  action={
                    <AdminButton
                      onClick={() => setIsAddingTime(true)}
                      size="sm"
                      icon={
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      }
                    >
                      Agregar Horario
                    </AdminButton>
                  }
                />
                
                <AdminCardContent>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <h4 className="text-sm font-medium text-gray-500">URL de Inscripción</h4>
                      <div className="mt-1">
                        <a 
                          href={selectedBenefitDetails.inscription_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors duration-150"
                        >
                          {selectedBenefitDetails.inscription_url}
                        </a>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <h4 className="text-sm font-medium text-gray-500">Capacidad Máxima</h4>
                      <div className="mt-1 text-sm text-gray-900">
                        {selectedBenefitDetails.max_capacity} personas
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <h4 className="text-sm font-medium text-gray-500">Precio</h4>
                      <div className="mt-1 text-sm text-gray-900">
                        ${selectedBenefitDetails.price}
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <h4 className="text-sm font-medium text-gray-500">Notas</h4>
                      <div className="mt-1 text-sm text-gray-900">
                        {selectedBenefitDetails.notes}
                      </div>
                    </div>
                  </div>
                </AdminCardContent>
                
                {isAddingTime && (
                  <div className="px-6 py-5 border-t border-gray-200">
                    <h4 className="text-base font-medium text-gray-900 mb-4">
                      Agregar Nuevo Horario
                    </h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <AdminFormField
                        label="Día"
                        id="day"
                        className="sm:col-span-2"
                      >
                        <select
                          id="day"
                          value={newTime.day}
                          onChange={(e) => setNewTime({...newTime, day: e.target.value})}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                        >
                          {dayOptions.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </AdminFormField>

                      <AdminFormField
                        label="Hora de Inicio"
                        id="hour_from"
                        className="sm:col-span-2"
                      >
                        <input
                          type="time"
                          id="hour_from"
                          value={newTime.hour_from}
                          onChange={(e) => setNewTime({...newTime, hour_from: e.target.value})}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                        />
                      </AdminFormField>

                      <AdminFormField
                        label="Hora de Fin"
                        id="hour_to"
                        className="sm:col-span-2"
                      >
                        <input
                          type="time"
                          id="hour_to"
                          value={newTime.hour_to}
                          onChange={(e) => setNewTime({...newTime, hour_to: e.target.value})}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                        />
                      </AdminFormField>

                      <AdminFormField
                        label="Lugar"
                        id="place"
                        className="sm:col-span-3"
                      >
                        <input
                          type="text"
                          id="place"
                          value={newTime.place}
                          onChange={(e) => setNewTime({...newTime, place: e.target.value})}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                        />
                      </AdminFormField>

                      <AdminFormField
                        label="URL del Lugar"
                        id="place_url"
                        className="sm:col-span-3"
                      >
                        <input
                          type="text"
                          id="place_url"
                          value={newTime.place_url}
                          onChange={(e) => setNewTime({...newTime, place_url: e.target.value})}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                        />
                      </AdminFormField>
                    </div>
                    
                    <div className="mt-5 flex justify-end space-x-3">
                      <AdminButton
                        variant="secondary"
                        onClick={() => setIsAddingTime(false)}
                      >
                        Cancelar
                      </AdminButton>
                      <AdminButton
                        onClick={handleAddTime}
                      >
                        Guardar
                      </AdminButton>
                    </div>
                  </div>
                )}
                
                <div className="px-6 py-5 border-t border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Horarios Disponibles
                  </h4>
                  
                  {filteredTimes.length > 0 ? (
                    <AdminTable
                      columns={timeColumns}
                      data={filteredTimes}
                    />
                  ) : (
                    <div className="px-4 py-5 text-center text-gray-500 bg-surface rounded-xl shadow-sm border border-black/[.08] dark:border-white/[.12]">
                      No hay horarios agregados. Haz clic en "Agregar Horario" para crear uno.
                    </div>
                  )}
                </div>
              </AdminCard>
            ) : (
              <AdminCard>
                <div className="px-6 py-5 text-center">
                  <p className="text-gray-500">Selecciona un beneficio para ver sus detalles</p>
                </div>
              </AdminCard>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 