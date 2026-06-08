# Standards Viewer - Aplicación React Ultra-Moderna

Una aplicación web premium para visualizar y explorar la serie de estándares **ISO/IEC 29110** con una experiencia de usuario impecable, animaciones fluidas y un diseño dark mode sofisticado.

## 🎯 Características

### ✨ Diseño y UX
- **Dark Mode Premium**: Tema oscuro sofisticado con paleta de colores moderna
- **Glassmorphism**: Tarjetas con efecto vidrio translúcido y bordes semitransparentes
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Responsivo**: Funciona perfectamente en mobile, tablet y desktop
- **Tipografía Premium**: Fuente Inter para máxima legibilidad

### 🔍 Funcionalidad
- **Búsqueda en Tiempo Real**: Filtra por título, descripción, categoría o etiquetas
- **Filtros Inteligentes**: Categorías, etiquetas y búsqueda combinadas
- **Skeleton Loaders**: Animaciones de carga fluidas con efecto shimmer
- **Vista Detallada Modal**: Presentación completa del estándar en overlay fullscreen

### 📊 Características Avanzadas
1. **Indicador de Lectura**: Barra de progreso que estima tiempo de lectura
2. **Stagger Animations**: Las tarjetas aparecen secuencialmente al cargar
3. **Hover Effects**: Micro-interacciones en todas las tarjetas
4. **Copiar Enlace**: Botón para copiar URL al portapapeles con feedback visual
5. **Contenido Organizado**: Markdown rendering con estructura jerárquica
6. **Accesibilidad**: Soporte total para navegación por teclado

## 🛠️ Stack Tecnológico

```json
{
  "Framework": "React 18.2.0",
  "Build Tool": "Vite 4.5.0",
  "Estilos": "Tailwind CSS 3.3.5",
  "Animaciones": "Framer Motion 10.16.4",
  "Iconos": "Lucide React 0.292.0"
}
```

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 16+ instalado
- npm o yarn

### Pasos de Instalación

1. **Abre una terminal en la carpeta del proyecto**:
```bash
cd "c:\Users\caeta\Desktop\Respaldo\SEMESTREVII\Semestre-VII-LEO\AseguramientoCalidad\Parcial I\Grupal\Act-5"
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Inicia el servidor de desarrollo**:
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

### Compilar para Producción
```bash
npm run build
```

El resultado estará en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
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
├── postcss.config.js                      # Configuración PostCSS
└── README.md                              # Este archivo
```

## 🎨 Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Fondo Principal | `bg-zinc-950` | Fondos generales |
| Texto Primario | `text-zinc-100` | Títulos, textos importantes |
| Texto Secundario | `text-zinc-400` | Descripciones, metadatos |
| Acentos | Violeta/Cian/Esmeralda | Botones, highlights |
| Elementos Glass | `rgba(255, 255, 255, 0.05)` | Tarjetas, containers |

## 🔑 Componentes Principales

### LandingPage
- Hero section con introducción
- Barra de búsqueda integrada
- Grid responsivo de tarjetas
- Footer informativo

### StandardCard
- Ícono de categoría con gradiente
- Título y subtítulo
- Descripción corta
- Tags/etiquetas
- Indicador de tiempo de lectura
- Animación hover avanzada

### StandardDetail
- Modal fullscreen responsivo
- Contenido completo renderizado
- Header con gradiente
- Barra de progreso de lectura
- Botón de acceso al original
- Botón para copiar enlace

### SearchBar
- Input con búsqueda en tiempo real
- Pills de categorías
- Botón limpiar filtros
- Ícono de búsqueda

## 🚀 Cómo Usar

### Buscar Estándares
1. Escribe en el campo de búsqueda cualquier término
2. Los resultados se filtran automáticamente
3. La búsqueda es insensible a mayúsculas

### Filtrar por Categoría
1. Haz clic en los pills de categorías
2. Solo se mostrarán los estándares de esa categoría
3. Haz clic de nuevo para deseleccionar

### Ver Detalles
1. Haz clic en cualquier tarjeta
2. Se abrirá un modal con toda la información
3. Lee el contenido completo
4. Haz clic en "Abrir Estándar Original" para acceder al PDF
5. Usa "Copiar enlace" para compartir

### Limpiar Filtros
- Haz clic en "Limpiar filtros" para resetear la búsqueda

## 📱 Responsividad

- **Mobile**: Stack vertical, navegación optimizada
- **Tablet**: Grid de 2 columnas
- **Desktop**: Grid de 3 columnas

## ✨ Animaciones Implementadas

- ✓ Skeleton loaders con shimmer
- ✓ Stagger effect en tarjetas
- ✓ Hover effects en cards
- ✓ Transiciones de entrada/salida
- ✓ Barra de progreso animada
- ✓ Partículas flotantes de fondo
- ✓ Transiciones suaves de modales

## 🎯 Mejoras Futuras Posibles

- [ ] Agregar modo claro (light mode)
- [ ] Exportar a PDF
- [ ] Compartir en redes sociales
- [ ] Sistema de favoritos
- [ ] Historial de búsqueda
- [ ] Comparación de estándares
- [ ] API backend para datos dinámicos

## 📄 Licencia

Este proyecto es educativo y basado en la serie ISO/IEC 29110.

## 🤝 Contribuir

Para mejoras o sugerencias, contacta al desarrollador.

---

**¡Disfruta explorando los estándares de desarrollo!** 🚀
