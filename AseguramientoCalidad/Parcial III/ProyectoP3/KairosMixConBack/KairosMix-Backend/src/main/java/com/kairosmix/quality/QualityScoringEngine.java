package com.kairosmix.quality;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.stereotype.Component;

/**
 * Motor de Calidad para KairosMix
 * Calcula un puntaje de calidad basado en métricas de:
 * - Correctitud (Correctness): Peso 0.3
 * - Testabilidad (Testability): Peso 0.3
 * - Mantenibilidad (Maintainability): Peso 0.2
 * - Integridad (Integrity): Peso 0.2
 */
@Component
public class QualityScoringEngine {
    
    private static final double CORRECTNESS_WEIGHT = 0.3;
    private static final double TESTABILITY_WEIGHT = 0.3;
    private static final double MAINTAINABILITY_WEIGHT = 0.2;
    private static final double INTEGRITY_WEIGHT = 0.2;
    
    private static final double PERFECT_SCORE = 100.0;

    /**
     * Calcula el puntaje de calidad final
     * 
     * @param metrics Métricas de calidad recolectadas
     * @return QualityScore con el puntaje final y detalles
     */
    public QualityScore calculateQualityScore(QualityMetrics metrics) {
        validateMetrics(metrics);
        
        // Calcular cada dimensión
        double correctnessScore = calculateCorrectnessScore(metrics);
        double testabilityScore = calculateTestabilityScore(metrics);
        double maintainabilityScore = calculateMaintainabilityScore(metrics);
        double integrityScore = calculateIntegrityScore(metrics);
        
        // Calcular puntaje ponderado final
        double finalScore = 
            (correctnessScore * CORRECTNESS_WEIGHT) +
            (testabilityScore * TESTABILITY_WEIGHT) +
            (maintainabilityScore * MAINTAINABILITY_WEIGHT) +
            (integrityScore * INTEGRITY_WEIGHT);
        
        return QualityScore.builder()
            .finalScore(Math.round(finalScore * 100.0) / 100.0)
            .correctnessScore(Math.round(correctnessScore * 100.0) / 100.0)
            .testabilityScore(Math.round(testabilityScore * 100.0) / 100.0)
            .maintainabilityScore(Math.round(maintainabilityScore * 100.0) / 100.0)
            .integrityScore(Math.round(integrityScore * 100.0) / 100.0)
            .grade(calculateGrade(finalScore))
            .metrics(metrics)
            .build();
    }

    /**
     * Calcula la puntuación de Correctitud
     * Basada en: bugs encontrados y vulnerabilidades de seguridad
     */
    private double calculateCorrectnessScore(QualityMetrics metrics) {
        double baseScore = PERFECT_SCORE;
        
        // Penalizar por bugs (máximo -30 puntos)
        double bugPenalty = Math.min(30.0, metrics.getBugCount() * 5);
        baseScore -= bugPenalty;
        
        // Penalizar por vulnerabilidades de seguridad (máximo -30 puntos)
        double vulnPenalty = Math.min(30.0, metrics.getVulnerabilityCount() * 10);
        baseScore -= vulnPenalty;
        
        // Penalizar por fallos en pruebas (máximo -20 puntos)
        double failedTestsPenalty = Math.min(20.0, metrics.getFailedTestCount() * 2);
        baseScore -= failedTestsPenalty;
        
        return Math.max(0, baseScore);
    }

    /**
     * Calcula la puntuación de Testabilidad
     * Basada en: cobertura de código
     */
    private double calculateTestabilityScore(QualityMetrics metrics) {
        // La cobertura de código es el factor principal
        // Se requiere mínimo 85% de cobertura según la guía
        double coverage = Math.min(metrics.getCodeCoverage(), PERFECT_SCORE);
        
        // Bonificación si supera el 85%
        double bonus = 0;
        if (coverage >= 85) {
            bonus = Math.min(10, (coverage - 85) * 2);
        }
        
        return Math.min(PERFECT_SCORE, coverage + bonus);
    }

