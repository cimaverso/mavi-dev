import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal/Modal.jsx';
import Button from '../../common/Button/Button.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { 
  ALLOWED_MEDIA_TYPES, 
  MAX_FILE_SIZE_MB, 
  MAX_FILES_PER_UPLOAD,
  CONFIRMATION_MESSAGES 
} from '../../../utils/constants.js';
import { formatFileSize } from '../../../utils/formatters.js';
import { validateMultipleFiles } from '../../../utils/validators.js';
import './MediaGallery.css';

function MediaGallery({ embarcacion, isOpen, onClose, onUpload, onDelete }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const toast = useToast();

  // Limpiar URLs de memoria para evitar fugas (Memory Leaks)
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const error = validateMultipleFiles(
      files, 
      MAX_FILES_PER_UPLOAD, 
      ALLOWED_MEDIA_TYPES, 
      MAX_FILE_SIZE_MB
    );

    if (error) {
      toast.error(error);
      e.target.value = ''; // Reset input
      return;
    }

    // Limpiar previas anteriores antes de generar nuevas
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    const urls = files.map(file => URL.createObjectURL(file));
    setSelectedFiles(files);
    setPreviewUrls(urls);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('Selecciona al menos un archivo');
      return;
    }

    setUploading(true);
    try {
      const result = await onUpload(embarcacion.id, selectedFiles);
      
      if (result.success) {
        toast.success('Archivos subidos correctamente');
        setSelectedFiles([]);
        setPreviewUrls([]);
        const fileInput = document.getElementById('media-upload-input');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      toast.error('Error al subir los archivos');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (window.confirm(CONFIRMATION_MESSAGES.deleteMedia)) {
      await onDelete(embarcacion.id, mediaId);
    }
  };

  const handleCloseModal = () => {
    // Limpieza al cerrar
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles([]);
    onClose();
  };

  const isImage = (url) => /\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i.test(url);
  const isVideo = (url) => /\.(mp4|mov|webm)(\?.*)?$/i.test(url);

  if (!embarcacion) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={`Media - ${embarcacion.nombre}`}
      size="large"
    >
      <div className="media-gallery">
        {/* Sección de Carga */}
        <div className="media-upload-section">
          <div className="upload-area">
            <input
              id="media-upload-input"
              type="file"
              accept={ALLOWED_MEDIA_TYPES.join(',')}
              multiple
              onChange={handleFileSelect}
              className="upload-input"
              disabled={uploading}
            />
            <label htmlFor="media-upload-input" className="upload-label">
              <i className="bi bi-cloud-upload"></i>
              <span>Seleccionar archivos</span>
              <small>Máx. {MAX_FILES_PER_UPLOAD} archivos, {MAX_FILE_SIZE_MB}MB cada uno</small>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h4>Archivos seleccionados ({selectedFiles.length}):</h4>
              <ul className="files-list">
                {selectedFiles.map((file, index) => (
                  <li key={index}>
                    <i className="bi bi-file-earmark-check"></i>
                    <span className="file-name">{file.name}</span>
                    <small className="file-size">{formatFileSize(file.size)}</small>
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
                onClick={handleUpload}
                loading={uploading}
                disabled={uploading}
              >
                <i className="bi bi-upload"></i> Subir Archivos
              </Button>
            </div>
          )}
        </div>

        <hr />

        {/* Cuadrícula de Galería */}
        <div className="media-gallery-grid">
          {!embarcacion.media || embarcacion.media.length === 0 ? (
            <div className="empty-gallery">
              <i className="bi bi-images"></i>
              <p>No hay archivos multimedia</p>
            </div>
          ) : (
            embarcacion.media.map((media) => (
              <div key={media.id} className="media-item">
                <div className="media-preview-container">
                  {isImage(media.url) ? (
                    <img src={media.url} alt={media.nombre} className="media-preview" />
                  ) : isVideo(media.url) ? (
                    <video src={media.url} className="media-preview" />
                  ) : (
                    <div className="media-preview media-placeholder">
                      <i className="bi bi-file-earmark"></i>
                    </div>
                  )}
                  
                  <div className="media-overlay">
                    <button
                      type="button"
                      className="media-action-btn media-delete-btn"
                      onClick={() => handleDeleteMedia(media.id)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="media-action-btn media-view-btn"
                      title="Ver completo"
                    >
                      <i className="bi bi-eye"></i>
                    </a>
                  </div>
                </div>

                <div className="media-info">
                  <span className="media-name" title={media.nombre}>
                    {media.nombre}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

export default MediaGallery;