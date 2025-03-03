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
    <div className={`px-6 py-5 ${divider ? 'border-t border-gray/5' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default AdminCardContent; 