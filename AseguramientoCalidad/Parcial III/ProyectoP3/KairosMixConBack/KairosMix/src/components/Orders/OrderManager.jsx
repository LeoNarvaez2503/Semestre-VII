import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, Plus, Download, FileText, Filter, RotateCcw, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { initializeSampleData } from '../../data/seedData';
import OrderForm from './OrderForm';
import OrderDetails from './OrderDetails';
import OrderReport from './OrderReport';
import { api } from '../../utils/api';
import './OrderManager.css';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const orderStatuses = {
    'client_pending': {
      color: 'info',
      nextStates: ['Pendiente', 'En Proceso', 'Cancelado'],
      description: 'Pedido enviado por cliente, pendiente de revisión del administrador'
    },
    'Pendiente': { 
      color: 'warning', 
      nextStates: ['En Proceso', 'Cancelado'],
      description: 'El pedido ha sido creado, pero aún no se procesa'
    },
    'En Proceso': { 
      color: 'primary', 
      nextStates: ['En Espera', 'Completado', 'Cancelado'],
      description: 'Se está preparando el pedido'
    },
    'En Espera': { 
      color: 'info', 
      nextStates: ['En Proceso', 'Cancelado'],
      description: 'El pedido está detenido temporalmente'
    },
    'Completado': { 
      color: 'success', 
      nextStates: [],
      description: 'El pedido se ha entregado exitosamente'
    },
    'Cancelado': { 
      color: 'danger', 
      nextStates: [],
      description: 'El pedido fue cancelado'
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const loadOrders = async () => {
    try {
      const fetchedOrders = await api.getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const saveOrders = () => {
    // Deprecated for direct api usage, kept to avoid breaking changes if used elsewhere
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filtro por término de búsqueda (ID o nombre de cliente)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().includes(term) ||
        order.clientName.toLowerCase().includes(term) ||
        order.clientId.includes(term)
      );
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtro por rango de fechas
    if (dateFilter.from) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date || order.createdAt);
        const fromDate = new Date(dateFilter.from);
        return orderDate >= fromDate;
      });
    }

    if (dateFilter.to) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date || order.createdAt);
        const toDate = new Date(dateFilter.to);
        return orderDate <= toDate;
      });
    }

    setFilteredOrders(filtered);
  };

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleDeleteOrder = async (order) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el pedido #${order.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.deleteOrder(order.id);
        const updatedOrders = orders.filter(o => o.id !== order.id);
        setOrders(updatedOrders);
        
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El pedido ha sido eliminado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch(e) { console.error(e); }
    }
  };

  const handleChangeStatus = async (order) => {
    const statusConfig = orderStatuses[order.status];
    
    if (!statusConfig) {
      Swal.fire({
        title: 'Estado No Reconocido',
        text: `El estado "${order.status}" no es válido`,
        icon: 'error'
      });
      return;
    }
    
    const availableStates = statusConfig.nextStates;
    
    if (availableStates.length === 0) {
      Swal.fire({
        title: 'Estado No Modificable',
        text: `No se puede cambiar el estado de un pedido ${order.status.toLowerCase()}`,
        icon: 'info'
      });
      return;
    }

    const { value: newStatus } = await Swal.fire({
      title: 'Cambiar Estado del Pedido',
      text: `Pedido #${order.id} - Estado actual: ${order.status}`,
      input: 'select',
      inputOptions: availableStates.reduce((options, state) => {
        options[state] = `${state} - ${orderStatuses[state].description}`;
        return options;
      }, {}),
      inputPlaceholder: 'Selecciona el nuevo estado',
      showCancelButton: true,
      confirmButtonText: 'Cambiar Estado',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar un estado';
        }
      }
    });

    if (newStatus) {
      try {
        await api.updateOrderStatus(order.id, newStatus);
        const updatedOrders = orders.map(o => 
          o.id === order.id ? { ...o, status: newStatus } : o
        );
        setOrders(updatedOrders);

        Swal.fire({
          title: '¡Estado Actualizado!',
          text: `El pedido #${order.id} ahora está ${newStatus}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleFormSubmit = async (orderData) => {
    try {
      if (isEditing && selectedOrder) {
        // En una app real haríamos api.updateOrder(...) pero usaremos el estado local aquí como fallback visual
        const updatedOrders = orders.map(order => 
          order.id === selectedOrder.id ? orderData : order
        );
        setOrders(updatedOrders);
        
        Swal.fire({
          title: '¡Actualizado!',
          text: 'El pedido ha sido actualizado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        const newOrderData = {
          ...orderData,
          status: 'Pendiente'
        };
        const newOrder = await api.createOrder(newOrderData);
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        
        Swal.fire({
          title: '¡Registrado!',
          text: `Pedido #${newOrder.id} registrado correctamente`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch(e) { console.error(e); }
    
    setShowForm(false);
    setSelectedOrder(null);
    setIsEditing(false);
  };

  const generateOrderId = () => {
    if (orders.length === 0) return 1;
    
    // Obtener el último ID usado y simplemente incrementar
    const lastId = Math.max(...orders.map(order => order.id));
    
    return lastId + 1;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter({ from: '', to: '' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Fecha no disponible';
    }
    
    // Si es un string ISO (formato createdAt), convertir a DD/MM/YYYY
    if (dateString.includes('T') || dateString.includes('-')) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    
    // Si ya está en formato DD/MM/YYYY, devolverlo tal como está
    return dateString;
  };

  if (showForm) {
    return (
      <OrderForm
        order={selectedOrder}
        isEditing={isEditing}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setSelectedOrder(null);
          setIsEditing(false);
        }}
      />
    );
  }

  if (showDetails) {
    return (
      <OrderDetails
        order={selectedOrder}
        onClose={() => {
          setShowDetails(false);
          setSelectedOrder(null);
        }}
        onEdit={() => {
          setShowDetails(false);
          handleEditOrder(selectedOrder);
        }}
      />
    );
  }

  if (showReport) {
    return (
      <OrderReport
        orders={orders}
        onClose={() => setShowReport(false)}
      />
    );
  }

  return (
    <div className="order-manager">
      <div className="order-manager-header">
        <h2>
          <FileText className="header-icon" />
          Gestión de Pedidos
        </h2>
        <div className="header-actions">
          <button
            className="btn btn-warning btn-sm"
            onClick={() => {
              initializeSampleData();
              loadOrders();
              Swal.fire({
                icon: 'success',
                title: 'Datos actualizados',
                text: 'Los datos han sido recargados correctamente',
                timer: 2000,
                showConfirmButton: false
              });
            }}
            title="Recargar datos de ejemplo"
          >
            <RefreshCw size={16} />
            Recargar Datos
          </button>
          <button
            className="btn btn-success btn-sm"
            onClick={handleAddOrder}
            data-testid="new-order-button"
          >
            <Plus size={16} />
            Nuevo Pedido
          </button>
          <button
            className="btn btn-info btn-sm"
            onClick={() => setShowReport(true)}
          >
            <Download size={16} />
            Generar Reporte
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <div className="search-input-group">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID de pedido, nombre o identificación del cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtros
          </button>
          {(searchTerm || statusFilter || dateFilter.from || dateFilter.to) && (
            <button
              className="btn btn-outline-warning"
              onClick={clearFilters}
            >
              <RotateCcw size={16} />
              Limpiar
            </button>
          )}
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Estado del Pedido</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  {Object.keys(orderStatuses).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Fecha Desde</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Fecha Hasta</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-results">
            <FileText size={48} className="text-muted" />
            <h5 className="text-muted mt-3">
              {orders.length === 0 ? 'No hay pedidos registrados' : 'No se encontraron pedidos'}
            </h5>
            <p className="text-muted">
              {orders.length === 0 
                ? 'Comienza agregando tu primer pedido' 
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Productos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} data-testid={`order-row-${order.id}`}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{order.clientName}</strong>
                        <br />
                        <small className="text-muted">{order.clientId}</small>
                      </div>
                    </td>
                    <td>{formatDate(order.date || order.createdAt)}</td>
                    <td>
                      <strong className="text-success">
                        {formatCurrency(order.totalAmount)}
                      </strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span 
                          className={`badge bg-${orderStatuses[order.status]?.color || 'secondary'} cursor-pointer`}
                          onClick={() => handleChangeStatus(order)}
                          title="Click para cambiar estado"
                          data-testid={`order-status-${order.id}`}
                        >
                          {order.status === 'client_pending' ? 'Pedido de Cliente' : order.status}
                        </span>
                        {order.clientRequest && (
                          <span 
                            className="badge bg-gradient bg-primary"
                            title="Pedido enviado por un cliente"
                            style={{ fontSize: '0.7em' }}
                          >
                            👤 Cliente
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <small>{order.products.length} producto(s)</small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-info"
                          onClick={() => handleViewOrder(order)}
                          title="Ver detalles"
                          aria-label={`Ver detalles pedido ${order.id}`}
                          data-testid={`view-order-${order.id}`}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handleEditOrder(order)}
                          title="Editar pedido"
                          aria-label={`Editar pedido ${order.id}`}
                          data-testid={`edit-order-${order.id}`}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteOrder(order)}
                          title="Eliminar pedido"
                          aria-label={`Eliminar pedido ${order.id}`}
                          data-testid={`delete-order-${order.id}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="summary-info">
        <div className="row">
          <div className="col-md-3">
            <div className="summary-card">
              <h6>Total Pedidos</h6>
              <h4>{filteredOrders.length}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="summary-card">
              <h6>Pendientes</h6>
              <h4 className="text-warning">
                {filteredOrders.filter(o => o.status === 'Pendiente').length}
              </h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="summary-card">
              <h6>En Proceso</h6>
              <h4 className="text-primary">
                {filteredOrders.filter(o => o.status === 'En Proceso').length}
              </h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="summary-card">
              <h6>Completados</h6>
              <h4 className="text-success">
                {filteredOrders.filter(o => o.status === 'Completado').length}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
