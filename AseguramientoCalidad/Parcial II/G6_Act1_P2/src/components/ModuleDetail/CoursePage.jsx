import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ChevronRight, Lock, CheckCircle, XCircle,
  RotateCcw, Trophy, BookOpen, Brain, PenLine, Save, AlertCircle, Play,
  ExternalLink
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { iconMap, ThemeToggle } from '../UI/SharedComponents';

/* ── Markdown renderer ─────────────────────────────── */
function renderLine(line, idx) {
  if (line.startsWith('### '))
    return (
      <h4 key={idx} className="text-sm font-bold mt-5 mb-2 uppercase tracking-wide" style={{ color: 'var(--text-accent)' }}>
        {line.slice(4)}
      </h4>
    );
  if (line.startsWith('- '))
    return (
      <li key={idx} className="flex items-start gap-2 mb-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-accent)' }} />
        <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>') }} />
      </li>
    );
  if (/^\d+\.\s/.test(line))
    return (
      <li key={idx} className="flex items-start gap-2 mb-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-bold flex-shrink-0" style={{ color: 'var(--text-accent)', minWidth: 18 }}>{line.match(/^\d+/)[0]}.</span>
        <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>') }} />
      </li>
    );
  if (line.trim() === '') return <div key={idx} className="h-2" />;
  return (
    <p key={idx} className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}
      dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>') }}
    />
  );
}

/* ── Sub-views ─────────────────────────────────────── */

