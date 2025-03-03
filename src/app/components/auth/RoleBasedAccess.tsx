"use client";

import React from 'react';
import { AllowedRoles } from '@/stores/user/modules';
import { useUserStore } from '@/stores/user/userStore';

interface RoleBasedAccessProps {
  allowedRoles: AllowedRoles[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { user, hasAnyRole } = useUserStore();
  if (user && hasAnyRole(allowedRoles)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}; 