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
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
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

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

