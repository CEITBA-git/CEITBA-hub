"use client";

import React from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import AdminPageHeader from '@/app/components/admin/AdminPageHeader';
import AdminCard from '@/app/components/admin/AdminCard';
import AdminCardHeader from '@/app/components/admin/AdminCardHeader';
import AdminButton from '@/app/components/admin/AdminButton';
import AdminTable from '@/app/components/admin/AdminTable';

export default function OrganizationAdminPage() {
  // Sample event data for the table
  const eventData = [
    {
      id: '1',
      name: 'Annual Conference',
      location: 'Main Auditorium',
      date: 'June 15, 2023',
      time: '9:00 AM - 5:00 PM',
      attendees: '120 registered',
      status: 'Upcoming'
    },
    {
      id: '2',
      name: 'Workshop Series',
      location: 'Room 101',
      date: 'July 10, 2023',
      time: '2:00 PM - 4:00 PM',
      attendees: '45 registered',
      status: 'Upcoming'
    }
  ];

  // Table columns configuration
  const columns = [
    {
      header: 'Event',
      accessor: 'name',
      cell: (event: any) => (
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{event.name}</div>
            <div className="text-sm text-gray-500">{event.location}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      cell: (event: any) => (
        <div>
          <div className="text-sm text-gray-900">{event.date}</div>
          <div className="text-sm text-gray-500">{event.time}</div>
        </div>
      )
    },
    {
      header: 'Attendees',
      accessor: 'attendees',
      cell: (event: any) => (
        <div className="text-sm text-gray-900">{event.attendees}</div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (event: any) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {event.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: () => (
        <div className="text-right">
          <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
          <a href="#" className="text-indigo-600 hover:text-indigo-900">View</a>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'organization']}>
      <AdminLayout>
        <AdminPageHeader 
          title="Organization Management" 
          description="Manage organization events and activities"
          action={
            <AdminButton>
              Create Event
            </AdminButton>
          }
        />
        
        <div className="mt-6">
          <AdminCard>
            <AdminCardHeader 
              title="Events" 
              description="Upcoming and past organization events"
            />
            <AdminTable 
              columns={columns}
              data={eventData}
            />
          </AdminCard>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 