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
    default: 'bg-surface shadow-sm',
    elevated: 'bg-surface shadow-md',
    outlined: 'bg-background border border-gray/10'
  };

  return (
    <div className={`rounded-md overflow-hidden ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default AdminCard; 