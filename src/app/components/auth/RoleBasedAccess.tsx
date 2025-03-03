"use client";

import React from 'react';
import { useUserStore, Role } from '@/stores/userStore';

interface RoleBasedAccessProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const hasAnyRole = useUserStore(state => state.hasAnyRole);
  
  if (hasAnyRole(allowedRoles)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}; 