import React, { SelectHTMLAttributes } from 'react';

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  options: Array<{ value: string; label: string }> | string[];
}

const AdminSelect: React.FC<AdminSelectProps> = ({ className = '', options, ...props }) => {
  return (
    <select
      className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray/20 rounded-md h-10 bg-background px-3 ${className}`}
      {...props}
    >
      {options.map((option, index) => {
        if (typeof option === 'string') {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        } else {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          );
        }
      })}
    </select>
  );
};

export default AdminSelect; 