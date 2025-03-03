import React, { ReactNode } from 'react';

interface AdminCardContentProps {
  children: ReactNode;
  className?: string;
}

const AdminCardContent: React.FC<AdminCardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-5 ${className}`}>
      {children}
    </div>
  );
};

export default AdminCardContent; 