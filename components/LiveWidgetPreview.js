"use client";
import React from 'react';

// The JSON to HTML engine (Kept for your backward compatibility)
const renderNode = (node) => {
  if (!node) return null;
  const { type, props = {}, styles = {}, children = [] } = node;

  switch (type) {
    case 'Container':
    case 'Column':
    case 'Row':
      return (
        <div style={styles} className={props.className}>
          {children.map((child, index) => <React.Fragment key={index}>{renderNode(child)}</React.Fragment>)}
        </div>
      );
    case 'Text':
      return <span style={styles} className={props.className}>{props.text || "Text"}</span>;
    case 'Button':
    case 'IconBtn':
      return <button style={styles} className={`px-4 py-2 rounded ${props.className || 'bg-blue-600 text-white'}`}>{props.text || "Button"}</button>;
    case 'Image':
    case 'CircleImg':
      return <img src={props.src || "https://via.placeholder.com/150"} alt="Preview" style={styles} className={type === 'CircleImg' ? 'rounded-full object-cover' : 'object-cover'} />;
    case 'Input':
    case 'TextField':
    case 'SearchBar':
      return <input type="text" placeholder={props.placeholder || "Search..."} style={styles} className={`w-full px-3 py-2 bg-[#0e1117] border border-white/10 rounded-md text-sm text-white outline-none ${props.className || ''}`} readOnly />;
    case 'CustomCode':
      return (
        <div style={styles} className={`w-[80%] flex items-center gap-2 px-3 py-2 bg-[#161b22] border border-white/10 rounded-full shadow-inner ${props.className || ''}`}>
           <span className="text-gray-500 text-xs">⌕</span>
           <span className="text-xs text-gray-500 tracking-wide">{props.code ? "Custom search..." : "Search..."}</span>
        </div>
      );
    case 'Icon':
      return <span style={styles} className={props.className}>{props.icon || "✦"}</span>;
    default:
      return <div className="p-2 border border-dashed border-red-500/50 text-red-500 text-[10px] bg-red-500/10 rounded">Unknown: {type}</div>;
  }
};

export default function LiveWidgetPreview({ schema, dartCode, colors }) {
  
  // ─── NEW: IF IT IS PURE DART CODE, SHOW A BEAUTIFUL IDE WINDOW ───
  if (dartCode) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center relative overflow-hidden bg-[#050505]">
        {/* Subtle background glow based on the theme colors */}
        <div 
          className="absolute inset-0 opacity-20 blur-2xl" 
          style={{ background: `linear-gradient(135deg, ${colors?.[0] || '#3b82f6'}, ${colors?.[1] || '#8b5cf6'})` }} 
        />
        
        {/* The Mac-style IDE Window */}
        <div className="w-[90%] h-[95%] bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative z-10">
          
          {/* Mac window header */}
          <div className="h-7 bg-[#2d2d2d] flex items-center px-3 gap-1.5 border-b border-black/50 shrink-0 shadow-sm">
             <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
             <span className="ml-3 text-[10px] text-gray-400 font-mono font-medium tracking-wider">widget.dart</span>
          </div>
          
          {/* Scrolling Code Body */}
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1 text-left">
             <pre className="font-mono text-[8.5px] leading-[1.6] text-[#d4d4d4] whitespace-pre-wrap">
               {/* Extremely simple syntax highlighting simulation */}
               {dartCode.split('\n').map((line, i) => {
                 let coloredLine = line
                  .replace(/(class|extends|return|const|final|final|if|else|Widget|String|int|double|bool|void)/g, '<span style="color: #569cd6">$1</span>') // Keywords
                  .replace(/(@override)/g, '<span style="color: #c586c0">$1</span>') // Decorators
                  .replace(/('[^']*')/g, '<span style="color: #ce9178">$1</span>') // Strings
                  .replace(/(Scaffold|Container|Text|Column|Row|SizedBox|Padding|Icon|ElevatedButton|Colors)/g, '<span style="color: #4ec9b0">$1</span>'); // Classes
                 
                 return <div key={i} dangerouslySetInnerHTML={{ __html: coloredLine }} />;
               })}
             </pre>
          </div>

          {/* Fade out effect at the bottom so it looks clean */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  // ─── EXISTING LOGIC: IF NO DART CODE, USE JSON SCHEMA TO RENDER VISUALS ───
  if (!schema) {
    return <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-mono bg-white/5 rounded-t-xl">No preview data</div>;
  }

  let parsedSchema = schema;
  try {
    if (typeof schema === 'string') parsedSchema = JSON.parse(schema);
  } catch (e) {
    return <div className="text-red-500 text-xs flex items-center justify-center h-full">Invalid Schema</div>;
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