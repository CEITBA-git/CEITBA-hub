import React, { ReactNode } from 'react';

interface AdminFormFieldProps {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
  helpText?: string;
}

const AdminFormField: React.FC<AdminFormFieldProps> = ({
  label,
  id,
  error,
  children,
  required = false,
  className = '',
  helpText,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-textDefault">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        {children}
      </div>
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default AdminFormField; 