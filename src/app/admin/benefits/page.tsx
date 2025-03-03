"use client";

import React, { useState, useCallback } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import { useUserStore } from '@/stores/userStore';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminCardContent from '@/app/components/admin/AdminCardContent';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';
import AdminSearchFilter from '@/app/components/admin/AdminSearchFilter';
import AdminFormField from '@/app/components/admin/AdminFormField';
import AdminInput from '@/app/components/admin/AdminInput';
import AdminSelect from '@/app/components/admin/AdminSelect';
import { initialBenefits, initialBenefitTimes, dayOptions } from './data';

// Definición de tipos
interface Benefit {
  id: string;
  name: string;
  inscription_url: string;
  max_capacity: number;
  notes: string;
  price: number;
}

interface BenefitTime {
  id: string;
  benefit_id: string;
  day: string;
  hour_from: string;
  hour_to: string;
  place: string;
  place_url: string;
}

export default function BenefitsManagement() {
  const user = useUserStore((state: any) => state.user);
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);
  const [benefitTimes, setBenefitTimes] = useState<BenefitTime[]>(initialBenefitTimes);
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);
  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado inicial para nuevo beneficio
  const [newBenefit, setNewBenefit] = useState({
    name: '',
    inscription_url: '',
    max_capacity: 0,
    notes: '',
    price: 0
  });
  
  // Estado inicial para nuevo horario
  const [newTime, setNewTime] = useState({
    day: dayOptions[0],
    hour_from: '',
    hour_to: '',
    place: '',
    place_url: ''
  });
  
  // Filtrar beneficios por búsqueda
  const filteredBenefits = benefits.filter(benefit => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      benefit.name.toLowerCase().includes(query) ||
      benefit.notes.toLowerCase().includes(query)
    );
  });
  
  // Obtener detalles del beneficio seleccionado
  const selectedBenefit = selectedBenefitId 
    ? benefits.find(b => b.id === selectedBenefitId) || null
    : null;
  
  // Filtrar horarios por beneficio seleccionado
  const filteredTimes = benefitTimes.filter(time => 
    time.benefit_id === selectedBenefitId
  );
  
  // Columnas para la tabla de beneficios
  const benefitColumns = [
    {
      header: 'Nombre',
      accessor: 'name',
      cell: (benefit: Benefit) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-textDefault">{benefit.name}</div>
            <div className="text-xs text-gray-500">
              Capacidad: {benefit.max_capacity} | Precio: ${benefit.price}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: (benefit: Benefit) => (
        <div className="text-right">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Aquí iría la lógica para editar
            }}
            className="mr-2"
          >
            Editar
          </AdminButton>
          <AdminButton
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteBenefit(benefit.id);
            }}
          >
            Eliminar
          </AdminButton>
        </div>
      )
    }
  ];
  
  // Columnas para la tabla de horarios
  const timeColumns = [
    {
      header: 'Día',
      accessor: 'day',
    },
    {
      header: 'Horario',
      accessor: 'hour',
      cell: (time: BenefitTime) => (
        <span>{time.hour_from} - {time.hour_to}</span>
      )
    },
    {
      header: 'Lugar',
      accessor: 'place',
      cell: (time: BenefitTime) => (
        <div>
          <div>{time.place}</div>
          {time.place_url && (
            <a 
              href={time.place_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Ver ubicación
            </a>
          )}
        </div>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: (time: BenefitTime) => (
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
  
  // Handlers
  const handleSelectBenefit = (id: string) => {
    setSelectedBenefitId(id);
    setIsAddingBenefit(false);
  };
  
  const handleAddBenefit = () => {
    const id = Date.now().toString();
    
    const benefit: Benefit = {
      id,
      ...newBenefit
    };
    
    setBenefits([...benefits, benefit]);
    setNewBenefit({
      name: '',
      inscription_url: '',
      max_capacity: 0,
      notes: '',
      price: 0
    });
    setIsAddingBenefit(false);
    setSelectedBenefitId(id);
  };
  
  const handleDeleteBenefit = (id: string) => {
    setBenefits(benefits.filter(b => b.id !== id));
    setBenefitTimes(benefitTimes.filter(t => t.benefit_id !== id));
    
    if (selectedBenefitId === id) {
      setSelectedBenefitId(null);
    }
  };
  
  const handleAddTime = () => {
    if (!selectedBenefitId) return;
    
    const id = Date.now().toString();
    
    const time: BenefitTime = {
      id,
      benefit_id: selectedBenefitId,
      ...newTime
    };
    
    setBenefitTimes([...benefitTimes, time]);
    setNewTime({
      day: dayOptions[0],
      hour_from: '',
      hour_to: '',
      place: '',
      place_url: ''
    });
    setIsAddingTime(false);
  };
  
  const handleDeleteTime = (id: string) => {
    setBenefitTimes(benefitTimes.filter(t => t.id !== id));
  };
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        {user && (
          <div>
            <AdminPageHeader 
              title="Gestión de Beneficios" 
              description="Administra los beneficios disponibles para los miembros"
              action={
                !isAddingBenefit && (
                  <AdminButton
                    onClick={() => {
                      setIsAddingBenefit(true);
                      setSelectedBenefitId(null);
                    }}
                  >
                    Agregar Beneficio
                  </AdminButton>
                )
              }
            />
            
            <div className="mt-6">
              {!isAddingBenefit ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <AdminCard>
                      <AdminCardHeader 
                        title="Beneficios" 
                      />
                      
                      <div className="px-6 py-4">
                        <AdminSearchFilter
                          value={searchQuery}
                          onChange={setSearchQuery}
                          placeholder="Buscar beneficios..."
                        />
                      </div>
                      
                      <div className="max-h-[500px] overflow-y-auto">
                        {filteredBenefits.length === 0 ? (
                          <div className="px-6 py-8 text-center">
                            <p className="text-gray">No hay beneficios disponibles.</p>
                          </div>
                        ) : (
                          <AdminTable
                            columns={benefitColumns}
                            data={filteredBenefits}
                            onRowClick={(benefit) => handleSelectBenefit(benefit.id)}
                            selectedId={selectedBenefitId}
                          />
                        )}
                      </div>
                    </AdminCard>
                  </div>
                  
                  <div className="md:col-span-2">
                    {selectedBenefit ? (
                      <div>
                        <AdminCard>
                          <AdminCardHeader 
                            title={selectedBenefit.name}
                            action={
                              <div className="flex space-x-2">
                                <AdminButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    // Aquí iría la lógica para editar
                                  }}
                                >
                                  Editar
                                </AdminButton>
                                <AdminButton
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteBenefit(selectedBenefit.id)}
                                >
                                  Eliminar
                                </AdminButton>
                              </div>
                            }
                          />
                          
                          <AdminCardContent>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <h4 className="text-sm font-medium text-gray">Capacidad Máxima</h4>
                                <p className="mt-1 text-sm text-textDefault">{selectedBenefit.max_capacity}</p>
                              </div>
                              
                              <div className="sm:col-span-3">
                                <h4 className="text-sm font-medium text-gray">Precio</h4>
                                <p className="mt-1 text-sm text-textDefault">${selectedBenefit.price}</p>
                              </div>
                              
                              {selectedBenefit.inscription_url && (
                                <div className="sm:col-span-6">
                                  <h4 className="text-sm font-medium text-gray">URL de Inscripción</h4>
                                  <p className="mt-1 text-sm text-primary">
                                    <a href={selectedBenefit.inscription_url} target="_blank" rel="noopener noreferrer">
                                      {selectedBenefit.inscription_url}
                                    </a>
                                  </p>
                                </div>
                              )}
                              
                              <div className="sm:col-span-6">
                                <h4 className="text-sm font-medium text-gray">Notas</h4>
                                <p className="mt-1 text-sm text-textDefault">
                                  {selectedBenefit.notes || 'No hay notas disponibles.'}
                                </p>
                              </div>
                            </div>
                          </AdminCardContent>
                          
                          <AdminCardHeader 
                            title="Horarios Disponibles"
                            divider
                            action={
                              <AdminButton
                                variant="primary"
                                size="sm"
                                onClick={() => setIsAddingTime(true)}
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
                          
                          {isAddingTime ? (
                            <AdminCardContent>
                              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <AdminFormField
                                  label="Día"
                                  id="day"
                                  required
                                  className="sm:col-span-2"
                                >
                                  <AdminSelect
                                    id="day"
                                    value={newTime.day}
                                    onChange={(e) => setNewTime({...newTime, day: e.target.value})}
                                    options={dayOptions}
                                    required
                                  />
                                </AdminFormField>

                                <AdminFormField
                                  label="Hora Desde"
                                  id="hour_from"
                                  required
                                  className="sm:col-span-2"
                                >
                                  <AdminInput
                                    type="time"
                                    id="hour_from"
                                    value={newTime.hour_from}
                                    onChange={(e) => setNewTime({...newTime, hour_from: e.target.value})}
                                    required
                                  />
                                </AdminFormField>

                                <AdminFormField
                                  label="Hora Hasta"
                                  id="hour_to"
                                  className="sm:col-span-2"
                                >
                                  <AdminInput
                                    type="time"
                                    id="hour_to"
                                    value={newTime.hour_to}
                                    onChange={(e) => setNewTime({...newTime, hour_to: e.target.value})}
                                    required
                                  />
                                </AdminFormField>

                                <AdminFormField
                                  label="Lugar"
                                  id="place"
                                  required
                                  className="sm:col-span-3"
                                >
                                  <AdminInput
                                    type="text"
                                    id="place"
                                    value={newTime.place}
                                    onChange={(e) => setNewTime({...newTime, place: e.target.value})}
                                    required
                                  />
                                </AdminFormField>

                                <AdminFormField
                                  label="URL del Lugar"
                                  id="place_url"
                                  className="sm:col-span-3"
                                >
                                  <AdminInput
                                    type="text"
                                    id="place_url"
                                    value={newTime.place_url}
                                    onChange={(e) => setNewTime({...newTime, place_url: e.target.value})}
                                    placeholder="https://maps.example.com"
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
                                  disabled={!newTime.hour_from || !newTime.hour_to || !newTime.place}
                                >
                                  Guardar
                                </AdminButton>
                              </div>
                            </AdminCardContent>
                          ) : (
                            <AdminTable 
                              columns={timeColumns}
                              data={filteredTimes}
                            />
                          )}
                        </AdminCard>
                      </div>
                    ) : (
                      <AdminCard>
                        <div className="px-6 py-12 text-center">
                          <svg className="mx-auto h-16 w-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="mt-2 text-xl font-medium text-textDefault">Detalles del Beneficio</h3>
                          <p className="mt-2 text-base text-gray-500">
                            Selecciona un beneficio de la lista para ver sus detalles y horarios disponibles.
                          </p>
                        </div>
                      </AdminCard>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <AdminCard>
                    <AdminCardHeader 
                      title="Agregar Nuevo Beneficio" 
                    />
                    <AdminCardContent>
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <AdminFormField
                          label="Nombre del Beneficio"
                          id="name"
                          required
                          className="sm:col-span-6"
                        >
                          <AdminInput
                            type="text"
                            id="name"
                            value={newBenefit.name}
                            onChange={(e) => setNewBenefit({...newBenefit, name: e.target.value})}
                            required
                          />
                        </AdminFormField>

                        <AdminFormField
                          label="URL de Inscripción"
                          id="inscription_url"
                          className="sm:col-span-6"
                        >
                          <AdminInput
                            type="url"
                            id="inscription_url"
                            value={newBenefit.inscription_url}
                            onChange={(e) => setNewBenefit({...newBenefit, inscription_url: e.target.value})}
                            placeholder="https://example.com/signup"
                          />
                        </AdminFormField>

                        <AdminFormField
                          label="Capacidad Máxima"
                          id="max_capacity"
                          className="sm:col-span-3"
                        >
                          <AdminInput
                            type="number"
                            id="max_capacity"
                            value={newBenefit.max_capacity.toString()}
                            onChange={(e) => setNewBenefit({...newBenefit, max_capacity: parseInt(e.target.value) || 0})}
                            min="0"
                          />
                        </AdminFormField>

                        <AdminFormField
                          label="Precio"
                          id="price"
                          className="sm:col-span-3"
                        >
                          <AdminInput
                            type="number"
                            id="price"
                            value={newBenefit.price.toString()}
                            onChange={(e) => setNewBenefit({...newBenefit, price: parseInt(e.target.value) || 0})}
                            min="0"
                          />
                        </AdminFormField>

                        <AdminFormField
                          label="Notas"
                          id="notes"
                          className="sm:col-span-6"
                        >
                          <textarea
                            id="notes"
                            rows={4}
                            value={newBenefit.notes}
                            onChange={(e) => setNewBenefit({...newBenefit, notes: e.target.value})}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray/20 rounded-md bg-background"
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
                          disabled={!newBenefit.name}
                        >
                          Guardar
                        </AdminButton>
                      </div>
                    </AdminCardContent>
                  </AdminCard>
                </div>
              )}
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
} 