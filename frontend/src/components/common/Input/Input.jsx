import React from 'react';
/**
 * Componente Input reutilizable
 * Soporta diferentes tipos y validaciones
 */

import './Input.css';

function Input({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder = '',
  label = '',
  error = '',
  disabled = false,
  required = false,
  className = '',
  icon = null,
  min,
  max,
  step,
  rows = 4,
}) {
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = error && error.length > 0;

  const inputClasses = [
    'input-field',
    hasError ? 'input-error' : '',
    icon ? 'input-with-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          rows={rows}
        />
      );
    }

    return (
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        min={min}
        max={max}
        step={step}
      />
    );
  };

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        {renderInput()}
      </div>

      {hasError && <span className="input-error-message">{error}</span>}
    </div>
  );
}

export default Input;