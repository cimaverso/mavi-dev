import React, { useEffect } from 'react';
import { useCrud } from '../../hooks/useApi.js';
import serviciosApi from '../../api/servicios.api.js';
import MetricasServicios from '../../components/modules/servicios/MetricasServicios.jsx';
import ServiciosTable from '../../components/modules/servicios/ServiciosTable.jsx';
import './ServiciosPage.css';

function ServiciosPage() {
  const { items: servicios, loading, fetchAll, create, update, remove } = useCrud(serviciosApi);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleUpdate = async (id, data) => {
    return await update(id, data);
  };

  const handleDelete = async (id) => {
    return await remove(id);
  };

  const handleAdd = async (data) => {
    return await create(data);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Servicios</h1>
        <p className="page-description">
          Gestión de servicios adicionales
        </p>
      </div>

      <MetricasServicios />

      <ServiciosTable
        servicios={servicios}
        loading={loading}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  );
}

export default ServiciosPage;