import React, { useEffect } from 'react';
import { useCrud } from '../../hooks/useApi.js';
import proveedoresApi from '../../api/proveedores.api.js';
import MetricasProveedores from '../../components/modules/proveedores/MetricasProveedores.jsx';
import ProveedoresTable from '../../components/modules/proveedores/ProveedoresTable.jsx';
import './ProveedoresPage.css';

function ProveedoresPage() {
  const { items: proveedores, loading, fetchAll, create, update, remove } = useCrud(proveedoresApi);

  useEffect(() => {
    fetchAll();
  }, []); // ← ESTO ES IMPORTANTE - array vacío

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
        <h1 className="page-title">Proveedores</h1>
        <p className="page-description">
          Gestión de proveedores de embarcaciones
        </p>
      </div>

      <MetricasProveedores />

      <ProveedoresTable
        proveedores={proveedores}
        loading={loading}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  );
}

export default ProveedoresPage;