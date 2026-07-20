package com.kairosmix;

import com.kairosmix.quality.QualityScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Listener para eventos de inicialización de la aplicación
 * Muestra el QualityScore en la consola cuando la app está lista
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class ApplicationStartupListener {
    private final QualityScoreService qualityScoreService;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("╔════════════════════════════════════════════════════════════╗");
        log.info("║           KairosMix Backend Iniciado Exitosamente       ║");
        log.info("╚════════════════════════════════════════════════════════════╝");
        
        // Mostrar el reporte de calidad
        String report = qualityScoreService.getQualityReport();
        log.info("\n" + report);
        
        log.info("📊 Endpoints de Calidad Disponibles:");
        log.info("   - GET /api/v1/quality/score  → Puntaje en JSON");
        log.info("   - GET /api/v1/quality/report → Reporte detallado");
    }
}
