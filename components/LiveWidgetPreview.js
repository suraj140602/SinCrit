"use client";
import React, { useState, useMemo, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Syntax highlighter — escapes HTML FIRST, then wraps known tokens in spans.
// FIX: the original called dangerouslySetInnerHTML on raw dartCode lines, which
// allowed any HTML inside dartCode (e.g. <img onerror=alert(1)>) to execute.
// Now we escape < > & " ' before applying colour spans so no raw HTML can
// survive into the DOM.
// ---------------------------------------------------------------------------
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightDart(line) {
  const escaped = escapeHtml(line);
  return escaped
    .replace(
      /\b(class|extends|return|const|final|if|else|Widget|String|int|double|bool|void)\b/g,
      '<span style="color:#569cd6">$1</span>'
    )
    .replace(
      /(@override)/g,
      '<span style="color:#c586c0">$1</span>'
    )
    .replace(
      /(&#39;[^&#]*&#39;)/g,           // escaped single-quoted strings
      '<span style="color:#ce9178">$1</span>'
    )
    .replace(
      /\b(Scaffold|Container|Text|Column|Row|SizedBox|Padding|Icon|ElevatedButton|Colors)\b/g,
      '<span style="color:#4ec9b0">$1</span>'
    );
}

// ---------------------------------------------------------------------------
// renderNode — JSON schema → React elements
// FIX: use node.id (or a stable derived key) instead of array index so React
// can reconcile children correctly when they're reordered or removed.
// ---------------------------------------------------------------------------
let _nodeKeyCounter = 0;
function stableKey(node, fallback) {
  // Use an id from the schema if available, otherwise fall back to the index
  // passed by the caller. We never use Math.random() here — that would cause
  // every render to remount everything.
  return node?.id ?? node?.props?.key ?? fallback;
}

const renderNode = (node, indexFallback = 0) => {
  if (!node) return null;
  const { type, props = {}, styles = {}, children = [] } = node;
  const key = stableKey(node, indexFallback);

  switch (type) {
    case 'Container':
    case 'Column':
    case 'Row':
      return (
        <div key={key} style={styles} className={props.className}>
          {children.map((child, i) => renderNode(child, i))}
        </div>
      );
    case 'Text':
      return <span key={key} style={styles} className={props.className}>{props.text || 'Text'}</span>;
    case 'Button':
    case 'IconBtn':
      return (
        <button key={key} style={styles} className={`px-4 py-2 rounded ${props.className || 'bg-blue-600 text-white'}`}>
          {props.text || 'Button'}
        </button>
      );
    case 'Image':
    case 'CircleImg':
      return (
        <img
          key={key}
          // FIX: replaced via.placeholder.com (unreliable external CDN) with
          // a data URI that never goes to the network and works offline.
          src={props.src || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="12" font-family="sans-serif"%3EImage%3C/text%3E%3C/svg%3E'}
          alt="Preview"
          style={styles}
          className={type === 'CircleImg' ? 'rounded-full object-cover' : 'object-cover'}
        />
      );
    case 'Input':
    case 'TextField':
    case 'SearchBar':
      return (
        <input
          key={key}
          type="text"
          placeholder={props.placeholder || 'Search...'}
          style={styles}
          className={`w-full px-3 py-2 bg-[#0e1117] border border-white/10 rounded-md text-sm text-white outline-none ${props.className || ''}`}
          readOnly
        />
      );
    case 'CustomCode':
      return (
        <div key={key} style={styles} className={`w-[80%] flex items-center gap-2 px-3 py-2 bg-[#161b22] border border-white/10 rounded-full shadow-inner ${props.className || ''}`}>
          <span className="text-gray-500 text-xs">⌕</span>
          <span className="text-xs text-gray-500 tracking-wide">{props.code ? 'Custom search...' : 'Search...'}</span>
        </div>
      );
    case 'Icon':
      return <span key={key} style={styles} className={props.className}>{props.icon || '✦'}</span>;
    default:
      return (
        <div key={key} className="p-2 border border-dashed border-red-500/50 text-red-500 text-[10px] bg-red-500/10 rounded">
          Unknown: {type}
        </div>
      );
  }
};

// ---------------------------------------------------------------------------
// Validate assetId to prevent path traversal or URL injection before it is
// interpolated into the iframe src.
// FIX: assetId was interpolated directly into the URL template literal with no
// validation. An attacker (or a bug) could supply ../../evil or a
// javascript: fragment. We now only allow alphanumeric + hyphens + underscores.
// ---------------------------------------------------------------------------
const SAFE_ASSET_ID = /^[a-zA-Z0-9_-]+$/;

function buildIframeUrl(assetId) {
  if (!assetId || !SAFE_ASSET_ID.test(assetId)) return null;
  // encodeURIComponent as an extra belt-and-suspenders measure
  return `https://suraj140602.github.io/appforge_preview_engine/${encodeURIComponent(assetId)}/`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function LiveWidgetPreview({ schema, dartCode, colors, assetId }) {
  // FIX: the original toggle logic was circular. `isLive` derived from
  // `viewMode === 'preview' && assetId`, then the button toggled based on
  // `isLive`, so clicking when assetId was falsy set mode to 'preview' but
  // isLive stayed false — the button never changed state visually.
  //
  // New approach: viewMode is purely 'preview' | 'code'. Whether the preview
  // is actually live depends on assetId being valid, handled at render time.
  const [viewMode, setViewMode] = useState('preview');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const iframeUrl = useMemo(() => buildIframeUrl(assetId), [assetId]);
  const showLive = viewMode === 'preview' && !!iframeUrl;

  const toggleView = useCallback((e) => {
    e.stopPropagation();
    setViewMode(prev => prev === 'preview' ? 'code' : 'preview');
    // Reset iframe state when switching back to preview
    setIframeLoaded(false);
    setIframeError(false);
  }, []);

  // ── DART CODE BRANCH ──────────────────────────────────────────────────────
  if (dartCode) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center relative overflow-hidden bg-[#050505] group/preview">

        {/* Hover toggle */}
        <div className="absolute top-2 right-2 z-50 opacity-0 group-hover/preview:opacity-100 transition-opacity">
          <button
            onClick={toggleView}
            className="bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-white/10 transition"
          >
            {viewMode === 'code' ? '▶ Live Preview' : '</> View Code'}
          </button>
        </div>

        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-20 blur-2xl"
          style={{ background: `linear-gradient(135deg, ${colors?.[0] || '#3b82f6'}, ${colors?.[1] || '#8b5cf6'})` }}
        />

        {showLive ? (
          // ── LIVE IFRAME ────────────────────────────────────────────────────
          <div className="w-[90%] h-[95%] bg-black rounded-xl border border-white/10 shadow-2xl overflow-hidden relative z-10 flex items-center justify-center">

            {/* FIX: loading state clears when iframe fires onLoad */}
            {!iframeLoaded && !iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30 text-xs z-10 pointer-events-none">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                Loading Engine...
              </div>
            )}

            {/* FIX: error state shown when iframe fails to load */}
            {iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-red-400/70 text-xs z-10 pointer-events-none">
                <span className="text-xl">⚠</span>
                Preview unavailable
              </div>
            )}

            {/* FIX: removed allow-same-origin from sandbox.
              allow-scripts alone is sufficient for the preview engine to run.
              Combining allow-scripts + allow-same-origin lets the iframe remove
              its own sandbox and access the parent window — a known escape. */}
            <iframe
              src={iframeUrl}
              className={`w-full h-full relative z-10 border-none bg-transparent transition-opacity duration-300 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
              title={`Preview of ${assetId}`}
              sandbox="allow-scripts"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
            />
          </div>
        ) : (
          // ── CODE VIEW (IDE WINDOW) ─────────────────────────────────────────
          <div className="w-[90%] h-[95%] bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative z-10">

            {/* Mac traffic lights */}
            <div className="h-7 bg-[#2d2d2d] flex items-center px-3 gap-1.5 border-b border-black/50 shrink-0 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-3 text-[10px] text-gray-400 font-mono font-medium tracking-wider">widget.dart</span>
            </div>

            {/* Code body */}
            <div className="p-3 overflow-y-auto custom-scrollbar flex-1 text-left">
              <pre className="font-mono text-[8.5px] leading-[1.6] text-[#d4d4d4] whitespace-pre-wrap">
                {dartCode.split('\n').map((line, i) => (
                  // FIX: dangerouslySetInnerHTML now receives HTML-escaped +
                  // syntax-highlighted content. Raw dartCode is never injected.
                  <div key={i} dangerouslySetInnerHTML={{ __html: highlightDart(line) }} />
                ))}
              </pre>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    );
  }

  // ── JSON SCHEMA BRANCH ────────────────────────────────────────────────────
  if (!schema) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-mono bg-white/5 rounded-t-xl">
        No preview data
      </div>
    );
  }

  // FIX: JSON.parse runs on every render in the original. useMemo means it
  // only re-parses when the schema prop actually changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const parsedSchema = useMemo(() => {
    if (typeof schema !== 'string') return schema;
    try {
      return JSON.parse(schema);
    } catch {
      return null;
    }
  }, [schema]);

  if (!parsedSchema) {
    return (
      <div className="text-red-500 text-xs flex items-center justify-center h-full">
        Invalid Schema
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0b] rounded-t-xl flex items-center justify-center p-4">
      <div className="transform scale-75 origin-center w-full flex items-center justify-center pointer-events-none">
        {renderNode(parsedSchema)}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#12161f] to-transparent z-10" />
    </div>
  );
}