"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// 3D HOLOGRAPHIC LIVE PREVIEW OVERLAY
// Renders a perspective-3D phone frame with drag-rotation, momentum physics,
// auto-spin, flip-to-back, and a live iframe portal for the preview engine.
// Drop this anywhere by passing schema + assetId (optional) as props.
// ─────────────────────────────────────────────────────────────────────────────

const HolographicPreview = ({ schema, assetId, onClose }) => {
  const deviceRef = useRef(null);
  const wrapRef   = useRef(null);

  // Rotation state — kept in refs so RAF never stalls on React renders
  const rotY    = useRef(0);
  const rotX    = useRef(-8);
  const velY    = useRef(0);
  const velX    = useRef(0);
  const lastX   = useRef(0);
  const lastY   = useRef(0);
  const dragging = useRef(false);
  const inerting = useRef(false);

  // React-visible UI state
  const [autoSpin, setAutoSpin]     = useState(true);
  const [flipped, setFlipped]       = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [displayRot, setDisplayRot]   = useState({ x: -8, y: 0 });

  // Build safe iframe URL (same guard as LiveWidgetPreview)
  const SAFE_ASSET_ID = /^[a-zA-Z0-9_-]+$/;
  const iframeUrl = assetId && SAFE_ASSET_ID.test(assetId)
    ? `https://suraj140602.github.io/appforge_preview_engine/${encodeURIComponent(assetId)}/`
    : null;

  // ── Apply rotation to DOM directly (bypasses React render loop) ──────────
  const applyRotation = useCallback(() => {
    if (!deviceRef.current) return;
    deviceRef.current.style.transform =
      `rotateY(${rotY.current}deg) rotateX(${rotX.current}deg)`;
    setDisplayRot({ x: Math.round(rotX.current), y: Math.round(rotY.current) % 360 });
  }, []);

  // ── Momentum inertia loop ────────────────────────────────────────────────
  const runInertia = useCallback(() => {
    if (!inerting.current) return;
    if (Math.abs(velY.current) < 0.08 && Math.abs(velX.current) < 0.08) {
      inerting.current = false;
      return;
    }
    velY.current *= 0.92;
    velX.current *= 0.92;
    rotY.current += velY.current;
    rotX.current  = Math.max(-28, Math.min(18, rotX.current + velX.current));
    applyRotation();
    requestAnimationFrame(runInertia);
  }, [applyRotation]);

  // ── Pointer drag handlers (attached via useEffect for capture phase) ─────
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onDown = (e) => {
      // Stop auto-spin if running
      setAutoSpin(false);
      setFlipped(false);
      dragging.current  = true;
      inerting.current  = false;
      lastX.current     = e.clientX;
      lastY.current     = e.clientY;
      velY.current      = 0;
      velX.current      = 0;
      if (deviceRef.current) deviceRef.current.style.transition = 'none';
      el.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      velY.current = dx * 0.55;
      velX.current = dy * 0.28;
      rotY.current += dx * 0.55;
      rotX.current  = Math.max(-28, Math.min(18, rotX.current + dy * 0.28));
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      applyRotation();
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current  = false;
      inerting.current  = true;
      requestAnimationFrame(runInertia);
    };

    el.addEventListener('pointerdown', onDown, { passive: false });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup',   onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup',   onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [applyRotation, runInertia]);

  // ── Flip handler ─────────────────────────────────────────────────────────
  const handleFlip = () => {
    setAutoSpin(false);
    const next = !flipped;
    setFlipped(next);
    if (deviceRef.current) {
      deviceRef.current.style.transition = 'transform 0.85s cubic-bezier(0.68,-0.55,0.27,1.55)';
      rotY.current = next ? 180 : 0;
      rotX.current = -8;
      applyRotation();
      setTimeout(() => {
        if (deviceRef.current) deviceRef.current.style.transition = 'none';
      }, 900);
    }
  };

  // ── Auto-spin: use CSS animation class, not JS loop ──────────────────────
  const autoSpinStyle = autoSpin
    ? { animation: 'holo-spin 9s ease-in-out infinite' }
    : {};

  // ── Nav items derived from schema ─────────────────────────────────────────
  const navItems = schema?.appConfig?.navItems || [];
  const themeColor = schema?.theme?.primary || '#6366f1';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(4,4,12,0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 0 32px',
        userSelect: 'none',
      }}
    >
      {/* Keyframes injected once */}
      <style>{`
        @keyframes holo-spin {
          0%   { transform: rotateY(0deg)   rotateX(-8deg); }
          25%  { transform: rotateY(22deg)  rotateX(-8deg); }
          50%  { transform: rotateY(0deg)   rotateX(-8deg); }
          75%  { transform: rotateY(-22deg) rotateX(-8deg); }
          100% { transform: rotateY(0deg)   rotateX(-8deg); }
        }
        @keyframes holo-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.55; transform:scale(.82); }
        }
        @keyframes holo-float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-6px); }
        }
        @keyframes holo-grid-scroll {
          from { transform: perspective(400px) rotateX(60deg) translateY(0); }
          to   { transform: perspective(400px) rotateX(60deg) translateY(40px); }
        }
        @keyframes holo-particle {
          0%   { transform:translateY(0)    scale(1);   opacity:.7; }
          100% { transform:translateY(-200px) scale(.2); opacity:0; }
        }
        @keyframes holo-scan {
          0%   { top: 20px;  opacity:.7; }
          100% { top: 100%;  opacity:0; }
        }
        .holo-device-wrap { cursor: grab; }
        .holo-device-wrap:active { cursor: grabbing; }
        .holo-ctrl-btn {
          padding: 5px 16px;
          border-radius: 20px;
          border: 0.5px solid rgba(139,92,246,0.4);
          background: rgba(99,102,241,0.1);
          color: rgba(200,200,255,0.85);
          font-size: 11px;
          cursor: pointer;
          transition: all .15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .holo-ctrl-btn:hover {
          background: rgba(99,102,241,0.25);
          border-color: rgba(139,92,246,0.7);
          color: #e0d9ff;
        }
        .holo-ctrl-btn.active {
          background: rgba(99,102,241,0.32);
          border-color: #8b5cf6;
          color: #ede9fe;
        }
        .holo-nav-icon {
          display:flex; flex-direction:column; align-items:center;
          gap:2px; cursor:pointer; opacity:.35; transition:opacity .2s;
        }
        .holo-nav-icon.active { opacity:1; }
      `}</style>

      {/* ── Close button ── */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 16, right: 20, zIndex: 10,
          background: 'rgba(99,102,241,0.12)',
          border: '0.5px solid rgba(139,92,246,0.3)',
          color: 'rgba(200,200,255,0.8)',
          borderRadius: '50%', width: 32, height: 32,
          cursor: 'pointer', fontSize: 14, lineHeight: '32px', textAlign: 'center',
        }}
      >✕</button>

      {/* ── Axis readouts ── */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 12, zIndex: 10,
      }}>
        {[['X', displayRot.x], ['Y', displayRot.y]].map(([axis, val]) => (
          <div key={axis} style={{
            background: 'rgba(8,8,20,0.85)',
            border: '0.5px solid rgba(139,92,246,0.3)',
            borderRadius: 6, padding: '2px 10px',
            fontSize: 9, color: 'rgba(160,140,230,0.8)',
            fontFamily: 'monospace', letterSpacing: '.5px',
          }}>{axis}: {val}°</div>
        ))}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(220,38,38,0.12)',
          border: '0.5px solid rgba(220,38,38,0.35)',
          borderRadius: 20, padding: '2px 9px',
          fontSize: 8, color: '#fca5a5', fontFamily: 'monospace',
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%', background: '#ef4444',
            animation: 'holo-pulse 1.2s ease-in-out infinite',
          }}/>
          LIVE PREVIEW
        </div>
      </div>

      {/* ── Ambient glow rings ── */}
      <div style={{
        position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)',
        width: 360, height: 130, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${themeColor}22 0%, transparent 70%)`,
        filter: 'blur(22px)', pointerEvents: 'none',
      }}/>

      {/* ── Perspective grid floor ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
        overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        <svg width="100%" height="200" viewBox="0 0 680 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={themeColor} stopOpacity=".3"/>
              <stop offset="100%" stopColor={themeColor} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <g stroke="url(#gf)" strokeWidth="0.5">
            {[200,148,106,72,44,22].map((y,i) => (
              <line key={i} x1={i*50} y1="200" x2={680-i*50} y2={y}/>
            ))}
            {[0,68,136,204,272,340,408,476,544,612,680].map((x,i) => (
              <line key={i} x1={340} y1={0} x2={x} y2={200}/>
            ))}
          </g>
        </svg>
      </div>

      {/* ── Floating particles ── */}
      {[...Array(14)].map((_,i) => (
        <div key={i} style={{
          position: 'absolute',
          width:  2 + (i % 3),
          height: 2 + (i % 3),
          borderRadius: '50%',
          background: `${themeColor}99`,
          left:   `${10 + (i * 6.5) % 80}%`,
          bottom: `${5  + (i * 7.3) % 25}%`,
          animation: `holo-particle ${3 + (i % 5)}s linear ${(i % 4) * 0.7}s infinite`,
          pointerEvents: 'none', zIndex: 0,
        }}/>
      ))}

      {/* ── 3D Scene ── */}
      <div
        ref={wrapRef}
        className="holo-device-wrap"
        style={{
          position: 'relative', zIndex: 2,
          perspective: '900px',
          width: 260, height: 426,
          margin: '0 auto',
          animation: 'holo-float 6s ease-in-out infinite',
        }}
      >
        {/* Reflection shadow */}
        <div style={{
          position: 'absolute', bottom: -28, left: '50%',
          transform: 'translateX(-50%)',
          width: 180, height: 40,
          background: `radial-gradient(ellipse, ${themeColor}30 0%, transparent 70%)`,
          filter: 'blur(8px)', pointerEvents: 'none',
        }}/>

        <div
          ref={deviceRef}
          style={{
            width: '100%', height: '100%',
            transformStyle: 'preserve-3d',
            ...autoSpinStyle,
          }}
        >
          {/* ────────── FRONT FACE ────────── */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: 36,
            background: 'linear-gradient(145deg,#181830 0%,#0e0e1c 100%)',
            border: `1.5px solid ${themeColor}55`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.055), 0 0 48px ${themeColor}30, inset 0 1px 0 rgba(255,255,255,0.08)`,
            overflow: 'hidden',
          }}>
            {/* Side volume buttons */}
            {[{s:'80px',h:'26px'},{s:'114px',h:'42px'}].map((b,i) => (
              <div key={i} style={{
                position:'absolute', right:-3, top:b.s, width:3, height:b.h,
                borderRadius:2,
                background:`linear-gradient(180deg,${themeColor}88,${themeColor}22)`,
              }}/>
            ))}
            <div style={{
              position:'absolute', left:-3, top:'88px', width:3, height:34,
              borderRadius:2,
              background:`linear-gradient(180deg,${themeColor}66,${themeColor}11)`,
            }}/>

            {/* Notch */}
            <div style={{
              position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
              width:88, height:24,
              background:'#0e0e1c',
              borderRadius:'0 0 14px 14px',
              zIndex:10,
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#181830',border:`1px solid ${themeColor}44`}}/>
              <div style={{width:8,height:8,borderRadius:'50%',background:`${themeColor}55`,boxShadow:`0 0 6px ${themeColor}88`}}/>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#181830',border:`1px solid ${themeColor}44`}}/>
            </div>

            {/* Screen */}
            <div style={{
              position:'absolute', top:28, left:8, right:8, bottom:12,
              borderRadius:22, overflow:'hidden',
              background: schema?.theme?.background || '#08080f',
            }}>
              {/* Status bar */}
              <div style={{
                height:20, background:'rgba(0,0,0,0.5)',
                display:'flex', alignItems:'center',
                justifyContent:'space-between', padding:'0 12px',
                flexShrink:0,
              }}>
                <span style={{fontSize:8,color:'rgba(255,255,255,0.45)',fontFamily:'monospace'}}>9:41</span>
                <span style={{fontSize:8,color:'rgba(255,255,255,0.45)'}}>●●● ▲ ▓</span>
              </div>

              {/* Live content or scanner effect */}
              <div style={{flex:1, position:'relative', height:'calc(100% - 60px)', overflow:'hidden'}}>
                {iframeUrl ? (
                  <>
                    {!iframeReady && !iframeError && (
                      <div style={{
                        position:'absolute',inset:0,zIndex:5,
                        display:'flex',flexDirection:'column',
                        alignItems:'center',justifyContent:'center',gap:8,
                        background: schema?.theme?.background || '#08080f',
                      }}>
                        {/* Scanning animation while loading */}
                        <div style={{
                          position:'absolute', left:0, right:0, height:2,
                          background:`linear-gradient(90deg,transparent,${themeColor},transparent)`,
                          animation:'holo-scan 1.8s linear infinite',
                          opacity:.7,
                        }}/>
                        <div style={{
                          width:14,height:14,borderRadius:'50%',
                          border:`2px solid ${themeColor}33`,
                          borderTopColor:themeColor,
                          animation:'holo-spin .8s linear infinite',
                        }}/>
                        <span style={{fontSize:8,color:`${themeColor}88`,fontFamily:'monospace',letterSpacing:1}}>
                          LOADING ENGINE
                        </span>
                      </div>
                    )}
                    {iframeError && (
                      <div style={{
                        position:'absolute',inset:0,zIndex:5,
                        display:'flex',flexDirection:'column',
                        alignItems:'center',justifyContent:'center',gap:6,
                        background:schema?.theme?.background||'#08080f',
                      }}>
                        <span style={{fontSize:16}}>⚠</span>
                        <span style={{fontSize:8,color:'rgba(255,100,100,0.7)',fontFamily:'monospace'}}>PREVIEW UNAVAILABLE</span>
                      </div>
                    )}
                    <iframe
                      src={iframeUrl}
                      title="Live preview"
                      sandbox="allow-scripts"
                      onLoad={() => setIframeReady(true)}
                      onError={() => setIframeError(true)}
                      style={{
                        width:'100%', height:'100%',
                        border:'none', background:'transparent',
                        opacity: iframeReady ? 1 : 0,
                        transition:'opacity .3s',
                      }}
                    />
                  </>
                ) : (
                  /* Fallback: render canvas nodes at micro scale */
                  <div style={{
                    width:'100%', height:'100%',
                    transform:'scale(0.42)', transformOrigin:'top left',
                    width:'238%', height:'238%',
                    pointerEvents:'none', overflow:'hidden',
                  }}>
                    <div style={{
                      padding:8,
                      color: schema?.theme?.primary || themeColor,
                      fontSize:10,
                      display:'flex',flexDirection:'column',gap:4,
                    }}>
                      {/* Mini node tree preview */}
                      {schema?.screens?.[0]?.rootNode?.children?.slice(0,6).map((node,i) => (
                        <div key={i} style={{
                          height:24,
                          borderRadius:4,
                          background:`${themeColor}15`,
                          border:`0.5px solid ${themeColor}30`,
                          display:'flex',alignItems:'center',
                          padding:'0 8px',
                          fontSize:7,
                          color:`${themeColor}cc`,
                          fontFamily:'monospace',
                        }}>{node.type} · {node.id?.slice(0,8)}</div>
                      ))}
                      {!schema?.screens && (
                        <div style={{
                          display:'flex',flexDirection:'column',
                          alignItems:'center',justifyContent:'center',
                          height:160,gap:8,
                          color:`${themeColor}66`,
                        }}>
                          <LucideIcons.Layers size={24} color={themeColor} opacity={.4}/>
                          <span style={{fontSize:8,fontFamily:'monospace',letterSpacing:1}}>
                            NO ASSET ID
                          </span>
                          <span style={{fontSize:7,opacity:.5}}>pass assetId prop to load</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom nav — mirrors schema.appConfig */}
              {navItems.length > 0 && (
                <div style={{
                  height:40,
                  background: schema?.appConfig?.navBackground
                    ? `${schema.appConfig.navBackground}dd`
                    : 'rgba(8,8,20,0.95)',
                  borderTop:`0.5px solid ${themeColor}22`,
                  display:'flex',alignItems:'center',
                  justifyContent:'space-around', padding:'0 8px',
                  backdropFilter:'blur(8px)',
                }}>
                  {navItems.map((item, idx) => {
                    const Icon = LucideIcons[item.icon] || LucideIcons.Circle;
                    const isActive = idx === activePage;
                    return (
                      <div
                        key={item.id || idx}
                        className={`holo-nav-icon${isActive?' active':''}`}
                        onClick={() => setActivePage(idx)}
                      >
                        <Icon
                          size={14}
                          color={isActive
                            ? schema?.appConfig?.navActiveColor || themeColor
                            : schema?.appConfig?.navIconColor || 'rgba(200,200,255,0.4)'}
                        />
                        {isActive && (
                          <div style={{
                            width:3,height:3,borderRadius:'50%',
                            background: schema?.appConfig?.navActiveColor || themeColor,
                          }}/>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Home indicator */}
              <div style={{
                height:16, background:'rgba(0,0,0,0.5)',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                <div style={{
                  width:40,height:3,borderRadius:2,
                  background:'rgba(255,255,255,0.18)',
                }}/>
              </div>
            </div>
          </div>

          {/* ────────── BACK FACE ────────── */}
          <div style={{
            position:'absolute', inset:0,
            backfaceVisibility:'hidden',
            transform:'rotateY(180deg)',
            borderRadius:36,
            background:'linear-gradient(145deg,#111124 0%,#0a0a14 100%)',
            border:`1.5px solid ${themeColor}33`,
            display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',gap:14,
          }}>
            {/* Camera array */}
            <div style={{display:'flex',gap:5}}>
              {[14,12,10].map((s,i) => (
                <div key={i} style={{
                  width:s,height:s,borderRadius:'50%',
                  background:'rgba(14,14,28,0.95)',
                  border:`1px solid ${themeColor}44`,
                  boxShadow:`0 0 8px ${themeColor}22`,
                }}/>
              ))}
            </div>
            {/* Logo badge */}
            <div style={{
              width:44,height:44,borderRadius:'50%',
              background:`linear-gradient(135deg,${themeColor}33,${themeColor}11)`,
              border:`0.5px solid ${themeColor}44`,
              display:'flex',alignItems:'center',justifyContent:'center',
            }}>
              <LucideIcons.Layers size={20} color={themeColor} opacity={.7}/>
            </div>
            <span style={{
              fontSize:9,color:`${themeColor}55`,
              fontFamily:'monospace',letterSpacing:'1.5px',
            }}>CANVAS ENGINE v2</span>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={{
        position:'relative',zIndex:10,
        display:'flex',gap:8,alignItems:'center',
        marginTop:20,flexWrap:'wrap',justifyContent:'center',
      }}>
        <button
          className={`holo-ctrl-btn${autoSpin?' active':''}`}
          onClick={() => setAutoSpin(s => !s)}
        >
          {autoSpin ? '⟳ Auto-spin ON' : '⟳ Manual'}
        </button>
        <button
          className="holo-ctrl-btn"
          onClick={handleFlip}
        >
          ↩ Flip
        </button>
        {navItems.length > 0 && (
          <button
            className="holo-ctrl-btn"
            onClick={() => setActivePage(p => (p + 1) % navItems.length)}
          >
            Next screen →
          </button>
        )}
      </div>

      {/* ── Page dots ── */}
      {navItems.length > 0 && (
        <div style={{
          display:'flex',gap:6,marginTop:10,
          position:'relative',zIndex:10,
        }}>
          {navItems.map((_,i) => (
            <div
              key={i}
              onClick={() => setActivePage(i)}
              style={{
                height:6, borderRadius:3,
                width: i === activePage ? 18 : 6,
                background: i === activePage ? themeColor : `${themeColor}33`,
                border:`0.5px solid ${themeColor}44`,
                cursor:'pointer',
                transition:'all .2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS  (original component — enhanced with holographic preview trigger)
// ─────────────────────────────────────────────────────────────────────────────

const Canvas = ({
  schema,
  rootNode,
  selectedId,
  onSelect,
  onDropToNode,
  onResize,
  onDragNodeStart,
  previewMode    = 'iphone',
  showGrid       = false,
  isLivePreview  = false,
  onNavigate,
  // NEW: pass assetId to enable the 3D holographic preview portal
  assetId,
}) => {

  // ── Holographic preview visibility ──────────────────────────────────────
  const [showHolographic, setShowHolographic] = useState(false);

  // ── Figma Smart Guides state ─────────────────────────────────────────────
  const [snapGuides, setSnapGuides] = useState({ x: null, y: null });

  // ── Premium 60 FPS resize engine ─────────────────────────────────────────
  const [resizeState, setResizeState] = useState(null);

  useEffect(() => {
    // Pointer Events (not Mouse Events) so resize works on touch/stylus too.
    const handlePointerMove = (e) => {
      if (!resizeState) return;

      let newWidth  = resizeState.startWidth;
      let newHeight = resizeState.startHeight;

      if (resizeState.direction.includes('right')) {
        newWidth = Math.max(20, resizeState.startWidth + (e.clientX - resizeState.startX));
      }
      if (resizeState.direction.includes('bottom')) {
        newHeight = Math.max(20, resizeState.startHeight + (e.clientY - resizeState.startY));
      }

      // 60 FPS native DOM bypass — mutate directly, commit on release.
      const element = document.getElementById(`node-${resizeState.id}`);
      if (element) {
        if (resizeState.direction.includes('right'))  element.style.width  = `${Math.round(newWidth)}px`;
        if (resizeState.direction.includes('bottom')) element.style.height = `${Math.round(newHeight)}px`;
      }
    };

    const handlePointerUp = (e) => {
      if (!resizeState) return;

      let newWidth  = resizeState.startWidth;
      let newHeight = resizeState.startHeight;

      if (resizeState.direction.includes('right'))  newWidth  = Math.max(20, resizeState.startWidth  + (e.clientX - resizeState.startX));
      if (resizeState.direction.includes('bottom')) newHeight = Math.max(20, resizeState.startHeight + (e.clientY - resizeState.startY));

      onResize(resizeState.id, `${Math.round(newWidth)}px`, `${Math.round(newHeight)}px`);
      setResizeState(null);
    };

    if (resizeState) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup',   handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup',   handlePointerUp);
    };
  }, [resizeState, onResize]);

  const startResize = (e, direction, id) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    setResizeState({
      id, direction,
      startX: e.clientX, startY: e.clientY,
      startWidth: rect.width, startHeight: rect.height,
    });
  };

  // ── Resize handle dots ───────────────────────────────────────────────────
  const renderResizeHandles = (id) => (
    <>
      <div
        onPointerDown={(e) => startResize(e, 'right', id)}
        className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-e-resize z-[100] shadow-sm hover:scale-150 transition-transform"
      />
      <div
        onPointerDown={(e) => startResize(e, 'bottom', id)}
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-s-resize z-[100] shadow-sm hover:scale-150 transition-transform"
      />
      <div
        onPointerDown={(e) => startResize(e, 'bottom-right', id)}
        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-se-resize z-[100] shadow-sm hover:scale-150 transition-transform"
      />
    </>
  );

  // ── Icon renderer ─────────────────────────────────────────────────────────
  const renderIcon = (iconName, color, size) => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.HelpCircle;
    return <IconComponent color={color} size={size} />;
  };

  // ── Pro styles builder ────────────────────────────────────────────────────
  const getProStyles = (props, isSelected) => {
    const {
      width, height, margin, padding,
      backgroundType, backgroundColor, gradientStart, gradientEnd,
      radiusTopLeft, radiusTopRight, radiusBottomLeft, radiusBottomRight,
      shadowColor, shadowOffsetX, shadowOffsetY, shadowBlur, shadowSpread,
      color, fontSize, textAlign, fontFamily, selfAlign,
      position, top, bottom, left, right,
    } = props;

    const boxShadow = shadowColor && shadowColor !== 'transparent'
      ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`
      : 'none';

    const resolveColor = (colorVal) => {
      if (colorVal === 'theme.primary')    return schema.theme.primary;
      if (colorVal === 'theme.secondary')  return schema.theme.secondary || '#EC4899';
      if (colorVal === 'theme.background') return schema.theme.background;
      return colorVal;
    };

    const background = backgroundType === 'gradient'
      ? `linear-gradient(135deg, ${resolveColor(gradientStart)}, ${resolveColor(gradientEnd)})`
      : resolveColor(backgroundColor);

    return {
      width:        width   || 'auto',
      height:       height  || 'auto',
      margin:       margin  || '0px',
      padding:      padding || '0px',
      background,
      borderRadius: `${radiusTopLeft||0} ${radiusTopRight||0} ${radiusBottomRight||0} ${radiusBottomLeft||0}`,
      boxShadow:    isSelected
        ? `inset 0 0 0 1px #3b82f6, 0 0 0 2px rgba(59,130,246,0.3), ${boxShadow}`
        : boxShadow,
      color:        resolveColor(color) || 'inherit',
      fontSize:     fontSize    || 'inherit',
      textAlign:    textAlign   || 'left',
      fontFamily:   fontFamily  || 'inherit',
      alignSelf:    selfAlign   || 'auto',
      display:      'flex',
      flexDirection:'column',
      transition:   'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      border:       isSelected ? '1px solid transparent' : '1px dashed transparent',
      boxSizing:    'border-box',
      position:     position || 'relative',
      top:          top    || undefined,
      bottom:       bottom || undefined,
      left:         left   || undefined,
      right:        right  || undefined,
      zIndex:       isSelected ? 50 : (position === 'absolute' ? 10 : 1),
    };
  };

  // ── Animation props builder ───────────────────────────────────────────────
  const getAnimationProps = (props) => {
    const { animationType, animationDuration, animationDelay } = props;
    if (!animationType || animationType === 'none') return {};

    const duration = parseFloat(animationDuration || 0.5);
    const delay    = parseFloat(animationDelay    || 0);
    let initial = {}, animate = {};

    if (animationType === 'fade')    { initial = { opacity:0 };          animate = { opacity:1 }; }
    if (animationType === 'slideUp') { initial = { opacity:0, y:30 };    animate = { opacity:1, y:0 }; }
    if (animationType === 'scale')   { initial = { opacity:0, scale:.8 }; animate = { opacity:1, scale:1 }; }

    return { initial, animate, transition: { duration, delay, ease: 'easeOut' } };
  };

  // ── Dynamic data resolver ─────────────────────────────────────────────────
  const resolveDynamicContent = (props) => {
    if (props.isBound && props.boundVariable) {
      const variable = schema.appState?.find(v => v.key === props.boundVariable);
      return variable ? (
        <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-[4px] font-mono text-[0.9em] border border-blue-500/20 shadow-sm backdrop-blur-sm">
          [ {variable.key} ]
        </span>
      ) : (
        <span className="bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-[4px] font-mono text-[0.9em] border border-red-500/20 shadow-sm backdrop-blur-sm">
          [ Unbound ]
        </span>
      );
    }
    return props.content || props.label || props.placeholder;
  };

  // ── Drag & drop tactile events ────────────────────────────────────────────
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('ring-2', 'ring-blue-500', 'bg-blue-500/10');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-500/10');
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-500/10');

    const rect    = e.currentTarget.getBoundingClientRect();
    const offsetX = parseFloat(e.dataTransfer.getData('offsetX')) || 0;
    const offsetY = parseFloat(e.dataTransfer.getData('offsetY')) || 0;
    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top  - offsetY;
    if (x < 0) x = 0;
    if (y < 0) y = 0;

    if (showGrid) {
      x = Math.round(x / 16) * 16;
      y = Math.round(y / 16) * 16;
    } else {
      x = Math.round(x);
      y = Math.round(y);
    }
    onDropToNode(e, targetId, { left: `${x}px`, top: `${y}px` });
  };

  // ── Figma smart guides drag tracker ──────────────────────────────────────
  const handleDragOverCanvas = (e) => {
    e.preventDefault();
    if (showGrid) return;
    const rect   = e.currentTarget.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cX     = rect.width  / 2;
    const cY     = rect.height / 2;
    setSnapGuides({
      x: Math.abs(x - cX) < 10 ? cX : null,
      y: Math.abs(y - cY) < 10 ? cY : null,
    });
  };

  const handleDropCanvas = (e, id) => {
    setSnapGuides({ x: null, y: null });
    handleDrop(e, id);
  };

  // ── Node renderer ─────────────────────────────────────────────────────────
  const renderNode = (node) => {
    if (!node) return null;

    const isSelected = !isLivePreview && selectedId === node.id;
    const styles     = getProStyles(node.props, isSelected);
    const animProps  = getAnimationProps(node.props);

    const commonProps = {
      id:       `node-${node.id}`,
      ...animProps,
      onClick: (e) => {
        e.stopPropagation();
        if (isLivePreview) {
          if (node.props?.actionChain?.length > 0) {
            node.props.actionChain.forEach(action => {
              if (action.type === 'navigate' && action.target && onNavigate)
                onNavigate(action.target);
              if (action.type === 'toast') alert(action.message || 'Action Executed');
            });
          }
          return;
        }
        onSelect(node.id);
      },
      onDragStart: (e) => !isLivePreview && onDragNodeStart(e, node.id),
      draggable:   !isLivePreview && !resizeState,
      style:       styles,
      className:   `group relative ${isSelected ? 'ring-offset-1 ring-1 ring-blue-500/50' : ''} ${!isLivePreview ? 'hover:outline hover:outline-1 hover:outline-blue-400/50 cursor-pointer transition-outline duration-200' : ''}`,
    };

    switch (node.type) {
      case 'CustomCode':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, display:'flex', flexDirection:'column' }}>
            <div className="relative p-5 w-full h-full min-h-[100px] bg-[#121214] border border-orange-500/20 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center shadow-lg">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 to-amber-500"></div>
              <svg className="w-6 h-6 text-orange-400 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <div className="text-gray-200 text-xs font-semibold font-mono flex items-center gap-1 mb-0.5">
                <span className="text-orange-500">{'</>'}</span>
                {node.props?.widget_name || 'Custom Widget'}
              </div>
              <p className="text-gray-500 text-[10px] max-w-[240px] leading-normal">
                Fallback container active. Logic preserved securely.
              </p>
              <div className="absolute inset-0 bg-black/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center p-3 text-left">
                <span className="text-[9px] uppercase tracking-wider text-orange-500 font-bold mb-1 block font-mono">AST Data Payload</span>
                <p className="text-emerald-400 font-mono text-[9px] overflow-y-auto max-h-full hide-scrollbar break-all whitespace-pre-wrap">
                  {node.raw || '// No abstract source syntax recorded'}
                </p>
              </div>
            </div>
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Container':
      case 'Stack':
      case 'Card':
      case 'Padding':
      case 'Center':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              position:   styles.position === 'absolute' ? 'absolute' : 'relative',
              justifyContent: node.type === 'Center' ? 'center' : styles.justifyContent,
              alignItems:     node.type === 'Center' ? 'center' : styles.alignItems,
            }}
          >
            {node.children?.map(renderNode)}
            {node.children?.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center p-4 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-lg text-center pointer-events-none tracking-widest uppercase">
                Empty {node.type}
              </div>
            )}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'PageView':
      case 'Carousel': {
        const isVert       = node.props.scrollDirection === 'vertical';
        const isCarousel   = node.type === 'Carousel';
        const slideWidth   = isCarousel
          ? (node.props.viewportFraction ? `${parseFloat(node.props.viewportFraction) * 100}%` : '80%')
          : '100%';
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              display:         'flex',
              flexDirection:   isVert ? 'column' : 'row',
              overflowX:       isVert ? 'hidden' : 'auto',
              overflowY:       isVert ? 'auto'   : 'hidden',
              scrollSnapType:  isVert ? 'y mandatory' : 'x mandatory',
              gap:             isCarousel ? '12px' : '0px',
              padding:         isCarousel ? '0 10%' : '0px',
              alignItems:      'center',
            }}
            className={`${commonProps.className} hide-scrollbar`}
          >
            {node.children?.length === 0 && (
              <div className="m-auto p-6 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-xl text-center pointer-events-none tracking-widest uppercase">
                Empty {node.type}
              </div>
            )}
            {node.children?.map((child) => (
              <div
                key={`wrap-${child.id}`}
                style={{
                  scrollSnapAlign: 'center',
                  flexShrink: 0,
                  width:  slideWidth,
                  height: isCarousel ? '90%' : '100%',
                  display:'flex', justifyContent:'center',
                }}
              >
                {renderNode(child)}
              </div>
            ))}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );
      }

      case 'ProgressBar': {
        const progColor   = node.props.color === 'theme.primary' ? schema.theme.primary : (node.props.color || '#3b82f6');
        const bgColor     = node.props.backgroundColor || '#1A1B1E';
        const progPercent = Math.min(100, Math.max(0, parseFloat(node.props.progress || 0.5) * 100));
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, backgroundColor: bgColor, overflow:'hidden' }}>
            <div style={{ width:`${progPercent}%`, height:'100%', backgroundColor:progColor, transition:'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );
      }

      case 'Column':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              gap:            node.props.gap,
              justifyContent: node.props.mainAxisAlignment,
              alignItems:     node.props.crossAxisAlignment === 'stretch' ? 'stretch' : node.props.crossAxisAlignment,
            }}
          >
            {node.children?.map(renderNode)}
            {node.children?.length === 0 && (
              <div className="p-4 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-lg text-center pointer-events-none tracking-widest uppercase">
                Empty Column
              </div>
            )}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'VideoPlayer':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, backgroundColor:'#000', position:'relative', overflow:'hidden' }}>
            <video src={node.props.url} autoPlay={node.props.autoPlay} muted loop style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.6 }} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-lg">
              <LucideIcons.PlayCircle size={48} className="text-white/90" />
            </div>
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'MapView':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, backgroundColor:'#e5e7eb', backgroundImage:'url("https://www.transparenttextures.com/patterns/cartographer.png")', overflow:'hidden' }}>
            <div className="w-full h-full flex flex-col items-center justify-center text-blue-600/80 bg-blue-500/5 backdrop-blur-[1px]">
              <LucideIcons.MapPin size={32} className="drop-shadow-md" />
              <span className="text-[10px] font-bold mt-2 font-mono bg-white/80 px-2 py-1 rounded shadow-sm">
                {node.props.latitude}, {node.props.longitude}
              </span>
            </div>
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'WebView':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, backgroundColor:'#ffffff', overflow:'hidden' }}>
            <div className="w-full h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
              <LucideIcons.Globe size={14} className="text-gray-500" />
              <span className="text-[10px] text-gray-500 font-mono truncate">{node.props.url}</span>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
              <LucideIcons.Layout size={32} className="mb-2 opacity-50" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Web Frame</span>
            </div>
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Row':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              flexDirection:  'row',
              gap:            node.props.gap,
              justifyContent: node.props.mainAxisAlignment,
              alignItems:     node.props.crossAxisAlignment,
            }}
          >
            {node.children?.map(renderNode)}
            {node.children?.length === 0 && (
              <div className="p-4 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-lg text-center pointer-events-none tracking-widest uppercase">
                Empty Row
              </div>
            )}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'ListView': {
        const isHorizontal      = node.props.scrollDirection === 'horizontal';
        const hasApi            = !!node.props.apiEndpoint;
        const hasSupabaseBinding = !!node.props.supabaseTable;
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              overflowY:     isHorizontal ? 'hidden' : 'auto',
              overflowX:     isHorizontal ? 'auto'   : 'hidden',
              display:       'flex',
              flexDirection: isHorizontal ? 'row'    : 'column',
              gap:           node.props.gap     || '8px',
              padding:       node.props.padding || '0px',
            }}
            className={`${commonProps.className} ${isHorizontal ? 'hide-scrollbar' : 'custom-scrollbar'}`}
          >
            {hasApi && (
              <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm backdrop-blur-sm z-50 flex items-center gap-1">
                <LucideIcons.Database size={10} /> API BOUND
              </div>
            )}
            {hasSupabaseBinding && (
              <div className="absolute top-2 left-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm backdrop-blur-sm z-50 flex items-center gap-1">
                <LucideIcons.DatabaseZap size={10} /> {node.props.supabaseTable}
              </div>
            )}
            {node.children?.length === 0 && (
              <div className="m-auto p-6 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-xl text-center pointer-events-none tracking-widest uppercase">
                Drop Item Here
              </div>
            )}
            {node.children?.map(renderNode)}
            {node.children?.length > 0 && (
              <div className={`opacity-40 pointer-events-none filter grayscale saturate-50 blur-[0.5px] scale-[0.98] transition-all shrink-0 ${isHorizontal ? 'origin-left' : 'origin-top'}`}>
                {renderNode(node.children[0])}
              </div>
            )}
            {node.children?.length > 0 && (
              <div className={`opacity-20 pointer-events-none filter grayscale saturate-0 blur-[1px] scale-[0.96] transition-all shrink-0 ${isHorizontal ? 'origin-left' : 'origin-top'}`}>
                {renderNode(node.children[0])}
              </div>
            )}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );
      }

      case 'GridView':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              display:             'grid',
              gridTemplateColumns: `repeat(${node.props.crossAxisCount || 2}, 1fr)`,
              gap:                 `${node.props.mainAxisSpacing || '8px'} ${node.props.crossAxisSpacing || '8px'}`,
              padding:             node.props.padding || '0px',
            }}
          >
            {node.children?.length === 0 && (
              <div className="col-span-full m-auto p-6 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-xl text-center pointer-events-none tracking-widest uppercase">
                Empty Grid
              </div>
            )}
            {node.children?.map(renderNode)}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Wrap':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              display:        'flex',
              flexWrap:       'wrap',
              gap:            `${node.props.runSpacing || '8px'} ${node.props.spacing || '8px'}`,
              justifyContent: node.props.alignment === 'center'
                ? 'center'
                : node.props.alignment === 'end' ? 'flex-end' : 'flex-start',
            }}
          >
            {node.children?.length === 0 && (
              <div className="w-full m-auto p-6 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-xl text-center pointer-events-none tracking-widest uppercase">
                Empty Wrap
              </div>
            )}
            {node.children?.map(renderNode)}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Spacer':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            style={{
              ...styles,
              flexGrow: node.props.flex || 1,
              border: isSelected ? '1px solid #3b82f6' : '1px dashed rgba(255,255,255,0.1)',
            }}
          >
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'SizedBox':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            style={{
              ...styles,
              border: isSelected ? '1px solid #3b82f6' : '1px dashed rgba(255,255,255,0.1)',
            }}
          >
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Divider':
        return <motion.div key={node.id} {...commonProps} />;

      case 'Text':
        return <motion.div key={node.id} {...commonProps}>{resolveDynamicContent(node.props)}</motion.div>;

      case 'Icon':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, width:'fit-content', height:'fit-content' }}>
            {renderIcon(node.props.iconName, node.props.color, node.props.size)}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Button':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            className="flex items-center justify-center active:scale-95 transition-transform relative overflow-hidden"
          >
            {resolveDynamicContent(node.props)}
            {node.props.actionType && node.props.actionType !== 'none' && (
              <div
                className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                title="Logic Bound"
              />
            )}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'TextInput':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            className="bg-gray-50/50 border border-gray-200 px-4 flex items-center text-gray-400 text-sm shadow-inner transition-colors"
          >
            {resolveDynamicContent(node.props)}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Image':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, overflow:'hidden' }}>
            <img
              src={node.props.url}
              alt="asset"
              className="w-full h-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
            />
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Shape':
        return <motion.div key={node.id} {...commonProps} />;

      default:
        return null;
    }
  };

  // ── Device frame dimensions ───────────────────────────────────────────────
  const deviceStyles = {
    iphone: { width:'375px', height:'812px', borderRadius:'44px', border:'12px solid #0E0F11' },
    pixel:  { width:'412px', height:'915px', borderRadius:'24px', border:'10px solid #0E0F11' },
    tablet: { width:'768px', height:'1024px',borderRadius:'16px', border:'16px solid #0E0F11' },
  };
  const currentDevice = deviceStyles[previewMode] || deviceStyles.iphone;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Holographic preview overlay (AnimatePresence for smooth mount/unmount) ── */}
      <AnimatePresence>
        {showHolographic && (
          <motion.div
            key="holo-overlay"
            initial={{ opacity:0, scale:.96 }}
            animate={{ opacity:1, scale:1 }}
            exit={{ opacity:0, scale:.96 }}
            transition={{ duration:.25, ease:'easeOut' }}
            style={{ position:'fixed', inset:0, zIndex:9999 }}
          >
            <HolographicPreview
              schema={schema}
              assetId={assetId}
              onClose={() => setShowHolographic(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Canvas device frame ── */}
      <div
        className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300 ease-in-out shrink-0 ring-1 ring-white/10"
        style={{
          width:           currentDevice.width,
          height:          currentDevice.height,
          borderRadius:    currentDevice.borderRadius,
          border:          currentDevice.border,
          backgroundColor: schema.theme.background,
        }}
        onDragOver={isLivePreview ? undefined : handleDragOverCanvas}
        onDrop={isLivePreview ? undefined : (e) => handleDropCanvas(e, rootNode.id)}
        onDragLeave={isLivePreview ? undefined : () => setSnapGuides({ x:null, y:null })}
      >
        {/* Notch */}
        {previewMode === 'iphone' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#0E0F11] rounded-b-3xl z-50" />
        )}

        {/* Figma smart guides */}
        {snapGuides.x && (
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-[100] pointer-events-none"
            style={{ left: snapGuides.x }}
          />
        )}
        {snapGuides.y && (
          <div
            className="absolute left-0 right-0 h-[1px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-[100] pointer-events-none"
            style={{ top: snapGuides.y }}
          />
        )}

        {/* Grid overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-40 opacity-30 mix-blend-difference"
            style={{
              backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
              backgroundSize:  '16px 16px',
            }}
          />
        )}

        {/* Canvas elements area */}
        <div
          className="h-full w-full overflow-y-auto hide-scrollbar relative"
          style={{ paddingTop: previewMode === 'iphone' ? '32px' : '0px' }}
        >
          {rootNode.children?.map(renderNode)}
        </div>

        {/* ── NEW: Holographic Preview trigger button ── */}
        {!isLivePreview && (
          <button
            onClick={() => setShowHolographic(true)}
            title="Open 3D Holographic Preview"
            style={{
              position: 'absolute',
              bottom: schema?.appConfig?.enableBottomNav ? '76px' : '12px',
              right: '12px',
              zIndex: 60,
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
              border: '1px solid rgba(139,92,246,0.6)',
              boxShadow: '0 0 16px rgba(99,102,241,0.5), 0 2px 8px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform   = 'scale(1.12)';
              e.currentTarget.style.boxShadow   = '0 0 24px rgba(99,102,241,0.7), 0 2px 8px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform   = 'scale(1)';
              e.currentTarget.style.boxShadow   = '0 0 16px rgba(99,102,241,0.5), 0 2px 8px rgba(0,0,0,0.4)';
            }}
          >
            {/* Cube icon — no LucideIcons dep needed here */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </button>
        )}

        {/* Bottom nav */}
        {schema.appConfig?.enableBottomNav && (
          <div
            className={`absolute bottom-0 left-0 right-0 h-16 flex justify-around items-center z-50 transition-all duration-300
              ${schema.appConfig.navStyle === 'shadow' ? 'shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/5' : ''}
              ${schema.appConfig.navStyle === 'glass'  ? 'backdrop-blur-xl bg-opacity-80 border-t border-white/10' : ''}
              ${schema.appConfig.navStyle === 'flat'   ? 'border-t border-white/10' : ''}
            `}
            style={{
              backgroundColor: schema.appConfig.navStyle === 'glass'
                ? `${schema.appConfig.navBackground || '#0d1117'}CC`
                : (schema.appConfig.navBackground || '#0d1117'),
            }}
          >
            {(schema.appConfig.navItems || []).map((item, idx) => {
              const isActive   = idx === 0;
              const iconSize   = schema.appConfig.navIconSize || 22;
              let animClass    = '';
              if (schema.appConfig.navAnimation === 'scale')  animClass = 'hover:scale-110 active:scale-90';
              if (schema.appConfig.navAnimation === 'bounce') animClass = 'hover:-translate-y-1 active:translate-y-1';
              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 ${animClass} ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
                >
                  {renderIcon(
                    item.icon || 'HelpCircle',
                    isActive
                      ? (schema.appConfig.navActiveColor || '#3b82f6')
                      : (schema.appConfig.navIconColor   || '#4b5563'),
                    iconSize,
                  )}
                  {isActive && (
                    <div
                      className="w-1 h-1 rounded-full shadow-sm"
                      style={{ backgroundColor: schema.appConfig.navActiveColor || '#3b82f6' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Canvas;