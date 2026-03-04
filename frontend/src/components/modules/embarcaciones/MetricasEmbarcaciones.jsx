import React, { useEffect, useState } from 'react';
import embarcacionesApi from '../../../api/embarcaciones.api.js';
import typesApi from '../../../api/types.api.js';

function MetricasEmbarcaciones() {

  const [metrics, setMetrics] = useState({ total: 0, porTipo: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {

    try {

      const [embRes, tiposRes] = await Promise.all([
        embarcacionesApi.getAll(),
        typesApi.getAll()
      ]);

      console.log("Respuesta embarcaciones API:", embRes);
      console.log("Respuesta tipos API:", tiposRes);

      if (!embRes.success || !tiposRes.success) {
        console.error("Error obteniendo datos");
        return;
      }

      const embarcaciones = Array.isArray(embRes.data)
        ? embRes.data
        : embRes.data?.data || [];

      const tipos = Array.isArray(tiposRes.data)
        ? tiposRes.data
        : tiposRes.data?.data || [];

      console.log("embarcaciones procesadas:", embarcaciones);
      console.log("tipos procesados:", tipos);

      const porTipoMap = {};

      embarcaciones.forEach((e) => {

        const tipoObj = tipos.find(t => t.id === e.tipoId);

        const nombreTipo = tipoObj
          ? tipoObj.nombre
          : "SIN TIPO";

        if (!porTipoMap[nombreTipo]) {
          porTipoMap[nombreTipo] = 0;
        }

        porTipoMap[nombreTipo]++;

      });

      const porTipo = Object.entries(porTipoMap).map(([tipo, cantidad]) => ({
        tipo,
        cantidad
      }));

      setMetrics({
        total: embarcaciones.length,
        porTipo
      });

    } catch (error) {
      console.error("Error cargando métricas:", error);
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

      {/* TOTAL */}
      <div className="metric-card">
        <div className="metric-icon">
          <i className="bi bi-diagram-3"></i>
        </div>
        <div className="metric-content">
          <h3 className="metric-value">{metrics.total}</h3>
          <p className="metric-label">Total Embarcaciones</p>
        </div>
      </div>

      {/* POR TIPO */}
      {metrics.porTipo.map((item) => (
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