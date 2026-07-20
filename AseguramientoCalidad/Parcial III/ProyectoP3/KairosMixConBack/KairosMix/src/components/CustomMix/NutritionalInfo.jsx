import React from 'react';
import { X, Heart, Zap, Wheat, Apple } from 'lucide-react';
import './NutritionalInfo.css';

const NutritionalInfo = ({ data, onClose }) => {
    const { nutrition, product, components, isMix, mixName } = data;

    const formatNutrientValue = (value, unit = 'g') => {
        if (typeof value === 'number') {
            return `${value.toFixed(1)}${unit}`;
        }
        return '0.0g';
    };

    const getNutrientColor = (type) => {
        const colors = {
            calories: '#ff6b6b',
            protein: '#4ecdc4',
            fat: '#ffe66d',
            carbs: '#a8e6cf',
            fiber: '#dda0dd'
        };
        return colors[type] || '#6c757d';
    };

    const calculatePercentages = () => {
        const total = nutrition.protein + nutrition.fat + nutrition.carbs;
        return {
            protein: total > 0 ? (nutrition.protein / total) * 100 : 0,
            fat: total > 0 ? (nutrition.fat / total) * 100 : 0,
            carbs: total > 0 ? (nutrition.carbs / total) * 100 : 0
        };
    };

    const percentages = calculatePercentages();

    return (
        <div className="nutritional-info-overlay">
            <div className="nutritional-info-modal">
                <div className="modal-header">
                    <h3>
                        <Heart size={24} className="me-2" />
                        Información Nutricional
                    </h3>
                    <button onClick={onClose} className="btn-close">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="product-title">
                        {isMix ? (
                            <h4>{mixName || 'Mezcla Personalizada'}</h4>
                        ) : (
                            <h4>{product?.name}</h4>
                        )}
                        <p className="serving-info">
                            {isMix 
                                ? `Información para toda la mezcla (${components.reduce((sum, c) => sum + c.quantity, 0).toFixed(1)} lb total)`
                                : 'Información por cada 100g'
                            }
                        </p>
                    </div>

                    {/* Main Nutrients */}
                    <div className="nutrients-grid">
                        <div className="nutrient-card calories">
                            <div className="nutrient-icon">
                                <Zap size={24} />
                            </div>
                            <div className="nutrient-info">
                                <span className="nutrient-value">{formatNutrientValue(nutrition.calories, ' kcal')}</span>
                                <span className="nutrient-name">Calorías</span>
                            </div>
                        </div>

                        <div className="nutrient-card protein">
                            <div className="nutrient-icon">
                                <Apple size={24} />
                            </div>
                            <div className="nutrient-info">
                                <span className="nutrient-value">{formatNutrientValue(nutrition.protein)}</span>
                                <span className="nutrient-name">Proteínas</span>
                            </div>
                        </div>

                        <div className="nutrient-card fat">
                            <div className="nutrient-icon">
                                <span className="fat-icon">🥑</span>
                            </div>
                            <div className="nutrient-info">
                                <span className="nutrient-value">{formatNutrientValue(nutrition.fat)}</span>
                                <span className="nutrient-name">Grasas</span>
                            </div>
                        </div>

                        <div className="nutrient-card carbs">
                            <div className="nutrient-icon">
                                <Wheat size={24} />
                            </div>
                            <div className="nutrient-info">
                                <span className="nutrient-value">{formatNutrientValue(nutrition.carbs)}</span>
                                <span className="nutrient-name">Carbohidratos</span>
                            </div>
                        </div>

                        <div className="nutrient-card fiber">
                            <div className="nutrient-icon">
                                <span className="fiber-icon">🌾</span>
                            </div>
                            <div className="nutrient-info">
                                <span className="nutrient-value">{formatNutrientValue(nutrition.fiber)}</span>
                                <span className="nutrient-name">Fibra</span>
                            </div>
                        </div>
                    </div>

                    {/* Macronutrient Distribution */}
                    <div className="macro-distribution">
                        <h5>Distribución de Macronutrientes</h5>
                        <div className="macro-chart">
                            <div className="macro-bars">
                                <div className="macro-bar">
                                    <div 
                                        className="macro-fill protein-fill"
                                        style={{ width: `${percentages.protein}%` }}
                                    ></div>
                                    <span className="macro-label">Proteínas {percentages.protein.toFixed(1)}%</span>
                                </div>
                                <div className="macro-bar">
                                    <div 
                                        className="macro-fill fat-fill"
                                        style={{ width: `${percentages.fat}%` }}
                                    ></div>
                                    <span className="macro-label">Grasas {percentages.fat.toFixed(1)}%</span>
                                </div>
                                <div className="macro-bar">
                                    <div 
                                        className="macro-fill carbs-fill"
                                        style={{ width: `${percentages.carbs}%` }}
                                    ></div>
                                    <span className="macro-label">Carbohidratos {percentages.carbs.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vitamins and Minerals */}
                    <div className="vitamins-minerals">
                        <div className="vitamins-section">
                            <h5>🍊 Vitaminas</h5>
                            <div className="nutrients-list">
                                {nutrition.vitamins && nutrition.vitamins.length > 0 ? (
                                    nutrition.vitamins.map((vitamin, index) => (
                                        <span key={index} className="nutrient-tag vitamin-tag">
                                            {vitamin}
                                        </span>
                                    ))
                                ) : (
                                    <span className="no-data">No hay información disponible</span>
                                )}
                            </div>
                        </div>

                        <div className="minerals-section">
                            <h5>⚡ Minerales</h5>
                            <div className="nutrients-list">
                                {nutrition.minerals && nutrition.minerals.length > 0 ? (
                                    nutrition.minerals.map((mineral, index) => (
                                        <span key={index} className="nutrient-tag mineral-tag">
                                            {mineral}
                                        </span>
                                    ))
                                ) : (
                                    <span className="no-data">No hay información disponible</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mix Components Details */}
                    {isMix && components && (
                        <div className="mix-components-nutrition">
                            <h5>Componentes de la Mezcla</h5>
                            <div className="components-nutrition-list">
                                {components.map((component, index) => (
                                    <div key={index} className="component-nutrition-item">
                                        <div className="component-header">
                                            <span className="component-name">{component.productName}</span>
                                            <span className="component-weight">{component.quantity} lb</span>
                                        </div>
                                        <div className="component-contribution">
                                            <small>
                                                Contribución: ~{((component.quantity / components.reduce((sum, c) => sum + c.quantity, 0)) * 100).toFixed(1)}% del total
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Health Benefits */}
                    <div className="health-benefits">
                        <h5>💪 Beneficios Nutricionales</h5>
                        <div className="benefits-grid">
                            {nutrition.protein > 15 && (
                                <div className="benefit-item">
                                    <span className="benefit-icon">🏋️</span>
                                    <span className="benefit-text">Alto en proteínas</span>
                                </div>
                            )}
                            {nutrition.fiber > 5 && (
                                <div className="benefit-item">
                                    <span className="benefit-icon">🌿</span>
                                    <span className="benefit-text">Rica en fibra</span>
                                </div>
                            )}
                            {nutrition.vitamins && nutrition.vitamins.includes('E') && (
                                <div className="benefit-item">
                                    <span className="benefit-icon">🛡️</span>
                                    <span className="benefit-text">Antioxidantes naturales</span>
                                </div>
                            )}
                            {nutrition.minerals && nutrition.minerals.includes('Magnesio') && (
                                <div className="benefit-item">
                                    <span className="benefit-icon">❤️</span>
                                    <span className="benefit-text">Beneficioso para el corazón</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="additional-info">
                        <div className="info-disclaimer">
                            <small>
                                <strong>Nota:</strong> Los valores nutricionales son aproximados y pueden variar 
                                según el origen y procesamiento de los productos. Para dietas especiales, 
                                consulta con un profesional de la salud.
                            </small>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="btn btn-cancel">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NutritionalInfo;
