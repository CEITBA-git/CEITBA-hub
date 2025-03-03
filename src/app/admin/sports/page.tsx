"use client";

import React from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';
import Link from 'next/link';

export default function SportsAdminPage() {
  // Sample sports data for the table
  const sportsData = [
    {
      id: '1',
      name: 'Soccer',
      members: '42 members',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Basketball',
      members: '28 members',
      status: 'Active'
    }
  ];

  // Table columns configuration
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (sport: any) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{sport.name}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Members',
      accessor: 'members',
      cell: (sport: any) => (
        <div className="text-sm text-gray-900">{sport.members}</div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (sport: any) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {sport.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: () => (
        <div className="text-right">
          <AdminButton variant="secondary" size="sm" className="mr-2">Edit</AdminButton>
          <AdminButton variant="secondary" size="sm">View</AdminButton>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'sports']}>
      <AdminLayout>
        <AdminPageHeader 
          title="Sports Management" 
          description="Manage sports activities and teams"
          action={
            <AdminButton>
              Add Sport
            </AdminButton>
          }
        />
        
        <div className="mt-6 grid grid-cols-1 gap-6">
          <AdminCard>
            <AdminCardHeader 
              title="Sports" 
              description="All available sports activities"
            />
            <AdminTable 
              columns={columns}
              data={sportsData}
            />
          </AdminCard>
          
          <Link href="/admin/sports/logs">
            <AdminButton variant="secondary">
              View Sports Logs
            </AdminButton>
          </Link>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 