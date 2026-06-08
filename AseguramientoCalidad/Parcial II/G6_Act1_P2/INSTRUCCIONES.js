#!/usr/bin/env node

/**
 * GUÍA DE INSTALACIÓN Y EJECUCIÓN
 * Standards Viewer - Aplicación React Ultra-Moderna
 * 
 * Este archivo contiene instrucciones paso a paso para ejecutar la aplicación
 */

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║          🚀 STANDARDS VIEWER - Aplicación React Ultra-Moderna              ║
║          ISO/IEC 29110 - Documentación Interactiva                         ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

📋 REQUISITOS PREVIOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Node.js 16 o superior
✓ npm o yarn instalado
✓ Conexión a internet (para descargar dependencias)

📦 PASO 1: INSTALAR DEPENDENCIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Abre una terminal en la carpeta del proyecto y ejecuta:

    npm install

Esto instalará todas las dependencias necesarias:
  • React 18.2.0
  • Vite 4.5.0
  • Tailwind CSS 3.3.5
  • Framer Motion 10.16.4
  • Lucide React 0.292.0

⏳ La instalación tardará entre 2-5 minutos dependiendo de tu conexión

🎮 PASO 2: INICIAR MODO DESARROLLO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Una vez instaladas las dependencias, ejecuta:

    npm run dev

La aplicación se abrirá automáticamente en: http://localhost:5173

Si no se abre automáticamente, copia la URL en tu navegador.

🌟 CARACTERÍSTICAS DISPONIBLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Landing Page Ultra-Moderna
  • Hero section impactante
  • Fondo con patrón geométrico
  • Particulas flotantes animadas

🔍 Búsqueda Inteligente en Tiempo Real
  • Busca por título, descripción, etiquetas
  • Filtros por categoría
  • Resultados instantáneos

📊 Grid de Tarjetas Interactivas
  • 5 estándares ISO/IEC 29110
  • Ícono y gradiente por tipo
  • Tiempo estimado de lectura
  • Hover effects fluidos

📖 Vista Detallada (Modal)
  • Contenido completo del estándar
  • Header con gradiente
  • Indicador de progreso de lectura
  • Botón "Abrir Estándar Original"
  • Botón "Copiar Enlace" con feedback

⚡ Animaciones Premium
  • Skeleton loaders al cargar
  • Stagger effect en tarjetas
  • Transiciones suaves
  • Micro-interacciones en hover

🛠️ COMANDOS DISPONIBLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm run dev     → Inicia servidor de desarrollo (http://localhost:5173)
npm run build   → Compila la aplicación para producción
npm run preview → Previsualiza la versión compilada

📁 ESTRUCTURA DEL PROYECTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Act-5/
├── src/
│   ├── components/
│   │   ├── UI/
│   │   │   └── SharedComponents.jsx       # Componentes reutilizables
│   │   ├── LandingPage.jsx                # Página principal
│   │   ├── StandardCard.jsx               # Tarjeta individual
│   │   ├── StandardDetail.jsx             # Vista detallada modal
│   │   ├── SearchBar.jsx                  # Barra de búsqueda
│   │   └── FilterBadges.jsx               # Badges de filtros
│   ├── data/
│   │   └── standardsData.js               # Datos de los estándares
│   ├── App.jsx                            # Componente raíz
│   ├── main.jsx                           # Punto de entrada
│   └── index.css                          # Estilos globales
├── index.html                             # HTML principal
├── package.json                           # Dependencias
├── vite.config.js                         # Configuración Vite
├── tailwind.config.js                     # Configuración Tailwind
└── README.md                              # Documentación completa

🎨 TEMA Y DISEÑO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Dark Mode Premium por defecto
• Paleta: Violeta, Cian, Esmeralda
• Efecto Glassmorphism en tarjetas
• Tipografía: Inter / Geist
• Responsivo: Mobile, Tablet, Desktop

🌍 ESTÁNDARES DISPONIBLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ISO/IEC 29110-5-1-2:2025
   → Software engineering guidelines for the generic Basic profile
   Categoría: Guidelines | Tiempo lectura: ~12 min

2. ISO/IEC 29110-4-1:2018
   → Profile specifications: Generic profile group
   Categoría: Specifications | Tiempo lectura: ~10 min

3. ISO/IEC 29110-5-1-1:2025
   → Software engineering guidelines for the generic Entry profile
   Categoría: Guidelines | Tiempo lectura: ~11 min

4. ISO/IEC TR 29110-3-1:2020
   → Process assessment guidelines
   Categoría: Technical Report | Tiempo lectura: ~9 min

5. ISO/IEC 29110-2-1:2015
   → Framework and Taxonomy
   Categoría: Framework | Tiempo lectura: ~13 min

⚠️  RESOLUCIÓN DE PROBLEMAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Error: "npm command not found"
   → Node.js no está instalado. Descárgalo de https://nodejs.org

❌ Error: "EACCES: permission denied"
   → Ejecuta: sudo npm install (en Mac/Linux)

❌ Error: "Cannot find module"
   → Elimina node_modules y package-lock.json, luego: npm install

❌ Puerto 5173 en uso
   → Vite usará automáticamente otro puerto disponible

❌ Cambios no se reflejan
   → El hot reload está habilitado. Recarga la página (Ctrl+R)

💡 TIPS Y TRUCOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Usa F12 (DevTools) para inspeccionar elementos
• Prueba la responsive en móvil con Ctrl+Shift+M
• La búsqueda es case-insensitive
• Combina búsqueda + categorías para filtros avanzados
• El modal de detalles es completamente responsivo

✅ VERIFICACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Después de ejecutar 'npm run dev', verifica que:

✓ La aplicación se abre en http://localhost:5173
✓ Se ven 5 tarjetas de estándares
✓ La búsqueda funciona al escribir
✓ Los filtros funcionan al hacer clic
✓ Las tarjetas tienen efectos hover
✓ El modal se abre al hacer clic en una tarjeta
✓ Las animaciones son suaves

📚 DOCUMENTACIÓN COMPLETA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para más detalles, abre el archivo README.md incluido en el proyecto.

🎉 ¡Listo! La aplicación está lista para usar.
   Disfruta explorando los estándares de desarrollo ISO/IEC 29110. 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
