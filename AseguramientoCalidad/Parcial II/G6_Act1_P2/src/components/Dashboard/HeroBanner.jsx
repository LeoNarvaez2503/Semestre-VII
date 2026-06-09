import { ArrowRight } from 'lucide-react';

export default function HeroBanner({ onStartClick }) {
  return (
    <section className="relative rounded-3xl p-6 md:p-8 text-white overflow-hidden mb-8 flex flex-col justify-between min-h-[180px] shadow-lg shadow-indigo-100" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.15)' }}>
      {/* Geometrics background SVGs */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      {/* Sparkles icons */}
      <div className="absolute right-12 top-6 opacity-30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M3 12h18" />
        </svg>
      </div>
      <div className="absolute right-24 bottom-6 opacity-20">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 3v18M3 12h18" />
        </svg>
      </div>

      <div className="relative z-10 max-w-xl">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-200">Curso Interactivo Aseguramiento Calidad</span>
        <h2 className="text-xl md:text-3xl font-black mt-2 mb-4 leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Domina los Procesos y Estándares de la Norma ISO/IEC 29110
        </h2>
        <p className="text-xs text-indigo-100/90 leading-relaxed">
          Descubre las guías básicas y de entrada para VSEs. Lee los temas correspondientes, escribe tus reflexiones personales y aprueba las pruebas de conocimiento.
        </p>
      </div>

      <div className="relative z-10 mt-6 flex gap-3">
        <button
          onClick={onStartClick}
          className="px-5 py-2.5 rounded-xl bg-white text-indigo-600 text-xs font-black flex items-center gap-1.5 hover:scale-[1.03] transition-transform shadow-md"
        >
          Comenzar Curso <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <a
          href="https://www.iso.org/standard/82669.html"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-colors"
        >
          Documentación Oficial
        </a>
      </div>
    </section>
  );
}
