# 📚 Referencia Técnica - Standards Viewer

## Arquitectura de Componentes

### Jerarquía de Componentes

```
App (Suspense)
└── LandingPage
    ├── PatternBackground
    ├── FloatingParticles
    ├── Hero Section
    ├── SearchBar
    │   ├── Search Input
    │   └── Category Pills
    ├── StandardCard Grid (x5)
    │   ├── Icon
    │   ├── Badge Category
    │   ├── Tags
    │   ├── ReadingTimeIndicator
    │   └── Arrow Button
    └── StandardDetail (Modal)
        ├── Header con Gradiente
        ├── Meta Info
        ├── Content Renderer
        ├── Links & Actions
        └── Backdrop
```

## Estado de la Aplicación

### LandingPage State
```javascript
- isLoading: boolean         // Skeleton loaders
- searchTerm: string         // Búsqueda actual
- selectedCategory: string   // Categoría filtrada
- selectedStandard: object   // Estándar seleccionado
- isDetailOpen: boolean      // Visibilidad del modal
```

## Componentes Reutilizables (SharedComponents)

### PatternBackground
- Fondo con patrón SVG geométrico
- Opacidad configurable
- Soporte para className personalizado

### SkeletonLoader
- Animación shimmer CSS
- Configurable por cantidad
- Responsive grid

### ReadingTimeIndicator
- Barra de progreso animada
- Calcula porcentaje basado en minutos
- Gradiente de colores

### CopyToClipboard
- Copia URL al portapapeles
- Feedback visual con checkmark
- Auto-reset después de 2 segundos

### FloatingParticles
- 20 partículas animadas
- Movimiento Y aleatorio
- Opacidad dinámica

## Funciones de Utilidad

### calculateReadingTime(text: string): number
Calcula minutos estimados de lectura basado en:
- 200 palabras por minuto promedio
- Divide total de palabras entre 200
- Redondea hacia arriba con Math.ceil()

### getRepositoryUrl(standardId: number): string
Retorna URL del PDF correspondiente al estándar

## Estructura de Datos (Standard Object)

```javascript
{
  id: number,                    // 1-5
  titulo: string,                // "ISO/IEC 29110-5-1-2:2025"
  subtitulo: string,             // Descripción corta
  categoria: string,             // "Guidelines", "Framework", etc.
  tags: string[],               // ["Software Engineering", "Basic Profile", ...]
  descripcionCorta: string,     // 1-2 líneas
  contenidoExtendido: string,   // Contenido completo con markdown
  urlOriginal: string,          // Link a PDF
  color: string,                // "from-violet-600 to-violet-400"
  icono: string                 // "Zap", "BookOpen", etc.
}
```

## Animaciones de Framer Motion

### StandardCard
```javascript
initial: { opacity: 0, y: 30 }
animate: { opacity: 1, y: 0 }
whileHover: { y: -8, boxShadow: '0 20px 50px...' }
transition: { duration: 0.5, delay: index * 0.1 }
```

### StandardDetail Modal
```javascript
initial: { y: 100, opacity: 0 }
animate: { y: 0, opacity: 1 }
exit: { y: 100, opacity: 0 }
transition: { type: 'spring', damping: 25, stiffness: 300 }
```

### SearchBar
```javascript
initial: { opacity: 0, y: -20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.5 }
```

## Estilos Tailwind Personalizados

### Clases Personalizadas en tailwind.config.js
```javascript
colors: {
  dark: { 50: '#f9fafb', 900: '#0f0f0f', 950: '#030303' }
}

animations: {
  'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'slide-up': 'slideUp 0.6s ease-out',
  'fade-in': 'fadeIn 0.6s ease-out'
}

keyframes: {
  slideUp: { '0%': 'translateY(20px) opacity 0', '100%': 'translateY(0) opacity 1' },
  fadeIn: { '0%': 'opacity 0', '100%': 'opacity 1' }
}
```

