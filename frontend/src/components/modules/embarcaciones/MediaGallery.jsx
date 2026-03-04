import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal/Modal.jsx';
import Button from '../../common/Button/Button.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import embarcacionMediaApi from '../../../api/embarcacionMedia.api.js';

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
  const [media, setMedia] = useState([]);

  const toast = useToast();

  // cargar media desde API
  const loadMedia = async () => {

    if (!embarcacion) return;

    const res = await embarcacionMediaApi.getByEmbarcacion(embarcacion.id);

    if (res.success) {
      setMedia(res.data);
    }

  };

  useEffect(() => {
    if (isOpen && embarcacion) {
      loadMedia();
    }
  }, [isOpen, embarcacion]);

  // limpiar urls temporales
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
      e.target.value = '';
      return;
    }

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

        loadMedia();

      }

    } catch (err) {

      toast.error('Error al subir los archivos');

    } finally {

      setUploading(false);

    }

  };

  const handleDeleteMedia = async (mediaId) => {

    if (window.confirm(CONFIRMATION_MESSAGES.deleteMedia)) {

      const result = await onDelete(embarcacion.id, mediaId);

      if (result.success) {
        loadMedia();
      }

    }

  };

  const handleCloseModal = () => {

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

        {/* Upload */}

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

              <small>
                Máx. {MAX_FILES_PER_UPLOAD} archivos, {MAX_FILE_SIZE_MB}MB cada uno
              </small>

            </label>

          </div>

          {selectedFiles.length > 0 && (

            <div className="selected-files">

              <h4>Archivos seleccionados ({selectedFiles.length})</h4>

              <ul className="files-list">

                {selectedFiles.map((file, index) => (

                  <li key={index}>

                    <i className="bi bi-file-earmark-check"></i>

                    <span className="file-name">{file.name}</span>

                    <small className="file-size">
                      {formatFileSize(file.size)}
                    </small>

                  </li>

                ))}

              </ul>

              <Button
                variant="primary"
                onClick={handleUpload}
                loading={uploading}
              >
                <i className="bi bi-upload"></i> Subir Archivos
              </Button>

            </div>

          )}

        </div>

        <hr />

        {/* galería */}

        <div className="media-gallery-grid">

          {media.length === 0 ? (

            <div className="empty-gallery">

              <i className="bi bi-images"></i>

              <p>No hay archivos multimedia</p>

            </div>

          ) : (

            media.map((m) => (

              <div key={m.embmed_id} className="media-item">

                <div className="media-preview-container">

                  {isImage(m.url) ? (

                    <img
                      src={m.url}
                      className="media-preview"
                      alt=""
                    />

                  ) : isVideo(m.url) ? (

                    <video
                      src={m.url}
                      className="media-preview"
                    />

                  ) : (

                    <div className="media-preview media-placeholder">

                      <i className="bi bi-file-earmark"></i>

                    </div>

                  )}

                  <div className="media-overlay">

                    <button
                      type="button"
                      className="media-action-btn media-delete-btn"
                      onClick={() => handleDeleteMedia(m.embmed_id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>

                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="media-action-btn media-view-btn"
                    >
                      <i className="bi bi-eye"></i>
                    </a>

                  </div>

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