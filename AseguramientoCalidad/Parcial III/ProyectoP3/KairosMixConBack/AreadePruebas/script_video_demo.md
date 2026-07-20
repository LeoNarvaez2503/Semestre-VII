# 🎬 GUÍÓN Y ESTRATEGIA PARA EL VIDEO DE EVIDENCIAS (DEMO 5-7 MINUTOS)

**Proyecto:** KairosMix SQA Audit  
**Duración Objetivo:** 5 a 7 minutos  
**Entregable:** Video MP4 / Enlace YouTube/Loom  

---

## ⏱️ Estructura y Cronograma del Video

| Minuto | Sección / Tema | Contenido NARRADO y MOSTRADO en Pantalla | Artefactos a Visualizar |
|---|---|---|---|
| **00:00 - 01:00** | **Introducción y Contexto SUT** | Presentación del equipo consultor, objetivo del plan SQA y descripción de KairosMix (Spring Boot + React 19). | Diapositiva inicial, repositorios `KairosMix` y `KairosMix-Backend`. |
| **01:00 - 02:30** | **Demostración Pruebas Automatizadas Backend (JUnit/JaCoCo)** | Mostrar consola ejecutando `mvn clean test`. Destacar los 167 tests unitarios/integración pasando al 100%. Abrir reporte JaCoCo HTML mostrando cobertura > 85%. | Terminal `mvn clean test`, `target/site/jacoco/index.html`. |
| **02:30 - 04:00** | **Ejecución de Pruebas E2E y BDD con Cypress** | Ejecutar `npx cypress run` en modo headed/headless. Mostrar interacción en vivo con el navegador en los flujos de Clientes, Productos y Mezcla Personalizada. | Cypress Runner, Reporte Cucumber Spec. |
| **04:00 - 05:30** | **Flujo Manual Complejo & Gestión de Defectos** | Demostrar flujo complejo manual en UI: Creación de cliente -> Mezcla personalizada -> Registro de orden -> Validación SweetAlert2. Mostrar bugs corregidos en Jira (`JIRA_BACKLOG.md`). | Navegador `http://localhost:5173`, `JIRA_BACKLOG.md`. |
| **05:30 - 07:00** | **Informe de Cierre, Análisis Estático y Conclusiones** | Resumen de métricas final (% Pass Rate 100%, 0 Bugs Críticos, 0 Code Smells ESLint/Checkstyle). Valoración de idoneidad para producción y despedida. | `GRUPO#_PROYECTOFINAL_PARCIAL3.pdf` / `.md`, Secciones C y D. |

---

## 📝 Guión Técnico de Locución (Script de Narración)

> **[00:00] Locutor:** *"Saludos Ing. Diego Gamboa. En este video presentamos la auditoría de calidad SQA para la plataforma KairosMix, desarrollada en arquitectura hexagonal Java Spring Boot y React 19."*
>
> **[01:00] Locutor:** *"Comenzamos con la suite de pruebas dinámicas en Backend. Como se observa en la consola, ejecutamos 167 pruebas unitarias e integración con JUnit 5 y Mockito, logrando 0 fallos. El reporte JaCoCo confirma un 85% de cobertura de código."*
>
> **[02:30] Locutor:** *"Pasamos a la automatización E2E con Cypress. Visualizamos la ejecución de las características BDD escritas en Gherkin. Cypress automatiza la creación de clientes y la formulación de mezclas de frutos secos validando la respuesta HTTP en tiempo real."*
>
> **[04:00] Locutor:** *"Para la prueba manual, navegamos por la interfaz SPA. Formulamos una mezcla personalizada con almendras y nueces, verificando que el cálculo automático de calorías y proteínas sea correcto. Todos los defectos hallados en el Sprint 1 fueron gestionados en Jira y resueltos exitosamente."*
>
> **[05:30] Locutor:** *"En conclusión, tras eliminar 100% de los code smells estáticos y obtener 100% de pasaje en pruebas automatizadas, certificamos que KairosMix está APROBADO PARA PRODUCCIÓN."*
