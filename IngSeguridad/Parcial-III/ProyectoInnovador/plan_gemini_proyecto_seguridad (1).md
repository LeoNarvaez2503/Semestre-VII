# Plan de implementación para Gemini CLI — Proyecto "Solución de Seguridad Novedosa"

## 0. Por qué Gemini CLI y no Gemini web
Gemini CLI corre en tu terminal y **sí puede leer archivos de tu disco** (rutas de Windows incluidas), a diferencia de Claude en este chat. Por eso el flujo correcto es:

1. Abrir una terminal (PowerShell o CMD) en la raíz de trabajo.
2. Ejecutar `gemini` (o `npx https://github.com/google-gemini/gemini-cli` si no lo tienes instalado) desde una carpeta donde Gemini tenga acceso a las rutas que necesitas, o usar `@ruta` dentro del prompt para referenciar archivos/carpetas específicas (Gemini CLI soporta `@` para adjuntar contexto de archivos y carpetas).
3. Pegar el prompt de la sección 2 completo.

Si vas a usar `@`, ejecuta `gemini` estando parado en `C:\Users\Jordan\Documents\BACKUP\SEMESTRE VII\SEMESTRE VII\MATERIALCITO SEMESTRE VII\INGENIERIA DE SEGURIDAD DE SOFTWARE\MATERIAL DE ESTUDIO\OneDrive_2026-03-06\` para que las rutas relativas sean cortas, o usa rutas absolutas tal cual las tienes.

## 1. Pasos previos (antes de invocar a Gemini)

- **Verifica que la carátula de referencia sea legible como texto.** Si `parcial2` es un `.docx` o `.pdf`, Gemini CLI puede tener que convertirlo o vos extraer manualmente los datos de la carátula (logo ESPE, nombre de asignatura, docente, integrantes, fecha, NRC, etc.) y pegarlos como texto en el prompt, porque replicar un diseño visual exacto desde un PDF/DOCX es más confiable si le das los datos estructurados en vez de solo "mira este archivo".
- **Revisa qué pptx hay en Unidad 1, 2 y 3** con `dir /s *.pptx` para saber si son muchos (si son >15-20 archivos, considera decirle a Gemini que priorice los de teoría/fundamentos, no los de ejercicios prácticos, para no saturar el contexto).
- Ten a mano: nombre exacto de la materia, docente, e integrantes (ya los tienes abajo en el prompt).

## 2. Prompt completo para pegar en Gemini CLI

```
Actúa como un asistente experto en ciberseguridad y redacción académica técnica en LaTeX.

CONTEXTO DEL PROYECTO
- Asignatura: Ingeniería de Seguridad de Software
- Docente: Sang Guun Yoo, PhD
- Universidad: Universidad de las Fuerzas Armadas - ESPE
- Integrantes del grupo: Caetano Flores, Jordan Guaman, Mesias Mariscal, Anthony Morales, Leonardo Narvaez, Denise Rea
- Tipo de tarea: Grupal
- Fecha de entrega: domingo 19 de julio de 2026, 23:59
- Formato de entrega: libre (se generará como documento LaTeX .tex, informe técnico, NO diapositivas)

TAREA
Plantear una solución de seguridad NOVEDOSA (puede ser corporativa, para dispositivos autónomos/IoT, para software, para redes, etc.) basada en TODO el contenido visto en el semestre.

PARÁMETROS DE EVALUACIÓN (dales peso explícito en tu razonamiento y en el resultado):
1. Novedad de la idea (que no sea una solución genérica ya trillada tipo "usar un firewall" o "hacer capacitaciones de phishing"; debe combinar o extender conceptos vistos en clase de forma original)
2. Detalle técnico de la explicación de la solución (arquitectura, flujo, protocolos, algoritmos, amenazas que mitiga, modelo de amenazas, referencias a estándares si aplica)
3. Formato del documento (presentación profesional: portada, índice, secciones numeradas, bibliografía, consistencia tipográfica)

