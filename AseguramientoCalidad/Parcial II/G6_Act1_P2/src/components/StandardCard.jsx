import { motion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, Brain, Lock, CheckCircle } from 'lucide-react';
import { iconMap, ReadingTimeIndicator } from './UI/SharedComponents';
import { calculateReadingTime } from '../data/standardsData';
import { useLearning } from '../context/LearningContext';

function MiniProgressRing({ pct, color }) {
  const size = 38;
  const r = 15;
  const circ = 2 * Math.PI * r;
  const ringColor = pct >= 100 ? '#22c55e' : pct > 0 ? color : 'var(--border-color)';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth="3" />
      {pct > 0 && (
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={ringColor} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      <text x={size / 2} y={size / 2 + 3} textAnchor="middle" fontSize="8" fontWeight="800"
        fill={pct > 0 ? ringColor : 'var(--text-muted)'}
      >{pct}%</text>
    </svg>
  );
}

function extractColor(c) {
  if (c?.includes('violet')) return '#a78bfa';
  if (c?.includes('cyan')) return '#22d3ee';
  if (c?.includes('emerald')) return '#34d399';
  if (c?.includes('orange')) return '#fb923c';
  if (c?.includes('pink')) return '#f472b6';
  return '#a78bfa';
}

export default function StandardCard({ standard, onClick, isSelected, index, moduleNumber }) {
  const Icon = iconMap[standard.icono];
  const readingTime = calculateReadingTime(standard.contenidoExtendido);
  const { getModuleProgress, getTemaState, canAccessTema } = useLearning();
  const temas = standard.temas || [];
  const progress = getModuleProgress(standard.id, temas.length);
  const ringColor = extractColor(standard.color);

  return (
    <motion.div
      className="h-full stagger-item"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <motion.button
        onClick={onClick}
        className={`group relative w-full h-full glass rounded-2xl p-5 overflow-hidden cursor-pointer text-left bg-transparent border-0 ${isSelected ? 'ring-2 ring-violet-500/50' : ''}`}
        whileHover={{ y: -5, boxShadow: 'var(--shadow-glow)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25 }}
        type="button"
        aria-label={`Abrir módulo: ${standard.titulo}`}
      >
        {/* Hover glow */}
        <div className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-bl ${standard.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full blur-2xl pointer-events-none`} />

        {moduleNumber != null && (
          <div className={`card-module-number bg-gradient-to-br ${standard.color}`} title={`Módulo ${moduleNumber}`}>{moduleNumber}</div>
        )}

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <motion.div className={`p-2.5 rounded-xl bg-gradient-to-br ${standard.color} text-white shadow-md`}
              whileHover={{ rotate: [-3, 3, 0], scale: 1.08 }} transition={{ duration: 0.4 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full" style={{ background: 'var(--bg-badge)', color: 'var(--text-secondary)' }}>
                {standard.categoria}
              </span>
              <MiniProgressRing pct={progress} color={ringColor} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold mb-1 group-hover:text-violet-400 transition-colors line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {standard.titulo}
          </h3>
          <p className="text-xs mb-3 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{standard.subtitulo}</p>
          <p className="text-xs mb-4 line-clamp-3 flex-grow leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {standard.descripcionCorta}
          </p>

          {/* Tema progress bars */}
          <div className="space-y-1 mb-4">
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              {temas.length} temas · {temas.filter((_, i) => getTemaState(standard.id, i).quizPassed).length} aprobados
            </p>
            <div className="flex items-center gap-1">
              {temas.map((_, idx) => {
                const ts = getTemaState(standard.id, idx);
                const accessible = canAccessTema(standard.id, idx);
                return (
                  <div key={idx} className="flex-1 h-1.5 rounded-full transition-all" title={`Tema ${idx + 1}`}
                    style={{
                      background: ts.quizPassed ? '#22c55e' : accessible ? 'var(--text-accent)' : 'var(--bg-badge)',
                      opacity: ts.quizPassed ? 1 : accessible ? 0.4 : 0.2,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Reading time */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3 h-3" /> Lectura total
              </span>
              <span className="text-xs font-bold" style={{ color: 'var(--text-accent)' }}>{readingTime} min</span>
            </div>
            <ReadingTimeIndicator minutes={readingTime} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3.5 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--text-accent)' }}>
              {progress === 0 ? 'Comenzar curso' : progress >= 100 ? '✓ Curso completo' : 'Continuar curso'}
            </span>
            <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
            </motion.div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
