import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal.jsx';
import Input from '../../common/Input/Input.jsx';
import Button from '../../common/Button/Button.jsx';
import { validateRequired, validateMaxLength } from '../../../utils/validators.js';

function ModalAgregarTipo({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    const nombreError = validateRequired(formData.nombre, 'El nombre') ||
                        validateMaxLength(formData.nombre, 100, 'El nombre');
    if (nombreError) newErrors.nombre = nombreError;

    const descripcionError = validateMaxLength(formData.descripcion, 1000, 'La descripción');
    if (descripcionError) newErrors.descripcion = descripcionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await onAdd(formData);
    setLoading(false);

    if (result.success) {
      setFormData({ nombre: '', descripcion: '' });
      onClose();
    } else {
      setErrors({ general: result.error });
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', descripcion: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Agregar Tipo de Embarcación"
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <Input
            type="text"
            name="nombre"
            label="Nombre del Tipo"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
            placeholder="Ej: Yate, Catamarán, Lancha..."
            required
          />

          <Input
            type="textarea"
            name="descripcion"
            label="Descripción (Opcional)"
            value={formData.descripcion}
            onChange={handleChange}
            error={errors.descripcion}
            placeholder="Breve descripción del tipo de embarcación..."
            rows={3}
          />

          {errors.general && (
            <div style={{ 
              padding: 'var(--spacing-md)', 
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--color-error)',
              fontSize: 'var(--font-size-sm)'
            }}>
              {errors.general}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Agregar Tipo
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ModalAgregarTipo;