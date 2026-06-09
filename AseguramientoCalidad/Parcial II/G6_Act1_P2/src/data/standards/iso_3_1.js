export const iso_3_1 = {
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
      contenido: `ISO/IEC TR 29110-3-1:2020 es un **Informe Técnico** (Technical Report) que establece las directrices para la realización de la evaluación de procesos en Muy Pequeñas Entidades (VSEs), alineándose con la familia internacional ISO/IEC 330xx.

### Objetivo General de la Evaluación
Determinar la capacidad de los procesos de desarrollo y gestión de software implementados por la VSE para identificar oportunidades de mejora y, si se desea, lograr una certificación oficial de conformidad internacional.

### Dos Enfoques de Evaluación Contemplados
- **Evaluación Interna (Self-Assessment / Autoevaluación)**:
  - Liderada por el propio equipo de la VSE o con apoyo de un asesor externo.
  - Enfoque totalmente constructivo e informal orientado a la mejora continua y a identificar cuellos de botella en la operación diaria.
- **Evaluación Externa (Auditoría Formal de Certificación)**:
  - Realizada por un organismo auditor de tercera parte debidamente acreditado.
  - Busca emitir un certificado de conformidad oficial internacional que tiene una validez típica de **3 años**.

### Adaptación de Costos y Complejidad para VSEs
Las evaluaciones tradicionales basadas en CMMI o ISO/IEC 33020 son prohibitivamente caras, largas y complejas para micro-empresas. Esta guía establece un marco de evaluación ágil, reduciendo drásticamente los tiempos de auditoría a pocos días y enfocándose en la verificación de evidencias digitales existentes en el día a día.`,
      reflexionPrompt: "¿Qué valor encuentras en realizar una autoevaluación interna antes de contratar una auditoría formal de certificación externa?",
      quiz: [
        {
          pregunta: "¿Qué norma internacional regula el marco general de evaluación de procesos bajo el cual se rige esta guía?",
          opciones: ["ISO 9001", "La familia ISO/IEC 330xx", "ISO/IEC 27001", "CMMI Nivel 3"],
          respuestaCorrecta: 1,
          explicacion: "Las directrices de evaluación de procesos de la ISO 29110 se fundamentan en la familia de normas ISO/IEC 330xx (que reemplaza a la antigua ISO 15504 - SPICE)."
        },
        {
          pregunta: "¿Cuál es la vigencia típica del certificado de conformidad emitido tras una auditoría externa?",
          opciones: ["1 año", "3 años", "5 años", "De por vida"],
          respuestaCorrecta: 1,
          explicacion: "Los certificados oficiales de conformidad internacional con la norma ISO/IEC 29110 suelen tener una vigencia de 3 años, requiriendo auditorías de seguimiento anuales."
        },
        {
          pregunta: "¿Cuál es la principal característica de una autoevaluación (Self-Assessment)?",
          opciones: [
            "Tiene validez legal ante licitaciones públicas internacionales",
            "Está orientada exclusivamente a la mejora continua interna y es de carácter constructivo",
            "Es realizada obligatoriamente por un organismo certificador acreditado",
            "Sirve para despedir al personal que comete errores de código"
          ],
          respuestaCorrecta: 1,
          explicacion: "La autoevaluación es un diagnóstico interno y colaborativo que busca identificar fallas en los procesos para corregirlos antes de una auditoría real."
        },
        {
          pregunta: "¿Cómo reduce esta guía la complejidad de las auditorías tradicionales para las microempresas?",
          opciones: [
            "Permite al auditor certificar a la empresa sin revisar evidencias",
            "Simplifica el proceso de auditoría, acortando tiempos y validando repositorios digitales del trabajo diario",
            "Hace obligatorio imprimir miles de hojas de papel",
            "Solo permite auditorías a través de llamadas telefónicas"
          ],
          respuestaCorrecta: 1,
          explicacion: "La norma promueve auditorías ágiles y económicas que se enfocan en las herramientas que el equipo ya utiliza y minimizan el desperdicio burocrático de tiempo."
        }
      ],
    },
    {
      titulo: "Modelos de Evaluación (PRM y PAM)",
      contenido: `El proceso de evaluación de procesos de software en ISO 29110 requiere la interacción técnica de dos modelos teóricos y prácticos:

### 1. Modelo de Referencia de Procesos (Process Reference Model - PRM)
- El PRM establece el **\"QUÉ\"** debe cumplir la VSE.
- Define el conjunto de procesos (como PM y SI), detallando sus respectivos **propósitos** y los **resultados esperados** (outcomes) de su ejecución.
- En la práctica, el PRM para la certificación del Perfil Básico se extrae directamente de la norma **ISO/IEC 29110-4-1:2018**.

### 2. Modelo de Evaluación de Procesos (Process Assessment Model - PAM)
- El PAM detalla el **\"CÓMO\"** evidenciar que la VSE cumple con el PRM.
- Proporciona al evaluador (auditor) una lista sistemática de **indicadores de proceso** que debe verificar durante la auditoría.
- **Indicadores de Desempeño**: Prácticas de base (actividades técnicas) y productos de trabajo requeridos (entregables con contenido específico).
- **Indicadores de Capacidad**: Atributos del proceso que demuestran qué tan bien se gestiona y controla el proceso en la práctica.

### Coexistencia Científica
Para evaluar un proceso, el auditor revisa los entregables reales de la VSE (PAM) y valida si la información y actividades contenidas en ellos logran los resultados exigidos por el estándar de requisitos (PRM).`,
      reflexionPrompt: "¿Por qué crees que la ISO decide separar formalmente el Modelo de Referencia (PRM) del Modelo de Evaluación (PAM)? ¿Qué flexibilidad aporta esta arquitectura?",
      quiz: [
        {
          pregunta: "¿Qué modelo define los procesos obligatorios, sus propósitos y resultados esperados ('Qué')?",
          opciones: ["El Modelo PAM", "El Modelo PRM", "El Modelo CMMI", "El Modelo RUP"],
          respuestaCorrecta: 1,
          explicacion: "El PRM (Process Reference Model) es el marco de referencia formal que contiene las metas y resultados mandatorios de cada proceso."
        },
        {
          pregunta: "¿Qué modelo contiene las guías de indicadores específicos y evidencias que el auditor debe verificar ('Cómo')?",
          opciones: ["El Modelo PRM", "El Modelo PAM", "El Modelo Scrum", "El Modelo XP"],
          respuestaCorrecta: 1,
          explicacion: "El PAM (Process Assessment Model) provee las directrices y checklists de evidencias prácticas que guían el examen del auditor."
        },
        {
          pregunta: "¿De qué documento estándar se extrae el PRM para la evaluación del Perfil Básico?",
          opciones: ["De la ISO 9001", "De la ISO/IEC 29110-4-1 (Especificación del Perfil)", "De la Wikipedia", "Del repositorio GitHub de la VSE"],
          respuestaCorrecta: 1,
          explicacion: "El PRM se deriva de la Parte 4-1 de la norma, que es el documento de especificación formal de requisitos del perfil."
        },
        {
          pregunta: "¿Qué compone a un indicador de desempeño dentro del PAM?",
          opciones: [
            "El salario de los desarrolladores e incentivos de velocidad",
            "Las prácticas de base ejecutadas y los productos de trabajo (entregables) generados",
            "La cantidad de café consumido por el equipo",
            "La cantidad de líneas de código escritas por día"
          ],
          respuestaCorrecta: 1,
          explicacion: "El PAM evalúa el desempeño basándose en que el equipo realmente ejecute las tareas y genere los productos de trabajo obligatorios con la calidad requerida."
        }
      ],
    },
    {
      titulo: "Modelo de Madurez de las VSEs",
      contenido: `A diferencia de otros marcos internacionales de evaluación como CMMI o SPICE, que evalúan la capacidad de procesos individuales en niveles del 0 al 5, la serie ISO/IEC 29110 adopta un enfoque simplificado:

### El Modelo de Madurez por Perfiles
El modelo de madurez de la ISO 29110 está ligado directamente al **logro progresivo de los perfiles** definidos en la hoja de ruta:
- **Nivel de Madurez 1: Perfil de Entrada (Entry)**
- **Nivel de Madurez 2: Perfil Básico (Basic)**
- **Nivel de Madurez 3: Perfil Intermedio (Intermediate)**
- **Nivel de Madurez 4: Perfil Avanzado (Advanced)**

### La Regla de la Certificación Binaria
- La evaluación de la conformidad para la certificación de un perfil es **estrictamente binaria**: la VSE cumple o no cumple.
- **Sin Cumplimientos Parciales**: No existe la certificación de 'Medio Perfil Básico'. Para certificar, la VSE debe demostrar el cumplimiento del **100% de los requisitos mandatorios ('Shall')** de todos los procesos que integran el perfil evaluado.
- Si un solo requisito obligatorio falla de forma sistemática y crítica durante la auditoría, la organización no puede obtener el sello de conformidad hasta resolver la no conformidad mediante acciones correctivas.`,
      reflexionPrompt: "¿Qué ventajas y desventajas tiene el enfoque binario de certificación frente al enfoque de niveles numéricos tradicionales como CMMI?",
      quiz: [
        {
          pregunta: "¿Cómo se define la madurez de una organización bajo el esquema ISO/IEC 29110?",
          opciones: [
            "Mediante un puntaje de 1 a 1000 asignado por el auditor",
            "Por el perfil alcanzado de forma progresiva (Entry, Basic, Intermediate, Advanced)",
            "Por la cantidad de certificados universitarios del Project Manager",
            "Por el lenguaje de programación exclusivo que utiliza la empresa"
          ],
          respuestaCorrecta: 1,
          explicacion: "La madurez en ISO 29110 es intuitiva y progresiva, equivaliendo al perfil internacional de ingeniería que la VSE ha logrado certificar."
        },
        {
          pregunta: "¿Qué significa que la certificación de un perfil de la norma sea 'binaria'?",
          opciones: [
            "Que solo se auditan dos líneas de código",
            "Que se requiere cumplir el 100% de los requisitos del perfil; es 'todo o nada' y no hay conformidad parcial",
            "Que solo participan dos personas en la auditoría",
            "Que se escribe la documentación utilizando sistema binario (ceros y unos)"
          ],
          respuestaCorrecta: 1,
          explicacion: "Binaria significa que no hay estados intermedios de certificación: o se cumplen la totalidad de las directrices mandatorias del perfil o no se otorga el certificado."
        },
        {
          pregunta: "¿Qué ocurre si una VSE tiene implementados todos sus procesos pero carece de un control de versiones y copias de seguridad durante la auditoría del Perfil Básico?",
          opciones: [
            "El auditor los certifica de todos modos porque lo demás está bien",
            "Se le niega la certificación debido a una no conformidad crítica en el proceso de PM",
            "Se le cobra una multa en dinero",
            "Se le rebaja el nivel de madurez a cero permanentemente"
          ],
          respuestaCorrecta: 1,
          explicacion: "Dado que el control de versiones y políticas de respaldo son un requisito mandatorio ('Shall') de PM, su ausencia total impide lograr la conformidad del perfil."
        },
        {
          pregunta: "¿Cuál es el máximo nivel de madurez definido actualmente en la hoja de ruta ISO 29110?",
          opciones: ["Nivel Experto", "Perfil Avanzado (Advanced Profile)", "CMMI Nivel 5", "Nivel de Optimización Continua"],
          respuestaCorrecta: 1,
          explicacion: "El Perfil Avanzado representa la cúspide de la hoja de ruta de perfiles genéricos de ingeniería de la serie."
        }
      ],
    },
    {
      titulo: "Anexos Prácticos y Validez Internacional",
      contenido: `El reporte técnico de evaluación incorpora directrices de medición detalladas en sus anexos para estandarizar la labor del auditor a nivel global:

### Anexo A: Escala de Habilitación de Procesos (Process Capability Scale)
Establece la escala formal para calificar el logro de los resultados de cada proceso, conforme a ISO/IEC 33020:
- **N (Not Achieved - No Logrado)**: De **0% a 15%** de cumplimiento. Hay poca o ninguna evidencia de logro del proceso.
- **P (Partially Achieved - Parcialmente Logrado)**: De **15% a 50%** de cumplimiento. Se aprecian algunos logros, pero la debilidad es sistemática.
- **L (Largely Achieved - Ampliamente Logrado)**: De **50% a 85%** de cumplimiento. Existe evidencia de implementación sistemática, con pequeñas desviaciones no críticas.
- **F (Fully Achieved - Completamente Logrado)**: De **85% a 100%** de cumplimiento. El proceso se ejecuta de manera consistente y exitosa sin desviaciones significativas.

### Anexos B y C: Modelos Especializados por Disciplina
- **Anexo B (Software)**: Proporciona las métricas de evaluación específicas para empresas que desarrollan exclusivamente productos intangibles de software.
- **Anexo C (Systems Engineering)**: Adapta los indicadores de evaluación para auditar VSEs dedicadas al desarrollo de sistemas integrados y complejos (donde interactúan hardware y software).

### Reconocimiento y Validez Internacional
Al estar fundamentado en los estándares madre ISO/IEC 330xx, el esquema de evaluación de ISO 29110 tiene **validez internacional recíproca**. Un certificado emitido en un país miembro es reconocido formalmente por clientes y entidades de cualquier parte del mundo.`,
      reflexionPrompt: "Como miembro de una VSE, ¿qué rango de cumplimiento (N, P, L, F) aspiras a mantener en tus procesos diarios y cómo lo asegurarías?",
      quiz: [
        {
          pregunta: "¿Qué porcentaje de logro exige la calificación 'F' (Fully Achieved) en una evaluación?",
          opciones: ["De 50% a 85%", "De 85% a 100%", "Únicamente 100% exacto", "Más del 70%"],
          respuestaCorrecta: 1,
          explicacion: "La calificación 'F' (Completamente Logrado) se asigna cuando el cumplimiento del proceso está en el rango de 85% a 100%."
        },
        {
          pregunta: "¿Qué califica la escala 'P' (Partially Achieved)?",
          opciones: ["De 0% a 15%", "De 15% a 50%", "De 50% a 85%", "Ningún cumplimiento"],
          respuestaCorrecta: 1,
          explicacion: "'P' (Parcialmente Logrado) denota un avance inicial con cumplimiento entre el 15% y el 50% de los indicadores evaluados."
        },
        {
          pregunta: "¿Cuál es el propósito del Anexo C de esta guía de evaluación?",
          opciones: [
            "Evaluar proyectos exclusivos de hardware en la construcción civil",
            "Adaptar los indicadores de evaluación para proyectos de Ingeniería de Sistemas (hardware y software combinados)",
            "Definir el diseño de interfaces web accesibles",
            "Establecer la política de seguridad física de la oficina"
          ],
          respuestaCorrecta: 1,
          explicacion: "El Anexo C está diseñado para la Ingeniería de Sistemas, brindando métricas de evaluación cuando el desarrollo abarca componentes físicos (hardware) y lógicos (software)."
        },
        {
          pregunta: "¿Qué garantiza que una certificación ISO 29110 obtenida en América Latina sea válida en Europa?",
          opciones: [
            "El pago de una tasa de aduana internacional",
            "Su alineación y reconocimiento recíproco bajo el marco de estándares mundiales ISO/IEC",
            "Que la documentación esté escrita en idioma inglés obligatoriamente",
            "La norma no es válida fuera del país donde se emite"
          ],
          respuestaCorrecta: 1,
          explicacion: "Al ser una norma oficial del catálogo internacional ISO/IEC, la certificación cuenta con el respaldo y reconocimiento mutuo de los organismos de normalización internacionales."
        }
      ],
    },
  ],
};
