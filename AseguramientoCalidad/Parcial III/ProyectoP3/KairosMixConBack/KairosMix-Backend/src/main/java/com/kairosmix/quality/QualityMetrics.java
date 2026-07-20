package com.kairosmix.quality;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Métricas de Calidad del Sistema
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class QualityMetrics {
    
    // Métricas de Correctitud
    private int bugCount;
    private int vulnerabilityCount;
    private int failedTestCount;
    
    // Métricas de Testabilidad
    private double codeCoverage; // porcentaje 0-100
    
    // Métricas de Mantenibilidad
    private int codeSmellCount;
    private double averageCyclomaticComplexity;
    private double duplicatedLinePercentage;
    
    // Métricas de Integridad
    private double validationCoverage; // porcentaje 0-100
    private int dataInconsistencyCount;
    private int transactionFailureCount;
    
    // Metadatos
    private LocalDateTime collectedAt;
    private String projectVersion;
    
    public QualityMetrics() {
        this.bugCount = 0;
        this.vulnerabilityCount = 0;
        this.failedTestCount = 0;
        this.codeCoverage = 0.0;
        this.codeSmellCount = 0;
        this.averageCyclomaticComplexity = 0.0;
        this.duplicatedLinePercentage = 0.0;
        this.validationCoverage = 100.0;
        this.dataInconsistencyCount = 0;
        this.transactionFailureCount = 0;
        this.collectedAt = LocalDateTime.now();
    }
}
