package com.kairosmix.infrastructure.rest.controller;

import com.kairosmix.quality.QualityScoreService;
import com.kairosmix.quality.QualityScoringEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para reportes de calidad del sistema
 */
@RestController
@RequestMapping("/v1/quality")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class QualityScoreController {
    private final QualityScoreService qualityScoreService;

    /**
     * Obtiene el puntaje de calidad actual del proyecto
     */
    @GetMapping("/score")
    public ResponseEntity<QualityScoringEngine.QualityScore> getQualityScore() {
        QualityScoringEngine.QualityScore score = qualityScoreService.calculateProjectQualityScore();
        return ResponseEntity.ok(score);
    }

    /**
     * Obtiene el reporte de calidad en formato texto
     */
    @GetMapping("/report")
    public ResponseEntity<String> getQualityReport() {
        String report = qualityScoreService.getQualityReport();
        return ResponseEntity.ok(report);
    }
}
