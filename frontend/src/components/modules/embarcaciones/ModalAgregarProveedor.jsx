import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal.jsx';
import Input from '../../common/Input/Input.jsx';
import Button from '../../common/Button/Button.jsx';
import { validateRequired, validateMaxLength, validatePhone } from '../../../utils/validators.js';

function ModalAgregarProveedor({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
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
                        validateMaxLength(formData.nombre, 200, 'El nombre');
    if (nombreError) newErrors.nombre = nombreError;

    if (formData.telefono) {
      const telefonoError = validatePhone(formData.telefono);
      if (telefonoError) newErrors.telefono = telefonoError;
    }

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
      setFormData({ nombre: '', telefono: '' });
      onClose();
    } else {
      setErrors({ general: result.error });
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', telefono: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Agregar Proveedor"
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <Input
            type="text"
            name="nombre"
            label="Nombre del Proveedor"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
            placeholder="Nombre del proveedor..."
            required
          />

          <Input
            type="tel"
            name="telefono"
            label="Teléfono (Opcional)"
            value={formData.telefono}
            onChange={handleChange}
            error={errors.telefono}
            placeholder="+57 300 123 4567"
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
              Agregar Proveedor
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ModalAgregarProveedor;