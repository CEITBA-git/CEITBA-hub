import React from 'react';

interface AdminSearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const AdminSearchFilter: React.FC<AdminSearchFilterProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border-gray/20 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 pl-8 w-full"
      />
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

export default AdminSearchFilter; 