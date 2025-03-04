"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
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
import { AllowedRoles, StaffType } from '@/stores/user/modules';

// Define interfaces for type safety
interface StaffMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  branch: string;
  role: string;
  start_date: string;
  end_date: string | null;
}

interface StaffFormData {
  email: string;
  role: string;
  branch: string;
  start_date: string;
  end_date: string;
  userId: string;
}

interface ApiStatus {
  loading: boolean;
  error: string | null;
  success: string | null;
}

interface SelectOption {
  value: string;
  label: string;
}

// Update the branch options to include a blank default option
const branchOptions: SelectOption[] = [
  { value: '', label: 'Seleccione un departamento' },
  { value: 'IT', label: 'IT' },
  { value: 'MEDIA', label: 'MEDIA' },
  { value: 'INFRA', label: 'INFRA' },
  { value: 'DEPORTES', label: 'DEPORTES' },
  { value: 'NAUTICA', label: 'NAUTICA' },
  { value: 'EVENTOS', label: 'EVENTOS' }
];

// Roles by branch - updated to match API expectations
const rolesBybranch: Record<string, string[]> = {
  'IT': [StaffType.LIDER, StaffType.MIEMBRO],
  'MEDIA': [StaffType.LIDER, StaffType.MIEMBRO],
  'INFRA': [StaffType.LIDER, StaffType.MIEMBRO],
  'DEPORTES': [StaffType.LIDER, StaffType.MIEMBRO],
  'NAUTICA': [StaffType.LIDER, StaffType.MIEMBRO],
  'EVENTOS': [StaffType.LIDER, StaffType.MIEMBRO],
};