MATERIAL DE REFERENCIA A USAR COMO CONTEXTO (léelo todo antes de proponer nada; la solución debe estar fundamentada en estos contenidos, citando de qué unidad/tema sale cada concepto que uses):
- Carpeta general: "C:\Users\Jordan\Documents\BACKUP\SEMESTRE VII\SEMESTRE VII\MATERIALCITO SEMESTRE VII\INGENIERIA DE SEGURIDAD DE SOFTWARE\MATERIAL DE ESTUDIO\OneDrive_2026-03-06\[2025B] Ing. Seguridad de SW"
- Unidad 1: "...\[2025B] Ing. Seguridad de SW\Unidad 1"
- Unidad 2: "...\[2025B] Ing. Seguridad de SW\Unidad 2"
- Unidad 3: "...\[2025B] Ing. Seguridad de SW\Unidad 3"
- Revisa TODOS los archivos .pptx dentro de esas tres carpetas de unidades (y subcarpetas si las hay). Extrae de cada uno: tema principal, 3-5 conceptos clave, y cualquier framework/modelo/norma mencionada (ej. STRIDE, OWASP, Zero Trust, criptografía, gestión de vulnerabilidades, etc. — usa lo que realmente aparezca en los pptx, no inventes).
- Antes de escribir la solución, dame un resumen breve (una lista) de los temas cubiertos por unidad, para que yo confirme que no se te pasó nada importante.

REFERENCIA DE CARÁTULA
- Toma como modelo de carátula el documento en: "C:\Users\Jordan\Desktop\Echoes-of-the-Rails\informes\parcial2"
- Replica su estructura (logo/espacio para logo ESPE, título del proyecto, nombre de la asignatura, docente, integrantes, fecha, NRC/paralelo si aparece) pero actualiza los datos con los de este proyecto (asignatura, docente e integrantes de arriba).
- Si el archivo de referencia no es un .tex sino .docx o .pdf, dime exactamente qué campos y orden tiene la carátula para poder recrearla en LaTeX con un paquete como `titlepage` o un entorno manual con `\begin{titlepage}...\end{titlepage}`.

ENTREGABLES QUE DEBES GENERAR

1. INFORME: un archivo .tex COMPLETO y compilable (con preámbulo, paquetes necesarios: babel spanish, inputenc/fontenc, geometry, graphicx, hyperref, listings si hay código, biblatex o thebibliography para referencias) que contenga:
   a. Carátula (según el modelo de arriba)
   b. Índice (\tableofcontents)
   c. Introducción y planteamiento del problema
   d. Marco teórico / estado del arte (resumiendo lo relevante de Unidad 1, 2 y 3, citando de qué unidad sale cada concepto)
   e. Descripción de la solución propuesta (qué la hace novedosa, comparación breve con soluciones existentes)
   f. Detalle técnico de la solución (arquitectura, diagramas descritos en texto o con TikZ si es simple, flujo de funcionamiento, amenazas que mitiga y cómo, protocolos/algoritmos involucrados, consideraciones de implementación)
   g. Conclusiones
   h. Referencias bibliográficas (incluye el material de clase como fuente si corresponde, y 2-4 fuentes externas reales y verificables como estándares o papers conocidos)