/** Reading view for a tema */
function TemaReading({ tema, temaIdx, moduleId, onContinue }) {
  const { getTemaState, markTemaRead } = useLearning();
  const tState = getTemaState(moduleId, temaIdx);
  const contentRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const h = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 100 : Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      setScrollPct(Math.min(pct, 100));
    };
    h(); // initial
    el.addEventListener('scroll', h);
    return () => el.removeEventListener('scroll', h);
  }, [tema]);

  const handleContinue = () => {
    markTemaRead(moduleId, temaIdx);
    onContinue();
  };

  const lines = tema.contenido.split('\n');

  return (
    <div className="flex flex-col h-full">
      {/* scroll progress */}
      <div className="progress-track h-1 flex-shrink-0" style={{ borderRadius: 0 }}>
        <motion.div className="progress-bar h-full" animate={{ width: `${scrollPct}%` }} transition={{ duration: 0.1 }} />
      </div>
      <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full">
        {lines.map(renderLine)}

        {/* Recursos del tema si existen en el módulo */}
        {tema.recursos && (
          <div className="mt-8 space-y-4">
            {tema.recursos.videoUrl && (
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={tema.recursos.videoUrl}
                    title={tema.recursos.videoTitle || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen loading="lazy"
                  />
                </div>
                {tema.recursos.videoTitle && (
                  <div className="px-3 py-2 text-xs font-medium" style={{ background: 'var(--bg-badge)', color: 'var(--text-secondary)' }}>
                    <Play className="w-3 h-3 inline mr-1" />{tema.recursos.videoTitle}
                  </div>
                )}
              </div>
            )}
            {tema.recursos.links?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-accent)' }}>
                  <ExternalLink className="w-3 h-3 inline mr-1" />Links útiles
                </p>
                {tema.recursos.links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="block p-2.5 glass rounded-lg text-xs font-medium hover:scale-[1.01] transition-transform"
                    style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                  >
                    {l.titulo} <ExternalLink className="w-3 h-3 inline ml-1" style={{ color: 'var(--text-accent)' }} />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="px-6 py-4 border-t flex-shrink-0 max-w-3xl mx-auto w-full" style={{ borderColor: 'var(--border-color)' }}>
        <motion.button
          onClick={handleContinue}
          className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        >
          {tState.read ? <><CheckCircle className="w-4 h-4" /> Ya leído — Ir al quiz</> : <><ArrowRight className="w-4 h-4" /> Continuar al quiz</>}
        </motion.button>
      </div>
    </div>
  );
}

/** Reflection textarea */
function TemaReflection({ tema, temaIdx, moduleId, onContinue }) {
  const { getTemaState, saveTemaReflection } = useLearning();
  const tState = getTemaState(moduleId, temaIdx);
  const [text, setText] = useState(tState.reflectionText || '');
  const [saved, setSaved] = useState(false);
  const wc = text.trim().split(/\s+/).filter(Boolean).length;
  const ok = wc >= 15;

  const handleSave = () => {
    saveTemaReflection(moduleId, temaIdx, text);
    setSaved(true);
    setTimeout(() => onContinue(), 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full space-y-5">
        <div className="glass rounded-xl p-5 border-l-4" style={{ borderLeftColor: 'var(--text-accent)' }}>
          <div className="flex items-center gap-2 mb-2">
            <PenLine className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-accent)' }}>Reflexión</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {tema.reflexionPrompt || '¿Qué aprendiste de este tema? ¿Cómo lo aplicarías?'}
          </p>
        </div>
        <textarea
          value={text} onChange={e => { setText(e.target.value); setSaved(false); }}
          placeholder="Escribe tu reflexión aquí..."
          className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/25"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', minHeight: 160 }}
          rows={7}
        />
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{wc} palabras</span>
          <span>{ok ? '✓ Mínimo alcanzado' : 'Mínimo 15 palabras'}</span>
        </div>
        <div className="progress-track h-1.5">
          <motion.div
            className="progress-bar h-full" animate={{ width: `${Math.min((wc / 15) * 100, 100)}%` }}
            style={ok ? {} : { background: 'linear-gradient(90deg, #f59e0b, #f97316)' }}
          />
        </div>
      </div>
      <div className="px-6 py-4 border-t flex-shrink-0 max-w-3xl mx-auto w-full" style={{ borderColor: 'var(--border-color)' }}>
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 py-3 text-sm font-bold" style={{ color: '#22c55e' }}>
              <CheckCircle className="w-5 h-5" /> ¡Guardado!
            </motion.div>
          ) : (
            <motion.button key="btn" onClick={handleSave} disabled={!ok}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={ok ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#fff' } : { background: 'var(--bg-badge)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
              whileHover={ok ? { scale: 1.02 } : {}} whileTap={ok ? { scale: 0.97 } : {}}
            >
              {ok ? <><Save className="w-4 h-4" /> Guardar y continuar</> : <><AlertCircle className="w-4 h-4" /> Escribe al menos 15 palabras</>}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Quiz view for a tema */
function TemaQuiz({ tema, temaIdx, moduleId, onPass, isLastTema }) {
  const { getTemaState, saveTemaQuiz } = useLearning();
  const tState = getTemaState(moduleId, temaIdx);
  const questions = tema.quiz || [];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [readyNext, setReadyNext] = useState(false);

  // Already passed
  if (tState.quizPassed && !showResult && Object.keys(answers).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center space-y-4">
        <CheckCircle className="w-14 h-14" style={{ color: '#22c55e' }} />
        <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>Tema aprobado</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Puntaje anterior: <strong style={{ color: '#22c55e' }}>{tState.quizScore}%</strong></p>
        <motion.button onClick={onPass}
          className="px-8 py-3 rounded-xl font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          {isLastTema ? '🏆 Finalizar módulo' : 'Siguiente tema →'}
        </motion.button>
      </div>
    );
  }

  if (questions.length === 0) {
    onPass();
    return null;
  }

  const handleSelect = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    setAnswers(prev => ({ ...prev, [currentQ]: optIdx === questions[currentQ].respuestaCorrecta }));
    setReadyNext(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setReadyNext(false);
    } else {
      const correct = Object.values(answers).filter(Boolean).length;
      const score = Math.round((correct / questions.length) * 100);
      saveTemaQuiz(moduleId, temaIdx, score);
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setShowResult(false);
    setReadyNext(false);
  };

  // Result screen
  if (showResult) {
    const correct = Object.values(answers).filter(Boolean).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center space-y-5">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5, delay: 0.2 }} className="text-5xl">
          {passed ? '🎉' : '📚'}
        </motion.div>
        <div>
          <p className="text-4xl font-black" style={{ color: passed ? '#22c55e' : '#ef4444' }}>{score}%</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{correct}/{questions.length} correctas</p>
        </div>
        <div className="rounded-xl p-4 max-w-sm text-sm" style={{ background: 'var(--bg-badge)', color: 'var(--text-secondary)' }}>
          {passed
            ? '¡Aprobado! Puedes avanzar al siguiente tema.'
            : 'Necesitas al menos 70% para avanzar. Repasa el contenido e intenta de nuevo.'}
        </div>
        {/* SVG ring */}
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="36" fill="none" stroke="var(--border-color)" strokeWidth="6" />
          <motion.circle cx="45" cy="45" r="36" fill="none"
            stroke={passed ? '#22c55e' : '#ef4444'} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 36}`}
            initial={{ strokeDashoffset: `${2 * Math.PI * 36}` }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 36 * (1 - score / 100)}` }}
            transition={{ duration: 1, ease: 'easeOut' }} transform="rotate(-90 45 45)"
          />
        </svg>
        <div className="flex gap-3">
          {!passed && (
            <motion.button onClick={handleRetry}
              className="px-6 py-3 rounded-xl border text-sm font-bold flex items-center gap-2"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-badge)' }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <RotateCcw className="w-4 h-4" /> Repetir prueba
            </motion.button>
          )}
          {passed && (
            <motion.button onClick={onPass}
              className="px-8 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <Trophy className="w-4 h-4" /> {isLastTema ? 'Finalizar módulo' : 'Siguiente tema'}
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const revealed = selected !== null;

  return (
    <div className="flex flex-col h-full">
      <div className="progress-track h-1 flex-shrink-0" style={{ borderRadius: 0 }}>
        <motion.div className="progress-bar h-full" animate={{ width: `${(currentQ / questions.length) * 100}%` }} />
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full space-y-5">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Brain className="w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} />
          Pregunta {currentQ + 1} de {questions.length} · Necesitas ≥ 70% para avanzar
        </div>
        <p className="text-lg font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{q.pregunta}</p>
        <div className="space-y-2.5">
          {q.opciones.map((opt, idx) => {
            const isCorrect = idx === q.respuestaCorrecta;
            const isSel = idx === selected;
            let brd = 'var(--border-color)', bg = 'var(--bg-card)', tc = 'var(--text-secondary)';
            if (revealed) {
              if (isCorrect) { brd = '#22c55e'; bg = 'rgba(34,197,94,0.08)'; tc = '#22c55e'; }
              else if (isSel) { brd = '#ef4444'; bg = 'rgba(239,68,68,0.08)'; tc = '#ef4444'; }
            }
            return (
              <motion.button key={idx} onClick={() => handleSelect(idx)} disabled={revealed}
                className="w-full text-left p-4 rounded-xl border text-sm font-medium flex items-center gap-3"
                style={{ borderColor: brd, background: bg, color: tc }}
                whileHover={!revealed ? { scale: 1.01 } : {}} whileTap={!revealed ? { scale: 0.98 } : {}}
              >
                {revealed && isCorrect && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#22c55e' }} />}
                {revealed && isSel && !isCorrect && <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />}
                {(!revealed || (!isCorrect && !isSel)) && (
                  <span className="w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>{String.fromCharCode(65 + idx)}</span>
                )}
                {opt}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 text-sm border-l-4"
              style={{
                background: selected === q.respuestaCorrecta ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
                borderLeftColor: selected === q.respuestaCorrecta ? '#22c55e' : '#ef4444',
                color: 'var(--text-secondary)',
              }}
            >
              <p className="font-bold mb-1" style={{ color: selected === q.respuestaCorrecta ? '#22c55e' : '#ef4444' }}>
                {selected === q.respuestaCorrecta ? '✓ ¡Correcto!' : '✗ Incorrecto'}
              </p>
              {q.explicacion}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="px-6 py-4 border-t flex-shrink-0 max-w-3xl mx-auto w-full" style={{ borderColor: 'var(--border-color)' }}>
        <motion.button onClick={handleNext} disabled={!readyNext}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={readyNext ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#fff' } : { background: 'var(--bg-badge)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
          whileHover={readyNext ? { scale: 1.02 } : {}} whileTap={readyNext ? { scale: 0.97 } : {}}
        >
          {currentQ < questions.length - 1 ? <><ChevronRight className="w-4 h-4" /> Siguiente pregunta</> : <><Trophy className="w-4 h-4" /> Ver resultado</>}
        </motion.button>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   MAIN COURSE PAGE — Full screen
   ═══════════════════════════════════════════════════ */

export default function CoursePage({ standard, onBack }) {
  const { getTemaState, canAccessTema, getModuleProgress, markModuleCompleted } = useLearning();
  const Icon = iconMap[standard?.icono];
  const temas = standard?.temas || [];
  const totalTemas = temas.length;

  const [activeTemaIdx, setActiveTemaIdx] = useState(0);
  // phases: 'reading' → 'reflection' → 'quiz'
  const [phase, setPhase] = useState('reading');
  const [moduleFinished, setModuleFinished] = useState(false);

  const progress = getModuleProgress(standard.id, totalTemas);

  // Find first unlocked tema that's not passed yet
  useEffect(() => {
    for (let i = 0; i < totalTemas; i++) {
      const t = getTemaState(standard.id, i);
      if (!t.quizPassed) { setActiveTemaIdx(i); return; }
    }
    // All passed
    setModuleFinished(true);
  }, []);

  const handleReadDone = () => setPhase('reflection');
  const handleReflectionDone = () => setPhase('quiz');

  const handleQuizPass = () => {
    if (activeTemaIdx < totalTemas - 1) {
      setActiveTemaIdx(activeTemaIdx + 1);
      setPhase('reading');
      window.scrollTo(0, 0);
    } else {
      markModuleCompleted(standard.id);
      setModuleFinished(true);
    }
  };

  const goToTema = (idx) => {
    if (!canAccessTema(standard.id, idx)) return;
    setActiveTemaIdx(idx);
    const t = getTemaState(standard.id, idx);
    if (t.quizPassed) setPhase('reading'); // can review
    else setPhase('reading');
  };

  const activeTema = temas[activeTemaIdx];

  // Module completed screen
  if (moduleFinished) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        <CourseHeader standard={standard} Icon={Icon} progress={100} onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center space-y-6">
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }} transition={{ duration: 0.8 }} className="text-6xl">
            🏆
          </motion.div>
          <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>¡Módulo Completado!</h2>
          <p className="text-base max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Has aprobado todos los temas de <strong>{standard.titulo}</strong>. Tu progreso está guardado.
          </p>
          <motion.button onClick={onBack}
            className="px-8 py-3 rounded-xl font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" /> Volver al catálogo
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <CourseHeader standard={standard} Icon={Icon} progress={progress} onBack={onBack} />

      {/* Tema navigation bar */}
      <div className="flex-shrink-0 border-b overflow-x-auto" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-1 px-4 py-2 max-w-5xl mx-auto">
          {temas.map((tema, idx) => {
            const accessible = canAccessTema(standard.id, idx);
            const tState = getTemaState(standard.id, idx);
            const isActive = idx === activeTemaIdx;
            return (
              <motion.button
                key={idx}
                onClick={() => goToTema(idx)}
                disabled={!accessible}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={
                  isActive
                    ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#fff' }
                    : accessible
                      ? { background: 'transparent', color: 'var(--text-secondary)' }
                      : { background: 'transparent', color: 'var(--text-muted)', opacity: 0.5, cursor: 'not-allowed' }
                }
                whileHover={accessible ? { scale: 1.03 } : {}}
                whileTap={accessible ? { scale: 0.97 } : {}}
              >
                {tState.quizPassed ? (
                  <CheckCircle className="w-3 h-3" style={{ color: isActive ? '#fff' : '#22c55e' }} />
                ) : !accessible ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <span className="w-4 h-4 rounded-full border text-[9px] font-bold flex items-center justify-center"
                    style={{ borderColor: isActive ? '#fff' : 'var(--border-color)', color: isActive ? '#fff' : 'var(--text-muted)' }}
                  >{idx + 1}</span>
                )}
                <span className="hidden sm:inline">{tema.titulo.length > 25 ? tema.titulo.slice(0, 25) + '…' : tema.titulo}</span>
                <span className="sm:hidden">T{idx + 1}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Phase indicator */}
      <div className="flex-shrink-0 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-0 max-w-5xl mx-auto">
          {[
            { id: 'reading', label: 'Lectura', icon: BookOpen },
            { id: 'reflection', label: 'Reflexión', icon: PenLine },
            { id: 'quiz', label: 'Prueba', icon: Brain },
          ].map((p, i) => {
            const isActive = phase === p.id;
            const isPast = (phase === 'reflection' && p.id === 'reading') || (phase === 'quiz' && p.id !== 'quiz');
            return (
              <div key={p.id} className="flex-1 flex items-center">
                <div className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${isActive ? '' : ''}`}
                  style={{
                    color: isActive ? 'var(--text-accent)' : isPast ? '#22c55e' : 'var(--text-muted)',
                    borderBottom: isActive ? '2px solid var(--text-accent)' : isPast ? '2px solid #22c55e' : '2px solid transparent',
                  }}
                >
                  <p.icon className="w-3.5 h-3.5" />
                  {p.label}
                  {isPast && <CheckCircle className="w-3 h-3" style={{ color: '#22c55e' }} />}
                </div>
                {i < 2 && <div className="w-6 h-px" style={{ background: 'var(--border-color)' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTemaIdx}-${phase}`}
            className="flex-1 min-h-0 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {phase === 'reading' && activeTema && (
              <TemaReading tema={activeTema} temaIdx={activeTemaIdx} moduleId={standard.id} onContinue={handleReadDone} />
            )}
            {phase === 'reflection' && activeTema && (
              <TemaReflection tema={activeTema} temaIdx={activeTemaIdx} moduleId={standard.id} onContinue={handleReflectionDone} />
            )}
            {phase === 'quiz' && activeTema && (
              <TemaQuiz tema={activeTema} temaIdx={activeTemaIdx} moduleId={standard.id} onPass={handleQuizPass} isLastTema={activeTemaIdx === totalTemas - 1} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Course Header ──────────────────────────────────── */
function CourseHeader({ standard, Icon, progress, onBack }) {
  return (
    <div className={`flex-shrink-0 bg-gradient-to-r ${standard.color} text-white`}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <motion.button onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          {Icon && <div className="p-2 rounded-lg bg-white/20 flex-shrink-0"><Icon className="w-4 h-4" /></div>}
          <div className="min-w-0">
            <p className="text-xs text-white/70 font-medium">{standard.categoria}</p>
            <h1 className="text-sm font-black truncate">{standard.titulo}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="progress-track h-1.5 w-20" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }}
                style={{ background: progress >= 100 ? '#22c55e' : '#fff' }} transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-bold">{progress}%</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
