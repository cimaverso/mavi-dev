import React, { useState } from 'react';
import Input from '../../common/Input/Input.jsx';
import Select from '../../common/Select/Select.jsx';
import Button from '../../common/Button/Button.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import supportApi from '../../../api/support.api.js';
import './SoporteForm.css';

function SoporteForm() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    asunto: '',
    categoria: '',
    descripcion: '',
  });
  const [archivo, setArchivo] = useState(null);
  const [errors, setErrors] = useState({});

  const categoriasOptions = [
    { value: '', label: 'Selecciona una categoría' },
    { value: 'Técnico', label: 'Técnico' },
    { value: 'Información', label: 'Información' },
    { value: 'Reclamo', label: 'Reclamo' },
  ];

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setArchivo(null);
      return;
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('El archivo no puede superar 5MB');
      e.target.value = '';
      return;
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos JPG, PNG o PDF');
      e.target.value = '';
      return;
    }

    setArchivo(file);
  };

  // Remover archivo
  const handleRemoveFile = () => {
    setArchivo(null);
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar
    const validation = supportApi.validateTicket(formData);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Por favor corrige los errores del formulario');
      return;
    }

    setLoading(true);

    try {
      const response = await supportApi.sendTicket(formData, archivo);
      
      if (response.success) {
        toast.success('Ticket enviado correctamente');
        
        // Limpiar formulario
        setFormData({
          asunto: '',
          categoria: '',
          descripcion: '',
        });
        setArchivo(null);
        setErrors({});
        
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(response.error?.message || 'Error al enviar el ticket');
      }
    } catch (error) {
      toast.error('Error al enviar el ticket');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <form className="soporte-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="form-section-title">Información del Ticket</h3>

        {/* Asunto */}
        <div className="form-group">
          <label htmlFor="asunto" className="form-label">
            Asunto <span className="required">*</span>
          </label>
          <Input
            id="asunto"
            name="asunto"
            type="text"
            value={formData.asunto}
            onChange={handleChange}
            placeholder="Ej: Problema con reserva"
            error={errors.asunto}
            disabled={loading}
            maxLength={200}
          />
          {errors.asunto && (
            <span className="form-error">{errors.asunto}</span>
          )}
          <span className="form-help">
            {formData.asunto.length}/200 caracteres
          </span>
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label htmlFor="categoria" className="form-label">
            Categoría <span className="required">*</span>
          </label>
          <Select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            options={categoriasOptions}
            error={errors.categoria}
            disabled={loading}
          />
          {errors.categoria && (
            <span className="form-error">{errors.categoria}</span>
          )}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion" className="form-label">
            Descripción <span className="required">*</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe detalladamente tu problema o solicitud..."
            className={`form-textarea ${errors.descripcion ? 'has-error' : ''}`}
            disabled={loading}
            rows={6}
          />
          {errors.descripcion && (
            <span className="form-error">{errors.descripcion}</span>
          )}
          <span className="form-help">
            Mínimo 10 caracteres ({formData.descripcion.length} actual)
          </span>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Archivo Adjunto (Opcional)</h3>

        <div className="form-group">
          <label htmlFor="file-input" className="form-label">
            Adjuntar archivo
          </label>
          
          {!archivo ? (
            <div className="file-upload-area">
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                className="file-input"
                disabled={loading}
              />
              <label htmlFor="file-input" className="file-upload-label">
                <i className="bi bi-cloud-upload"></i>
                <span>Seleccionar archivo</span>
                <span className="file-upload-hint">
                  JPG, PNG o PDF (máx. 5MB)
                </span>
              </label>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-preview-icon">
                {archivo.type.startsWith('image/') ? (
                  <i className="bi bi-file-image"></i>
                ) : (
                  <i className="bi bi-file-pdf"></i>
                )}
              </div>
              <div className="file-preview-info">
                <span className="file-preview-name">{archivo.name}</span>
                <span className="file-preview-size">
                  {formatFileSize(archivo.size)}
                </span>
              </div>
              <button
                type="button"
                className="file-preview-remove"
                onClick={handleRemoveFile}
                disabled={loading}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          fullWidth
        >
          <i className="bi bi-send"></i>
          Enviar Ticket
        </Button>
      </div>
    </form>
  );
}

export default SoporteForm;