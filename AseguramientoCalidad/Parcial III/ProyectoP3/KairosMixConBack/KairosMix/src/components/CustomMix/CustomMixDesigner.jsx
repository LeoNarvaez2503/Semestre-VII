import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Trash2, 
    Edit3, 
    Save, 
    ShoppingCart, 
    Calculator, 
    Info,
    Package,
    Eye,
    AlertTriangle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { createSwalDialog } from '../../utils/sweetAlertConfig';
import NutritionalInfo from './NutritionalInfo';
import SavedMixSelector from './SavedMixSelector';
import { api } from '../../utils/api';
import './CustomMixDesigner.css';

const CustomMixDesigner = ({ products = [], onCreateOrder }) => {
    const [mixName, setMixName] = useState('');
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editingQuantity, setEditingQuantity] = useState('');
    const [savedMixes, setSavedMixes] = useState([]);
    const [errors, setErrors] = useState({});
    
    // Detectar si estamos en modo cliente
    const [isClientMode, setIsClientMode] = useState(false);

    useEffect(() => {
        const checkClientMode = () => {
            const viewMode = localStorage.getItem('viewMode');
            setIsClientMode(viewMode === 'client');
        };
        
        checkClientMode();
        
        // Escuchar cambios en localStorage
        window.addEventListener('storage', checkClientMode);
        return () => window.removeEventListener('storage', checkClientMode);
    }, []);

    // Load saved mixes on component mount
    useEffect(() => {
        api.getCustomMixes().then(setSavedMixes).catch(console.error);
    }, []);

    // Sample nutritional data for products
    const nutritionalData = {
        'A01': { // Almendras Premium
            calories: 579,
            protein: 21.2,
            fat: 49.9,
            carbs: 21.6,
            fiber: 12.5,
            vitamins: ['E', 'B2', 'Niacina'],
            minerals: ['Magnesio', 'Calcio', 'Hierro']
        },
        'N01': { // Nueces de Castilla
            calories: 654,
            protein: 15.2,
            fat: 65.2,
            carbs: 13.7,
            fiber: 6.7,
            vitamins: ['E', 'B6', 'Folato'],
            minerals: ['Manganeso', 'Cobre', 'Magnesio']
        },
        'P01': { // Pasas Sultan
            calories: 299,
            protein: 3.1,
            fat: 0.5,
            carbs: 79.2,
            fiber: 3.7,
            vitamins: ['K', 'B6', 'Tiamina'],
            minerals: ['Potasio', 'Hierro', 'Manganeso']
        },
        'P02': { // Pistachos Tostados
            calories: 560,
            protein: 20.2,
            fat: 45.3,
            carbs: 27.2,
            fiber: 10.6,
            vitamins: ['B6', 'Tiamina', 'E'],
            minerals: ['Cobre', 'Manganeso', 'Fósforo']
        },
        'A02': { // Avellanas Enteras
            calories: 628,
            protein: 14.9,
            fat: 60.8,
            carbs: 16.7,
            fiber: 9.7,
            vitamins: ['E', 'B6', 'Folato'],
            minerals: ['Manganeso', 'Cobre', 'Magnesio']
        }
    };

    const validateMixName = (name) => {
        if (name.length < 3 || name.length > 25) {
            return 'El nombre debe tener entre 3 y 25 caracteres';
        }
        if (!/^[a-zA-Z0-9\s_]+$/.test(name)) {
            return 'Solo se permiten caracteres alfanuméricos, espacios y guiones bajos';
        }
        return null;
    };

    const validateQuantity = (qty, productCode) => {
        const numQty = parseFloat(qty);
        if (isNaN(numQty) || numQty <= 0) {
            return 'La cantidad debe ser un número positivo';
        }
        
        const product = products.find(p => p.code === productCode);
        if (!product) {
            return 'Producto no encontrado';
        }
        
        const availableStock = product.currentStock ?? product.stock ?? product.initialStock ?? 0;
        if (numQty > availableStock) {
            return `Solo hay ${availableStock} libras disponibles`;
        }
        
        return null;
    };

    const calculateProductPrice = (productCode, qty) => {
        const product = products.find(p => p.code === productCode);
        if (!product) return 0;
        return product.retailPrice * qty;
    };

    const calculateTotalPrice = () => {
        return selectedComponents.reduce((total, component) => {
            return total + calculateProductPrice(component.productCode, component.quantity);
        }, 0);
    };

    const calculateMixNutrition = () => {
        const totalNutrition = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            fiber: 0,
            vitamins: new Set(),
            minerals: new Set()
        };

        selectedComponents.forEach(component => {
            const nutrition = nutritionalData[component.productCode];
            if (nutrition) {
                // Calculate per pound (453.6g) nutritional values
                const factor = component.quantity; // quantity is already in pounds
                totalNutrition.calories += nutrition.calories * factor;
                totalNutrition.protein += nutrition.protein * factor;
                totalNutrition.fat += nutrition.fat * factor;
                totalNutrition.carbs += nutrition.carbs * factor;
                totalNutrition.fiber += nutrition.fiber * factor;
                
                nutrition.vitamins.forEach(v => totalNutrition.vitamins.add(v));
                nutrition.minerals.forEach(m => totalNutrition.minerals.add(m));
            }
        });

        return {
            ...totalNutrition,
            vitamins: Array.from(totalNutrition.vitamins),
            minerals: Array.from(totalNutrition.minerals)
        };
    };

    const handleAddComponent = async () => {
        try {
            // Clear previous errors
            setErrors({});

            if (!selectedProduct) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Producto requerido',
                    text: 'Por favor selecciona un producto',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            const quantityError = validateQuantity(quantity, selectedProduct);
            if (quantityError) {
                setErrors({ quantity: quantityError });
                await Swal.fire({
                    icon: 'error',
                    title: 'Cantidad inválida',
                    text: quantityError,
                    confirmButtonText: 'Corregir'
                });
                return;
            }

            // Check if product already exists in mix
            const existingIndex = selectedComponents.findIndex(c => c.productCode === selectedProduct);
            if (existingIndex !== -1) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Producto ya agregado',
                    text: 'Este producto ya está en la mezcla. Puedes modificar su cantidad.',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            const product = products.find(p => p.code === selectedProduct);
            const newComponent = {
                productId: product.id,
                productCode: selectedProduct,
                productName: product.name,
                quantity: parseFloat(quantity),
                unitPrice: product.retailPrice,
                price: calculateProductPrice(selectedProduct, parseFloat(quantity)),
                subtotal: calculateProductPrice(selectedProduct, parseFloat(quantity))
            };

            setSelectedComponents([...selectedComponents, newComponent]);
            setSelectedProduct('');
            setQuantity('');

            await Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                text: `${product.name} agregado a la mezcla`,
                timer: 1500,
                showConfirmButton: false
            });

        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error del sistema',
                text: 'No se pudo agregar el producto. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Reintentar'
            });
        }
    };

    const handleRemoveComponent = async (index) => {
        try {
            const component = selectedComponents[index];
            const result = await Swal.fire(createSwalDialog('deleteDialog', {
                title: '¿Eliminar producto?',
                text: `¿Estás seguro de eliminar ${component.productName} de la mezcla?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }));

            if (result.isConfirmed) {
                const newComponents = selectedComponents.filter((_, i) => i !== index);
                setSelectedComponents(newComponents);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Producto eliminado',
                    text: 'El producto ha sido eliminado de la mezcla',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error del sistema',
                text: 'No se pudo eliminar el producto. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Reintentar'
            });
        }
    };

    const handleEditQuantity = async (index) => {
        try {
            const component = selectedComponents[index];
            const quantityError = validateQuantity(editingQuantity, component.productCode);
            
            if (quantityError) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Cantidad inválida',
                    text: quantityError,
                    confirmButtonText: 'Corregir'
                });
                setEditingQuantity(component.quantity.toString());
                return;
            }

            const newComponents = [...selectedComponents];
            newComponents[index] = {
                ...component,
                quantity: parseFloat(editingQuantity),
                price: calculateProductPrice(component.productCode, parseFloat(editingQuantity)),
                subtotal: calculateProductPrice(component.productCode, parseFloat(editingQuantity))
            };

            setSelectedComponents(newComponents);
            setEditingIndex(-1);
            setEditingQuantity('');

            await Swal.fire({
                icon: 'success',
                title: 'Cantidad actualizada',
                text: 'La cantidad ha sido actualizada correctamente',
                timer: 1500,
                showConfirmButton: false
            });

        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error del sistema',
                text: 'No se pudo actualizar la cantidad. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Reintentar'
            });
            setEditingQuantity(selectedComponents[index].quantity.toString());
        }
    };

    const handleSaveMix = async () => {
        try {
            if (selectedComponents.length === 0) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Mezcla vacía',
                    text: 'Agrega al menos un producto para guardar la mezcla',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            const nameError = validateMixName(mixName);
            if (nameError) {
                setErrors({ mixName: nameError });
                await Swal.fire({
                    icon: 'error',
                    title: 'Nombre inválido',
                    text: nameError,
                    confirmButtonText: 'Corregir'
                });
                return;
            }

            // Check if mix name already exists
            if (savedMixes.some(mix => mix.name.toLowerCase() === mixName.toLowerCase())) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Nombre duplicado',
                    text: 'Ya existe una mezcla con este nombre. Elige un nombre diferente.',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // En modo cliente, preguntar qué hacer antes de guardar
            if (isClientMode) {
                const result = await Swal.fire({
                    title: '¿Qué deseas hacer?',
                    text: 'Selecciona una opción para tu mezcla personalizada',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#28a745',
                    cancelButtonColor: '#17a2b8',
                    confirmButtonText: 'Guardar y Realizar Pedido',
                    cancelButtonText: 'Solo Guardar',
                    showDenyButton: true,
                    denyButtonText: 'Cancelar',
                    denyButtonColor: '#6c757d',
                    reverseButtons: true
                });

                if (result.isDenied) {
                    return; // Usuario canceló
                }

                const newMix = {
                    name: mixName,
                    components: selectedComponents.map(c => ({
                        productId: c.productId,
                        productCode: c.productCode,
                        productName: c.productName,
                        quantity: c.quantity,
                        unitPrice: c.unitPrice,
                        subtotal: c.price
                    })),
                    totalPrice: calculateTotalPrice(),
                    nutrition: calculateMixNutrition()
                };

                try {
                    const savedMix = await api.createCustomMix(newMix);
                    const updatedMixes = [...savedMixes, savedMix];
                    setSavedMixes(updatedMixes);

                    if (result.isConfirmed) {
                        // Guardar y crear pedido
                        await Swal.fire({
                            icon: 'success',
                            title: '¡Mezcla guardada!',
                            text: `La mezcla "${mixName}" ha sido guardada correctamente`,
                            confirmButtonText: 'Continuar',
                            timer: 1500
                        });
                        handleCreateOrderForClient();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Solo guardar
                        await Swal.fire({
                            icon: 'success',
                            title: '¡Mezcla guardada! 😊',
                            text: `Tu mezcla "${mixName}" ha sido guardada correctamente. ¡Puedes encontrarla en tus mezclas guardadas!`,
                            confirmButtonText: 'Crear otra mezcla',
                            timer: 3000
                        });
                    }
                } catch(e) { console.error(e); }
                return;
            }

            // Comportamiento normal para administradores
                const newMix = {
                name: mixName,
                components: selectedComponents.map(c => ({
                        productId: c.productId,
                        productCode: c.productCode,
                        productName: c.productName,
                        quantity: c.quantity,
                        unitPrice: c.unitPrice,
                        subtotal: c.price
                })),
                totalPrice: calculateTotalPrice(),
                nutrition: calculateMixNutrition()
            };

            try {
                const savedMix = await api.createCustomMix(newMix);
                const updatedMixes = [...savedMixes, savedMix];
                setSavedMixes(updatedMixes);

                await Swal.fire({
                    icon: 'success',
                    title: '¡Mezcla guardada!',
                    text: `La mezcla "${mixName}" ha sido guardada correctamente`,
                    confirmButtonText: 'Continuar'
                });

                // Solo preguntar sobre crear pedido si NO está en modo cliente
                const result = await Swal.fire({
                    title: '¿Crear pedido?',
                    text: '¿Deseas crear un pedido con esta mezcla?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#28a745',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sí, crear pedido',
                    cancelButtonText: 'No, gracias'
                });

                if (result.isConfirmed) {
                    handleCreateOrder();
                }
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error del sistema',
                    text: 'No se pudo guardar la mezcla. Por favor, inténtalo de nuevo.',
                    confirmButtonText: 'Reintentar'
                });
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al procesar tu solicitud',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const handleCreateOrder = () => {
        if (selectedComponents.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Mezcla vacía',
                text: 'Agrega al menos un producto para crear un pedido',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const mixData = {
            name: mixName || `Mezcla personalizada ${Date.now()}`,
            components: selectedComponents,
            totalPrice: calculateTotalPrice(),
            nutrition: calculateMixNutrition()
        };

        if (onCreateOrder) {
            onCreateOrder(mixData);
            // Limpiar el estado después de crear el pedido exitosamente
            clearMixDesignerSilent();
        }
    };

    const handleCreateOrderForClient = async () => {
        if (selectedComponents.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Mezcla vacía',
                text: 'Agrega al menos un producto para realizar un pedido',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        try {
            // Formulario simplificado para clientes
            const { value: formData } = await Swal.fire({
                title: 'Realizar Pedido',
                html: `
                    <div style="text-align: left;">
                        <div style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Tu Cédula/RUC/Pasaporte:</label>
                            <input id="clientId" class="swal2-input" placeholder="Ej: 1234567890" style="margin: 0;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Comentarios adicionales (opcional):</label>
                            <textarea id="observations" class="swal2-textarea" placeholder="Alguna observación especial..." style="margin: 0; height: 80px;"></textarea>
                        </div>
                        <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #007bff;">
                            <h5 style="margin: 0 0 10px 0; color: #0056b3;">📦 Resumen de tu Pedido:</h5>
                            <p style="margin: 5px 0;"><strong>Mezcla:</strong> ${mixName || 'Mezcla Personalizada'}</p>
                            <p style="margin: 5px 0;"><strong>Total:</strong> $${calculateTotalPrice().toFixed(2)}</p>
                            <p style="margin: 5px 0;"><strong>Productos:</strong> ${selectedComponents.length}</p>
                            <p style="margin: 10px 0 5px 0; font-size: 0.9em; color: #666;">
                                <em>📋 Tu pedido será enviado al administrador para su procesamiento.</em>
                            </p>
                        </div>
                    </div>
                `,
                width: '500px',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Enviar Pedido 📤',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                preConfirm: () => {
                    const clientId = document.getElementById('clientId').value;
                    const observations = document.getElementById('observations').value;
                    
                    if (!clientId.trim()) {
                        Swal.showValidationMessage('Tu identificación es requerida');
                        return false;
                    }
                    
                    return {
                        clientId: clientId.trim(),
                        observations: observations.trim()
                    };
                }
            });

            if (formData) {
                // Verificar si el cliente existe mediante API
                const clients = await api.getClients();
                const client = clients.find(c => String(c.documentId ?? c.idNumber ?? c.identification ?? '') === formData.clientId);
                
                if (!client) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Cliente no registrado',
                        text: 'No encontramos tu información. Por favor, contacta al administrador para registrarte primero.',
                        confirmButtonText: 'Entendido',
                        footer: '<small>Tip: Solicita al administrador que registre tu información como cliente</small>'
                    });
                    return;
                }

                const mixData = {
                    name: mixName || `Mezcla personalizada ${Date.now()}`,
                    components: selectedComponents,
                    totalPrice: calculateTotalPrice(),
                    nutrition: calculateMixNutrition()
                };

                // Crear pedido con estado especial para clientes
                const newOrder = {
                    clientId: client.id,
                    totalPrice: mixData.totalPrice,
                    status: 'CLIENT_PENDING', // Estado especial para pedidos de clientes
                    notes: formData.observations,
                    items: mixData.components.map(component => ({
                        productId: component.productId,
                        quantity: component.quantity,
                        unitPrice: component.unitPrice ?? (component.price / component.quantity)
                    }))
                };

                // Guardar pedido
                const createdOrder = await api.createOrder(newOrder);

                await Swal.fire({
                    icon: 'success',
                    title: '¡Pedido enviado exitosamente! 🎉',
                    html: `
                        <div style="text-align: left;">
                            <div style="background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                                <p style="margin: 5px 0;"><strong>📋 ID del Pedido:</strong> #${createdOrder.id}</p>
                                <p style="margin: 5px 0;"><strong>👤 Cliente:</strong> ${client.name}</p>
                                <p style="margin: 5px 0;"><strong>🥜 Mezcla:</strong> ${mixData.name}</p>
                                <p style="margin: 5px 0;"><strong>💰 Total:</strong> $${mixData.totalPrice.toFixed(2)}</p>
                                <p style="margin: 10px 0 5px 0; font-weight: bold; color: #155724;">
                                    Estado: Enviado al administrador
                                </p>
                            </div>
                            <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <p style="margin: 0; font-size: 0.9em; color: #856404;">
                                    <strong>Próximos pasos:</strong> El administrador revisará tu pedido.
                                </p>
                            </div>
                        </div>
                    `,
                    confirmButtonText: 'Perfecto, gracias 😊',
                    width: '600px'
                });

                // Limpiar el diseñador después de enviar el pedido
                clearMixDesignerSilent();
            }

        } catch (error) {
            console.error('Error creating client order:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error del sistema',
                text: 'No se pudo enviar tu pedido. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Reintentar'
            });
        }
    };

    // Función para limpiar sin confirmación (usada después de registrar pedido)
    const clearMixDesignerSilent = () => {
        setMixName('');
        setSelectedComponents([]);
        setSelectedProduct('');
        setQuantity('');
        setEditingIndex(-1);
        setEditingQuantity('');
        setErrors({});
        setShowNutritionalInfo(false);
    };

    // Función para limpiar el estado y volver al estado inicial
    const clearMixDesigner = async () => {
        const result = await Swal.fire({
            title: '¿Limpiar diseñador?',
            text: 'Se limpiará el diseñador y volverás al estado inicial para crear una nueva mezcla personalizada',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            setMixName('');
            setSelectedComponents([]);
            setSelectedProduct('');
            setQuantity('');
            setEditingIndex(-1);
            setEditingQuantity('');
            setErrors({});
            setShowNutritionalInfo(false);
            
            Swal.fire({
                title: '¡Diseñador limpio!',
                text: 'Puedes comenzar a crear una nueva mezcla personalizada',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const loadSavedMix = (mix) => {
        setMixName(mix.name);
        setSelectedComponents((mix.components || []).map(component => ({
            productId: component.productId ?? component.product?.id ?? null,
            productCode: component.productCode ?? component.product?.code ?? '',
            productName: component.productName ?? component.product?.name ?? '',
            quantity: component.quantity,
            unitPrice: component.unitPrice ?? component.price ?? 0,
            price: component.price ?? component.subtotal ?? 0,
            subtotal: component.subtotal ?? component.price ?? 0,
            nutritionalInfo: component.nutritionalInfo ?? null
        })));
    };

    const showNutritionForProduct = (productCode) => {
        const nutrition = nutritionalData[productCode];
        if (!nutrition) {
            Swal.fire({
                icon: 'info',
                title: 'Información no disponible',
                text: 'Información nutricional no disponible para este producto.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const product = products.find(p => p.code === productCode);
        setShowNutritionalInfo({
            product: product,
            nutrition: nutrition,
            isMix: false
        });
    };

    const showNutritionForMix = () => {
        if (selectedComponents.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Mezcla vacía',
                text: 'Agrega productos a la mezcla para ver la información nutricional.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        setShowNutritionalInfo({
            components: selectedComponents,
            nutrition: calculateMixNutrition(),
            isMix: true,
            mixName: mixName || 'Mezcla personalizada'
        });
    };

    return (
        <div className="custom-mix-designer">
            <div className="designer-header">
                <h1>
                    <Package size={32} />
                    {isClientMode ? 'Diseña Tu Mezcla Perfecta' : 'Diseñador de Mezclas Personalizadas'}
                </h1>
                <p>
                    {isClientMode 
                        ? '¡Bienvenido! Crea tu mezcla única seleccionando tus frutos secos favoritos'
                        : 'Crea mezclas únicas combinando nuestros productos premium'
                    }
                </p>
            </div>

            <div className="designer-content">
                {/* Mix Name Input */}
                <div className="mix-name-section">
                    <h3>Nombre de la Mezcla</h3>
                    <input
                        type="text"
                        value={mixName}
                        onChange={(e) => {
                            setMixName(e.target.value);
                            if (errors.mixName) {
                                setErrors({ ...errors, mixName: null });
                            }
                        }}
                        className={`form-control ${errors.mixName ? 'is-invalid' : ''}`}
                        placeholder="Ej: Mezcla Energética Premium"
                        maxLength={25}
                    />
                    {errors.mixName && <div className="invalid-feedback">{errors.mixName}</div>}
                    <small className="form-text text-muted">
                        Entre 3 y 25 caracteres. Solo letras, números, espacios y guiones bajos.
                    </small>
                </div>

                {/* Saved Mix Selector */}
                <SavedMixSelector 
                    savedMixes={savedMixes}
                    onLoadMix={loadSavedMix}
                />

                <div className="designer-grid">
                    {/* Product Selection */}
                    <div className="product-selection">
                        <h3>Agregar Productos</h3>
                        <div className="add-product-form">
                            <div className="form-group">
                                <label>Producto</label>
                                <select
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Seleccionar producto</option>
                                    {products.map(product => (
                                        <option key={product.code} value={product.code}>
                                            {product.name} - ${product.retailPrice}/lb 
                                            ({product.currentStock ?? product.stock ?? product.initialStock ?? 0} lb disponibles)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Cantidad (libras)</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        setQuantity(e.target.value);
                                        if (errors.quantity) {
                                            setErrors({ ...errors, quantity: null });
                                        }
                                    }}
                                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                    placeholder="Ej: 1.5"
                                    step="0.1"
                                    min="0.1"
                                />
                                {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                            </div>

                            <button
                                onClick={handleAddComponent}
                                className="btn btn-primary"
                                disabled={!selectedProduct || !quantity}
                            >
                                <Plus size={18} className="me-2" />
                                Agregar
                            </button>

                            {selectedProduct && (
                                <button
                                    onClick={() => showNutritionForProduct(selectedProduct)}
                                    className="btn btn-outline-info"
                                    title="Ver información nutricional"
                                >
                                    <Info size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mix Components */}
                    <div className="mix-components">
                        <div className="components-header">
                            <h3>Componentes de la Mezcla</h3>
                            {selectedComponents.length > 0 && (
                                <button
                                    onClick={showNutritionForMix}
                                    className="btn btn-outline-info btn-sm"
                                >
                                    <Eye size={16} className="me-1" />
                                    Ver Nutrición
                                </button>
                            )}
                        </div>

                        {selectedComponents.length === 0 ? (
                            <div className="empty-mix">
                                <AlertTriangle size={48} className="text-muted" />
                                <p>No hay productos en la mezcla</p>
                                <small>Selecciona productos para comenzar</small>
                            </div>
                        ) : (
                            <div className="components-list">
                                {selectedComponents.map((component, index) => (
                                    <div key={index} className="component-item">
                                        <div className="component-info">
                                            <h5>{component.productName}</h5>
                                            <div className="component-details">
                                                {editingIndex === index ? (
                                                    <div className="edit-quantity">
                                                        <input
                                                            type="number"
                                                            value={editingQuantity}
                                                            onChange={(e) => setEditingQuantity(e.target.value)}
                                                            className="form-control form-control-sm"
                                                            step="0.1"
                                                            min="0.1"
                                                        />
                                                        <button
                                                            onClick={() => handleEditQuantity(index)}
                                                            className="btn btn-success btn-sm"
                                                        >
                                                            <Save size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingIndex(-1);
                                                                setEditingQuantity('');
                                                            }}
                                                            className="btn btn-cancel btn-sm"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="quantity">{component.quantity} lb</span>
                                                        <span className="price">${component.price.toFixed(2)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {editingIndex !== index && (
                                            <div className="component-actions">
                                                <button
                                                    onClick={() => showNutritionForProduct(component.productCode)}
                                                    className="btn btn-outline-info btn-sm"
                                                    title="Ver información nutricional"
                                                >
                                                    <Info size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingIndex(index);
                                                        setEditingQuantity(component.quantity.toString());
                                                    }}
                                                    className="btn btn-outline-warning btn-sm"
                                                    title="Editar cantidad"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveComponent(index)}
                                                    className="btn btn-outline-danger btn-sm"
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Price Summary */}
                        {selectedComponents.length > 0 && (
                            <div className="price-summary">
                                <div className="total-price">
                                    <Calculator size={20} />
                                    <span>Total: ${calculateTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {selectedComponents.length > 0 && (
                    <div className="designer-actions">
                        <button
                            onClick={handleSaveMix}
                            className="btn btn-success btn-lg"
                            disabled={!mixName.trim()}
                        >
                            <Save size={20} className="me-2" />
                            {isClientMode ? 'Guardar Mi Mezcla' : 'Guardar Mezcla'}
                        </button>
                        
                        {isClientMode ? (
                            <button
                                onClick={handleCreateOrderForClient}
                                className="btn btn-primary btn-lg"
                                title="Enviar pedido al administrador"
                            >
                                <ShoppingCart size={20} className="me-2" />
                                Realizar Pedido 📤
                            </button>
                        ) : (
                            <button
                                onClick={handleCreateOrder}
                                className="btn btn-primary btn-lg"
                            >
                                <ShoppingCart size={20} className="me-2" />
                                Registrar Pedido
                            </button>
                        )}
                        
                        <button
                            onClick={clearMixDesigner}
                            className="btn btn-secondary btn-lg"
                        >
                            <Trash2 size={20} className="me-2" />
                            {isClientMode ? 'Limpiar' : 'Limpiar Datos'}
                        </button>
                    </div>
                )}
            </div>

            {showNutritionalInfo && (
                <NutritionalInfo
                    data={showNutritionalInfo}
                    onClose={() => setShowNutritionalInfo(false)}
                />
            )}
        </div>
    );
};

export default CustomMixDesigner;
