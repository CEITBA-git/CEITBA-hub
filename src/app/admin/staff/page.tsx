"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import { useUserStore } from '@/stores/userStore';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminCardContent from '@/app/components/admin/AdminCardContent';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';
import AdminFormField from '@/app/components/admin/AdminFormField';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminSearchFilter from '@/app/components/admin/AdminSearchFilter';

// Mock data for staff members
const initialStaffMembers = [
  { 
    id: '1', 
    userId: '101', 
    name: 'John Smith',
    email: 'john.smith@example.com',
    department: 'Deportes',
    role: 'Lider', 
    date_start: '2022-01-15', 
    date_end: null
  },
  { 
    id: '2', 
    userId: '102', 
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    department: 'Directivos', 
    role: 'Presidente', 
    date_start: '2021-06-10', 
    date_end: null
  },
  { 
    id: '3', 
    userId: '103', 
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    department: 'Directivos', 
    role: 'Tesorero', 
    date_start: '2022-03-22', 
    date_end: '2023-12-31'
  },
];

// Department options
const departmentOptions = [
  'Directivos',
  'Deportes',
  'IT',
  'Media',
  'Infra',
  'Eventos',
  'Organizacion'
];

export default function StaffManagement() {
  const user = useUserStore((state: any) => state.user);
  const [staffMembers, setStaffMembers] = useState(initialStaffMembers);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStaff, setNewStaff] = useState({
    userId: '',
    name: '',
    email: '',
    department: 'Deportes',
    role: 'Miembro',
    date_start: '',
    date_end: ''
  });
  
  // Get role options based on department
  const getRoleOptions = (department: string) => {
    if (department === 'Directivos') {
      return ['Presidente', 'Vicepresidente', 'Tesorero', 'Secretaria'];
    } else {
      return ['Miembro', 'Lider'];
    }
  };
  
  // Handle department change to update role options
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = e.target.value;
    const roleOptions = getRoleOptions(department);
    
    setNewStaff({
      ...newStaff,
      department,
      // Set default role based on department
      role: roleOptions[0]
    });
  };
  
  const handleAddStaff = () => {
    // Generate a mock userId if not provided
    const userId = newStaff.userId || Date.now().toString().slice(-3);
    
    setStaffMembers([
      ...staffMembers,
      {
        id: Date.now().toString(),
        ...newStaff,
        userId,
        date_end: newStaff.date_end || null
      }
    ]);
    resetForm();
  };
  
  const handleUpdateStaff = () => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === editingId ? { 
        ...staff, 
        ...newStaff,
        date_end: newStaff.date_end || null
      } : staff
    ));
    resetForm();
  };
  
  const handleDeleteStaff = (id: string) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
  };
  
  const handleEditStaff = (staff: any) => {
    setNewStaff({
      userId: staff.userId,
      name: staff.name,
      email: staff.email,
      department: staff.department,
      role: staff.role,
      date_start: staff.date_start,
      date_end: staff.date_end || ''
    });
    setEditingId(staff.id);
    setIsAddingStaff(true);
  };
  
  const resetForm = () => {
    setNewStaff({
      userId: '',
      name: '',
      email: '',
      department: 'Deportes',
      role: 'Miembro',
      date_start: '',
      date_end: ''
    });
    setEditingId(null);
    setIsAddingStaff(false);
  };

  // Filter staff members based on search query
  const filteredStaff = staffMembers.filter(staff => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      staff.name.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.department.toLowerCase().includes(query) ||
      staff.role.toLowerCase().includes(query)
    );
  });

  // Table columns configuration
  const columns = [
    {
      header: 'Miembro',
      accessor: 'name',
      cell: (staff: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
          <div className="text-sm text-gray-500">{staff.email}</div>
          <div className="text-xs text-gray-400">ID: {staff.userId}</div>
        </div>
      )
    },
    {
      header: 'Departamento',
      accessor: 'department',
      cell: (staff: any) => (
        <div className="text-sm text-gray-900">{staff.department}</div>
      )
    },
    {
      header: 'Rol',
      accessor: 'role',
      cell: (staff: any) => (
        <div className="text-sm text-gray-900">{staff.role}</div>
      )
    },
    {
      header: 'Período',
      accessor: 'date_start',
      cell: (staff: any) => (
        <div>
          <div className="text-sm text-gray-900">{staff.date_start}</div>
          <div className="text-sm text-gray-500">{staff.date_end || 'Actual'}</div>
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: 'status',
      cell: (staff: any) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          !staff.date_end ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {!staff.date_end ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: (staff: any) => (
        <div className="text-right">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => handleEditStaff(staff)}
            className="mr-2"
          >
            Editar
          </AdminButton>
          <AdminButton
            variant="danger"
            size="sm"
            onClick={() => handleDeleteStaff(staff.id)}
          >
            Eliminar
          </AdminButton>
        </div>
      )
    }
  ];
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <AdminPageHeader
          title="Gestión de Personal"
          description="Administra los roles y permisos del personal"
          action={
            <AdminButton
              onClick={() => setIsAddingStaff(true)}
              icon={
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Agregar Personal
            </AdminButton>
          }
        />
        
        {isAddingStaff ? (
          <AdminCard className="mt-6">
            <AdminCardHeader 
              title={editingId ? "Editar Personal" : "Agregar Nuevo Personal"} 
            />
            <AdminCardContent>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <AdminFormField
                  label="ID de Usuario"
                  id="userId"
                  className="sm:col-span-3"
                >
                  <input
                    type="text"
                    id="userId"
                    value={newStaff.userId}
                    onChange={(e) => setNewStaff({...newStaff, userId: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                    placeholder="Opcional - se generará automáticamente"
                  />
                </AdminFormField>

                <AdminFormField
                  label="Nombre"
                  id="name"
                  required
                  className="sm:col-span-3"
                >
                  <input
                    type="text"
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                    required
                  />
                </AdminFormField>

                <AdminFormField
                  label="Email"
                  id="email"
                  required
                  className="sm:col-span-6"
                >
                  <input
                    type="email"
                    id="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                    required
                  />
                </AdminFormField>

                <AdminFormField
                  label="Departamento"
                  id="department"
                  required
                  className="sm:col-span-3"
                >
                  <select
                    id="department"
                    value={newStaff.department}
                    onChange={handleDepartmentChange}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                  >
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </AdminFormField>

                <AdminFormField
                  label="Rol"
                  id="role"
                  required
                  className="sm:col-span-3"
                >
                  <select
                    id="role"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                  >
                    {getRoleOptions(newStaff.department).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </AdminFormField>

                <AdminFormField
                  label="Fecha de Inicio"
                  id="date_start"
                  required
                  className="sm:col-span-3"
                >
                  <input
                    type="date"
                    id="date_start"
                    value={newStaff.date_start}
                    onChange={(e) => setNewStaff({...newStaff, date_start: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                    required
                  />
                </AdminFormField>

                <AdminFormField
                  label="Fecha de Fin (dejar vacío para personal actual)"
                  id="date_end"
                  className="sm:col-span-3"
                >
                  <input
                    type="date"
                    id="date_end"
                    value={newStaff.date_end}
                    onChange={(e) => setNewStaff({...newStaff, date_end: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl"
                  />
                </AdminFormField>
              </div>
              
              <div className="mt-5 flex justify-end space-x-3">
                <AdminButton
                  variant="secondary"
                  onClick={resetForm}
                >
                  Cancelar
                </AdminButton>
                <AdminButton
                  onClick={editingId ? handleUpdateStaff : handleAddStaff}
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </AdminButton>
              </div>
            </AdminCardContent>
          </AdminCard>
        ) : (
          <>
            <div className="mt-6 mb-4">
              <AdminSearchFilter
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar personal..."
              />
            </div>
            
            <AdminCard>
              <AdminTable
                columns={columns}
                data={filteredStaff}
              />
            </AdminCard>
          </>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
} 