import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import standardsData from '../data/standardsData';
import SearchBar from './SearchBar';
import StandardCard from './StandardCard';
import CoursePage from './ModuleDetail/CoursePage';
import {
  SkeletonLoader,
  PatternBackground,
  FloatingParticles,
  ThemeToggle,
  Pagination,
} from './UI/SharedComponents';
import { usePagination } from '../hooks/usePagination';
import { useLearning } from '../context/LearningContext';
import { GraduationCap, Sparkles, ArrowDown, BookOpen } from 'lucide-react';

/* ── Sort ──────────────────────────────────────────── */
function sortStandards(list, order) {
  const yr = (t) => { const m = t.match(/\d{4}/g); return m ? parseInt(m[m.length - 1], 10) : 0; };
  const c = [...list];
  switch (order) {
    case 'title-asc':  return c.sort((a, b) => a.titulo.localeCompare(b.titulo));
    case 'title-desc': return c.sort((a, b) => b.titulo.localeCompare(a.titulo));
    case 'year-desc':  return c.sort((a, b) => yr(b.titulo) - yr(a.titulo));
    case 'year-asc':   return c.sort((a, b) => yr(a.titulo) - yr(b.titulo));
    case 'category':   return c.sort((a, b) => a.categoria.localeCompare(b.categoria));
    default:           return c;
  }
}

/* ── Global Progress Bar ──────────────────────────── */
function GlobalProgressBar() {
  const { getGlobalProgress } = useLearning();
  const pct = getGlobalProgress(standardsData);
  const completed = standardsData.filter(s => {
    const temas = s.temas || [];
    return temas.length > 0 && pct > 0;
  }).length;

  // Count actually completed modules
  const { getModuleProgress } = useLearning();
  const doneCount = standardsData.filter(s => getModuleProgress(s.id, (s.temas || []).length) >= 100).length;

  return (
    <motion.div className="glass rounded-2xl px-5 py-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--text-accent)' }}>Ruta de Aprendizaje ISO/IEC 29110</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {doneCount}/{standardsData.length} módulos completos
            </span>
          </div>
          <div className="progress-track h-2.5 w-full">
            <motion.div className="progress-bar h-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
        </div>
        <div className="text-xl font-black tabular-nums flex-shrink-0" style={{ color: 'var(--text-accent)', minWidth: 48, textAlign: 'right' }}>{pct}%</div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [isLoading, setIsLoading]       = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder]       = useState('default');
  // Full-screen course view
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const categories = useMemo(() => ['Todas', ...new Set(standardsData.map(s => s.categoria))], []);

  const filteredStandards = useMemo(() => {
    const filtered = standardsData.filter(s => {
      const q = searchTerm.toLowerCase();
      const matchSearch = s.titulo.toLowerCase().includes(q) || s.subtitulo.toLowerCase().includes(q) ||
        s.descripcionCorta.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q));
      const matchCat = !selectedCategory || selectedCategory === 'Todas' || s.categoria === selectedCategory;
      return matchSearch && matchCat;
    });
    return sortStandards(filtered, sortOrder);
  }, [searchTerm, selectedCategory, sortOrder]);

  const pagination = usePagination(filteredStandards);
  useEffect(() => { pagination.resetPage(); }, [searchTerm, selectedCategory, sortOrder]);

  const handleClearFilters = () => { setSearchTerm(''); setSelectedCategory(null); setSortOrder('default'); };

  /* ─── FULL-SCREEN COURSE VIEW ─── */
  if (activeModule) {
    return <CoursePage standard={activeModule} onBack={() => setActiveModule(null)} />;
  }

  /* ─── LANDING / CATALOG VIEW ─── */
  return (
    <PatternBackground className="min-h-screen">
      <FloatingParticles />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3"
        style={{ background: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)', backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" style={{ color: 'var(--text-accent)' }} />
          <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            ISO/IEC 29110 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>· Learning Hub</span>
          </span>
        </div>
        <ThemeToggle />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-20">
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border"
            style={{ background: 'var(--bg-badge)', borderColor: 'var(--border-color)' }}
            whileHover={{ borderColor: 'var(--border-hover)' }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Curso interactivo · Lee · Reflexiona · Aprueba
            </span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="gradient-text">Estándares ISO/IEC</span><br />
            <span style={{ color: 'var(--text-primary)' }}>para Muy Pequeñas Entidades</span>
          </h1>
          <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Cada módulo tiene <strong style={{ color: 'var(--text-primary)' }}>temas paginados</strong> con{' '}
            <strong style={{ color: 'var(--text-primary)' }}>lectura</strong>,{' '}
            <strong style={{ color: 'var(--text-primary)' }}>reflexión</strong> y{' '}
            <strong style={{ color: 'var(--text-primary)' }}>prueba</strong>.
            Necesitas ≥70% en cada prueba para avanzar al siguiente tema.
          </p>
          <motion.div className="flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-4 h-4" /><span className="text-sm">Selecciona un módulo para empezar</span>
          </motion.div>
        </motion.section>

        {/* Global progress */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlobalProgressBar />
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} categories={categories}
            selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}
            onClearFilters={handleClearFilters} sortOrder={sortOrder} onSortChange={setSortOrder}
          />
        </motion.div>

        {/* Count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mb-6 flex items-center justify-between">
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {filteredStandards.length} módulo{filteredStandards.length !== 1 ? 's' : ''} disponible{filteredStandards.length !== 1 ? 's' : ''}
          </p>
          {pagination.totalPages > 1 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pág. {pagination.currentPage}/{pagination.totalPages}</p>
          )}
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <SkeletonLoader count={4} className="grid-cols-1 md:grid-cols-2" />
        ) : filteredStandards.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div key={`p${pagination.currentPage}-${sortOrder}-${searchTerm}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              >
                {pagination.paginatedItems.map((s, i) => (
                  <StandardCard key={s.id} standard={s} index={i}
                    onClick={() => setActiveModule(s)}
                    isSelected={false}
                    moduleNumber={filteredStandards.indexOf(s) + 1}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages}
              onPrev={pagination.goPrev} onNext={pagination.goNext} onGoTo={pagination.goToPage}
              hasNext={pagination.hasNext} hasPrev={pagination.hasPrev}
            />
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="inline-block p-8 glass rounded-2xl">
              <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>Sin resultados</p>
              <motion.button onClick={handleClearFilters} className="mt-3 px-6 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #0891b2)' }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >Limpiar filtros</motion.button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-24 pt-8 text-center text-xs border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
        >
          <p>Basado en <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>ISO/IEC 29110</span> · Normativa Internacional de Ingeniería de Software</p>
          <p className="mt-1">© 2025 G6 · Aseguramiento de Calidad de Software</p>
        </motion.footer>
      </div>
    </PatternBackground>
  );
}
