"use client"
import React, { ReactNode, useState } from 'react';
import AdminConfirmDialog from './AdminConfirmDialog';

interface AdminButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmText?: string;
  cancelText?: string;
}

const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  className = '',
  confirmTitle = '¿Estás seguro?',
  confirmMessage = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'text-white bg-primary hover:bg-primary/90 focus:ring-primary',
    secondary: 'text-textDefault bg-surface hover:bg-surface/90 focus:ring-primary',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    outline: 'text-primary bg-transparent hover:bg-primary/5 focus:ring-primary border border-primary/30',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-md',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'danger' && onClick && !disabled) {
      e.preventDefault();
      setShowConfirm(true);
    } else if (onClick && !disabled) {
      onClick(e);
    }
  };
  
  const handleConfirm = () => {
    setShowConfirm(false);
    if (onClick) {
      // Ejecutar directamente la función onClick sin crear un evento sintético
      onClick({} as React.MouseEvent<HTMLButtonElement>);
    }
  };
  
  const handleCancel = () => {
    setShowConfirm(false);
  };
  
  return (
    <>
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
      
      {variant === 'danger' && (
        <AdminConfirmDialog
          isOpen={showConfirm}
          title={confirmTitle}
          message={confirmMessage}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          variant="danger"
        />
      )}
    </>
  );
};

export default AdminButton; 