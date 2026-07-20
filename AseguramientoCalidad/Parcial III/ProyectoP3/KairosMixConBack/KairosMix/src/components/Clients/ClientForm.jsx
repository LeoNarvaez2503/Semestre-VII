import React, { useState, useEffect } from 'react';
import { X, Save, Users, CreditCard, Mail, Phone, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import './ClientForm.css';

const ClientForm = ({ client, onSave, onCancel, existingClients = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        idNumber: '',
        idType: '',
        email: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (client) {
            setFormData(client);
        }
    }, [client]);

    const validateIdNumber = (idNumber, idType) => {
        const cleanId = idNumber.replace(/\s/g, '').toUpperCase();
        
        switch(idType) {
            case 'cedula':
                return /^\d{10}$/.test(cleanId);
            case 'ruc':
                return /^\d{13}$/.test(cleanId);
            case 'pasaporte':
                return /^[A-Z0-9]{6,9}$/.test(cleanId);
            default:
                return false;
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const cleanPhone = phone.replace(/\s|-/g, '');
        return /^(09\d{8}|0[2-7]\d{6})$/.test(cleanPhone);
    };

    const isIdNumberUnique = (idNumber) => {
        const cleanId = idNumber.replace(/\s/g, '').toUpperCase();
        return !existingClients.some(c => 
            c.id !== client?.id && 
            c.idNumber.replace(/\s/g, '').toUpperCase() === cleanId
        );
    };

    const getIdTypeLabel = (idType) => {
        switch(idType) {
            case 'cedula': return 'Cédula (minimo 10 dígitos';
            case 'ruc': return 'RUC (13 dígitos)';
            case 'pasaporte': return 'Pasaporte (6-9 caracteres)';
            default: return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const newErrors = { ...errors };

        if (errors[name]) {
            delete newErrors[name];
        }

        if (name === 'idNumber' && formData.idType && value.trim()) {
            if (!validateIdNumber(value, formData.idType)) {
                newErrors[name] = `El formato de ${getIdTypeLabel(formData.idType)} no es válido`;
            } else if (!isIdNumberUnique(value)) {
                newErrors[name] = 'Este número de identificación ya está registrado';
            }
        }

        if (name === 'email' && value.trim()) {
            if (!validateEmail(value)) {
                newErrors[name] = 'El formato del correo electrónico no es válido';
            }
        }

        if (name === 'phone' && value.trim()) {
            if (!validatePhone(value)) {
                newErrors[name] = 'El formato del teléfono no es válido (ej: 0987654321)';
            }
        }

        setErrors(newErrors);
    };

    const validateForm = async () => {
        const newErrors = {};
        const missingFields = [];
        const invalidFields = [];

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del cliente es requerido';
            missingFields.push('Nombre del cliente');
        }

        if (!formData.idNumber.trim()) {
            newErrors.idNumber = 'El número de identificación es requerido';
            missingFields.push('Número de identificación');
        } else {
            if (!formData.idType) {
                newErrors.idType = 'Debe seleccionar el tipo de identificación';
                missingFields.push('Tipo de identificación');
            } else if (!validateIdNumber(formData.idNumber, formData.idType)) {
                newErrors.idNumber = `El formato de ${getIdTypeLabel(formData.idType)} no es válido`;
                invalidFields.push(`Número de identificación (${getIdTypeLabel(formData.idType)})`);
            } else if (!isIdNumberUnique(formData.idNumber)) {
                newErrors.idNumber = 'Este número de identificación ya está registrado';
                invalidFields.push('Número de identificación (ya existe)');
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es requerido';
            missingFields.push('Correo electrónico');
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'El formato del correo electrónico no es válido';
            invalidFields.push('Correo electrónico (formato inválido)');
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El número de teléfono es requerido';
            missingFields.push('Número de teléfono');
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'El formato del teléfono no es válido';
            invalidFields.push('Número de teléfono (formato inválido)');
        }

        if (!formData.address.trim()) {
            newErrors.address = 'La dirección es requerida';
            missingFields.push('Dirección');
        }

        setErrors(newErrors);

        if (missingFields.length > 0 || invalidFields.length > 0) {
            let alertMessage = '';
            
            if (missingFields.length > 0) {
                alertMessage += '<strong>Campos obligatorios faltantes:</strong><br>';
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
                name: formData.name.trim(),
                idNumber: formData.idNumber.replace(/\s/g, '').toUpperCase(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.replace(/\s|-/g, ''),
                address: formData.address.trim()
            };
            
            // Success message
            await Swal.fire({
                icon: 'success',
                title: '¡Exito!',
                text: `Cliente ${client ? 'actualizado' : 'registrado'} correctamente`,
                timer: 1500,
                showConfirmButton: false,
                confirmButtonColor: '#28a745'
            });
            
            onSave(processedData);
        }
    };

    const formatIdPlaceholder = (idType) => {
        switch(idType) {
            case 'cedula': return 'Ej: 1234567890';
            case 'ruc': return 'Ej: 1234567890001';
            case 'pasaporte': return 'Ej: AB123456';
            default: return 'Seleccione tipo primero';
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-modal">
                <div className="form-header">
                    <h2>
                        <Users size={24} />
                        {client ? 'Editar Cliente' : 'Nuevo Cliente'}
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

                <form onSubmit={handleSubmit} className="client-form">
                    <div className="form-grid">
                        {/* Nombre del Cliente */}
                        <div className="mb-3 col-md-6">
                            <label htmlFor="name" className="form-label">
                                <Users size={16} className="me-2" />
                                Nombre del Cliente *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                placeholder="Ej: María González"
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        {/* Tipo de Identificación */}
                        <div className="mb-3 col-md-6">
                            <label htmlFor="idType" className="form-label">
                                <CreditCard size={16} className="me-2" />
                                Tipo de Identificación *
                            </label>
                            <select
                                id="idType"
                                name="idType"
                                value={formData.idType}
                                onChange={handleChange}
                                className={`form-select ${errors.idType ? 'is-invalid' : ''}`}
                            >
                                <option value="">Seleccionar tipo</option>
                                <option value="cedula">Cédula (10 dígitos)</option>
                                <option value="ruc">RUC (13 dígitos)</option>
                                <option value="pasaporte">Pasaporte (6-9 caracteres)</option>
                            </select>
                            {errors.idType && <div className="invalid-feedback">{errors.idType}</div>}
                        </div>

                        {/* Número de Identificación */}
                        <div className="mb-3 col-md-6">
                            <label htmlFor="idNumber" className="form-label">
                                Número de Identificación *
                            </label>
                            <input
                                type="text"
                                id="idNumber"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                className={`form-control ${errors.idNumber ? 'is-invalid' : ''}`}
                                placeholder={formatIdPlaceholder(formData.idType)}
                                disabled={!formData.idType}
                            />
                            {errors.idNumber && <div className="invalid-feedback">{errors.idNumber}</div>}
                            {formData.idType && (
                                <small className="form-text text-muted">
                                    Formato: {getIdTypeLabel(formData.idType)}
                                </small>
                            )}
                        </div>

                        {/* Correo Electrónico */}
                        <div className="mb-3 col-md-6">
                            <label htmlFor="email" className="form-label">
                                <Mail size={16} className="me-2" />
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="Ej: cliente@email.com"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {/* Número de Teléfono */}
                        <div className="mb-3 col-md-6">
                            <label htmlFor="phone" className="form-label">
                                <Phone size={16} className="me-2" />
                                Número de Teléfono *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                placeholder="Ej: 0987654321"
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            <small className="form-text text-muted">
                                Formato: 0987654321 (móvil) o 022345678 (fijo)
                            </small>
                        </div>

                        {/* Dirección */}
                        <div className="mb-3 col-md-6">
                            <label htmlFor="address" className="form-label">
                                <MapPin size={16} className="me-2" />
                                Dirección *
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                placeholder="Ej: Av. Principal 123, Quito, Ecuador"
                                rows="3"
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-danger"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-success d-flex align-items-center"
                        >
                            <Save size={18} className="me-2" />
                            {client ? 'Actualizar' : 'Guardar'} Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientForm;
