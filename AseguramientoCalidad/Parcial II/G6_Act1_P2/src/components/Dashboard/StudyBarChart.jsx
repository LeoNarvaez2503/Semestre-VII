import { TrendingUp } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import standardsData from '../../data/standardsData';

export default function StudyBarChart() {
  const { getModuleProgress } = useLearning();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col justify-between" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Progreso por Módulo</h4>
        <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} />
      </div>
      <div className="flex items-end justify-between h-28 pt-2">
        {standardsData.map((s) => {
          const progress = getModuleProgress(s.id, (s.temas || []).length);
          const percent = progress > 0 ? progress : 6; // min height to show
          let color = 'linear-gradient(to top, #7c3aed, #a78bfa)';
          if (s.id === 2) color = 'linear-gradient(to top, #0891b2, #22d3ee)';
          if (s.id === 3) color = 'linear-gradient(to top, #059669, #34d399)';
          if (s.id === 4) color = 'linear-gradient(to top, #ea580c, #fb923c)';
          if (s.id === 5) color = 'linear-gradient(to top, #db2777, #f472b6)';

          return (
            <div key={s.id} className="flex flex-col items-center flex-grow group relative">
              {/* Tooltip */}
              <div className="absolute -top-7 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded shadow font-bold z-10 whitespace-nowrap">
                {progress}%
              </div>
              <div className="w-6 rounded-t-md relative overflow-hidden transition-all duration-500 bg-slate-100" style={{ height: `${percent}%`, background: progress > 0 ? color : 'var(--bg-badge)' }} />
              <span className="text-[9px] font-bold mt-2" style={{ color: 'var(--text-muted)' }}>M{s.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
