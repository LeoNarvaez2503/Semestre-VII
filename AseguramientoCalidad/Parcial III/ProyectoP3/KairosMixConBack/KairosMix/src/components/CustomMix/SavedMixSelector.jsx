import React, { useState } from 'react';
import { 
    BookOpen, 
    Trash2, 
    Eye, 
    Calendar, 
    Package,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Star
} from 'lucide-react';
import Swal from 'sweetalert2';
import { createSwalDialog } from '../../utils/sweetAlertConfig';
import { api } from '../../utils/api';
import './SavedMixSelector.css';

const SavedMixSelector = ({ savedMixes, onLoadMix }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedMixForPreview, setSelectedMixForPreview] = useState(null);

    const handleDeleteMix = async (mixId, mixName) => {
        try {
            const result = await Swal.fire(createSwalDialog('deleteDialog', {
                title: '¿Eliminar mezcla guardada?',
                text: `¿Estás seguro de eliminar "${mixName}"? Esta acción no se puede deshacer.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }));

            if (result.isConfirmed) {
                await api.deleteCustomMix(mixId);

                await Swal.fire({
                    icon: 'success',
                    title: 'Mezcla eliminada',
                    text: `"${mixName}" ha sido eliminada correctamente`,
                    timer: 1500,
                    showConfirmButton: false
                });

                window.location.reload();
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error del sistema',
                text: 'No se pudo eliminar la mezcla. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Reintentar'
            });
        }
    };

    const handleLoadMix = async (mix) => {
        try {
            const result = await Swal.fire(createSwalDialog('confirmDialog', {
                title: 'Cargar mezcla guardada',
                text: `¿Deseas cargar la mezcla "${mix.name}"?.`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cargar',
                cancelButtonText: 'Cancelar'
            }));

            if (result.isConfirmed) {
                onLoadMix(mix);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Mezcla cargada',
                    text: `"${mix.name}" ha sido cargada correctamente`,
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error del sistema',
                text: 'No se pudo cargar la mezcla. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Reintentar'
            });
        }
    };

    const showMixPreview = (mix) => {
        setSelectedMixForPreview(mix);
    };

    const closeMixPreview = () => {
        setSelectedMixForPreview(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (savedMixes.length === 0) {
        return (
            <div className="saved-mix-selector empty">
                <div className="empty-state">
                    <BookOpen size={32} className="text-muted" />
                    <p>No hay mezclas guardadas</p>
                    <small>Las mezclas que guardes aparecerán aquí</small>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-mix-selector">
            <div className="selector-header">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="btn btn-outline-primary btn-sm expand-button"
                >
                    <BookOpen size={18} className="me-2" />
                    Mezclas Guardadas ({savedMixes.length})
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {isExpanded && (
                <div className="saved-mixes-list">
                    {savedMixes.map((mix) => (
                        <div key={mix.id} className="saved-mix-item">
                            <div className="mix-info">
                                <div className="mix-header">
                                    <h5 className="mix-name">
                                        <Star size={16} className="me-1" />
                                        {mix.name}
                                    </h5>
                                    <span className="mix-date">
                                        <Calendar size={14} className="me-1" />
                                        {formatDate(mix.createdAt)}
                                    </span>
                                </div>
                                
                                <div className="mix-summary">
                                    <div className="mix-stats">
                                        <span className="stat">
                                            <Package size={14} className="me-1" />
                                            {mix.components.length} productos
                                        </span>
                                        <span className="stat">
                                            <DollarSign size={14} className="me-1" />
                                            ${mix.totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="mix-components-preview">
                                        {mix.components.slice(0, 2).map((component, index) => (
                                            <span key={index} className="component-preview">
                                                {component.productName}
                                            </span>
                                        ))}
                                        {mix.components.length > 2 && (
                                            <span className="more-components">
                                                +{mix.components.length - 2} más
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mix-actions">
                                <button
                                    onClick={() => showMixPreview(mix)}
                                    className="btn btn-outline-info btn-sm"
                                    title="Ver detalles"
                                >
                                    <Eye size={14} />
                                </button>
                                <button
                                    onClick={() => handleLoadMix(mix)}
                                    className="btn btn-outline-success btn-sm"
                                    title="Cargar mezcla"
                                >
                                    Cargar
                                </button>
                                <button
                                    onClick={() => handleDeleteMix(mix.id, mix.name)}
                                    className="btn btn-outline-danger btn-sm"
                                    title="Eliminar mezcla"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mix Preview Modal */}
            {selectedMixForPreview && (
                <div className="mix-preview-overlay">
                    <div className="mix-preview-modal">
                        <div className="modal-header">
                            <h4>
                                <Star size={20} className="me-2" />
                                {selectedMixForPreview.name}
                            </h4>
                            <button onClick={closeMixPreview} className="btn-close">
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="mix-details">
                                <div className="detail-item">
                                    <strong>Fecha de creación:</strong>
                                    <span>{formatDate(selectedMixForPreview.createdAt)}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Precio total:</strong>
                                    <span>${selectedMixForPreview.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Número de productos:</strong>
                                    <span>{selectedMixForPreview.components.length}</span>
                                </div>
                            </div>

                            <div className="mix-components-detail">
                                <h5>Componentes:</h5>
                                {selectedMixForPreview.components.map((component, index) => (
                                    <div key={index} className="component-detail-item">
                                        <div className="component-name">{component.productName}</div>
                                        <div className="component-details">
                                            <span className="quantity">{component.quantity} lb</span>
                                            <span className="price">${component.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedMixForPreview.nutrition && (
                                <div className="mix-nutrition-summary">
                                    <h5>Resumen Nutricional:</h5>
                                    <div className="nutrition-grid">
                                        <div className="nutrition-item">
                                            <span className="label">Calorías:</span>
                                            <span className="value">{selectedMixForPreview.nutrition.calories.toFixed(0)} kcal</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span className="label">Proteínas:</span>
                                            <span className="value">{selectedMixForPreview.nutrition.protein.toFixed(1)}g</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span className="label">Grasas:</span>
                                            <span className="value">{selectedMixForPreview.nutrition.fat.toFixed(1)}g</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span className="label">Carbohidratos:</span>
                                            <span className="value">{selectedMixForPreview.nutrition.carbs.toFixed(1)}g</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => {
                                    closeMixPreview();
                                    handleLoadMix(selectedMixForPreview);
                                }}
                                className="btn btn-success"
                            >
                                Cargar Mezcla
                            </button>
                            <button onClick={closeMixPreview} className="btn btn-cancel">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedMixSelector;
