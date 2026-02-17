import React from 'react';

export default function CInput({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  label,
  required = false,
  error,
  className = '',
  disabled = false,
  icon
}) {
  const inputClasses = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-primary transition-all duration-200 ${
    error ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${inputClasses} ${icon ? 'pl-10' : ''}`}
        />
      </div>

      {error && <p className="mt-1 text-sm font-medium text-red-600 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>}
    </div>
  );
}

