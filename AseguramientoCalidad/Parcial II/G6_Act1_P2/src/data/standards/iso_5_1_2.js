export const iso_5_1_2 = {
  id: 1,
  titulo: "ISO/IEC 29110-5-1-2:2025",
  subtitulo: "Referencia en imagen: ISO/IEC 29110 - 5-1-2",
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
- **Muy Pequeñas Entidades (VSEs)**: Organizaciones, departamentos o proyectos de hasta **25 personas** involucradas en el desarrollo de software.
- **Estructura del Equipo**: Diseñado específicamente para un **único equipo de trabajo** que desarrolla un **único producto de software** a la vez.
- **Empresas en crecimiento**: Ideal para organizaciones que necesitan formalizar sus procesos de desarrollo y gestión sin incurrir en la burocracia de normas más pesadas como ISO 12207 o modelos como CMMI.

### Restricción de Seguridad Crítica
- **No aplica** para el desarrollo de **software crítico para la seguridad** (safety-critical software). Ejemplos: software médico de soporte vital, sistemas de control de vuelo, piloto automático automotriz, control de reactores nucleares. Estos sistemas requieren normas mucho más rigurosas de seguridad y redundancia.

### ¿Por qué existe un límite de 25 personas?
El límite de 25 personas responde a que las micro y pequeñas empresas representan más del 85% de la industria del software a nivel mundial. Estas organizaciones no disponen del presupuesto, el personal ni el tiempo para aplicar metodologías de calidad tradicionales. El Perfil Básico les permite alcanzar la certificación internacional mediante procesos ágiles, flexibles y optimizados para su tamaño.`,
      reflexionPrompt: "¿Tu empresa o proyecto universitario califica como VSE? ¿Qué beneficios concretos crees que traería implementar este perfil en tu entorno actual?",
      recursos: {
        videoUrl: "https://www.youtube.com/embed/7hRl3fBL8Es",
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
          explicacion: "Una VSE (Very Small Entity) se define formalmente como una organización, departamento o proyecto de hasta 25 personas involucradas en el desarrollo de software."
        },
        {
          pregunta: "¿Para qué tipo de software NO aplica el Perfil Básico de la norma?",
          opciones: ["Software de gestión de inventario", "Aplicaciones móviles", "Software crítico para la seguridad (safety-critical)", "Sistemas de comercio electrónico"],
          respuestaCorrecta: 2,
          explicacion: "La norma excluye explícitamente el software safety-critical (crítico para la seguridad), ya que este requiere estándares especializados debido al riesgo humano implicado."
        },
        {
          pregunta: "¿Cuál es la principal justificación para el desarrollo de la norma ISO/IEC 29110?",
          opciones: ["Reemplazar a la norma ISO 9001", "Facilitar a las VSEs la adopción de estándares de calidad sin burocracia excesiva", "Obligar a usar metodologías en cascada", "Desaparecer las metodologías ágiles de la industria"],
          respuestaCorrecta: 1,
          explicacion: "La norma fue creada para ofrecer un marco de trabajo de ingeniería de software simplificado y adaptable, que permita a las microempresas certificar su calidad sin colapsar por costos u papeleo."
        },
        {
          pregunta: "¿A qué tipo de estructura de proyecto está limitado el Perfil Básico?",
          opciones: ["Múltiples equipos en múltiples sedes", "Un único equipo de trabajo desarrollando un único producto", "Proyectos de desarrollo open source sin clientes", "Proyectos con presupuestos superiores al millón de dólares"],
          respuestaCorrecta: 1,
          explicacion: "El Perfil Básico está enfocado en VSEs que operan con un único equipo de trabajo que construye un único producto de software a la vez."
        }
      ],
    },
    {
      titulo: "Procesos Nucleares",
      contenido: `El Perfil Básico establece dos procesos nucleares interconectados que forman el núcleo del desarrollo de software:

### A. Gestión de Proyectos (Project Management - PM)
**Propósito:** Planificar, ejecutar, monitorear y cerrar sistemáticamente las tareas de un proyecto de software para cumplir con el alcance, la calidad, el tiempo y los costos acordados con el cliente.
- **Planificación**: Estimar el esfuerzo, costo y cronograma. Definir las tareas y asignar los recursos del equipo de trabajo.
- **Ejecución y Control**: Monitorear el avance del proyecto, identificar y gestionar riesgos de forma continua, registrar solicitudes de cambio y tomar acciones correctivas ante cualquier desviación.
- **Cierre del Proyecto**: Entregar el producto formalmente, obtener la aceptación del cliente y documentar las lecciones aprendidas (retrospectiva).

### B. Implementación de Software (Software Implementation - SI)
**Propósito:** Ejecutar un proceso técnico sistemático para el análisis, diseño, construcción, pruebas y entrega del producto de software conforme a los requisitos del cliente.
- **Análisis de Requisitos**: Capturar y especificar las necesidades del cliente en una Especificación de Requisitos de Software (SRS) detallada.
- **Diseño**: Desarrollar la arquitectura del sistema y el diseño detallado de los componentes de software.
- **Construcción**: Programar el código fuente y realizar pruebas unitarias para garantizar el correcto funcionamiento de cada fragmento de código.
- **Integración y Pruebas**: Integrar los módulos y realizar pruebas de integración y del sistema para asegurar la cohesión y la ausencia de defectos críticos.
- **Despliegue y Entrega**: Entregar el software junto con manuales de usuario y de operación y brindar soporte de transición inicial.

### Interconexión PM ↔ SI
El proceso PM proporciona el Plan de Proyecto y el documento de requisitos (SRS) inicial al proceso SI. A su vez, el proceso SI proporciona reportes de avance, entregables verificados y el producto final al proceso PM para su control y posterior entrega al cliente.`,
      reflexionPrompt: "¿Cómo se relacionan PM y SI en tu experiencia? ¿Qué ocurre en un proyecto de software cuando se descuida uno de estos dos procesos nucleares?",
      quiz: [
        {
          pregunta: "¿Cuál es el propósito principal del proceso PM (Gestión de Proyectos)?",
          opciones: [
            "Programar las interfaces de usuario",
            "Planificar, ejecutar y controlar tareas para cumplir alcance, calidad, tiempo y costo",
            "Realizar las pruebas unitarias del código fuente",
            "Definir la arquitectura de la base de datos"
          ],
          respuestaCorrecta: 1,
          explicacion: "El propósito de PM es la planeación y el control administrativo del proyecto para asegurar el cumplimiento de las metas de costo, tiempo y calidad contractuales."
        },
        {
          pregunta: "¿Qué actividades componen el ciclo de vida del proceso de Implementación de Software (SI)?",
          opciones: [
            "Vender el producto, marketing y soporte telefónico",
            "Análisis de requisitos, diseño, construcción, integración/pruebas y entrega",
            "Auditoría contable y gestión de recursos humanos",
            "Instalación de hardware y soporte de redes de datos"
          ],
          respuestaCorrecta: 1,
          explicacion: "El proceso SI abarca todo el ciclo de desarrollo técnico: desde la captura de requisitos, el diseño y la codificación, hasta las pruebas y la entrega del software."
        },
        {
          pregunta: "¿Qué artefacto clave es entregado por PM para dar inicio formal a las actividades técnicas de SI?",
          opciones: [
            "El código fuente compilado",
            "El Plan de Proyecto aprobado",
            "El manual de usuario final",
            "El reporte de cobertura de pruebas"
          ],
          respuestaCorrecta: 1,
          explicacion: "El Plan de Proyecto (Project Plan) desarrollado por el PM provee el cronograma, la asignación de roles y las directrices que el equipo técnico en SI debe seguir."
        },
        {
          pregunta: "¿Qué se debe documentar obligatoriamente al finalizar el proceso PM (cierre)?",
          opciones: [
            "El manual de instalación del servidor",
            "Las lecciones aprendidas / retrospectiva y el acta de aceptación firmada",
            "La arquitectura detallada de clases",
            "El diseño de base de datos relacional"
          ],
          respuestaCorrecta: 1,
          explicacion: "El cierre del proyecto exige obtener el visto bueno formal del cliente (aceptación) y documentar las lecciones aprendidas para mejorar los procesos en proyectos futuros."
        }
      ],
    },
    {
      titulo: "Nuevos Componentes (Anexos 2025)",
      contenido: `La edición 2025 incorpora cinco nuevos Anexos normativos y descriptivos que actualizan la norma al desarrollo de software contemporáneo:

### Anexo A: Proceso de Soporte de Software (Software Support)
Define directrices operativas para las actividades posteriores a la entrega del producto.
- Gestión de incidencias (bugs) reportadas por usuarios.
- Implementación de mantenimientos correctivos y evolutivos menores.
- Acuerdos de nivel de servicio (SLA) mínimos para atención al cliente.

### Anexo B: Pruebas de Software Ampliadas (Software Testing)
Establece prácticas más formales para el aseguramiento de la calidad, alineadas con la familia ISO/IEC/IEEE 29119.
- Estrategias para pruebas unitarias, de integración y de sistema.
- Diseño de casos de prueba basados en especificaciones (caja negra) y en estructura (caja blanca).
- Gestión de entornos y datos de prueba.

### Anexo C: Accesibilidad (Accessibility)
Introduce directrices para asegurar que el software sea utilizable por el mayor rango de personas posible, incluyendo aquellas con discapacidades.
- Adopción de pautas WCAG (Web Content Accessibility Guidelines).
- Compatibilidad con tecnologías asistivas (como lectores de pantalla).
- Diseño centrado en el contraste de colores, navegación por teclado y etiquetas aria descriptivas.

### Anexo D: Seguridad Informática (Information Security)
Incorpora salvaguardas técnicas básicas para proteger los activos de información del proyecto y del software.
- Principios de confidencialidad, integridad y disponibilidad de los datos.
- Prácticas de programación segura (prevención de inyecciones SQL, XSS, etc., basadas en OWASP).
- Gestión de accesos, credenciales y cifrado de datos sensibles.

### Anexo E: Paquetes de Despliegue (Deployment Packages)
Los paquetes de despliegue son el recurso de transferencia de tecnología más importante de la norma.
- Son guías prácticas con plantillas de documentos precargadas (ej. plantilla de SRS, plantilla de plan de pruebas).
- Proporcionan descripciones detalladas de tareas, metodologías y ejemplos reales.
- Diseñados para que una VSE pueda implementar la norma de inmediato sin requerir consultores externos costosos.`,
      reflexionPrompt: "¿Cuál de los 5 nuevos anexos consideras más crítico en los proyectos que desarrollas actualmente? ¿Por qué?",
      quiz: [
        {
          pregunta: "Q1",
          pregunta: "¿En qué estándar internacional se basan las directrices del Anexo B (Pruebas Ampliadas)?",
          opciones: ["CMMI Nivel 5", "ISO/IEC/IEEE 29119", "ISO 9001", "IEEE 830"],
          respuestaCorrecta: 1,
          explicacion: "El Anexo B está alineado con la norma internacional de pruebas de software ISO/IEC/IEEE 29119, adaptando sus mejores prácticas para equipos pequeños."
        },
        {
          pregunta: "¿Qué es un Paquete de Despliegue (Deployment Package) según el Anexo E?",
          opciones: [
            "Un archivo zip con el código compilado para producción",
            "Una guía práctica con plantillas y ejemplos detallados para facilitar la implementación del estándar",
            "Un servicio en la nube provisto por la ISO",
            "Un instalador automático de bases de datos"
          ],
          respuestaCorrecta: 1,
          explicacion: "Los Paquetes de Despliegue son conjuntos de metodologías, plantillas de documentos y guías paso a paso diseñados para que las VSEs adopten el estándar de forma autodidacta."
        },
        {
          pregunta: "¿Qué aspecto del desarrollo aborda el Anexo C de la edición 2025?",
          opciones: [
            "El rendimiento de la base de datos",
            "La accesibilidad del software para personas con discapacidades",
            "El presupuesto financiero del proyecto",
            "El control de versiones del código"
          ],
          respuestaCorrecta: 2,
          explicacion: "El Anexo C promueve la accesibilidad, guiando el diseño de software inclusivo que respete las pautas WCAG para usuarios con capacidades diversas."
        },
        {
          pregunta: "¿Cuál es el enfoque principal del Anexo D (Seguridad Informática)?",
          opciones: [
            "Optimizar el motor de renderizado CSS",
            "Proteger la confidencialidad, integridad y disponibilidad del sistema y los datos",
            "Automatizar las copias de seguridad en cinta magnética",
            "Definir el salario de los programadores"
          ],
          respuestaCorrecta: 1,
          explicacion: "El Anexo D busca blindar el software contra vulnerabilidades comunes, aplicando principios de programación segura e implementando la tríada de seguridad de la información (CIA)."
        }
      ],
    },
    {
      titulo: "Conceptos Operativos Importantes",
      contenido: `Para aplicar con éxito el Perfil Básico, es indispensable dominar sus principios operativos fundamentales:

### A. Independencia de Herramientas y Metodologías
La norma es **estrictamente agnóstica** a nivel tecnológico y metodológico.
- **Metodología**: El equipo puede usar cascada, desarrollo iterativo, incremental, Scrum, Kanban o XP.
- **Herramientas**: Se puede usar cualquier software de soporte (Jira, Trello, Git, SVN, MS Project, hojas de cálculo, Notion, etc.). La norma no prescribe tecnologías.

### B. Flexibilidad de Roles
En una VSE no existe la capacidad para contratar a una persona por cada rol. Por ello, la norma establece que:
- **Multirrol**: Un único miembro del equipo puede asumir múltiples roles (ej. el Project Manager también puede ser Analista).
- **Rol Compartido**: Un solo rol puede ser compartido por varios miembros del equipo (ej. dos desarrolladores comparten el rol de Diseñador).
- **Asignación**: Lo crítico es que todos los roles definidos por la norma (PM, Analista, Diseñador, Programador, Tester) estén asignados y las personas conozcan sus responsabilidades.

### C. Líneas Base (Baselines)
Una Línea Base es un conjunto de especificaciones o entregables aprobados formalmente que sirven como base para el desarrollo posterior, y que solo pueden modificarse mediante un proceso formal de control de cambios.
- **Propósito**: Evitar el crecimiento descontrolado del alcance (scope creep) y asegurar la estabilidad técnica.
- **Ejemplos clave**: Línea Base de Requisitos (SRS firmada por el cliente), Línea Base de Diseño, Línea Base del Código.

### D. Tareas Condicionales
Reemplazan el confuso término de \"tareas opcionales\". Son actividades que se deben ejecutar **únicamente si** el cliente las solicita de forma explícitamente en el acuerdo de proyecto.
- **Ejemplo**: La creación de documentación de usuario final detallada o la migración de datos históricos de un sistema legacy. Si el cliente no lo solicita ni financia, el equipo no está obligado a hacerlo para cumplir con el estándar.`,
      reflexionPrompt: "¿Cómo manejas actualmente el control de cambios en tus proyectos? ¿Crees que la flexibilidad de roles ayuda o dificulta la organización del equipo?",
      recursos: {
        videoUrl: "https://www.youtube.com/embed/6fPheibXugY",
        videoTitle: "ISO/IEC 29110-5-1-2:2025 Masterclass",
      },
      quiz: [
        {
          pregunta: "¿Qué es una Línea Base (Baseline) en este estándar?",
          opciones: [
            "La primera línea de código escrita en el proyecto",
            "Un conjunto de entregables aprobados formalmente que solo pueden cambiarse mediante un proceso controlado",
            "El presupuesto mínimo requerido para iniciar el proyecto",
            "La velocidad promedio de desarrollo del equipo"
          ],
          respuestaCorrecta: 1,
          explicacion: "Una Línea Base es un elemento de configuración o documento formalmente aprobado y congelado que sirve como punto de partida técnico y requiere aprobación para su modificación."
        },
        {
          pregunta: "¿Cómo gestiona la norma la asignación de roles en equipos pequeños?",
          opciones: [
            "Exige contratar una persona especializada por cada rol",
            "Permite que una persona asuma múltiples roles o que un rol se comparta",
            "Obliga a que el Project Manager haga todo el trabajo técnico",
            "Prohíbe a los programadores interactuar con el cliente"
          ],
          respuestaCorrecta: 1,
          explicacion: "La norma es muy flexible: permite la multitarea de roles y el reparto de responsabilidades para adaptarse al tamaño real de equipos pequeños."
        },
        {
          pregunta: "¿Qué significa que la norma sea 'agnóstica a herramientas y metodologías'?",
          opciones: [
            "Que prohíbe el uso de metodologías ágiles",
            "Que el equipo tiene la libertad de elegir sus propios lenguajes, herramientas y marcos de trabajo (ágil o tradicional)",
            "Que solo funciona con software propietario",
            "Que obliga a documentar cada línea de código a mano"
          ],
          respuestaCorrecta: 1,
          explicacion: "Agnóstica a herramientas significa que no impone tecnologías ni metodologías concretas, permitiendo al equipo trabajar con su stack y marco preferido (ej. Scrum)."
        },
        {
          pregunta: "¿Qué caracteriza a una 'Tarea Condicional' en la norma?",
          opciones: [
            "Es una tarea opcional que el programador decide si hacer o no",
            "Es una tarea obligatoria solo si el cliente la solicita explícitamente en el contrato",
            "Es una tarea que se ejecuta únicamente si ocurre un error grave",
            "Es una tarea que se delega a un consultor externo"
          ],
          respuestaCorrecta: 1,
          explicacion: "Las tareas condicionales se ejecutan si y solo si están estipuladas contractualmente por el cliente, lo que previene que la VSE realice trabajo no remunerado."
        }
      ],
    },
  ],
};
