# 📋 Backlog de Proyecto en Jira - SQA KairosMix (KAIROS-QA)

**Proyecto:** SQA & Audit - System Under Test (KairosMix)  
**Clave de Proyecto:** `SCRUM` / `Asegu-G6`  
**Metodología:** Scrum / SQA Sprints (3 Sprints de 1 Semana)  
**Consultora:** External Quality Engineering Consulting  

---

## 🏆 Épicas Definidas con Descripción

### `EPIC-1`: Planificación y Auditoría Estática (SQAP Initial)
- **Descripción:** Auditoría inicial de software legacy KairosMix (Backend Spring Boot + Frontend React 19). Incluye análisis estático de código (ESLint, JaCoCo, Checkstyle), mapa de arquitectura, definición de alcance, stack tecnológico y gestión de riesgos según SQAP Sección A.
- **Sprint:** Sprint 1 | **Estado:** Finalizado

### `EPIC-2`: Pruebas Dinámicas - Bug Fixing y Refactorización
- **Descripción:** Diseño e implementación de pruebas unitarias (JUnit 5, Mockito, Vitest) y pruebas End-to-End BDD con Cypress y Cucumber. Gestión del ciclo de vida de defectos (Bug Tracking), corrección de vulnerabilidades y refactorización de naming conventions.
- **Sprint:** Sprint 2 | **Estado:** En curso

### `EPIC-3`: Informe de Cierre - Métricas y Entrega Final
- **Descripción:** Consolidación del informe final de cierre (Test Summary Report), medición de métricas cuantitativas (% Pass Rate, Densidad de Defectos, Cobertura JaCoCo), estructuración del repositorio AreadePruebas, compilación a PDF y guión del video de demostración.
- **Sprint:** Sprint 3 | **Estado:** Por hacer

---

## 📑 Tabla Detallada del Backlog con Descripciones Completas

| Clave | Tipo | Resumen / Título | Descripción Detallada | Prioridad | Puntos | Sprint | Estado |
|---|---|---|---|---|---|---|---|
| `KAIROS-1` | Story | Recuperar y desplegar SUT en entorno local de pruebas | Desplegar KairosMix en entorno local (Backend :8080 con H2/MySQL, Frontend :5173). Criterios: Compilación sin errores, APIs operativas. | High | 3 | Sprint 1 | Finalizado |
| `KAIROS-2` | Task | Ejecutar análisis estático inicial (ESLint + JaCoCo) | Análisis estático baseline sin modificar código para medir deuda técnica inicial en React y Java. | High | 5 | Sprint 1 | Finalizado |
| `KAIROS-3` | Story | Redactar Plan SQAP Sección A | Documentar alcance (módulos incluidos/excluidos), estrategia de pruebas, criterios Entry/Exit y matriz de riesgos (RSK-01 a RSK-04). | Highest | 8 | Sprint 1 | Finalizado |
| `KAIROS-4` | Task | Elaborar Matriz de Rastreabilidad | Mapear Requisitos Funcionales (RF-01 a RF-08) contra Casos de Prueba (Unitarios, Integración, Cypress E2E) en `MATRIZ_TRAZABILIDAD.md`. | Medium | 5 | Sprint 2 | En curso |
| `KAIROS-5` | Test | Ejecutar Pruebas Unitarias backend y cobertura | Ejecutar 167 tests unitarios/integración (JUnit 5 + Mockito). Generar reporte JaCoCo verificando cobertura > 80%. | High | 5 | Sprint 2 | En curso |
| `KAIROS-6` | Test | Ejecutar Suite End-to-End y BDD con Cypress | Automatización E2E en navegador con Cypress + Cucumber en sintaxis Gherkin (Dado-Cuando-Entonces) para Clientes, Productos y Mezclas. | Highest | 8 | Sprint 2 | En curso |
| `KAIROS-7` | Bug | Corregir vulnerabilidades, nulos y excepciones | Corregir NullPointerException en OrderMapper, inconsistencias DTO y warnings en React. Aplicar validaciones `@Valid` y `@NotNull`. | High | 5 | Sprint 2 | En curso |
| `KAIROS-8` | Task | Refactorizar código y estandarizar Naming Conventions | Limpieza de clases Java y componentes JSX. Eliminar imports obsoletos, código muerto y redeclaraciones de variables. | Medium | 3 | Sprint 2 | Por hacer |
| `KAIROS-9` | Task | Re-ejecutar análisis estático "Después" | Segunda pasada de linteo ESLint y JaCoCo post-correcciones. Evidenciar reducción de code smells a 0. | Medium | 3 | Sprint 2 | Por hacer |
| `KAIROS-10`| Story | Consolidar Informe de Cierre y Conclusiones | Redacción de Secciones C y D (SQAP). Calcular % Pass Rate (100%), Densidad de Defectos (0.017) y emitir juicio de aprobación a producción. | Highest | 5 | Sprint 3 | Por hacer |
| `KAIROS-11`| Task | Estructurar carpeta AreadePruebas y PDF final | Organizar carpeta `AreadePruebas/` y ejecutar `convert_md_to_pdf.py` para compilar `GRUPO#_PROYECTOFINAL_PARCIAL3.pdf`. | High | 5 | Sprint 3 | Por hacer |
| `KAIROS-12`| Task | Elaborar guión estructurado para Video Demo 5-7 min | Crear guía paso a paso `script_video_demo.md` desglosando narración y demostración en consola, Cypress, UI e informe de cierre. | High | 3 | Sprint 3 | Por hacer |

---

## 📊 CSV Exportable con Descripciones (`jira_import.csv`)

Ubicación del archivo: [jira_import.csv](file:///d:/Universidad/Semestre%20VIII/Semestre-VII/AseguramientoCalidad/Parcial%20III/ProyectoP3/KairosMixConBack/AreadePruebas/jira_import.csv)