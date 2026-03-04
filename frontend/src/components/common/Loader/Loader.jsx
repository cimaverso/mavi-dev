import React from 'react';
/**
 * Componente Loader reutilizable
 * Muestra indicadores de carga
 */

import './Loader.css';

function Loader({
  size = 'medium',
  variant = 'spinner',
  fullscreen = false,
  message = '',
}) {
  const loaderClasses = ['loader', `loader-${size}`, `loader-${variant}`]
    .filter(Boolean)
    .join(' ');

  const renderLoader = () => {
    if (variant === 'dots') {
      return (
        <div className={loaderClasses}>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      );
    }

    return <div className={loaderClasses}></div>;
  };

  if (fullscreen) {
    return (
      <div className="loader-fullscreen">
        {renderLoader()}
        {message && <p className="loader-message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="loader-wrapper">
      {renderLoader()}
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
}

export default Loader;