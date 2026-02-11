import React from 'react';
import Theme from '../../config/theam/index.js';

export default function CButton({
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  disabled = false,
  variant = 'primary', 
  size = 'md',
  className = ''
}) {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'; 
  
  const variants = {
    primary: `text-white hover:opacity-90 focus:ring-opacity-50 shadow-md hover:shadow-lg`,
    outline: `border-2 text-gray-700 bg-transparent hover:bg-gray-50 focus:ring-gray-500`,
    secondary: `bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500`,
    danger: `text-white hover:opacity-90 focus:ring-opacity-50 shadow-md hover:shadow-lg`
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const paddingClass = sizes[size] || sizes.md;
  
  const classes = `
    ${baseClasses} 
    ${widthClass} 
    ${paddingClass} 
    ${variants[variant] || variants.primary} 
    ${className}
  `.trim();

  const getButtonStyle = () => {
    if (variant === 'primary') {
      return {
        backgroundColor: Theme.colors.primary,
        '--hover-bg-color': Theme.colors.primaryHover,
        '--focus-ring-color': Theme.colors.primary
      };
    }
    if (variant === 'danger') {
      return {
        backgroundColor: Theme.colors.red600,
        '--hover-bg-color': '#dc2626',
        '--focus-ring-color': Theme.colors.red500
      };
    }
    return {};
  };

  const handleMouseEnter = (e) => {
    if (variant === 'primary') {
      e.target.style.backgroundColor = Theme.colors.primaryHover;
    }
    if (variant === 'danger') {
      e.target.style.backgroundColor = '#dc2626';
    }
  };

  const handleMouseLeave = (e) => {
    if (variant === 'primary') {
      e.target.style.backgroundColor = Theme.colors.primary;
    }
    if (variant === 'danger') {
      e.target.style.backgroundColor = Theme.colors.red600;
    }
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={classes}
      style={getButtonStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}