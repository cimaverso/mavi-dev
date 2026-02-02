import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button/Button.jsx';
import Input from '../../components/common/Input/Input.jsx';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrige los errores del formulario');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        toast.success('Inicio de sesión exitoso');
      } else {
        toast.error(result.error || 'Credenciales inválidas');
      }
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          {/* Logo */}
          <img src="/cimaverso.svg" alt="Cimaverso" className="login-logo" />
          <h1 className="login-title">CIMABOT ADMIN</h1>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            label="Usuario"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Ingresa tu usuario"
            icon={<i className="bi bi-person"></i>}
            disabled={loading}
            required
          />

          <Input
            type="password"
            name="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Ingresa tu contraseña"
            icon={<i className="bi bi-lock"></i>}
            disabled={loading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="login-footer">
          <p className="login-help-text">
            Credenciales de prueba: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;