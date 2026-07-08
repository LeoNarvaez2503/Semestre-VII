const fs = require('fs');
const https = require('https');
const path = require('path');
const pptxgen = require('pptxgenjs');

// Iconos profesionales PNG de Icons8 (Fluency)
const ICONS_TO_DOWNLOAD = {
    'ai': "https://img.icons8.com/fluency/96/artificial-intelligence.png",
    'cyber-security': "https://img.icons8.com/fluency/96/cyber-security.png",
    'shield': "https://img.icons8.com/fluency/96/shield.png",
    'bug': "https://img.icons8.com/fluency/96/bug.png",
    'poison': "https://img.icons8.com/fluency/96/poison.png",
    'database': "https://img.icons8.com/fluency/96/database.png",
    'api': "https://img.icons8.com/fluency/96/api.png",
    'settings': "https://img.icons8.com/fluency/96/settings.png",
    'monitoring': "https://img.icons8.com/fluency/96/combo-chart.png",
    'network': "https://img.icons8.com/fluency/96/network.png",
    'warning': "https://img.icons8.com/fluency/96/warning-shield.png",
    'nist': "https://img.icons8.com/fluency/96/checked.png"
};

// Descargar iconos locales
function downloadIcon(url, dest) {
    return new Promise((resolve) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(dest, () => {});
                console.warn(`No se pudo descargar ${url}: HTTP ${response.statusCode}`);
                resolve(false);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            file.close();
            fs.unlink(dest, () => {});
            console.warn(`Error al descargar ${url}: ${err.message}`);
            resolve(false);
        });
    });
}

