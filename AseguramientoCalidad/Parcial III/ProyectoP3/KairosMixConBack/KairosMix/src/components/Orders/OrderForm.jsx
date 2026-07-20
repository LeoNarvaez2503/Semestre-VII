import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Minus, Calendar, User, Package, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { api } from '../../utils/api';
import './OrderForm.css';

const OrderForm = ({ order, isEditing, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    client: null,
    products: [],
    date: '',
    observations: '',
    subtotal: 0,
    taxes: 0,
    total: 0,
    paymentMethod: 'Efectivo'
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClients();
    loadProducts();
    
    if (isEditing && order) {
      setFormData({
        client: order.client,
        products: order.products || [],
        date: order.date,
        observations: order.observations || '',
        subtotal: order.subtotal || 0,
        taxes: order.taxes || 0,
        total: order.total || 0,
        paymentMethod: order.paymentMethod || 'Efectivo'
      });
    } else {
      // Fecha actual por defecto
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
      setFormData(prev => ({ ...prev, date: formattedDate }));
    }
  }, [isEditing, order]);

  useEffect(() => {
    calculateTotals();
  }, [formData.products]);

  const loadClients = () => {
    api.getClients().then(setClients).catch(error => {
      console.error('Error loading clients:', error);
    });
  };

  const loadProducts = () => {
    api.getProducts().then(setProducts).catch(error => {
      console.error('Error loading products:', error);
    });
  };

  const calculateTotals = () => {
    const subtotal = formData.products.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxes = subtotal * 0.15; // 15% IVA
    const total = subtotal + taxes;

    setFormData(prev => ({
      ...prev,
      subtotal,
      taxes,
      total
    }));
  };

  const validateDate = (dateString) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) return false;
    
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 2020 || year > 2030) return false;
    
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar cliente
    if (!formData.client) {
      newErrors.client = 'Debe seleccionar un cliente';
    }

    // Validar productos
        if (formData.products.length === 0) {
      newErrors.products = 'Debe agregar al menos un producto';
    } else {
      formData.products.forEach((item, index) => {
        if (item.quantity <= 0) {
          newErrors[`quantity_${index}`] = 'La cantidad debe ser mayor a cero';
        }
        
        // Verificar stock disponible
        const product = products.find(p => p.id === item.productId || p.code === item.code);
        const availableStock = product ? (product.stock ?? product.currentStock ?? product.initialStock ?? 0) : 0;
        if (product && item.quantity > availableStock) {
          newErrors[`stock_${index}`] = `Stock insuficiente. Disponible: ${availableStock}`;
        }
      });
    }

    // Validar fecha
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    } else if (!validateDate(formData.date)) {
      newErrors.date = 'Formato de fecha inválido (DD/MM/AAAA)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClientSelect = (clientId) => {
    const selectedClient = clients.find(c => String(c.id) === String(clientId));
    setFormData(prev => ({ ...prev, client: selectedClient }));
    setErrors(prev => ({ ...prev, client: '' }));
  };

  const addProductLine = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productId: null, code: '', name: '', quantity: 1, price: 0 }]
    }));
  };

  const removeProductLine = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateProductLine = (index, field, value) => {
    const updatedProducts = [...formData.products];
    
    if (field === 'code') {
      const selectedProduct = products.find(p => p.code === value);
      if (selectedProduct) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          productId: selectedProduct.id,
          code: selectedProduct.code,
          name: selectedProduct.name,
          price: selectedProduct.retailPrice
        };
      }
    } else if (field === 'quantity') {
      const quantity = parseInt(value) || 0;
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantity: quantity
      };
    }

    setFormData(prev => ({
      ...prev,
      products: updatedProducts
    }));

    // Limpiar errores específicos de este producto
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`quantity_${index}`];
      delete newErrors[`stock_${index}`];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        title: 'Datos Incompletos',
        text: 'Por favor corrige los errores antes de continuar',
        icon: 'warning'
      });
      return;
    }

    setLoading(true);

    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Actualizar stock de productos
      if (!isEditing) {
        updateProductStock();
      } else {
        updateProductStockForEdit();
      }

      onSubmit(formData);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Error al procesar el pedido',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = () => {
    const updatedProducts = [...products];
    
    formData.products.forEach(orderItem => {
      const productIndex = updatedProducts.findIndex(p => p.code === orderItem.code);
      if (productIndex !== -1) {
        updatedProducts[productIndex].stock -= orderItem.quantity;
      }
    });

    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const updateProductStockForEdit = () => {
    // Para edición, necesitamos restaurar el stock original y aplicar el nuevo
    const updatedProducts = [...products];
    
    // Restaurar stock del pedido original
    if (order && order.products) {
      order.products.forEach(originalItem => {
        const productIndex = updatedProducts.findIndex(p => p.code === originalItem.code);
        if (productIndex !== -1) {
          updatedProducts[productIndex].stock += originalItem.quantity;
        }
      });
    }

    // Aplicar nuevo stock
    formData.products.forEach(orderItem => {
      const productIndex = updatedProducts.findIndex(p => p.code === orderItem.code);
      if (productIndex !== -1) {
        updatedProducts[productIndex].stock -= orderItem.quantity;
      }
    });

    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="order-form">
      <div className="order-form-header">
        <h3>
          <Package className="header-icon" />
          {isEditing ? `Editar Pedido #${order?.id}` : 'Nuevo Pedido'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="order-form-content">
        <div className="row">
          {/* Información del Cliente */}
          <div className="col-md-6">
            <div className="form-section">
              <h5>
                <User size={18} />
                Información del Cliente
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Cliente *</label>
                <select
                  className={`form-select ${errors.client ? 'is-invalid' : ''}`}
                  value={formData.client?.id || ''}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  data-testid="order-client-select"
                >
                  <option value="">Seleccione un cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.documentId || client.idNumber || client.identification}
                    </option>
                  ))}
                </select>
                {errors.client && (
                  <div className="invalid-feedback">{errors.client}</div>
                )}
              </div>

              {formData.client && (
                <div className="client-info">
                  <p><strong>Email:</strong> {formData.client.email}</p>
                  <p><strong>Teléfono:</strong> {formData.client.phone}</p>
                  <p><strong>Dirección:</strong> {formData.client.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información del Pedido */}
          <div className="col-md-6">
            <div className="form-section">
              <h5>
                <Calendar size={18} />
                Información del Pedido
              </h5>
              
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Fecha del Pedido *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    placeholder="DD/MM/AAAA"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, date: e.target.value }));
                      setErrors(prev => ({ ...prev, date: '' }));
                    }}
                  />
                  {errors.date && (
                    <div className="invalid-feedback">{errors.date}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Método de Pago</label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="form-section">
          <div className="products-header">
            <h5>
              <Package size={18} />
              Productos del Pedido
            </h5>
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={addProductLine}
              data-testid="order-add-product-button"
            >
              <Plus size={16} />
              Agregar Producto
            </button>
          </div>

          {errors.products && (
            <div className="alert alert-danger">
              <AlertCircle size={16} />
              {errors.products}
            </div>
          )}

          <div className="products-list">
            {formData.products.map((item, index) => (
              <div key={index} className="product-line">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <label className="form-label">Producto</label>
                    <select
                      className="form-select"
                      value={item.code}
                      onChange={(e) => updateProductLine(index, 'code', e.target.value)}
                      data-testid={`order-product-select-${index}`}
                    >
                      <option value="">Seleccione un producto</option>
                      {products.map(product => (
                        <option key={product.code} value={product.code}>
                          {product.name} - Stock: {product.stock ?? product.currentStock ?? product.initialStock ?? 0}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Cantidad</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors[`quantity_${index}`] || errors[`stock_${index}`] ? 'is-invalid' : ''
                      }`}
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateProductLine(index, 'quantity', e.target.value)}
                      data-testid={`order-product-quantity-${index}`}
                    />
                    {(errors[`quantity_${index}`] || errors[`stock_${index}`]) && (
                      <div className="invalid-feedback">
                        {errors[`quantity_${index}`] || errors[`stock_${index}`]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Precio Unit.</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formatCurrency(item.price)}
                      readOnly
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Subtotal</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formatCurrency(item.quantity * item.price)}
                      readOnly
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm w-100"
                      onClick={() => removeProductLine(index)}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div className="form-section">
          <h5>Observaciones</h5>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Comentarios o instrucciones especiales..."
            value={formData.observations}
            onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
          />
        </div>

        {/* Resumen de Totales */}
        <div className="totals-section">
          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="totals-card">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(formData.subtotal)}</span>
                </div>
                <div className="total-line">
                  <span>IVA (15%):</span>
                  <span>{formatCurrency(formData.taxes)}</span>
                </div>
                <div className="total-line total-final">
                  <strong>
                    <span>Total:</span>
                    <span>{formatCurrency(formData.total)}</span>
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
            data-testid="order-cancel-button"
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            data-testid="order-submit-button"
          >
            <Save size={16} />
            {loading ? 'Procesando...' : (isEditing ? 'Actualizar Pedido' : 'Registrar Pedido')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
