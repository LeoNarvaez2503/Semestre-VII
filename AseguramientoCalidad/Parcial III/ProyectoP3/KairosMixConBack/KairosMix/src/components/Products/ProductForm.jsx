import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import Swal from 'sweetalert2';
import './ProductForm.css';

const ProductForm = ({ product, onSave, onCancel, existingProducts = [] }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        pricePerPound: '',
        countryOfOrigin: '',
        wholesalePrice: '',
        retailPrice: '',
        initialStock: '',
        image: null,
        imagePreview: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                // Si el producto tiene imagen, usarla como preview
                imagePreview: product.image || ''
            });
        } else {
            // Auto-generate product code for new products
            const newCode = generateProductCode(formData.name, existingProducts);
            setFormData(prev => ({
                ...prev,
                code: newCode
            }));
        }
    }, [product, formData.name, existingProducts]);

    // Generate product code based on first letter + sequential number
    const generateProductCode = (productName, existingProducts) => {
        if (!productName.trim()) return '';
        
        const firstLetter = productName.trim().charAt(0).toUpperCase();
        const existingCodes = existingProducts
            .filter(p => p.code && p.code.startsWith(firstLetter))
            .map(p => p.code)
            .sort();
        
        // Find the next available number (01-20)
        for (let i = 1; i <= 20; i++) {
            const newCode = `${firstLetter}${i.toString().padStart(2, '0')}`;
            if (!existingCodes.includes(newCode)) {
                return newCode;
            }
        }
        
        // If all numbers 01-20 are used, return next available
        return `${firstLetter}21`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let newFormData = {
            ...formData,
            [name]: value
        };

        // Auto-generate code when name changes (only for new products)
        if (name === 'name' && !product) {
            newFormData.code = generateProductCode(value, existingProducts);
        }

        setFormData(newFormData);

        // Real-time validation
        const newErrors = { ...errors };

        // Clear error when user starts typing
        if (errors[name]) {
            delete newErrors[name];
        }

        // Validate price fields in real-time
        if (['pricePerPound', 'wholesalePrice', 'retailPrice'].includes(name)) {
            const priceRegex = /^\d{1,2}(\.\d{1,2})?$/;
            const numValue = parseFloat(value);
            
            if (value && (!priceRegex.test(value) || numValue < 0.01 || numValue > 99.99)) {
                newErrors[name] = 'El precio debe estar entre $0.01 y $99.99 con máximo 2 decimales';
            }
        }

        // Validate stock in real-time
        if (name === 'initialStock') {
            if (value && (!Number.isInteger(Number(value)) || Number(value) < 0)) {
                newErrors[name] = 'El stock debe ser un número entero positivo';
            }
        }

        setErrors(newErrors);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Por favor selecciona un archivo de imagen válido'
                }));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'La imagen no debe exceder 5MB'
                }));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: e.target.result
                }));
            };
            reader.readAsDataURL(file);

            // Clear image error
            if (errors.image) {
                setErrors(prev => ({
                    ...prev,
                    image: ''
                }));
            }
        }
    };

    const validateForm = async () => {
        const newErrors = {};
        const missingFields = [];
        const invalidFields = [];

        // Required field validation
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del producto es requerido';
            missingFields.push('Nombre del producto');
        }

        if (!formData.countryOfOrigin.trim()) {
            newErrors.countryOfOrigin = 'El país de origen es requerido';
            missingFields.push('País de origen');
        }

        // Price validation (0.01-99.99 with two decimals)
        const priceRegex = /^\d{1,2}(\.\d{1,2})?$/;
        
        if (!formData.pricePerPound) {
            newErrors.pricePerPound = 'El precio por libra es requerido';
            missingFields.push('Precio por libra');
        } else if (!priceRegex.test(formData.pricePerPound) || 
                   parseFloat(formData.pricePerPound) < 0.01 || 
                   parseFloat(formData.pricePerPound) > 99.99) {
            newErrors.pricePerPound = 'El precio debe estar entre $0.01 y $99.99 con máximo 2 decimales';
            invalidFields.push('Precio por libra (debe estar entre $0.01 y $99.99)');
        }

        if (!formData.wholesalePrice) {
            newErrors.wholesalePrice = 'El precio mayorista es requerido';
            missingFields.push('Precio mayorista');
        } else if (!priceRegex.test(formData.wholesalePrice) || 
                   parseFloat(formData.wholesalePrice) < 0.01 || 
                   parseFloat(formData.wholesalePrice) > 99.99) {
            newErrors.wholesalePrice = 'El precio debe estar entre $0.01 y $99.99 con máximo 2 decimales';
            invalidFields.push('Precio mayorista (debe estar entre $0.01 y $99.99)');
        }

        if (!formData.retailPrice) {
            newErrors.retailPrice = 'El precio minorista es requerido';
            missingFields.push('Precio minorista');
        } else if (!priceRegex.test(formData.retailPrice) || 
                   parseFloat(formData.retailPrice) < 0.01 || 
                   parseFloat(formData.retailPrice) > 99.99) {
            newErrors.retailPrice = 'El precio debe estar entre $0.01 y $99.99 con máximo 2 decimales';
            invalidFields.push('Precio minorista (debe estar entre $0.01 y $99.99)');
        }

        // Stock validation (positive integer)
        if (!formData.initialStock) {
            newErrors.initialStock = 'El stock inicial es requerido';
            missingFields.push('Stock inicial');
        } else if (!Number.isInteger(Number(formData.initialStock)) || 
                Number(formData.initialStock) < 0) {
            newErrors.initialStock = 'El stock debe ser un número entero positivo';
            invalidFields.push('Stock inicial (debe ser un número entero positivo)');
        }

        setErrors(newErrors);

        // Show SweetAlert2 messages for validation errors
        if (missingFields.length > 0 || invalidFields.length > 0) {
            let alertMessage = '';
            
            if (missingFields.length > 0) {
                alertMessage += '<strong>📋 Campos obligatorios faltantes:</strong><br>';
                alertMessage += '<ul style="text-align: left; margin: 10px 0;">';
                missingFields.forEach(field => {
                    alertMessage += `<li>• ${field}</li>`;
                });
                alertMessage += '</ul>';
            }

            if (invalidFields.length > 0) {
                if (missingFields.length > 0) alertMessage += '<br>';
                alertMessage += '<strong>⚠️ Campos con formato incorrecto:</strong><br>';
                alertMessage += '<ul style="text-align: left; margin: 10px 0;">';
                invalidFields.forEach(field => {
                    alertMessage += `<li>• ${field}</li>`;
                });
                alertMessage += '</ul>';
            }

            await Swal.fire({
                icon: 'error',
                title: '¡Oops! Hay errores en el formulario',
                html: alertMessage,
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#d33',
                background: '#fff',
                customClass: {
                    popup: 'animated pulse'
                }
            });

            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (await validateForm()) {
            const processedData = {
                ...formData,
                pricePerPound: parseFloat(formData.pricePerPound),
                wholesalePrice: parseFloat(formData.wholesalePrice),
                retailPrice: parseFloat(formData.retailPrice),
                initialStock: parseInt(formData.initialStock),
                // Usar imagePreview (base64) en lugar del objeto File
                image: formData.imagePreview || null
            };
            
            // Remover la propiedad imagePreview del objeto final
            delete processedData.imagePreview;
            
            // Success message
            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `Producto ${product ? 'actualizado' : 'registrado'} correctamente`,
                timer: 1500,
                showConfirmButton: false,
                confirmButtonColor: '#28a745'
            });
            
            onSave(processedData);
        }
    };

    return (
        <div className="form-overlay" data-testid="product-form-overlay">
        <div className="form-modal" data-testid="product-form">
            <div className="form-header">
            <h2>
                <Package size={24} />
                {product ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button 
                className="btn btn-outline-secondary rounded-circle"
                onClick={onCancel}
                type="button"
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <X size={20} />
            </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    {/* Código del Producto (auto-generado) */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="code" className="form-label">Código del Producto</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            className="form-control"
                            placeholder="Auto-generado"
                            readOnly
                            style={{ backgroundColor: '#f8f9fa' }}
                            data-testid="product-code-input"
                        />
                    </div>

                    {/* Nombre del Producto */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="name" className="form-label">Nombre del Producto *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            placeholder="Ej: Almendras Premium"
                            data-testid="product-name-input"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* País de Origen */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="countryOfOrigin" className="form-label">País de Origen *</label>
                        <input
                            type="text"
                            id="countryOfOrigin"
                            name="countryOfOrigin"
                            value={formData.countryOfOrigin}
                            onChange={handleChange}
                            className={`form-control ${errors.countryOfOrigin ? 'is-invalid' : ''}`}
                            placeholder="Ej: Chile, Argentina, Brasil"
                            data-testid="product-country-input"
                        />
                        {errors.countryOfOrigin && <div className="invalid-feedback">{errors.countryOfOrigin}</div>}
                    </div>

                    {/* Precio por Libra */}
                    <div className="mb-3 col-md-4">
                        <label htmlFor="pricePerPound" className="form-label">Precio por Libra *</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                id="pricePerPound"
                                name="pricePerPound"
                                value={formData.pricePerPound}
                                onChange={handleChange}
                                className={`form-control ${errors.pricePerPound ? 'is-invalid' : ''}`}
                                placeholder="0.00"
                                step="0.01"
                                min="0.01"
                                max="99.99"
                                data-testid="product-price-input"
                            />
                            <span className="input-group-text">/ lb</span>
                        </div>
                        {errors.pricePerPound && <div className="invalid-feedback">{errors.pricePerPound}</div>}
                    </div>

                    {/* Precio Mayorista por Libra */}
                    <div className="mb-3 col-md-4">
                        <label htmlFor="wholesalePrice" className="form-label">Precio Mayorista por Libra *</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                id="wholesalePrice"
                                name="wholesalePrice"
                                value={formData.wholesalePrice}
                                onChange={handleChange}
                                className={`form-control ${errors.wholesalePrice ? 'is-invalid' : ''}`}
                                placeholder="0.00"
                                step="0.01"
                                min="0.01"
                                max="99.99"
                                data-testid="product-wholesale-input"
                            />
                            <span className="input-group-text">/ lb</span>
                        </div>
                        {errors.wholesalePrice && <div className="invalid-feedback">{errors.wholesalePrice}</div>}
                    </div>

                    {/* Precio Minorista por Libra */}
                    <div className="mb-3 col-md-4">
                        <label htmlFor="retailPrice" className="form-label">Precio Minorista por Libra *</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                id="retailPrice"
                                name="retailPrice"
                                value={formData.retailPrice}
                                onChange={handleChange}
                                className={`form-control ${errors.retailPrice ? 'is-invalid' : ''}`}
                                placeholder="0.00"
                                step="0.01"
                                min="0.01"
                                max="99.99"
                                data-testid="product-retail-input"
                            />
                            <span className="input-group-text">/ lb</span>
                        </div>
                        {errors.retailPrice && <div className="invalid-feedback">{errors.retailPrice}</div>}
                    </div>

                    {/* Stock Inicial */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="initialStock" className="form-label">Stock Inicial *</label>
                        <div className="input-group">
                            <input
                                type="number"
                                id="initialStock"
                                name="initialStock"
                                value={formData.initialStock}
                                onChange={handleChange}
                                className={`form-control ${errors.initialStock ? 'is-invalid' : ''}`}
                                placeholder="0"
                                min="0"
                                step="1"
                                data-testid="product-stock-input"
                            />
                            <span className="input-group-text">libras</span>
                        </div>
                        {errors.initialStock && <div className="invalid-feedback">{errors.initialStock}</div>}
                    </div>

                    {/* Imagen Referencial */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="image" className="form-label">Imagen Referencial</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                            accept="image/*"
                            data-testid="product-image-input"
                        />
                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                        <small className="form-text text-muted">
                            Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
                        </small>
                    </div>

                    {/* Vista previa de la imagen */}
                    {formData.imagePreview && (
                        <div className="mb-3 col-12">
                            <label className="form-label">Vista Previa</label>
                            <div className="d-flex justify-content-center">
                                <img 
                                    src={formData.imagePreview} 
                                    alt="Vista previa" 
                                    style={{ 
                                        maxWidth: '200px', 
                                        maxHeight: '200px', 
                                        objectFit: 'cover',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn btn-danger"
                        onClick={onCancel}
                        data-testid="product-cancel-button"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-success d-flex align-items-center"
                        data-testid="product-save-button"
                    >
                        <Save size={18} className="me-2" />
                        {product ? 'Actualizar' : 'Guardar'} Producto
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default ProductForm;
