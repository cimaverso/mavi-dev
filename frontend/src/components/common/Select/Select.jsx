import React from 'react';
/**
 * Componente Select reutilizable
 * Soporta opciones y acción de agregar nuevo
 */

import './Select.css';

function Select({
  name,
  value,
  onChange,
  options = [],
  label = '',
  error = '',
  disabled = false,
  required = false,
  placeholder = 'Seleccionar...',
  className = '',
  allowAdd = false,
  onAdd,
  addButtonText = '+ Agregar nuevo',
}) {
  const selectId = name || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = error && error.length > 0;

  const selectClasses = [
    'select-field',
    hasError ? 'select-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="select-wrapper">
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}

      <div className="select-container">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.nombre || option.name || option.label}
            </option>
          ))}
        </select>

        {allowAdd && onAdd && (
          <button
            type="button"
            className="select-add-button"
            onClick={onAdd}
            disabled={disabled}
          >
            {addButtonText}
          </button>
        )}
      </div>

      {hasError && <span className="select-error-message">{error}</span>}
    </div>
  );
}

export default Select;