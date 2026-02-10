import React from 'react';

export default function CButton({
  children,
  onClick,
  type = 'button',
  fullWidth = true,
  disabled = false,
  variant = 'primary', 
  className = ''
}) {
  const baseClasses =
    'font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'; 
  const variants = {
    primary: `bg-primary text-white hover:bg-primaryHover focus:ring-primary shadow-md hover:shadow-lg`,
    outline: `border-2 border-secondary text-primary bg-transparent hover:bg-secondary/10 focus:ring-secondary`,
    secondary: `bg-secondary text-primary hover:bg-secondaryHover focus:ring-secondary`
  };

  
  const widthClass = fullWidth ? 'w-full' : 'px-8';
  const paddingClass = 'py-3';
  
  const classes = `
    ${baseClasses} 
    ${widthClass} 
    ${paddingClass} 
    ${variants[variant] || variants.primary} 
    ${className}
  `.trim();

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={classes}
    >
      {children}
    </button>
  );
}