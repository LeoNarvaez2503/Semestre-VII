/**
 * CodeBlock.jsx — Syntax-highlighted code block component
 * Uses dangerouslySetInnerHTML to render pre-formatted HTML with
 * span color classes for syntax highlighting (no external lib needed).
 */

import React from 'react';

export default function CodeBlock({ lang, children }) {
  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-dots">
          <div className="code-dot red" />
          <div className="code-dot amber" />
          <div className="code-dot green" />
        </div>
        <span className="code-lang">{lang}</span>
      </div>
      <div className="code-content">
        <pre dangerouslySetInnerHTML={{ __html: children }} />
      </div>
    </div>
  );
}
