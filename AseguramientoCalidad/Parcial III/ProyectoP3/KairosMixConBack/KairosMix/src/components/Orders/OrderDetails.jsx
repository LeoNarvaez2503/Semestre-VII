import React, { useState, useEffect } from 'react';
import { X, Edit, User, Package, Calendar, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import './OrderDetails.css';

const OrderDetails = ({ order, onClose, onEdit }) => {
  const [clientData, setClientData] = useState(null);

  // Cargar información completa del cliente
  useEffect(() => {
    if (order?.clientId) {
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      const client = clients.find(c => c.id === order.clientId);
      setClientData(client);
    }
  }, [order?.clientId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return dateString; // Ya está en formato DD/MM/YYYY
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'Pendiente': 'warning',
      'En Proceso': 'primary',
      'En Espera': 'info',
      'Completado': 'success',
      'Cancelado': 'danger'
    };
    return colors[status] || 'secondary';
  };

  if (!order) return null;

  return (
    <div className="order-details">
      <div className="order-details-header">
        <div className="header-info">
          <h3>
            <Package className="header-icon" />
            Detalle del Pedido #{order.id}
          </h3>
          <div className="header-badges">
            <span className={`badge bg-${getStatusBadgeColor(order.status)} fs-6`}>
              {order.status}
            </span>
            <span className="badge bg-light text-dark fs-6">
              {order.paymentMethod || 'Efectivo'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-warning btn-sm"
            onClick={onEdit}
          >
            <Edit size={16} />
            Editar
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            <X size={16} />
            Cerrar
          </button>
        </div>
      </div>

      <div className="order-details-content">
        <div className="row">
          {/* Información del Cliente */}
          <div className="col-md-6">
            <div className="detail-section">
              <h5 className="section-title">
                <User size={18} />
                Información del Cliente
              </h5>
              <div className="client-details">
                <div className="detail-item">
                  <strong>Nombre:</strong>
                  <span>{order.clientName || clientData?.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <strong>Identificación:</strong>
                  <span>{order.clientId || clientData?.identification || 'N/A'}</span>
                </div>
                {clientData?.email && (
                  <div className="detail-item">
                    <Mail size={16} />
                    <span>{clientData.email}</span>
                  </div>
                )}
                {clientData?.phone && (
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{clientData.phone}</span>
                  </div>
                )}
                {clientData?.address && (
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{clientData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información del Pedido */}
          <div className="col-md-6">
            <div className="detail-section">
              <h5 className="section-title">
                <Calendar size={18} />
                Información del Pedido
              </h5>
              <div className="order-info">
                <div className="detail-item">
                  <strong>Fecha del Pedido:</strong>
                  <span>{formatDate(order.date)}</span>
                </div>
                <div className="detail-item">
                  <strong>Estado:</strong>
                  <span className={`badge bg-${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="detail-item">
                  <CreditCard size={16} />
                  <span>{order.paymentMethod || 'Efectivo'}</span>
                </div>
                {order.observations && (
                  <div className="detail-item">
                    <strong>Observaciones:</strong>
                    <div className="observations-text">
                      {order.observations}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Productos del Pedido */}
        <div className="detail-section">
          <h5 className="section-title">
            <Package size={18} />
            Productos del Pedido
          </h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <code>{product.code}</code>
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>
                      <span className="quantity-badge">
                        {product.quantity}
                      </span>
                    </td>
                    <td>
                      {formatCurrency(product.price)}
                    </td>
                    <td>
                      <strong>{formatCurrency(product.quantity * product.price)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen de Totales */}
        <div className="detail-section">
          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="totals-summary">
                <h5 className="section-title">Resumen de Totales</h5>
                <div className="totals-details">
                  <div className="total-line">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal || 0)}</span>
                  </div>
                  <div className="total-line">
                    <span>IVA (15%):</span>
                    <span>{formatCurrency(order.taxes || 0)}</span>
                  </div>
                  <hr />
                  <div className="total-line total-final">
                    <strong>
                      <span>Total:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="detail-section">
          <div className="row">
            <div className="col-md-6">
              <div className="info-card">
                <h6>Estadísticas del Pedido</h6>
                <ul>
                  <li>Productos diferentes: <strong>{order.products.length}</strong></li>
                  <li>
                    Cantidad total: 
                    <strong> {order.products.reduce((sum, p) => sum + p.quantity, 0)} unidades</strong>
                  </li>
                  <li>
                    Precio promedio: 
                    <strong> {formatCurrency(order.total / order.products.reduce((sum, p) => sum + p.quantity, 0))}</strong>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="info-card">
                <h6>Información del Sistema</h6>
                <ul>
                  <li>ID del Pedido: <code>#{order.id}</code></li>
                  <li>
                    Fecha de Registro: 
                    <span> {formatDate(order.date)}</span>
                  </li>
                  <li>
                    Estado Actual: 
                    <span className={`badge bg-${getStatusBadgeColor(order.status)} ms-1`}>
                      {order.status}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
