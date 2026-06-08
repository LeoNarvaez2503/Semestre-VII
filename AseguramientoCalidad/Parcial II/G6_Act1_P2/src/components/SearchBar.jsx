import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { SortSelect } from './UI/SharedComponents';

export default function SearchBar({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  sortOrder,
  onSortChange,
}) {
  const hasActiveFilters = searchTerm || (selectedCategory && selectedCategory !== 'Todas');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Search bar row */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Busca por título, categoría o descripción..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="glass-input w-full pl-11 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Buscar estándares"
          />
          {searchTerm && (
            <motion.button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Sort select */}
        <SortSelect value={sortOrder} onChange={onSortChange} />
      </div>

      {/* Filter pills row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />

        {categories.map(category => (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category === selectedCategory ? null : category)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === category
                ? 'text-white shadow-lg shadow-violet-500/30'
                : ''
            }`}
            style={
              selectedCategory === category
                ? { background: 'linear-gradient(135deg, #7c3aed, #0891b2)' }
                : { background: 'var(--bg-badge)', color: 'var(--text-secondary)' }
            }
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </motion.button>
        ))}

        {hasActiveFilters && (
          <motion.button
            onClick={onClearFilters}
            className="ml-auto px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
              background: 'transparent',
            }}
            whileHover={{ scale: 1.05, borderColor: 'var(--border-hover)', color: 'var(--text-primary)' }}
            whileTap={{ scale: 0.95 }}
          >
            ✕ Limpiar filtros
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