async function main() {
    console.log("Iniciando preparación de la presentación...");
    
    // Directorio local de assets
    const assetsDir = path.join(__dirname, 'assets', 'icons');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Descargar/Verificar iconos locales
    const iconPaths = {};
    for (const [name, url] of Object.entries(ICONS_TO_DOWNLOAD)) {
        const dest = path.join(assetsDir, `${name}.png`);
        iconPaths[name] = dest;
        if (!fs.existsSync(dest)) {
            console.log(`Descargando ${name}.png...`);
            await downloadIcon(url, dest);
        } else {
            iconPaths[name] = dest;
        }
    }

    // Inicializar presentación
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    // Paleta de colores basada en la plantilla de ejemplo (Claro de alto contraste)
    const COLORS = {
        bg: "FFFFFF",         // Fondo blanco
        grayBg: "F1F5F9",     // Gris claro para formas y círculos
        grayPanel: "F8FAFC",  // Gris más suave para paneles de contenido
        border: "E2E8F0",     // Gris de borde para cards
        textPrimary: "1F2937",// Gris oscuro/carbón para el texto principal
        textSec: "6B7280",    // Gris medio para descripciones secundarias
        primaryBlue: "2563EB",// Azul cobalto de la universidad (Acento principal)
        accentPurp: "7C3AED", // Morado real (Acento secundario)
        alertRed: "DC2626",   // Rojo para amenazas
        successGreen: "16A34A"// Verde para controles exitosos
    };

    // Helper: Cabecera estándar de diapositivas de contenido
    function addStandardHeader(slide, title, sectionName = "") {
        // Título superior
        slide.addText(title, {
            x: 0.5,
            y: 0.2,
            w: 6.5,
            h: 0.5,
            fontSize: 20,
            bold: true,
            color: COLORS.primaryBlue,
            fontFace: "Segoe UI"
        });

        // Sección a la derecha
        if (sectionName) {
            slide.addText(sectionName.toUpperCase(), {
                x: 5.0,
                y: 0.25,
                w: 4.5,
                h: 0.3,
                fontSize: 9,
                bold: true,
                color: COLORS.textSec,
                align: "right",
                fontFace: "Segoe UI"
            });
        }

        // Línea divisora
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: 0.5,
            y: 0.75,
            w: 9.0,
            h: 0.02,
            fill: { color: COLORS.border },
            line: { width: 0 }
        });

        // Watermark del pie de página
        slide.addText("Seguridad en IA & MLSecOps", {
            x: 0.5,
            y: 5.3,
            w: 5.0,
            h: 0.25,
            fontSize: 8.5,
            color: COLORS.textSec,
            fontFace: "Segoe UI"
        });
    }


    /* =========================================================================
       PLANTILLA 1: DIAPOSITIVA DE PORTADA (Matching Slide 1 of Template)
       ========================================================================= */
    const slide1 = pptx.addSlide();
    slide1.background = { color: COLORS.bg };

    // Rectángulo de fondo a la derecha (Panel de la imagen)
    slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.8, y: 1.1, w: 2.7, h: 3.5,
        fill: { color: COLORS.grayBg },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.05
    });

    // Icono de seguridad centrado en el panel derecho
    if (fs.existsSync(iconPaths['cyber-security'])) {
        slide1.addImage({
            path: iconPaths['cyber-security'],
            x: 7.25, y: 1.6, w: 1.8, h: 1.8
        });
    }

    // Elemento visual flotante (Shield)
    if (fs.existsSync(iconPaths['shield'])) {
        slide1.addImage({
            path: iconPaths['shield'],
            x: 8.8, y: 4.8, w: 0.6, h: 0.6
        });
    }

    // Título principal izquierdo
    slide1.addText([
        { text: "Seguridad en Inteligencia Artificial\n", options: { fontSize: 28, bold: true, color: COLORS.primaryBlue } },
        { text: "y MLSecOps", options: { fontSize: 32, bold: true, color: COLORS.textPrimary } }
    ], {
        x: 0.8, y: 1.3, w: 5.6, h: 1.5,
        fontFace: "Segoe UI",
        valign: "middle"
    });

    // Subtítulo
    slide1.addText("De la Ciberseguridad Tradicional a la Protección de Sistemas de IA Confiables", {
        x: 0.8, y: 2.8, w: 5.6, h: 0.6,
        fontSize: 12.5,
        color: COLORS.textSec,
        fontFace: "Segoe UI",
        italic: true
    });

    // Detalles del Docente y Expositor
    slide1.addText([
        { text: "Docente: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Ing. Diego Gamboa Mgtr.\n", options: { color: COLORS.textPrimary } },
        { text: "Expositor: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Leo Narváez\n", options: { color: COLORS.textPrimary } },
        { text: "Materia: ", options: { bold: true, color: COLORS.textSec } },
        { text: "Ciberseguridad en Sistemas Inteligentes", options: { color: COLORS.textSec } }
    ], {
        x: 0.8, y: 3.7, w: 5.6, h: 1.2,
        fontSize: 11.5,
        fontFace: "Segoe UI"
    });


    /* =========================================================================
       PLANTILLA 2: DIAPOSITIVA DE CONTENIDOS (Matching Slide 2 & 3 Arc Layout)
       ========================================================================= */
    const slide2 = pptx.addSlide();
    slide2.background = { color: COLORS.bg };

    // Círculo gigante a la izquierda que se sale del borde
    slide2.addShape(pptx.shapes.OVAL, {
        x: -3.0, y: -0.44, w: 6.5, h: 6.5,
        fill: { color: COLORS.grayBg },
        line: { width: 0 }
    });

    // Texto "Contenidos" rotado/centrado dentro del círculo
    slide2.addText("Contenidos", {
        x: 0.2, y: 2.3, w: 2.8, h: 1.0,
        fontSize: 26,
        bold: true,
        color: COLORS.primaryBlue,
        align: "center",
        valign: "middle",
        fontFace: "Segoe UI"
    });

    // Lista de contenidos a la derecha
    slide2.addText([
        { text: "•  01.  Introducción: de Ciberseguridad a MLSecOps\n\n", options: { bold: true, color: COLORS.textPrimary } },
        { text: "•  02.  Amenazas y vectores de ataque en IA\n\n", options: { bold: true, color: COLORS.textPrimary } },
        { text: "•  03.  Marco estratégico de protección: NIST AI RMF\n\n", options: { bold: true, color: COLORS.textPrimary } },
        { text: "•  04.  Controles técnicos para proteger modelos\n\n", options: { bold: true, color: COLORS.textPrimary } },
        { text: "•  05.  Seguridad en producción y MLSecOps", options: { bold: true, color: COLORS.textPrimary } }
    ], {
        x: 3.8, y: 1.3, w: 5.8, h: 3.8,
        fontSize: 14.5,
        fontFace: "Segoe UI",
        valign: "middle"
    });


    /* =========================================================================
       PLANTILLA 3: PORTADAS DE SECCIÓN (Matching Slide 4 of Template)
       ========================================================================= */
    function createSectionCover(numberStr, titleStr, iconName) {
        const slide = pptx.addSlide();
        slide.background = { color: COLORS.bg };

        // Panel azul vertical en el lado izquierdo
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: 0, y: 0, w: 3.3, h: 5.625,
            fill: { color: COLORS.primaryBlue },
            line: { width: 0 }
        });

        // Icono gigante en el panel izquierdo
        if (iconPaths[iconName] && fs.existsSync(iconPaths[iconName])) {
            slide.addImage({
                path: iconPaths[iconName],
                x: 0.65, y: 1.8, w: 2.0, h: 2.0
            });
        }

        // Número gigante
        slide.addText(numberStr, {
            x: 4.0, y: 1.8, w: 5.2, h: 1.0,
            fontSize: 72,
            bold: true,
            color: COLORS.primaryBlue,
            fontFace: "Segoe UI"
        });

        // Título de sección
        slide.addText(titleStr, {
            x: 4.0, y: 2.8, w: 5.2, h: 1.8,
            fontSize: 24,
            bold: true,
            color: COLORS.textPrimary,
            fontFace: "Segoe UI",
            valign: "top"
        });

        return slide;
    }

    // Diapositivas de sección 1
    createSectionCover("01", "Introducción: de Ciberseguridad a MLSecOps", "ai");


    /* =========================================================================
       DIAPOSITIVA 4: ¿QUÉ ES LA SEGURIDAD DE IA? (Visual Panel Left + Bullets Right)
       ========================================================================= */
    const slide4 = pptx.addSlide();
    slide4.background = { color: COLORS.bg };
    addStandardHeader(slide4, "¿Qué es la Seguridad de IA?", "01. Introducción y Paradigma");

    // Panel Izquierdo de concepto
    slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 4.2, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    // Barra vertical de acento azul dentro del panel
    slide4.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.primaryBlue },
        line: { width: 0 }
    });

    // Icono y Texto en el Panel
    if (fs.existsSync(iconPaths['ai'])) {
        slide4.addImage({ path: iconPaths['ai'], x: 0.8, y: 1.5, w: 0.5, h: 0.5 });
    }
    slide4.addText([
        { text: "Definición Central\n\n", options: { bold: true, fontSize: 13, color: COLORS.primaryBlue } },
        { text: "Consiste en proteger los activos de IA (modelos, datos de entrenamiento, pipelines e infraestructura) contra manipulaciones maliciosas, extracción de parámetros o robo de propiedad intelectual.\n\n", options: { fontSize: 10, color: COLORS.textPrimary } },
        { text: "Busca garantizar los pilares de la ciberseguridad tradicionales sumando la confianza y la seguridad física del sistema.", options: { fontSize: 9.5, color: COLORS.textSec } }
    ], {
        x: 0.8, y: 2.1, w: 3.6, h: 2.7,
        fontFace: "Segoe UI",
        valign: "top"
    });

    // Lista de Pilares a la derecha
    slide4.addText([
        { text: "• Confidencialidad en IA:\n", options: { bold: true, fontSize: 12, color: COLORS.primaryBlue } },
        { text: "  Prevenir la exfiltración de los pesos del modelo y datos privados.\n\n", options: { fontSize: 10.5, color: COLORS.textPrimary } },
        { text: "• Integridad en IA:\n", options: { bold: true, fontSize: 12, color: COLORS.primaryBlue } },
        { text: "  Garantizar que los inputs y las salidas no sean alteradas deliberadamente.\n\n", options: { fontSize: 10.5, color: COLORS.textPrimary } },
        { text: "• Disponibilidad en IA:\n", options: { bold: true, fontSize: 12, color: COLORS.primaryBlue } },
        { text: "  Asegurar que la API responda sin caer ante ataques de denegación de servicio.\n\n", options: { fontSize: 10.5, color: COLORS.textPrimary } },
        { text: "• Safety (Seguridad Física):\n", options: { bold: true, fontSize: 12, color: COLORS.primaryBlue } },
        { text: "  Prevenir fallas en la lógica probabilística que puedan dañar al entorno.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 5.1, y: 1.2, w: 4.4, h: 3.8,
        fontFace: "Segoe UI",
        valign: "top"
    });


    /* =========================================================================
       DIAPOSITIVA 5: COMPARATIVA (Matching Slide 11 Blue Table Layout)
       ========================================================================= */
    const slide5 = pptx.addSlide();
    slide5.background = { color: COLORS.bg };
    addStandardHeader(slide5, "Seguridad Tradicional vs. Seguridad de IA", "01. Introducción y Paradigma");

    // Construir Filas de la Tabla con estilos
    const tableHeaders = [
        { text: "Dimensión", options: { bold: true, color: "FFFFFF", fill: { color: COLORS.primaryBlue }, align: "center", fontFace: "Segoe UI" } },
        { text: "Aplicación Tradicional", options: { bold: true, color: "FFFFFF", fill: { color: COLORS.primaryBlue }, align: "center", fontFace: "Segoe UI" } },
        { text: "Modelo de IA", options: { bold: true, color: "FFFFFF", fill: { color: COLORS.primaryBlue }, align: "center", fontFace: "Segoe UI" } }
    ];

    const tableRows = [
        tableHeaders,
        [
            { text: "Lógica interna", options: { bold: true, fontFace: "Segoe UI", fill: { color: COLORS.grayPanel } } },
            { text: "Determinista y explícita. Escrita por ingenieros mediante código lógico (if/else).", options: { fontFace: "Segoe UI", fill: { color: COLORS.grayPanel } } },
            { text: "Probabilística y adaptativa. Aprendida implícitamente a partir de conjuntos de datos.", options: { fontFace: "Segoe UI", fill: { color: COLORS.grayPanel } } }
        ],
        [
            { text: "Datos de entrada", options: { bold: true, fontFace: "Segoe UI" } },
            { text: "Estructurados, formatos conocidos (JSON, XML). Validados por esquemas rígidos.", options: { fontFace: "Segoe UI" } },
            { text: "No estructurados e infinitos (lenguaje natural, imágenes, secuencias binarias).", options: { fontFace: "Segoe UI" } }
        ],
        [
            { text: "Vulnerabilidades", options: { bold: true, fontFace: "Segoe UI", fill: { color: COLORS.grayPanel } } },
            { text: "Errores lógicos de código, inyecciones (SQL/XSS), overflows de buffer.", options: { fontFace: "Segoe UI", fill: { color: COLORS.grayPanel } } },
            { text: "Data poisoning, adversarial examples, inyecciones de prompts, robo de pesos.", options: { fontFace: "Segoe UI", fill: { color: COLORS.grayPanel } } }
        ],
        [
            { text: "Enfoque defensivo", options: { bold: true, fontFace: "Segoe UI" } },
            { text: "Seguridad de red, firewalls, control de acceso de usuarios, firma de ejecutables.", options: { fontFace: "Segoe UI" } },
            { text: "Monitoreo de inputs/outputs, guardrails semánticos, sandboxing e integridad de tensores.", options: { fontFace: "Segoe UI" } }
        ]
    ];

    slide5.addTable(tableRows, {
        x: 0.5, y: 1.2, w: 9.0, h: 3.8,
        fontSize: 10,
        color: COLORS.textPrimary,
        border: { pt: 1, color: COLORS.border },
        valign: "middle"
    });


    /* =========================================================================
       DIAPOSITIVA 6: IA CONFIABLE & NIST (2x2 Quadrant Grid - Matching Slide 16)
       ========================================================================= */
    const slide6 = pptx.addSlide();
    slide6.background = { color: COLORS.bg };
    addStandardHeader(slide6, "Concepto de IA Confiable (NIST AI RMF)", "01. Introducción y Paradigma");

    const quadrants = [
        {
            num: "01",
            title: "Validez y Confiabilidad",
            desc: "Precisión y comportamiento consistente del modelo ante diferentes contextos operativos, mitigando desviaciones o respuestas incoherentes."
        },
        {
            num: "02",
            title: "Seguridad y Resiliencia",
            desc: "Capacidad de resistir ataques deliberados y recuperarse con éxito. El sistema debe operar de forma segura ante datos fuera de distribución."
        },
        {
            num: "03",
            title: "Explicabilidad y Transparencia",
            desc: "Las decisiones del modelo no deben ser cajas negras. Se debe poder auditar, trazar y explicar a humanos el origen de la inferencia."
        },
        {
            num: "04",
            title: "Privacidad y Equidad",
            desc: "Garantizar la protección de datos personales de entrenamiento y la mitigación activa de sesgos discriminatorios en las respuestas."
        }
    ];

    quadrants.forEach((q, index) => {
        const xOffset = index % 2 === 0 ? 0.5 : 5.2;
        const yOffset = index < 2 ? 1.2 : 3.2;

        // Cuadrado del número
        slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: xOffset, y: yOffset, w: 0.6, h: 0.6,
            fill: { color: COLORS.primaryBlue },
            line: { width: 0 },
            rectRadius: 0.08
        });
        slide6.addText(q.num, {
            x: xOffset, y: yOffset, w: 0.6, h: 0.6,
            fontSize: 14, bold: true, color: "FFFFFF",
            align: "center", valign: "middle", fontFace: "Segoe UI"
        });

        // Título del bloque
        slide6.addText(q.title, {
            x: xOffset + 0.75, y: yOffset, w: 3.55, h: 0.6,
            fontSize: 13.5, bold: true, color: COLORS.primaryBlue,
            valign: "middle", fontFace: "Segoe UI"
        });

        // Descripción
        slide6.addText(q.desc, {
            x: xOffset, y: yOffset + 0.7, w: 4.3, h: 0.9,
            fontSize: 10.5, color: COLORS.textPrimary,
            valign: "top", fontFace: "Segoe UI"
        });
    });


    // Sección 2 Divider
    createSectionCover("02", "Amenazas y Vectores de Ataque en IA", "bug");


    /* =========================================================================
       DIAPOSITIVA 8: ATAQUES EN DATOS (Two Columns Layout)
       ========================================================================= */
    const slide8 = pptx.addSlide();
    slide8.background = { color: COLORS.bg };
    addStandardHeader(slide8, "Ataques en Datos y Fase de Entrada", "02. Amenazas y Vectores de Ataque");

    // Columna Izquierda: Poisoning
    slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 4.3, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.04
    });
    slide8.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.alertRed },
        line: { width: 0 }
    });
    if (fs.existsSync(iconPaths['poison'])) {
        slide8.addImage({ path: iconPaths['poison'], x: 0.8, y: 1.4, w: 0.45, h: 0.45 });
    }
    slide8.addText([
        { text: "Data Poisoning (Entrenamiento)\n\n", options: { bold: true, fontSize: 13, color: COLORS.alertRed } },
        { text: "• ¿Qué es? ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Contaminación deliberada del dataset. El atacante inserta registros falsos, altera etiquetas o inyecta firmas específicas.\n\n" },
        { text: "• Impacto: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Creación de backdoors en el modelo. El modelo aprende atajos maliciosos para responder de forma incorrecta ante disparadores específicos creados por el atacante en producción." }
    ], {
        x: 0.8, y: 2.0, w: 3.8, h: 2.8,
        fontSize: 10.5, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });

    // Columna Derecha: Adversarial Examples
    slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.2, y: 1.2, w: 4.3, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.04
    });
    slide8.addShape(pptx.shapes.RECTANGLE, {
        x: 5.2, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.alertRed },
        line: { width: 0 }
    });
    if (fs.existsSync(iconPaths['bug'])) {
        slide8.addImage({ path: iconPaths['bug'], x: 5.5, y: 1.4, w: 0.45, h: 0.45 });
    }
    slide8.addText([
        { text: "Adversarial Examples (Inferencia)\n\n", options: { bold: true, fontSize: 13, color: COLORS.alertRed } },
        { text: "• ¿Qué es? ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Modificación imperceptible del dato de entrada (ruido matemático) optimizada para alterar el comportamiento probabilístico de la IA.\n\n" },
        { text: "• Impacto: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Ataques de evasión. Hace que clasificadores de visión fallen, o que filtros de malware/spam clasifiquen código malicioso como legítimo en producción." }
    ], {
        x: 5.5, y: 2.0, w: 3.8, h: 2.8,
        fontSize: 10.5, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });


    /* =========================================================================
       DIAPOSITIVA 9 [NUEVO]: GRÁFICO DE BARRAS - IMPACTO DE ATAQUES EVASIVOS (Corregido Strings)
       ========================================================================= */
    const slide9 = pptx.addSlide();
    slide9.background = { color: COLORS.bg };
    addStandardHeader(slide9, "Impacto del Ataque Evasivo y Defensa", "02. Amenazas y Vectores de Ataque");

    // Panel Izquierdo: Formulación matemática
    slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 4.2, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    slide9.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.primaryBlue },
        line: { width: 0 }
    });
    slide9.addText([
        { text: "Modelo Matemático FGSM\n\n", options: { bold: true, fontSize: 13, color: COLORS.primaryBlue } },
        { text: "Algoritmo de Evasión (Fast Gradient Sign Method):\n", options: { bold: true, color: COLORS.textPrimary } },
        { text: "x_adv = x + ε • sign( ∇_x L(θ, x, y) )\n\n", options: { fontFace: "Courier New", fontSize: 11, bold: true, color: COLORS.alertRed } },
        { text: "• x_adv: ", options: { bold: true } },
        { text: "Entrada adversaria generada (imagen o texto alterado).\n" },
        { text: "• ε (Épsilon): ", options: { bold: true } },
        { text: "Límite de presupuesto del ruido (casi invisible al ojo).\n" },
        { text: "• ∇_x L: ", options: { bold: true } },
        { text: "Gradiente de la pérdida respecto al input. Indica la dirección para maximizar el error del modelo.\n" },
        { text: "• sign: ", options: { bold: true } },
        { text: "Función de signo (+1 o -1)." }
    ], {
        x: 0.8, y: 1.4, w: 3.6, h: 3.4,
        fontSize: 10, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });

    // Gráfico de Columnas en el lado derecho
    const chartAdversarialData = [
        {
            name: "Precisión del Modelo (%)",
            labels: ["Sin Ataque", "Bajo FGSM (No Def)", "Con Entrenam. Adv"],
            values: [96, 12, 78]
        }
    ];

    slide9.addChart(pptx.ChartType.bar, chartAdversarialData, {
        x: 5.1, y: 1.2, w: 4.4, h: 3.8,
        barDir: "col",
        chartColors: [COLORS.primaryBlue],
        showValue: true,
        valAxisMaxVal: 100,
        valAxisMinVal: 0,
        showLegend: false,
        title: "Precisión F1 del Clasificador ante Ataque FGSM",
        titleColor: COLORS.textPrimary,
        titleFontSize: 11,
        catAxisLabelColor: COLORS.textPrimary,
        valAxisLabelColor: COLORS.textSec
    });


    /* =========================================================================
       DIAPOSITIVA 10: TIMELINE PRIVACIDAD (Matching Slide 20 Timeline Layout)
       ========================================================================= */
    const slide10 = pptx.addSlide();
    slide10.background = { color: COLORS.bg };
    addStandardHeader(slide10, "Robo de Modelos y Ataques a la Privacidad", "02. Amenazas y Vectores de Ataque");

    // Gráfico de panel a la izquierda
    slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 3.0, h: 3.8,
        fill: { color: COLORS.grayBg },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    if (fs.existsSync(iconPaths['database'])) {
        slide10.addImage({
            path: iconPaths['database'],
            x: 1.0, y: 2.1, w: 2.0, h: 2.0
        });
    }

    // Línea vertical punteada de la línea de tiempo
    slide10.addShape(pptx.shapes.LINE, {
        x: 4.2, y: 1.4, w: 0, h: 3.2,
        line: { color: COLORS.primaryBlue, width: 2, dashType: "dash" }
    });

    // Nodos circulares de la línea de tiempo
    slide10.addShape(pptx.shapes.OVAL, { x: 4.1, y: 1.6, w: 0.2, h: 0.2, fill: { color: COLORS.primaryBlue }, line: { width: 0 } });
    slide10.addShape(pptx.shapes.OVAL, { x: 4.1, y: 3.2, w: 0.2, h: 0.2, fill: { color: COLORS.primaryBlue }, line: { width: 0 } });

    // Bloque 1 de texto (Model Extraction)
    slide10.addText([
        { text: "Model Extraction (Robo del Modelo)\n", options: { bold: true, fontSize: 13, color: COLORS.primaryBlue } },
        { text: "Clonación sistemática del comportamiento. Mediante miles de consultas estructuradas a la API del modelo, el atacante analiza las respuestas y entrena un modelo sustituto, robando la propiedad intelectual corporativa.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 4.5, y: 1.4, w: 5.0, h: 1.3,
        fontFace: "Segoe UI",
        valign: "top"
    });

    // Bloque 2 de texto (Model Inversion)
    slide10.addText([
        { text: "Model Inversion & Membership Inference\n", options: { bold: true, fontSize: 13, color: COLORS.primaryBlue } },
        { text: "Reconstrucción de datos de entrenamiento. El atacante analiza las distribuciones de probabilidad de salida para reconstruir registros sensibles que se usaron en el entrenamiento, violando la privacidad de datos personales.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 4.5, y: 3.0, w: 5.0, h: 1.3,
        fontFace: "Segoe UI",
        valign: "top"
    });


    /* =========================================================================
       DIAPOSITIVA 11: HORIZONTAL COLOR BLOCKS (Matching Slide 25 Style)
       ========================================================================= */
    const slide11 = pptx.addSlide();
    slide11.background = { color: COLORS.bg };
    addStandardHeader(slide11, "Inyecciones de Prompts en LLMs", "02. Amenazas y Vectores de Ataque");

    // Gráfico izquierdo
    slide11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 3.4, h: 3.8,
        fill: { color: COLORS.grayBg },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    if (fs.existsSync(iconPaths['warning'])) {
        slide11.addImage({
            path: iconPaths['warning'],
            x: 1.2, y: 2.1, w: 2.0, h: 2.0
        });
    }

    // 3 Tarjetas Horizontales con degradado de color (Azul cobalto a azul profundo)
    const horizCards = [
        {
            y: 1.2,
            color: "2563EB",
            title: "Prompt Injection Directa (Jailbreaking)",
            desc: "El usuario manipula la conversación para saltarse las directrices éticas y reglas de seguridad ('Ignora tus instrucciones previas...')."
        },
        {
            y: 2.5,
            color: "1D4ED8",
            title: "Prompt Injection Indirecta",
            desc: "El LLM lee contenido externo infectado (ej. página web o PDF) y ejecuta las instrucciones ocultas sin consentimiento del usuario final."
        },
        {
            y: 3.8,
            color: "1E3A8A",
            title: "Fuga de Datos Corporativos (Data Leakage)",
            desc: "Exposición inadvertida de datos sensibles o secretos API al enviarlos en prompts a LLMs comerciales que los usan para re-entrenamiento."
        }
    ];

    horizCards.forEach((card) => {
        slide11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 4.3, y: card.y, w: 5.2, h: 1.1,
            fill: { color: card.color },
            line: { width: 0 },
            rectRadius: 0.05
        });

        slide11.addText([
            { text: card.title + "\n", options: { bold: true, fontSize: 11, color: "FFFFFF" } },
            { text: card.desc, options: { fontSize: 9.5, color: "FFFFFF" } }
        ], {
            x: 4.5, y: card.y + 0.1, w: 4.8, h: 0.9,
            fontFace: "Segoe UI",
            valign: "middle"
        });
    });


    /* =========================================================================
       DIAPOSITIVA 12: MARCOS DE REFERENCIA (Two columns)
       ========================================================================= */
    const slide12 = pptx.addSlide();
    slide12.background = { color: COLORS.bg };
    addStandardHeader(slide12, "MITRE ATLAS & OWASP Top 10", "02. Amenazas y Vectores de Ataque");

    // Columna Izquierda: MITRE ATLAS
    slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 4.3, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.04
    });
    slide12.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.accentPurp },
        line: { width: 0 }
    });
    if (fs.existsSync(iconPaths['shield'])) {
        slide12.addImage({ path: iconPaths['shield'], x: 0.8, y: 1.4, w: 0.45, h: 0.45 });
    }
    slide12.addText([
        { text: "MITRE ATLAS\n\n", options: { bold: true, fontSize: 13, color: COLORS.accentPurp } },
        { text: "Adversarial Threat Landscape for Artificial-Intelligence Systems.\n\n", options: { fontSize: 10, italic: true, color: COLORS.textSec } },
        { text: "• Base de Conocimiento Global: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Una matriz estructurada de tácticas, técnicas y procedimientos (TTP) basados en incidentes reales y experimentales.\n\n" },
        { text: "• Aplicación: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Ayuda a modelar las brechas de seguridad en el pipeline de desarrollo de aprendizaje automático y a diseñar alertas de detección tempranas." }
    ], {
        x: 0.8, y: 2.0, w: 3.8, h: 2.8,
        fontSize: 10, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });

    // Columna Derecha: OWASP Top 10 LLM
    slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.2, y: 1.2, w: 4.3, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.04
    });
    slide12.addShape(pptx.shapes.RECTANGLE, {
        x: 5.2, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.accentPurp },
        line: { width: 0 }
    });
    if (fs.existsSync(iconPaths['bug'])) {
        slide12.addImage({ path: iconPaths['bug'], x: 5.5, y: 1.4, w: 0.45, h: 0.45 });
    }
    slide12.addText([
        { text: "OWASP Top 10 para LLMs\n\n", options: { bold: true, fontSize: 13, color: COLORS.accentPurp } },
        { text: "Los riesgos de seguridad de aplicaciones de lenguaje más críticos.\n\n", options: { fontSize: 10, italic: true, color: COLORS.textSec } },
        { text: "• Enfoque de Aplicación: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Clasifica los 10 errores y fallos más comunes al programar software sobre LLMs (ej: inyecciones, outputs no sanitizados, dependencias de modelos comprometidas).\n\n" },
        { text: "• Utilidad: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Establece una guía para desarrolladores de APIs e integradores de software sobre IA." }
    ], {
        x: 5.5, y: 2.0, w: 3.8, h: 2.8,
        fontSize: 10, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });


    // Sección 3 Divider
    createSectionCover("03", "Marco Estratégico: NIST AI RMF", "shield");


    /* =========================================================================
       DIAPOSITIVA 14: GOVERN Y MAP (Two Columns Layout)
       ========================================================================= */
    const slide14 = pptx.addSlide();
    slide14.background = { color: COLORS.bg };
    addStandardHeader(slide14, "NIST AI RMF: GOVERN y MAP", "03. Marco Estratégico: NIST AI RMF");

    // Columna Izquierda: GOVERN
    slide14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 4.3, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.04
    });
    slide14.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.accentPurp },
        line: { width: 0 }
    });
    if (fs.existsSync(iconPaths['nist'])) {
        slide14.addImage({ path: iconPaths['nist'], x: 0.8, y: 1.4, w: 0.45, h: 0.45 });
    }
    slide14.addText([
        { text: "GOVERN (Gobernar)\n\n", options: { bold: true, fontSize: 13, color: COLORS.accentPurp } },
        { text: "Pilar transversal que determina la cultura de riesgo dentro de la organización.\n\n", options: { fontSize: 10, color: COLORS.textSec } },
        { text: "• Políticas Organizacionales: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Crear reglas explícitas sobre el uso ético y de ciberseguridad en IA.\n\n" },
        { text: "• Roles y Responsabilidad: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Establecer quién es responsable del ciclo de vida del modelo y del cumplimiento de normas (ej: Ley de IA)." }
    ], {
        x: 0.8, y: 2.0, w: 3.8, h: 2.8,
        fontSize: 10, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });

    // Columna Derecha: MAP
    slide14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.2, y: 1.2, w: 4.3, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.04
    });
    slide14.addShape(pptx.shapes.RECTANGLE, {
        x: 5.2, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.accentPurp },
        line: { width: 0 }
    });
    if (fs.existsSync(iconPaths['settings'])) {
        slide14.addImage({ path: iconPaths['settings'], x: 5.5, y: 1.4, w: 0.45, h: 0.45 });
    }
    slide14.addText([
        { text: "MAP (Mapear)\n\n", options: { bold: true, fontSize: 13, color: COLORS.accentPurp } },
        { text: "Identificar y clasificar el contexto técnico y funcional del sistema.\n\n", options: { fontSize: 10, color: COLORS.textSec } },
        { text: "• Inventario de Activos: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Catalogar datasets, dependencias de APIs de terceros e hiperparámetros de modelos de base.\n\n" },
        { text: "• Modelado de Amenazas: ", options: { bold: true, color: COLORS.textPrimary } },
        { text: "Definir de qué forma un fallo del modelo o una manipulación afecta a los procesos de negocio." }
    ], {
        x: 5.5, y: 2.0, w: 3.8, h: 2.8,
        fontSize: 10, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });


    /* =========================================================================
       DIAPOSITIVA 15: MEASURE & MANAGE (Timeline Layout - Matching Slide 20)
       ========================================================================= */
    const slide15 = pptx.addSlide();
    slide15.background = { color: COLORS.bg };
    addStandardHeader(slide15, "NIST AI RMF: MEASURE y MANAGE", "03. Marco Estratégico: NIST AI RMF");

    // Gráfico de panel a la izquierda
    slide15.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 3.0, h: 3.8,
        fill: { color: COLORS.grayBg },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    if (fs.existsSync(iconPaths['shield'])) {
        slide15.addImage({
            path: iconPaths['shield'],
            x: 1.0, y: 2.1, w: 2.0, h: 2.0
        });
    }

    // Línea vertical punteada
    slide15.addShape(pptx.shapes.LINE, {
        x: 4.2, y: 1.4, w: 0, h: 3.2,
        line: { color: COLORS.accentPurp, width: 2, dashType: "dash" }
    });

    // Nodos
    slide15.addShape(pptx.shapes.OVAL, { x: 4.1, y: 1.6, w: 0.2, h: 0.2, fill: { color: COLORS.accentPurp }, line: { width: 0 } });
    slide15.addShape(pptx.shapes.OVAL, { x: 4.1, y: 3.2, w: 0.2, h: 0.2, fill: { color: COLORS.accentPurp }, line: { width: 0 } });

    // Bloque 1: MEASURE
    slide15.addText([
        { text: "MEASURE (Medir)\n", options: { bold: true, fontSize: 13, color: COLORS.accentPurp } },
        { text: "Auditoría analítica y métricas cuantitativas. Simulación sistemática de ataques de evasión (red teaming), cálculo de la degradación de la precisión, monitorización de sesgos algorítmicos y auditorías de privacidad en datasets.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 4.5, y: 1.4, w: 5.0, h: 1.3,
        fontFace: "Segoe UI",
        valign: "top"
    });

    // Bloque 2: MANAGE
    slide15.addText([
        { text: "MANAGE (Gestionar)\n", options: { bold: true, fontSize: 13, color: COLORS.accentPurp } },
        { text: "Operación de seguridad e incidentes. Implementación activa de guardrails técnicos sobre peticiones, ejecución de planes de mitigación semántica, cuarentena de APIs y re-entrenamiento de pesos comprometidos.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 4.5, y: 3.0, w: 5.0, h: 1.3,
        fontFace: "Segoe UI",
        valign: "top"
    });


    // Sección 4 Divider
    createSectionCover("04", "Controles Técnicos para Proteger Modelos", "settings");


    /* =========================================================================
       DIAPOSITIVA 17: CONTROLES DATOS (3 Column Card Grid - Matching Slide 41)
       ========================================================================= */
    const slide17 = pptx.addSlide();
    slide17.background = { color: COLORS.bg };
    addStandardHeader(slide17, "Controles Técnicos: Datos y Entrenamiento", "04. Controles Técnicos");

    const controlsData = [
        {
            x: 0.5,
            icon: "database",
            color: COLORS.successGreen,
            title: "Sanitización de Datasets",
            body: "• Limpieza y Filtrado: Eliminar datos maliciosos, etiquetas alteradas y duplicados que distorsionen el entrenamiento.\n\n• Detección de Anomalías: Analizar firmas latentes estadísticas de los datos para ubicar patrones sintéticos (envenenados)."
        },
        {
            x: 3.6,
            icon: "settings",
            color: COLORS.successGreen,
            title: "Control de Versiones",
            body: "• Trazabilidad (DVC): Registrar la correspondencia biunívoca exacta entre el dataset físico y los pesos resultantes.\n\n• Firma Criptográfica: Firmar los hashes del dataset para evitar alteraciones silenciosas antes de iniciar el compilado."
        },
        {
            x: 6.7,
            icon: "shield",
            color: COLORS.successGreen,
            title: "Entrenamiento Adversario",
            body: "• Robustez Inicial: Generar ejemplos adversarios durante la optimización del modelo e introducirlos en el entrenamiento.\n\n• Resiliencia: La IA minimiza el impacto del ruido imperceptible, haciéndose inmune a la evasión en producción."
        }
    ];

    controlsData.forEach((card) => {
        // Caja de fondo
        slide17.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: card.x, y: 1.2, w: 2.8, h: 3.8,
            fill: { color: COLORS.grayPanel },
            line: { color: COLORS.border, width: 1.5 },
            rectRadius: 0.04
        });

        // Icono superior
        if (fs.existsSync(iconPaths[card.icon])) {
            slide17.addImage({
                path: iconPaths[card.icon],
                x: card.x + 0.2, y: 1.4, w: 0.4, h: 0.4
            });
        }

        // Título del control
        slide17.addText(card.title, {
            x: card.x + 0.2, y: 1.9, w: 2.4, h: 0.4,
            fontSize: 12.5, bold: true, color: card.color, fontFace: "Segoe UI"
        });

        // Contenido
        slide17.addText(card.body, {
            x: card.x + 0.2, y: 2.4, w: 2.4, h: 2.4,
            fontSize: 9.5, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
        });
    });


    /* =========================================================================
       DIAPOSITIVA 18: CONTROLES INTEGRIDAD (3 Column Card Grid)
       ========================================================================= */
    const slide18 = pptx.addSlide();
    slide18.background = { color: COLORS.bg };
    addStandardHeader(slide18, "Controles Técnicos: Integridad y Aislamiento", "04. Controles Técnicos");

    const controlsIntegrity = [
        {
            x: 0.5,
            icon: "nist",
            color: COLORS.successGreen,
            title: "Firma de Pesos (Hashes)",
            body: "• Verificación SHA-256: Generar un hash único de los pesos del modelo al compilarse.\n\n• Integridad en Memoria: El servidor comprueba la firma del hash antes de montar el tensor en memoria RAM, evitando modificaciones silenciosas."
        },
        {
            x: 3.6,
            icon: "warning",
            color: COLORS.successGreen,
            title: "Serialización Segura",
            body: "• Bloqueo de Pickles (.pkl): Prohibir formatos vulnerables a ejecución remota de código (RCE).\n\n• Safetensors: Utilizar formatos de serialización planos libres de cabeceras ejecutables (solo almacenan tensores puros)."
        },
        {
            x: 6.7,
            icon: "network",
            color: COLORS.successGreen,
            title: "Entornos Aislados",
            body: "• Sandboxing de Inferencia: Ejecutar los pipelines de predicción en contenedores con permisos reducidos.\n\n• Restricción de Red: Segmentación a nivel de red para evitar la exfiltración o conexiones externas maliciosas."
        }
    ];

    controlsIntegrity.forEach((card) => {
        slide18.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: card.x, y: 1.2, w: 2.8, h: 3.8,
            fill: { color: COLORS.grayPanel },
            line: { color: COLORS.border, width: 1.5 },
            rectRadius: 0.04
        });
        if (fs.existsSync(iconPaths[card.icon])) {
            slide18.addImage({ path: iconPaths[card.icon], x: card.x + 0.2, y: 1.4, w: 0.4, h: 0.4 });
        }
        slide18.addText(card.title, {
            x: card.x + 0.2, y: 1.9, w: 2.4, h: 0.4,
            fontSize: 12.5, bold: true, color: card.color, fontFace: "Segoe UI"
        });
        slide18.addText(card.body, {
            x: card.x + 0.2, y: 2.4, w: 2.4, h: 2.4,
            fontSize: 9.5, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
        });
    });


    /* =========================================================================
       DIAPOSITIVA 19: CONTROLES GUARDRAILS Y APIS (3 Column Card Grid)
       ========================================================================= */
    const slide19 = pptx.addSlide();
    slide19.background = { color: COLORS.bg };
    addStandardHeader(slide19, "Controles Técnicos: Guardrails e Interfaces", "04. Controles Técnicos");

    const controlsGuardrails = [
        {
            x: 0.5,
            icon: "shield",
            color: COLORS.successGreen,
            title: "Guardrails en LLMs",
            body: "• Clasificación Semántica: Interceptar los prompts del usuario antes del LLM (con Llama Guard) para bloquear jailbreaks.\n\n• Validación de Salidas: Filtrar respuestas inapropiadas o que contengan datos confidenciales (PII)."
        },
        {
            x: 3.6,
            icon: "settings",
            color: COLORS.successGreen,
            title: "Sanitización de Inputs",
            body: "• Filtrado de Prompts: Sanitizar palabras prohibidas y expresiones regulares sospechosas.\n\n• Suavizado en Visión: Aplicar ligeras compresiones a las imágenes de entrada para destruir el alineamiento imperceptible del ruido adversario."
        },
        {
            x: 6.7,
            icon: "api",
            color: COLORS.successGreen,
            title: "Seguridad de la API",
            body: "• Rate Limiting: Restringir las consultas por segundo (RPS) de cada API Key para bloquear la extracción.\n\n• Confianzas Aleatorias: Perturbar de forma sutil las confianzas matemáticas del resultado final, frustrando la ingeniería inversa."
        }
    ];

    controlsGuardrails.forEach((card) => {
        slide19.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: card.x, y: 1.2, w: 2.8, h: 3.8,
            fill: { color: COLORS.grayPanel },
            line: { color: COLORS.border, width: 1.5 },
            rectRadius: 0.04
        });
        if (fs.existsSync(iconPaths[card.icon])) {
            slide19.addImage({ path: iconPaths[card.icon], x: card.x + 0.2, y: 1.4, w: 0.4, h: 0.4 });
        }
        slide19.addText(card.title, {
            x: card.x + 0.2, y: 1.9, w: 2.4, h: 0.4,
            fontSize: 12.5, bold: true, color: card.color, fontFace: "Segoe UI"
        });
        slide19.addText(card.body, {
            x: card.x + 0.2, y: 2.4, w: 2.4, h: 2.4,
            fontSize: 9.5, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
        });
    });


    // Sección 5 Divider
    createSectionCover("05", "Seguridad en Producción y MLSecOps", "monitoring");


    /* =========================================================================
       DIAPOSITIVA 21: PIPELINE MLSECOPS (Timeline/Process Layout)
       ========================================================================= */
    const slide21 = pptx.addSlide();
    slide21.background = { color: COLORS.bg };
    addStandardHeader(slide21, "El Pipeline de MLSecOps", "05. Seguridad en Producción y MLSecOps");

    // Gráfico de panel a la izquierda
    slide21.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 3.0, h: 3.8,
        fill: { color: COLORS.grayBg },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    if (fs.existsSync(iconPaths['network'])) {
        slide21.addImage({
            path: iconPaths['network'],
            x: 1.0, y: 2.1, w: 2.0, h: 2.0
        });
    }

    // Línea vertical punteada
    slide21.addShape(pptx.shapes.LINE, {
        x: 4.2, y: 1.4, w: 0, h: 3.2,
        line: { color: COLORS.primaryBlue, width: 2, dashType: "dash" }
    });

    // Nodos
    slide21.addShape(pptx.shapes.OVAL, { x: 4.1, y: 1.6, w: 0.2, h: 0.2, fill: { color: COLORS.primaryBlue }, line: { width: 0 } });
    slide21.addShape(pptx.shapes.OVAL, { x: 4.1, y: 3.2, w: 0.2, h: 0.2, fill: { color: COLORS.primaryBlue }, line: { width: 0 } });

    // Bloque 1: Integración Continua (CI/CD) Seguro
    slide21.addText([
        { text: "CI/CD Seguro en Aprendizaje Automático\n", options: { bold: true, fontSize: 13, color: COLORS.primaryBlue } },
        { text: "Automatización de auditorías en el pipeline. Incluye el escaneo de bibliotecas de dependencias Python (buscando vulnerabilidades conocidas/CVEs) y el escaneo estático de binarios de pesos de modelos (Model Scan) antes de autorizar el release.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 4.5, y: 1.4, w: 5.0, h: 1.3,
        fontFace: "Segoe UI",
        valign: "top"
    });

    // Bloque 2: Logs e Inmutabilidad
    slide21.addText([
        { text: "Auditoría Forense y Logs de Inferencia\n", options: { bold: true, fontSize: 13, color: COLORS.primaryBlue } },
        { text: "Registro de inputs y respuestas. Conservación cifrada e inmutable de los prompts, respuestas y hashes de los datos consultados. Anonimización forzosa de la información confidencial (PII) para evitar la filtración semántica.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 4.5, y: 3.0, w: 5.0, h: 1.3,
        fontFace: "Segoe UI",
        valign: "top"
    });


    /* =========================================================================
       DIAPOSITIVA 22 [NUEVO]: GRÁFICO DE LÍNEAS - DATA DRIFT (PSI) (Corregido Strings)
       ========================================================================= */
    const slide22 = pptx.addSlide();
    slide22.background = { color: COLORS.bg };
    addStandardHeader(slide22, "Monitoreo de Data Drift (Desviación)", "05. Seguridad en Producción y MLSecOps");

    // Panel Izquierdo: Concepto estadístico
    slide22.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 4.2, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    slide22.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.accentPurp },
        line: { width: 0 }
    });
    slide22.addText([
        { text: "Estabilidad de Distribución\n\n", options: { bold: true, fontSize: 13, color: COLORS.accentPurp } },
        { text: "• Métricas de Drift: ", options: { bold: true } },
        { text: "Compara la distribución probabilística de los datos recibidos en producción contra los de entrenamiento.\n\n" },
        { text: "• Population Stability Index (PSI):\n", options: { bold: true, color: COLORS.textPrimary } },
        { text: "  - PSI < 0.1: ", options: { bold: true, color: COLORS.successGreen } },
        { text: "Estable; sin cambios en los datos.\n" },
        { text: "  - 0.1 <= PSI < 0.25: ", options: { bold: true, color: COLORS.primaryBlue } },
        { text: "Desviación moderada.\n" },
        { text: "  - PSI >= 0.25: ", options: { bold: true, color: COLORS.alertRed } },
        { text: "Desviación crítica (alerta de re-entrenamiento).\n\n" },
        { text: "• Wasserstein Distance: ", options: { bold: true } },
        { text: "Distancia métrica (Earth Mover's Distance) para variables continuas." }
    ], {
        x: 0.8, y: 1.4, w: 3.6, h: 3.4,
        fontSize: 9.5, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });

    // Gráfico de Línea del PSI a la derecha
    const chartDriftData = [
        {
            name: "Métrica PSI",
            labels: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
            values: [0.04, 0.06, 0.05, 0.08, 0.13, 0.14, 0.21, 0.29, 0.36, 0.44]
        }
    ];

    slide22.addChart(pptx.ChartType.line, chartDriftData, {
        x: 5.1, y: 1.2, w: 4.4, h: 3.8,
        lineSmooth: true,
        chartColors: [COLORS.accentPurp],
        showLegend: false,
        title: "Evolución de Estabilidad (PSI) por Lotes de Inferencia",
        titleColor: COLORS.textPrimary,
        titleFontSize: 11,
        catAxisLabelColor: COLORS.textPrimary,
        valAxisLabelColor: COLORS.textSec
    });


    /* =========================================================================
       DIAPOSITIVA 23 [NUEVO]: GRÁFICO DE LÍNEAS - CONCEPT DRIFT (Corregido Strings)
       ========================================================================= */
    const slide23 = pptx.addSlide();
    slide23.background = { color: COLORS.bg };
    addStandardHeader(slide23, "Concept Drift y Degradación de Precisión", "05. Seguridad en Producción y MLSecOps");

    // Panel Izquierdo: Concepto estadístico
    slide23.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 4.2, h: 3.8,
        fill: { color: COLORS.grayPanel },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    slide23.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.2, w: 0.08, h: 3.8,
        fill: { color: COLORS.alertRed },
        line: { width: 0 }
    });
    slide23.addText([
        { text: "Cambio de Concepto P(Y | X)\n\n", options: { bold: true, fontSize: 13, color: COLORS.alertRed } },
        { text: "• Definición: ", options: { bold: true } },
        { text: "La relación real entre las variables de entrada (X) y la variable objetivo (Y) ha cambiado con el tiempo.\n\n" },
        { text: "• Impacto en Negocio: ", options: { bold: true } },
        { text: "La precisión real del modelo decae de forma crítica incluso si la distribución de datos de entrada es idéntica (Data Drift estable).\n\n" },
        { text: "• Solución de Emergencia: ", options: { bold: true, color: COLORS.successGreen } },
        { text: "Lanzar un proceso de re-entrenamiento continuo (Retraining) o revertir (Rollback) a un modelo base robusto." }
    ], {
        x: 0.8, y: 1.4, w: 3.6, h: 3.4,
        fontSize: 10, color: COLORS.textPrimary, fontFace: "Segoe UI", valign: "top"
    });

    // Gráfico de línea del F1-Score cayendo y recuperando tras re-entrenamiento
    const chartAccuracyData = [
        {
            name: "F1-Score del Modelo (%)",
            labels: ["Ene", "Feb", "Mar", "Abr*", "May*", "Jun (Re-entrenado)"],
            values: [94, 93, 89, 72, 63, 91]
        }
    ];

    slide23.addChart(pptx.ChartType.line, chartAccuracyData, {
        x: 5.1, y: 1.2, w: 4.4, h: 3.8,
        lineSmooth: true,
        chartColors: [COLORS.primaryBlue],
        showLegend: false,
        title: "Efecto de Concept Drift y Recuperación por Re-entrenamiento",
        titleColor: COLORS.textPrimary,
        titleFontSize: 11,
        catAxisLabelColor: COLORS.textPrimary,
        valAxisLabelColor: COLORS.textSec
    });


    /* =========================================================================
       DIAPOSITIVA 24: RESPUESTA A INCIDENTES EN CALIENTE (Dashed Timeline)
       ========================================================================= */
    const slide24 = pptx.addSlide();
    slide24.background = { color: COLORS.bg };
    addStandardHeader(slide24, "Respuesta ante Incidentes en Caliente", "05. Seguridad en Producción y MLSecOps");

    // Gráfico de panel a la izquierda
    slide24.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.2, w: 3.0, h: 3.8,
        fill: { color: COLORS.grayBg },
        line: { color: COLORS.border, width: 1.5 },
        rectRadius: 0.04
    });
    if (fs.existsSync(iconPaths['shield'])) {
        slide24.addImage({
            path: iconPaths['shield'],
            x: 1.0, y: 2.1, w: 2.0, h: 2.0
        });
    }

    // Línea vertical punteada
    slide24.addShape(pptx.shapes.LINE, {
        x: 4.2, y: 1.4, w: 0, h: 3.2,
        line: { color: COLORS.successGreen, width: 2, dashType: "dash" }
    });

    // Nodos
    slide24.addShape(pptx.shapes.OVAL, { x: 4.1, y: 1.6, w: 0.2, h: 0.2, fill: { color: COLORS.successGreen }, line: { width: 0 } });
    slide24.addShape(pptx.shapes.OVAL, { x: 4.1, y: 3.2, w: 0.2, h: 0.2, fill: { color: COLORS.successGreen }, line: { width: 0 } });

    // Bloque 1: Rollback Automático
    slide24.addText([
        { text: "Rollback en Caliente de Modelos\n", options: { bold: true, fontSize: 13, color: COLORS.successGreen } },
        { text: "Reversión inmediata. Capacidad de re-enrutar el tráfico de inferencia hacia una versión previa y validada del modelo (Shadow/Baseline) en menos de 5 segundos tras detectar alertas críticas de deriva (Drift) o inyecciones semánticas.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 4.5, y: 1.4, w: 5.0, h: 1.3,
        fontFace: "Segoe UI",
        valign: "top"
    });

    // Bloque 2: Cuarentena y Retiro
    slide24.addText([
        { text: "Cuarentena de API y Aislamiento\n", options: { bold: true, fontSize: 13, color: COLORS.successGreen } },
        { text: "Respuesta defensiva proactiva. Bloqueo temporal de tokens de acceso (API keys) de usuarios atípicos y aislamiento del microservicio de inferencia comprometido en red para evitar exfiltraciones a servidores de comando y control.", options: { fontSize: 10.5, color: COLORS.textPrimary } }
    ], {
        x: 4.5, y: 3.0, w: 5.0, h: 1.3,
        fontFace: "Segoe UI",
        valign: "top"
    });


    /* =========================================================================
       DIAPOSITIVA 25: CONCLUSIÓN Y CIERRE (Gracias - Matching Slide 43 Layout)
       ========================================================================= */
    const slide25 = pptx.addSlide();
    slide25.background = { color: COLORS.bg };

    // Círculo gigante a la derecha que se sale del borde
    slide25.addShape(pptx.shapes.OVAL, {
        x: 6.5, y: -0.44, w: 6.5, h: 6.5,
        fill: { color: COLORS.grayBg },
        line: { width: 0 }
    });

    // Texto "Gracias" y Q&A dentro del círculo derecho
    slide25.addText("Gracias", {
        x: 7.0, y: 2.1, w: 2.5, h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.primaryBlue,
        align: "center",
        valign: "middle",
        fontFace: "Segoe UI"
    });
    slide25.addText("Preguntas y Respuestas (Q&A)", {
        x: 7.0, y: 3.0, w: 2.5, h: 0.6,
        fontSize: 12,
        color: COLORS.textSec,
        align: "center",
        fontFace: "Segoe UI",
        italic: true
    });

    // Puntos conclusivos clave a la izquierda
    slide25.addText([
        { text: "Conclusiones Clave:\n\n\n", options: { bold: true, fontSize: 18, color: COLORS.primaryBlue } },
        { text: "1. Defensa Holística por Diseño:\n", options: { bold: true, fontSize: 12, color: COLORS.textPrimary } },
        { text: "   La seguridad de la IA no se limita a asegurar APIs. La protección del pipeline de datos y de la integridad física de los pesos criptográficos es fundamental.\n\n", options: { fontSize: 10, color: COLORS.textSec } },
        { text: "2. Operaciones Activas (MLSecOps):\n", options: { bold: true, fontSize: 12, color: COLORS.textPrimary } },
        { text: "   Los modelos son dinámicos en producción; el escaneo automático en CI/CD y el monitoreo continuo de desviación (Drift) son vitales para garantizar resiliencia.\n\n", options: { fontSize: 10, color: COLORS.textSec } },
        { text: "3. Gobernanza bajo Estándares Globales:\n", options: { bold: true, fontSize: 12, color: COLORS.textPrimary } },
        { text: "   Modelar las amenazas bajo el catálogo de MITRE ATLAS, aplicar el marco estratégico NIST AI RMF y mitigar riesgos OWASP es la ruta del éxito.", options: { fontSize: 10, color: COLORS.textSec } }
    ], {
        x: 0.8, y: 0.8, w: 5.2, h: 4.2,
        fontFace: "Segoe UI",
        valign: "top"
    });


    // Guardar archivo final
    const outputFilename = "Seguridad_IA_y_MLSecOps.pptx";
    try {
        await pptx.writeFile({ fileName: outputFilename });
        console.log(`\n¡Éxito! Presentación guardada correctamente como: ${outputFilename}`);
    } catch (err) {
        console.error("Error al escribir el archivo de presentación:", err);
    }
}

main();
