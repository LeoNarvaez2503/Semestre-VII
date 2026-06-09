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
  if (c?.includes('violet')) return '#6366f1';
  if (c?.includes('cyan')) return '#06b6d4';
  if (c?.includes('emerald')) return '#10b981';
  if (c?.includes('orange')) return '#f97316';
  if (c?.includes('pink')) return '#ec4899';
  return '#6366f1';
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
        className={`group relative w-full h-full glass rounded-2xl overflow-hidden cursor-pointer text-left bg-white border border-slate-100 flex flex-col justify-between ${
          isSelected ? 'ring-2 ring-violet-500/50 shadow-md' : 'shadow-sm'
        }`}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card)',
          padding: 0
        }}
        whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25 }}
        type="button"
        aria-label={`Abrir módulo: ${standard.titulo}`}
      >
        {/* Banner header image */}
        <div className={`w-full h-28 bg-gradient-to-r ${standard.color} relative overflow-hidden flex-shrink-0`}>
          {/* Subtle pattern dots/lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />

          {moduleNumber != null && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest text-white/95 bg-black/15 backdrop-blur-sm">
              Mód {moduleNumber}
            </div>
          )}
        </div>

        {/* Circular icon in white container - Placed outside of banner to prevent overflow-hidden clipping */}
        <div className="absolute top-[90px] left-5 p-1 rounded-full bg-white shadow-md flex items-center justify-center z-10" style={{ background: 'var(--bg-secondary)' }}>
          <div className={`p-2 rounded-full bg-gradient-to-br ${standard.color} text-white shadow-inner flex items-center justify-center w-8 h-8`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 pt-8 flex-grow flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md" style={{ background: 'var(--bg-badge)', color: 'var(--text-accent)' }}>
                {standard.categoria}
              </span>
              <MiniProgressRing pct={progress} color={ringColor} />
            </div>

            <h3 className="text-[15px] font-extrabold mb-1 line-clamp-1 group-hover:text-indigo-500 transition-colors" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
              {standard.titulo}
            </h3>
            <p className="text-[11px] font-semibold mb-2.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{standard.subtitulo}</p>
            <p className="text-xs mb-4 line-clamp-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {standard.descripcionCorta}
            </p>
          </div>

          <div>
            {/* Progress indicators */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between items-center text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                <span>Temas Aprobados</span>
                <span>{temas.filter((_, i) => getTemaState(standard.id, i).quizPassed).length} / {temas.length}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                {temas.map((_, idx) => {
                  const ts = getTemaState(standard.id, idx);
                  const accessible = canAccessTema(standard.id, idx);
                  return (
                    <div key={idx} className="flex-grow h-1.5 rounded-full transition-all" title={`Tema ${idx + 1}`}
                      style={{
                        background: ts.quizPassed ? '#22c55e' : accessible ? ringColor : 'var(--border-color)',
                        opacity: ts.quizPassed ? 1 : accessible ? 0.4 : 0.25,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Reading time */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>
                  <Clock className="w-3 h-3" /> Tiempo estimado
                </span>
                <span className="text-[11px] font-extrabold" style={{ color: 'var(--text-accent)' }}>{readingTime} min</span>
              </div>
              <ReadingTimeIndicator minutes={readingTime} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-[11px] font-extrabold" style={{ color: 'var(--text-accent)' }}>
                {progress === 0 ? 'Comenzar curso' : progress >= 100 ? '✓ Completado' : 'Continuar'}
              </span>
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
