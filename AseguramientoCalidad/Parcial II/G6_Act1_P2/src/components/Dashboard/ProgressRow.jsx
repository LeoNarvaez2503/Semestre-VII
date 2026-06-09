import { BookOpen } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import standardsData from '../../data/standardsData';

export default function ProgressRow({ onCardClick, globalProgress }) {
  const { getModuleProgress } = useLearning();

  if (globalProgress === 0) return null;

  return (
    <section className="mb-8">
      <h3 className="text-xs font-black uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Estudio en Curso</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {standardsData.map(s => {
          const progress = getModuleProgress(s.id, (s.temas || []).length);
          if (progress === 0) return null;
          return (
            <div
              key={s.id}
              onClick={() => onCardClick(s)}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-all"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${s.color} text-white`}>
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold truncate" style={{ color: 'var(--text-primary)' }}>{s.titulo}</p>
                  <p className="text-[9px] font-bold text-slate-400">{s.categoria}</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md flex-shrink-0" style={{ color: 'var(--text-accent)', background: 'rgba(99, 102, 241, 0.08)' }}>{progress}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
