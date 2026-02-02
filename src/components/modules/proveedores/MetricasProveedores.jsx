import React, { useEffect, useState } from 'react';
import proveedoresApi from '../../../api/proveedores.api.js';

function MetricasProveedores() {
  const [metrics, setMetrics] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await proveedoresApi.getMetrics();
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (error) {
      console.error('Error cargando métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-icon">
          <i className="bi bi-people"></i>
        </div>
        <div className="metric-content">
          <h3 className="metric-value">{metrics.total}</h3>
          <p className="metric-label">Total Proveedores</p>
        </div>
      </div>
    </div>
  );
}

export default MetricasProveedores;