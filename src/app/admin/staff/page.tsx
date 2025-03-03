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
import AdminInput from '@/app/components/admin/AdminInput';
import AdminSelect from '@/app/components/admin/AdminSelect';
import AdminDateInput from '@/app/components/admin/AdminDateInput';

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

// Roles by department
const rolesByDepartment = {
  'Directivos': ['Presidente', 'Vicepresidente', 'Tesorero', 'Secretaria'],
  'Deportes': ['Miembro', 'Lider'],
  'IT': ['Miembro', 'Lider'],
  'Media': ['Miembro', 'Lider'],
  'Infra': ['Miembro', 'Lider'],
  'Eventos': ['Miembro', 'Lider'],
  'Organizacion': ['Miembro', 'Lider']
};

export default function StaffManagement() {
  const user = useUserStore((state: any) => state.user);
  const [staffMembers, setStaffMembers] = useState(initialStaffMembers);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Miembro',
    department: 'Deportes',
    status: 'Activo',
    date_start: '',
    date_end: ''
  });
  
  // Get role options based on department
  const getRoleOptions = (department: string) => {
    return rolesByDepartment[department as keyof typeof rolesByDepartment] || ['Miembro'];
  };
  
  // Handle department change to update role options
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = e.target.value;
    const roles = getRoleOptions(department);
    
    setNewStaff({
      ...newStaff,
      department,
      role: roles[0]
    });
  };
  
  const handleAddStaff = () => {
    // Validar fechas
    const isStartDateValid = validateDate(newStaff.date_start);
    const isEndDateValid = newStaff.date_end ? validateDate(newStaff.date_end) : true;
    
    if (!isStartDateValid || !isEndDateValid) {
      // Mostrar error o impedir envío
      return;
    }
    
    // Generar un ID único si no se proporciona uno
    const staffId = Date.now().toString();
    
    setStaffMembers([
      ...staffMembers,
      {
        ...newStaff,
        id: staffId
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
      name: staff.name,
      email: staff.email,
      role: staff.role,
      department: staff.department,
      status: staff.status,
      date_start: staff.date_start,
      date_end: staff.date_end || ''
    });
    setEditingId(staff.id);
    setIsAddingStaff(true);
  };
  
  const resetForm = () => {
    setNewStaff({
      name: '',
      email: '',
      role: 'Miembro',
      department: 'Deportes',
      status: 'Activo',
      date_start: '',
      date_end: ''
    });
    setEditingId(null);
    setIsAddingStaff(false);
  };

  // Función auxiliar para validar fechas
  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    
    const parts = dateStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    return date.getDate() === day && 
           date.getMonth() === month && 
           date.getFullYear() === year;
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
      header: 'Fecha de Inicio',
      accessor: 'date_start',
      cell: (staff: any) => {
        // Asegurarse de que la fecha se muestre en formato dd/mm/yyyy
        let displayDate = staff.date_start;
        
        // Si la fecha está en formato ISO o YYYY-MM-DD, convertirla
        if (staff.date_start && staff.date_start.includes('-')) {
          const date = new Date(staff.date_start);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          displayDate = `${day}/${month}/${year}`;
        }
        
        return <div className="text-sm text-gray-900">{displayDate}</div>;
      }
    },
    {
      header: 'Fecha de Fin',
      accessor: 'date_end',
      cell: (staff: any) => {
        // Mostrar "Actual" si no hay fecha de fin
        if (!staff.date_end) {
          return <div className="text-sm text-gray-900">Actual</div>;
        }
        
        // Asegurarse de que la fecha se muestre en formato dd/mm/yyyy
        let displayDate = staff.date_end;
        
        // Si la fecha está en formato ISO o YYYY-MM-DD, convertirla
        if (staff.date_end && staff.date_end.includes('-')) {
          const date = new Date(staff.date_end);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          displayDate = `${day}/${month}/${year}`;
        }
        
        return <div className="text-sm text-gray-900">{displayDate}</div>;
      }
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
                  label="Nombre"
                  id="name"
                  required
                  className="sm:col-span-3"
                >
                  <AdminInput
                    type="text"
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    required
                  />
                </AdminFormField>

                <AdminFormField
                  label="Email"
                  id="email"
                  required
                  className="sm:col-span-3"
                >
                  <AdminInput
                    type="email"
                    id="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    required
                  />
                </AdminFormField>

                <AdminFormField
                  label="Departamento"
                  id="department"
                  required
                  className="sm:col-span-3"
                >
                  <AdminSelect
                    id="department"
                    value={newStaff.department}
                    onChange={handleDepartmentChange}
                    options={departmentOptions}
                  />
                </AdminFormField>

                <AdminFormField
                  label="Rol"
                  id="role"
                  required
                  className="sm:col-span-3"
                >
                  <AdminSelect
                    id="role"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                    options={getRoleOptions(newStaff.department)}
                  />
                </AdminFormField>

                <AdminFormField
                  label="Fecha de Inicio"
                  id="date_start"
                  required
                  className="sm:col-span-3"
                >
                  <AdminDateInput
                    id="date_start"
                    value={newStaff.date_start}
                    onChange={(value) => setNewStaff({...newStaff, date_start: value})}
                    required
                  />
                </AdminFormField>

                <AdminFormField
                  label="Fecha de Fin (dejar vacío para personal actual)"
                  id="date_end"
                  className="sm:col-span-3"
                >
                  <AdminDateInput
                    id="date_end"
                    value={newStaff.date_end}
                    onChange={(value) => setNewStaff({...newStaff, date_end: value})}
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