import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LearningContext = createContext(null);
const STORAGE_KEY = 'iso-learning-v2';

function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch { /* ignore */ }
}

/**
 * State shape per module:
 * {
 *   [moduleId]: {
 *     currentTema: 0,                    // index of current theme
 *     temas: {
 *       [temaIdx]: {
 *         read: false,
 *         quizScore: null,               // 0–100
 *         quizPassed: false,             // score >= 70
 *         reflectionText: '',
 *         reflectionSaved: false,
 *       }
 *     },
 *     completed: false,
 *   }
 * }
 */

const defaultTemaState = () => ({
  read: false,
  quizScore: null,
  quizPassed: false,
  reflectionText: '',
  reflectionSaved: false,
});

const defaultModuleState = () => ({
  currentTema: 0,
  temas: {},
  completed: false,
});

export function LearningProvider({ children }) {
  const [progress, setProgress] = useState(() => loadStorage());

  useEffect(() => { saveStorage(progress); }, [progress]);

  const getModuleState = useCallback((moduleId) => {
    return progress[moduleId] ?? defaultModuleState();
  }, [progress]);

  const getTemaState = useCallback((moduleId, temaIdx) => {
    const mod = progress[moduleId] ?? defaultModuleState();
    return mod.temas?.[temaIdx] ?? defaultTemaState();
  }, [progress]);

  const updateTema = useCallback((moduleId, temaIdx, patch) => {
    setProgress(prev => {
      const mod = prev[moduleId] ?? defaultModuleState();
      const temas = { ...mod.temas };
      temas[temaIdx] = { ...(temas[temaIdx] ?? defaultTemaState()), ...patch };
      return { ...prev, [moduleId]: { ...mod, temas } };
    });
  }, []);

  /** Mark tema as read */
  const markTemaRead = useCallback((moduleId, temaIdx) => {
    updateTema(moduleId, temaIdx, { read: true });
  }, [updateTema]);

  /** Save quiz result for a tema */
  const saveTemaQuiz = useCallback((moduleId, temaIdx, score) => {
    updateTema(moduleId, temaIdx, {
      quizScore: score,
      quizPassed: score >= 70,
    });
  }, [updateTema]);

  /** Save reflection for a tema */
  const saveTemaReflection = useCallback((moduleId, temaIdx, text) => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    updateTema(moduleId, temaIdx, {
      reflectionText: text,
      reflectionSaved: wordCount >= 15,
    });
  }, [updateTema]);

  /** Set current tema index for a module */
  const setCurrentTema = useCallback((moduleId, temaIdx) => {
    setProgress(prev => {
      const mod = prev[moduleId] ?? defaultModuleState();
      return { ...prev, [moduleId]: { ...mod, currentTema: temaIdx } };
    });
  }, []);

  /** Mark entire module complete */
  const markModuleCompleted = useCallback((moduleId) => {
    setProgress(prev => {
      const mod = prev[moduleId] ?? defaultModuleState();
      return { ...prev, [moduleId]: { ...mod, completed: true } };
    });
  }, []);

  /** Check if user can access a tema (all previous temas must have quizPassed) */
  const canAccessTema = useCallback((moduleId, temaIdx) => {
    if (temaIdx === 0) return true;
    const mod = progress[moduleId] ?? defaultModuleState();
    for (let i = 0; i < temaIdx; i++) {
      const t = mod.temas?.[i] ?? defaultTemaState();
      if (!t.quizPassed) return false;
    }
    return true;
  }, [progress]);

  /** Get module progress percentage */
  const getModuleProgress = useCallback((moduleId, totalTemas) => {
    if (!totalTemas) return 0;
    const mod = progress[moduleId] ?? defaultModuleState();
    let passed = 0;
    for (let i = 0; i < totalTemas; i++) {
      if (mod.temas?.[i]?.quizPassed) passed++;
    }
    return Math.round((passed / totalTemas) * 100);
  }, [progress]);

  /** Get global progress */
  const getGlobalProgress = useCallback((standards) => {
    if (!standards?.length) return 0;
    let total = 0;
    standards.forEach(s => {
      const nTemas = s.temas?.length || 1;
      total += getModuleProgress(s.id, nTemas);
    });
    return Math.round(total / standards.length);
  }, [getModuleProgress]);

  /** Reset module */
  const resetModule = useCallback((moduleId) => {
    setProgress(prev => {
      const next = { ...prev };
      delete next[moduleId];
      return next;
    });
  }, []);

  return (
    <LearningContext.Provider value={{
      progress,
      getModuleState,
      getTemaState,
      markTemaRead,
      saveTemaQuiz,
      saveTemaReflection,
      setCurrentTema,
      markModuleCompleted,
      canAccessTema,
      getModuleProgress,
      getGlobalProgress,
      resetModule,
    }}>
      {children}
    </LearningContext.Provider>
  );
}

export const useLearning = () => {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error('useLearning must be inside LearningProvider');
  return ctx;
};