export default function StaffManagement() {
  // Remove unused user state
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize with blank values
  const initialStaffForm: StaffFormData = {
    email: '',
    role: '',
    branch: '',
    start_date: '',
    end_date: '',
    userId: ''
  };
  
  const [newStaff, setNewStaff] = useState<StaffFormData>(initialStaffForm);
  
  // Add a state for API operation status
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    loading: false,
    error: null,
    success: null
  });
  
  // Add state to track original staff data for comparison
  const [originalStaff, setOriginalStaff] = useState<StaffFormData>(initialStaffForm);
  
  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ceitba.org.ar/api/v1/user/staff');
        setStaffMembers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching staff members:', err);
        setError('Error al cargar el personal. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMembers();
  }, []);
  
  // Get role options based on branch
  const getRoleOptions = (branch: string): SelectOption[] => {
    if (!branch) {
      // Return a default empty option when no branch is selected
      return [{ value: '', label: 'Seleccione un rol' }];
    }
    
    const roles = rolesBybranch[branch] || [];
    
    // Map roles to option objects with value and label
    return [
      { value: '', label: 'Seleccione un rol' }, // Add blank default option
      ...roles.map(role => ({ value: role, label: role }))
    ];
  };
  
  // Handle branch change to update role options
  const handlebranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branch = e.target.value;
    
    setNewStaff({
      ...newStaff,
      branch,
      role: '' // Always reset role to blank when branch changes
    });
  };
  
  const handleAddStaff = async () => {
    // Validate required fields
    if (!newStaff.email || !newStaff.branch || !newStaff.role || !newStaff.start_date) {
      setApiStatus({
        ...apiStatus,
        error: "Todos los campos marcados con * son obligatorios"
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStaff.email)) {
      setApiStatus({
        ...apiStatus,
        error: "El formato del email no es válido"
      });
      return;
    }
    
    // Validar fechas
    const isStartDateValid = validateDate(newStaff.start_date);
    const isEndDateValid = newStaff.end_date ? validateDate(newStaff.end_date) : true;
    
    if (!isStartDateValid || !isEndDateValid) {
      setApiStatus({
        ...apiStatus,
        error: "Las fechas ingresadas no son válidas. Utilice el formato DD/MM/YYYY"
      });
      return;
    }
    
    // Format dates to YYYY-MM-DD for API
    const formatDateForApi = (dateStr: string) => {
      if (!dateStr) return null;
      
      const parts = dateStr.split('/');
      if (parts.length !== 3) return null;
      
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };
    
    try {
      setApiStatus({
        loading: true,
        error: null,
        success: null
      });
      
      // Prepare the payload according to the API documentation
      const payload = {
        email: newStaff.email,
        branch: newStaff.branch,
        role: newStaff.role,
        start: formatDateForApi(newStaff.start_date),
        end: newStaff.end_date ? formatDateForApi(newStaff.end_date) : null
      };
      
      console.log('Sending payload:', payload);
      
      // Call the API to add/update staff role
      const response = await axios.put('https://ceitba.org.ar/api/v1/user/role', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API response:', response.data);
      
      // Refresh the staff list
      const staffResponse = await axios.get('https://ceitba.org.ar/api/v1/user/staff');
      setStaffMembers(staffResponse.data);
      
      setApiStatus({
        loading: false,
        error: null,
        success: "Staff agregado exitosamente"
      });
      
      resetForm();
    } catch (err: unknown) {
      console.error('Error adding staff:', err);
      
      // Extract more detailed error message if available
      let errorMessage = "Error al agregar personal. Verifique los datos e intente nuevamente.";
      
      if (axios.isAxiosError(err) && err.response?.data) {
        if (typeof err.response.data.message === 'string') {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data.error === 'string') {
          errorMessage = err.response.data.error;
        }
      }
      
      setApiStatus({
        loading: false,
        error: errorMessage,
        success: null
      });
    }
  };
  
  const handleUpdateStaff = async () => {
    // Validate required fields
    if (!newStaff.email || !newStaff.branch || !newStaff.role || !newStaff.start_date) {
      setApiStatus({
        ...apiStatus,
        error: "Todos los campos marcados con * son obligatorios"
      });
      return;
    }
    
    // Validate dates
    const isStartDateValid = validateDate(newStaff.start_date);
    const isEndDateValid = newStaff.end_date ? validateDate(newStaff.end_date) : true;
    
    if (!isStartDateValid || !isEndDateValid) {
      setApiStatus({
        ...apiStatus,
        error: "Las fechas ingresadas no son válidas. Utilice el formato DD/MM/YYYY"
      });
      return;
    }
    
    // Format dates to YYYY-MM-DD for API
    const formatDateForApi = (dateStr: string) => {
      if (!dateStr) return null;
      
      // If already in YYYY-MM-DD format, return as is
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
      
      const parts = dateStr.split('/');
      if (parts.length !== 3) return null;
      
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };
    
    try {
      setApiStatus({
        loading: true,
        error: null,
        success: null
      });
      
      // For updates, we need to send ALL required fields regardless of changes
      // The API requires email, branch, role, and start date for all operations
      const payload = {
        email: newStaff.email,
        branch: newStaff.branch,
        role: newStaff.role,
        start: formatDateForApi(newStaff.start_date),
        end: newStaff.end_date ? formatDateForApi(newStaff.end_date) : null
      };
      
      // Check if anything has actually changed
      const hasChanges = 
        newStaff.branch !== originalStaff.branch ||
        newStaff.role !== originalStaff.role ||
        newStaff.start_date !== originalStaff.start_date ||
        newStaff.end_date !== originalStaff.end_date;
      
      if (!hasChanges) {
        setApiStatus({
          loading: false,
          error: null,
          success: "No se detectaron cambios para actualizar"
        });
        
        setTimeout(() => resetForm(), 2000);
        return;
      }
      
      console.log('Sending update payload:', payload);
      
      // Call the API to update staff role
      const response = await axios.put('https://ceitba.org.ar/api/v1/user/role', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API update response:', response.data);
      
      // Refresh the staff list
      const staffResponse = await axios.get('https://ceitba.org.ar/api/v1/user/staff');
      setStaffMembers(staffResponse.data);
      
      setApiStatus({
        loading: false,
        error: null,
        success: "Staff actualizado exitosamente"
      });
      
      resetForm();
    } catch (err: unknown) {
      console.error('Error updating staff:', err);
      
      // Extract more detailed error message if available
      let errorMessage = "Error al actualizar personal. Verifique los datos e intente nuevamente.";
      
      if (axios.isAxiosError(err) && err.response?.data) {
        if (typeof err.response.data.message === 'string') {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data.error === 'string') {
          errorMessage = err.response.data.error;
        }
      }
      
      setApiStatus({
        loading: false,
        error: errorMessage,
        success: null
      });
    }
  };
  
  const handleEditStaff = (staff: StaffMember) => {
    // Convert dates from YYYY-MM-DD to DD/MM/YYYY format for the form
    const formatDateForForm = (dateStr: string | null) => {
      if (!dateStr) return '';
      
      // If the date is already in DD/MM/YYYY format, return it as is
      if (dateStr.includes('/')) return dateStr;
      
      // If the date is in YYYY-MM-DD format, convert it
      if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      }
      
      return dateStr;
    };
    
    const formattedStaff: StaffFormData = {
      email: staff.email || '',
      role: staff.role || '',
      branch: staff.branch || '',
      start_date: formatDateForForm(staff.start_date),
      end_date: formatDateForForm(staff.end_date) || '',
      userId: staff.userId || staff.id || ''
    };
    
    // Store the original staff data for comparison
    setOriginalStaff(formattedStaff);
    
    // Set the form data
    setNewStaff(formattedStaff);
    
    setEditingId(staff.id);
    setIsAddingStaff(true);
  };
  
  const resetForm = () => {
    setNewStaff(initialStaffForm);
    setOriginalStaff(initialStaffForm);
    setEditingId(null);
    setIsAddingStaff(false);
    
    // Reset API status after a delay
    setTimeout(() => {
      setApiStatus({
        loading: false,
        error: null,
        success: null
      });
    }, 3000);
  };

  // Validate date format (DD/MM/YYYY)
  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;
    
    const [, day, month, year] = dateStr.match(regex) || [];
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (monthNum < 1 || monthNum > 12) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    
    // Check days in month (simplified)
    if (monthNum === 2) {
      // February
      const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);
      if (dayNum > (isLeapYear ? 29 : 28)) return false;
    } else if ([4, 6, 9, 11].includes(monthNum) && dayNum > 30) {
      // April, June, September, November have 30 days
      return false;
    }
    
    return true;
  };

  // Filter staff members based on search query
  const filteredStaff = staffMembers.filter((staff: StaffMember) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      staff.name?.toLowerCase().includes(query) ||
      staff.email?.toLowerCase().includes(query) ||
      staff.branch?.toLowerCase().includes(query) ||
      staff.role?.toLowerCase().includes(query)
    );
  });

  // Table columns configuration
  const columns = [
    {
      header: 'Miembro',
      accessor: 'name',
      cell: (staff: StaffMember) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
          <div className="text-sm text-gray-500">{staff.email}</div>
        </div>
      )
    },
    {
      header: 'Departamento',
      accessor: 'branch',
      cell: (staff: StaffMember) => (
        <div className="text-sm text-gray-900">{staff.branch}</div>
      )
    },
    {
      header: 'Rol',
      accessor: 'role',
      cell: (staff: StaffMember) => (
        <div className="text-sm text-gray-900">{staff.role}</div>
      )
    },
    {
      header: 'Fecha de Inicio',
      accessor: 'start_date',
      cell: (staff: StaffMember) => {
        // Asegurarse de que la fecha se muestre en formato dd/mm/yyyy
        let displayDate = staff.start_date;
        
        // Si la fecha está en formato ISO o YYYY-MM-DD, convertirla
        if (staff.start_date && staff.start_date.includes('-')) {
          const date = new Date(staff.start_date);
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
      accessor: 'end_date',
      cell: (staff: StaffMember) => {
        // Mostrar "Actual" si no hay fecha de fin
        if (!staff.end_date) {
          return <div className="text-sm text-gray-900">-/-/-</div>;
        }
        
        // Asegurarse de que la fecha se muestre en formato dd/mm/yyyy
        let displayDate = staff.end_date;
        
        // Si la fecha está en formato ISO o YYYY-MM-DD, convertirla
        if (staff.end_date && staff.end_date.includes('-')) {
          const date = new Date(staff.end_date);
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
      cell: (staff: StaffMember) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          !staff.end_date ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {!staff.end_date ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      cell: (staff: StaffMember) => (
        <div className="text-right">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => handleEditStaff(staff)}
            className="mr-2"
          >
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
          title="Gestión de Staff"
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
              Agregar Staff
            </AdminButton>
          }
        />
        
        {isAddingStaff ? (
          <AdminCard className="mt-6">
            <AdminCardHeader 
              title={editingId ? "Editar Staff" : "Agregar Nuevo Staff"} 
            />
            <AdminCardContent>
              {apiStatus.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {apiStatus.error}
                </div>
              )}
              
              {apiStatus.success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {apiStatus.success}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <AdminFormField
                  label="Email del usuario *"
                  id="email"
                  required
                  className="sm:col-span-6"
                  helpText={editingId 
                    ? "No se puede modificar el email al editar un miembro existente" 
                    : "Debe ser un email de un usuario existente en el sistema"}
                >
                  <AdminInput
                    type="email"
                    id="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    required
                    placeholder="usuario@example.com"
                    disabled={!!editingId} // Disable email field when editing
                    className={editingId ? "bg-gray-100" : ""}
                  />
                </AdminFormField>

                <AdminFormField
                  label="Departamento *"
                  id="branch"
                  required
                  className="sm:col-span-3"
                  helpText="Seleccione un departamento válido"
                >
                  <AdminSelect
                    id="branch"
                    value={newStaff.branch}
                    onChange={handlebranchChange}
                    options={branchOptions}
                    required
                  />
                </AdminFormField>

                <AdminFormField
                  label="Rol *"
                  id="role"
                  required
                  className="sm:col-span-3"
                >
                  <AdminSelect
                    id="role"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                    options={getRoleOptions(newStaff.branch)}
                    required
                    disabled={!newStaff.branch}
                  />
                </AdminFormField>

                <AdminFormField
                  label="Fecha de Inicio *"
                  id="start_date"
                  required
                  className="sm:col-span-3"
                  helpText="Formato: DD/MM/YYYY"
                >
                  <AdminDateInput
                    id="start_date"
                    value={newStaff.start_date}
                    onChange={(value) => setNewStaff({...newStaff, start_date: value})}
                    required
                    placeholder="DD/MM/YYYY"
                  />
                </AdminFormField>

                <AdminFormField
                  label="Fecha de Fin"
                  id="end_date"
                  className="sm:col-span-3"
                  helpText="Formato: DD/MM/YYYY (dejar vacío para personal actual)"
                >
                  <AdminDateInput
                    id="end_date"
                    value={newStaff.end_date}
                    onChange={(value) => setNewStaff({...newStaff, end_date: value})}
                    placeholder="DD/MM/YYYY"
                  />
                </AdminFormField>
              </div>
              
              <div className="mt-5 flex justify-end space-x-3">
                <AdminButton
                  variant="secondary"
                  onClick={resetForm}
                  disabled={apiStatus.loading}
                >
                  Cancelar
                </AdminButton>
                <AdminButton
                  onClick={editingId ? handleUpdateStaff : handleAddStaff}
                  disabled={apiStatus.loading}
                >
                  {apiStatus.loading ? 'Procesando...' : (editingId ? 'Actualizar' : 'Guardar')}
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
              {loading ? (
                <div className="p-6 text-center">Cargando personal...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : (
                <AdminTable
                  columns={columns}
                  data={filteredStaff}
                />
              )}
            </AdminCard>
          </>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
} 