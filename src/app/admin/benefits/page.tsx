"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
// import { useUserStore } from '@/stores/user/userStore';
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
import AdminConfirmDialog from '@/app/components/admin/AdminConfirmDialog';
import { initialBenefits, initialBenefitTimes, dayOptions } from './data';
import { AllowedRoles } from '@/stores/user/modules';

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
  // const user = useUserStore((state: any) => state.user);
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);
  const [benefitTimes, setBenefitTimes] = useState<BenefitTime[]>(initialBenefitTimes);
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);
  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    itemId: '',
    type: '' // 'benefit' o 'time'
  });
  
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
  
  // Manejar selección de beneficio
  const handleSelectBenefit = (id: string) => {
    setSelectedBenefitId(id);
    setIsAddingTime(false);
  };
  
  // Manejar agregar nuevo beneficio
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
    setSelectedBenefitId(id);
  };
  
  // Mostrar diálogo de confirmación para eliminar beneficio
  const confirmDeleteBenefit = (id: string) => {
    const benefitToDelete = benefits.find(b => b.id === id);
    if (!benefitToDelete) return;
    
    setConfirmDialog({
      isOpen: true,
      title: "Eliminar Beneficio",
      message: `¿Estás seguro de que deseas eliminar el beneficio "${benefitToDelete.name}"? Esta acción no se puede deshacer.`,
      onConfirm: () => {
        handleDeleteBenefit(id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
      itemId: id,
      type: 'benefit'
    });
  };
  
  // Manejar eliminar beneficio
  const handleDeleteBenefit = (id: string) => {
    setBenefits(benefits.filter(benefit => benefit.id !== id));
    setBenefitTimes(benefitTimes.filter(time => time.benefit_id !== id));
    
    if (selectedBenefitId === id) {
      setSelectedBenefitId(null);
    }
  };
  
  // Manejar agregar nuevo horario
  const handleAddTime = () => {
    if (!selectedBenefitId) return;
    
    const id = Date.now().toString();
    
    setBenefitTimes([
      ...benefitTimes,
      {
        id,
        benefit_id: selectedBenefitId,
        ...newTime
      }
    ]);
    
    setNewTime({
      day: dayOptions[0],
      hour_from: '',
      hour_to: '',
      place: '',
      place_url: ''
    });
    
    setIsAddingTime(false);
  };
  
  // Mostrar diálogo de confirmación para eliminar horario
  const confirmDeleteTime = (id: string) => {
    const timeToDelete = benefitTimes.find(t => t.id === id);
    if (!timeToDelete) return;
    
    setConfirmDialog({
      isOpen: true,
      title: "Eliminar Horario",
      message: `¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer.`,
      onConfirm: () => {
        handleDeleteTime(id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
      itemId: id,
      type: 'time'
    });
  };
  
  // Manejar eliminar horario
  const handleDeleteTime = (id: string) => {
    setBenefitTimes(benefitTimes.filter(time => time.id !== id));
  };
  
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
        <a 
          href={time.place_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {time.place}
        </a>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: (time: BenefitTime) => (
        <div className="flex justify-end">
          <AdminButton
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              confirmDeleteTime(time.id);
            }}
          >
            Eliminar
          </AdminButton>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={[AllowedRoles.IT, AllowedRoles.DIRECTIVO]}>
      <AdminLayout>
        <AdminPageHeader 
          title="Gestión de Beneficios" 
          description="Administra los beneficios disponibles para los miembros"
          action={
            !isAddingBenefit && (
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
            )
          }
        />
        
        {/* Diálogo de confirmación */}
        <AdminConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
        
        {!isAddingBenefit ? (
          <div className="mt-6">
            <div className="flex flex-col space-y-6">
              <div>
                <AdminSearchFilter
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Buscar beneficios..."
                  className="mb-4"
                />
                
                <AdminCard>
                  <AdminCardHeader 
                    title="Beneficios" 
                    description="Lista de beneficios disponibles"
                  />
                  
                  {filteredBenefits.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-textDefault">No hay beneficios</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Comienza agregando un nuevo beneficio.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-background">
                      {filteredBenefits.map(benefit => (
                        <div 
                          key={benefit.id}
                          onClick={() => handleSelectBenefit(benefit.id)}
                          className={`
                            p-4 cursor-pointer relative
                            ${selectedBenefitId === benefit.id ? 'bg-primary/5' : 'hover:bg-surface/30'}
                          `}
                        >
                          {selectedBenefitId === benefit.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="text-sm font-medium text-textDefault">{benefit.name}</div>
                                <div className="text-xs text-gray-500">
                                  Capacidad: {benefit.max_capacity} | Precio: ${benefit.price}
                                </div>
                              </div>
                            </div>
                            <div>
                              <AdminButton
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDeleteBenefit(benefit.id);
                                }}
                              >
                                Eliminar
                              </AdminButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </AdminCard>
              </div>
              
              <div>
                {selectedBenefit ? (
                  <AdminCard>
                    <AdminCardHeader 
                      title={selectedBenefit.name} 
                      description="Detalles y horarios disponibles"
                      action={
                        !isAddingTime && (
                          <AdminButton
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
                        )
                      }
                    />
                    
                    <AdminCardContent divider>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray">URL de Inscripción</h4>
                          <p className="mt-1">
                            <a 
                              href={selectedBenefit.inscription_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {selectedBenefit.inscription_url || 'No disponible'}
                            </a>
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray">Capacidad Máxima</h4>
                          <p className="mt-1">{selectedBenefit.max_capacity} personas</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray">Precio</h4>
                          <p className="mt-1">${selectedBenefit.price}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray">Notas</h4>
                          <p className="mt-1">{selectedBenefit.notes || 'Sin notas adicionales'}</p>
                        </div>
                      </div>
                    </AdminCardContent>
                    
                    {isAddingTime ? (
                      <AdminCardContent>
                        <h3 className="text-lg font-medium text-textDefault mb-4">Agregar Nuevo Horario</h3>
                        
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <AdminFormField
                            label="Día"
                            id="day"
                            required
                            className="sm:col-span-3"
                          >
                            <AdminSelect
                              id="day"
                              value={newTime.day}
                              onChange={(e) => setNewTime({...newTime, day: e.target.value})}
                              options={dayOptions}
                            />
                          </AdminFormField>

                          <AdminFormField
                            label="Hora Desde"
                            id="hour_from"
                            required
                            className="sm:col-span-3"
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
                            required
                            className="sm:col-span-3"
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
                              type="url"
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
                      <div>
                        {filteredTimes.length === 0 ? (
                          <div className="px-6 py-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-textDefault">No hay horarios disponibles</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Comienza agregando un nuevo horario para este beneficio.
                            </p>
                          </div>
                        ) : (
                          <AdminTable 
                            columns={timeColumns}
                            data={filteredTimes}
                          />
                        )}
                      </div>
                    )}
                  </AdminCard>
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
                      className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray/20 rounded-md bg-background"
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
      </AdminLayout>
    </ProtectedRoute>
  );
} 