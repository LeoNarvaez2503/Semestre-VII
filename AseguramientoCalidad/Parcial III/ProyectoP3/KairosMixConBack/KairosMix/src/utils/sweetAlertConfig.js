// sweetAlertConfig.js - Configuración global para SweetAlert2

export const swalConfig = {
  // Configuración por defecto para diálogos de confirmación
  confirmDialog: {
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#dc3545',
    reverseButtons: true,
    customClass: {
      cancelButton: 'btn-cancel'
    }
  },
  
  // Configuración para diálogos de eliminación
  deleteDialog: {
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn-danger',
      cancelButton: 'btn-cancel'
    }
  },
  
  // Configuración para diálogos de información
  infoDialog: {
    confirmButtonColor: '#007bff',
    customClass: {
      confirmButton: 'btn-primary'
    }
  },
  
  // Configuración para diálogos de éxito
  successDialog: {
    confirmButtonColor: '#28a745',
    customClass: {
      confirmButton: 'btn-success'
    }
  },
  
  // Configuración para diálogos de error
  errorDialog: {
    confirmButtonColor: '#dc3545',
    customClass: {
      confirmButton: 'btn-danger'
    }
  }
};

// Función helper para crear diálogos con configuración consistente
export const createSwalDialog = (type, options) => {
  const baseConfig = swalConfig[type] || {};
  return {
    ...baseConfig,
    ...options
  };
};
