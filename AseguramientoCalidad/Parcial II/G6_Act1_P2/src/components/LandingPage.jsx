import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import standardsData from '../data/standardsData';
import StandardCard from './StandardCard';
import CoursePage from './ModuleDetail/CoursePage';
import { SkeletonLoader, Pagination } from './UI/SharedComponents';
import { usePagination } from '../hooks/usePagination';
import { useLearning } from '../context/LearningContext';
import { Search } from 'lucide-react';

/* ── Dashboard Sub-components ─────────────────────── */
import Sidebar from './Dashboard/Sidebar';
import HeroBanner from './Dashboard/HeroBanner';
import ProgressRow from './Dashboard/ProgressRow';
import TopicsTable from './Dashboard/TopicsTable';
import RightSidebar from './Dashboard/RightSidebar';

export default function LandingPage() {
  const { getGlobalProgress } = useLearning();

  const [isLoading, setIsLoading]       = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [activeModule, setActiveModule] = useState(null);
  const [activeTab, setActiveTab]       = useState('dashboard');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const categories = useMemo(() => ['Todas', ...new Set(standardsData.map(s => s.categoria))], []);

  const filteredStandards = useMemo(() => {
    return standardsData.filter(s => {
      const q = searchTerm.toLowerCase();
      const matchSearch = s.titulo.toLowerCase().includes(q) || s.subtitulo.toLowerCase().includes(q) ||
        s.descripcionCorta.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q));
      const matchCat = !selectedCategory || selectedCategory === 'Todas' || s.categoria === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCategory]);

  const pagination = usePagination(filteredStandards);
  useEffect(() => { pagination.resetPage(); }, [searchTerm, selectedCategory]);

  const globalProgress = getGlobalProgress(standardsData);

  const handleClearFilters = () => { setSearchTerm(''); setSelectedCategory('Todas'); };

  /* ─── FULL-SCREEN COURSE VIEW ─── */
  if (activeModule) {
    return <CoursePage standard={activeModule} onBack={() => setActiveModule(null)} />;
  }

  /* ─── LANDING / CATALOG VIEW ─── */
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Central Content Panel */}
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-y-auto">
        {/* Search Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full max-w-lg">
            <Search className="w-4 h-4 absolute left-3 top-3" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar estándares de ingeniería, conceptos o tags..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all"
                style={selectedCategory === cat ? {
                  background: 'var(--text-accent)',
                  color: '#fff'
                } : {
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Hero Banner */}
        <HeroBanner onStartClick={() => setActiveModule(standardsData[0])} />

        {/* Active Study progress row */}
        <ProgressRow
          onCardClick={setActiveModule}
          globalProgress={globalProgress}
        />

        {/* Catalog Grid */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Catálogo de Estándares</h3>
            {filteredStandards.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400">{filteredStandards.length} disponibles</span>
            )}
          </div>

          {isLoading ? (
            <SkeletonLoader count={4} className="grid-cols-1 md:grid-cols-2" />
          ) : filteredStandards.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {pagination.paginatedItems.map((s, i) => (
                  <StandardCard key={s.id} standard={s} index={i}
                    onClick={() => setActiveModule(s)}
                    isSelected={false}
                    moduleNumber={standardsData.indexOf(s) + 1}
                  />
                ))}
              </div>
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages}
                onPrev={pagination.goPrev} onNext={pagination.goNext} onGoTo={pagination.goToPage}
                hasNext={pagination.hasNext} hasPrev={pagination.hasPrev}
              />
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Sin resultados para la búsqueda.</p>
              <button onClick={handleClearFilters} className="mt-3 px-4 py-2 rounded-xl text-xs font-extrabold text-white" style={{ background: 'var(--text-accent)' }}>
                Limpiar Filtros
              </button>
            </div>
          )}
        </section>

        {/* Active Topics table */}
        <TopicsTable onStudyClick={setActiveModule} />

        {/* Footer */}
        <footer className="pt-6 text-center text-[10px] border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          <p>Plataforma Académica Aseguramiento de Calidad · Basado en Normas Oficiales ISO/IEC 29110</p>
          <p className="mt-0.5">© 2026 G6 · Ingeniería de Software</p>
        </footer>
      </main>

      {/* Right Metrics Sidebar */}
      <RightSidebar globalProgress={globalProgress} />

    </div>
  );
}