### Clases CSS Globales (index.css)
```css
.glass              /* Glassmorphism effect */
.shimmer           /* Animación de carga */
.gradient-text     /* Texto con gradiente */
.fade-in-up        /* Animación de entrada */
.stagger-item      /* Efecto stagger */
```

## Performance Optimizations

1. **Code Splitting**: Lazy loading con Suspense
2. **Memoization**: useMemo para filtros
3. **Debounced Search**: Búsqueda reactiva
4. **CSS Classes**: Uso de clases Tailwind
5. **Animations**: Hardware acceleration con transform
6. **Image Optimization**: Iconos SVG escalables

## Responsive Breakpoints

| Device | Breakpoint | Grid | Cambios |
|--------|-----------|------|---------|
| Mobile | < 640px | 1 col | Modal fullscreen |
| Tablet | 640-1024px | 2 cols | UI comprimida |
| Desktop | > 1024px | 3 cols | Layout completo |

## Accesibilidad

- ✓ Navegación con Tab
- ✓ Focus visible en botones
- ✓ ARIA labels en iconos
- ✓ Color contrast WCAG AA
- ✓ Texto descriptivo en botones
- ✓ Semántica HTML correcta

## API de Datos

Los datos vienen de `standardsData.js`:
- 5 estándares ISO/IEC 29110
- URLs de PDFs incluidas
- Contenido en markdown
- Categorías y etiquetas

## Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| react | 18.2.0 | Framework UI |
| react-dom | 18.2.0 | Rendering DOM |
| framer-motion | 10.16.4 | Animaciones |
| lucide-react | 0.292.0 | Iconos |
| vite | 4.5.0 | Build tool |
| tailwindcss | 3.3.5 | Estilos CSS |
| postcss | 8.4.31 | CSS processing |
| autoprefixer | 10.4.16 | Vendor prefixes |

## Configuración de Vite

```javascript
// vite.config.js
{
  plugins: [react()],
  server: {
    port: 5173,
    open: true  // Abre automáticamente el navegador
  }
}
```

## Variables de Entorno

Actualmente no se usan, pero pueden agregarse:
```
VITE_API_URL=https://...
VITE_PDF_BASE_URL=https://...
```

## Troubleshooting Técnico

### Hot Module Replacement (HMR)
- Cambios se reflejan automáticamente
- Preserva el estado de React
- Si falla, recarga la página manualmente

### Console Warnings
- Warnings de React son normales en desarrollo
- Desaparecen en build de producción

### Performance
- DevTools muestra tiempo de render
- Lighthouse puede auditar performance
- Animations son 60fps

## Extensibilidad Futura

### Posibles Mejoras
1. **Backend API**: Conectar a base de datos
2. **Authentication**: Sistema de usuarios
3. **Favoritos**: Guardar estándares preferidos
4. **Sharing**: Compartir en redes sociales
5. **PDF Export**: Exportar contenido a PDF
6. **Dark/Light Toggle**: Modo claro
7. **Comparación**: Comparar múltiples estándares

### Puntos de Extensión
- `src/components/` - Agregar nuevos componentes
- `src/data/` - Conectar API externa
- `src/hooks/` - Lógica personalizada
- `tailwind.config.js` - Nuevos estilos

## Build & Deployment

### Compilar para Producción
```bash
npm run build  # Genera carpeta dist/
```

### Características del Build
- Minificación de código
- Tree shaking de dependencias
- CSS purged (solo usado)
- Source maps para debugging
- Assets optimizados

### Hosting Recomendado
- Vercel (optimizado para Vite)
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

## Licencia y Atribuciones

- Framework: React (MIT)
- Build: Vite (MIT)
- Estilos: Tailwind CSS (MIT)
- Animaciones: Framer Motion (MIT)
- Iconos: Lucide React (ISC)

---

**Documento Técnico - Standards Viewer v1.0**
*Última actualización: 2025*
