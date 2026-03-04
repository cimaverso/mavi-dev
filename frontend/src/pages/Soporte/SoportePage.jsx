import React from 'react';
import SoporteForm from '../../components/modules/soporte/SoporteForm.jsx';
import './SoportePage.css';

function SoportePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Soporte</h1>
          <p className="page-description">
            Envía tus consultas, reporta problemas o solicita ayuda
          </p>
        </div>
      </div>

      <div className="soporte-info-banner">
        <div className="banner-icon">
          <i className="bi bi-info-circle-fill"></i>
        </div>
        <div className="banner-content">
          <h3 className="banner-title">¿Cómo funciona?</h3>
          <p className="banner-text">
            Completa el formulario con tu consulta o problema. Nuestro equipo 
            revisará tu ticket y te responderá lo antes posible. Puedes adjuntar 
            imágenes o documentos para ayudarnos a entender mejor tu situación.
          </p>
        </div>
      </div>

      <div className="soporte-tips">
        <div className="tip-card">
          <div className="tip-icon tip-icon-fast">
            <i className="bi bi-lightning-fill"></i>
          </div>
          <div className="tip-content">
            <h4 className="tip-title">Respuesta Rápida</h4>
            <p className="tip-text">
              Tiempo promedio de respuesta: 24 horas
            </p>
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon tip-icon-support">
            <i className="bi bi-headset"></i>
          </div>
          <div className="tip-content">
            <h4 className="tip-title">Soporte 24/7</h4>
            <p className="tip-text">
              Disponible todos los días del año
            </p>
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon tip-icon-secure">
            <i className="bi bi-shield-check"></i>
          </div>
          <div className="tip-content">
            <h4 className="tip-title">Información Segura</h4>
            <p className="tip-text">
              Tus datos están protegidos
            </p>
          </div>
        </div>
      </div>

      <div className="soporte-form-container">
        <SoporteForm />
      </div>

      <div className="categorias-ayuda">
        <h3 className="categorias-title">Tipos de Soporte</h3>
        <div className="categorias-grid">
          <div className="categoria-card">
            <div className="categoria-icon categoria-tecnico">
              <i className="bi bi-tools"></i>
            </div>
            <h4 className="categoria-name">Técnico</h4>
            <p className="categoria-description">
              Problemas técnicos, errores del sistema, bugs o funcionamiento incorrecto
            </p>
          </div>

          <div className="categoria-card">
            <div className="categoria-icon categoria-informacion">
              <i className="bi bi-question-circle"></i>
            </div>
            <h4 className="categoria-name">Información</h4>
            <p className="categoria-description">
              Consultas generales, preguntas sobre funcionalidades o cómo usar el sistema
            </p>
          </div>

          <div className="categoria-card">
            <div className="categoria-icon categoria-reclamo">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h4 className="categoria-name">Reclamo</h4>
            <p className="categoria-description">
              Reportar problemas con servicios, reservas o cualquier inconveniente grave
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoportePage;