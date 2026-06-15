/**
 * App.jsx — Presentación Técnica DeFi
 * Arquitectura de Software en Finanzas Descentralizadas
 * Universidad — Defensa técnica 60 minutos — 6 expositores
 */

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SlideBlock1 from './slides/SlideBlock1.jsx';
import SlideBlock2 from './slides/SlideBlock2.jsx';
import SlideBlock3 from './slides/SlideBlock3.jsx';
import SlideBlock4 from './slides/SlideBlock4.jsx';
import SlideBlock5 from './slides/SlideBlock5.jsx';
import SlideBlock6 from './slides/SlideBlock6.jsx';

const SLIDES = [
  { id: 'bloque-1', label: '01 EVM', title: 'EVM & Gas' },
  { id: 'bloque-2', label: '02 AMM', title: 'Uniswap V3' },
  { id: 'bloque-3', label: '03 Vaults', title: 'Composability' },
  { id: 'bloque-4', label: '04 Flash', title: 'Oráculos & Loans' },
  { id: 'bloque-5', label: '05 Proxy', title: 'Upgrade Patterns' },
  { id: 'bloque-6', label: '06 QA', title: 'Verificación Formal' },
];

/* ---- Minimal node topology background ---- */
function TopologyBg() {
  const nodes = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 3 + 1.5,
    delay: Math.random() * 4,
  }));

  return (
    <svg
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.25 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6382ff" />
          <stop offset="100%" stopColor="#6382ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Lines between nearby nodes */}
      {nodes.map((a) =>
        nodes
          .filter((b) => b.id > a.id)
          .filter((b) => Math.hypot(b.x - a.x, b.y - a.y) < 28)
          .map((b) => (
            <line
              key={`${a.id}-${b.id}`}
              x1={`${a.x}%`} y1={`${a.y}%`}
              x2={`${b.x}%`} y2={`${b.y}%`}
              stroke="#6382ff"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          ))
      )}
      {/* Nodes */}
      {nodes.map((n) => (
        <circle
          key={n.id}
          cx={`${n.x}%`}
          cy={`${n.y}%`}
          r={n.r}
          fill="#6382ff"
          opacity="0.5"
          style={{
            animation: `pulse-node 3s ${n.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </svg>
  );
}

/* ---- Cover Slide ---- */
function CoverSlide({ onStart }) {
  return (
    <div id="cover" className="cover-slide">
      <div className="cover-grid-bg" />
      <div className="cover-glow-1" />
      <div className="cover-glow-2" />
      <TopologyBg />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', width: '100%' }}>
        {/* Top badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div className="cover-badge">
            <span>⛓</span>
            Defensa Técnica · Ingeniería de Software · Universidad
          </div>
        </div>

        {/* Main title */}
        <h1 className="cover-title">
          Arquitectura de<br />
          Software en DeFi
        </h1>

        <p className="cover-subtitle">
          Cómo la arquitectura de software resuelve los problemas financieros mediante
          protocolos descentralizados: desde la EVM hasta la verificación formal, pasando
          por AMMs, Flash Loans, Proxy Patterns y QA en código inmutable.
        </p>

        {/* Meta */}
        <div className="cover-meta">
          {[
            { value: '6', label: 'Expositores' },
            { value: '60', label: 'Minutos' },
            { value: '6', label: 'Protocolos DeFi' },
            { value: '100%', label: 'On-chain' },
          ].map((m, i) => (
            <div key={i} className="cover-meta-item">
              <div className="cover-meta-value">{m.value}</div>
              <div className="cover-meta-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Presenters */}
        <div className="cover-presenters">
          {[
            { n: '01', t: 'EVM & Gas' },
            { n: '02', t: 'AMMs & V3' },
            { n: '03', t: 'Composability' },
            { n: '04', t: 'Flash Loans' },
            { n: '05', t: 'Proxy Patterns' },
            { n: '06', t: 'QA & Formal' },
          ].map((p, i) => (
            <div key={i} style={{
              padding: '8px 16px',
              background: 'rgba(99,130,255,0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
            }}>
              <span style={{ color: 'var(--accent-primary)' }}>{p.n}</span> · {p.t}
            </div>
          ))}
        </div>

        {/* Protocol badges */}
        <div style={{ marginTop: '32px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { name: 'Ethereum EVM', c: 'blue' },
            { name: 'Uniswap V3', c: 'cyan' },
            { name: 'MakerDAO', c: 'blue' },
            { name: 'Aave V3', c: 'purple' },
            { name: 'Chainlink', c: 'amber' },
            { name: 'Foundry / Certora', c: 'green' },
          ].map((b, i) => (
            <span key={i} className={`badge badge-${b.c === 'blue' ? 'blue' : b.c === 'cyan' ? 'cyan' : b.c === 'purple' ? 'purple' : b.c === 'amber' ? 'amber' : 'green'}`}>
              {b.name}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '48px' }}>
          <button id="btn-start-presentation" onClick={onStart}
            style={{
              padding: '14px 40px',
              background: 'linear-gradient(135deg, #6382ff 0%, #38bdf8 100%)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 0 30px rgba(99,130,255,0.35)',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={e => e.target.style.boxShadow = '0 0 50px rgba(99,130,255,0.55)'}
            onMouseLeave={e => e.target.style.boxShadow = '0 0 30px rgba(99,130,255,0.35)'}
          >
            ▶ Iniciar Presentación
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Navigation Bar ---- */
function NavBar({ activeSlide, onNav }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="nav-bar">
      <span className="nav-logo">⛓ DeFi Architecture</span>
      <div className="nav-divider" />
      <div className="nav-slides">
        {SLIDES.map((slide) => (
          <button
            key={slide.id}
            id={`nav-${slide.id}`}
            className={`nav-slide-btn ${activeSlide === slide.id ? 'active' : ''}`}
            onClick={() => onNav(slide.id)}
          >
            {slide.label}
          </button>
        ))}
      </div>
      <div className="nav-divider" />
      <span className="nav-time">🕐 {time}</span>
    </nav>
  );
}

/* ---- Main App ---- */
export default function App() {
  const [showPresentation, setShowPresentation] = useState(false);
  const [activeSlide, setActiveSlide] = useState('bloque-1');
  const observerRef = useRef(null);

  /* Detect active slide on scroll */
  useEffect(() => {
    if (!showPresentation) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlide(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('.slide');
    sections.forEach((s) => observer.observe(s));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [showPresentation]);

  const handleNav = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSlide(id);
  };

  const handleStart = () => {
    setShowPresentation(true);
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="presentation">
      {/* Cover */}
      <CoverSlide onStart={handleStart} />

      {/* Presentation Slides */}
      {showPresentation && (
        <>
          <NavBar activeSlide={activeSlide} onNav={handleNav} />
          <div style={{ paddingTop: '52px' }}>
            <SlideBlock1 />
            <SlideBlock2 />
            <SlideBlock3 />
            <SlideBlock4 />
            <SlideBlock5 />
            <SlideBlock6 />
          </div>

          {/* Footer */}
          <footer style={{
            textAlign: 'center',
            padding: '32px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-deep)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Presentación técnica · Arquitectura de Software en DeFi ·{' '}
              <span style={{ color: 'var(--accent-primary)' }}>Ingeniería de Software</span>
              {' '}· Fuentes: Ethereum Yellowpaper, Uniswap V3 Whitepaper, MakerDAO MCD, Aave V3 Docs, EIP-1967
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
