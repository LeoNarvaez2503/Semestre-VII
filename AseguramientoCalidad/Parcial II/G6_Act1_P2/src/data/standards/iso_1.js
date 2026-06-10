export const iso_1 = {
  id: 6,
  titulo: "ISO/IEC 29110-1",
  subtitulo: "Referencia en imagen: ISO/IEC 29110 - 1",
  categoria: "Vocabulary",
  tags: ["Concepts", "Vocabulary", "Introduction"],
  descripcionCorta: "Define los términos de negocio comunes al conjunto de Documentos de perfiles de la Pequeña Organización, introduciendo conceptos de procesos y estandarización.",
  contenidoExtendido: `# ISO/IEC 29110-1\n\nDefine los términos de negocio comunes al conjunto de Documentos de perfiles de la Pequeña Organización, el cual introduce conceptos de procesos, ciclo de vida de software y estandarización; así mismo introduce las características que debe tener la organización para la implementación del estándar.`,
  urlOriginal: "https://www.iso.org/standard/62711.html",
  color: "from-blue-600 to-blue-400",
  icono: "BookOpen",
  temas: [
    {
      titulo: "Introducción a Conceptos y Vocabulario",
      contenido: `La **Parte 1** de la norma ISO/IEC 29110 está diseñada para proporcionar los conceptos fundamentales y el vocabulario necesario para entender e implementar el resto de la serie de normas.\n\n### Objetivos Principales\n- Establecer un lenguaje común para las Pequeñas Organizaciones (VSEs).\n- Introducir conceptos de procesos y ciclo de vida de software adaptados a la realidad de equipos pequeños.\n- Definir las características organizacionales requeridas para la implementación exitosa de los perfiles.\n\nEl conocimiento de estos términos es vital para evitar ambigüedades en la interpretación de los requisitos y guías de las siguientes partes de la norma.`,
      reflexionPrompt: "¿Por qué crees que es importante tener un vocabulario estandarizado antes de intentar implementar procesos de ingeniería de software?",
      recursos: {
        videoUrl: "https://www.youtube.com/embed/0hGt6pJe8Jo",
        videoTitle: "Introducción a Conceptos - ISO/IEC 29110",
      },
      quiz: [
        {
          pregunta: "¿Cuál es el propósito principal de la Parte 1 de ISO/IEC 29110?",
          opciones: ["Definir el código fuente", "Definir términos de negocio y conceptos comunes de procesos", "Establecer los costos del proyecto", "Auditar el código de la organización"],
          respuestaCorrecta: 1,
          explicacion: "La Parte 1 se centra en estandarizar el vocabulario y los conceptos de ciclo de vida para que todas las partes involucradas hablen el mismo idioma técnico."
        },
        {
          pregunta: "¿A qué tipo de organizaciones están dirigidos estos conceptos?",
          opciones: ["Corporaciones multinacionales", "Pequeñas Organizaciones (VSEs)", "Agencias gubernamentales exclusivas", "Empresas de manufactura"],
          respuestaCorrecta: 1,
          explicacion: "Toda la serie ISO 29110 está diseñada específicamente para VSEs (Very Small Entities)."
        },
        {
          pregunta: "¿Qué problema evita tener un vocabulario estandarizado?",
          opciones: ["Errores de compilación en el software", "Ambigüedades y malentendidos en la interpretación de la norma", "Caídas del servidor en producción", "Costos altos de licenciamiento"],
          respuestaCorrecta: 1,
          explicacion: "Un vocabulario común garantiza que desarrolladores, gerentes y auditores entiendan los requisitos sin ambigüedades."
        },
        {
          pregunta: "¿Qué son las VSEs según la norma?",
          opciones: ["Very Secret Enterprises", "Very Small Entities", "Virtual Software Environments", "Visual Studio Editions"],
          respuestaCorrecta: 1,
          explicacion: "VSE significa Very Small Entity, que engloba organizaciones, departamentos o proyectos muy pequeños."
        }
      ]
    },
    {
      titulo: "Conceptos de Procesos de Software",
      contenido: `Un **proceso** es un conjunto de actividades interrelacionadas que transforman entradas en salidas. En el contexto de las VSEs, los procesos deben ser ágiles y efectivos.\n\n### Procesos Básicos\n- **Proceso de Implementación (SI)**: Cubre las actividades técnicas de construcción del software, desde los requisitos hasta las pruebas.\n- **Proceso de Gestión de Proyectos (PM)**: Abarca la planificación, el monitoreo y el control del trabajo.\n\n### Adaptación a VSEs\nA diferencia de normas como ISO 12207, la ISO 29110 simplifica la definición de procesos agrupando actividades complejas en bloques manejables para equipos de menos de 25 personas.`,
      reflexionPrompt: "¿Cómo describirías la diferencia entre un proceso de gestión y un proceso de implementación en tus propias palabras?",
      quiz: [
        {
          pregunta: "¿Qué es un proceso en ingeniería de software?",
          opciones: ["Un archivo ejecutable", "Un conjunto de actividades interrelacionadas que transforman entradas en salidas", "Una herramienta de programación", "Un diagrama de clases"],
          respuestaCorrecta: 1,
          explicacion: "Un proceso organiza el trabajo al definir cómo las entradas (ej. requisitos) se transforman sistemáticamente en salidas (ej. código)."
        },
        {
          pregunta: "¿Cuáles son los dos procesos nucleares en los perfiles básicos de ISO 29110?",
          opciones: ["Ventas y Marketing", "Implementación de Software (SI) y Gestión de Proyectos (PM)", "Diseño y Pruebas", "Codificación y Despliegue"],
          respuestaCorrecta: 1,
          explicacion: "La norma centraliza el esfuerzo en estos dos grandes bloques: la ejecución técnica (SI) y la administración (PM)."
        },
        {
          pregunta: "¿Qué busca la simplificación de procesos en ISO 29110?",
          opciones: ["Hacer el software más lento", "Reducir la carga burocrática para equipos pequeños (VSEs)", "Eliminar la fase de pruebas", "Evitar el uso de computadoras"],
          respuestaCorrecta: 1,
          explicacion: "Las VSEs no pueden soportar la burocracia de normas pesadas, por lo que la simplificación agrupa actividades en bloques ágiles."
        },
        {
          pregunta: "¿A qué proceso corresponde la planificación y monitoreo?",
          opciones: ["Proceso de Gestión de Proyectos (PM)", "Proceso de Implementación (SI)", "Proceso de Ventas", "Proceso de Soporte"],
          respuestaCorrecta: 0,
          explicacion: "La planificación, control y monitoreo son actividades administrativas correspondientes a la Gestión de Proyectos (PM)."
        }
      ]
    },
    {
      titulo: "Ciclo de Vida del Software",
      contenido: `El **Ciclo de Vida** comprende todas las etapas por las que pasa un producto de software desde su concepción inicial hasta su retiro definitivo.\n\n### Fases Comunes\n1. **Análisis de Requisitos**: Entender qué necesita el cliente.\n2. **Diseño**: Planificar la arquitectura y estructura.\n3. **Construcción**: Programación y pruebas unitarias.\n4. **Pruebas de Integración**: Validar que todo funciona en conjunto.\n5. **Entrega y Mantenimiento**: Despliegue y corrección de errores.\n\nPara las VSEs, es crucial comprender estos términos para organizar el trabajo en fases lógicas sin importar si usan metodologías ágiles o tradicionales.`,
      reflexionPrompt: "¿En qué fase del ciclo de vida crees que suelen ocurrir los errores más costosos si no se gestionan bien?",
      quiz: [
        {
          pregunta: "¿Qué abarca el ciclo de vida del software?",
          opciones: ["Solo la fase de programación", "Desde la concepción inicial hasta el retiro definitivo del software", "El tiempo que dura la garantía", "El tiempo de ejecución del programa en memoria"],
          respuestaCorrecta: 1,
          explicacion: "El ciclo de vida incluye todas las etapas, desde el nacimiento de la idea hasta que el software deja de ser utilizado y mantenido."
        },
        {
          pregunta: "¿Qué se hace en la fase de Análisis de Requisitos?",
          opciones: ["Escribir código", "Entender y documentar qué necesita exactamente el cliente", "Realizar pruebas de seguridad", "Comprar servidores"],
          respuestaCorrecta: 1,
          explicacion: "El análisis se enfoca en capturar las necesidades del usuario antes de diseñar o programar la solución."
        },
        {
          pregunta: "¿El ciclo de vida en ISO 29110 obliga a usar metodologías tradicionales (cascada)?",
          opciones: ["Sí, la norma prohíbe el uso de Scrum", "No, los conceptos del ciclo de vida aplican independientemente de si se usan métodos ágiles o tradicionales", "Solo permite usar Extreme Programming", "Obliga a no tener ciclo de vida"],
          respuestaCorrecta: 1,
          explicacion: "La norma es agnóstica respecto a la metodología. Las fases del ciclo de vida son lógicas y se adaptan al marco de trabajo que elija el equipo."
        },
        {
          pregunta: "¿Cuál es el objetivo de las Pruebas de Integración?",
          opciones: ["Revisar la ortografía del código", "Validar que los diferentes módulos funcionan correctamente en conjunto", "Cobrar al cliente", "Diseñar la base de datos"],
          respuestaCorrecta: 1,
          explicacion: "Tras probar las unidades individuales, la integración asegura que los componentes se comuniquen y operen bien juntos."
        }
      ]
    },
    {
      titulo: "Características Organizacionales de una VSE",
      contenido: `La norma define ciertas características estructurales típicas de las Pequeñas Organizaciones, las cuales justifican el enfoque simplificado de los perfiles.\n\n### Limitaciones Comunes\n- **Recursos Humanos**: Generalmente equipos pequeños donde una misma persona asume múltiples roles.\n- **Presupuesto**: Capital limitado que impide contratar consultorías costosas de calidad.\n- **Infraestructura**: Herramientas y entornos de trabajo esenciales sin grandes lujos corporativos.\n\nLa Parte 1 subraya que la estandarización no debe asfixiar a la organización con procesos inmanejables, sino proveer una guía realista (Perfil Básico o de Entrada) que se alinee con su capacidad real.`,
      reflexionPrompt: "¿Qué roles sueles asumir simultáneamente cuando trabajas en un proyecto pequeño?",
      quiz: [
        {
          pregunta: "¿Qué característica de recursos humanos es común en las VSEs?",
          opciones: ["Tener un especialista distinto para cada pequeña tarea", "Que una misma persona asuma múltiples roles en el proyecto", "No tener programadores", "Tener jerarquías de más de 10 niveles"],
          respuestaCorrecta: 1,
          explicacion: "Debido a la escasez de personal, la multitarea de roles es la norma operativa estándar en las organizaciones muy pequeñas."
        },
        {
          pregunta: "¿Por qué las VSEs no suelen adoptar normas como CMMI o ISO 12207?",
          opciones: ["Porque no les gusta programar bien", "Por limitaciones de presupuesto, tiempo y personal para implementar procesos tan pesados", "Porque esas normas son ilegales", "Porque las VSEs no hacen software"],
          respuestaCorrecta: 1,
          explicacion: "Las normas tradicionales requieren mucha inversión económica y esfuerzo burocrático que una pequeña empresa simplemente no puede costear."
        },
        {
          pregunta: "¿Qué principio clave destaca la Parte 1 respecto a la estandarización en VSEs?",
          opciones: ["Debe asfixiar a la empresa con burocracia para asegurar la calidad", "Debe proveer una guía realista alineada a la capacidad de la organización sin sobrecargarla", "Debe forzar a la VSE a contratar más personal", "Debe obligar a trabajar 24 horas al día"],
          respuestaCorrecta: 1,
          explicacion: "El espíritu de la norma ISO 29110 es facilitar la calidad mediante procesos pragmáticos y viables para el tamaño real de la empresa."
        },
        {
          pregunta: "¿Qué limitación de infraestructura es típica en una VSE?",
          opciones: ["Tener centros de datos internacionales propios", "Usar herramientas esenciales de trabajo sin lujos corporativos masivos", "No tener computadoras", "Tener licencias Enterprise de todo el software comercial"],
          respuestaCorrecta: 1,
          explicacion: "Las VSEs optimizan costos utilizando herramientas esenciales, open-source o versiones gratuitas de software para operar."
        }
      ]
    }
  ]
};
