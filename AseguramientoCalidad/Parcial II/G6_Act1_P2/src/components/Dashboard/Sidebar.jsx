import { GraduationCap, Grid, BookOpen, TrendingUp, RotateCcw } from 'lucide-react';
import { ThemeToggle } from '../UI/SharedComponents';
import { useLearning } from '../../context/LearningContext';
import standardsData from '../../data/standardsData';

export default function Sidebar({ activeTab, setActiveTab, setSelectedCategory }) {
  const { resetModule } = useLearning();

  const handleResetData = () => {
    if (window.confirm('¿Deseas reiniciar todo tu progreso de aprendizaje?')) {
      standardsData.forEach(s => resetModule(s.id));
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 border-r flex-shrink-0 flex flex-col justify-between p-6 hidden lg:flex bg-white" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold uppercase tracking-widest text-indigo-600" style={{ color: 'var(--text-accent)', fontFamily: 'Outfit, sans-serif' }}>ISO HUB</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Learning Hub</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-6">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3 px-3">Overview</span>
            <ul className="space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Grid },
                { id: 'catalog', label: 'Estándares', icon: BookOpen },
                { id: 'progress', label: 'Estadísticas', icon: TrendingUp },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id === 'catalog') {
                          setSelectedCategory('Todas');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all"
                      style={isActive ? {
                        background: 'rgba(99, 102, 241, 0.08)',
                        color: 'var(--text-accent)'
                      } : {
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3 px-3">Estudio G6</span>
            <ul className="space-y-3 px-3">
              {[
                { name: 'Leo Narvaez', role: 'Calidad Lead', avatar: 'LN' },
                { name: 'Ravi Kumar', role: 'Ingeniero Proceso', avatar: 'RK' },
                { name: 'Prashant Singh', role: 'Desarrollador', avatar: 'PS' }
              ].map((mate, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700" style={{ background: 'var(--bg-badge)', color: 'var(--text-primary)' }}>
                    {mate.avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-extrabold leading-none mb-0.5" style={{ color: 'var(--text-primary)' }}>{mate.name}</p>
                    <p className="text-[9px] font-bold leading-none" style={{ color: 'var(--text-muted)' }}>{mate.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs font-extrabold text-slate-400" style={{ color: 'var(--text-secondary)' }}>Tema</span>
          <ThemeToggle />
        </div>
        <button onClick={handleResetData} className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-600 transition-colors text-xs font-extrabold" style={{ borderColor: 'rgba(239, 68, 68, 0.1)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar progreso
        </button>
      </div>
    </aside>
  );
}
