export const iso_2_1 = {
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
      contenido: `ISO/IEC 29110-2-1:2015 es el pilar conceptual de toda la serie. Funciona como el **Marco de Referencia** (Framework) y la **Taxonomía oficial** de la familia de normas.

### Propósito del Framework
- Establecer un glosario de términos unificado y definiciones estándar de ingeniería de software para evitar malentendidos lingüísticos.
- Explicar la lógica científica detrás de la creación de perfiles de ingeniería de software y sistemas adaptados a las limitaciones de recursos de las VSEs.

### Audiencia Objetivo
A diferencia de las Partes 5 (guías para desarrolladores), **este documento no está dirigido directamente a las VSEs**. Su audiencia de diseño son:
- **Creadores de perfiles (Profile Producers)**: Comités de normalización nacionales e internacionales que diseñan nuevos perfiles para dominios específicos (ej. perfiles para software espacial o médico).
- **Evaluadores y Auditores**: Profesionales que auditan la conformidad de los procesos de las VSEs.
- **Desarrolladores de herramientas y plantillas**: Organizaciones que crean metodologías de trabajo o sistemas CASE para soportar los procesos de la norma.

### Adaptabilidad Organizacional
Aunque su foco son las VSEs (hasta 25 personas), el estándar advierte que sus bases conceptuales pueden ser adoptadas por departamentos de TI de grandes corporaciones, reconociendo que ciertos problemas organizacionales de las macroempresas no estarán cubiertos por estos perfiles simplificados.`,
      reflexionPrompt: "¿Por qué es crucial contar con un glosario de términos común e internacional antes de intentar evaluar o implementar procesos de calidad?",
      recursos: {
        links: [
          { titulo: "ISO/IEC 29110-2-1:2015 - ISO Store", url: "https://www.iso.org/standard/62712.html" }
        ]
      },
      quiz: [
        {
          pregunta: "Q1",
          pregunta: "¿Cuál es el propósito principal de ISO/IEC 29110-2-1:2015?",
          opciones: [
            "Servir como manual de programación en Java",
            "Actuar como el Marco de Referencia y Taxonomía común de toda la serie de normas",
            "Explicar cómo realizar pruebas de estrés en la nube",
            "Establecer las multas por incumplimiento de software"
          ],
          respuestaCorrecta: 1,
          explicacion: "La Parte 2-1 provee la base conceptual, definiciones y taxonomía comunes que dan consistencia a todos los documentos de la familia ISO 29110."
        },
        {
          pregunta: "¿A qué audiencia está destinado principalmente este documento conceptual de la norma?",
          opciones: [
            "Directamente a los programadores junior de la VSE",
            "A creadores de perfiles, auditores y desarrolladores de herramientas/metodologías",
            "Únicamente a los clientes que compran el software",
            "A estudiantes de primer semestre de ingeniería"
          ],
          respuestaCorrecta: 1,
          explicacion: "Este marco conceptual sirve de guía para quienes diseñan la norma, la evalúan o crean herramientas de soporte metodológico para las VSEs."
        },
        {
          pregunta: "¿Qué advierte la norma sobre su adopción por parte de organizaciones más grandes que una VSE?",
          opciones: [
            "Que está estrictamente prohibido por ley internacional",
            "Que pueden adoptarla, pero reconociendo que ciertos problemas de macroempresas no están cubiertos por perfiles simplificados",
            "Que deben pagar el doble por las licencias",
            "Que no tiene ninguna utilidad práctica para ellas"
          ],
          respuestaCorrecta: 1,
          explicacion: "Las organizaciones grandes pueden adoptar la norma en subequipos, pero deben saber que los perfiles están optimizados para VSEs y no abordan problemáticas de macroestructura empresarial."
        },
        {
          pregunta: "¿Qué evita el establecimiento de un glosario de términos unificado por esta parte?",
          opciones: [
            "Errores de sintaxis en el código de desarrollo",
            "Ambigüedades y malentendidos sobre el significado de roles y entregables en la norma",
            "El uso de metodologías ágiles",
            "La necesidad de realizar pruebas de software"
          ],
          respuestaCorrecta: 1,
          explicacion: "El glosario estandariza el lenguaje, asegurando que un auditor, un desarrollador y un cliente entiendan exactamente lo mismo al referirse a un rol o artefacto."
        }
      ],
    },
    {
      titulo: "Principios Generales de Conformidad",
      contenido: `La Parte 2-1 establece las reglas de juego legales y los límites estrictos que rigen la declaración de conformidad con un perfil:

### Prohibición Absoluta de Personalización (No Tailoring)
En estándares tradicionales (ej. ISO/IEC/IEEE 12207), las organizaciones pueden seleccionar qué procesos aplicar y cuáles omitir en un proceso llamado **\"tailoring\"** (sastrería/personalización).
- En ISO/IEC 29110 **el tailoring no está permitido**.
- **La Razón**: Los perfiles genéricos ya son subconjuntos optimizados y reducidos al mínimo viable. Permitir mayor reducción despojaría a la norma de su rigor e impediría la comparación justa de conformidad entre empresas.
- **Enfoque Binario**: O se cumple con todo el perfil o no se cumple. No hay certificados intermedios.

### Las Reglas para las Extensiones (Extension Rules)
Una VSE es libre de agregar elementos complementarios a su forma de trabajar:
- **Cuándo es aceptable**: Es válido si la VSE incorpora procesos adicionales (ej. un proceso de DevOps), más tareas o entregables específicos más allá de los definidos por el perfil.
- **Restricción de No Contradicción**: Las extensiones no deben redefinir las reglas obligatorias de la norma, ni provocar que las actividades mandatorias se ejecuten de forma incorrecta.
- **Documentación**: Toda extensión implementada debe estar formalmente documentada en el sistema de gestión de la VSE.`,
      reflexionPrompt: "¿Por qué crees que permitir que las empresas recorten más la norma (tailoring) destruiría el valor comercial de la certificación?",
      quiz: [
        {
          pregunta: "¿Se permite el 'Tailoring' (recortar o personalizar procesos del perfil) en la ISO/IEC 29110?",
          opciones: [
            "Sí, la VSE puede recortar lo que no le guste del perfil",
            "No, no está permitido tailoring sobre los perfiles ya que son conjuntos mínimos pre-diseñados",
            "Solo si el equipo de desarrollo es menor a 3 personas",
            "Solo si se cuenta con permiso escrito del auditor"
          ],
          respuestaCorrecta: 1,
          explicacion: "Al ser perfiles que ya representan el mínimo viable de calidad, el tailoring está prohibido para mantener la integridad y estandarización del perfil."
        },
        {
          pregunta: "¿Bajo qué condiciones una VSE puede realizar una 'Extensión' del estándar?",
          opciones: [
            "Reemplazando el proceso de pruebas por más horas de programación",
            "Agregando más tareas o procesos complementarios sin contradecir los obligatorios de la norma y documentándolo",
            "De forma verbal sin necesidad de escribir nada",
            "Solo si cambia su stack tecnológico a uno aprobado por la ISO"
          ],
          respuestaCorrecta: 1,
          explicacion: "Las extensiones son válidas para añadir madurez (ej. integrar seguridad avanzada), siempre que no anulen ni distorsionen los requisitos obligatorios del perfil base."
        },
        {
          pregunta: "¿Qué característica define al cumplimiento de la conformidad de un perfil?",
          opciones: [
            "Es proporcional a la cantidad de líneas de código escritas",
            "Es estrictamente binario y completo; no hay conformidad parcial",
            "Es temporal y vence cada mes",
            "Depende de la satisfacción subjetiva del cliente"
          ],
          respuestaCorrecta: 1,
          explicacion: "La conformidad exige la implementación y evidencia del 100% de los requisitos mandatorios ('Shall') del perfil. No existe el cumplimiento parcial."
        },
        {
          pregunta: "¿Qué relación tiene la conformidad de un perfil ISO 29110 con los estándares internacionales base?",
          opciones: [
            "Ninguna relación, son totalmente independientes",
            "La conformidad con el perfil implica conformidad automática con el subconjunto de procesos del estándar base del cual se deriva",
            "La norma ISO 29110 anula la validez de los estándares base",
            "Exige certificar también los estándares base de forma separada"
          ],
          respuestaCorrecta: 1,
          explicacion: "A través de la conformidad encadenada, cumplir con un perfil ISO 29110 confiere validez de cumplimiento sobre la sección equivalente del estándar base (como ISO 12207)."
        }
      ],
    },
    {
      titulo: "Evidencias para Demostrar Conformidad",
      contenido: `Para que un auditor oficial emita un dictamen favorable de conformidad, la VSE debe presentar evidencias objetivas clasificadas en dos dimensiones operativas:

### 1. Evidencias de Procesos (Process Evidences)
Demuestran que las actividades obligatorias descritas por la norma realmente se ejecutan de manera sistemática y bajo control en el día a día.
- **Ejemplos**:
  - Minutas de reuniones de inicio y planificación del proyecto firmadas.
  - Logs de commits y ramas estructuradas en el sistema de control de versiones.
  - Registros sistemáticos de la ejecución de copias de seguridad (backups) y pruebas de restauración.
  - Reportes de reuniones de monitoreo periódico y registro de acciones correctivas ante desviaciones de tiempo o costo.

### 2. Evidencias de Productos (Product Evidences)
Demuestran que los entregables generados por la VSE cumplen con el contenido y atributos mínimos especificados por la norma.
- **Ejemplos**:
  - Un documento de requisitos (SRS) estructurado con requisitos funcionales, no funcionales y criterios de aceptación claros.
  - Un documento de diseño de software que refleje la arquitectura del sistema y base de datos.
  - Casos de prueba escritos con sus respectivos resultados de ejecución (Test Report).
  - El código fuente limpio y verificado mediante pruebas unitarias.

### Validez de Formato
La norma aclara que las evidencias **no requieren formatos físicos ni plantillas en papel**. Son plenamente válidos los registros digitales contenidos en las herramientas operativas del equipo (ej. una wiki en Notion para el diseño, tableros Jira/Trello para el control de tareas, y repositorios Git para el código e historial de cambios).`,
      reflexionPrompt: "¿Cómo estructurarías las herramientas digitales de tu equipo de desarrollo para generar automáticamente evidencias de procesos y productos sin sobrecargar de trabajo a los programadores?",
      quiz: [
        {
          pregunta: "¿Qué demuestran las 'Evidencias de Procesos' en una auditoría?",
          opciones: [
            "Que el software funciona muy rápido",
            "Que las actividades obligatorias de gestión e ingeniería se ejecutan sistemáticamente bajo control",
            "Que la empresa tiene mucho dinero",
            "Que la base de datos es relacional"
          ],
          respuestaCorrecta: 1,
          explicacion: "Las evidencias de procesos demuestran la disciplina de trabajo: que el equipo realmente planifica, monitorea, gestiona cambios y ejecuta tareas según la metodología."
        },
        {
          pregunta: "¿Cuál de los siguientes es un ejemplo de 'Evidencia de Producto'?",
          opciones: [
            "Un registro de logs de copias de seguridad mensuales",
            "Una Especificación de Requisitos de Software (SRS) con la firma de aprobación del cliente",
            "Una videollamada de planificación grabada",
            "El contrato comercial firmado"
          ],
          respuestaCorrecta: 1,
          explicacion: "La SRS aprobada es una evidencia de producto, ya que es un entregable técnico que documenta el alcance acordado y contiene información estructurada específica."
        },
        {
          pregunta: "¿Exige la norma que la documentación se imprima y firme en papel físico?",
          opciones: [
            "Sí, la ISO solo acepta documentos impresos en papel membretado",
            "No, se aceptan plenamente evidencias digitales organizadas en repositorios, wikis y herramientas de gestión del equipo",
            "Solo si el auditor no sabe usar computadoras",
            "Solo para proyectos que duran más de un año"
          ],
          respuestaCorrecta: 1,
          explicacion: "La norma es moderna y flexible, aceptando evidencias 100% digitales en repositorios, tableros de tareas y sistemas de control de versiones."
        },
        {
          pregunta: "¿Qué ocurre con un producto de trabajo (entregable) si no cumple con la estructura mínima requerida por la norma?",
          opciones: [
            "No se puede utilizar como evidencia objetiva válida de producto",
            "El auditor debe redactar el documento por la VSE",
            "La VSE recibe una multa económica internacional",
            "No pasa nada, el formato es totalmente libre y sin requisitos"
          ],
          respuestaCorrecta: 0,
          explicacion: "Los entregables (evidencias de producto) deben contener la información mínima que el estándar estipula para ser considerados válidos en la demostración de conformidad."
        }
      ],
    },
    {
      titulo: "Definiciones Clave y Taxonomía de la Serie",
      contenido: `Para comprender la arquitectura legal del estándar, la Parte 2-1 detalla la taxonomía de la serie y define los conceptos medulares de perfiles:

### Jerarquía y Estructura de la Serie ISO/IEC 29110
La serie se divide en partes numeradas con propósitos distintos:
1. **Part 1 (Overview)**: Introducción general, conceptos para principiantes y justificación de la norma para VSEs.
2. **Part 2 (Framework and Taxonomy)**: Define el marco conceptual común, glosario y la taxonomía legal de los perfiles (Part 2-1 actual).
3. **Part 3 (Assessment Guides)**: Directrices y requisitos para realizar las evaluaciones de conformidad (ej. Part 3-1).
4. **Part 4 (Profile Specifications)**: Contiene los requisitos obligatorios de cumplimiento ('Shall') para cada perfil (ej. Part 4-1).
5. **Part 5 (Engineering and Management Guidelines)**: Las guías operativas detalladas paso a paso para la implementación diaria de los perfiles (ej. Part 5-1-1 y Part 5-1-2).

### Definición de Tipos de Perfiles
- **Perfil Genérico (Generic Profile)**: Perfiles aplicables a cualquier VSE de desarrollo de software independientemente del sector de negocio (Entry, Basic, Intermediate, Advanced).
- **Perfil de Dominio (Domain-Specific Profile)**: Perfiles que toman la base genérica y añaden requisitos específicos para una industria (ej. perfil para software médico, espacial, militar o financiero).`,
      reflexionPrompt: "¿Qué valor aporta una estructura tan dividida (Partes 1 a 5) a la evolución y mantenimiento del estándar a largo plazo?",
      quiz: [
        {
          pregunta: "¿Qué parte de la serie contiene las guías de ingeniería paso a paso con las tareas diarias para las VSEs?",
          opciones: ["La Parte 2 (Framework)", "La Parte 4 (Specifications)", "La Parte 5 (Guidelines)", "La Parte 3 (Assessment)"],
          respuestaCorrecta: 2,
          explicacion: "La Parte 5 (Guidelines) contiene las guías detalladas de gestión e ingeniería diseñadas para orientar operativamente a la VSE."
        },
        {
          pregunta: "¿Qué es un 'Perfil de Dominio' en la taxonomía ISO 29110?",
          opciones: [
            "El nombre del dominio web de la VSE (.com, .org)",
            "Un perfil que incorpora requisitos de seguridad y calidad específicos para una industria concreta (ej. aeroespacial o salud)",
            "Un perfil exclusivo para el administrador de sistemas",
            "Un perfil que solo funciona con bases de datos relacionales"
          ],
          respuestaCorrecta: 1,
          explicacion: "Los perfiles de dominio extienden la base de los perfiles genéricos con regulaciones específicas de un sector crítico."
        },
        {
          pregunta: "¿Qué parte contiene los requisitos legales y obligatorios ('Shall') para auditoría de conformidad?",
          opciones: ["La Parte 1 (Overview)", "La Parte 4 (Profile Specifications)", "La Parte 5 (Guidelines)", "La Parte 2 (Framework)"],
          respuestaCorrecta: 1,
          explicacion: "La Parte 4 (Specifications) detalla con precisión legal y obligatoria los requisitos indispensables para obtener la certificación."
        },
        {
          pregunta: "¿Cuál es el propósito de la Parte 3 de la serie de normas?",
          opciones: [
            "Enseñar a programar interfaces gráficas",
            "Establecer las directrices y requisitos metodológicos para la evaluación y auditoría de procesos",
            "Definir el presupuesto financiero del proyecto",
            "Brindar plantillas de diseño arquitectónico"
          ],
          respuestaCorrecta: 1,
          explicacion: "La Parte 3 provee las guías y requerimientos que rigen a los evaluadores y auditores autorizados para asegurar el rigor de la auditoría."
        }
      ],
    },
  ],
};
