"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';
import AdminSearchFilter from '@/app/components/admin/AdminSearchFilter';

export default function UsersAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample users data for the table
  const usersData = [
    {
      id: '1',
      name: 'John Doe',
      initials: 'JD',
      email: 'john.doe@example.com',
      roles: ['Admin'],
      status: 'Active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      initials: 'JS',
      email: 'jane.smith@example.com',
      roles: ['Sports'],
      status: 'Active'
    }
  ];

  // Filter users based on search query
  const filteredUsers = usersData.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.roles.some(role => role.toLowerCase().includes(query))
    );
  });

  // Table columns configuration
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (user: any) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              {user.initials}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      cell: (user: any) => (
        <div className="text-sm text-gray-900">{user.email}</div>
      )
    },
    {
      header: 'Roles',
      accessor: 'roles',
      cell: (user: any) => (
        <div>
          {user.roles.map((role: string, index: number) => (
            <span 
              key={index}
              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-1"
            >
              {role}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (user: any) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {user.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: () => (
        <div className="text-right">
          <AdminButton variant="secondary" size="sm">
            Edit
          </AdminButton>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <AdminPageHeader 
          title="User Management" 
          description="Manage user accounts and permissions"
          action={
            <AdminButton>
              Add User
            </AdminButton>
          }
        />
        
        <div className="mt-6 mb-4">
          <AdminSearchFilter
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users..."
          />
        </div>
        
        <AdminCard>
          <AdminCardHeader 
            title="Users" 
            description="All registered users in the system"
          />
          <AdminTable 
            columns={columns}
            data={filteredUsers}
          />
        </AdminCard>
      </AdminLayout>
    </ProtectedRoute>
  );
} 