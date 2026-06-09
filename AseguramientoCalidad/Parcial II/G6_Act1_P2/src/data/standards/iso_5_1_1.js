export const iso_5_1_1 = {
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
      contenido: `ISO/IEC 29110-5-1-1:2025 describe el **Perfil de Entrada** (Entry Profile), que representa el primer peldaño en la hoja de ruta de calidad de la norma para microempresas de software.

### Población Objetivo
- **Start-ups**: Empresas de reciente creación (típicamente menos de 3 años de operación) que necesitan establecer disciplina operativa básica sin frenar su velocidad de innovación.
- **Proyectos Pequeños**: Proyectos con un tamaño estimado menor a **6 personas-mes** de esfuerzo de desarrollo.
- **Micro-equipos**: Pequeñas entidades compuestas por 1 a 5 personas involucradas en el desarrollo.

### Posición en la Hoja de Ruta de Calidad
La serie ISO 29110 define cuatro perfiles progresivos que permiten a las empresas crecer en madurez de forma escalonada:
1. **Entry (Entrada)**: Enfocado en la supervivencia del negocio y finalización exitosa de proyectos pequeños.
2. **Basic (Básico)**: Para VSEs con un único equipo que desarrolla un único producto a la vez.
3. **Intermediate (Intermedio)**: Para VSEs con múltiples proyectos y equipos en paralelo.
4. **Advanced (Avanzado)**: Enfocado en la consolidación del negocio, competitividad, crecimiento e independencia tecnológica.

### Restricciones de Seguridad
Al igual que el Perfil Básico, el Perfil de Entrada **no es aplicable** bajo ninguna circunstancia para el desarrollo de software crítico para la seguridad (safety-critical).`,
      reflexionPrompt: "Si fueras a fundar una start-up de software con 2 amigos, ¿comenzarías aplicando el Perfil de Entrada o irías directo al Perfil Básico? Justifica tu respuesta.",
      recursos: {
        links: [
          { titulo: "ISO/IEC 29110-5-1-1:2025 - Catálogo ISO", url: "https://www.iso.org/standard/85420.html" }
        ]
      },
      quiz: [
        {
          pregunta: "¿Para qué tamaño de proyecto está diseñado específicamente el Perfil de Entrada?",
          opciones: ["Proyectos de más de 100 personas-mes", "Proyectos de menos de 6 personas-mes", "Proyectos de 12 a 24 personas-mes", "Cualquier tamaño de proyecto"],
          respuestaCorrecta: 1,
          explicacion: "El Perfil de Entrada se enfoca en proyectos pequeños de software de tamaño menor a 6 personas-mes de esfuerzo."
        },
        {
          pregunta: "¿Cuál es el orden progresivo de los 4 perfiles en la hoja de ruta de la ISO/IEC 29110?",
          opciones: [
            "Basic, Entry, Intermediate, Advanced",
            "Entry, Basic, Intermediate, Advanced",
            "Entry, Intermediate, Basic, Advanced",
            "Basic, Intermediate, Advanced, Expert"
          ],
          respuestaCorrecta: 1,
          explicacion: "La ruta de madurez inicia en el Perfil de Entrada (Entry), progresa al Básico (Basic), luego al Intermedio (Intermediate) y culmina en el Avanzado (Advanced)."
        },
        {
          pregunta: "¿Qué tipo de organizaciones son la población objetivo principal del Perfil de Entrada?",
          opciones: [
            "Bancos multinacionales con grandes departamentos de TI",
            "Start-ups y micro-equipos de desarrollo de hasta 5 personas",
            "Empresas gubernamentales de defensa militar",
            "Consultoras internacionales de auditoría de seguridad"
          ],
          respuestaCorrecta: 1,
          explicacion: "El perfil de Entrada está diseñado a la medida de micro-organizaciones de 1 a 5 personas y empresas emergentes (start-ups) que necesitan orden inicial."
        },
        {
          pregunta: "¿Se puede aplicar el Perfil de Entrada para software crítico en aviación?",
          opciones: [
            "Sí, siempre que el proyecto sea menor a 6 personas-mes",
            "No, está excluido debido a las altas exigencias de seguridad de los sistemas críticos",
            "Solo si el cliente firma una carta de exención de responsabilidad",
            "Solo si se trabaja con metodologías tradicionales"
          ],
          respuestaCorrecta: 1,
          explicacion: "Ninguno de los perfiles Entry o Basic aplica para software de seguridad crítica (safety-critical), el cual requiere normas rigurosas como DO-178C o ISO 26262."
        }
      ],
    },
    {
      titulo: "Estructura de Procesos del Perfil de Entrada",
      contenido: `El Perfil de Entrada simplifica drásticamente el conjunto de tareas y documentación requerida para minimizar la sobrecarga administrativa sobre micro-equipos de trabajo:

### A. Gestión de Proyectos (Project Management - PM) en Entry Profile
El propósito de PM en este perfil se limita a proveer visibilidad básica sobre el avance del proyecto y acordar compromisos alcanzables con el cliente.
- **Planificación Simplificada**: Consiste en un cronograma sencillo de actividades con fechas estimadas de entrega, asignación de responsables y un presupuesto básico. No se exige un plan de gestión formal de 50 páginas.
- **Gestión de Riesgos Mínima**: Se limita a identificar y listar en el plan de proyecto los riesgos más obvios y críticos (ej. caída de servidores o pérdida de un programador), con una acción de mitigación directa para cada uno.
- **Control de Avance**: Monitoreo informal basado en comunicación constante con el equipo, permitiendo ajustes rápidos sin requerir reportes de estado altamente estructurados.
- **Repositorio**: Un repositorio digital único donde se guarden todos los archivos técnicos y administrativos importantes de manera ordenada.

### B. Implementación de Software (Software Implementation - SI) en Entry Profile
El proceso SI se enfoca en asegurar la calidad del producto final y la satisfacción de los requisitos del cliente.
- **Requisitos**: Capturar y redactar las necesidades del cliente en una lista de requisitos acordada o en un backlog de historias de usuario simple.
- **Construcción y Pruebas**: Codificación limpia acompañada obligatoriamente de pruebas de aceptación del software antes de entregarlo. No se exige documentar diagramas de diseño arquitectónico complejos ni patrones de software exhaustivos si la escala del producto no lo amerita.
- **Entrega**: Puesta en marcha inicial y firma de conformidad básica por parte del cliente.`,
      reflexionPrompt: "¿Cómo organizarías el repositorio digital de un proyecto de Entrada para cumplir con la norma usando herramientas gratuitas?",
      quiz: [
        {
          pregunta: "¿En qué se diferencia principalmente la Gestión de Proyectos (PM) en el Perfil de Entrada respecto al Perfil Básico?",
          opciones: [
            "No existe el proceso PM en el Perfil de Entrada",
            "Es mucho más simple y ligera, enfocada en un cronograma y una lista de riesgos básica en vez de planes formales y detallados",
            "Es más compleja e introduce comités de control de cambios corporativos",
            "Exige certificar a todos los miembros en metodologías PMP"
          ],
          respuestaCorrecta: 1,
          explicacion: "El Perfil de Entrada reduce drásticamente el papeleo de PM, limitándose a una planeación ágil y sencilla con un control de riesgos directo."
        },
        {
          pregunta: "¿Qué nivel de documentación de diseño arquitectónico exige el proceso SI en el Perfil de Entrada?",
          opciones: [
            "Se exigen diagramas UML detallados de cada clase del sistema",
            "No impone una documentación de arquitectura exhaustiva si la naturaleza del software es muy sencilla",
            "Prohíbe realizar cualquier tipo de diseño técnico previo",
            "Exige contratar a un arquitecto de software externo certificado"
          ],
          respuestaCorrecta: 1,
          explicacion: "En el Perfil de Entrada la prioridad es la entrega rápida de valor. Si bien se recomienda el diseño lógico, no hay exigencias burocráticas de documentación de arquitectura detallada si el sistema es pequeño."
        },
        {
          pregunta: "¿Dónde deben almacenarse todos los productos de trabajo generados en el Perfil de Entrada?",
          opciones: [
            "En las computadoras personales de los desarrolladores sin respaldo",
            "En un repositorio digital común y organizado para el proyecto",
            "En el servidor web de la ISO",
            "Únicamente en carpetas físicas impresas en papel"
          ],
          respuestaCorrecta: 1,
          explicacion: "Toda la documentación y código debe reposar en un repositorio estructurado y común (como GitHub, GitLab o Google Drive del equipo) para garantizar la continuidad y control del proyecto."
        },
        {
          pregunta: "¿Qué tipo de pruebas son indispensables de realizar en el proceso SI del Perfil de Entrada?",
          opciones: [
            "Únicamente pruebas automáticas en servidores de integración continua",
            "Pruebas de aceptación del software para asegurar la conformidad de los entregables antes de la entrega formal",
            "Pruebas de carga con simuladores de un millón de usuarios",
            "No se requieren pruebas de ningún tipo"
          ],
          respuestaCorrecta: 1,
          explicacion: "Se debe realizar al menos la verificación y pruebas de aceptación para asegurar que el sistema cumple con los requisitos mínimos pactados antes de transferirlo al cliente."
        }
      ],
    },
    {
      titulo: "Convenciones y Conceptos Operativos",
      contenido: `El Perfil de Entrada comparte la filosofía del Perfil Básico pero maximiza la adaptabilidad para start-ups:

### A. Tareas Condicionales (Conditional Tasks)
- Las tareas condicionales son aquellas que el equipo de desarrollo debe realizar **únicamente si** el acuerdo o contrato con el cliente lo estipula expresamente.
- **Ejemplo**: Escribir un manual de usuario interactivo en formato PDF o migrar la información de una base de datos antigua a la nueva. Si el cliente no lo solicita ni financia, el equipo no lo ejecuta, ahorrando costos clave para una micro-empresa.

### B. Líneas Base (Baselines) en Entry Profile
A pesar de ser un perfil ágil, el equipo de Entrada debe congelar y establecer líneas base en hitos críticos:
- **Línea Base de Requisitos**: Congelar los requisitos acordados inicialmente con el cliente antes de empezar a programar. Esto evita discusiones sobre el alcance del Producto Mínimo Viable (MVP).
- **Control de Cambios Simplificado**: Si el cliente quiere añadir características, se analiza el impacto en fechas y costos de forma rápida, se firma un anexo y se actualiza la línea base.

### C. Flexibilidad de Roles e Independencia
- **Roles**: Es sumamente común que una sola persona asuma la totalidad de los roles (ej. un solo desarrollador que actúa como PM, Analista, Diseñador, Programador y Tester). La norma lo permite explícitamente.
- **Stack Tecnológico**: Libertad absoluta de utilizar cualquier lenguaje (Python, JS, C#), base de datos o herramientas de gestión (Notion, Trello, Excel, Git).`,
      reflexionPrompt: "¿Cómo impactaría la definición estricta de 'Líneas Base' y 'Tareas Condicionales' en la rentabilidad de una start-up que trabaja con presupuestos muy ajustados?",
      quiz: [
        {
          pregunta: "¿Quién define si una Tarea Condicional debe ejecutarse en el proyecto?",
          opciones: [
            "El programador de forma unilateral",
            "El acuerdo o contrato formal establecido con el cliente",
            "El auditor de la ISO durante la certificación",
            "El gobierno de forma obligatoria"
          ],
          respuestaCorrecta: 1,
          explicacion: "Las tareas condicionales son vinculantes solo si el cliente las requiere explícitamente en el acuerdo inicial de proyecto."
        },
        {
          pregunta: "¿Qué beneficio tiene establecer una Línea Base de Requisitos en una start-up?",
          opciones: [
            "Hace imposible realizar cualquier cambio en el software",
            "Protege a la start-up contra solicitudes de cambios constantes del cliente que no estén presupuestadas",
            "Duplica la velocidad de renderizado del código",
            "Permite no documentar el código fuente"
          ],
          respuestaCorrecta: 1,
          explicacion: "La Línea Base de Requisitos delimita qué incluye el producto y qué no, permitiendo cobrar de forma justa cualquier ampliación de alcance que solicite el cliente."
        },
        {
          pregunta: "¿Cuál es el límite mínimo de integrantes para aplicar el Perfil de Entrada?",
          opciones: ["Mínimo 5 personas", "Mínimo 1 persona", "Mínimo 10 personas", "No se puede aplicar con menos de 3 personas"],
          respuestaCorrecta: 1,
          explicacion: "El perfil de Entrada es tan flexible que puede ser implementado por un único desarrollador independiente que asuma todos los roles definidos."
        },
        {
          pregunta: "¿Qué herramientas de software exige instalar la norma para el Perfil de Entrada?",
          opciones: [
            "Herramientas de software libre únicamente",
            "Ninguna herramienta en particular; el equipo es libre de elegir su propio stack tecnológico y de gestión",
            "Software licenciado por la organización ISO",
            "Únicamente bases de datos NoSQL"
          ],
          respuestaCorrecta: 1,
          explicacion: "La norma respeta la autonomía de la VSE, por lo que no prescribe ninguna herramienta ni stack tecnológico específico."
        }
      ],
    },
    {
      titulo: "Edición 2025 — Cambios Principales",
      contenido: `La edición **ISO/IEC 29110-5-1-1:2025** representa una evolución tecnológica y práctica significativa frente a la edición original de 2012:

### ¿Por qué se actualizó el Perfil de Entrada en 2025?
La versión de 2012 fue diseñada en un contexto donde el desarrollo web y móvil aún no dominaban la industria por completo y las metodologías ágiles no eran el estándar absoluto de facto. Tras 13 años de retroalimentación internacional, la ISO rediseñó el perfil.

### Cambios Clave Introducidos en 2025
- **Simplificación y Agilización del Lenguaje**: Se eliminó la jerga corporativa compleja y se reescribieron las tareas de forma directa y fácil de digerir para programadores jóvenes o emprendedores.
- **Eliminación de Artefactos Obsoletos**: Se retiraron documentos y formatos duplicados que generaban burocracia inútil para equipos de 2 o 3 personas.
- **Introducción del concepto de 'Tareas Condicionales'**: Reemplazando las 'tareas opcionales' de la edición 2012 para blindar contractualmente a las VSEs ante requerimientos imprevistos de clientes.
- **Alineación con la Nube y SaaS**: Integración de conceptos de despliegue continuo en la nube y arquitecturas modernas basadas en microservicios y APIs.`,
      reflexionPrompt: "¿Qué opinas de la decisión de la ISO de eliminar documentación obsoleta para favorecer la agilidad? ¿Conoces estándares que sigan siendo demasiado burocráticos?",
      quiz: [
        {
          pregunta: "¿Qué versión previa sustituye por completo la nueva edición ISO/IEC 29110-5-1-1:2025?",
          opciones: ["La edición 2008", "La edición 2010", "La edición 2012", "La edición 2018"],
          respuestaCorrecta: 2,
          explicacion: "La nueva edición de 2025 reemplaza en su totalidad al reporte técnico original del Perfil de Entrada publicado en el año 2012."
        },
        {
          pregunta: "¿Cuál fue uno de los principales objetivos del rediseño en la edición 2025?",
          opciones: [
            "Añadir más plantillas de documentos obligatorios",
            "Hacer el estándar más ágil, eliminando artefactos redundantes y facilitando la adopción en micro-equipos modernos",
            "Forzar la compra de licencias de software propietario",
            "Hacer obligatoria la programación en lenguaje C++"
          ],
          respuestaCorrecta: 1,
          explicacion: "La edición 2025 responde a la necesidad de agilidad de la industria, eliminando entregables redundantes y simplificando el lenguaje para start-ups."
        },
        {
          pregunta: "¿Cómo afectó la edición 2025 a la descripción de tareas técnicas?",
          opciones: [
            "Las hizo más extensas e incorporó formalismos matemáticos",
            "Fueron reescritas con un lenguaje simplificado, directo y compatible con metodologías ágiles",
            "Las eliminó por completo, dejando solo directrices de administración",
            "Las unificó con la ingeniería de hardware aeronáutico"
          ],
          respuestaCorrecta: 1,
          explicacion: "Las tareas se reescribieron para ser claras e intuitivas para desarrolladores de software reales, eliminando burocracia académica innecesaria."
        },
        {
          pregunta: "¿Qué término fue reemplazado en la edición 2025 para evitar malentendidos contractuales sobre el alcance?",
          opciones: [
            "El término 'Requisitos Funcionales'",
            "El término 'Tareas Opcionales' por el de 'Tareas Condicionales'",
            "El término 'Código de Software'",
            "El término 'Project Manager'"
          ],
          respuestaCorrecta: 1,
          explicacion: "El término 'tareas opcionales' fue sustituido por 'tareas condicionales' en 2025, dejando claro que solo se ejecutan bajo condiciones contractuales específicas con el cliente."
        }
      ],
    },
  ],
};
