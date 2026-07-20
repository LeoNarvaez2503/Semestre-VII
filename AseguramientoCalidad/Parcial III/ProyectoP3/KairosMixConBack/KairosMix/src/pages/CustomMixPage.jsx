import React, { useState, useEffect } from 'react';
import CustomMixDesigner from '../components/CustomMix/CustomMixDesigner';
import Swal from 'sweetalert2';
import { api } from '../utils/api';

const CustomMixPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.getProducts()
            .then((items) => {
                const availableProducts = items.filter(product => (product.currentStock ?? product.stock ?? product.initialStock ?? 0) > 0);
                setProducts(availableProducts);
            })
            .catch(console.error);
    }, []);

    const handleCreateOrder = async (mixData) => {
        try {
            // Show order creation form with mix data
            const { value: formData } = await Swal.fire({
                title: 'Crear Pedido con Mezcla Personalizada',
                html: `
                    <div style="text-align: left;">
                        <div style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Cliente (Cédula/RUC/Pasaporte):</label>
                            <input id="clientId" class="swal2-input" placeholder="Ej: 1234567890" style="margin: 0;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Observaciones:</label>
                            <textarea id="observations" class="swal2-textarea" placeholder="Observaciones adicionales..." style="margin: 0; height: 80px;"></textarea>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;">
                            <h5 style="margin: 0 0 10px 0; color: #495057;">Resumen de la Mezcla:</h5>
                            <p style="margin: 5px 0;"><strong>Nombre:</strong> ${mixData.name}</p>
                            <p style="margin: 5px 0;"><strong>Total:</strong> $${mixData.totalPrice.toFixed(2)}</p>
                            <p style="margin: 5px 0;"><strong>Productos:</strong> ${mixData.components.length}</p>
                        </div>
                    </div>
                `,
                width: '500px',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Crear Pedido',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                preConfirm: () => {
                    const clientId = document.getElementById('clientId').value;
                    const observations = document.getElementById('observations').value;
                    
                    if (!clientId.trim()) {
                        Swal.showValidationMessage('El ID del cliente es requerido');
                        return false;
                    }
                    
                    return {
                        clientId: clientId.trim(),
                        observations: observations.trim()
                    };
                }
            });

                if (formData) {
                const clients = await api.getClients();
                const client = clients.find(c => String(c.documentId ?? c.idNumber ?? c.identification ?? '') === formData.clientId);
                
                if (!client) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Cliente no encontrado',
                        text: 'No se encontró un cliente con ese ID. Registra el cliente primero.',
                        confirmButtonText: 'Entendido'
                    });
                    return;
                }

                const createdOrder = await api.createOrder({
                    clientId: client.id,
                    status: 'PENDING',
                    notes: formData.observations,
                    items: mixData.components.map(component => ({
                        productId: component.productId,
                        quantity: component.quantity,
                        unitPrice: component.unitPrice ?? (component.price / component.quantity),
                        priceType: 'RETAIL'
                    }))
                });

                await Swal.fire({
                    icon: 'success',
                    title: '¡Pedido creado exitosamente!',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>ID del Pedido:</strong> ${createdOrder.id}</p>
                            <p><strong>Cliente:</strong> ${client.name}</p>
                            <p><strong>Mezcla:</strong> ${mixData.name}</p>
                            <p><strong>Total:</strong> $${mixData.totalPrice.toFixed(2)}</p>
                            <p><strong>Estado:</strong> Pendiente</p>
                        </div>
                    `,
                    confirmButtonText: 'Continuar'
                });

                // Refresh products list
                const refreshedProducts = await api.getProducts();
                const availableProducts = refreshedProducts.filter(product => (product.currentStock ?? product.stock ?? product.initialStock ?? 0) > 0);
                setProducts(availableProducts);
            }

        } catch (error) {
            console.error('Error creating order:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error del sistema',
                text: 'No se pudo crear el pedido. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Reintentar'
            });
        }
    };

    return (
        <div className="custom-mix-page">
            {products.length === 0 ? (
                <div className="no-products-available">
                    <div className="alert alert-warning" style={{ 
                        textAlign: 'center', 
                        padding: '30px', 
                        margin: '50px auto',
                        maxWidth: '600px',
                        borderRadius: '15px',
                        border: '2px solid #ffc107'
                    }}>
                        <h4>⚠️ No hay productos disponibles</h4>
                        <p>No hay productos con stock disponible para crear mezclas personalizadas.</p>
                        <p>Ve a la sección de <strong>Productos</strong> para agregar nuevos productos o verificar el inventario.</p>
                    </div>
                </div>
            ) : (
                <CustomMixDesigner 
                    products={products}
                    onCreateOrder={handleCreateOrder}
                />
            )}
        </div>
    );
};

export default CustomMixPage;
