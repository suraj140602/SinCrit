"use client";
import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

const Canvas = ({ schema, rootNode, selectedId, onSelect, onDropToNode, onResize, onDragNodeStart, previewMode = 'iphone', showGrid = false, isLivePreview = false, onNavigate }) => {
  // --- FIGMA SMART GUIDES STATE ---
  const [snapGuides, setSnapGuides] = useState({ x: null, y: null });

  // --- PREMIUM 60FPS RESIZE ENGINE ---
  const [resizeState, setResizeState] = useState(null);

  useEffect(() => {
    // Using Pointer Events (not Mouse Events) so resize works on touch screens
    // and stylus input (tablets) in addition to desktop mouse.
    const handlePointerMove = (e) => {
      if (!resizeState) return; // guard — not isDragging, resizeState is the source of truth

      let newWidth = resizeState.startWidth;
      let newHeight = resizeState.startHeight;

      if (resizeState.direction.includes('right')) {
        newWidth = Math.max(20, resizeState.startWidth + (e.clientX - resizeState.startX));
      }
      if (resizeState.direction.includes('bottom')) {
        newHeight = Math.max(20, resizeState.startHeight + (e.clientY - resizeState.startY));
      }

      // 60FPS Native DOM bypass — mutate the DOM directly during drag,
      // commit to React state only on release so we never block the main thread.
      const element = document.getElementById(`node-${resizeState.id}`);
      if (element) {
        if (resizeState.direction.includes('right')) element.style.width = `${Math.round(newWidth)}px`;
        if (resizeState.direction.includes('bottom')) element.style.height = `${Math.round(newHeight)}px`;
      }
    };

    const handlePointerUp = (e) => {
      if (!resizeState) return;

      let newWidth = resizeState.startWidth;
      let newHeight = resizeState.startHeight;

      if (resizeState.direction.includes('right')) newWidth = Math.max(20, resizeState.startWidth + (e.clientX - resizeState.startX));
      if (resizeState.direction.includes('bottom')) newHeight = Math.max(20, resizeState.startHeight + (e.clientY - resizeState.startY));

      // Final commit to global state only on pointer release
      onResize(resizeState.id, `${Math.round(newWidth)}px`, `${Math.round(newHeight)}px`);
      setResizeState(null);
    };

    if (resizeState) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [resizeState, onResize]);

  const startResize = (e, direction, id) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    setResizeState({
      id,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height
    });
  };

  const renderResizeHandles = (id) => (
    <>
      <div onPointerDown={(e) => startResize(e, 'right', id)} className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-e-resize z-[100] shadow-sm hover:scale-150 transition-transform" />
      <div onPointerDown={(e) => startResize(e, 'bottom', id)} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-s-resize z-[100] shadow-sm hover:scale-150 transition-transform" />
      <div onPointerDown={(e) => startResize(e, 'bottom-right', id)} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-se-resize z-[100] shadow-sm hover:scale-150 transition-transform" />
    </>
  );

  const renderIcon = (iconName, color, size) => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.HelpCircle;
    return <IconComponent color={color} size={size} />;
  };

  const getProStyles = (props, isSelected) => {
    const {
      width, height, margin, padding,
      backgroundType, backgroundColor, gradientStart, gradientEnd,
      radiusTopLeft, radiusTopRight, radiusBottomLeft, radiusBottomRight,
      shadowColor, shadowOffsetX, shadowOffsetY, shadowBlur, shadowSpread,
      color, fontSize, textAlign, fontFamily, selfAlign,
      position, top, bottom, left, right
    } = props;

    const boxShadow = shadowColor && shadowColor !== 'transparent'
      ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`
      : 'none';

    const resolveColor = (colorVal) => {
      if (colorVal === 'theme.primary') return schema.theme.primary;
      if (colorVal === 'theme.secondary') return schema.theme.secondary || '#EC4899';
      if (colorVal === 'theme.background') return schema.theme.background;
      return colorVal;
    };

    const background = backgroundType === 'gradient'
      ? `linear-gradient(135deg, ${resolveColor(gradientStart)}, ${resolveColor(gradientEnd)})`
      : resolveColor(backgroundColor);

    return {
      width: width || 'auto',
      height: height || 'auto',
      margin: margin || '0px',
      padding: padding || '0px',
      background,
      borderRadius: `${radiusTopLeft || 0} ${radiusTopRight || 0} ${radiusBottomRight || 0} ${radiusBottomLeft || 0}`,
      // Premium Figma-style nested shadows for selection
      boxShadow: isSelected ? `inset 0 0 0 1px #3b82f6, 0 0 0 2px rgba(59,130,246,0.3), ${boxShadow}` : boxShadow,
      color: resolveColor(color) || 'inherit',
      fontSize: fontSize || 'inherit',
      textAlign: textAlign || 'left',
      fontFamily: fontFamily || 'inherit',
      alignSelf: selfAlign || 'auto',
      display: 'flex',
      flexDirection: 'column',
      // Buttery smooth cubic-bezier transitions for premium gliding feel
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      border: isSelected ? '1px solid transparent' : '1px dashed transparent',
      boxSizing: 'border-box',

      position: position || 'relative',
      top: top || undefined,
      bottom: bottom || undefined,
      left: left || undefined,
      right: right || undefined,
      zIndex: isSelected ? 50 : (position === 'absolute' ? 10 : 1)
    };
  };

  const getAnimationProps = (props) => {
    const { animationType, animationDuration, animationDelay } = props;
    if (!animationType || animationType === 'none') return {};

    const duration = parseFloat(animationDuration || 0.5);
    const delay = parseFloat(animationDelay || 0);

    let initial = {};
    let animate = {};

    if (animationType === 'fade') {
      initial = { opacity: 0 }; animate = { opacity: 1 };
    } else if (animationType === 'slideUp') {
      initial = { opacity: 0, y: 30 }; animate = { opacity: 1, y: 0 };
    } else if (animationType === 'scale') {
      initial = { opacity: 0, scale: 0.8 }; animate = { opacity: 1, scale: 1 };
    }

    return {
      initial,
      animate,
      transition: { duration, delay, ease: "easeOut" }
    };
  };

  // --- DYNAMIC DATA RESOLVER (Linear Aesthetic) ---
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

  // --- PREMIUM DRAG & DROP UX TACTILE EVENTS ---
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

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = parseFloat(e.dataTransfer.getData("offsetX")) || 0;
    const offsetY = parseFloat(e.dataTransfer.getData("offsetY")) || 0;

    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top - offsetY;

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    if (showGrid) {
      x = Math.round(x / 16) * 16;
      y = Math.round(y / 16) * 16;
    } else {
      // Force clean integer pixels for Figma-style precision
      x = Math.round(x);
      y = Math.round(y);
    }

    onDropToNode(e, targetId, { left: `${x}px`, top: `${y}px` });
  };

  // --- FIGMA SMART GUIDES DRAG TRACKER ---
  const handleDragOverCanvas = (e) => {
    e.preventDefault();
    if (showGrid) return; // Grid handles its own snapping

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Show center alignment guides if within 10px of the center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setSnapGuides({
      x: Math.abs(x - centerX) < 10 ? centerX : null,
      y: Math.abs(y - centerY) < 10 ? centerY : null
    });
  };

  const handleDropCanvas = (e, id) => {
    setSnapGuides({ x: null, y: null }); // Clear guides
    handleDrop(e, id);
  };

  const renderNode = (node) => {
    if (!node) return null;

    // Hide blue selection outlines if we are in Live Preview
    const isSelected = !isLivePreview && selectedId === node.id;
    const styles = getProStyles(node.props, isSelected);
    const animProps = getAnimationProps(node.props);

    const commonProps = {
      id: `node-${node.id}`,
      ...animProps,
      onClick: (e) => {
        e.stopPropagation();

        // --- LIVE PREVIEW INTERACTION LOGIC ---
        if (isLivePreview) {
          if (node.props?.actionChain?.length > 0) {
            node.props.actionChain.forEach(action => {
              if (action.type === 'navigate' && action.target && onNavigate) onNavigate(action.target);
              if (action.type === 'toast') alert(action.message || "Action Executed");
            });
          }
          return;
        }

        onSelect(node.id);
      },
      onDragStart: (e) => !isLivePreview && onDragNodeStart(e, node.id),
      draggable: !isLivePreview && !resizeState, // Disable dragging in preview
      style: styles,
      className: `group relative ${isSelected ? 'ring-offset-1 ring-1 ring-blue-500/50' : ''} ${!isLivePreview ? 'hover:outline hover:outline-1 hover:outline-blue-400/50 cursor-pointer transition-outline duration-200' : ''}`
    };

    switch (node.type) {
      case 'CustomCode':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            style={{
              ...styles,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="relative p-5 w-full h-full min-h-[100px] bg-[#121214] border border-orange-500/20 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center shadow-lg">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 to-amber-500"></div>

              <svg className="w-6 h-6 text-orange-400 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>

              <div className="text-gray-200 text-xs font-semibold font-mono flex items-center gap-1 mb-0.5">
                <span className="text-orange-500">{"</>"}</span>
                {node.props?.widget_name || 'Custom Widget'}
              </div>
              <p className="text-gray-500 text-[10px] max-w-[240px] leading-normal">
                Fallback container active. Logic preserved securely.
              </p>

              {/* Ultra-premium smooth hover code string inspection module */}
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
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} // Tactile Hover
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              position: styles.position === 'absolute' ? 'absolute' : 'relative',
              justifyContent: node.type === 'Center' ? 'center' : styles.justifyContent,
              alignItems: node.type === 'Center' ? 'center' : styles.alignItems,
            }}
          >
            {node.children?.map(renderNode)}
            {node.children?.length === 0 && <div className="absolute inset-0 flex items-center justify-center p-4 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-lg text-center pointer-events-none tracking-widest uppercase">Empty {node.type}</div>}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'PageView':
      case 'Carousel':
        const isVert = node.props.scrollDirection === 'vertical';
        const isCarousel = node.type === 'Carousel';
        // Carousels usually show a bit of the next/prev cards
        const slideWidth = isCarousel ? (node.props.viewportFraction ? `${parseFloat(node.props.viewportFraction) * 100}%` : '80%') : '100%';

        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              display: 'flex',
              flexDirection: isVert ? 'column' : 'row',
              overflowX: isVert ? 'hidden' : 'auto',
              overflowY: isVert ? 'auto' : 'hidden',
              scrollSnapType: isVert ? 'y mandatory' : 'x mandatory',
              gap: isCarousel ? '12px' : '0px',
              padding: isCarousel ? '0 10%' : '0px',
              alignItems: 'center'
            }}
            className={`${commonProps.className} hide-scrollbar`}
          >
            {node.children?.length === 0 && <div className="m-auto p-6 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-xl text-center pointer-events-none tracking-widest uppercase">Empty {node.type}</div>}

            {/* Wrap children to force them to act as individual snap pages */}
            {node.children?.map((child, idx) => (
              <div key={`wrap-${child.id}`} style={{ scrollSnapAlign: 'center', flexShrink: 0, width: slideWidth, height: isCarousel ? '90%' : '100%', display: 'flex', justifyContent: 'center' }}>
                {renderNode(child)}
              </div>
            ))}

            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'ProgressBar':
        const progColor = node.props.color === 'theme.primary' ? schema.theme.primary : (node.props.color || '#3b82f6');
        const bgColor = node.props.backgroundColor || '#1A1B1E';
        // Clamp progress between 0 and 100%
        const progPercent = Math.min(100, Math.max(0, parseFloat(node.props.progress || 0.5) * 100));

        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, backgroundColor: bgColor, overflow: 'hidden' }}>
            <div style={{ width: `${progPercent}%`, height: '100%', backgroundColor: progColor, transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Column':
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} // Tactile Hover
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              gap: node.props.gap,
              justifyContent: node.props.mainAxisAlignment,
              alignItems: node.props.crossAxisAlignment === 'stretch' ? 'stretch' : node.props.crossAxisAlignment
            }}
          >
            {node.children?.map(renderNode)}
            {node.children?.length === 0 && <div className="p-4 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-lg text-center pointer-events-none tracking-widest uppercase">Empty Column</div>}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'VideoPlayer':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
            {/* Actual HTML5 Video for Canvas Preview */}
            <video src={node.props.url} autoPlay={node.props.autoPlay} muted loop style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-lg">
              <LucideIcons.PlayCircle size={48} className="text-white/90" />
            </div>
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'MapView':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, backgroundColor: '#e5e7eb', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")', overflow: 'hidden' }}>
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
          <motion.div key={node.id} {...commonProps} style={{ ...styles, backgroundColor: '#ffffff', overflow: 'hidden' }}>
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
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} // Tactile Hover
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              flexDirection: 'row',
              gap: node.props.gap,
              justifyContent: node.props.mainAxisAlignment,
              alignItems: node.props.crossAxisAlignment
            }}
          >
            {node.children?.map(renderNode)}
            {node.children?.length === 0 && <div className="p-4 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-lg text-center pointer-events-none tracking-widest uppercase">Empty Row</div>}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'ListView':
        const isHorizontal = node.props.scrollDirection === 'horizontal';
        const hasApi = !!node.props.apiEndpoint;
        const hasSupabaseBinding = !!node.props.supabaseTable;
        return (
          <motion.div
            key={node.id}
            {...commonProps}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} // Tactile Hover
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => handleDrop(e, node.id)}
            style={{
              ...styles,
              overflowY: isHorizontal ? 'hidden' : 'auto',
              overflowX: isHorizontal ? 'auto' : 'hidden',
              display: 'flex',
              flexDirection: isHorizontal ? 'row' : 'column',
              gap: node.props.gap || '8px',
              padding: node.props.padding || '0px'
            }}
            className={`${commonProps.className} ${isHorizontal ? 'hide-scrollbar' : 'custom-scrollbar'}`}
          >
            {hasApi && <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm backdrop-blur-sm z-50 flex items-center gap-1"><LucideIcons.Database size={10} /> API BOUND</div>}
            {hasSupabaseBinding && <div className="absolute top-2 left-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm backdrop-blur-sm z-50 flex items-center gap-1"><LucideIcons.DatabaseZap size={10} /> {node.props.supabaseTable}</div>}
            {node.children?.length === 0 && <div className="m-auto p-6 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-xl text-center pointer-events-none tracking-widest uppercase">Drop Item Here</div>}
            {node.children?.map(renderNode)}

            {/* Visual X-Ray Ghosting for repeating elements (Adapts to direction!) */}
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
              display: 'grid',
              gridTemplateColumns: `repeat(${node.props.crossAxisCount || 2}, 1fr)`,
              gap: `${node.props.mainAxisSpacing || '8px'} ${node.props.crossAxisSpacing || '8px'}`,
              padding: node.props.padding || '0px'
            }}
          >
            {node.children?.length === 0 && <div className="col-span-full m-auto p-6 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-xl text-center pointer-events-none tracking-widest uppercase">Empty Grid</div>}
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
              display: 'flex',
              flexWrap: 'wrap',
              gap: `${node.props.runSpacing || '8px'} ${node.props.spacing || '8px'}`,
              justifyContent: node.props.alignment === 'center' ? 'center' : (node.props.alignment === 'end' ? 'flex-end' : 'flex-start')
            }}
          >
            {node.children?.length === 0 && <div className="w-full m-auto p-6 text-[10px] text-gray-400/50 border border-dashed border-gray-400/30 rounded-xl text-center pointer-events-none tracking-widest uppercase">Empty Wrap</div>}
            {node.children?.map(renderNode)}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Spacer':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, flexGrow: node.props.flex || 1, border: isSelected ? '1px solid #3b82f6' : '1px dashed rgba(255,255,255,0.1)' }}>
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'SizedBox':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, border: isSelected ? '1px solid #3b82f6' : '1px dashed rgba(255,255,255,0.1)' }}>
            {/* SizedBox is invisible unless selected, used strictly for spacing */}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Divider':
        return <motion.div key={node.id} {...commonProps} />;

      case 'Text':
        return <motion.div key={node.id} {...commonProps}>{resolveDynamicContent(node.props)}</motion.div>;

      case 'Icon':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, width: 'fit-content', height: 'fit-content' }}>
            {renderIcon(node.props.iconName, node.props.color, node.props.size)}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Button':
        return (
          <motion.div key={node.id} {...commonProps} className="flex items-center justify-center active:scale-95 transition-transform relative overflow-hidden">
            {resolveDynamicContent(node.props)}
            {/* Show an indicator if the button has advanced logic attached */}
            {node.props.actionType && node.props.actionType !== 'none' && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" title="Logic Bound"></div>
            )}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'TextInput':
        return (
          <motion.div key={node.id} {...commonProps} className="bg-gray-50/50 border border-gray-200 px-4 flex items-center text-gray-400 text-sm shadow-inner transition-colors">
            {resolveDynamicContent(node.props)}
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Image':
        return (
          <motion.div key={node.id} {...commonProps} style={{ ...styles, overflow: 'hidden' }}>
            <img src={node.props.url} alt="asset" className="w-full h-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105" />
            {isSelected && renderResizeHandles(node.id)}
          </motion.div>
        );

      case 'Shape':
        return <motion.div key={node.id} {...commonProps} />;

      default:
        return null;
    }
  };

  // Deep Premium Obsidian Device Frames
  const deviceStyles = {
    iphone: { width: '375px', height: '812px', borderRadius: '44px', border: '12px solid #0E0F11' },
    pixel: { width: '412px', height: '915px', borderRadius: '24px', border: '10px solid #0E0F11' },
    tablet: { width: '768px', height: '1024px', borderRadius: '16px', border: '16px solid #0E0F11' }
  };

  const currentDevice = deviceStyles[previewMode] || deviceStyles.iphone;

  return (
    <div
      className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300 ease-in-out shrink-0 ring-1 ring-white/10"
      style={{
        width: currentDevice.width,
        height: currentDevice.height,
        borderRadius: currentDevice.borderRadius,
        border: currentDevice.border,
        backgroundColor: schema.theme.background
      }}
      onDragOver={isLivePreview ? undefined : handleDragOverCanvas}
      onDrop={isLivePreview ? undefined : (e) => handleDropCanvas(e, rootNode.id)}
      onDragLeave={isLivePreview ? undefined : () => setSnapGuides({ x: null, y: null })}
    >
      {/* Notch */}
      {previewMode === 'iphone' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#0E0F11] rounded-b-3xl z-50"></div>
      )}

      {/* FIGMA SMART GUIDES */}
      {snapGuides.x && <div className="absolute top-0 bottom-0 w-[1px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-[100] pointer-events-none" style={{ left: snapGuides.x }}></div>}
      {snapGuides.y && <div className="absolute left-0 right-0 h-[1px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-[100] pointer-events-none" style={{ top: snapGuides.y }}></div>}

      {/* PREMIUM GRID OVERLAY */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none z-40 opacity-30 mix-blend-difference"
          style={{
            backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        ></div>
      )}

      {/* Canvas Elements Area */}
      <div className="h-full w-full overflow-y-auto hide-scrollbar relative" style={{ paddingTop: previewMode === 'iphone' ? '32px' : '0px' }}>
        {rootNode.children?.map(renderNode)}
      </div>

      {/* VISUAL BOTTOM NAV PREVIEW */}
      {schema.appConfig && schema.appConfig.enableBottomNav && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-16 flex justify-around items-center z-50 transition-all duration-300
              ${schema.appConfig.navStyle === 'shadow' ? 'shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/5' : ''}
              ${schema.appConfig.navStyle === 'glass' ? 'backdrop-blur-xl bg-opacity-80 border-t border-white/10' : ''}
              ${schema.appConfig.navStyle === 'flat' ? 'border-t border-white/10' : ''}
            `}
          style={{ backgroundColor: schema.appConfig.navStyle === 'glass' ? `${schema.appConfig.navBackground || '#0d1117'}CC` : (schema.appConfig.navBackground || '#0d1117') }}
        >
          {(schema.appConfig.navItems || []).map((item, idx) => {
            const isActive = idx === 0;
            const iconSize = schema.appConfig.navIconSize || 22;

            let animClass = "";
            if (schema.appConfig.navAnimation === 'scale') animClass = "hover:scale-110 active:scale-90";
            if (schema.appConfig.navAnimation === 'bounce') animClass = "hover:-translate-y-1 active:translate-y-1";

            return (
              <div key={item.id} className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 ${animClass} ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}>
                {renderIcon(item.icon || 'HelpCircle', isActive ? (schema.appConfig.navActiveColor || '#3b82f6') : (schema.appConfig.navIconColor || '#4b5563'), iconSize)}
                {isActive && <div className="w-1 h-1 rounded-full shadow-sm" style={{ backgroundColor: schema.appConfig.navActiveColor || '#3b82f6' }}></div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default Canvas;