    /**
     * Calcula la puntuación de Mantenibilidad
     * Basada en: code smells y complejidad
     */
    private double calculateMaintainabilityScore(QualityMetrics metrics) {
        double baseScore = PERFECT_SCORE;
        
        // Penalizar por code smells (máximo -40 puntos)
        double smellPenalty = Math.min(40.0, metrics.getCodeSmellCount() * 2);
        baseScore -= smellPenalty;
        
        // Penalizar por complejidad ciclomática alta (máximo -20 puntos)
        double complexityPenalty = calculateComplexityPenalty(metrics.getAverageCyclomaticComplexity());
        baseScore -= complexityPenalty;
        
        // Penalizar por duplicación de código (máximo -20 puntos)
        double duplicationPenalty = Math.min(20.0, metrics.getDuplicatedLinePercentage() * 0.5);
        baseScore -= duplicationPenalty;
        
        return Math.max(0, baseScore);
    }

    /**
     * Calcula la penalización por complejidad ciclomática
     */
    private double calculateComplexityPenalty(double avgComplexity) {
        if (avgComplexity <= 5) return 0;
        if (avgComplexity <= 10) return 5;
        if (avgComplexity <= 15) return 10;
        return Math.min(20.0, (avgComplexity - 15) * 1.0);
    }

    /**
     * Calcula la puntuación de Integridad
     * Basada en: validaciones y datos anómalos
     */
    private double calculateIntegrityScore(QualityMetrics metrics) {
        double baseScore = PERFECT_SCORE;
        
        // Penalizar por validaciones insuficientes (máximo -25 puntos)
        double validationPenalty = Math.min(25.0, (100 - metrics.getValidationCoverage()) * 0.25);
        baseScore -= validationPenalty;
        
        // Penalizar por inconsistencias de datos (máximo -25 puntos)
        double inconsistencyPenalty = Math.min(25.0, metrics.getDataInconsistencyCount() * 5);
        baseScore -= inconsistencyPenalty;
        
        // Penalizar por fallos de transacción (máximo -25 puntos)
        double transactionPenalty = Math.min(25.0, metrics.getTransactionFailureCount() * 2);
        baseScore -= transactionPenalty;
        
        return Math.max(0, baseScore);
    }

    /**
     * Calcula el grado de calidad basado en el puntaje final
     */
    private String calculateGrade(double finalScore) {
        if (finalScore >= 90) return "A";
        if (finalScore >= 80) return "B";
        if (finalScore >= 70) return "C";
        if (finalScore >= 60) return "D";
        return "F";
    }

    /**
     * Valida que las métricas sean válidas
     */
    private void validateMetrics(QualityMetrics metrics) {
        if (metrics == null) {
            throw new IllegalArgumentException("Las métricas no pueden ser nulas");
        }
        if (metrics.getCodeCoverage() < 0 || metrics.getCodeCoverage() > 100) {
            throw new IllegalArgumentException("La cobertura de código debe estar entre 0 y 100");
        }
        if (metrics.getValidationCoverage() < 0 || metrics.getValidationCoverage() > 100) {
            throw new IllegalArgumentException("La cobertura de validación debe estar entre 0 y 100");
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class QualityScore {
        private double finalScore;
        private double correctnessScore;
        private double testabilityScore;
        private double maintainabilityScore;
        private double integrityScore;
        private String grade;
        private QualityMetrics metrics;

        public String getSummary() {
            return String.format(
                "KairosMix Quality Report\n" +
                "========================\n" +
                "Overall Score: %.2f (%s)\n" +
                "Correctness (30%%): %.2f\n" +
                "Testability (30%%): %.2f\n" +
                "Maintainability (20%%): %.2f\n" +
                "Integrity (20%%): %.2f\n" +
                "Code Coverage: %.2f%%\n" +
                "Bugs: %d | Vulnerabilities: %d | Code Smells: %d",
                finalScore, grade,
                correctnessScore,
                testabilityScore,
                maintainabilityScore,
                integrityScore,
                metrics.getCodeCoverage(),
                metrics.getBugCount(),
                metrics.getVulnerabilityCount(),
                metrics.getCodeSmellCount()
            );
        }
    }
}
