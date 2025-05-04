import React, { Fragment } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-25"
      onClick={handleBackdropClick}
    >
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        <div 
          className={`bg-white w-full ${sizeClasses[size]} ${className} rounded-lg shadow-xl relative flex flex-col max-h-[90vh]`}
        >
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              aria-label="Close"
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>
          
          {footer && (
            <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;