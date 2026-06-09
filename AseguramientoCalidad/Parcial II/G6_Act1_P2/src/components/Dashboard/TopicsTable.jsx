import standardsData from '../../data/standardsData';

export default function TopicsTable({ onStudyClick }) {
  const totalTemas = standardsData.reduce((acc, s) => acc + (s.temas || []).length, 0);

  return (
    <section className="bg-white rounded-2xl p-5 border border-slate-100 mb-8" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Temas y Contenidos de Estudio</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Explora de forma directa los contenidos individuales</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Total: {totalTemas} Temas</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Estándar</th>
              <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</th>
              <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Título del Tema</th>
              <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ divideColor: 'var(--border-color)' }}>
            {standardsData.flatMap(s => s.temas.map(t => ({ s, t }))).slice(0, 5).map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors" style={{ hoverBg: 'rgba(0,0,0,0.02)' }}>
                <td className="py-3.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${row.s.color}`} />
                    <span className="text-xs font-black truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>{row.s.titulo}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-2">
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded" style={{ background: 'var(--bg-badge)', color: 'var(--text-accent)' }}>
                    {row.s.categoria}
                  </span>
                </td>
                <td className="py-3.5 pr-2 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                  {row.t.titulo}
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => onStudyClick(row.s)}
                    className="p-1 px-3.5 rounded-lg border text-[10px] font-extrabold hover:bg-slate-50 transition-colors"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    Estudiar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
