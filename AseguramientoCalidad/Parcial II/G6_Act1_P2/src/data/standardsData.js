export const standardsData = [
  {
    id: 1,
    titulo: "ISO/IEC 29110-5-1-2:2025",
    subtitulo: "Software engineering guidelines for the generic Basic profile",
    categoria: "Guidelines",
    tags: ["Software Engineering", "Basic Profile", "Guidelines", "2025"],
    descripcionCorta: "Guía completa para implementar el Perfil Básico diseñado para VSEs que desarrollan un único producto con un único equipo de trabajo.",
    contenidoExtendido: "# ISO/IEC 29110-5-1-2:2025\nVer temas individuales.",
    urlOriginal: "https://cdn.standards.iteh.ai/samples/82669/53c2b3e0d89b4126aea1556f6bd3c522/ISO-IEC-29110-5-1-2-2025.pdf",
    color: "from-violet-600 to-violet-400",
    icono: "Zap",
    temas: [
      {
        titulo: "Campo de Aplicación",
        contenido: `Esta guía es fundamental para Muy Pequeñas Entidades (VSEs) que buscan implementar el Perfil Básico de manera práctica y operativa. Es la segunda edición (2025) que reemplaza el antiguo reporte técnico de 2011, con cambios estructurales importantes.

### Población Objetivo
- VSEs que desarrollan un único producto
- Equipos de trabajo singulares
- Empresas en crecimiento que necesitan estructura

### Restricción de Seguridad
- **No aplica** para desarrollo de software crítico para la seguridad (safety-critical software)

### ¿Qué es una VSE?
Una Very Small Entity (Muy Pequeña Entidad) es una organización de hasta 25 personas involucradas en desarrollo de software. Este perfil es ideal para equipos que recién están formalizando sus procesos.`,
        reflexionPrompt: "¿Tu empresa o proyecto universitario califica como VSE? ¿Qué beneficios traería implementar un perfil básico de procesos?",
        recursos: {
          videoUrl: "https://www.youtube.com/embed/k5VZHgOhDPs",
          videoTitle: "Introducción a ISO/IEC 29110 — Perfil Básico",
          links: [
            { titulo: "ISO/IEC 29110 — Sitio Oficial ISO", url: "https://www.iso.org/standard/82669.html" },
          ],
        },
        quiz: [
          {
            pregunta: "¿Cuál es el tamaño máximo de una VSE según ISO/IEC 29110?",
            opciones: ["Hasta 10 personas", "Hasta 25 personas", "Hasta 50 personas", "Hasta 100 personas"],
            respuestaCorrecta: 1,
            explicacion: "Una VSE (Very Small Entity) se define como una organización de hasta 25 personas involucradas en desarrollo de software."
          },
          {
            pregunta: "¿Para qué tipo de software NO aplica el Perfil Básico?",
            opciones: ["Software de gestión de inventario", "Aplicaciones web", "Software crítico para la seguridad (safety-critical)", "Sistemas de reporte"],
            respuestaCorrecta: 2,
            explicacion: "La restricción explícita es que NO aplica para software safety-critical, el cual requiere normas mucho más rigurosas."
          },
        ],
      },
      {
        titulo: "Procesos Nucleares",
        contenido: `### A. Gestión de Proyectos (Project Management - PM)
**Propósito:** Planificar, ejecutar y controlar sistemáticamente las tareas de un proyecto de software para cumplir con el alcance, calidad, tiempos y costos pactados.

**Actividades clave:**
- Planificación del proyecto
- Identificación y gestión de riesgos
- Control del cronograma y presupuesto
- Visibilidad total del proyecto
- Acciones correctivas ante desviaciones

### B. Implementación de Software (Software Implementation - SI)
**Propósito:** Ejecutar un proceso técnico sistemático de construcción de software que satisfaga las necesidades del cliente y asegure alta calidad en los entregables.

**Actividades clave:**
- Análisis de requisitos
- Diseño arquitectónico y detallado
- Desarrollo e implementación
- Pruebas integrales
- Entrega del producto

Estos dos procesos (PM y SI) son los pilares fundamentales del Perfil Básico. Todo proyecto VSE debe implementar ambos.`,
        reflexionPrompt: "¿Cómo se relacionan PM y SI en tu experiencia? ¿Alguna vez has trabajado en un proyecto donde faltara uno de estos procesos?",
        quiz: [
          {
            pregunta: "¿Cuál es el propósito principal del proceso PM en el Perfil Básico?",
            opciones: [
              "Escribir código de calidad",
              "Planificar, ejecutar y controlar tareas cumpliendo alcance, calidad, tiempos y costos",
              "Realizar pruebas de seguridad",
              "Gestionar bases de datos",
            ],
            respuestaCorrecta: 1,
            explicacion: "PM busca planificar, ejecutar y controlar las tareas del proyecto para cumplir alcance, calidad, tiempos y costos. No se limita a código ni pruebas."
          },
          {
            pregunta: "¿Cuántos procesos nucleares define el Perfil Básico?",
            opciones: ["1 — Solo PM", "2 — PM y SI", "3 — PM, SI y QA", "4 — PM, SI, QA y CM"],
            respuestaCorrecta: 1,
            explicacion: "El Perfil Básico define exactamente 2 procesos nucleares: Gestión de Proyectos (PM) e Implementación de Software (SI)."
          },
        ],
      },
      {
        titulo: "Nuevos Componentes (Anexos 2025)",
        contenido: `La edición 2025 incorpora 5 nuevos Anexos que amplían significativamente el alcance del Perfil Básico:

### Anexo A: Proceso de Soporte de Software
Directrices para servicios post-despliegue y mantenimiento evolutivo. Cubre cómo dar soporte técnico después de entregar el producto.

### Anexo B: Pruebas de Software Ampliadas
Técnicas formales de diseño de pruebas y control de datos basadas en ISO/IEC/IEEE 29119. Incluye pruebas unitarias, de integración y de sistema.

### Anexo C: Accesibilidad
Incorporación de tecnologías asistivas y estrategias adaptativas para poblaciones con capacidades diversas. Promueve software inclusivo.

### Anexo D: Seguridad Informática
Controles de seguridad y salvaguardas técnicas para proteger confidencialidad, integridad y disponibilidad de datos y sistemas.

### Anexo E: Paquetes de Despliegue
Artefactos prácticos, plantillas y guías de implementación rápidas. Herramientas descargables para comenzar de inmediato.`,
        reflexionPrompt: "¿Cuál de los 5 Anexos consideras más relevante para el tipo de software que desarrollas o quieres desarrollar? ¿Por qué?",
        quiz: [
          {
            pregunta: "¿Cuántos Anexos nuevos incorpora la edición 2025?",
            opciones: ["2", "3", "4", "5"],
            respuestaCorrecta: 3,
            explicacion: "La edición 2025 incorpora 5 Anexos: A (Soporte), B (Pruebas), C (Accesibilidad), D (Seguridad) y E (Paquetes de Despliegue)."
          },
          {
            pregunta: "¿Qué cubre el Anexo C de la edición 2025?",
            opciones: ["Seguridad informática", "Pruebas de software", "Accesibilidad y tecnologías asistivas", "Mantenimiento evolutivo"],
            respuestaCorrecta: 2,
            explicacion: "El Anexo C se enfoca en Accesibilidad: tecnologías asistivas y estrategias adaptativas para poblaciones con capacidades diversas."
          },
        ],
      },
      {
        titulo: "Conceptos Operativos Importantes",
        contenido: `Estos conceptos son fundamentales para entender cómo funciona la guía en la práctica:

- **Independencia de herramientas**: No impone técnicas, métodos o ciclos de vida específicos. El equipo elige su propia metodología (Agile, Cascada, etc.)
- **Flexibilidad en roles**: Un miembro puede asumir múltiples roles. Un rol puede compartirse entre varias personas.
- **Líneas base (Baseline)**: Productos de trabajo clave congelados formalmente. Una vez que un documento se establece como línea base, cualquier cambio requiere solicitud de cambio aprobada.
- **Tareas condicionales**: Se ejecutan solo si el cliente las solicita explícitamente. Reemplazan las antiguas "tareas opcionales" para evitar ambigüedades contractuales.

### Importancia Práctica
Estos conceptos permiten que la guía sea adoptable por cualquier VSE sin importar su stack tecnológico, cultura de trabajo o tipo de proyecto. La flexibilidad es intencional.`,
        reflexionPrompt: "¿Qué ventajas y desventajas ves en la 'independencia de herramientas'? ¿Crees que debería la norma recomendar ciclos de vida específicos?",
        quiz: [
          {
            pregunta: "¿Qué significa que la guía sea 'agnóstica a herramientas'?",
            opciones: [
              "No funciona con herramientas de software",
              "Requiere herramientas aprobadas por ISO",
              "No impone técnicas, métodos ni ciclos de vida específicos",
              "Solo funciona con metodologías ágiles",
            ],
            respuestaCorrecta: 2,
            explicacion: "Agnóstica a herramientas significa que no impone ninguna herramienta, método o ciclo de vida. El equipo elige libremente."
          },
          {
            pregunta: "¿Qué son las 'tareas condicionales' en este contexto?",
            opciones: [
              "Tareas que se ejecutan siempre",
              "Tareas que se ejecutan SOLO si el cliente las solicita explícitamente",
              "Tareas automáticas del sistema",
              "Tareas que dependen del presupuesto",
            ],
            respuestaCorrecta: 1,
            explicacion: "Las tareas condicionales reemplazan las 'opcionales'. Se ejecutan únicamente si el cliente las pide, evitando ambigüedades contractuales."
          },
        ],
      },
    ],
  },
  {
    id: 2,
    titulo: "ISO/IEC 29110-4-1:2018",
    subtitulo: "Profile specifications: Generic profile group",
    categoria: "Specifications",
    tags: ["Profile Specifications", "Generic Group", "Requirements", "2018"],
    descripcionCorta: "Especificación de requisitos del Perfil Básico con elementos obligatorios directamente aplicables para organizaciones que buscan conformidad.",
    contenidoExtendido: "# ISO/IEC 29110-4-1:2018\nVer temas individuales.",
    urlOriginal: "https://cdn.standards.iteh.ai/samples/67223/21df0b1144634f71a5b5492ea714ce01/ISO-IEC-29110-4-1-2018.pdf",
    color: "from-cyan-600 to-cyan-400",
    icono: "BookOpen",
    temas: [
      {
        titulo: "Campo de Aplicación y Reglas de Conformidad",
        contenido: `### Aplicabilidad
- Diseñada para VSEs (hasta 25 personas) en desarrollo de software
- Compatible con metodologías tradicionales y ágiles
- Cascada, iterativo, incremental, evolutivo o agile

### Quién Puede Declarar Conformidad
Las organizaciones o proyectos que implementen los procesos pueden declarar su conformidad legal con este perfil.

### Restricción Importante
La conformidad **no puede ser declarada** por desarrolladores de productos de soporte como:
- Herramientas de software
- Cursos y ayudas didácticas
- Plantillas y recursos

### Regla del "Shall"
Los requisitos son estrictamente obligatorios e identificados con la palabra "shall" (deberá). No hay margen de interpretación: o se cumple o no se cumple.`,
        reflexionPrompt: "¿Por qué crees que los creadores de herramientas y cursos no pueden declarar conformidad? ¿Qué problemas evita esta restricción?",
        quiz: [
          {
            pregunta: "¿Quién puede declarar conformidad con ISO/IEC 29110-4-1:2018?",
            opciones: [
              "Cualquier empresa de software",
              "Organizaciones o proyectos que implementen los procesos",
              "Creadores de herramientas de gestión",
              "Universidades que impartan cursos ISO",
            ],
            respuestaCorrecta: 1,
            explicacion: "Solo las organizaciones que realmente implementan los procesos pueden declarar conformidad. Los creadores de herramientas/cursos están excluidos."
          },
          {
            pregunta: "¿Qué significa la palabra 'shall' en los requisitos?",
            opciones: ["Recomendación opcional", "Requisito condicional", "Requisito estrictamente obligatorio", "Buena práctica sugerida"],
            respuestaCorrecta: 2,
            explicacion: "'Shall' = estrictamente obligatorio. A diferencia de 'should' (recomendación), 'shall' no admite excepciones."
          },
        ],
      },
      {
        titulo: "Condiciones Mínimas para el Uso del Perfil Básico",
        contenido: `Antes de aplicar este perfil, la VSE debe cumplir con cuatro condiciones iniciales:

1. **Contrato formal**: Existe un contrato de proyecto o acuerdo con alcance delimitado
2. **Análisis de viabilidad**: Análisis técnico, de costos y cronograma completado
3. **Equipo asignado**: El equipo de trabajo y Project Manager están designados y capacitados
4. **Recursos disponibles**: Bienes, servicios e infraestructura necesarios están disponibles

### ¿Por qué estas condiciones?
Sin estas condiciones previas, la implementación del perfil carece de fundamento. No tiene sentido gestionar un proyecto sin contrato, sin equipo o sin recursos. Estas condiciones garantizan un punto de partida sólido.`,
        reflexionPrompt: "¿Qué pasaría si un equipo intenta implementar el Perfil Básico sin cumplir alguna de las 4 condiciones? Da un ejemplo concreto.",
        quiz: [
          {
            pregunta: "¿Cuántas condiciones iniciales debe cumplir una VSE antes de aplicar el Perfil Básico?",
            opciones: ["2", "3", "4", "5"],
            respuestaCorrecta: 2,
            explicacion: "Son exactamente 4: Contrato formal, Análisis de viabilidad, Equipo asignado y Recursos disponibles."
          },
          {
            pregunta: "¿Cuál de las siguientes NO es una condición mínima para el Perfil Básico?",
            opciones: ["Contrato formal", "Certificación CMMI previa", "Equipo asignado", "Recursos disponibles"],
            respuestaCorrecta: 1,
            explicacion: "Certificación CMMI previa NO es requisito. Las 4 condiciones son: contrato, viabilidad, equipo y recursos."
          },
        ],
      },
      {
        titulo: "Procesos Obligatorios del Perfil Básico",
        contenido: `### Proceso de Gestión de Proyectos (PM)
**Propósito:** Establecer y ejecutar sistemáticamente las tareas del proyecto.

**Requisitos obligatorios:**
- Definir alcance del trabajo y entregables
- Definir tareas, recursos y estimar esfuerzo/costo/duración
- Planificar asignación de recursos y plan de ejecución
- Identificar y monitorear riesgos
- Implementar control de versiones con políticas de backup/restauración
- Identificar y controlar elementos de configuración del software
- Monitorear progreso contra lo planificado
- Tomar acciones correctivas ante desviaciones

### Proceso de Implementación de Software (SI)
Requisitos técnicos de desarrollo, diseño y construcción del producto de software conforme a ISO/IEC/IEEE 12207. Incluye todo desde captura de requisitos hasta testing y entrega final.`,
        reflexionPrompt: "De los 8 requisitos obligatorios de PM, ¿cuáles crees que son más difíciles de implementar en un equipo pequeño? ¿Por qué?",
        quiz: [
          {
            pregunta: "¿Cuál de estos es un requisito obligatorio de PM en el Perfil Básico?",
            opciones: ["Implementar inteligencia artificial", "Implementar control de versiones con backup", "Usar metodología Scrum", "Obtener certificación ISO 9001"],
            respuestaCorrecta: 1,
            explicacion: "Implementar control de versiones con políticas de backup/restauración es obligatorio. No se impone metodología ni certificaciones adicionales."
          },
          {
            pregunta: "¿En qué estándar base se fundamenta el proceso SI (Software Implementation)?",
            opciones: ["CMMI", "ISO/IEC/IEEE 12207", "IEEE 830", "ISO 9001"],
            respuestaCorrecta: 1,
            explicacion: "El proceso SI sigue los requisitos de ISO/IEC/IEEE 12207, el estándar internacional de procesos del ciclo de vida del software."
          },
        ],
      },
      {
        titulo: "Relación con Estándares Base",
        contenido: `La conformidad con ISO/IEC 29110-4-1 implica automáticamente conformidad con:
- ISO/IEC/IEEE 12207 (Procesos del ciclo de vida del software)
- Otros estándares base de origen

### Conformidad Encadenada
Este concepto es poderoso: al cumplir con un perfil ISO 29110, automáticamente cumples con los estándares internacionales de los que se deriva. Esto es porque los perfiles 29110 son subconjuntos simplificados de estándares más grandes.

### Ventaja para las VSEs
Una VSE que cumple con 29110-4-1 puede declarar legítimamente que sus procesos están alineados con ISO/IEC/IEEE 12207, lo cual es reconocido internacionalmente.`,
        reflexionPrompt: "¿Qué ventaja competitiva da a una VSE poder declarar conformidad con ISO/IEC/IEEE 12207 sin haber implementado ese estándar completo?",
        quiz: [
          {
            pregunta: "Al cumplir con ISO/IEC 29110-4-1, ¿qué otro estándar se cumple automáticamente?",
            opciones: ["ISO 9001", "ISO/IEC/IEEE 12207", "CMMI Nivel 3", "IEEE 830"],
            respuestaCorrecta: 1,
            explicacion: "Conformidad con 29110-4-1 implica conformidad con ISO/IEC/IEEE 12207 (ciclo de vida del software), del cual se deriva el perfil."
          },
          {
            pregunta: "¿Por qué los perfiles 29110 otorgan conformidad encadenada?",
            opciones: [
              "Son estándares independientes",
              "Son subconjuntos simplificados de estándares más grandes",
              "Es un error en la norma",
              "Solo aplica en Europa",
            ],
            respuestaCorrecta: 1,
            explicacion: "Los perfiles 29110 son subconjuntos simplificados de estándares como ISO/IEC/IEEE 12207, por eso cumplirlos implica cumplir el estándar base."
          },
        ],
      },
    ],
  },
  {
    id: 3,
    titulo: "ISO/IEC 29110-5-1-1:2025",
    subtitulo: "Software engineering guidelines for the generic Entry profile",
    categoria: "Guidelines",
    tags: ["Entry Profile", "Start-ups", "Small Projects", "2025"],
    descripcionCorta: "Guía operativa para el Perfil de Entrada diseñado para start-ups y proyectos pequeños con menos de 6 personas-mes.",
    contenidoExtendido: "# ISO/IEC 29110-5-1-1:2025\nVer temas individuales.",
    urlOriginal: "https://cdn.standards.iteh.ai/samples/85420/c654ca4e75e747c58171a581d2cc3928/ISO-IEC-29110-5-1-1-2025.pdf",
    color: "from-emerald-600 to-emerald-400",
    icono: "Rocket",
    temas: [
      {
        titulo: "Campo de Aplicación y Contexto",
        contenido: `### Punto de Partida en la Hoja de Ruta
El Perfil de Entrada es el **primer escalón** de una hoja de ruta de software que consta de cuatro perfiles progresivos:
1. **Entry** (Entrada) — Actual
2. **Basic** (Básico)
3. **Intermediate** (Intermedio)
4. **Advanced** (Avanzado)

### Criterios de Uso
Está específicamente diseñado para:
- **Start-ups**: VSEs con menos de 3 años de operación
- **Proyectos pequeños**: Tamaño menor a 6 personas-mes
- **Equipos singulares**: Un solo equipo de trabajo

### Restricción Crítica
**No aplica** para el desarrollo de software crítico para la seguridad (safety-critical software).`,
        reflexionPrompt: "¿Conoces alguna start-up que se beneficiaría del Perfil de Entrada? ¿Qué obstáculos enfrentaría para implementarlo?",
        quiz: [
          {
            pregunta: "¿En qué posición está el Perfil de Entrada en la hoja de ruta ISO/IEC 29110?",
            opciones: ["Segundo nivel", "Último nivel", "Primer escalón de cuatro perfiles progresivos", "Nivel paralelo al Básico"],
            respuestaCorrecta: 2,
            explicacion: "Entry es el primer escalón, seguido de Basic, Intermediate y Advanced."
          },
          {
            pregunta: "¿Cuál es el tamaño máximo de proyecto para usar el Perfil de Entrada?",
            opciones: ["Menos de 3 personas-mes", "Menos de 6 personas-mes", "Menos de 10 personas-mes", "Sin límite"],
            respuestaCorrecta: 1,
            explicacion: "El Perfil de Entrada es para proyectos con menos de 6 personas-mes."
          },
        ],
      },
      {
        titulo: "Estructura de Procesos del Perfil de Entrada",
        contenido: `### A. Gestión de Proyectos (Project Management - PM)
Define y ejecuta sistemáticamente las tareas del proyecto para cumplir con alcance, calidad, tiempo y costos acordados.

**Características:**
- Proporciona visibilidad del proyecto
- Facilita acciones correctivas oportunas
- Define roles específicos, actividades y tareas
- Productos de trabajo almacenados en repositorio

### B. Implementación de Software (Software Implementation - SI)
Sigue un proceso sistemático de construcción técnica.

**Características:**
- Garantiza satisfacción de necesidades del cliente
- Asegura calidad de entregables
- Guía desde definición de requisitos hasta entrega final`,
        reflexionPrompt: "¿Qué diferencias principales esperas entre el PM del Perfil de Entrada vs el Perfil Básico? ¿Cómo se simplifica para start-ups?",
        quiz: [
          {
            pregunta: "¿Qué proporcionan los procesos PM y SI en el Perfil de Entrada?",
            opciones: [
              "Solo documentación técnica",
              "Visibilidad del proyecto y calidad de entregables",
              "Certificación automática ISO",
              "Herramientas de desarrollo pre-configuradas",
            ],
            respuestaCorrecta: 1,
            explicacion: "PM proporciona visibilidad y control; SI asegura calidad de entregables y satisfacción del cliente."
          },
          {
            pregunta: "¿Dónde se almacenan los productos de trabajo según el Perfil de Entrada?",
            opciones: ["En carpetas físicas", "En la nube de ISO", "En un repositorio definido", "No se almacenan"],
            respuestaCorrecta: 2,
            explicacion: "Los productos de trabajo deben almacenarse en un repositorio definido por el equipo."
          },
        ],
      },
      {
        titulo: "Convenciones y Conceptos Operativos",
        contenido: `### Tareas Condicionales
Reemplazan a las tareas opcionales. Se ejecutan **únicamente si** el cliente las solicita explícitamente (ej: documentación de usuario).

### Líneas Base (Baseline)
Productos de trabajo clave como la especificación de requisitos deben ser congelados formalmente. Las modificaciones posteriores requieren solicitud de cambio aprobada (change request).

### Roles Flexibles
- Un solo miembro puede asumir múltiples roles
- Un solo rol puede compartirse entre varias personas
- Depende de la naturaleza del proyecto

### Independencia de Herramientas y Ciclos de Vida
La guía **no impone**:
- Técnicas o métodos específicos
- Ciclos de vida particulares (ágil, cascada, etc.)
- Herramientas de software

La elección queda totalmente a discreción del equipo de la VSE.`,
        reflexionPrompt: "¿Qué opinas de la flexibilidad de roles? En tu experiencia, ¿es ventajoso que una persona asuma múltiples roles o genera sobrecarga?",
        quiz: [
          {
            pregunta: "¿Qué requiere una modificación a una Línea Base (Baseline)?",
            opciones: ["Solo un email al equipo", "Una solicitud de cambio aprobada (change request)", "Permiso del CEO", "Nada, se puede modificar libremente"],
            respuestaCorrecta: 1,
            explicacion: "Modificar una Baseline requiere una solicitud de cambio (change request) formalmente aprobada."
          },
          {
            pregunta: "¿Puede un miembro del equipo asumir múltiples roles según el Perfil de Entrada?",
            opciones: ["No, cada rol es exclusivo", "Sí, es explícitamente permitido", "Solo si el equipo es de 3+ personas", "Solo el Project Manager puede tener varios roles"],
            respuestaCorrecta: 1,
            explicacion: "La guía permite flexibilidad total: una persona puede tener múltiples roles y un rol puede compartirse entre varias personas."
          },
        ],
      },
      {
        titulo: "Edición 2025 — Cambios Principales",
        contenido: `La edición 2025 del Perfil de Entrada trae cambios significativos respecto a la versión de 2012:

- **Reescritura de tareas**: Mayor facilidad de comprensión. Las descripciones son más claras y directas.
- **Eliminación de elementos**: Perfil más ligero y ágil. Se removieron requisitos que no aportaban valor a equipos muy pequeños.
- **Tareas condicionales**: Reemplazan las "opcionales". Esto evita ambigüedades contractuales con clientes.
- **Reemplazo técnico**: Esta edición reemplaza la versión previa de 2012 completamente.

### Filosofía del cambio
La edición 2025 refleja 13 años de experiencia real con VSEs alrededor del mundo. Los cambios fueron motivados por retroalimentación directa de equipos que implementaron el perfil.`,
        reflexionPrompt: "¿Qué opinas de eliminar requisitos para hacer el perfil más ligero? ¿En qué casos podría ser negativo simplificar demasiado?",
        quiz: [
          {
            pregunta: "¿Qué versión previa reemplaza la edición 2025 del Perfil de Entrada?",
            opciones: ["Versión 2008", "Versión 2010", "Versión 2012", "Versión 2018"],
            respuestaCorrecta: 2,
            explicacion: "La edición 2025 reemplaza completamente la versión previa de 2012."
          },
          {
            pregunta: "¿Por qué se introdujeron 'tareas condicionales' en lugar de 'opcionales'?",
            opciones: ["Para agregar más requisitos", "Para evitar ambigüedades contractuales con clientes", "Para cumplir con CMMI", "Por requisito del gobierno"],
            respuestaCorrecta: 1,
            explicacion: "Las tareas condicionales evitan ambigüedades: se ejecutan SOLO si el cliente las solicita, lo cual es contractualmente más claro."
          },
        ],
      },
    ],
  },
  {
    id: 4,
    titulo: "ISO/IEC TR 29110-3-1:2020",
    subtitulo: "Process assessment guidelines",
    categoria: "Technical Report",
    tags: ["Assessment", "Evaluation", "Maturity Model", "2020"],
    descripcionCorta: "Informe técnico que proporciona directrices para evaluar la madurez y rendimiento de los procesos en VSEs.",
    contenidoExtendido: "# ISO/IEC TR 29110-3-1:2020\nVer temas individuales.",
    urlOriginal: "https://cdn.standards.iteh.ai/samples/71951/1baf19279080427e8cd5302147c82019/ISO-IEC-TR-29110-3-1-2020.pdf",
    color: "from-orange-600 to-orange-400",
    icono: "Gauge",
    temas: [
      {
        titulo: "Propósito y Enfoque",
        contenido: `### Objetivo Principal
Proporciona directrices y guías para realizar la evaluación de procesos (process assessment) en Muy Pequeñas Entidades (VSEs), vinculada con la familia de normas ISO/IEC 330xx.

### Enfoque de Evaluación
**Mejora Continua y Auditoría:**
- Evaluaciones internas: Autoevaluaciones para identificar puntos débiles
- Evaluaciones externas: Auditorías formales de certificación por terceros

### Adaptación al Tamaño
Reconoce que los métodos tradicionales de auditoría son costosos y burocráticos para VSEs, propone un enfoque simplificado manteniendo rigor metodológico internacional.`,
        reflexionPrompt: "¿Preferirías una autoevaluación interna o una auditoría externa para tu equipo? ¿Cuáles son los pros y contras de cada una?",
        quiz: [
          {
            pregunta: "¿Con qué familia de normas se vincula la evaluación de procesos en ISO 29110-3-1?",
            opciones: ["ISO 9000", "ISO/IEC 330xx", "CMMI", "IEEE 12207"],
            respuestaCorrecta: 1,
            explicacion: "La evaluación de procesos se vincula con la familia ISO/IEC 330xx."
          },
          {
            pregunta: "¿Qué dos tipos de evaluación contempla la guía?",
            opciones: [
              "Manual y automática",
              "Interna (autoevaluación) y externa (auditoría por terceros)",
              "Técnica y administrativa",
              "Nacional e internacional",
            ],
            respuestaCorrecta: 1,
            explicacion: "Contempla evaluaciones internas (autoevaluación) y externas (auditoría formal de certificación)."
          },
        ],
      },
      {
        titulo: "Modelos de Evaluación (PRM y PAM)",
        contenido: `### Modelo de Referencia de Procesos (PRM)
Se extrae de ISO/IEC 29110-4-1. Define:
- Conjunto de procesos obligatorios
- Resultados esperados (outcomes)
- Logros que la VSE debe alcanzar

### Modelo de Evaluación de Procesos (PAM)
Detalla los indicadores específicos que el evaluador debe buscar:
- Insumos requeridos
- Herramientas necesarias
- Prácticas a implementar
- Productos de trabajo requeridos

### Relación PRM ↔ PAM
El PRM define QUÉ lograr. El PAM define CÓMO evidenciar que se logró. Ambos son necesarios para una evaluación completa.`,
        reflexionPrompt: "¿Por qué crees que separar el QUÉ (PRM) del CÓMO (PAM) es importante? ¿Podrían combinarse sin perder efectividad?",
        quiz: [
          {
            pregunta: "¿Cuál es la diferencia entre PRM y PAM?",
            opciones: [
              "Son lo mismo",
              "PRM define qué lograr; PAM define cómo evidenciar que se logró",
              "PRM es para software, PAM para hardware",
              "PRM es interno, PAM externo",
            ],
            respuestaCorrecta: 1,
            explicacion: "PRM (Referencia) = QUÉ lograr. PAM (Evaluación) = CÓMO evidenciarlo. Son complementarios."
          },
          {
            pregunta: "¿De dónde se extrae el PRM?",
            opciones: ["CMMI", "ISO/IEC 29110-4-1", "IEEE 12207 directamente", "Lo crea cada VSE"],
            respuestaCorrecta: 1,
            explicacion: "El PRM se extrae de ISO/IEC 29110-4-1 (Profile Specifications)."
          },
        ],
      },
      {
        titulo: "Modelo de Madurez de las VSEs",
        contenido: `### Evolución por Perfiles
A diferencia de CMMI (niveles abstractos 1-5), el modelo de madurez de ISO 29110 está ligado directamente al logro progresivo de perfiles:
- Entry (Entrada)
- Basic (Básico)
- Intermediate (Intermedio)
- Advanced (Avanzado)

### Reglas de Logro
Para certificar un nivel de madurez específico, la VSE debe demostrar:
- **Cumplimiento total e incondicional** de todos los procesos definidos para ese perfil
- No existen niveles parciales de cumplimiento
- Es binario: cumple completamente o no cumple`,
        reflexionPrompt: "¿Crees que el enfoque binario (cumple o no cumple) es justo? ¿Debería haber niveles parciales de cumplimiento como en CMMI?",
        quiz: [
          {
            pregunta: "¿Cómo se diferencia el modelo de madurez ISO 29110 de CMMI?",
            opciones: [
              "Usa niveles del 1 al 5 como CMMI",
              "Solo aplica a hardware",
              "Liga la madurez al logro de perfiles concretos (Entry, Basic, etc.)",
              "CMMI es más simple",
            ],
            respuestaCorrecta: 2,
            explicacion: "ISO 29110 liga la madurez a perfiles concretos y progresivos, no a niveles abstractos como CMMI."
          },
          {
            pregunta: "Para certificar un nivel de madurez, la VSE debe demostrar:",
            opciones: ["70% de los procesos", "Cumplimiento total e incondicional de TODOS los procesos", "Al menos 3 de 4 procesos", "Solo el PM"],
            respuestaCorrecta: 1,
            explicacion: "Es binario: cumplimiento total e incondicional. No existe conformidad parcial."
          },
        ],
      },
      {
        titulo: "Anexos Prácticos y Validez Internacional",
        contenido: `### Anexo A: Marco de Medición
Establece la escala de habilitación de procesos:
- No lograda (Not achieved)
- Parcialmente lograda (Partially achieved)
- Ampliamente lograda (Largely achieved)
- Completamente lograda (Fully achieved)

### Anexo B: Evaluación para Software
Modelo específico para VSEs que desarrollan software basado en el Perfil Básico.

### Anexo C: Evaluación para Ingeniería de Sistemas
Modelo equivalente con indicadores adaptados para hardware y software integrado.

### Validez Internacional
La guía mantiene:
- Validez según estándares internacionales ISO/IEC
- Comparabilidad con otros marcos de evaluación
- Rigor metodológico reconocido globalmente`,
        reflexionPrompt: "¿Cuál de los 4 niveles de la escala de medición (Not achieved → Fully achieved) crees que es más difícil de distinguir en la práctica?",
        quiz: [
          {
            pregunta: "¿Cuántos niveles tiene la escala de habilitación del Anexo A?",
            opciones: ["3", "4", "5", "6"],
            respuestaCorrecta: 1,
            explicacion: "Son 4 niveles: No lograda, Parcialmente lograda, Ampliamente lograda, Completamente lograda."
          },
          {
            pregunta: "¿Qué cubre el Anexo C?",
            opciones: ["Solo software", "Solo hardware", "Ingeniería de sistemas (hardware y software integrado)", "Seguridad informática"],
            respuestaCorrecta: 2,
            explicacion: "El Anexo C es para Ingeniería de Sistemas con indicadores adaptados para hardware y software integrado."
          },
        ],
      },
    ],
  },
  {
    id: 5,
    titulo: "ISO/IEC 29110-2-1:2015",
    subtitulo: "Framework and Taxonomy",
    categoria: "Framework",
    tags: ["Framework", "Taxonomy", "Conceptual", "2015"],
    descripcionCorta: "Marco de referencia y taxonomía legal que establece los conceptos fundamentales de ingeniería de software para VSEs.",
    contenidoExtendido: "# ISO/IEC 29110-2-1:2015\nVer temas individuales.",
    urlOriginal: "https://cdn.standards.iteh.ai/samples/62712/4aba361ac34140b28b599f07f2b87ebb/ISO-IEC-29110-2-1-2015.pdf",
    color: "from-pink-600 to-pink-400",
    icono: "Grid",
    temas: [
      {
        titulo: "Campos de Aplicación y Audiencia",
        contenido: `### Propósito Principal
Actúa como el **marco de referencia (Framework)** y la **taxonomía legal** de la serie ISO/IEC 29110. Introduce los conceptos fundamentales de ingeniería de software y sistemas para VSEs.

### Audiencia Objetivo
A diferencia de otras partes, este documento **no está destinado directamente a VSEs**, sino a:
- Creadores de perfiles (profile producers)
- Evaluadores de conformidad
- Desarrolladores de herramientas y metodologías

### Flexibilidad Organizacional
- Centrada en VSEs (hasta 25 personas)
- Procesos también adoptables por organizaciones más grandes
- La norma advierte: Ciertos problemas de macroempresas podrían no estar cubiertos`,
        reflexionPrompt: "¿Por qué crees que este documento está dirigido a 'creadores de perfiles' y no a VSEs directamente? ¿Qué implicaciones tiene esto?",
        quiz: [
          {
            pregunta: "¿A quién está destinado principalmente ISO/IEC 29110-2-1:2015?",
            opciones: ["Directamente a VSEs", "A desarrolladores junior", "A creadores de perfiles, evaluadores y desarrolladores de herramientas", "Solo a auditores"],
            respuestaCorrecta: 2,
            explicacion: "A diferencia de otras partes, este documento NO está destinado directamente a VSEs sino a quienes crean perfiles y metodologías."
          },
          {
            pregunta: "¿Pueden organizaciones más grandes que VSEs adoptar estos procesos?",
            opciones: ["No, es exclusivo para VSEs", "Sí, pero con advertencia de que ciertos problemas no están cubiertos", "Solo si tienen menos de 50 personas", "Requieren autorización ISO"],
            respuestaCorrecta: 1,
            explicacion: "Los procesos son adoptables por organizaciones más grandes, aunque la norma advierte que ciertos problemas de macroempresas podrían no estar cubiertos."
          },
        ],
      },
      {
        titulo: "Principios Generales de Conformidad",
        contenido: `### Reglas Estrictas de Conformidad

#### No se permite Tailoring (Personalización)
- Los perfiles son paquetes "pre-diseñados" y simplificados
- No se permite recortar ni modificar los perfiles
- No se permiten **niveles parciales de conformidad**
- **O se cumple por completo o no se cumple**

#### Extensiones Permitidas
Es aceptable que una organización incorpore elementos más allá de lo estipulado:
- Las extensiones **no deben redefinir** reglas existentes
- No deben provocar que los procesos estándar se ejecuten de forma incorrecta
- Deben estar **claramente documentadas**

#### Relación con Estándares Base
La conformidad con un perfil ISO/IEC 29110 implica automáticamente conformidad con estándares base de origen:
- ISO/IEC/IEEE 12207 (Procesos del ciclo de vida)
- ISO/IEC/IEEE 15288 (Ingeniería de sistemas)`,
        reflexionPrompt: "¿Por qué crees que no se permite tailoring? ¿Es esto una fortaleza o debilidad de la norma para equipos muy diversos?",
        quiz: [
          {
            pregunta: "¿Se permite el 'Tailoring' (personalización) de los perfiles ISO/IEC 29110?",
            opciones: ["Sí, hasta un 30%", "Sí, mientras se documente", "No, deben cumplirse completamente", "Solo en proyectos de menos de 3 meses"],
            respuestaCorrecta: 2,
            explicacion: "El tailoring NO está permitido. Es todo o nada. Sin embargo, SÍ se permiten extensiones (agregar más, no quitar)."
          },
          {
            pregunta: "¿Qué requisito tienen las extensiones que una organización agregue?",
            opciones: [
              "Deben ser aprobadas por ISO",
              "No deben redefinir reglas existentes y deben documentarse claramente",
              "Deben reemplazar procesos existentes",
              "No hay requisitos para extensiones",
            ],
            respuestaCorrecta: 1,
            explicacion: "Las extensiones no deben redefinir reglas, no deben interferir con procesos estándar, y deben documentarse claramente."
          },
        ],
      },
      {
        titulo: "Evidencias para Demostrar Conformidad",
        contenido: `### Dos Tipos de Evidencia Objetiva Requerida

#### Evidencia de Procesos
Demostrar que los requisitos obligatorios del ciclo de vida se cumplieron:
- Utilizando productos de entrada requeridos
- Generando productos de salida estipulados
- Documentación de la ejecución

#### Evidencia de Productos
Probar que los productos de trabajo o entregables cumplen con:
- Contenido mínimo requerido
- Atributos especificados
- Criterios de aceptación

**Nota importante:** La documentación no necesita estar en carpetas físicas separadas. Es válido si se encuentra en repositorio digital común.`,
        reflexionPrompt: "¿Cómo organizarías la evidencia de conformidad en un proyecto real? ¿Usarías carpetas físicas, repositorios digitales, o una combinación?",
        quiz: [
          {
            pregunta: "¿Cuántos tipos de evidencia objetiva se requieren para demostrar conformidad?",
            opciones: ["1 — Solo procesos", "2 — Procesos y Productos", "3 — Procesos, productos y auditoría", "4 — Una por proceso"],
            respuestaCorrecta: 1,
            explicacion: "Se requieren 2 tipos: Evidencia de Procesos (que se ejecutaron) y Evidencia de Productos (que cumplen criterios)."
          },
          {
            pregunta: "¿La documentación de evidencia DEBE estar en carpetas físicas separadas?",
            opciones: ["Sí, siempre", "No, es válido un repositorio digital común", "Solo si el auditor lo exige", "Depende del país"],
            respuestaCorrecta: 1,
            explicacion: "No. La nota explícitamente dice que es válido si se encuentra en un repositorio digital común."
          },
        ],
      },
      {
        titulo: "Definiciones Clave y Taxonomía de la Serie",
        contenido: `### Jerarquía de Perfiles

#### Basic Profile (Perfil Básico)
Perfil diseñado específicamente para VSEs que:
- Desarrollan una única aplicación
- Utilizan un único equipo de trabajo

#### Advanced Profile (Perfil Avanzado)
Perfil orientado a VSEs que buscan:
- Sostenerse, consolidarse y crecer
- Ser un negocio competitivo e independiente
- Expandir capacidades técnicas

#### Base Standard (Estándar Base)
Cualquier norma internacional aprobada (ISO, IEC) que sirva como punto de partida para construir un perfil adaptado.

### Taxonomía de la Serie
La serie completa se estructura como:
1. **Part 2-1**: Framework y taxonomía (actual)
2. **Part 3-1**: Directrices de evaluación
3. **Part 4-1**: Especificaciones de perfil
4. **Part 5-1-x**: Guías de implementación por perfil`,
        reflexionPrompt: "¿En cuál de los 4 perfiles ubicarías a tu equipo o proyecto actual? ¿Qué necesitarías para avanzar al siguiente nivel?",
        quiz: [
          {
            pregunta: "¿Para qué tipo de VSE está diseñado el Perfil Básico?",
            opciones: [
              "VSEs con múltiples productos y equipos",
              "VSEs que desarrollan una única aplicación con un único equipo",
              "Cualquier empresa sin importar tamaño",
              "Solo start-ups de menos de 1 año",
            ],
            respuestaCorrecta: 1,
            explicacion: "El Perfil Básico es para VSEs que desarrollan una única aplicación con un único equipo de trabajo."
          },
          {
            pregunta: "¿Cuántas partes componen la serie ISO/IEC 29110 según la taxonomía?",
            opciones: ["2 partes", "3 partes", "4 partes principales", "6 partes"],
            respuestaCorrecta: 2,
            explicacion: "Son 4 partes principales: 2-1 (Framework), 3-1 (Evaluación), 4-1 (Especificaciones), 5-1-x (Guías por perfil)."
          },
        ],
      },
    ],
  },
];

// Calcula tiempo estimado de lectura
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const getRepositoryUrl = (standardId) => {
  const urls = {
    1: "https://cdn.standards.iteh.ai/samples/82669/53c2b3e0d89b4126aea1556f6bd3c522/ISO-IEC-29110-5-1-2-2025.pdf",
    2: "https://cdn.standards.iteh.ai/samples/67223/21df0b1144634f71a5b5492ea714ce01/ISO-IEC-29110-4-1-2018.pdf",
    3: "https://cdn.standards.iteh.ai/samples/85420/c654ca4e75e747c58171a581d2cc3928/ISO-IEC-29110-5-1-1-2025.pdf",
    4: "https://cdn.standards.iteh.ai/samples/71951/1baf19279080427e8cd5302147c82019/ISO-IEC-TR-29110-3-1-2020.pdf",
    5: "https://cdn.standards.iteh.ai/samples/62712/4aba361ac34140b28b599f07f2b87ebb/ISO-IEC-29110-2-1-2015.pdf"
  };
  return urls[standardId] || "#";
};

export default standardsData;