2. DIAPOSITIVAS: además del informe, genera un segundo archivo .tex usando la clase Beamer (\documentclass{beamer}) con una presentación basada en el mismo contenido, para exponer el proyecto. Estructura sugerida:
   a. Portada (mismo estilo/datos que la carátula del informe, adaptado a formato de diapositiva de título de Beamer)
   b. Agenda/índice (\tableofcontents con \begin{frame})
   c. Problema y motivación (1-2 diapositivas)
   d. Marco teórico resumido (1-2 diapositivas, solo lo esencial, no copies párrafos completos del informe, resume en bullets)
   e. Solución propuesta y por qué es novedosa (1-2 diapositivas)
   f. Arquitectura/detalle técnico (2-3 diapositivas, con diagramas TikZ si aplica, o describe dónde iría una imagen si no puedes generar el diagrama en TikZ)
   g. Conclusiones (1 diapositiva)
   h. Diapositiva de referencias
   Usa un tema Beamer sobrio y profesional (ej. \usetheme{Madrid} o \usetheme{Berlin}), evita saturar cada diapositiva de texto (máximo 5-6 bullets cortos por diapositiva), y deja claro en comentarios de LaTeX qué diría el expositor en cada una (notas breves como comentario % Nota: ...).

3. IMÁGENES: si durante la investigación o para las diapositivas consideras que una imagen ayuda a explicar un concepto (ej. diagrama de arquitectura de referencia, logo de un estándar, icono representativo de una amenaza), busca en internet una imagen apropiada, libre de derechos de autor problemáticos (prioriza imágenes de documentación oficial, Wikipedia/Wikimedia Commons, o diagramas genéricos tipo Creative Commons), descárgala o referencia su URL, e inclúyela con \includegraphics en el lugar correspondiente tanto en el informe como en las diapositivas. Para cada imagen incluida, indica en un comentario de LaTeX la fuente/URL de donde la obtuviste, para poder citarla correctamente. No uses imágenes con marcas de agua, logos de terceros con derechos claros (ej. logos de empresas de seguridad comerciales) salvo que sea estrictamente para referenciar un estándar o herramienta mencionada.

4. Un resumen ejecutivo aparte (fuera de los .tex, en texto plano) de máximo 200 palabras que pueda usar para explicar la idea de palabra.

RESTRICCIONES
- No inventes contenido de los pptx que no exista; si un archivo no se puede leer, dilo explícitamente en tu resumen inicial.
- El LaTeX (tanto el informe como las diapositivas) debe compilar sin errores con pdflatex o xelatex (evita paquetes exóticos o poco comunes).
- Sé técnicamente preciso: no generes buzzwords vacíos de seguridad ("usa IA para detectar amenazas" sin explicar cómo); cada afirmación técnica debe tener un mecanismo concreto detrás.
- Si no tienes acceso real a internet para buscar imágenes, dilo explícitamente y en su lugar deja un placeholder claro tipo \fbox{Espacio para imagen: [descripción]} con un comentario indicando qué imagen debería ir ahí, para que yo la busque manualmente.

Antes de generar el .tex final, muéstrame primero: (1) el resumen de temas por unidad, (2) 2-3 ideas candidatas de solución novedosa con un pro/contra de cada una, para que yo elija una antes de que redactes el documento completo.
```

## 3. Después de correr el prompt

- Gemini debería devolverte primero el resumen de temas + 2-3 ideas candidatas. **Elige una idea** (o pide que combine dos) antes de dejarlo generar los `.tex` completos — esto evita que gaste el contexto en una solución genérica.
- Una vez tengas los dos `.tex` (informe y diapositivas Beamer), compílalos local (Overleaf es lo más simple: crea un proyecto nuevo, pega el contenido, sube el logo ESPE y cualquier imagen descargada) para verificar que no haya errores de compilación. Beamer a veces requiere ajustar el tema si alguna imagen no cabe bien en el frame — revisa que ninguna diapositiva se desborde.
- Si Gemini no tiene acceso real a búsqueda web activa en tu instalación de la CLI, va a dejarte los placeholders de imagen — en ese caso puedo ayudarte yo a buscar candidatas apropiadas aquí mismo y me dices dónde van.
- Si el pptx o la carátula de referencia no son legibles directamente por Gemini CLI (por ejemplo si el .docx de parcial2 no es texto plano), avísame y te ayudo a extraer el texto/estructura primero con las skills que tengo disponibles aquí en Claude (docx/pptx), y luego se lo pasas a Gemini como texto plano en el prompt.
