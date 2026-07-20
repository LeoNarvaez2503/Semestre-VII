package com.kairosmix.quality;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Quality Scoring Engine Tests")
class QualityScoringEngineTest {

    private QualityScoringEngine engine;
    private QualityMetrics metrics;

    @BeforeEach
    void setUp() {
        engine = new QualityScoringEngine();
        metrics = new QualityMetrics();
    }

    @Test
    @DisplayName("Should calculate quality score successfully")
    void testCalculateQualityScore() {
        metrics.setCodeCoverage(85.0);
        metrics.setValidationCoverage(100.0);
        metrics.setBugCount(0);
        metrics.setVulnerabilityCount(0);
        metrics.setCodeSmellCount(0);
        metrics.setAverageCyclomaticComplexity(3.0);

        QualityScoringEngine.QualityScore score = engine.calculateQualityScore(metrics);

        assertNotNull(score);
        assertTrue(score.getFinalScore() > 0);
        assertEquals("A", score.getGrade());
    }

    @Test
    @DisplayName("Should reduce score with bugs")
    void testScoreWithBugs() {
        metrics.setCodeCoverage(90.0);
        metrics.setValidationCoverage(100.0);
        metrics.setBugCount(5);
        metrics.setVulnerabilityCount(0);
        metrics.setCodeSmellCount(0);

        QualityScoringEngine.QualityScore score = engine.calculateQualityScore(metrics);

        assertTrue(score.getCorrectnessScore() < 100);
    }

    @Test
    @DisplayName("Should assign grade F for very low score")
    void testGradeF() {
        metrics.setCodeCoverage(20.0);
        metrics.setValidationCoverage(20.0);
        metrics.setBugCount(20);
        metrics.setVulnerabilityCount(10);
        metrics.setCodeSmellCount(50);

        QualityScoringEngine.QualityScore score = engine.calculateQualityScore(metrics);

        assertEquals("F", score.getGrade());
    }

    @Test
    @DisplayName("Should throw exception for null metrics")
    void testNullMetrics() {
        assertThrows(IllegalArgumentException.class, () -> {
            engine.calculateQualityScore(null);
        });
    }

    @Test
    @DisplayName("Should throw exception for invalid code coverage")
    void testInvalidCodeCoverage() {
        metrics.setCodeCoverage(150.0);
        assertThrows(IllegalArgumentException.class, () -> {
            engine.calculateQualityScore(metrics);
        });
    }

    @Test
    @DisplayName("Should return summary string")
    void testGetSummary() {
        metrics.setCodeCoverage(85.0);
        metrics.setValidationCoverage(100.0);
        metrics.setBugCount(1);

        QualityScoringEngine.QualityScore score = engine.calculateQualityScore(metrics);
        String summary = score.getSummary();

        assertNotNull(summary);
        assertTrue(summary.contains("Quality Report"));
        assertTrue(summary.contains("Code Coverage"));
    }

    @Test
    @DisplayName("Should bonus score for coverage above 85%")
    void testBonusForHighCoverage() {
        metrics.setCodeCoverage(95.0);
        metrics.setValidationCoverage(100.0);
        metrics.setBugCount(0);
        metrics.setVulnerabilityCount(0);
        metrics.setCodeSmellCount(0);

        QualityScoringEngine.QualityScore score = engine.calculateQualityScore(metrics);

        assertTrue(score.getTestabilityScore() > 95);
    }
}
