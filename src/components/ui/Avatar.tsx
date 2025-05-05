import React from 'react';
import { getInitials, getRandomColor } from '../../lib/utils';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  className = '',
}) => {
  // Define more moderate dimensions
  const dimensions = {
    xs: { width: '28px', height: '28px', fontSize: '11px' },
    sm: { width: '36px', height: '36px', fontSize: '13px' },
    md: { width: '44px', height: '44px', fontSize: '16px' },
    lg: { width: '56px', height: '56px', fontSize: '20px' },
    xl: { width: '70px', height: '70px', fontSize: '26px' },
  };
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  
  const initials = getInitials(name);
  const bgColorClass = getRandomColor(name);
  
  return (
    <div
      className={`flex items-center justify-center rounded-full aspect-square ${
        imageUrl ? '' : `${bgColorClass} text-white`
      } ${className}`}
      style={{ 
        width: dimensions[size].width, 
        height: dimensions[size].height,
        display: 'inline-flex',
        verticalAlign: 'middle'
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span 
          className="font-medium flex items-center justify-center text-center" 
          style={{ 
            fontSize: dimensions[size].fontSize,
            lineHeight: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

export default Avatar;