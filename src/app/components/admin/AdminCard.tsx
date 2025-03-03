import React, { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

const AdminCard: React.FC<AdminCardProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-surface border border-gray/10 shadow-sm',
    elevated: 'bg-surface border border-gray/10 shadow-md',
    outlined: 'bg-background border border-gray/20'
  };

  return (
    <div className={`rounded-md overflow-hidden ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default AdminCard; 