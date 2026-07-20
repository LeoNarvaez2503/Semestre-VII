# 📋 Backlog de Proyecto en Jira - SQA KairosMix (KAIROS-QA)

**Proyecto:** SQA & Audit - System Under Test (KairosMix)  
**Clave de Proyecto:** `KAIROS`  
**Metodología:** Scrum / SQA Sprints (3 Sprints de 1 Semana)  
**Consultora:** External Quality Engineering Consulting  

---

## 🏆 Épicas Definidas

| ID Épica | Nombre de la Épica | Descripción | Sprint | Estado |
|---|---|---|---|---|
| `EPIC-1` | **Planificación y Auditoría Estática (SQAP Initial)** | Recuperación del SUT, análisis estático "Antes", plan SQAP y gestión de riesgos. | Sprint 1 | DONE |
| `EPIC-2` | **Pruebas Dinámicas, Bug Fixing y Refactorización** | Ejecución JUnit/Vitest/Cypress E2E, corrección de defectos y refactorización. | Sprint 2 | IN PROGRESS |
| `EPIC-3` | **Informe de Cierre, Métricas y Entrega Final** | Cálculo de métricas, reporte de cierre, carpeta AreadePruebas y PDF final. | Sprint 3 | TO DO |

---

## 📑 Tabla Detallada del Backlog de Jira

| Clave | Tipo | Resumen / Título | Prioridad | Story Points | Sprint | Estado | Asignado |
|---|---|---|---|---|---|---|---|
| `KAIROS-1` | Story | Recuperar y desplegar SUT en entorno local de pruebas (Java 17 + React 19) | High | 3 | Sprint 1 | DONE | QA Team |
| `KAIROS-2` | Task | Ejecutar análisis estático inicial (ESLint en frontend, JaCoCo/Checkstyle en backend) | High | 5 | Sprint 1 | DONE | Static Audit Lead |
| `KAIROS-3` | Story | Redactar Plan SQAP Sección A (Alcance, Estrategia, Criterios Entry/Exit, Riesgos) | Highest | 8 | Sprint 1 | DONE | SQA Lead |
| `KAIROS-4` | Task | Elaborar Matriz de Rastreabilidad Requisitos (RF-01 a RF-08) vs Casos de Prueba | Medium | 5 | Sprint 2 | IN PROGRESS | Test Architect |
| `KAIROS-5` | Test | Ejecutar Pruebas Unitarias backend (JUnit 5/Mockito) y medir cobertura de código | High | 5 | Sprint 2 | IN PROGRESS | Backend Tester |
| `KAIROS-6` | Test | Ejecutar Suite End-to-End y BDD con Cypress + Cucumber en Frontend | Highest | 8 | Sprint 2 | IN PROGRESS | E2E Automation Lead |
| `KAIROS-7` | Bug | Corregir vulnerabilidades de validación, nulos y captura de excepciones en controladores | High | 5 | Sprint 2 | IN PROGRESS | Dev / QA Fixer |
| `KAIROS-8` | Task | Refactorizar clases, componentes y métodos para cumplir Naming Conventions | Medium | 3 | Sprint 2 | TO DO | Dev / QA Fixer |
| `KAIROS-9` | Task | Re-ejecutar análisis estático "Después" y comparar reducción de Deuda Técnica | Medium | 3 | Sprint 2 | TO DO | Static Audit Lead |
| `KAIROS-10`| Story | Consolidar Informe de Cierre (Test Summary Report) y Conclusiones (Secciones C y D) | Highest | 5 | Sprint 3 | TO DO | SQA Lead |
| `KAIROS-11`| Task | Estructurar carpeta `AreadePruebas/` y compilar documento final `GRUPO#_PROYECTOFINAL_PARCIAL3.pdf` | High | 5 | Sprint 3 | TO DO | Document Lead |
| `KAIROS-12`| Task | Elaborar guión estructurado y evidencias para el Video Demo de 5-7 minutos | High | 3 | Sprint 3 | TO DO | Media & Demo Lead |

---

## 📊 Formato CSV Exportable para Importación Directa en Jira

```csv
Issue Type,Issue Key,Summary,Priority,Story Points,Sprint,Status,Epic Link
Epic,EPIC-1,Planificación y Auditoría Estática (SQAP Initial),High,,Sprint 1,DONE,
Epic,EPIC-2,Pruebas Dinámicas, Bug Fixing y Refactorización,High,,Sprint 2,IN PROGRESS,
Epic,EPIC-3,Informe de Cierre, Métricas y Entrega Final,High,,Sprint 3,TO DO,
Story,KAIROS-1,Recuperar y desplegar SUT en entorno local de pruebas (Java 17 + React 19),High,3,Sprint 1,DONE,EPIC-1
Task,KAIROS-2,Ejecutar análisis estático inicial (ESLint en frontend, JaCoCo en backend),High,5,Sprint 1,DONE,EPIC-1
Story,KAIROS-3,Redactar Plan SQAP Sección A (Alcance, Estrategia, Criterios Entry/Exit, Riesgos),Highest,8,Sprint 1,DONE,EPIC-1
Task,KAIROS-4,Elaborar Matriz de Rastreabilidad Requisitos vs Casos de Prueba,Medium,5,Sprint 2,IN PROGRESS,EPIC-2
Test,KAIROS-5,Ejecutar Pruebas Unitarias backend (JUnit 5/Mockito) y medir cobertura,High,5,Sprint 2,IN PROGRESS,EPIC-2
Test,KAIROS-6,Ejecutar Suite End-to-End y BDD con Cypress + Cucumber en Frontend,Highest,8,Sprint 2,IN PROGRESS,EPIC-2
Bug,KAIROS-7,Corregir vulnerabilidades de validación, nulos y excepciones en controladores,High,5,Sprint 2,IN PROGRESS,EPIC-2
Task,KAIROS-8,Refactorizar clases, componentes y métodos para cumplir Naming Conventions,Medium,3,Sprint 2,TO DO,EPIC-2
Task,KAIROS-9,Re-ejecutar análisis estático "Después" y comparar reducción de Deuda Técnica,Medium,3,Sprint 2,TO DO,EPIC-2
Story,KAIROS-10,Consolidar Informe de Cierre (Test Summary Report) y Conclusiones,Highest,5,Sprint 3,TO DO,EPIC-3
Task,KAIROS-11,Estructurar carpeta AreadePruebas y compilar documento PDF final,High,5,Sprint 3,TO DO,EPIC-3
Task,KAIROS-12,Elaborar guión estructurado y evidencias para el Video Demo de 5-7 min,High,3,Sprint 3,TO DO,EPIC-3
```
