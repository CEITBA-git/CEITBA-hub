import React, { InputHTMLAttributes } from 'react';

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const AdminInput: React.FC<AdminInputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray/20 rounded-md h-10 bg-background px-3 ${className}`}
      {...props}
    />
  );
};

export default AdminInput; 