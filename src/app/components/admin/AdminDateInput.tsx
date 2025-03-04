import React, { useState, useEffect } from 'react';

interface AdminDateInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const AdminDateInput: React.FC<AdminDateInputProps> = ({
  id,
  value,
  onChange,
  required = false,
  placeholder = 'dd/mm/yyyy',
  className = '',
  disabled = false,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return !required;
    
    // Regex para formato dd/mm/yyyy
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    
    // Validar que la fecha sea real
    const parts = dateStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Los meses en JS son 0-11
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    return date.getDate() === day && 
           date.getMonth() === month && 
           date.getFullYear() === year;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Formatear automáticamente mientras se escribe
    let formattedValue = newValue;
    
    // Eliminar caracteres no numéricos excepto /
    formattedValue = formattedValue.replace(/[^\d/]/g, '');
    
    // Agregar / automáticamente después de dd y mm
    if (formattedValue.length === 2 && !formattedValue.includes('/')) {
      formattedValue += '/';
    } else if (formattedValue.length === 5 && formattedValue.indexOf('/', 3) === -1) {
      formattedValue += '/';
    }
    
    // Limitar a 10 caracteres (dd/mm/yyyy)
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.slice(0, 10);
    }
    
    if (formattedValue !== newValue) {
      setInputValue(formattedValue);
    }
    
    const valid = validateDate(formattedValue);
    setIsValid(valid);
    
    if (valid || formattedValue === '') {
      onChange(formattedValue);
    }
  };

  const handleBlur = () => {
    setIsValid(validateDate(inputValue));
  };

  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray/20 rounded-md h-10 bg-background px-3 ${!isValid ? 'border-red-500' : ''} ${className}`}
        maxLength={10}
      />
      {!isValid && (
        <p className="mt-1 text-sm text-red-600">
          Formato de fecha inválido. Use dd/mm/yyyy
        </p>
      )}
    </div>
  );
};

export default AdminDateInput; 