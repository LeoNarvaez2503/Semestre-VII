import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import StudyBarChart from './StudyBarChart';

export default function RightSidebar({ globalProgress }) {
  return (
    <aside className="w-80 border-l flex-shrink-0 p-6 hidden xl:flex flex-col gap-6 bg-white" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      
      {/* User Profile avatar circular ring */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
        <div className="relative mb-3 flex items-center justify-center">
          {/* SVG Progress Ring */}
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="38" fill="none" stroke="var(--border-color)" strokeWidth="4" />
            <motion.circle cx="45" cy="45" r="38" fill="none"
              stroke="var(--text-accent)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 38}`}
              initial={{ strokeDashoffset: `${2 * Math.PI * 38}` }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 38 * (1 - globalProgress / 100)}` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              transform="rotate(-90 45 45)"
            />
          </svg>
          {/* Inner Avatar */}
          <div className="absolute w-16 h-16 rounded-full bg-indigo-50 border border-slate-100 flex items-center justify-center font-extrabold text-indigo-600 text-lg shadow-inner" style={{ background: 'var(--bg-badge)', color: 'var(--text-accent)' }}>
            LN
          </div>
        </div>

        <h3 className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>Leo Narváez</h3>
        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Estudiante de Ingeniería</p>

        <div className="w-full bg-slate-50 rounded-xl p-3.5 mt-4 border text-[11px] font-semibold text-slate-500 leading-relaxed" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
          Progreso general del {globalProgress}% en la ruta de aseguramiento. ¡Sigue así!
        </div>
      </div>

      {/* Progress bar chart */}
      <StudyBarChart />

      {/* Mentors / Recommended paths */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 flex-grow" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
        <h4 className="text-xs font-black uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Niveles de Madurez</h4>
        
        <ul className="space-y-3">
          {[
            { title: 'Entry Profile', desc: 'Para start-ups pequeñas', active: globalProgress >= 20 },
            { title: 'Basic Profile', desc: 'Un solo proyecto/equipo', active: globalProgress >= 50 },
            { title: 'Intermediate Profile', desc: 'Múltiples proyectos', active: globalProgress >= 80 },
            { title: 'Advanced Profile', desc: 'Crecimiento de VSEs', active: globalProgress === 100 }
          ].map((lvl, idx) => (
            <li key={idx} className="flex items-center justify-between p-2 rounded-xl" style={lvl.active ? { background: 'rgba(99, 102, 241, 0.04)' } : {}}>
              <div className="text-left">
                <p className="text-[11px] font-extrabold leading-none mb-1" style={lvl.active ? { color: 'var(--text-primary)' } : { color: 'var(--text-muted)' }}>{lvl.title}</p>
                <p className="text-[9px] font-semibold text-slate-400 leading-none">{lvl.desc}</p>
              </div>
              {lvl.active ? (
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[8px] font-black">✓</span>
              ) : (
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[8px] font-black">◦</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
