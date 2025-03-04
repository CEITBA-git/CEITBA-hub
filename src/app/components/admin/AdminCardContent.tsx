import React, { ReactNode } from 'react';

interface AdminCardContentProps {
  children: ReactNode;
  className?: string;
  divider?: boolean;
}

const AdminCardContent: React.FC<AdminCardContentProps> = ({ 
  children, 
  className = '',
  divider = false
}) => {
  return (
    <div className={`px-6 py-5 ${divider ? 'border-y border-1 border-gray bg-background' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default AdminCardContent; 