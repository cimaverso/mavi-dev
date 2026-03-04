import React, { useEffect, useState } from 'react';
import embarcacionesApi from '../../../api/embarcaciones.api.js';

function MetricasEmbarcaciones() {
  const [metrics, setMetrics] = useState({ total: 0, porTipo: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await embarcacionesApi.getMetrics();
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
      {/* Total */}
      <div className="metric-card">
        <div className="metric-icon">
          <i className="bi bi-diagram-3"></i>
        </div>
        <div className="metric-content">
          <h3 className="metric-value">{metrics.total}</h3>
          <p className="metric-label">Total Embarcaciones</p>
        </div>
      </div>

      {/* Por tipo */}
      {metrics.porTipo && metrics.porTipo.map((item) => (
        <div key={item.tipo} className="metric-card metric-card-secondary">
          <div className="metric-icon metric-icon-small">
            <i className="bi bi-box"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{item.cantidad}</h3>
            <p className="metric-label">{item.tipo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MetricasEmbarcaciones;