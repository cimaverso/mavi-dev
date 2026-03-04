import React, { useEffect, useState } from 'react';
import { useCrud } from '../../hooks/useApi.js';
import embarcacionesApi from '../../api/embarcaciones.api.js';
import tiposApi from '../../api/types.api.js';
import proveedoresApi from '../../api/proveedores.api.js';
import MetricasEmbarcaciones from '../../components/modules/embarcaciones/MetricasEmbarcaciones.jsx';
import EmbarcacionesTable from '../../components/modules/embarcaciones/EmbarcacionesTable.jsx';
import ModalAgregarTipo from '../../components/modules/embarcaciones/ModalAgregarTipo.jsx';
import ModalAgregarProveedor from '../../components/modules/embarcaciones/ModalAgregarProveedor.jsx';
import MediaGallery from '../../components/modules/embarcaciones/MediaGallery.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import './EmbarcacionesPage.css';

function EmbarcacionesPage() {
  const { items: embarcaciones, loading, fetchAll, create, update, remove } = useCrud(embarcacionesApi);
  const { items: tipos, fetchAll: fetchTipos, create: createTipo } = useCrud(tiposApi);
  const { items: proveedores, fetchAll: fetchProveedores, create: createProveedor } = useCrud(proveedoresApi);
  
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [selectedEmbarcacion, setSelectedEmbarcacion] = useState(null);
  
  const toast = useToast();

  useEffect(() => {
    fetchAll();
    fetchTipos();
    fetchProveedores();
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

  const handleAddTipo = async (data) => {
    const result = await createTipo(data);
    if (result.success) {
      await fetchTipos();
    }
    return result;
  };

  const handleAddProveedor = async (data) => {
    const result = await createProveedor(data);
    if (result.success) {
      await fetchProveedores();
    }
    return result;
  };

  const handleOpenMediaGallery = (embarcacion) => {
    setSelectedEmbarcacion(embarcacion);
    setShowMediaGallery(true);
  };

  const handleCloseMediaGallery = () => {
    setShowMediaGallery(false);
    setSelectedEmbarcacion(null);
  };

  const handleUploadMedia = async (embarcacionId, files) => {
    try {
      const result = await embarcacionesApi.uploadMedia(embarcacionId, files);
      if (result.success) {
        toast.success('Archivos subidos correctamente');
        await fetchAll();
      } else {
        toast.error(result.error || 'Error al subir archivos');
      }
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al subir archivos');
      return { success: false, error: error.message };
    }
  };

  const handleDeleteMedia = async (embarcacionId, mediaId) => {
    try {
      const result = await embarcacionesApi.deleteMedia(mediaId);
      if (result.success) {
        toast.success('Archivo eliminado');
        await fetchAll();
      } else {
        toast.error(result.error || 'Error al eliminar archivo');
      }
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al eliminar archivo');
      return { success: false, error: error.message };
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Embarcaciones</h1>
        <p className="page-description">
          Gestión de embarcaciones, tipos y multimedia
        </p>
      </div>

      <MetricasEmbarcaciones />

      <EmbarcacionesTable
        embarcaciones={embarcaciones}
        tipos={tipos}
        proveedores={proveedores}
        loading={loading}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onOpenTipoModal={() => setShowTipoModal(true)}
        onOpenProveedorModal={() => setShowProveedorModal(true)}
        onOpenMediaGallery={handleOpenMediaGallery}
      />

      <ModalAgregarTipo
        isOpen={showTipoModal}
        onClose={() => setShowTipoModal(false)}
        onAdd={handleAddTipo}
      />

      <ModalAgregarProveedor
        isOpen={showProveedorModal}
        onClose={() => setShowProveedorModal(false)}
        onAdd={handleAddProveedor}
      />

      <MediaGallery
        embarcacion={selectedEmbarcacion}
        isOpen={showMediaGallery}
        onClose={handleCloseMediaGallery}
        onUpload={handleUploadMedia}
        onDelete={handleDeleteMedia}
      />
    </div>
  );
}

export default EmbarcacionesPage;
