import React from 'react';
import { clsx } from 'clsx';

const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  emoji,
  className = '',
  fallback,
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const baseClasses = 'rounded-full flex items-center justify-center overflow-hidden';

  // If emoji is provided, use it
  if (emoji) {
    return (
      <div
        className={clsx(
          baseClasses,
          sizes[size],
          'bg-gray-100',
          className
        )}
        {...props}
      >
        <span role="img" aria-label={alt}>
          {emoji}
        </span>
      </div>
    );
  }

  // If src is provided, use image
  if (src) {
    return (
      <div
        className={clsx(
          baseClasses,
          sizes[size],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div
          className="w-full h-full bg-gray-300 text-gray-600 font-medium flex items-center justify-center"
          style={{ display: 'none' }}
        >
          {fallback || alt.charAt(0).toUpperCase()}
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div
      className={clsx(
        baseClasses,
        sizes[size],
        'bg-gray-300 text-gray-600 font-medium',
        className
      )}
      {...props}
    >
      {fallback || alt.charAt(0).toUpperCase() || '?'}
    </div>
  );
};

export default Avatar;