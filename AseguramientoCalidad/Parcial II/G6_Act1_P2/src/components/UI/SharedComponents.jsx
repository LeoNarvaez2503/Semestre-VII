import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BookOpen, Rocket, Gauge, Grid, Sun, Moon, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/* ─── Icon registry ─────────────────────────────────── */
export const iconMap = { Zap, BookOpen, Rocket, Gauge, Grid };

/* ─── Theme Toggle ───────────────────────────────────── */
export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-toggle"
      whileTap={{ scale: 0.92 }}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-thumb" />
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.span
            key="moon"
            className="absolute left-1.5 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <Moon className="w-3 h-3 text-violet-300" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <Sun className="w-3 h-3 text-amber-400" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/* ─── Pattern Background ────────────────────────────── */
export const PatternBackground = ({ children, className = '' }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="absolute inset-0" style={{ opacity: 'var(--grid-opacity)' }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? '#ffffff' : '#4c4980'}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0891b2, transparent)' }} />
      <div className="relative">{children}</div>
    </div>
  );
};

/* ─── Floating Particles ─────────────────────────────── */
export const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: i % 3 === 0
              ? 'linear-gradient(135deg, #a78bfa, #60a5fa)'
              : i % 3 === 1
                ? 'linear-gradient(135deg, #34d399, #06b6d4)'
                : 'linear-gradient(135deg, #f472b6, #a78bfa)',
            left: `${Math.random() * 100}%`,
            top: `${50 + Math.random() * 60}%`,
            opacity: 'var(--particle-opacity)',
          }}
          animate={{ y: [0, -(400 + Math.random() * 300)], x: [0, (Math.random() - 0.5) * 80], opacity: [0, 0.5, 0] }}
          transition={{ duration: 12 + Math.random() * 12, repeat: Infinity, ease: 'linear', delay: Math.random() * 8 }}
        />
      ))}
    </div>
  );
};

/* ─── Skeleton Loader ────────────────────────────────── */
export const SkeletonLoader = ({ count = 3, className = '' }) => (
  <div className={`grid gap-6 ${className}`}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-6 shimmer rounded-lg w-3/4 mb-4" />
        <div className="h-4 shimmer rounded-lg w-full mb-3" />
        <div className="h-4 shimmer rounded-lg w-5/6 mb-6" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="h-6 w-16 shimmer rounded-full" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ─── Reading Time Indicator ─────────────────────────── */
export const ReadingTimeIndicator = ({ minutes }) => {
  const progress = Math.min((minutes / 15) * 100, 100);
  return (
    <div className="progress-track w-full h-1.5">
      <motion.div
        className="progress-bar h-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </div>
  );
};

/* ─── Copy to Clipboard ──────────────────────────────── */
export const CopyToClipboard = ({ text }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return (
    <motion.button
      onClick={handleCopy}
      className="px-3 py-2 text-xs font-medium rounded-lg transition-all"
      style={{ background: 'var(--bg-badge)', color: 'var(--text-secondary)' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {copied ? '✓ ¡Copiado!' : 'Copiar enlace'}
    </motion.button>
  );
};

/* ─── Pagination Controls ────────────────────────────── */
export const Pagination = ({ currentPage, totalPages, onPrev, onNext, onGoTo, hasNext, hasPrev }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div
      className="flex items-center justify-center gap-2 mt-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button
        className="page-btn"
        onClick={onPrev}
        disabled={!hasPrev}
        whileHover={hasPrev ? { scale: 1.08 } : {}}
        whileTap={hasPrev ? { scale: 0.92 } : {}}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      {pages.map(page => (
        <motion.button
          key={page}
          className={`page-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onGoTo(page)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Página ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        className="page-btn"
        onClick={onNext}
        disabled={!hasNext}
        whileHover={hasNext ? { scale: 1.08 } : {}}
        whileTap={hasNext ? { scale: 0.92 } : {}}
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

/* ─── Sort Select ────────────────────────────────────── */
export const SortSelect = ({ value, onChange }) => {
  const options = [
    { value: 'default', label: 'Orden original' },
    { value: 'title-asc', label: 'Título A→Z' },
    { value: 'title-desc', label: 'Título Z→A' },
    { value: 'year-desc', label: 'Más reciente' },
    { value: 'year-asc', label: 'Más antiguo' },
    { value: 'category', label: 'Por categoría' },
  ];

  return (
    <div className="relative inline-flex items-center gap-2">
      <ArrowUpDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
      <select
        className="sort-select pr-8"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Ordenar estándares"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
};

/* ─── Learning Path Progress ─────────────────────────── */
export const LearningProgress = ({ current, total }) => {
  const pct = Math.round((current / total) * 100);
  return (
    <motion.div
      className="glass rounded-2xl px-5 py-4 flex items-center gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-accent)' }}>
            Ruta de Aprendizaje ISO/IEC 29110
          </span>
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
            {current}/{total} módulos
          </span>
        </div>
        <div className="progress-track h-2 w-full">
          <motion.div
            className="progress-bar h-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <div
        className="text-lg font-black tabular-nums"
        style={{ color: 'var(--text-accent)', minWidth: 40, textAlign: 'right' }}
      >
        {pct}%
      </div>
    </motion.div>
  );
};
