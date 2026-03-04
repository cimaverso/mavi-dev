import React from 'react';
function AgentePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Agente IA</h1>
        <p className="page-description">
          Módulo bloqueado - Próximamente
        </p>
      </div>

      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--border-radius-lg)',
      }}>
        <i className="bi bi-lock-fill" style={{ fontSize: '64px', color: 'var(--color-text-muted)' }}></i>
        <h2 style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>
          Módulo Bloqueado
        </h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Esta funcionalidad estará disponible próximamente
        </p>
      </div>
    </div>
  );
}

export default AgentePage;