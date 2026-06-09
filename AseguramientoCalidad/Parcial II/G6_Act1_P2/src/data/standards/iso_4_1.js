export const iso_4_1 = {
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
      contenido: `ISO/IEC 29110-4-1:2018 es una norma de carácter internacional de tipo **Especificación** (Specification). A diferencia de las directrices (Part 5), este documento define los requisitos formales que una VSE debe cumplir para declarar conformidad legal con la norma.

### ¿Quién puede declarar conformidad?
- **VSEs de Software**: Organizaciones o proyectos de hasta 25 personas que desarrollan software.
- **Conformidad por Proyecto u Organización**: La declaración puede aplicar a toda la empresa o limitarse a un proyecto de software específico dentro de una organización grande.
- **Metodologías**: La conformidad es independiente de si la empresa usa ciclos de vida tradicionales (Cascada) o modernos (Ágiles).

### Exclusiones Críticas del Campo de Conformidad
La norma especifica que **no se puede declarar conformidad** para la creación de:
- **Herramientas de software** (ej. un software de gestión de incidencias no puede certificarse a sí mismo como conforme, pues la conformidad aplica al proceso de desarrollo, no al software).
- **Ayudas de aprendizaje y cursos** (ej. un material de formación sobre ISO 29110 no es certificable).
- **Plantillas y documentos de soporte**.

### La regla del \"Shall\" (Deberá)
Todos los requisitos obligatorios dentro de este estándar están redactados con el verbo auxiliar **\"shall\"** (en español traducido como **deberá**). Si un requisito contiene un \"shall\", su cumplimiento es estricto y mandatorio para lograr la conformidad. Las sugerencias y buenas prácticas no vinculantes utilizan \"should\" (debería).`,
      reflexionPrompt: "¿Por qué crees que los auditores hacen tanto énfasis en la diferencia entre 'shall' (deberá) y 'should' (debería)? ¿Qué problemas de cumplimiento evita esto?",
      recursos: {
        links: [
          { titulo: "ISO/IEC 29110-4-1:2018 - Tienda Oficial ISO", url: "https://www.iso.org/standard/67223.html" }
        ]
      },
      quiz: [
        {
          pregunta: "¿Qué tipo de verbo auxiliar se utiliza para indicar requisitos obligatorios en la norma?",
          options: ["Should (Debería)", "May (Podrá)", "Shall (Deberá)", "Must (Tiene que)"],
          opciones: ["Should (Debería)", "May (Podrá)", "Shall (Deberá)", "Must (Tiene que)"],
          respuestaCorrecta: 2,
          explicacion: "En las normas ISO, la palabra 'shall' (deberá) indica un requisito estrictamente obligatorio e indispensable para la conformidad."
        },
        {
          pregunta: "¿Qué producto o servicio está excluido de declarar conformidad con esta norma?",
          opciones: [
            "El desarrollo de una aplicación web personalizada para un cliente",
            "Una herramienta de software o un curso didáctico sobre la norma",
            "Un proyecto de desarrollo móvil con 5 programadores",
            "Un departamento de TI interno con 15 personas"
          ],
          respuestaCorrecta: 1,
          explicacion: "Las herramientas, cursos, plantillas y ayudas de aprendizaje están explícitamente excluidos de la declaración de conformidad."
        },
        {
          pregunta: "¿Puede declararse conformidad para un único proyecto de desarrollo dentro de una gran empresa?",
          opciones: [
            "No, toda la empresa debe certificarse sin excepción",
            "Sí, la conformidad puede declararse para un proyecto específico o equipo delimitado",
            "Solo si el proyecto dura más de 5 años",
            "Solo si el cliente es una entidad gubernamental"
          ],
          respuestaCorrecta: 1,
          explicacion: "Sí, es posible declarar conformidad y certificar un proyecto de software específico desarrollado por un subequipo que cumpla con el perfil de VSE."
        },
        {
          pregunta: "¿Qué diferencia a una norma de especificación (como la 4-1) de una guía de ingeniería (como la 5-1-2)?",
          opciones: [
            "La especificación contiene los requisitos mandatorios de conformidad, mientras que la guía enseña el 'cómo' implementarlos operativamente",
            "La especificación solo contiene diagramas de flujo sin texto",
            "La especificación es para hardware y la guía es para software",
            "La especificación es opcional y la guía es obligatoria"
          ],
          respuestaCorrecta: 0,
          explicacion: "La Parte 4-1 es la especificación formal que contiene los requisitos obligatorios de cumplimiento ('Shall'), y la Parte 5-1-x es el reporte técnico que sirve como guía didáctica e ilustrativa de implementación."
        }
      ],
    },
    {
      titulo: "Condiciones Mínimas para el Uso del Perfil Básico",
      contenido: `El estándar establece que antes de que una VSE intente aplicar el Perfil Básico y buscar su conformidad, se deben cumplir obligatoriamente **cuatro condiciones de entrada**:

### 1. Existencia de un Contrato o Acuerdo Formal
- Debe haber un contrato de software firmado o un acuerdo oficial de proyecto con el cliente.
- Este acuerdo debe definir el alcance inicial del trabajo, los entregables esperados, los costos, los tiempos y las restricciones aplicables.

### 2. Análisis de Viabilidad Completado
- La VSE debe haber realizado un análisis técnico y financiero básico para asegurar que tiene la capacidad de entregar el proyecto.
- Se debe validar la disponibilidad de tecnologías requeridas y la viabilidad del cronograma frente al presupuesto.

### 3. Equipo de Trabajo y Project Manager Designados
- El personal del proyecto debe estar formalmente asignado.
- Se debe nombrar a un Project Manager (PM) responsable del control administrativo y a los ingenieros de software encargados del desarrollo técnico.
- El personal debe contar con la capacitación o competencia necesaria para cumplir sus roles.

### 4. Recursos Disponibles e Infraestructura Lista
- Se debe garantizar el acceso a hardware (computadoras, servidores de prueba), software (entornos de desarrollo, licencias de bases de datos) y servicios necesarios (conexión a internet, repositorios de código).
- La infraestructura de soporte del proyecto debe estar operativa antes de iniciar las tareas de desarrollo.`,
      reflexionPrompt: "¿Qué riesgos técnicos y financieros se corren cuando un equipo de desarrollo inicia la construcción de software sin cumplir alguna de estas 4 condiciones mínimas?",
      quiz: [
        {
          pregunta: "¿Cuál de las siguientes es una de las 4 condiciones iniciales obligatorias?",
          opciones: [
            "Tener una certificación CMMI Nivel 3",
            "La firma de un contrato o acuerdo formal del proyecto con el cliente",
            "Disponer de un equipo mínimo de 50 programadores",
            "Haber desarrollado al menos 10 sistemas similares en el pasado"
          ],
          respuestaCorrecta: 1,
          explicacion: "La existencia de un contrato o acuerdo formal es la primera condición de entrada, garantizando que el alcance, tiempo y costo estén delimitados legalmente."
        },
        {
          pregunta: "¿Qué busca asegurar el análisis de viabilidad antes de arrancar un proyecto?",
          opciones: [
            "Que el código se escriba en lenguaje Python",
            "Que la VSE tiene la capacidad técnica, financiera y el tiempo para entregar el proyecto",
            "Que el cliente nunca cambie de opinión",
            "Que las computadoras sean de última generación"
          ],
          respuestaCorrecta: 1,
          explicacion: "El análisis de viabilidad previene que las VSEs acepten proyectos imposibles de realizar con sus recursos técnicos, financieros o plazos asignados."
        },
        {
          pregunta: "¿Qué recursos deben estar formalmente listos según la cuarta condición de entrada?",
          opciones: [
            "Cafetería y gimnasio para los desarrolladores",
            "Infraestructura tecnológica, hardware, software e internet necesarios",
            "Un servidor en producción en la nube AWS",
            "El código base del sistema"
          ],
          respuestaCorrecta: 1,
          explicacion: "La norma exige asegurar la disponibilidad de la infraestructura y herramientas técnicas indispensables (PC, IDE, internet) antes de arrancar, para evitar cuellos de botella iniciales."
        },
        {
          pregunta: "¿Quién debe ser nombrado obligatoriamente según las condiciones de equipo?",
          opciones: [
            "Un auditor externo de la ISO",
            "Un Project Manager (PM) y el equipo técnico de desarrollo",
            "Un Scrum Master certificado",
            "Un experto en bases de datos Oracle"
          ],
          respuestaCorrecta: 1,
          explicacion: "Se requiere formalizar los roles clave, nombrando a un Project Manager (responsable de la gestión) y al equipo de implementación de software."
        }
      ],
    },
    {
      titulo: "Procesos Obligatorios del Perfil Básico",
      contenido: `La especificación formal de la Parte 4-1 determina con exactitud qué requisitos específicos debe cumplir cada uno de los procesos obligatorios:

### Requisitos Mandatorios de Gestión de Proyectos (PM)
El Project Manager debe demostrar cumplimiento de los siguientes \"Shall\":
- **Planificación**: Definir y documentar el Plan de Proyecto (cronograma, estimación de esfuerzo, presupuesto y plan de entregas).
- **Riesgos**: Identificar, analizar y monitorear continuamente los riesgos del proyecto, definiendo planes de contingencia para aquellos de alta probabilidad.
- **Control de Versiones**: Establecer políticas para el control de versiones y almacenamiento de todos los productos de trabajo del proyecto, incluyendo políticas de backup (respaldo) y restauración de datos.
- **Monitoreo**: Comparar de forma periódica el avance real contra el planificado y tomar acciones correctivas documentadas en caso de desviaciones en tiempo o costos.
- **Cierre**: Documentar la aceptación del producto por parte del cliente y archivar el repositorio.

### Requisitos Mandatorios de Implementación de Software (SI)
El equipo técnico debe demostrar el cumplimiento de:
- **Captura y Análisis**: Analizar las necesidades del cliente y producir una Especificación de Requisitos de Software (SRS) formal.
- **Arquitectura y Diseño**: Diseñar la estructura del software basándose en requisitos, mapeando componentes de interfaz de usuario, bases de datos y lógica del sistema.
- **Construcción y Verificación**: Construir el software (código) y ejecutar pruebas unitarias (verificación) para garantizar que los módulos funcionan individualmente.
- **Integración y Pruebas del Sistema**: Integrar los componentes y probar el sistema completo frente a la SRS.
- **Transición**: Desplegar el software e instruir al cliente en su uso mediante manuales y capacitación técnica.`,
      reflexionPrompt: "¿Qué tipo de evidencias presentarías a un auditor externo para demostrar que cumples con la política de control de versiones y copias de seguridad?",
      quiz: [
        {
          pregunta: "¿Cuál de las siguientes actividades de PM es obligatoria (Shall)?",
          opciones: [
            "Utilizar herramientas Microsoft Project únicamente",
            "Identificar y monitorear riesgos, y definir políticas de control de versiones con backups",
            "Escribir todo el código de la base de datos",
            "Organizar reuniones de Scrum de 15 minutos diario"
          ],
          respuestaCorrecta: 1,
          explicacion: "Identificar riesgos, establecer control de versiones y definir políticas de backup/restauración son requisitos obligatorios ('Shall') para el proceso PM."
        },
        {
          pregunta: "¿En qué consiste el requisito obligatorio de 'Transición' en el proceso SI?",
          opciones: [
            "Vender el código a otra empresa",
            "Entregar el producto y habilitar al cliente en su uso mediante capacitación y manuales",
            "Cambiar de lenguaje de programación a mitad de camino",
            "Migrar el equipo de trabajo a otra oficina"
          ],
          respuestaCorrecta: 1,
          explicacion: "La transición exige poner en marcha el sistema entregado y asegurar que el cliente sabe operarlo a través de manuales y transferencia de conocimiento."
        },
        {
          pregunta: "¿Qué documento debe crearse obligatoriamente al finalizar el análisis de requisitos en SI?",
          opciones: [
            "Un diagrama de arquitectura detallada",
            "La Especificación de Requisitos de Software (SRS)",
            "Un reporte de fallas del sistema",
            "El plan de mantenimiento evolutivo"
          ],
          respuestaCorrecta: 1,
          explicacion: "La Especificación de Requisitos de Software (SRS) es el producto de trabajo obligatorio que plasma el acuerdo técnico sobre qué construirá el equipo de desarrollo."
        },
        {
          pregunta: "¿Qué debe hacer el PM obligatoriamente si el monitoreo revela desviaciones graves en el cronograma?",
          opciones: [
            "Cancelar el proyecto inmediatamente",
            "Implementar y registrar acciones correctivas para encarrilar el proyecto",
            "Culpar al equipo técnico y ocultar los datos al cliente",
            "Pedir una auditoría de emergencia a la ISO"
          ],
          respuestaCorrecta: 1,
          explicacion: "El PM tiene la obligación contractual y metodológica de tomar acciones correctivas documentadas ante desviaciones significativas sobre las líneas base de tiempo y costo."
        }
      ],
    },
    {
      titulo: "Relación con Estándares Base",
      contenido: `La serie ISO/IEC 29110 no fue inventada desde cero. Su base científica y metodológica radica en la simplificación de estándares internacionales de ingeniería ya consolidados:

### ¿Qué es un Estándar Base (Base Standard)?
Es una norma internacional oficial que sirve como marco de origen para la creación de un perfil de ingeniería específico para VSEs.

### Relación con ISO/IEC/IEEE 12207
- **Propósito de 12207**: Es el estándar global para los procesos del ciclo de vida del software. Regula desde el desarrollo, adquisición, operación y mantenimiento hasta procesos organizacionales complejos.
- **Relación con 29110-4-1**: La especificación del Perfil Básico es un **subconjunto de procesos simplificados** extraídos de ISO/IEC/IEEE 12207. Se toman solo los procesos de PM (Gestión de Proyectos) y SI (Implementación) y se eliminan las actividades corporativas y burocráticas inviables para una microempresa.

### Relación con ISO/IEC/IEEE 15288
- **Propósito de 15288**: Es el estándar internacional para la ingeniería de sistemas. Regula el ciclo de vida de sistemas complejos compuestos por hardware, software, personas y procesos.
- **Relación con 29110**: Sirve de base para los perfiles de Ingeniería de Sistemas de la norma (para empresas que desarrollan productos combinados de hardware y software).

### Concepto de Conformidad Encadenada
Este es un beneficio comercial clave: al estar en conformidad con ISO/IEC 29110-4-1, la VSE puede declarar legítimamente ante licitaciones y clientes internacionales que **sus procesos de software están alineados con los requisitos aplicables del estándar internacional ISO/IEC/IEEE 12207**, abriéndole las puertas a mercados corporativos globales.`,
      reflexionPrompt: "¿Qué valor comercial e internacional le aporta a una pequeña empresa poder decir que sus procesos están alineados con la prestigiosa norma ISO/IEC/IEEE 12207?",
      quiz: [
        {
          pregunta: "¿De qué estándar internacional de ciclo de vida del software se deriva el Perfil Básico de la ISO/IEC 29110?",
          opciones: ["ISO 9001", "CMMI", "ISO/IEC/IEEE 12207", "ISO/IEC 27001"],
          respuestaCorrecta: 2,
          explicacion: "El Perfil Básico de software en ISO 29110 es un subconjunto simplificado y adaptado de la norma internacional ISO/IEC/IEEE 12207."
        },
        {
          pregunta: "¿Qué es un 'Estándar Base' en el contexto de la taxonomía ISO 29110?",
          opciones: [
            "Una base de datos SQL recomendada por la ISO",
            "Cualquier norma internacional existente (como 12207 o 15288) que sirve como fundamento científico para construir un perfil adaptado",
            "El estándar mínimo de salario para programadores",
            "Una plantilla de Word para documentar requisitos"
          ],
          respuestaCorrecta: 1,
          explicacion: "Un estándar base es una norma internacional establecida y de amplio reconocimiento que se utiliza como origen para destilar un perfil aplicable a VSEs."
        },
        {
          pregunta: "¿Qué estándar base se utiliza para los perfiles orientados a la Ingeniería de Sistemas en ISO 29110?",
          opciones: ["ISO 14001", "ISO/IEC/IEEE 15288", "ISO 22301", "IEEE 829"],
          respuestaCorrecta: 1,
          explicacion: "Los perfiles de ingeniería de sistemas de la serie ISO 29110 se derivan de la norma ISO/IEC/IEEE 15288, enfocada en ciclos de vida de sistemas complejos (hardware + software)."
        },
        {
          pregunta: "¿Qué ventaja otorga el concepto de 'Conformidad Encadenada' a una VSE?",
          opciones: [
            "Le permite saltarse el pago de impuestos de auditoría",
            "Le faculta declarar ante clientes que sus procesos están alineados con estándares globales reconocidos (como ISO 12207) sin la carga burocrática completa de estos",
            "Garantiza que el software estará 100% libre de fallas de seguridad",
            "Obliga a los clientes a aceptar cualquier precio que proponga la VSE"
          ],
          respuestaCorrecta: 1,
          explicacion: "La conformidad encadenada valida que el trabajo simplificado de la VSE respeta la filosofía y mejores prácticas de estándares mayores, dotándola de credibilidad internacional ante grandes clientes."
        }
      ],
    },
  ],
};
