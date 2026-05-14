"use client";
import AppForgeDashboard from '../../components/AppForgeDashboard';
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Canvas from "../../components/Canvas";
import ErrorBoundary from "../../components/ErrorBoundary"; 
import { dummySchema } from "../../data/dummySchema";
import { generateFlutterCode } from "../../utils/flutterGenerator";
import { supabase } from "../../utils/supabase";
import { generateSupabaseSQL } from "../../utils/sqlGenerator"; // <--- ADD THIS HERE!
import * as LucideIcons from "lucide-react";
import { 
  Search, Plus, Grid, Save, Trash, Layers, Database, Zap, 
  Monitor, Smartphone, ChevronRight, PlusCircle, Play, 
  Box, X, LogOut, Layout, Type, Image as ImageIcon, BoxSelect
} from "lucide-react";
import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import "mobile-drag-drop/default.css"; // Gives visual feedback on mobile
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
export const dynamic = 'force-dynamic';
import { TEMPLATES } from "../../data/templates";

const WIDGET_CATEGORIES = [
  {
    name: "Layout Elements",
    items: [
      { type: 'Container', icon: 'Box' },
      { type: 'Row', icon: 'Columns' },
      { type: 'Column', icon: 'Rows' },
      { type: 'Stack', icon: 'Layers' },
      { type: 'ListView', icon: 'List' },
      { type: 'GridView', icon: 'Grid' },
      { type: 'Wrap', icon: 'WrapText' },
      { type: 'Spacer', icon: 'MoveHorizontal' },
      { type: 'SizedBox', icon: 'Maximize' },
      { type: 'Center', icon: 'AlignCenter' },
      { type: 'Padding', icon: 'Shrink' },
    ]
  },
  {
    name: "Basic Elements",
    items: [
      { type: 'Text', icon: 'Type' },
      { type: 'Button', icon: 'MousePointerClick' },
      { type: 'Icon', icon: 'Star' },
      { type: 'Card', icon: 'CreditCard' },
      { type: 'Divider', icon: 'Minus' },
      { type: 'CustomCode', icon: 'TerminalSquare' } // <--- ADD THIS
    ]
  },
  {
    name: "Interactive & Media",
    items: [
      { type: 'Image', icon: 'Image' },
      { type: 'TextInput', icon: 'TextCursorInput' },
      { type: 'ProgressBar', icon: 'SlidersHorizontal' },
      { type: 'PageView', icon: 'PanelLeft' },
      { type: 'Carousel', icon: 'GalleryHorizontal' },
      { type: 'VideoPlayer', icon: 'Video' },
      { type: 'MapView', icon: 'Map' },
      { type: 'WebView', icon: 'Globe' },
    ]
  }
];

const ClientDashboard = ({ schema }) => {
  // Manage the active page for the interactive preview
  const [activePageId, setActivePageId] = useState(schema.app?.initialPage || schema.pages[0]?.id);
  const activePage = schema.pages.find(p => p.id === activePageId) || schema.pages[0];

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto p-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ backgroundBlendMode: 'overlay' }}>
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Client Header */}
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{schema.app?.name || 'My App'} Management</h1>
            <p className="text-sm text-gray-500 mt-2">Welcome to your app dashboard. Review the interactive prototype and database architecture below.</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="flex h-3 w-3 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
             </span>
             <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Prototype Live</span>
          </div>
        </div>

        {/* Dynamic Project Stats (Reads from real schema) */}
        <div className="grid grid-cols-4 gap-6">
           <div className="bg-[#0E0F11] border border-white/5 p-6 rounded-3xl shadow-sm">
             <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Total Screens</div>
             <div className="text-4xl font-bold text-white">{schema.pages.length}</div>
           </div>
           <div className="bg-[#0E0F11] border border-white/5 p-6 rounded-3xl shadow-sm">
             <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Database Tables</div>
             <div className="text-4xl font-bold text-blue-400">{schema.appConfig?.dbTables?.length || 0}</div>
           </div>
           <div className="bg-[#0E0F11] border border-white/5 p-6 rounded-3xl shadow-sm">
             <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">API Connections</div>
             <div className="text-4xl font-bold text-purple-400">{schema.apiEndpoints?.length || 0}</div>
           </div>
           <div className="bg-[#0E0F11] border border-white/5 p-6 rounded-3xl shadow-sm">
             <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">App Version</div>
             <div className="text-4xl font-bold text-white">1.0.0-beta</div>
           </div>
        </div>

        {/* Main Layout: Preview on Left, Data on Right */}
        <div className="flex gap-8 pb-20">
           
           {/* INTERACTIVE APP PREVIEW */}
           <div className="bg-[#0E0F11] border border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col w-fit shrink-0">
              <div className="bg-[#161b22] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <LucideIcons.Smartphone size={16}/> Interactive Preview
                 </h3>
                 <select value={activePageId} onChange={(e) => setActivePageId(e.target.value)} className="bg-[#0a0a0a] border border-white/10 text-xs text-white p-1.5 rounded-lg outline-none cursor-pointer">
                    {schema.pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
              </div>
              <div className="p-8 flex justify-center bg-[#050505]">
                 <ErrorBoundary>
                   <Canvas 
                     schema={schema} 
                     rootNode={activePage?.root} 
                     selectedId={null} 
                     onSelect={() => {}} onDropToNode={() => {}} onResize={() => {}} onDragNodeStart={() => {}} 
                     previewMode="iphone" 
                     showGrid={false} 
                     isLivePreview={true}
                     onNavigate={(targetId) => setActivePageId(targetId)}
                   />
                 </ErrorBoundary>
              </div>
           </div>

           {/* DATABASE ARCHITECTURE VIEWER */}
           <div className="flex-1 flex flex-col gap-6">
             <div className="bg-[#0E0F11] border border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                <div className="bg-[#161b22] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <LucideIcons.Database size={16}/> Database Architecture
                   </h3>
                </div>
                <div className="p-6 space-y-4">
                   {(schema.appConfig?.dbTables || []).length === 0 ? (
                     <div className="text-gray-500 text-sm">No database tables configured for this app yet.</div>
                   ) : (
                     schema.appConfig.dbTables.map(table => (
                       <div key={table.id} className="bg-[#1A1B1E] p-4 rounded-xl border border-white/5">
                         <div className="flex items-center justify-between mb-3">
                           <div className="text-sm font-bold text-blue-400 font-mono">{table.name}</div>
                           <div className="text-[10px] text-gray-500 uppercase tracking-widest">{table.columns.length} columns</div>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           <span className="bg-[#0E0F11] px-2.5 py-1 rounded text-xs text-gray-400 font-mono border border-white/5">id <span className="text-gray-600">(uuid)</span></span>
                           <span className="bg-[#0E0F11] px-2.5 py-1 rounded text-xs text-gray-400 font-mono border border-white/5">created_at <span className="text-gray-600">(timestamp)</span></span>
                           {table.columns.map(col => (
                             <span key={col.id} className="bg-[#0E0F11] px-2.5 py-1 rounded text-xs text-gray-200 font-mono border border-white/5 border-l-blue-500/50 border-l-2">
                               {col.name} <span className="text-gray-600">({col.type})</span>
                             </span>
                           ))}
                         </div>
                       </div>
                     ))
                   )}
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Defined at module scope so React doesn't remount it on every Home render.
// Previously defined inside Home, which caused unnecessary unmount/remount cycles.
const SyntaxHighlightedCode = ({ codeStr, selectedType }) => {
  if (!selectedType) return <pre className="h-full text-[12px] font-mono text-gray-400 overflow-y-auto whitespace-pre-wrap hide-scrollbar p-4">{codeStr}</pre>;
  const flutterMap = { 'Container': 'Container(', 'Card': 'Card(', 'Padding': 'Padding(', 'Center': 'Center(', 'SizedBox': 'SizedBox(', 'Divider': 'Divider(', 'Text': 'Text(', 'Button': 'ElevatedButton(', 'TextInput': 'TextField(', 'Image': 'Image.network(', 'Icon': 'Icon(', 'Shape': 'Container(', 'Row': 'Row(', 'Column': 'Column(', 'Stack': 'Stack(', 'ListView': 'ListView.builder(' };
  const keyword = flutterMap[selectedType];
  if (!keyword) return <pre className="h-full text-[12px] font-mono text-gray-400 overflow-y-auto whitespace-pre-wrap hide-scrollbar p-4">{codeStr}</pre>;
  const parts = codeStr.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g'));
  return (
    <pre className="h-full text-[12px] font-mono text-gray-400 overflow-y-auto whitespace-pre-wrap hide-scrollbar p-4">
      {parts.map((part, i) => part === keyword ? <span key={i} className="bg-blue-500/20 text-blue-400 rounded px-1">{part}</span> : part )}
    </pre>
  );
};

// --- NEW: STABLE INPUT COMPONENT ---
const PropInput = ({ label, propKey, type = "text", options = [], placeholder = "", value, onChange }) => {
  const getValidHex = (colorString) => {
    return (colorString && colorString.startsWith('#') && colorString.length >= 7) ? colorString.substring(0,7) : '#ffffff';
  };

  return (
    <div className="flex flex-col mb-4 group">
      <label className="text-[9px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors">{label}</label>
      {type === "select" ? (
        <select value={value || ''} onChange={(e) => onChange(propKey, e.target.value)} className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#0E0F11] text-gray-200 outline-none focus:border-blue-500 transition-colors cursor-pointer">
          {options.map(opt => <option key={opt.value} value={opt.value} className="bg-[#1A1B1E] text-gray-200">{opt.label}</option>)}
        </select>
      ) : type === "color" ? (
        <div className="flex items-center gap-3 border border-white/10 rounded-lg p-2 bg-[#0E0F11] focus-within:border-blue-500 transition-colors">
           <input type="color" value={getValidHex(value)} onChange={(e) => onChange(propKey, e.target.value)} className="w-6 h-6 rounded border-0 p-0 shrink-0 bg-transparent cursor-pointer" />
           <input type="text" value={value || ''} onChange={(e) => onChange(propKey, e.target.value)} placeholder="e.g. #FFFFFF" className="flex-1 text-xs text-gray-200 outline-none bg-transparent uppercase font-mono" />
        </div>
      ) : (
        <input type={type} value={value || ''} onChange={(e) => onChange(propKey, e.target.value)} placeholder={placeholder} className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#0E0F11] text-gray-200 outline-none focus:border-blue-500 transition-colors shadow-inner" />
      )}
    </div>
  );
};

function Home() {
  const searchParams = useSearchParams();
const router = useRouter();
  // 1. STRICT INITIALIZATION: Force the root to be a Flexbox Column
  const initialPages = dummySchema?.pages?.length > 0 ? dummySchema.pages : [{
    id: 'home',
    name: 'Home',
    root: { 
      id: `root_column_${Date.now()}`, 
      type: 'Column', 
      props: { padding: '16px', gap: '16px', mainAxisAlignment: 'start', crossAxisAlignment: 'stretch' }, 
      children: [] // Strictly initialized array, never null
    }
    
  }];

  // --- TEMPLATE INJECTION STATE ---
  const [pendingInjection, setPendingInjection] = useState(null); // Holds the template ID
  const [injectionTarget, setInjectionTarget] = useState('current'); // 'current', 'new', or specific pageId
  const [injectionNewPageName, setInjectionNewPageName] = useState('');
 
  const [schema, setSchema] = useState({ 
    ...dummySchema, 
    pages: initialPages, // Overwrite with strict structure
    components: [], 
    appState: [],
    apiEndpoints: [],
    permissions: { internet: true, camera: false, location: false, microphone: false, notifications: false }, 
    backendProvider: 'supabase',
    supabaseConfig: { url: '', anonKey: '' },
    firebaseConfig: { apiKey: '', projectId: '', appId: '', messagingSenderId: '' }, // <-- ADD THIS
    appConfig: { 
      enableBottomNav: false,
      navBackground: '#0d1117',
      navIconColor: '#4b5563',
      navActiveColor: '#3b82f6',
      navStyle: 'glass',
      navIconSize: '22',
      navAnimation: 'scale',
      navItems: [
        { id: 'nav_1', icon: 'Home', targetPage: 'page_1' },
        { id: 'nav_2', icon: 'Search', targetPage: 'page_2' }
      ],
      dbTables: [
        { id: 'tbl_users', name: 'users', columns: [{ id: 'col_1', name: 'email', type: 'text' }, { id: 'col_2', name: 'created_at', type: 'timestamp' }] },
        { id: 'tbl_products', name: 'products', columns: [{ id: 'col_3', name: 'title', type: 'text' }, { id: 'col_4', name: 'price', type: 'numeric' }] }
      ]
    
    },
    theme: { ...dummySchema.theme, globalRadius: "12px", secondary: "#EC4899", background: "#0a0a0a", primary: "#3b82f6" } 
  });


  const [isPremium, setIsPremium] = useState(false); // <--- NEW STATE
  
  // --- AI CONFIGURATION STATE ---
  const [aiProvider, setAiProvider] = useState('gemini-default'); // 'gemini-default', 'claude-3-5', 'gpt-4o'
  const [customApiKey, setCustomApiKey] = useState('');
  const [isKeyInputOpen, setIsKeyInputOpen] = useState(true);
  
  // --- AI MAINTENANCE STATE ---
  const [dashboardTab, setDashboardTab] = useState('deployments'); // 'deployments' or 'maintenance'
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [isScanningHealth, setIsScanningHealth] = useState(false);

  // --- AGENCY WORKSPACE STATE ---
  const [workspaceRole, setWorkspaceRole] = useState('admin'); // 'admin' or 'client'
  
  // --- AI AUDITOR STATE ---
  const [showAiAuditor, setShowAiAuditor] = useState(false);
  const [aiAuditLogs, setAiAuditLogs] = useState([]);
  const [isAiAuditing, setIsAiAuditing] = useState(false);

  const [showSqlModal, setShowSqlModal] = useState(false);


  const [elementSearch, setElementSearch] = useState("");
  
  // --- AI CO-PILOT STATE ---
  const [themePrompt, setThemePrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);

  const [isGeneratingBackend, setIsGeneratingBackend] = useState(false);

  // NEW: Element Level AI
 // --- INTELLIGENT AI CHAT STATE ---
  const [aiChatHistory, setAiChatHistory] = useState([
    { role: 'ai', text: "Hi! I'm your AppForge AI Engineer. Select an element or tell me what you'd like to build!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isEditingElement, setIsEditingElement] = useState(false);
  const [elementPrompt, setElementPrompt] = useState(''); // FIX: was missing, caused ReferenceError in handleAiElementEdit

  const [currentPageId, setCurrentPageId] = useState(schema.app.initialPage || schema.pages[0].id);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('elements'); 
  const [inspectorTab, setInspectorTab] = useState('properties'); // 'properties', 'actions', 'backend', 'animations'

  // --- LIVE PREVIEW STATE ---
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewActivePageId, setPreviewActivePageId] = useState(null); 
  
  // COMMAND PALETTE & UI STATE
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");
  const [previewMode, setPreviewMode] = useState('iphone');
  const [showGrid, setShowGrid] = useState(false); 
  const [rightTab, setRightTab] = useState('inspector'); 
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const [viewMode, setViewMode] = useState('single'); 
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  const [showDashboard, setShowDashboard] = useState(false);
  const [buildLogs, setBuildLogs] = useState([]);

  const [isLogicModalOpen, setIsLogicModalOpen] = useState(false);
  const [editingLogicId, setEditingLogicId] = useState(null);

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);

  const [history, setHistory] = useState([schema]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const hasInjected = useRef(false);
  const hasLoadedDb = useRef(false);
  const [dbProjectId, setDbProjectId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [apkUrl, setApkUrl] = useState(null);


  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageTemplate, setNewPageTemplate] = useState("blank");

  // --- STORYBOARD ENGINE ---
  const handleWheel = (e) => {
    if (viewMode !== 'storyboard') return;
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(z => Math.min(Math.max(0.2, z - e.deltaY * 0.005), 3)); } 
    else { setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY })); }
  };
  const handleMouseDown = (e) => { if (viewMode === 'storyboard' && (e.button === 1 || e.button === 2 || e.altKey)) { e.preventDefault(); setIsPanning(true); } };
  const handleMouseMove = (e) => { if (isPanning) setPan(p => ({ x: p.x + e.movementX, y: p.y + e.movementY })); };
  const handleMouseUp = () => setIsPanning(false);

  const getConnections = () => {
    let connections = [];
    schema.pages.forEach((page, fromIndex) => {
      const findNav = (node) => {
        if (node.props?.actionChain) {
          node.props.actionChain.forEach(act => {
            if (act.type === 'navigate' && act.target) {
              const toIndex = schema.pages.findIndex(p => p.id === act.target);
              if (toIndex !== -1) connections.push({ fromIndex, toIndex });
            }
          });
        }
        if (node.children) node.children.forEach(findNav);
      };
      findNav(page.root);
    });
    return connections;
  };

  useEffect(() => {
    const injectKey = searchParams.get('inject');
    
    // If a template key exists in the URL, inject it!
    if (injectKey && TEMPLATES[injectKey]) {
      const sourceObj = TEMPLATES[injectKey];
      const clonedNode = regenerateIds(JSON.parse(JSON.stringify(sourceObj)));
      
      const newSchema = JSON.parse(JSON.stringify(schema));
      const pIndex = newSchema.pages.findIndex(p => p.id === currentPageId);
      

      if (pIndex !== -1) {
         if (!newSchema.pages[pIndex].root.children) newSchema.pages[pIndex].root.children = [];
         newSchema.pages[pIndex].root.children.push(clonedNode);
         
         // Save the update
         commitHistory(newSchema);
         setSelectedId(clonedNode.id);
         
         // Silently clean the URL so it doesn't duplicate if they refresh the page!
         router.replace('/builder', undefined, { shallow: true }); 
      }
    }
  }, [searchParams]);

  // --- MOBILE TOUCH DRAG & DROP ACTIVATION ---
  useEffect(() => {
    // 1. Activate the mobile touch polyfill
    polyfill({
      dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
      // Require a 250ms "hold" before dragging starts. 
      // This prevents the screen from dragging when the user is just trying to scroll the menu!
      holdToDrag: 250, 
    });

    // 2. Prevent the phone screen from scrolling while a drag is actively happening
    const preventScrollWhileDragging = (e) => {
      if (document.body.classList.contains('dnd-poly-active')) {
        e.preventDefault();
      }
    };
    
    // Use passive: false to allow e.preventDefault() to work
    window.addEventListener('touchmove', preventScrollWhileDragging, { passive: false });
    return () => window.removeEventListener('touchmove', preventScrollWhileDragging);
  }, []);

// --- THE DEPLOYMENT INTERCEPTOR ---
  useEffect(() => {
    if (isAuthLoading) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const injectKey = urlParams.get('inject');
    
    if (!injectKey) return;
    
    // Instantly wipe the URL so it doesn't trigger again on refresh
    window.history.replaceState(null, '', window.location.pathname);
    
    if (TEMPLATES[injectKey]) {
      setPendingInjection(injectKey); // Open the Deployment Modal!
      setInjectionTarget('current'); // Reset default choice
      setInjectionNewPageName('');
    }
  }, [isAuthLoading]); 

  // --- THE EXECUTION FUNCTION ---
  const handleExecuteInjection = () => {
    if (!pendingInjection) return;

    // --- NEW: STORE PAYWALL GATEKEEPER ---
    const freeTemplates = ['hero', 'login', 'productCard', 'storyList', 'sectionTitle'];
    if (!freeTemplates.includes(pendingInjection) && !isPremium) {
       alert("✨ This is a Premium Theme from the Store! Please upgrade your workspace to deploy it.");
       setPendingInjection(null); // Close the modal
       handleCheckout(); // Send them to Stripe!
       return;
    }
    // -------------------------------------

    let targetPageId = currentPageId;
    let newSchema = JSON.parse(JSON.stringify(schema));

    // Handle "New Page" creation on the fly
    if (injectionTarget === 'new') {
      if (!injectionNewPageName.trim()) return alert("Please enter a name for the new page.");
      targetPageId = `page_${Date.now()}`;
      newSchema.pages.push({
        id: targetPageId,
        name: injectionNewPageName,
        root: { id: `root_column_${Date.now()}`, type: "Column", props: { padding: "0px", margin: "0px", backgroundColor: "transparent", backgroundType: "solid", mainAxisAlignment: "start", crossAxisAlignment: "stretch" }, children: [] }
      });
    } else if (injectionTarget !== 'current') {
      targetPageId = injectionTarget; // They selected a specific existing page
    }

    // Apply defaults to prevent Canvas crashes
    const applyDefaults = (node) => {
      node.props = { ...getProDefaults(), ...node.props };
      if (['Container', 'Card', 'Padding', 'Center', 'Stack', 'Row', 'Column', 'ListView'].includes(node.type)) {
        if (!node.children) node.children = [];
      }
      if (node.children) node.children.forEach(applyDefaults);
      return node;
    };

    let clonedNode = regenerateIds(JSON.parse(JSON.stringify(TEMPLATES[pendingInjection])));
    clonedNode = applyDefaults(clonedNode); 

    const pIndex = newSchema.pages.findIndex(p => p.id === targetPageId);
    
    if (pIndex !== -1) {
      if (!newSchema.pages[pIndex].root.children) newSchema.pages[pIndex].root.children = [];
      newSchema.pages[pIndex].root.children.push(clonedNode);
      
      commitHistory(newSchema);
      setCurrentPageId(targetPageId); // Snap them to the target page!
      setTimeout(() => setSelectedId(clonedNode.id), 50); // Select the new item
    }

    // Close the modal
    setPendingInjection(null);
  };

  

  const commitHistory = (newSchema) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSchema)));
    if (newHistory.length > 50) newHistory.shift(); 
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSchema(newSchema);
  };

 useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user && !hasLoadedDb.current) {
        hasLoadedDb.current = true;
        loadUserProject(session.user.id);
      } else if (!session?.user) {
        setIsAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && !hasLoadedDb.current) {
        hasLoadedDb.current = true;
        loadUserProject(session.user.id);
      } else if (!session?.user) {
        setIsAuthLoading(false);
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      const pid = urlParams.get('projectId');
      window.history.replaceState(null, '', window.location.pathname);
      alert("Payment Successful! Starting your cloud build now...");
      startActualCloudBuild(pid); 
    }
    
    return () => subscription.unsubscribe();
  }, []);

  const loadUserProject = async (userId) => {
    try {
      // --- NEW: FETCH PREMIUM STATUS ---
      const { data: profileData } = await supabase.from('profiles').select('is_premium').eq('id', userId).single();
      setIsPremium(profileData?.is_premium || false);
      // ---------------------------------

      const { data } = await supabase.from('projects').select('*').eq('user_id', userId).limit(1).single();
      if (data) {
        const loadedSchema = { 

            ...data.schema, 
            components: data.schema.components || [], 
            appState: data.schema.appState || [],
            permissions: data.schema.permissions || { internet: true, camera: false, location: false, microphone: false, notifications: false },
            supabaseConfig: data.schema.supabaseConfig || { url: '', anonKey: '' }, 
            firebaseConfig: data.schema.firebaseConfig || { apiKey: '', projectId: '', appId: '', messagingSenderId: '' }, // <-- FIXED: Restores Firebase
            appConfig: data.schema.appConfig || { enableBottomNav: false }, 
            theme: { secondary: "#EC4899", ...data.schema.theme } 
        };
        setSchema(loadedSchema);
        setHistory([loadedSchema]); 
        setHistoryIndex(0);
        setDbProjectId(data.id);
        setCurrentPageId(loadedSchema.app?.initialPage || loadedSchema.pages[0].id);
      }
    } catch (err) { console.log("Starting fresh project."); } finally { setIsAuthLoading(false); }
  };

  const fetchAssets = async () => {
    if (!user) return;
    const { data, error } = await supabase.storage.from('apk-builds').list(`assets/${user.id}`, { limit: 100 });
    if (data) {
      const urls = data.map(file => supabase.storage.from('apk-builds').getPublicUrl(`assets/${user.id}/${file.name}`).data.publicUrl);
      setAssets(urls);
    }
  };



  const handleAssetUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setIsUploadingAsset(true);
    const fileName = `assets/${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('apk-builds').upload(fileName, file);
    if (!error) {
      const url = supabase.storage.from('apk-builds').getPublicUrl(fileName).data.publicUrl;
      setAssets(prev => [url, ...prev]);
    } else { alert("Upload failed."); }
    setIsUploadingAsset(false);
  };

  const selectAsset = (url) => { handlePropChange('url', url); setShowAssetModal(false); };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      if (ctrlOrCmd && e.key.toLowerCase() === 'k') { e.preventDefault(); setIsCommandOpen(prev => !prev); }
      if (e.key === 'Escape') setIsCommandOpen(false);

      if (ctrlOrCmd && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) handleRedo(); else handleUndo(); } 
      else if (ctrlOrCmd && e.key.toLowerCase() === 'y') { e.preventDefault(); handleRedo(); } 
      else if (ctrlOrCmd && e.key.toLowerCase() === 's') { e.preventDefault(); handleSaveProject(); } 
      else if (ctrlOrCmd && e.key.toLowerCase() === 'd') { e.preventDefault(); handleDuplicate(); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); handleDelete(); }

      // --- NEW: PIXEL-PERFECT ARROW KEY NUDGING ---
      if (selectedId && !selectedId.includes('root') && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent window from scrolling
        
        const step = e.shiftKey ? 10 : 1; // Hold Shift to move by 10px
        let dx = 0; let dy = 0;
        
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        
        const newSchema = JSON.parse(JSON.stringify(schema));
        const pIndex = newSchema.pages.findIndex(p => p.id === currentPageId);
        
        // Quick local find to get the exact node
        const findN = (tree, id) => {
          if (tree.id === id) return tree;
          if (tree.children) { for (let child of tree.children) { const found = findN(child, id); if (found) return found; } }
          return null;
        };
        
        const node = findN(newSchema.pages[pIndex].root, selectedId);
        
        // Arrow keys only nudge elements that are set to "Absolute (Free Float)"
        if (node && node.props.position === 'absolute') {
           const currentTop = parseFloat(node.props.top) || 0;
           const currentLeft = parseFloat(node.props.left) || 0;
           node.props.top = `${currentTop + dy}px`;
           node.props.left = `${currentLeft + dx}px`;
           
           // We use setSchema directly instead of commitHistory to prevent flooding the Undo stack
           setSchema(newSchema);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [schema, selectedId, history, historyIndex, currentPageId, user, dbProjectId, isCommandOpen]);

  const handleUndo = () => { if (historyIndex > 0) { const newIndex = historyIndex - 1; setHistoryIndex(newIndex); setSchema(history[newIndex]); setSelectedId(null); } };
  const handleRedo = () => { if (historyIndex < history.length - 1) { const newIndex = historyIndex + 1; setHistoryIndex(newIndex); setSchema(history[newIndex]); } };

  const regenerateIds = (node) => {
    const newNode = { ...node, id: `${node.type.toLowerCase()}_${Date.now()}_${Math.floor(Math.random()*1000)}` };
    if (newNode.children) newNode.children = newNode.children.map(regenerateIds);
    return newNode;
  };

  const handleDuplicate = () => {
    if (!selectedId || selectedId.includes('root')) return;
    const newSchema = JSON.parse(JSON.stringify(schema));
    let clonedNode = null;
    const findAndClone = (parent) => {
      if (!parent.children) return false;
      const index = parent.children.findIndex(c => c.id === selectedId);
      if (index !== -1) {
        clonedNode = regenerateIds(JSON.parse(JSON.stringify(parent.children[index])));
        parent.children.splice(index + 1, 0, clonedNode); return true;
      }
      for (let child of parent.children) { if (findAndClone(child)) return true; }
      return false;
    };
    const pIndex = newSchema.pages.findIndex(p => p.id === currentPageId);
    findAndClone(newSchema.pages[pIndex].root);
    if (clonedNode) { commitHistory(newSchema); setSelectedId(clonedNode.id); }
  };

  const handleDelete = () => {
     if(!selectedId || selectedId.includes('root')) return;
     const newSchema = JSON.parse(JSON.stringify(schema));
     const pIndex = newSchema.pages.findIndex(p => p.id === currentPageId);
     const deleteNodeRecursive = (tree, id) => {
        if (tree.children) { tree.children = tree.children.filter(c => c.id !== id); tree.children.forEach(c => deleteNodeRecursive(c, id)); }
     };
     deleteNodeRecursive(newSchema.pages[pIndex].root, selectedId);
     commitHistory(newSchema);
     setSelectedId(null);
  };

  const handleDeletePage = (e, pageIdToDelete) => {
    e.stopPropagation(); // Prevents the click from selecting the page behind the button
    
    if (schema.pages.length <= 1) {
      return alert("You must have at least one screen in your app.");
    }

    if (!confirm("Are you sure you want to delete this screen? This action cannot be undone.")) return;

    const newSchema = JSON.parse(JSON.stringify(schema));
    
    // Filter out the deleted page
    newSchema.pages = newSchema.pages.filter(p => p.id !== pageIdToDelete);
    
    // If the deleted page was set as the "Start" page, reset the start page
    if (newSchema.app?.initialPage === pageIdToDelete) {
      newSchema.app.initialPage = newSchema.pages[0].id;
    }

    commitHistory(newSchema);

    // If you are currently viewing the page you just deleted, snap back to the first page
    if (currentPageId === pageIdToDelete) {
      setCurrentPageId(newSchema.pages[0].id);
      setSelectedId(null);
    }
  };

  const handleOpenAddPage = () => {
    setNewPageName(`Screen ${schema.pages.length + 1}`);
    setNewPageTemplate('blank');
    setIsAddPageModalOpen(true);
  };

  const handleCreatePage = () => {
    if (!newPageName.trim()) return alert("Please enter a page name.");
    
    const newPageId = `page_${Date.now()}`;
    const newSchema = JSON.parse(JSON.stringify(schema));
    
    let rootProps = { padding: "16px", margin: "0px", backgroundColor: "transparent", backgroundType: "solid", mainAxisAlignment: "start", crossAxisAlignment: "stretch" };
    let rootChildren = [];

    // --- TEMPLATE LOGIC INJECTION ---
    if (newPageTemplate === 'appbar') {
       rootProps.padding = "0px"; // Remove padding so AppBar touches edges
       rootChildren = [
         { id: `row_${Date.now()}_1`, type: 'Row', props: { width: '100%', padding: '16px 20px', backgroundColor: 'theme.primary', mainAxisAlignment: 'spaceBetween', crossAxisAlignment: 'center' }, children: [
             { id: `icn_${Date.now()}_1`, type: 'Icon', props: { iconName: 'Menu', color: '#ffffff', size: '24px' } },
             { id: `txt_${Date.now()}_2`, type: 'Text', props: { content: newPageName, color: '#ffffff', fontSize: '18px', fontFamily: 'Inter' } },
             { id: `icn_${Date.now()}_3`, type: 'Icon', props: { iconName: 'Bell', color: '#ffffff', size: '20px' } }
         ]},
         { id: `pad_${Date.now()}_2`, type: 'Padding', props: { padding: '16px' }, children: [] }
       ];
    } else if (newPageTemplate === 'signup') {
       rootChildren = [ regenerateIds(JSON.parse(JSON.stringify(TEMPLATES.login))) ];
    } else if (newPageTemplate === 'shop') {
       rootChildren = [
         { id: `txtin_${Date.now()}_1`, type: 'TextInput', props: { placeholder: 'Search for products...', width: '100%', height: '50px', radiusTopLeft: '12px', radiusTopRight: '12px', radiusBottomLeft: '12px', radiusBottomRight: '12px' } },
         { id: `txt_${Date.now()}_2`, type: 'Text', props: { content: 'Trending Items', fontSize: '18px', color: '#ffffff', margin: '12px 0px 8px 0px' } },
         regenerateIds(JSON.parse(JSON.stringify(TEMPLATES.productCard))),
         regenerateIds(JSON.parse(JSON.stringify(TEMPLATES.productCard)))
       ];
    } else if (newPageTemplate === 'cart') {
       rootProps.mainAxisAlignment = 'spaceBetween'; // Push checkout button to bottom
       rootChildren = [
         { id: `list_${Date.now()}_1`, type: 'ListView', props: { width: '100%', gap: '16px' }, children: [ regenerateIds(JSON.parse(JSON.stringify(TEMPLATES.productCard))) ] },
         { id: `btn_${Date.now()}_2`, type: 'Button', props: { label: 'Secure Checkout - $120.00', width: '100%', height: '56px', backgroundColor: 'theme.primary', radiusTopLeft: '16px', radiusTopRight: '16px', radiusBottomLeft: '16px', radiusBottomRight: '16px' } }
       ];
    } else if (newPageTemplate === 'about') {
       rootProps.padding = "0px";
       rootChildren = [
         { id: `img_${Date.now()}_1`, type: 'Image', props: { width: '100%', height: '250px', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80' } },
         { id: `pad_${Date.now()}_2`, type: 'Padding', props: { padding: '24px' }, children: [
            { id: `col_${Date.now()}_3`, type: 'Column', props: { gap: '12px' }, children: [
               { id: `txt_${Date.now()}_4`, type: 'Text', props: { content: 'About Us', fontSize: '28px', color: '#ffffff', fontFamily: 'Inter' } },
               { id: `txt_${Date.now()}_5`, type: 'Text', props: { content: 'We build the future of mobile applications. Our mission is to democratize software creation.', fontSize: '14px', color: '#9ca3af' } }
            ]}
         ]}
       ];
    }

    newSchema.pages.push({ 
       id: newPageId, 
       name: newPageName, 
       root: { id: `root_column_${Date.now()}`, type: "Column", props: rootProps, children: rootChildren } 
    });
    
    commitHistory(newSchema);
    setCurrentPageId(newPageId);
    setSelectedId(null);
    setIsAddPageModalOpen(false);
  };

  const findNode = (tree, id) => {
    if (tree.id === id) return tree;
    if (tree.children) { for (let child of tree.children) { const found = findNode(child, id); if (found) return found; } }
    return null;
  };

  const handleSaveComponent = () => {
    if (!selectedId || selectedId.includes('root')) return alert("Please select a specific element to save as a component.");
    const pIndex = schema.pages.findIndex(p => p.id === currentPageId);
    const nodeToSave = findNode(schema.pages[pIndex].root, selectedId);
    if (!nodeToSave) return;

    const name = prompt("Name your Reusable Component:", `${nodeToSave.type} Custom`);
    if (!name) return;

    const newSchema = JSON.parse(JSON.stringify(schema));
    if (!newSchema.components) newSchema.components = [];
    
    const cleanNode = JSON.parse(JSON.stringify(nodeToSave));
    newSchema.components.push({ id: `comp_${Date.now()}`, name, node: cleanNode });
    
    commitHistory(newSchema);
    alert(`"${name}" saved! Find it in the Add tab under Your Components.`);
  };

  const handlePushToStore = async () => {
    if (!user) return alert("You must be logged in to publish to the store.");
    if (!selectedId || selectedId.includes('root')) return alert("Select an element or component to publish.");
    
    const pIndex = schema.pages.findIndex(p => p.id === currentPageId);
    const nodeToSave = findNode(schema.pages[pIndex].root, selectedId);
    if (!nodeToSave) return;

    const title = prompt("Marketplace Title (e.g. Cyberpunk Search Bar):");
    if (!title) return;
    
    const price = prompt("Set your price in USD (e.g. 10.00, or type 0 for FREE):", "5.00");
    if (!price) return;

    // In a real production app, you'd send this to your Next.js API route 
    // which inserts it into the `marketplace_items` Supabase table we created.
    alert(`🚀 "${title}" has been pushed to the store for $${price}! It will be live once approved.`);
  };

  const handlePropChange = (propKey, newValue) => {
    if (!selectedId) return;
    const newSchema = JSON.parse(JSON.stringify(schema));
    const pIndex = newSchema.pages.findIndex(p => p.id === currentPageId);
    const node = findNode(newSchema.pages[pIndex].root, selectedId);
    if (node) node.props[propKey] = newValue;
    commitHistory(newSchema);
  };

  const handleResize = (id, newWidth, newHeight) => {
    const newSchema = JSON.parse(JSON.stringify(schema));
    const pIndex = newSchema.pages.findIndex(p => p.id === currentPageId);
    const node = findNode(newSchema.pages[pIndex].root, id);
    if (node) { node.props.width = newWidth; node.props.height = newHeight; }
    commitHistory(newSchema);
  };

  const handleGlobalChange = (group, key, value) => {
    const newSchema = { ...schema, [group]: { ...schema[group], [key]: value } };
    commitHistory(newSchema);
  };

  const handleThemeChange = (key, value) => {
    const newSchema = { ...schema, theme: { ...schema.theme, [key]: value } };
    commitHistory(newSchema);
  };

  const handleAddStateVar = () => {
    const key = prompt("Enter Variable Name (e.g. userName, counter):");
    if (!key) return;
    // Ask for variable type
    const typeInt = prompt("Enter Type (1=String, 2=Integer, 3=Double, 4=Boolean):", "1");
    let typeStr = 'String'; let defaultVal = "''";
    if (typeInt === '2') { typeStr = 'int'; defaultVal = "0"; }
    else if (typeInt === '3') { typeStr = 'double'; defaultVal = "0.0"; }
    else if (typeInt === '4') { typeStr = 'bool'; defaultVal = "false"; }
    
    const newSchema = { ...schema, appState: [...schema.appState, { key, type: typeStr, value: defaultVal }] };
    commitHistory(newSchema);
  };
  const handleRemoveStateVar = (key) => {
    const newSchema = { ...schema, appState: schema.appState.filter(s => s.key !== key) };
    commitHistory(newSchema);
  };

  const handleTogglePermission = (permKey) => {
    const newSchema = { ...schema, permissions: { ...schema.permissions, [permKey]: !schema.permissions[permKey] } };
    commitHistory(newSchema);
  };

  const getProDefaults = () => ({
    margin: "0px", padding: "0px",
    backgroundType: "solid", backgroundColor: "transparent", gradientStart: "#4F46E5", gradientEnd: "#EC4899",
    radiusTopLeft: "0px", radiusTopRight: "0px", radiusBottomLeft: "0px", radiusBottomRight: "0px",
    borderWidth: "0", borderColor: "transparent", opacity: "1", // <-- NEW APPEARANCE PROPS
    shadowColor: "transparent", shadowOffsetX: "0", shadowOffsetY: "2", shadowBlur: "4", shadowSpread: "0",
    selfAlign: "auto", position: "relative", top: "", bottom: "", left: "", right: "",
    animationType: "none", animationDuration: "0.5", animationDelay: "0",
    actionType: "none", targetPage: "", transitionType: "default",
    actionChain: [],
    apiUrl: "", apiEndpoint: "",
    stateVariable: "", stateValue: "", isBound: false, boundVariable: "",
    scrollDirection: "vertical", gap: "8px",
    fontWeight: "normal", letterSpacing: "0px", textAlign: "left", // <-- NEW TYPOGRAPHY PROPS
    boxFit: "cover" // <-- NEW IMAGE PROPS
  });

  const handleDragStart = (e, type) => { 
    e.dataTransfer.setData("action", "new"); 
    e.dataTransfer.setData("componentType", type); 
    const rect = e.target.getBoundingClientRect();
    e.dataTransfer.setData("offsetX", e.clientX - rect.left);
    e.dataTransfer.setData("offsetY", e.clientY - rect.top);
  };
  
  const handleDragNodeStart = (e, id) => { 
    e.dataTransfer.setData("action", "move"); 
    e.dataTransfer.setData("nodeId", id); 
    const rect = e.target.getBoundingClientRect();
    e.dataTransfer.setData("offsetX", e.clientX - rect.left);
    e.dataTransfer.setData("offsetY", e.clientY - rect.top);
  };

  const handleDropToNode = (e, parentId, dropOffset = null) => {
    const action = e.dataTransfer.getData("action");
    if (!action) return;
    
    const newSchema = JSON.parse(JSON.stringify(schema));
    const pIndex = newSchema.pages.findIndex(p => p.id === currentPageId);
    const targetRoot = newSchema.pages[pIndex].root;

    const insertNodeIntoTree = (tree, targetParentId, newNode) => {
      if (tree.id === targetParentId) { if (!tree.children) tree.children = []; tree.children.push(newNode); return true; }
      if (tree.children) { for (let child of tree.children) { if (insertNodeIntoTree(child, targetParentId, newNode)) return true; } }
      return false;
    };

    if (action === "new") {
      const type = e.dataTransfer.getData("componentType");
      if (!type) return;
      const newId = `${type.toLowerCase()}_${Date.now()}`;

      const pro = getProDefaults();
      let newNode = { id: newId, type, props: { ...pro } };

     // 2. Initialize children array for structural components
      if (['Container', 'Card', 'Padding', 'Center', 'Stack', 'Row', 'Column', 'ListView'].includes(type)) {        
        newNode.children = [];
      }

      // 3. Apply specific styling based on the component type
      if (type === 'Container') { newNode.props.width = "200px"; newNode.props.height = "200px"; newNode.props.backgroundColor = "rgba(255, 255, 255, 0.05)"; newNode.props.radiusTopLeft = "16px"; newNode.props.radiusTopRight = "16px"; newNode.props.radiusBottomLeft = "16px"; newNode.props.radiusBottomRight = "16px"; }
      if (type === 'Card') { newNode.props.width = "100%"; newNode.props.padding = "16px"; newNode.props.backgroundColor = "#161b22"; newNode.props.radiusTopLeft = "16px"; newNode.props.radiusTopRight = "16px"; newNode.props.radiusBottomLeft = "16px"; newNode.props.radiusBottomRight = "16px"; newNode.props.shadowColor = "rgba(0,0,0,0.5)"; newNode.props.shadowBlur = "15"; newNode.props.shadowOffsetY = "8"; }
      if (type === 'Padding') { newNode.props.width = "100%"; newNode.props.padding = "16px"; newNode.props.backgroundColor = "transparent"; }
      if (type === 'Center') { newNode.props.width = "100%"; newNode.props.height = "100px"; newNode.props.backgroundColor = "transparent"; newNode.props.mainAxisAlignment = "center"; newNode.props.crossAxisAlignment = "center"; }
      if (type === 'SizedBox') { newNode.props.width = "100%"; newNode.props.height = "24px"; newNode.props.backgroundColor = "transparent"; }
      if (type === 'Divider') { newNode.props.width = "100%"; newNode.props.height = "1px"; newNode.props.backgroundColor = "rgba(255,255,255,0.1)"; newNode.props.margin = "8px 0px"; }

      else if (type === 'VideoPlayer') {
         newNode.props.width = "100%";
         newNode.props.height = "220px";
         newNode.props.url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
         newNode.props.autoPlay = false;
         newNode.props.radiusTopLeft = "12px"; 
         newNode.props.radiusTopRight = "12px"; 
         newNode.props.radiusBottomLeft = "12px"; 
         newNode.props.radiusBottomRight = "12px"; 
      }
      else if (type === 'MapView') {
         newNode.props.width = "100%";
         newNode.props.height = "300px";
         newNode.props.latitude = "37.7749";
         newNode.props.longitude = "-122.4194";
         newNode.props.zoom = "14";
      }
      else if (type === 'WebView') {
         newNode.props.width = "100%";
         newNode.props.height = "400px";
         newNode.props.url = "https://flutter.dev";
      }


      else if (type === 'PageView') {
         newNode.props.width = "100%";
         newNode.props.height = "250px";
         newNode.props.scrollDirection = "horizontal";
      }
      else if (type === 'Carousel') {
         newNode.props.width = "100%";
         newNode.props.height = "200px";
         newNode.props.viewportFraction = "0.8"; // Mimics PageController(viewportFraction: 0.8)
      }
      else if (type === 'ProgressBar') {
         newNode.props.width = "100%";
         newNode.props.height = "8px";
         newNode.props.progress = "0.5"; // Value between 0.0 and 1.0
         newNode.props.color = "theme.primary";
         newNode.props.backgroundColor = "#1A1B1E";
         newNode.props.radiusTopLeft = "4px";
         newNode.props.radiusTopRight = "4px";
         newNode.props.radiusBottomLeft = "4px";
         newNode.props.radiusBottomRight = "4px";
      }

      else if (type === 'GridView') {
         newNode.props.width = "100%";
         newNode.props.height = "auto";
         newNode.props.crossAxisCount = "2";
         newNode.props.mainAxisSpacing = "8px";
         newNode.props.crossAxisSpacing = "8px";
         newNode.props.padding = "8px";
      }
      else if (type === 'Wrap') {
         newNode.props.width = "100%";
         newNode.props.spacing = "8px";
         newNode.props.runSpacing = "8px";
         newNode.props.alignment = "start";
      }
      else if (type === 'Spacer') {
         newNode.props.flex = "1";
      }

      else if (type === 'ListView') { 
         newNode.props.width = "100%"; 
         newNode.props.height = "auto"; 
         newNode.props.gap = "8px"; 
      }
      else if (type === 'Stack') { 
         newNode.props.width = "100%"; 
         newNode.props.height = "200px"; 
         newNode.props.backgroundColor = "#1e2329"; 
         newNode.props.radiusTopLeft = "12px"; 
         newNode.props.radiusTopRight = "12px"; 
         newNode.props.radiusBottomLeft = "12px"; 
         newNode.props.radiusBottomRight = "12px"; 
      }
      else if (type === 'Text') { 
         newNode.props.content = "Text"; 
         newNode.props.fontSize = "16px"; 
         newNode.props.color = "#FFFFFF"; 
         newNode.props.textAlign = "left"; 
         newNode.props.fontFamily = "Inter"; 
         newNode.props.width = "100%"; 
         newNode.props.height = "auto"; 
      }
      else if (type === 'TextInput') { 
         newNode.props.placeholder = "Input field"; 
         newNode.props.width = "100%"; 
         newNode.props.height = "50px"; 
         newNode.props.radiusTopLeft = "8px"; 
         newNode.props.radiusTopRight = "8px"; 
         newNode.props.radiusBottomLeft = "8px"; 
         newNode.props.radiusBottomRight = "8px"; 
      }
      else if (type === 'Button') { 
         newNode.props.label = "Button"; 
         newNode.props.backgroundColor = "theme.primary"; 
         newNode.props.color = "#FFFFFF"; 
         newNode.props.width = "100%"; 
         newNode.props.height = "50px"; 
         newNode.props.radiusTopLeft = "8px"; 
         newNode.props.radiusTopRight = "8px"; 
         newNode.props.radiusBottomLeft = "8px"; 
         newNode.props.radiusBottomRight = "8px"; 
      }
      else if (type === 'Image') { 
         newNode.props.url = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"; 
         newNode.props.width = "150px"; 
         newNode.props.height = "150px"; 
         newNode.props.radiusTopLeft = "12px"; 
         newNode.props.radiusTopRight = "12px"; 
         newNode.props.radiusBottomLeft = "12px"; 
         newNode.props.radiusBottomRight = "12px"; 
      }
      else if (type === 'Icon') { 
         newNode.props.iconName = "Home"; 
         newNode.props.color = "#FFFFFF"; 
         newNode.props.size = "24px"; 
      }
      else if (type === 'Shape') { 
         newNode.props.width = "100px"; 
         newNode.props.height = "100px"; 
         newNode.props.backgroundColor = "#4F46E5"; 
         newNode.props.radiusTopLeft = "50px"; 
         newNode.props.radiusTopRight = "50px"; 
         newNode.props.radiusBottomLeft = "50px"; 
         newNode.props.radiusBottomRight = "50px"; 
      }
      else if (type === 'Row') { 
         newNode.props.gap = "12px"; 
         newNode.props.width = "100%"; 
         newNode.props.height = "auto"; 
         newNode.props.mainAxisAlignment = "start"; 
         newNode.props.crossAxisAlignment = "center"; 
      }
      else if (type === 'Column') { 
         newNode.props.gap = "12px"; 
         newNode.props.width = "100%"; 
         newNode.props.height = "auto"; 
         newNode.props.mainAxisAlignment = "start"; 
         newNode.props.crossAxisAlignment = "stretch"; 
      }


      const success = insertNodeIntoTree(targetRoot, parentId, newNode);
      if (!success) targetRoot.children.push(newNode);
      
      commitHistory(newSchema);
      setSelectedId(newId);
    } 
    else if (action === "template" || action === "savedComponent") {
      let sourceObj = null;
      if (action === 'template') {
        const tKey = e.dataTransfer.getData("templateKey");
        
        // --- NEW: PAYWALL GATEKEEPER ---
        // Define which templates are free. Everything else triggers the paywall!
        const freeTemplates = ['hero', 'login', 'productCard', 'storyList', 'sectionTitle'];
        
        if (!freeTemplates.includes(tKey) && !isPremium) {
           alert("✨ This is a Premium Template! Please upgrade your workspace to unlock it.");
           handleCheckout(); // Send them to Stripe!
           return;
        }
        // -------------------------------

        sourceObj = TEMPLATES[tKey];
      } else {
        const cId = e.dataTransfer.getData("compId");
        sourceObj = newSchema.components?.find(c => c.id === cId)?.node;
      }

      if (sourceObj) {
        const clonedNode = regenerateIds(JSON.parse(JSON.stringify(sourceObj)));

        const success = insertNodeIntoTree(targetRoot, parentId, clonedNode);
        if (!success) targetRoot.children.push(clonedNode);
        commitHistory(newSchema);
        setSelectedId(clonedNode.id);
      }
    }
    else if (action === "move") {
      const nodeId = e.dataTransfer.getData("nodeId");
      if (!nodeId || nodeId === parentId) return; 
      let draggedNode = null;
      const extractNode = (parent, id) => {
        if (!parent.children) return false;
        const idx = parent.children.findIndex(c => c.id === id);
        if (idx !== -1) { draggedNode = parent.children.splice(idx, 1)[0]; return true; }
        for (let child of parent.children) { if (extractNode(child, id)) return true; }
        return false;
      };
      extractNode(targetRoot, nodeId);
      
      if (draggedNode) {

        const success = insertNodeIntoTree(targetRoot, parentId, draggedNode);
        if (!success) targetRoot.children.push(draggedNode);
        commitHistory(newSchema);
      }
    }
  };

  
const handleMove = (direction) => {
    if (!selectedId) return;
    const newSchema = JSON.parse(JSON.stringify(schema));
    const pIndex = newSchema.pages.findIndex(p => p.id === currentPageId);
    const moveNode = (parent) => {
      if (!parent.children) return false;
      const index = parent.children.findIndex(c => c.id === selectedId);
      if (index !== -1) {
        if (direction === 'up' && index > 0) { const temp = parent.children[index - 1]; parent.children[index - 1] = parent.children[index]; parent.children[index] = temp; } 
        else if (direction === 'down' && index < parent.children.length - 1) { const temp = parent.children[index + 1]; parent.children[index + 1] = parent.children[index]; parent.children[index] = temp; }
        return true; 
      }
      for (let child of parent.children) { if (moveNode(child)) return true; }
      return false;
    };
    moveNode(newSchema.pages[pIndex].root);
    commitHistory(newSchema);
  };

  const handleSaveProject = async () => {
    if (!user) return alert("Must be logged in to save.");
    setIsSaved(true);
    const projectData = { user_id: user.id, name: "AppForge Project", schema: schema };
    if (dbProjectId) await supabase.from('projects').update(projectData).eq('id', dbProjectId);
    else { const { data } = await supabase.from('projects').insert([projectData]).select(); if (data && data[0]) setDbProjectId(data[0].id); }
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSignUp = async () => { setIsAuthLoading(true); const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword }); if (error) alert(error.message); else alert("Success! You can now log in."); setIsAuthLoading(false); };
  const handleLogin = async () => { setIsAuthLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword }); if (error) alert(error.message); setIsAuthLoading(false); };
  const handleLogout = async () => { await supabase.auth.signOut(); setSchema(dummySchema); setHistory([dummySchema]); setHistoryIndex(0); setDbProjectId(null); };

  const handleCheckout = async () => {
    if (!user) return alert("Please log in to upgrade your workspace.");
    if (!dbProjectId) return alert("Please save your project first.");
    
    setIsBuilding(true); 
    try {
      const response = await fetch('/api/checkout', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          projectId: dbProjectId,
          userId: user.id
        }) 
      });
      
      if (!response.ok) throw new Error("Failed to initialize checkout");
      
      const { url } = await response.json(); 
      // Redirect the user to the Stripe hosted checkout page
      window.location.href = url;
    } catch (error) { 
      alert("Checkout failed. Please try again."); 
      setIsBuilding(false); 
    }
  };


  const handleDeploy = async () => {
    if (!user || !dbProjectId) return alert("Please log in and Save your project before building.");

    setIsBuilding(true); // Temporarily lock the button while checking database

    try {
      // 1. Verify premium status on the USER'S PROFILE
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      // 2. If they are NOT premium, trigger the paywall!
      if (!profileData?.is_premium) {
        setIsBuilding(false);
        handleCheckout();
        return;
      }

      // 3. User is Premium! Proceed with the build dashboard.
      setShowDashboard(true);
      setBuildLogs(['Initializing AppForge Cloud Compiler...', 'Parsing JSON Schema to Dart...']);
      
      setTimeout(() => setBuildLogs(prev => [...prev, 'Resolving Flutter dependencies (flutter pub get)...']), 1500);
      setTimeout(() => setBuildLogs(prev => [...prev, 'Compiling native Android binaries (assembleRelease)...']), 3500);
      setTimeout(() => setBuildLogs(prev => [...prev, 'Applying ProGuard rules and shrinking APK...']), 6000);

      startActualCloudBuild(dbProjectId);

    } catch (err) {
      console.error(err);
      alert("Failed to verify account status.");
      setIsBuilding(false);
    }
  };

    const handleGenerateMagicTheme = async () => {
    if (!themePrompt) return alert("Please enter a theme description first!");
    
    setIsGeneratingTheme(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Act as an expert UI/UX designer. Create a color palette and app theme based on this exact description: "${themePrompt}". 
          Return ONLY a valid, strict JSON object (no markdown, no backticks) matching this exact structure, using valid hex codes for colors:
          {
            "primary": "#HexCode",
            "secondary": "#HexCode",
            "background": "#HexCode",
            "surface": "#HexCode",
            "text": "#HexCode",
            "navStyle": "glass", 
            "navBackground": "#HexCode"
          }
          Note: "navStyle" must be exactly one of: "glass", "flat", or "floating".`
          ,
          provider: aiProvider,        // <--- ADDED THIS
          apiKey: customApiKey         // <--- ADDED THIS
        })
      });

      const data = await response.json();
      
      // NEW: If the server returns an error, stop and show it so we don't crash the app!
      if (data.error) throw new Error(data.error);
      
      // Clean up Gemini's response to ensure valid JSON
      let cleanJson = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      const newTheme = JSON.parse(cleanJson);

      // Apply the generated theme to the AppForge Schema
      const newSchemaTheme = { ...schema.theme };
      if (newTheme.primary) newSchemaTheme.primary = newTheme.primary;
      if (newTheme.secondary) newSchemaTheme.secondary = newTheme.secondary;
      if (newTheme.background) newSchemaTheme.background = newTheme.background;
      if (newTheme.surface) newSchemaTheme.surface = newTheme.surface;
      if (newTheme.text) newSchemaTheme.text = newTheme.text;
      
      setSchema(prev => ({ 
        ...prev, 
        theme: newSchemaTheme,
        appConfig: {
          ...prev.appConfig,
          navStyle: newTheme.navStyle || prev.appConfig.navStyle,
          navBackground: newTheme.navBackground || prev.appConfig.navBackground
        }
      }));

      setThemePrompt(''); // Clear input on success

    } catch (error) {
      console.error("Theme Gen Error:", error);
      alert("Failed to generate theme. Please try a different prompt.");
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  const handleAiElementEdit = async () => {
    if (!elementPrompt || !selectedId || selectedId.includes('root')) return alert("Please select a specific element and enter a prompt.");
    
    setIsEditingElement(true);
    try {
      const pIndex = schema.pages.findIndex(p => p.id === currentPageId);
      const currentNode = findNode(schema.pages[pIndex].root, selectedId);
      
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `The user wants to modify this specific UI element: "${elementPrompt}".
          
          CURRENT ELEMENT STATE:
          ${JSON.stringify({ type: currentNode.type, props: currentNode.props })}`
        })
      });

      const data = await response.json();
      
      // Parse the structured AI response
      let cleanJson = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiResponse = JSON.parse(cleanJson);

      // Log the AI's thought process so you can see why it made its decisions!
      console.log("🤖 AI Co-Pilot Thought Process:", aiResponse.thought_process);

      // Apply the new props to the schema
      const newSchema = JSON.parse(JSON.stringify(schema));
      const targetNode = findNode(newSchema.pages[pIndex].root, selectedId);
      
      if (targetNode && aiResponse.updated_props) {
         // Merge AI generated props with existing props
         targetNode.props = { ...targetNode.props, ...aiResponse.updated_props };
         commitHistory(newSchema);
      }

      setElementPrompt(''); // Clear input

    } catch (error) {
      console.error("AI Element Edit Error:", error);
      alert("AI failed to parse the design changes. Please try a more specific prompt.");
    } finally {
      setIsEditingElement(false);
    }
  };

  const handleExport = async () => {
    if (!user) return alert("Please log in to export code.");
    
    setIsExporting(true);
    try {
      // 1. Verify premium status in Supabase before generating the code
      // 1. Verify premium status on the USER'S PROFILE, not the project
      const { data: profileData } = await supabase
        .from('profiles') // Check the user's profile table
        .select('is_premium')
        .eq('id', user.id)
        .single();

      if (!profileData?.is_premium) {
        setIsExporting(false);
        handleCheckout(); // FIX: 'upgrade' was undefined; just call handleCheckout directly
        return;
      }

      // Proceed with ZIP export...

      // 2. If premium, proceed with the existing export logic
      const response = await fetch('/api/export', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ dartCode: code, appName: "AppForge Project" }) 
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob(); 
      const url = window.URL.createObjectURL(blob); 
      const a = document.createElement('a'); 
      a.href = url; 
      a.download = "appforge_project.zip"; 
      document.body.appendChild(a); 
      a.click(); 
      window.URL.revokeObjectURL(url); 
      document.body.removeChild(a);
      
    } catch (error) { 
      alert("Failed to export project."); 
    } finally { 
      setIsExporting(false); 
    }
  };

  const startActualCloudBuild = async (projectId) => {
    setIsBuilding(true); 
    setApkUrl(null); 
    const expectedApkUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/apk-builds/app-release-${projectId}.apk`;
    
    // Record the exact millisecond we clicked Deploy
    const buildStartTime = Date.now(); 

    try {
      const response = await fetch('/api/build', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dartCode: generateFlutterCode(schema), projectId }) });
      if (!response.ok) throw new Error("Failed to start build");
      
      const checkInterval = setInterval(async () => {
        try { 
          // We add ?t=Date.now() to completely bypass the Browser & CDN Cache
          const checkRes = await fetch(`${expectedApkUrl}?t=${Date.now()}`, { method: 'HEAD' }); 
          
          if (checkRes.ok) { 
            const lastModifiedStr = checkRes.headers.get('last-modified');
            
            // Verification: Is this actually the NEW file?
            if (lastModifiedStr) {
               const fileTime = new Date(lastModifiedStr).getTime();
               // If the file is older than our click, it's from a previous build. Keep waiting!
               if (fileTime < buildStartTime) {
                  return; 
               }
            }

            // If we get here, it is the brand new, successfully compiled APK!
            clearInterval(checkInterval); 
            setIsBuilding(false); 
            setApkUrl(expectedApkUrl); 
          } 
        } catch (e) {}
      }, 10000); 
    } catch (error) { 
      alert("Failed to trigger cloud build."); 
      setIsBuilding(false); 
    }
  };

  const handleRunHealthScan = async () => {
    setIsScanningHealth(true);
    setMaintenanceTasks([]);

    try {
      const schemaString = JSON.stringify({
        pages: schema.pages.map(p => ({ name: p.name, widgetCount: p.root?.children?.length || 0 })),
        tables: schema.appConfig?.dbTables || [],
        flutterVersion: "3.19.0" // Simulating the current generated environment
      });

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Act as an automated App Maintenance Engineer. Analyze this app schema and generate a strict JSON array of 3 maintenance tasks. 
          Task 1 should be a Flutter SDK deprecation warning (e.g., WillPopScope is deprecated).
          Task 2 should be a performance bottleneck warning (e.g., ListView without pagination).
          Task 3 should be a database optimization (e.g., missing indexing on a table).
          
          Return ONLY a valid JSON array of objects in this exact format:
          [{"title": "Task Title", "description": "Detailed explanation", "type": "warning" | "error" | "info", "actionText": "Auto-Fix Button Text"}]
          
          Schema: ${schemaString}`
        })
      });

      const data = await response.json();
      
      // Clean Gemini's markdown formatting if it includes ```json
      let cleanJson = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedTasks = JSON.parse(cleanJson);
      
      setMaintenanceTasks(parsedTasks);

    } catch (error) {
      console.error("Health Scan Error:", error);
      setMaintenanceTasks([{ title: "Scan Failed", description: "Could not connect to Gemini AI.", type: "error", actionText: "Retry" }]);
    } finally {
      setIsScanningHealth(false);
    }
  };

  const handleAiGenerateBackend = async () => {
    setIsGeneratingBackend(true);
    try {
      const collectWidgetTypes = (node, types = new Set()) => {
        if (!node) return [...types];
        types.add(node.type);
        (node.children || []).forEach(c => collectWidgetTypes(c, types));
        return [...types];
      };

      const appSummary = {
        pages: schema.pages.map(p => ({
          name: p.name,
          widgets: collectWidgetTypes(p.root)
        })),
        existingTables: schema.appConfig?.dbTables?.map(t => t.name) || [],
        backendProvider: schema.backendProvider || 'supabase',
        appName: schema.app?.name || 'My App'
      };

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are a database architect for a mobile app builder. Analyze this Flutter app schema and return the MINIMUM set of database tables needed.
          Rules:
          - Each table needs id (uuid) and created_at (timestamp) — do NOT include these in columns.
          - Only add tables the app actually needs based on widget types (ListView = data to list, TextInput = form to save, etc.)
          - Column types must be one of: text, numeric, boolean, uuid, timestamp
          - Enable RLS on all tables. Tables with user data need rlsAuthOnly: true.
          - Return ONLY valid JSON, no markdown.
          
          Schema: ${JSON.stringify(appSummary)}
          
          Return this exact format:
          [ { "id": "tbl_unique_id", "name": "table_name", "rlsEnabled": true, "rlsAuthOnly": true, "columns": [ { "id": "col_unique_id", "name": "col_name", "type": "text" } ] } ]`,
          provider: aiProvider,
          apiKey: customApiKey
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      let cleanJson = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedTables = JSON.parse(cleanJson);

      const existingNames = new Set((schema.appConfig?.dbTables || []).map(t => t.name));
      const newTables = generatedTables.filter(t => !existingNames.has(t.name));

      const updatedTables = [...(schema.appConfig?.dbTables || []), ...newTables];
      handleGlobalChange('appConfig', 'dbTables', updatedTables);

      alert(`✓ AI created ${newTables.length} new table(s): ${newTables.map(t => t.name).join(', ')}\n\nReview them in the Data tab, then click "View SQL" to deploy.`);
    } catch (err) {
      console.error('AI Backend Gen Error:', err);
      alert('AI failed to generate backend. Try again or create tables manually.');
    } finally {
      setIsGeneratingBackend(false);
    }
  };

  const handleOneClickDeploy = async () => {
    const url = schema.supabaseConfig?.url;
    const key = schema.supabaseConfig?.anonKey;
    if (!url || !key) return alert('Enter your Supabase URL and Anon Key in the Cloud Backend section first.');

    const sql = generateSupabaseSQL(schema.appConfig?.dbTables || []);
    if (!sql || sql === '-- No tables defined') return alert('No tables to deploy. Use AI Generate or add tables manually first.');

    try {
      const encoded = encodeURIComponent(sql);
      window.open(`${url.replace('https://', 'https://app.supabase.com/project/').replace('.supabase.co', '')}/sql?content=${encoded}`, '_blank');
    } catch (err) {
      alert('Could not open Supabase. Copy the SQL manually from "View SQL".');
    }
  };

  const handleRunAiAudit = async () => {
    setIsAiAuditing(true);
    setAiAuditLogs([{ role: 'system', text: 'Initializing AppForge AI Auditor...' }]);

    try {
      // 1. Analyze the schema to find potential issues
      const schemaString = JSON.stringify({
        pages: schema.pages.map(p => ({ name: p.name, id: p.id })),
        tables: schema.appConfig?.dbTables || [],
        apis: schema.apiEndpoints || [],
        state: schema.appState || []
      }, null, 2);

      setAiAuditLogs(prev => [...prev, { role: 'system', text: 'Analyzing database architecture and UI bindings...' }]);

      // 2. Call your existing Gemini PHP backend
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze this app architecture. Provide exactly 3 bullet points of proactive, highly technical advice for a Flutter/Supabase developer. Suggest specific database indexing, state management improvements, or missing API error handling based on this schema: \n\n${schemaString}`,
          code: '', // Not modifying code this time, just analyzing
          language: 'json'
        })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // 3. Display the AI's response
      setAiAuditLogs(prev => [
        ...prev, 
        { role: 'system', text: 'Audit complete. Gemini analysis generated.' },
        { role: 'ai', text: data.newCode || data.reply || "Analysis complete, but no suggestions were returned." }
      ]);

    } catch (error) {
      console.error(error);
      setAiAuditLogs(prev => [...prev, { role: 'error', text: `Audit failed: ${error.message}` }]);
    } finally {
      setIsAiAuditing(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput(''); // Clear input instantly for good UX
    
    // Add user message to history
    const newHistory = [...aiChatHistory, { role: 'user', text: userMessage }];
    setAiChatHistory(newHistory);
    setIsAiThinking(true);

    try {
      // Grab context of what they are currently looking at
      const pIndex = schema.pages.findIndex(p => p.id === currentPageId);
      const activeNode = selectedId ? findNode(schema.pages[pIndex].root, selectedId) : null;
      
      const contextData = {
        selectedElement: activeNode ? { id: activeNode.id, type: activeNode.type, props: activeNode.props } : "None selected",
        globalTheme: schema.theme
      };

      // --- STRICT INSTRUCTIONS: Force AI to act as a Canvas Engine Controller ---
      const systemInstruction = `You are the AppForge AI Builder. You MUST return ONLY a raw JSON object. Do NOT wrap it in markdown formatting like \`\`\`json.
      Your JSON MUST match this exact schema:
      {
        "chat_reply": "Your conversational response explaining what you did.",
        "action": "none" | "update" | "add_template",
        "target_id": "The ID of the selected element if updating",
        "updated_props": { "key": "value" },
        "template_key": "login" | "hero" | "productCard" | "storyList" | "sectionTitle" | "userProfile" | "statCard" | "settingsList" | "aiPromptBar" | "cryptoWallet" | "smartHomeHub" | "biometricAuth" | "arNavigation" | "mediaPlayer" | "healthMetrics" | "aiChatBubble" | "proPaywall" | "taskOverview"
      }
      RULES:
      1. If the user asks to generate a full screen (e.g. "login page", "hero", "dashboard"), set action to "add_template" and pick the closest template_key.
      2. If the user asks to change the color/text of the currently selected element, set action to "update" and provide updated_props.
      3. If they just ask a general question, set action to "none".`;

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send the strict instructions + context + user message
          prompt: `${systemInstruction}\n\nContext:\n${JSON.stringify(contextData)}\n\nUser Message: ${userMessage}`,
          provider: aiProvider,
          apiKey: customApiKey
        })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      let cleanJson = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiResponse = JSON.parse(cleanJson);

      // 1. Add AI's text response to the chat window
      setAiChatHistory(prev => [...prev, { role: 'ai', text: aiResponse.chat_reply }]);

      const newSchema = JSON.parse(JSON.stringify(schema));
      const targetRoot = newSchema.pages[pIndex].root;

      // 2. AI ACTION: Add a Full Template to Canvas
      if (aiResponse.action === 'add_template' && aiResponse.template_key) {
         const sourceObj = TEMPLATES[aiResponse.template_key];
         if (sourceObj) {
            const clonedNode = regenerateIds(JSON.parse(JSON.stringify(sourceObj)));
            if (!targetRoot.children) targetRoot.children = [];
            targetRoot.children.push(clonedNode);
            commitHistory(newSchema);
            setSelectedId(clonedNode.id);
         }
      }
      
      // 3. AI ACTION: Update Properties of selected element
      else if (aiResponse.action === 'update' && aiResponse.target_id) {
         const targetNode = findNode(targetRoot, aiResponse.target_id);
         if (targetNode && aiResponse.updated_props) {
            targetNode.props = { ...targetNode.props, ...aiResponse.updated_props };
            commitHistory(newSchema);
         }
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setAiChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I hit a snag connecting to the server. Can we try that again?" }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const pageIndex = schema.pages.findIndex(p => p.id === currentPageId);
  const activePage = schema.pages[pageIndex] || schema.pages[0];
  const code = generateFlutterCode(schema);
  const selectedNode = findNode(activePage?.root, selectedId);

  let canMoveUp = false; let canMoveDown = false;
  if (selectedId && activePage) {
    const checkMoveStatus = (parent) => {
      if (!parent.children) return false;
      const index = parent.children.findIndex(c => c.id === selectedId);
      if (index !== -1) { canMoveUp = index > 0; canMoveDown = index < parent.children.length - 1; return true; }
      for (let child of parent.children) { if (checkMoveStatus(child)) return true; }
      return false;
    };
    checkMoveStatus(activePage.root);
  }



  // SyntaxHighlightedCode is defined at module scope above Home.

  // AI model config UI is rendered inside the AI chat panel in the right sidebar (rightTab === 'ai').
  // The duplicate block that was here has been removed — it was floating outside any return statement
  // and caused a syntax error that prevented the app from compiling.


 const renderPropertyGroups = () => {
    if (!selectedNode) {
       return (
         <div className="space-y-6 flex-1 overflow-y-auto p-5 custom-scrollbar pb-20">
           
           {/* --- AI MAGIC THEME GENERATOR --- */}
           <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/10 border border-purple-500/30 p-4 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.1)] mb-2">
             <div className="flex items-center gap-2 mb-3">
               <LucideIcons.Sparkles size={16} className="text-purple-400" />
               <h3 className="text-[11px] font-bold text-purple-300 uppercase tracking-widest">AI Magic Theme</h3>
             </div>
             <p className="text-xs text-gray-400 mb-3 leading-relaxed">Describe your app's vibe. Gemini will generate a complete color palette and UI style instantly.</p>
             
             <div className="flex flex-col gap-2">
               <input 
                 type="text" 
                 value={themePrompt}
                 onChange={(e) => setThemePrompt(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleGenerateMagicTheme()}
                 placeholder="e.g. Dark mode cyberpunk with neon pink..." 
                 className="w-full bg-[#0E0F11] border border-white/10 p-2.5 rounded-xl text-xs text-white placeholder:text-gray-600 outline-none focus:border-purple-500/50 transition-colors shadow-inner"
               />
               <button 
                 onClick={handleGenerateMagicTheme} 
                 disabled={isGeneratingTheme || !themePrompt}
                 className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
               >
                 {isGeneratingTheme ? (
                   <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...</>
                 ) : (
                   <><LucideIcons.Wand2 size={14} /> Generate Theme</>
                 )}
               </button>
             </div>
           </div>

           <div className="bg-[#161b22] border border-white/5 p-4 rounded-xl mb-6 shadow-sm">
             <p className="text-xs text-gray-400 font-medium leading-relaxed">Click an element on the canvas to edit it, or change manual theme settings below.</p>
           </div>
           
           <div className="border-b border-white/5 pb-6">
             <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Smartphone size={14}/> Bottom Navigation</h4>
             
             <div className="flex items-center justify-between bg-[#161b22] p-4 rounded-xl border border-white/5 mb-4 shadow-sm">
                <span className="text-xs font-bold text-gray-300">Enable Tab Bar</span>
                <button onClick={() => handleGlobalChange('appConfig', 'enableBottomNav', !schema.appConfig.enableBottomNav)} className={`w-10 h-5 rounded-full relative transition-colors ${schema.appConfig.enableBottomNav ? 'bg-blue-600' : 'bg-gray-700'}`}>
                   <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${schema.appConfig.enableBottomNav ? 'left-[22px]' : 'left-[2px]'}`}></div>
                </button>
             </div>

             {schema.appConfig.enableBottomNav && (
               <div className="p-4 bg-[#0E0F11] border border-white/5 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                 <div className="space-y-4 mb-4 pb-4 border-b border-white/10">
                   <div className="flex flex-col gap-2">
                     <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Depth Style</label>
                     <select value={schema.appConfig.navStyle} onChange={(e) => handleGlobalChange('appConfig', 'navStyle', e.target.value)} className="w-full bg-[#1A1B1E] border border-white/10 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 transition-colors cursor-pointer">
                       <option value="flat">Flat (No Shadow)</option><option value="shadow">Drop Shadow</option><option value="glass">Glassmorphism (Blur)</option>
                     </select>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="flex flex-col gap-2"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Icon Size</label><input type="number" value={schema.appConfig.navIconSize || '22'} onChange={(e) => handleGlobalChange('appConfig', 'navIconSize', e.target.value)} className="w-full bg-[#1A1B1E] border border-white/10 rounded-lg p-2 text-xs text-gray-200 outline-none focus:border-blue-500" /></div>
                     <div className="flex flex-col gap-2"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Animation</label><select value={schema.appConfig.navAnimation || 'scale'} onChange={(e) => handleGlobalChange('appConfig', 'navAnimation', e.target.value)} className="w-full bg-[#1A1B1E] border border-white/10 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-blue-500 cursor-pointer"><option value="none">None</option><option value="scale">Scale Pop</option><option value="bounce">Bounce</option></select></div>
                   </div>
                   <div className="grid grid-cols-3 gap-2 pt-2">
                     <div className="flex flex-col items-center gap-1"><span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Bg</span><input type="color" value={schema.appConfig.navBackground || '#0d1117'} onChange={(e) => handleGlobalChange('appConfig', 'navBackground', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" /></div>
                     <div className="flex flex-col items-center gap-1"><span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Active</span><input type="color" value={schema.appConfig.navActiveColor || '#3b82f6'} onChange={(e) => handleGlobalChange('appConfig', 'navActiveColor', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" /></div>
                     <div className="flex flex-col items-center gap-1"><span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Inactive</span><input type="color" value={schema.appConfig.navIconColor || '#4b5563'} onChange={(e) => handleGlobalChange('appConfig', 'navIconColor', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" /></div>
                   </div>
                 </div>
                 <div className="flex justify-between items-center mb-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Navigation Tabs</label>
                    <button onClick={() => { const items = schema.appConfig.navItems || []; if (items.length >= 5) return alert("Maximum 5 tabs allowed for mobile."); handleGlobalChange('appConfig', 'navItems', [...items, { id: `nav_${Date.now()}`, icon: 'Star', targetPage: '' }]); }} className="text-[9px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-600/30 transition-colors font-bold">+ Add Tab</button>
                 </div>
                 <div className="space-y-2">
                   {(schema.appConfig.navItems || []).length === 0 && <div className="text-[10px] text-gray-500 text-center py-4 border border-dashed border-white/10 rounded-lg">No tabs added.</div>}
                   {(schema.appConfig.navItems || []).map((item, idx) => (
                     <div key={item.id} className="bg-[#161b22] p-3 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Tab {idx + 1}</span>
                          <button onClick={() => { const newItems = schema.appConfig.navItems.filter(i => i.id !== item.id); handleGlobalChange('appConfig', 'navItems', newItems); }} className="text-gray-600 hover:text-red-400 transition-colors"><LucideIcons.Trash size={12}/></button>
                        </div>
                        <div className="flex gap-2">
                          <input type="text" value={item.icon} placeholder="Lucide Icon" onChange={(e) => { const newItems = [...schema.appConfig.navItems]; newItems[idx].icon = e.target.value; handleGlobalChange('appConfig', 'navItems', newItems); }} className="w-1/3 bg-[#0E0F11] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors" />
                          <select value={item.targetPage} onChange={(e) => { const newItems = [...schema.appConfig.navItems]; newItems[idx].targetPage = e.target.value; handleGlobalChange('appConfig', 'navItems', newItems); }} className="w-2/3 bg-[#0E0F11] border border-white/10 rounded-lg p-2 text-xs text-gray-300 outline-none focus:border-blue-500 cursor-pointer transition-colors"><option value="">Select Target Page...</option>{schema.pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>

           <div className="border-b border-transparent pb-4">
             <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Layers size={14}/> Brand Colors</h4>
             <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center bg-[#161b22] p-4 rounded-xl border border-white/5 shadow-sm"><span className="text-xs font-bold text-gray-300">Primary Color</span><input type="color" value={schema.theme.primary} onChange={(e) => handleThemeChange("primary", e.target.value)} className="w-7 h-7 rounded-md border-0 p-0 cursor-pointer bg-transparent" /></div>
               <div className="flex justify-between items-center bg-[#161b22] p-4 rounded-xl border border-white/5 shadow-sm"><span className="text-xs font-bold text-gray-300">Secondary Color</span><input type="color" value={schema.theme.secondary || '#EC4899'} onChange={(e) => handleThemeChange("secondary", e.target.value)} className="w-7 h-7 rounded-md border-0 p-0 cursor-pointer bg-transparent" /></div>
               <div className="flex justify-between items-center bg-[#161b22] p-4 rounded-xl border border-white/5 shadow-sm"><span className="text-xs font-bold text-gray-300">App Background</span><input type="color" value={schema.theme.background} onChange={(e) => handleThemeChange("background", e.target.value)} className="w-7 h-7 rounded-md border-0 p-0 cursor-pointer bg-transparent" /></div>
             </div>
           </div>
         </div>
       );
     }

     const props = selectedNode.props;

     return (
       <div className="flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
         
         {/* FLUTTERFLOW STYLE SUB-NAVIGATION */}
         <div className="flex items-center justify-around p-2 bg-[#0E0F11] border-b border-white/5 shrink-0 z-10 shadow-md">
           {[
             { id: 'properties', icon: 'SlidersHorizontal', label: 'Props' },
             { id: 'actions', icon: 'Zap', label: 'Actions' },
             { id: 'backend', icon: 'Database', label: 'Data' },
             { id: 'animations', icon: 'PlaySquare', label: 'Animate' }
           ].map(tab => {
             const IconComp = LucideIcons[tab.icon] || LucideIcons.Circle;
             const isActive = inspectorTab === tab.id;
             return (
               <button
                 key={tab.id}
                 onClick={() => setInspectorTab(tab.id)}
                 className={`flex flex-col items-center gap-1.5 p-2.5 w-16 rounded-xl transition-all ${isActive ? 'bg-[#1A1B1E] text-blue-400 shadow-inner border border-white/5' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
               >
                 <IconComp size={16} className={isActive ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" : ""} />
                 <span className="text-[8px] font-bold tracking-widest uppercase">{tab.label}</span>
               </button>
             )
           })}
         </div>

         {/* SCROLLABLE PROPERTY CONTENT */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-24">

           {/* ============================================================ */}
           {/* TAB 1: PROPERTIES & STYLING                                  */}
           {/* ============================================================ */}
           {inspectorTab === 'properties' && (
             <div className="space-y-6 animate-in fade-in duration-200">
               
               {/* 1. POSITIONING (Applies to all) */}
               <div className="border-b border-white/5 pb-6">
                 <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Monitor size={14}/> Positioning</h4>
                 <PropInput label="Layout Flow" propKey="position" type="select" options={[{label:'Relative (Normal)', value:'relative'},{label:'Absolute (Free Float)', value:'absolute'}]} value={props.position} onChange={handlePropChange} />
                 {props.position === 'absolute' && (
                   <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-[#161b22] rounded-xl border border-white/5">
                     <PropInput label="Top" propKey="top" value={props.top} onChange={handlePropChange} />
                     <PropInput label="Bottom" propKey="bottom" value={props.bottom} onChange={handlePropChange} />
                     <PropInput label="Left" propKey="left" value={props.left} onChange={handlePropChange} />
                     <PropInput label="Right" propKey="right" value={props.right} onChange={handlePropChange} />
                   </div>
                 )}
               </div>

               {/* 2. SIZE AND SPACING (Applies to all) */}
               <div className="border-b border-white/5 pb-6">
                 <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Grid size={14}/> Size & Spacing</h4>
                 <div className="grid grid-cols-2 gap-3">
                   <PropInput label="Width" propKey="width" value={props.width} onChange={handlePropChange} />
                   <PropInput label="Height" propKey="height" value={props.height} onChange={handlePropChange} />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <PropInput label="Margin (Outer)" propKey="margin" value={props.margin} onChange={handlePropChange} />
                   <PropInput label="Padding (Inner)" propKey="padding" value={props.padding} onChange={handlePropChange} />
                 </div>
                 {(selectedNode.type === 'Row' || selectedNode.type === 'Column' || selectedNode.type === 'Stack') && (
                   <div className="grid grid-cols-2 gap-3">
                      <PropInput label="Main Align" propKey="mainAxisAlignment" type="select" options={[{label:'Start', value:'start'},{label:'Center', value:'center'},{label:'End', value:'end'},{label:'Space Between', value:'spaceBetween'}]} value={props.mainAxisAlignment} onChange={handlePropChange} />
                      <PropInput label="Cross Align" propKey="crossAxisAlignment" type="select" options={[{label:'Start', value:'start'},{label:'Center', value:'center'},{label:'Stretch', value:'stretch'}]} value={props.crossAxisAlignment} onChange={handlePropChange} />
                   </div>
                 )}
                 {selectedNode.type === 'ListView' && (
                   <div className="grid grid-cols-2 gap-3">
                      <PropInput label="Scroll Direction" propKey="scrollDirection" type="select" options={[{label:'Vertical', value:'vertical'},{label:'Horizontal', value:'horizontal'}]} value={props.scrollDirection} onChange={handlePropChange} />
                      <PropInput label="Gap Between Items" propKey="gap" value={props.gap} onChange={handlePropChange} />
                   </div>
                 )}
               </div>

               {/* CUSTOM CODE SPECIFIC SETTINGS */}
               {selectedNode.type === 'CustomCode' && (
                 <div className="border-b border-white/5 pb-6">
                   <h4 className="text-[10px] font-bold text-emerald-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.TerminalSquare size={14}/> Raw Dart Integration</h4>
                   
                   <div className="flex flex-col gap-1.5 mb-4">
                     <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">pub.dev Dependencies (Optional)</label>
                     <input type="text" value={props.dependencies || ''} onChange={(e) => handlePropChange('dependencies', e.target.value)} placeholder="e.g., flutter_pdfview: ^1.2.0" className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-xs text-emerald-400 font-mono outline-none" />
                   </div>

                   <div className="flex flex-col gap-1.5">
                     <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Raw Dart Widget Code</label>
                     <textarea 
                       rows={8} 
                       value={props.rawDart || ''} 
                       onChange={(e) => handlePropChange('rawDart', e.target.value)} 
                       placeholder="Container(child: Text('Custom Code'))" 
                       className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-lg text-[10px] text-gray-300 font-mono outline-none focus:border-emerald-500 custom-scrollbar resize-y" 
                     />
                   </div>
                 </div>
               )}

               {/* 3. TYPOGRAPHY (Text Elements Only) */}
               {(selectedNode.type === 'Text' || selectedNode.type === 'Button' || selectedNode.type === 'TextInput') && (
                 <div className="border-b border-white/5 pb-6">
                   <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Type size={14}/> Typography</h4>
                   <PropInput label="Static Text Content" propKey={selectedNode.type === 'Text' ? 'content' : selectedNode.type === 'Button' ? 'label' : 'placeholder'} value={props[selectedNode.type === 'Text' ? 'content' : selectedNode.type === 'Button' ? 'label' : 'placeholder']} onChange={handlePropChange} />
                   <div className="grid grid-cols-2 gap-3 mb-3">
                      <PropInput label="Font Family" propKey="fontFamily" type="select" options={[{label:'Inter', value:'Inter'},{label:'Roboto', value:'Roboto'},{label:'Poppins', value:'Poppins'},{label:'Montserrat', value:'Montserrat'},{label:'Playfair', value:'Playfair Display'}, {label:'Monospace', value:'monospace'}]} value={props.fontFamily} onChange={handlePropChange} />
                      <PropInput label="Font Size" propKey="fontSize" value={props.fontSize} onChange={handlePropChange} />
                   </div>
                   <div className="grid grid-cols-2 gap-3 mb-3">
                      <PropInput label="Font Weight" propKey="fontWeight" type="select" options={[{label:'Normal', value:'normal'},{label:'Medium', value:'500'},{label:'Bold', value:'bold'},{label:'Light', value:'300'}]} value={props.fontWeight} onChange={handlePropChange} />
                      <PropInput label="Letter Spacing" propKey="letterSpacing" value={props.letterSpacing} onChange={handlePropChange} />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <PropInput label="Text Color" propKey="color" type="color" value={props.color} onChange={handlePropChange} />
                      {(selectedNode.type === 'Text' || selectedNode.type === 'TextInput') && (
                        <PropInput label="Alignment" propKey="textAlign" type="select" options={[{label:'Left', value:'left'},{label:'Center', value:'center'},{label:'Right', value:'right'},{label:'Justify', value:'justify'}]} value={props.textAlign} onChange={handlePropChange} />
                      )}
                   </div>
                 </div>
               )}

               {/* 4. APPEARANCE (Backgrounds, Opacity, Borders - Applies to all) */}
               <div className="border-b border-white/5 pb-6">
                 <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Layers size={14}/> Appearance</h4>
                 
                 <div className="grid grid-cols-2 gap-3 mb-3">
                    <PropInput label="Opacity (0 to 1)" propKey="opacity" type="text" value={props.opacity} onChange={handlePropChange} />
                    <PropInput label="Background Style" propKey="backgroundType" type="select" options={[{label:'Solid Color', value:'solid'},{label:'Linear Gradient', value:'gradient'}, {label: 'Theme Primary', value: 'theme.primary'}, {label: 'Theme Secondary', value: 'theme.secondary'}, {label: 'Transparent', value: 'transparent'}]} value={props.backgroundType} onChange={handlePropChange} />
                 </div>

                 {props.backgroundType === 'gradient' ? (
                   <div className="grid grid-cols-2 gap-3 p-3 bg-[#161b22] rounded-xl border border-white/5 mb-4">
                     <PropInput label="Start Color" propKey="gradientStart" type="color" value={props.gradientStart} onChange={handlePropChange} />
                     <PropInput label="End Color" propKey="gradientEnd" type="color" value={props.gradientEnd} onChange={handlePropChange} />
                   </div>
                 ) : (
                    <PropInput label="Background Color" propKey="backgroundColor" type="color" value={props.backgroundColor} onChange={handlePropChange} />
                 )}

                 <div className="mt-4 pt-4 border-t border-white/5">
                    <label className="text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest block">Border Radius (TL, TR, BL, BR)</label>
                    <div className="grid grid-cols-4 gap-2">
                       <input type="text" value={props.radiusTopLeft||'0'} onChange={e=>handlePropChange('radiusTopLeft', e.target.value)} className="w-full text-xs text-gray-200 bg-[#0E0F11] p-2 border border-white/10 rounded-lg outline-none text-center focus:border-blue-500 transition-colors shadow-inner" />
                       <input type="text" value={props.radiusTopRight||'0'} onChange={e=>handlePropChange('radiusTopRight', e.target.value)} className="w-full text-xs text-gray-200 bg-[#0E0F11] p-2 border border-white/10 rounded-lg outline-none text-center focus:border-blue-500 transition-colors shadow-inner" />
                       <input type="text" value={props.radiusBottomLeft||'0'} onChange={e=>handlePropChange('radiusBottomLeft', e.target.value)} className="w-full text-xs text-gray-200 bg-[#0E0F11] p-2 border border-white/10 rounded-lg outline-none text-center focus:border-blue-500 transition-colors shadow-inner" />
                       <input type="text" value={props.radiusBottomRight||'0'} onChange={e=>handlePropChange('radiusBottomRight', e.target.value)} className="w-full text-xs text-gray-200 bg-[#0E0F11] p-2 border border-white/10 rounded-lg outline-none text-center focus:border-blue-500 transition-colors shadow-inner" />
                    </div>
                 </div>

                 {/* NEW BORDER SECTION */}
                 <div className="mt-4 pt-4 border-t border-white/5">
                    <label className="text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest block">Borders & Strokes</label>
                    <div className="grid grid-cols-2 gap-3">
                       <PropInput label="Border Width (px)" propKey="borderWidth" value={props.borderWidth} onChange={handlePropChange} />
                       <PropInput label="Border Color" propKey="borderColor" type="color" value={props.borderColor} onChange={handlePropChange} />
                    </div>
                 </div>
               </div>

               {/* 5. SHADOWS (Applies to all) */}
               <div className="border-b border-white/5 pb-6">
                 <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.BoxSelect size={14}/> Shadows</h4>
                 <PropInput label="Shadow Color" propKey="shadowColor" type="color" value={props.shadowColor} onChange={handlePropChange} />
                 <div className="grid grid-cols-4 gap-2 mt-3">
                    <div><label className="text-[8px] text-gray-500 block text-center mb-1.5 tracking-widest uppercase">Off X</label><input type="number" value={props.shadowOffsetX||'0'} onChange={e=>handlePropChange('shadowOffsetX', e.target.value)} className="w-full text-xs text-gray-200 bg-[#0E0F11] p-2 border border-white/10 rounded-lg text-center focus:border-blue-500 transition-colors" /></div>
                    <div><label className="text-[8px] text-gray-500 block text-center mb-1.5 tracking-widest uppercase">Off Y</label><input type="number" value={props.shadowOffsetY||'0'} onChange={e=>handlePropChange('shadowOffsetY', e.target.value)} className="w-full text-xs text-gray-200 bg-[#0E0F11] p-2 border border-white/10 rounded-lg text-center focus:border-blue-500 transition-colors" /></div>
                    <div><label className="text-[8px] text-gray-500 block text-center mb-1.5 tracking-widest uppercase">Blur</label><input type="number" value={props.shadowBlur||'0'} onChange={e=>handlePropChange('shadowBlur', e.target.value)} className="w-full text-xs text-gray-200 bg-[#0E0F11] p-2 border border-white/10 rounded-lg text-center focus:border-blue-500 transition-colors" /></div>
                    <div><label className="text-[8px] text-gray-500 block text-center mb-1.5 tracking-widest uppercase">Spread</label><input type="number" value={props.shadowSpread||'0'} onChange={e=>handlePropChange('shadowSpread', e.target.value)} className="w-full text-xs text-gray-200 bg-[#0E0F11] p-2 border border-white/10 rounded-lg text-center focus:border-blue-500 transition-colors" /></div>
                 </div>
               </div>

               {/* 6. IMAGE SPECIFIC (Source and Fitting) */}
               {selectedNode.type === 'Image' && (
                 <div className="border-b border-white/5 pb-6">
                   <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Image size={14}/> Image Source</h4>
                   <PropInput label="Image URL" propKey="url" value={props.url} onChange={handlePropChange} />
                   <div className="mt-3">
                     <PropInput label="Object Fit" propKey="boxFit" type="select" options={[{label:'Cover (Fill Box)', value:'cover'},{label:'Contain (Show All)', value:'contain'},{label:'Fill (Stretch)', value:'fill'},{label:'Fit Width', value:'fitWidth'}]} value={props.boxFit} onChange={handlePropChange} />
                   </div>
                   <button onClick={() => { setShowAssetModal(true); fetchAssets(); }} className="w-full mt-2 py-3 bg-[#161b22] border border-white/10 text-gray-300 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors shadow-sm active:scale-95">
                     Browse Asset Library
                   </button>
                 </div>
               )}

               {/* ICON SPECIFIC */}
               {selectedNode.type === 'Icon' && (
                 <div className="border-b border-white/5 pb-6">
                   <h4 className="text-[10px] font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest">⭐ Icon Settings</h4>
                   <PropInput label="Icon Name (Lucide)" propKey="iconName" value={props.iconName} onChange={handlePropChange} />
                   <div className="grid grid-cols-2 gap-3">
                      <PropInput label="Icon Size" propKey="size" value={props.size} onChange={handlePropChange} />
                      <PropInput label="Icon Color" propKey="color" type="color" value={props.color} onChange={handlePropChange} />
                   </div>
                 </div>
               )}
             </div>
           )}

           {/* ============================================================ */}
           {/* TAB 2: ACTIONS & LOGIC                                       */}
           {/* ============================================================ */}
           {inspectorTab === 'actions' && (
             <div className="space-y-6 animate-in fade-in duration-200">
               <div className="bg-gradient-to-b from-purple-500/10 to-transparent p-5 rounded-2xl border border-purple-500/20 shadow-inner">
                 <h4 className="text-[10px] font-bold text-purple-400 mb-3 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Zap size={14}/> Action Blocks</h4>
                 <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">Chain multiple logic operations together when this element is tapped or interacted with.</p>
                 
                 <div className="bg-[#0E0F11] border border-white/10 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                          <LucideIcons.GitMerge size={14} className="text-purple-400" />
                       </div>
                       <div>
                         <div className="text-xs font-bold text-gray-200">Action Chain</div>
                         <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">{(props.actionChain || []).length} Steps Configured</div>
                       </div>
                    </div>
                 </div>

                 <button onClick={() => { setEditingLogicId(selectedNode.id); setIsLogicModalOpen(true); }} className="w-full py-3 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2">
                   Open Flow Editor <LucideIcons.ArrowRight size={14} />
                 </button>
               </div>
             </div>
           )}
           

           {/* ============================================================ */}
           {/* TAB 3: BACKEND & DATA QUERY                                  */}
           {/* ============================================================ */}
           {inspectorTab === 'backend' && (
             <div className="space-y-6 animate-in fade-in duration-200">
               {selectedNode.type === 'ListView' ? (
                <div className="bg-gradient-to-b from-emerald-500/10 to-transparent p-5 rounded-2xl border border-emerald-500/20 shadow-inner">
                  <h4 className="text-[10px] font-bold text-emerald-400 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Database size={14}/> Live API Query</h4>
                  <div className="flex flex-col gap-2 mb-4">
                     <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Live API Source</label>
                     <select
                       value={props.apiEndpointId || ''}
                       onChange={(e) => handlePropChange('apiEndpointId', e.target.value)}
                       className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#0E0F11] text-gray-200 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                     >
                       <option value="">None (static content)</option>
                       {(schema.apiEndpoints || []).map(ep => (
                         <option key={ep.id} value={ep.id}>{ep.name} — {ep.method} {ep.url.slice(0, 40)}</option>
                       ))}
                     </select>
                     {(schema.apiEndpoints || []).length === 0 && (
                        <div className="text-[9px] text-emerald-500/70 italic mt-1">No API endpoints saved yet. Go to the API tab in the left sidebar to add one.</div>
                     )}
                  </div>
                  <p className="text-[9px] text-gray-500 mb-4 leading-relaxed mt-[-8px]">If provided, this ListView will automatically fetch and loop through the JSON array response.</p>
                </div>
               ) : (selectedNode.type === 'Text' || selectedNode.type === 'Button' || selectedNode.type === 'TextInput' || selectedNode.type === 'Image') ? (
                 <div className="bg-gradient-to-b from-indigo-500/10 to-transparent p-5 rounded-2xl border border-indigo-500/20 shadow-inner">
                   <h4 className="text-[10px] font-bold text-indigo-400 mb-4 flex items-center gap-2 uppercase tracking-widest"><LucideIcons.Variable size={14}/> State Binding</h4>
                   
                   <div className="flex flex-col mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Link to Variable</label>
                        <button onClick={() => handlePropChange('isBound', !props.isBound)} className={`w-10 h-5 rounded-full relative transition-colors ${props.isBound ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                           <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${props.isBound ? 'left-[22px]' : 'left-[2px]'}`}></div>
                        </button>
                      </div>
                      
                      {props.isBound ? (
                        <select value={props.boundVariable || ''} onChange={(e) => handlePropChange('boundVariable', e.target.value)} className="w-full border border-indigo-500/30 p-3 rounded-lg text-xs bg-[#0E0F11] text-indigo-200 outline-none focus:border-indigo-500 transition-colors cursor-pointer shadow-inner">
                           <option value="">Select a State Variable...</option>
                           {schema.appState.map(s => <option key={s.key} value={s.key} className="bg-[#1A1B1E] text-gray-200">{s.key} (Default: {s.value})</option>)}
                        </select>
                      ) : (
                        <div className="text-[10px] text-gray-500 text-center py-4 border border-dashed border-white/10 rounded-lg">State binding is off. Content is static.</div>
                      )}
                   </div>
                 </div>
               ) : (
                 <div className="text-center text-[10px] text-gray-600 py-8 border border-dashed border-white/10 rounded-2xl bg-[#1A1B1E]">
                   This element type does not support backend queries or state binding.
                 </div>
               )}
             </div>
           )}

           {/* ============================================================ */}
           {/* TAB 4: ANIMATIONS (Massively Expanded)                       */}
           {/* ============================================================ */}
           {inspectorTab === 'animations' && (
             <div className="space-y-6 animate-in fade-in duration-200">
               <div className="border border-white/5 pb-6 bg-[#161b22] p-5 rounded-2xl shadow-sm">
                 <h4 className="text-[10px] font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest">✨ Entry Animations</h4>
                 <p className="text-[9px] text-gray-500 mb-4 leading-relaxed">Triggered when the screen first loads or on scroll.</p>
                 
                 <PropInput label="Animation Effect" propKey="animationType" type="select" options={[
                     {label:'None', value:'none'},
                     {label:'Fade In', value:'fade'},
                     {label:'Slide Up', value:'slideUp'},
                     {label:'Slide Down', value:'slideDown'},
                     {label:'Slide Left', value:'slideLeft'},
                     {label:'Slide Right', value:'slideRight'},
                     {label:'Scale Pop', value:'scale'},
                     {label:'Bounce', value:'bounce'},
                     {label:'Pulse (Looping)', value:'pulse'},
                     {label:'Flip 3D', value:'flip'},
                     {label:'Rotate Spin', value:'rotate'},
                     {label:'Wobble', value:'wobble'}
                 ]} value={props.animationType} onChange={handlePropChange} />
                 
                 {props.animationType && props.animationType !== 'none' && (
                   <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/5">
                     <PropInput label="Duration (s)" propKey="animationDuration" value={props.animationDuration} onChange={handlePropChange} />
                     <PropInput label="Delay (s)" propKey="animationDelay" value={props.animationDelay} onChange={handlePropChange} />
                   </div>
                 )}
               </div>
             </div>
           )}

         </div>
       </div>
     );
   };

  const LayerTree = ({ node, depth = 0 }) => {
    const isRoot = node.id && node.id.includes('root');
    const isSelected = node.id === selectedId || (isRoot && selectedId === null);
    const canHaveChildren = ['Container', 'Card', 'Padding', 'Center', 'Stack', 'Row', 'Column', 'ListView', 'GridView', 'Wrap', 'PageView', 'Carousel'].includes(node.type);

    return (
      <div className="w-full">
        <div 
          draggable={!isRoot}
          onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.setData("action", "move"); e.dataTransfer.setData("nodeId", node.id); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDropToNode(e, node.id); }}
          onClick={(e) => { e.stopPropagation(); setSelectedId(isRoot ? null : node.id); setRightTab('inspector'); setIsRightPanelOpen(true); }} 
          className={`group flex items-center justify-between py-2 px-3 cursor-pointer text-xs font-medium rounded-lg mb-1 transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`} style={{ paddingLeft: `${depth * 14 + 12}px` }}
        >
          <div className="flex items-center">
            <span className="mr-3 opacity-60">{node.children ? '🗂️' : '📄'}</span>
            {isRoot ? `📱 ${activePage?.name || 'Screen'}` : node.type}
          </div>
          
          {canHaveChildren && (
            <button 
              onClick={(e) => {
                 e.stopPropagation();
                 // Simulate a drop event to add a new Container inside this specific node
                 handleDropToNode({ dataTransfer: { getData: (k) => k === 'action' ? 'new' : 'Container' } }, node.id);
                 setIsCommandOpen(true); // Open palette to let them search/change it easily
              }} 
              className="opacity-0 group-hover:opacity-100 p-1 bg-white/10 rounded hover:bg-blue-500 transition-all"
              title="Add Child"
            >
              <Plus size={12} />
            </button>
          )}
        </div>
        {node.children && <div className="flex flex-col w-full">{node.children.map(child => <LayerTree key={child.id} node={child} depth={depth + 1} />)}</div>}
      </div>
    );
  };

  if (isAuthLoading) return <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-blue-500 font-mono tracking-widest text-sm gap-4"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>BOOTING_ENGINE...</div>;

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col overflow-hidden relative font-sans text-gray-200 selection:bg-blue-500/30">
      
      {/* COMMAND PALETTE */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center pt-[15vh]">
            <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} className="w-[600px] bg-[#161b22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-black/50">
              <div className="flex items-center px-5 py-4 border-b border-white/5 gap-4 bg-[#161b22]">
                <Search size={20} className="text-gray-500" />
                <input autoFocus placeholder="Type a command or search..." className="flex-1 bg-transparent border-none outline-none text-base text-gray-200 placeholder:text-gray-600" value={cmdSearch} onChange={e => setCmdSearch(e.target.value)} />
                <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-500 font-mono">ESC</kbd>
              </div>
              <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Actions</div>
                {[
                  { label: "Insert Button", icon: <Plus size={16}/>, action: () => { handleDropToNode({dataTransfer:{getData:(k)=>k==='action'?'new':'Button'}}, activePage.root.id); setIsCommandOpen(false); } },
                  { label: "Insert Container", icon: <Plus size={16}/>, action: () => { handleDropToNode({dataTransfer:{getData:(k)=>k==='action'?'new':'Container'}}, activePage.root.id); setIsCommandOpen(false); } },
                  { label: "Toggle Grid", icon: <Grid size={16}/>, action: () => { setShowGrid(!showGrid); setIsCommandOpen(false); } },
                  { label: "Save Project", icon: <Save size={16}/>, action: () => { handleSaveProject(); setIsCommandOpen(false); } },
                  { label: "New Screen", icon: <Zap size={16}/>, action: () => { handleOpenAddPage(); setIsCommandOpen(false); } }
                ].filter(i => i.label.toLowerCase().includes(cmdSearch.toLowerCase())).map((item, idx) => (
                  <div key={idx} onClick={item.action} className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-blue-600 group cursor-pointer transition-colors mx-1">
                    <span className="text-gray-500 group-hover:text-white transition-colors">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}


          {/* SQL DEPLOYMENT MODAL */}
        {showSqlModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[250] bg-black/90 backdrop-blur-md flex items-center justify-center p-10">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-4xl bg-[#0E0F11] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.15)] flex flex-col overflow-hidden h-[80vh]">
              
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#161b22]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                    <LucideIcons.DatabaseZap size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">Supabase Database Sync</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Execute this SQL in your Supabase SQL Editor</p>
                  </div>
                </div>
                <button onClick={() => setShowSqlModal(false)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg"><LucideIcons.X size={18}/></button>
              </div>

              <div className="flex-1 flex flex-col p-6 bg-[#050505]">
                <div className="flex justify-between items-center mb-2 px-1">
                   <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">schema.sql</span>
                   <button onClick={() => { 
                       import('../../utils/sqlGenerator').then(mod => {
                           navigator.clipboard.writeText(mod.generateSupabaseSQL(schema.appConfig.dbTables));
                           alert("SQL Copied to Clipboard!");
                       });
                   }} className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                       <LucideIcons.Copy size={14} /> Copy to Clipboard
                   </button>
                </div>
                
                <div className="flex-1 border border-white/10 rounded-xl bg-[#1A1B1E] overflow-auto custom-scrollbar p-4 relative">
                   <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                        {schema.appConfig?.dbTables?.length > 0 ? generateSupabaseSQL(schema.appConfig.dbTables) : '-- No tables defined'}
                    </pre>
                </div>
                
                <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center shrink-0">
                        <LucideIcons.Info size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">How to Sync</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">To magically link your AppForge frontend to your backend, copy the SQL above, open your <a href="https://supabase.com/dashboard/project/_/sql" target="_blank" className="text-indigo-400 hover:underline">Supabase SQL Editor</a>, and run it. Your tables, columns, and security policies will be created instantly.</p>
                    </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}



          {/* ACTION FLOW EDITOR MODAL (RESTORED) */}
        {isLogicModalOpen && editingLogicId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-4xl h-[85vh] bg-[#0E0F11] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-x-auto overflow-y-hidden custom-scrollbar relative shadow-purple-500/10">
              
              <div className="h-16 min-w-[600px] bg-[#161b22] border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <LucideIcons.Zap size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide">Action Flow Editor</h2>
                  </div>
                </div>
                <button onClick={() => { setIsLogicModalOpen(false); setEditingLogicId(null); }} className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">Done</button>
              </div>

              <div className="flex-1 min-w-[600px] overflow-y-auto custom-scrollbar p-4 md:p-10 flex flex-col items-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ backgroundBlendMode: 'overlay', backgroundColor: '#050505' }}>
                 
                 <div className="w-80 bg-[#161b22] border border-white/10 rounded-2xl p-4 shadow-lg flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                       <LucideIcons.MousePointerClick size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Trigger</div>
                      <div className="text-sm font-bold text-white">On Tap</div>
                    </div>
                 </div>

                 {(() => {
                    const activeNode = findNode(activePage?.root, editingLogicId);
                    const chain = activeNode?.props?.actionChain || [];
                    
                    return chain.map((action, idx) => (
                      <div key={action.id} className="flex flex-col items-center w-full">
                         <div className="w-0.5 h-10 bg-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                         <div className="w-[450px] bg-[#1A1B1E] border border-purple-500/30 rounded-2xl p-5 shadow-xl relative group hover:border-purple-500/80 transition-colors">
                            <button onClick={() => {
                               const newChain = [...chain];
                               newChain.splice(idx, 1);
                               handlePropChange('actionChain', newChain);
                            }} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><LucideIcons.Trash size={14}/></button>

                            <div className="flex items-center gap-3 mb-4">
                              <span className="w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/30">{idx + 1}</span>
                              <select 
                                value={action.type} 
                                onChange={(e) => {
                                   const newChain = [...chain];
                                   newChain[idx].type = e.target.value;
                                   handlePropChange('actionChain', newChain);
                                }} 
                                className="bg-[#0E0F11] border border-white/10 rounded-lg p-2 text-xs font-bold text-white outline-none focus:border-purple-500 transition-colors cursor-pointer"
                              >
                                <option value="navigate">Navigate to Page</option>
                                <option value="toast">Show Toast Notification</option>
                                <option value="api">Trigger API (GET/POST)</option>
                                <option value="state">Update State Variable</option>
                                <option value="supabase">Supabase Database Insert</option>
                              </select>
                            </div>

                            <div className="bg-[#0E0F11] rounded-xl p-4 border border-white/5 space-y-3">
                              
                              {action.type === 'navigate' && (
                                <>
                                  <div className="flex flex-col gap-1.5"><label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Target Page</label>
                                    <select value={action.target} onChange={(e) => { const n=[...chain]; n[idx].target=e.target.value; handlePropChange('actionChain', n); }} className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-xs text-white outline-none">
                                      <option value="">Select...</option>{schema.pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                  </div>
                                </>
                              )}

                              {action.type === 'toast' && (
                                <div className="flex flex-col gap-1.5"><label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Message</label>
                                  <input type="text" value={action.message || ''} placeholder="Successfully saved!" onChange={(e) => { const n=[...chain]; n[idx].message=e.target.value; handlePropChange('actionChain', n); }} className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-xs text-white outline-none" />
                                </div>
                              )}

                              {action.type === 'api' && (
                                <>
                                  <div className="flex flex-col gap-1.5"><label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Endpoint URL</label>
                                    <input type="text" value={action.url || ''} placeholder="https://api.com/v1/trigger" onChange={(e) => { const n=[...chain]; n[idx].url=e.target.value; handlePropChange('actionChain', n); }} className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-xs text-white outline-none font-mono" />
                                  </div>
                                  <div className="flex-1 flex flex-col gap-1.5"><label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Method</label><select value={action.method} onChange={(e) => { const n=[...chain]; n[idx].method=e.target.value; handlePropChange('actionChain', n); }} className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-xs text-white outline-none"><option value="GET">GET</option><option value="POST">POST</option></select></div>
                                </>
                              )}
                              
                              {/* FIXED SUPABASE AND STATE UI */}
                              {action.type === 'supabase' && (
                                <>
                                  <div className="flex flex-col gap-1.5"><label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Target Table</label>
                                    <select value={action.table || action.dbTable || ''} onChange={(e) => { const n=[...chain]; n[idx].table=e.target.value; handlePropChange('actionChain', n); }} className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-xs text-white outline-none">
                                      <option value="">Select table...</option>{(schema.appConfig?.dbTables || []).map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-1.5"><label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Payload (JSON or AppState)</label>
                                    <textarea rows={3} value={action.payload || action.dbPayload || ''} placeholder={'{"title": AppState.instance.title, "user_id": userId}'} onChange={(e) => { const n=[...chain]; n[idx].payload=e.target.value; handlePropChange('actionChain', n); }} className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-[10px] text-emerald-300 outline-none font-mono resize-none" />
                                  </div>
                                </>
                              )}

                              {action.type === 'state' && (
                                <>
                                  <div className="flex flex-col gap-1.5"><label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Variable</label>
                                    <select value={action.variable || ''} onChange={(e) => { const n=[...chain]; n[idx].variable=e.target.value; handlePropChange('actionChain', n); }} className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-xs text-white outline-none">
                                      <option value="">Select variable...</option>{(schema.appState || []).map(s => <option key={s.key} value={s.key}>{s.key} ({s.type})</option>)}
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-1.5"><label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">New Value</label>
                                    <input type="text" value={action.value || ''} placeholder="Enter value..." onChange={(e) => { const n=[...chain]; n[idx].value=e.target.value; handlePropChange('actionChain', n); }} className="w-full bg-[#161b22] border border-white/10 p-2 rounded text-xs text-white outline-none" />
                                  </div>
                                </>
                              )}

                            </div>
                         </div>
                      </div>
                    ));
                 })()}

                 <div className="flex flex-col items-center w-full mt-2">
                    <div className="w-0.5 h-8 bg-white/10 border-l border-dashed border-gray-600"></div>
                    <button onClick={() => {
                       const activeNode = findNode(activePage?.root, editingLogicId);
                       const newChain = [...(activeNode.props.actionChain || []), { id: `act_${Date.now()}`, type: 'navigate' }];
                       handlePropChange('actionChain', newChain);
                    }} className="w-48 py-3 bg-[#161b22] border border-white/10 rounded-2xl text-xs font-bold text-gray-400 hover:text-white hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all flex items-center justify-center gap-2">
                       <LucideIcons.Plus size={14} /> Add Action Step
                    </button>
                 </div>
                 <div className="h-20 w-full shrink-0"></div>
              </div>
            </motion.div>
          </motion.div>
        )}

          {/* FULL SCREEN LIVE PREVIEW */}
        {showLivePreview && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 z-[300] bg-[#0a0a0a] flex flex-col font-sans">
            
            {/* Topbar */}
            <div className="h-16 bg-[#161b22] border-b border-white/5 flex justify-between items-center px-6 shrink-0 shadow-md">
              <div className="flex items-center gap-6">
                <button onClick={() => setShowLivePreview(false)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl">
                  <LucideIcons.ChevronLeft size={16} />
                  <span className="font-bold text-xs tracking-wide">Back to Builder</span>
                </button>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live Interactive Mode</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Device Switcher */}
                <div className="flex bg-[#0a0a0a] rounded-xl p-1 border border-white/5 shadow-inner">
                  <button onClick={() => setPreviewMode('iphone')} className={`p-2 rounded-lg transition-all ${previewMode === 'iphone' ? 'bg-[#1A1B1E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}><LucideIcons.Smartphone size={16}/></button>
                  <button onClick={() => setPreviewMode('tablet')} className={`p-2 rounded-lg transition-all ${previewMode === 'tablet' ? 'bg-[#1A1B1E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}><LucideIcons.Tablet size={16}/></button>
                </div>

                {/* Page Selector */}
                <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-1.5 shadow-inner">
                  <LucideIcons.Layout size={14} className="text-gray-500" />
                  <select 
                    value={previewActivePageId} 
                    onChange={(e) => setPreviewActivePageId(e.target.value)}
                    className="bg-transparent text-xs text-gray-200 outline-none cursor-pointer font-bold w-32"
                  >
                    {schema.pages.map(p => <option key={p.id} value={p.id} className="bg-[#1A1B1E]">{p.name}</option>)}
                  </select>
                </div>

                <button className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 text-[11px] font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
                  <LucideIcons.Share size={12} /> Share
                </button>
              </div>
            </div>
            
            {/* Playable Canvas Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start bg-[#050505] py-16 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ backgroundBlendMode: 'overlay' }}>
               
               <div className="mb-8 shrink-0 flex items-center gap-3 bg-[#161b22] px-5 py-2.5 rounded-full border border-white/5 shadow-xl">
                 <LucideIcons.Info size={14} className="text-gray-500" />
                 <span className="text-[10px] text-gray-400 tracking-wide">Buttons with <b>Action Chains</b> will trigger real navigation events in this mode.</span>
               </div>
               
               <ErrorBoundary>
                 <Canvas 
                   schema={schema} 
                   rootNode={schema.pages.find(p => p.id === previewActivePageId)?.root || schema.pages[0].root} 
                   selectedId={null} 
                   onSelect={() => {}} onDropToNode={() => {}} onResize={() => {}} onDragNodeStart={() => {}} 
                   previewMode={previewMode} 
                   showGrid={false} 
                   isLivePreview={true}
                   onNavigate={(targetId) => setPreviewActivePageId(targetId)}
                 />
               </ErrorBoundary>
            </div>
          </motion.div>
        )}

{/* EXTERNAL APPFORGE DASHBOARD COMPONENT */}
        {/* EXTERNAL APPFORGE DASHBOARD COMPONENT */}
        {showDashboard && (
          <AppForgeDashboard
            schema={schema}
            apkUrl={apkUrl}
            isBuilding={isBuilding}
            buildLogs={buildLogs}
            setBuildLogs={setBuildLogs}
            onClose={() => setShowDashboard(false)}
            onSetSchema={setSchema}
            onTriggerBuild={handleDeploy} // <--- THIS IS THE ONLY LINE YOU NEED TO CHANGE!
          />
        )}

        {/* AI AUDITOR MODAL */}
        {showAiAuditor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-10">
<motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-5xl bg-[#0E0F11] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden h-[85vh]">              
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#161b22] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                    <LucideIcons.Bot size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">AI Infrastructure Auditor</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Powered by Gemini 2.5 Pro</p>
                  </div>
                </div>
                <button onClick={() => setShowAiAuditor(false)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg"><LucideIcons.X size={18}/></button>
              </div>

              <div className="flex-1 p-6 bg-[#050505] overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ backgroundBlendMode: 'overlay' }}>
                
                {aiAuditLogs.map((log, idx) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`p-4 rounded-2xl border ${log.role === 'ai' ? 'bg-purple-900/20 border-purple-500/30 text-purple-100' : log.role === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-[#1A1B1E] border-white/5 text-gray-400 font-mono text-xs'}`}>
                    {log.role === 'ai' && <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2"><LucideIcons.Sparkles size={12}/> Analysis Result</div>}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{log.text}</div>
                  </motion.div>
                ))}

                {isAiAuditing && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#1A1B1E] border border-white/5 w-fit">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400 font-mono">Gemini is processing...</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/5 bg-[#161b22] flex justify-end shrink-0">
                 <button onClick={handleRunAiAudit} disabled={isAiAuditing} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:bg-purple-500 disabled:opacity-50 transition-colors flex items-center gap-2">
                    <LucideIcons.RefreshCw size={14} className={isAiAuditing ? "animate-spin" : ""} /> Run Fresh Audit
                 </button>
              </div>

            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

{/* DEPLOYMENT TARGET MODAL */}
      {pendingInjection && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-10">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md bg-[#0E0F11] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.15)] flex flex-col overflow-hidden">
            
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#161b22]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <LucideIcons.Download size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">Deploy Template</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Select Destination</p>
                </div>
              </div>
              <button onClick={() => setPendingInjection(null)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg"><LucideIcons.X size={18}/></button>
            </div>

            <div className="p-6 bg-[#050505] flex flex-col gap-5">
              <p className="text-xs text-gray-400 leading-relaxed">Where would you like to place this template?</p>

              {/* Radio Selection */}
              <div className="flex flex-col gap-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${injectionTarget === 'current' ? 'bg-blue-600/10 border-blue-500/50' : 'bg-[#1A1B1E] border-white/5 hover:border-white/20'}`}>
                  <input type="radio" name="deployTarget" checked={injectionTarget === 'current'} onChange={() => setInjectionTarget('current')} className="accent-blue-500" />
                  <div>
                    <div className="text-sm font-bold text-gray-200">Current Active Screen</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Append to the bottom of the current view</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${injectionTarget === 'new' ? 'bg-blue-600/10 border-blue-500/50' : 'bg-[#1A1B1E] border-white/5 hover:border-white/20'}`}>
                  <input type="radio" name="deployTarget" checked={injectionTarget === 'new'} onChange={() => setInjectionTarget('new')} className="accent-blue-500" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-200">Create a New Screen</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Deploy this into a brand new, empty page</div>
                  </div>
                </label>

                {/* If 'new' is selected, show the name input */}
                {injectionTarget === 'new' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1">
                    <input 
                      autoFocus
                      type="text" 
                      value={injectionNewPageName} 
                      onChange={(e) => setInjectionNewPageName(e.target.value)} 
                      placeholder="e.g. My New Dashboard" 
                      className="w-full bg-[#161b22] border border-blue-500/30 p-3.5 rounded-xl text-xs text-white outline-none focus:border-blue-500 transition-colors shadow-inner"
                    />
                  </motion.div>
                )}

                <label className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-all ${injectionTarget !== 'current' && injectionTarget !== 'new' ? 'bg-blue-600/10 border-blue-500/50' : 'bg-[#1A1B1E] border-white/5 hover:border-white/20'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="deployTarget" checked={injectionTarget !== 'current' && injectionTarget !== 'new'} onChange={() => setInjectionTarget(schema.pages[0].id)} className="accent-blue-500" />
                    <div>
                      <div className="text-sm font-bold text-gray-200">Existing Screen...</div>
                    </div>
                  </div>
                  {(injectionTarget !== 'current' && injectionTarget !== 'new') && (
                    <select value={injectionTarget} onChange={(e) => setInjectionTarget(e.target.value)} className="mt-2 w-full bg-[#161b22] border border-blue-500/30 p-3 rounded-lg text-xs text-gray-200 outline-none cursor-pointer">
                      {schema.pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  )}
                </label>
              </div>

            </div>

            <div className="p-5 border-t border-white/5 bg-[#161b22] flex justify-end gap-3 shrink-0">
              <button onClick={() => setPendingInjection(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={handleExecuteInjection} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-colors flex items-center gap-2">
                <LucideIcons.ArrowRight size={14}/> Deploy Template
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ADD PAGE MODAL */}
        {isAddPageModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-10">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-3xl bg-[#0E0F11] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden shadow-blue-500/10">
              
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#161b22]">
                <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-3">
                   <div className="p-2 bg-blue-600/20 rounded-lg"><LucideIcons.LayoutTemplate size={20} className="text-blue-400"/></div> Create New Screen
                </h2>
                <button onClick={() => setIsAddPageModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-colors"><LucideIcons.X size={18}/></button>
              </div>
              
              <div className="p-8 flex flex-col gap-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ backgroundBlendMode: 'overlay', backgroundColor: '#050505' }}>
                 <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Screen Name</label>
                   <input autoFocus type="text" value={newPageName} onChange={(e) => setNewPageName(e.target.value)} placeholder="e.g. Shopping Cart, User Profile" className="w-full bg-[#1A1B1E] border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition-colors shadow-inner" />
                 </div>
                 
                 <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Starting Template</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] md:max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                     {[
                       { id: 'blank', icon: 'File', name: 'Blank Canvas', desc: 'Start from scratch' },
                       { id: 'appbar', icon: 'PanelTop', name: 'With App Bar', desc: 'Standard header navigation' },
                       { id: 'shop', icon: 'ShoppingBag', name: 'Storefront', desc: 'Search & product grid' },
                       { id: 'store', icon: 'Store', label: 'Store', onClick: () => window.open('/store', '_blank') },
                       { id: 'cart', icon: 'ShoppingCart', name: 'Shopping Cart', desc: 'List & secure checkout' },
                       { id: 'signup', icon: 'UserPlus', name: 'Authentication', desc: 'Login & signup forms' },
                       { id: 'about', icon: 'Info', name: 'About Us', desc: 'Hero image & text block' }
                     ].map(tpl => {
                        const IconComponent = LucideIcons[tpl.icon] || LucideIcons.File;
                        return (
                          <div key={tpl.id} onClick={() => setNewPageTemplate(tpl.id)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3 relative ${newPageTemplate === tpl.id ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/5 bg-[#161b22] hover:border-white/20'}`}>
                             {newPageTemplate === tpl.id && <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shadow-sm"><LucideIcons.Check size={10} className="text-white"/></div>}
                             <div className={`p-3 rounded-xl w-fit ${newPageTemplate === tpl.id ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1A1B1E] text-gray-400'}`}>
                                <IconComponent size={24} />
                             </div>
                             <div>
                               <span className="text-sm font-bold text-gray-200 block mb-1">{tpl.name}</span>
                               <span className="text-[10px] text-gray-500 leading-tight">{tpl.desc}</span>
                             </div>
                          </div>
                        )
                     })}
                   </div>
                 </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-[#161b22] flex justify-end gap-3 shrink-0">
                 <button onClick={() => setIsAddPageModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                 <button onClick={handleCreatePage} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-colors flex items-center gap-2">
                    <LucideIcons.Wand2 size={14}/> Generate Page
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      {/* AUTH OVERLAY */}
      {!user && (
        <div className="absolute inset-0 z-[100] bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#161b22] border border-white/5 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col items-center mx-auto">
            <div className="w-12 h-12 bg-blue-600 rounded-xl mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center">
               <Zap size={20} fill="white" className="text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">AppForge</h2>
            <p className="text-sm text-gray-500 mb-8">Log in to your workspace</p>
            <input type="email" placeholder="Email address" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full bg-[#0E0F11] border border-white/10 p-3.5 rounded-xl mb-3 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors" />
            <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-[#0E0F11] border border-white/10 p-3.5 rounded-xl mb-6 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors" />
            <button onClick={handleLogin} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 mb-4 transition-all shadow-lg">Log In</button>
            <button onClick={handleSignUp} className="w-full bg-white/5 text-gray-300 font-bold py-3.5 rounded-xl hover:bg-white/10 hover:text-white transition-all">Create Account</button>
          </motion.div>
        </div>
      )}

      {/* ASSET MANAGER MODAL */}
      {showAssetModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#161b22] border border-white/10 rounded-3xl shadow-2xl w-[600px] h-[500px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#161b22]">
              <h3 className="font-bold text-gray-200 tracking-wide">Asset Library</h3>
              <button onClick={() => setShowAssetModal(false)} className="text-gray-500 hover:text-red-500 transition-colors">✕</button>
            </div>
            <div className="p-5 border-b border-white/5 bg-[#0E0F11]">
              <input type="file" accept="image/*" onChange={handleAssetUpload} className="hidden" id="asset-upload" />
              <label htmlFor="asset-upload" className="w-full flex justify-center items-center py-10 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 text-blue-400 font-bold cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all">
                {isUploadingAsset ? "Uploading..." : "+ Upload New Image"}
              </label>
            </div>
            <div className="flex-1 p-5 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
              {assets.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-sm">No assets uploaded yet.</div>
              ) : (
                <div className="grid grid-cols-3 gap-5">
                  {assets.map((url, idx) => (
                    <div key={idx} onClick={() => selectAsset(url)} className="aspect-square bg-[#161b22] rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group relative">
                      <img src={url} alt="asset" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm tracking-wide">Select</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOP NAVBAR */}
      <div className="h-14 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-20 overflow-x-auto hide-scrollbar gap-8">
        
        {/* Left Side: Logo & Command */}
        <div className="flex items-center gap-6 shrink-0 min-w-max">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
               <Zap size={14} fill="white" className="text-white"/>
            </div> 
            <span className="text-white font-black tracking-tighter text-lg uppercase italic">AppForge</span>
          </div>
          <button onClick={() => setIsCommandOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161b22] border border-white/5 text-[10px] text-gray-500 hover:text-gray-300 transition-colors hidden md:flex">
             <Search size={12} /> Quick Actions <kbd className="bg-[#0E0F11] border border-white/10 px-1 py-0.5 rounded ml-2 font-mono text-[9px]">⌘K</kbd>
          </button>
        </div>
        
        {/* Right Side: Tools & Actions */}
        <div className="flex items-center gap-2 shrink-0 min-w-max pr-4">
          <button onClick={() => setShowGrid(!showGrid)} className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-all ${showGrid ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-transparent text-gray-500 hover:bg-white/5 hover:text-white border border-transparent'}`}>
             <Grid size={12}/> Grid
          </button>
          
          <div className="w-px h-4 bg-white/10 mx-0.5"></div>
          
          <button onClick={handleUndo} disabled={historyIndex === 0} className={`p-1.5 rounded-lg transition-colors ${historyIndex === 0 ? 'text-gray-700' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}><LucideIcons.Undo2 size={14}/></button>
          <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className={`p-1.5 rounded-lg transition-colors ${historyIndex === history.length - 1 ? 'text-gray-700' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}><LucideIcons.Redo2 size={14}/></button>
          
          <div className="w-px h-4 bg-white/10 mx-0.5"></div>
          
          {user && <button onClick={handleLogout} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">Sign Out</button>}
          
          <button onClick={handleSaveProject} className={`px-4 py-1.5 text-[10px] font-bold rounded-xl border transition-all flex items-center gap-1.5 ${isSaved ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-[#161b22] text-white border-white/5 hover:bg-white/10'}`}>
            <Save size={12} /> {isSaved ? 'Saved' : 'Save'}
          </button>
          
          {/* Client Hand-off Toggle */}
          <button onClick={() => setWorkspaceRole(workspaceRole === 'admin' ? 'client' : 'admin')} className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all border flex items-center gap-1.5 ${workspaceRole === 'client' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-[#161b22] text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}>
            {workspaceRole === 'client' ? <><LucideIcons.Eye size={12}/> Client View</> : <><LucideIcons.Users size={12}/> View as Client</>}
          </button>

          <button onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all flex items-center gap-1.5 ${isRightPanelOpen ? 'bg-white text-black' : 'bg-[#161b22] text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'}`}>
            <LucideIcons.PanelRight size={12} /> Inspector
          </button>


          <button onClick={() => setShowDashboard(true)} className="px-3 py-1.5 bg-[#161b22] text-gray-300 border border-white/5 text-[10px] font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-1.5">
            <LucideIcons.LayoutDashboard size={12} /> Dashboard
          </button>

          {/* AI Audit Button */}
          <button onClick={() => { setShowAiAuditor(true); handleRunAiAudit(); }} className="px-3 py-1.5 bg-purple-600/10 text-purple-400 border border-purple-600/20 text-[10px] font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5">
            <LucideIcons.Sparkles size={12} /> AI Audit
          </button>

          <button onClick={() => { setPreviewActivePageId(currentPageId); setShowLivePreview(true); }} className="px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[10px] font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1.5">
            <LucideIcons.Eye size={12} /> Preview
          </button>

          <button onClick={handleDeploy} disabled={isBuilding} className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center gap-1.5 ml-1">
            {isBuilding ? 'Building...' : <><LucideIcons.Rocket size={12} fill="white"/> Deploy</>}
          </button>
        </div>
      </div>

           {workspaceRole === 'client' ? (
        
              /* Render the safe Client CMS if in Client Mode */
              <ClientDashboard schema={schema} />
              
            ) : (
              
              /* Render the complex AppForge Builder if in Admin Mode */
              <div className="flex-1 flex overflow-x-auto overflow-y-hidden custom-scrollbar relative">
              
        {/* LEFT SIDEBAR */}
        {/* NEW: VERTICAL ICON RAIL */}
        <div className="w-[72px] bg-[#050505] border-r border-white/5 flex flex-col items-center py-4 gap-2 z-20 shrink-0 shadow-2xl">
           {[
             { id: 'pages', icon: 'Layout', label: 'Pages' },
             { id: 'elements', icon: 'PlusSquare', label: 'Add' },
             { id: 'templates', icon: 'Wand2', label: 'Magic' },
             { id: 'layers', icon: 'Layers', label: 'Tree' },
             { id: 'data', icon: 'Database', label: 'Data' },
             { id: 'api', icon: 'Globe', label: 'API' },
             { id: 'media', icon: 'Image', label: 'Media' }
           ].map(tab => {
             const IconComp = LucideIcons[tab.icon] || LucideIcons.Circle;
             const isActive = activeTab === tab.id;
             return (
               <button 
                 key={tab.id} 
                 onClick={() => { setActiveTab(tab.id); if(tab.id === 'media' && typeof fetchAssets === 'function') fetchAssets(); }} 
                 className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all group ${isActive ? 'bg-blue-600/10 text-blue-400' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                 title={tab.label}
               >
                 <IconComp size={22} strokeWidth={isActive ? 2.5 : 2} className={`mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : ''}`} />
                 <span className={`text-[8px] font-bold tracking-widest uppercase transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>{tab.label}</span>
                 
                 {/* Active Indicator Line */}
                 {isActive && <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
               </button>
             );
           })}
        </div>

        {/* LEFT SIDEBAR CONTENT PANEL */}
        <div className="w-[280px] bg-[#0d0d0d] border-r border-white/10 flex flex-col overflow-hidden z-10 shrink-0 shadow-xl">
          
          {/* Dynamic Header */}
          <div className="h-[64px] flex items-center px-5 border-b border-white/5 bg-[#0E0F11] shrink-0">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2">
               {activeTab === 'templates' ? '✨ Magic Templates' : activeTab}
             </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-[#161b22]">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">
              
             {activeTab === 'media' && (
                <div className="flex-1 flex flex-col gap-6 pb-10 h-full">
                  <div className="bg-[#0E0F11] border border-white/5 p-5 rounded-3xl shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-center mb-5 shrink-0">
                      <h3 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">🖼️ Cloud Assets</h3>
                      <label className="bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[9px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-pink-500/20 transition-colors cursor-pointer">
                         + Upload
                         <input type="file" accept="image/*" onChange={handleAssetUpload} className="hidden" />
                      </label>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-5 leading-relaxed shrink-0">Manage global assets stored in your Supabase bucket.</p>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      {isUploadingAsset && <div className="text-center text-[10px] text-pink-400 py-4 animate-pulse">Uploading to cloud...</div>}
                      {assets.length === 0 && !isUploadingAsset ? (
                        <div className="text-center text-[10px] text-gray-600 py-8 border border-dashed border-white/10 rounded-2xl bg-[#1A1B1E]">No media uploaded yet.</div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {assets.map((url, idx) => (
                            <div key={idx} className="bg-[#1A1B1E] border border-white/5 rounded-xl overflow-hidden group relative aspect-square">
                              <img src={url} alt="Cloud Asset" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                 <button onClick={() => { navigator.clipboard.writeText(url); alert('URL Copied!'); }} className="p-2 bg-white/10 hover:bg-blue-500 rounded-lg text-white transition-colors" title="Copy URL"><LucideIcons.Copy size={14}/></button>
                                 <button onClick={async () => { 
                                    const urlParts = url.split('/apk-builds/');
                                    if (urlParts.length < 2) return;
                                    const filePath = urlParts[1];
                                    const { error } = await supabase.storage.from('apk-builds').remove([filePath]);
                                    if (!error) setAssets(prev => prev.filter(a => a !== url));
                                    else alert('Delete failed: ' + error.message);
                                 }} className="p-2 bg-white/10 hover:bg-red-500 rounded-lg text-white transition-colors" title="Delete"><LucideIcons.Trash size={14}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pages' && (
                <div className="bg-[#0E0F11] p-5 border border-white/5 rounded-2xl shadow-sm">
                   <div className="flex justify-between items-center mb-5">
                     <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">App Screens</h3>
                     <button onClick={handleOpenAddPage} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/20 font-bold transition-colors">+ New</button>
                   </div>
                   <div className="space-y-2">
                     {schema.pages.map(p => (
                       <div 
                         key={p.id} 
                         onClick={() => { setCurrentPageId(p.id); setSelectedId(null); }} 
                         className={`group flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${currentPageId === p.id ? 'border-blue-500/50 bg-blue-500/10 shadow-sm text-white' : 'border-white/5 bg-[#1A1B1E] text-gray-400 hover:border-white/20 hover:text-gray-200'}`}
                       >
                         <div className="flex items-center gap-3">
                           <LucideIcons.Smartphone size={14} className={currentPageId === p.id ? "text-blue-400" : "text-gray-500"} />
                           <h4 className="text-xs font-medium tracking-wide">{p.name}</h4>
                         </div>
                         
                         <button 
                           onClick={(e) => handleDeletePage(e, p.id)}
                           className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                           title="Delete Screen"
                         >
                           <LucideIcons.Trash size={14} />
                         </button>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {activeTab === 'elements' && (
                <div className="flex flex-col h-full overflow-hidden">
                  
                  {/* Sticky Search Bar */}
                  <div className="px-1 mb-5 shrink-0">
                    <div className="bg-[#0E0F11] border border-white/10 rounded-xl flex items-center px-3 py-2.5 focus-within:border-blue-500 transition-colors shadow-inner">
                      <Search size={14} className="text-gray-500 mr-2 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Search widgets..." 
                        value={elementSearch}
                        onChange={(e) => setElementSearch(e.target.value)}
                        className="bg-transparent border-none text-xs text-white outline-none w-full placeholder:text-gray-600"
                      />
                      {elementSearch && (
                        <button onClick={() => setElementSearch('')} className="text-gray-500 hover:text-white transition-colors">
                          <X size={14}/>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-6 pb-10">
                    {WIDGET_CATEGORIES.map((category, catIdx) => {
                       // Filter elements dynamically based on user search
                       const filteredItems = category.items.filter(item => 
                         item.type.toLowerCase().includes(elementSearch.toLowerCase())
                       );
                       
                       // Hide category entirely if no widgets match the search
                       if (filteredItems.length === 0) return null;

                       return (
                         <div key={catIdx} className="animate-in fade-in duration-200">
                           <h3 className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest px-1 flex items-center gap-2">
                             {category.name}
                           </h3>
                           {/* 3-Column Grid matching FlutterFlow style */}
                           <div className="grid grid-cols-3 gap-2.5">
                             {filteredItems.map(item => {
                               const IconComp = LucideIcons[item.icon] || LucideIcons.Box;
                               return (
                                 <div 
                                   key={item.type} 
                                   draggable 
                                   onDragStart={(e) => handleDragStart(e, item.type)} 
                                   className="flex flex-col items-center justify-center gap-2 p-3 aspect-square bg-[#0E0F11] border border-white/5 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:bg-[#161b22] hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all group"
                                 >
                                   <IconComp size={20} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                                   <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-200 text-center tracking-wide leading-tight">
                                     {item.type}
                                   </span>
                                 </div>
                               );
                             })}
                           </div>
                         </div>
                       );
                    })}

                    {/* Saved Custom Components */}
                    {schema.components && schema.components.length > 0 && (
                      <div className="border-t border-white/5 pt-6 mt-2">
                        <h3 className="text-[10px] font-bold text-indigo-400 mb-4 uppercase tracking-widest px-1 flex items-center gap-2">
                          ⭐ Saved Modules
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {schema.components.map(comp => (
                            <div 
                              key={comp.id} 
                              draggable 
                              onDragStart={(e) => { e.dataTransfer.setData("action", "savedComponent"); e.dataTransfer.setData("compId", comp.id); }} 
                              className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-bold text-indigo-300 cursor-grab active:cursor-grabbing hover:bg-indigo-500/20 flex flex-col items-center justify-center gap-2 text-center transition-colors aspect-video"
                            >
                              <Layers size={16} className="opacity-60" />
                              <span className="truncate w-full px-1">{comp.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'templates' && (
                <div>
                  <h3 className="text-[10px] font-bold text-pink-500 mb-4 uppercase tracking-widest px-1">✨ Magic Templates</h3>
                  <p className="text-[10px] text-gray-500 px-1 mb-4 leading-relaxed">Drag entire pre-built sections directly onto your screen.</p>
                  
                  {/* --- NEW TEMPLATE STORE BUTTON IN SIDEBAR --- */}
                  <button 
                    onClick={() => window.open('/store', '_blank')} 
                    className="w-full mb-5 py-3 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-pink-500/20 hover:border-pink-500/50 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                  >
                    <LucideIcons.Store size={14} /> Browse Pro Templates
                  </button>

                  <div className="flex flex-col gap-4">
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "hero"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-24 bg-[#1A1B1E] flex items-center justify-center border-b border-white/5"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80" className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity" /></div>
                      <div className="p-4"><h4 className="text-[11px] font-bold text-gray-200">Hero Section</h4><p className="text-[9px] text-gray-500 mt-1">Image, Title, CTA</p></div>
                    </div>

                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "login"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-24 bg-blue-500/10 flex items-center justify-center border-b border-white/5"><div className="w-12 h-1.5 bg-blue-500/50 rounded mb-2"></div><div className="w-full px-6 flex flex-col gap-1.5"><div className="h-2.5 bg-white/10 rounded"></div><div className="h-2.5 bg-white/10 rounded"></div></div></div>
                      <div className="p-4"><h4 className="text-[11px] font-bold text-gray-200">Login Form</h4><p className="text-[9px] text-gray-500 mt-1">Inputs and Login Button</p></div>
                    </div>

                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "productCard"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-24 bg-gray-500/10 flex items-center justify-center border-b border-white/5 px-6 py-2"><div className="w-full h-full bg-[#1A1B1E] rounded flex flex-col overflow-hidden"><div className="h-8 bg-white/5"></div><div className="flex-1 p-1"><div className="w-8 h-1 bg-white/20 rounded mb-1"></div><div className="w-full h-2 bg-white/10 rounded"></div></div></div></div>
                      <div className="p-4"><h4 className="text-[11px] font-bold text-gray-200">Product Card</h4><p className="text-[9px] text-gray-500 mt-1">E-Commerce Item layout</p></div>
                    </div>
                    {/* NEW STORY LIST CARD */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "storyList"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-20 bg-[#1A1B1E] flex items-center justify-center border-b border-white/5 gap-3 overflow-hidden px-4">
                        <div className="w-10 h-10 rounded-full border-2 border-pink-500/80 border-dashed opacity-70 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-pink-500/50 border-dashed opacity-40 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-pink-500/30 border-dashed opacity-20 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Story List</h4><p className="text-[9px] text-gray-500 mt-1">Horizontal scrollable avatars</p></div>
                    </div>

                    {/* NEW SECTION TITLE CARD */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "sectionTitle"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-16 bg-gray-500/10 flex items-center justify-between px-6 border-b border-white/5">
                         <div className="w-16 h-2 bg-white/20 rounded"></div>
                         <div className="w-8 h-2 bg-blue-500/50 rounded"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Section Title</h4><p className="text-[9px] text-gray-500 mt-1">Header with 'See All' link</p></div>
                    </div>

                    {/* NEW: USER PROFILE HEADER */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "userProfile"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-24 bg-gray-500/10 flex items-center justify-center border-b border-white/5 flex-col gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500/50 border border-blue-400/30"></div>
                        <div className="w-16 h-2 bg-white/30 rounded"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">User Profile</h4><p className="text-[9px] text-gray-500 mt-1">Avatar, Info & Action Btn</p></div>
                    </div>

                    {/* NEW: STATS & ANALYTICS CARD */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "statCard"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-24 bg-[#1A1B1E] flex items-center justify-center border-b border-white/5 p-4">
                        <div className="w-full h-full border border-white/10 rounded-xl flex flex-col justify-between p-3 bg-[#161b22]">
                          <div className="w-10 h-2 bg-gray-500 rounded"></div>
                          <div className="w-16 h-3 bg-white/80 rounded"></div>
                          <div className="w-12 h-2 bg-emerald-500/50 rounded"></div>
                        </div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Metric Card</h4><p className="text-[9px] text-gray-500 mt-1">KPI Dashboard element</p></div>
                    </div>

                    {/* NEW: SETTINGS LIST */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "settingsList"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-24 bg-[#1A1B1E] flex flex-col justify-center border-b border-white/5 p-4 gap-2">
                        <div className="flex justify-between items-center w-full"><div className="w-20 h-2 bg-white/40 rounded"></div><div className="w-2 h-2 bg-white/20 rounded-full"></div></div>
                        <div className="w-full h-px bg-white/10 my-1"></div>
                        <div className="flex justify-between items-center w-full"><div className="w-24 h-2 bg-white/40 rounded"></div><div className="w-2 h-2 bg-white/20 rounded-full"></div></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Settings Menu</h4><p className="text-[9px] text-gray-500 mt-1">Icon list with dividers</p></div>
                    </div>

                    {/* 1. AI Prompt Bar */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "aiPromptBar"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-all">
                      <div className="h-16 bg-[#1A1B1E] flex items-center justify-center border-b border-white/5 p-4">
                        <div className="w-full h-8 bg-[#161b22] border border-purple-500/30 rounded-full flex items-center px-3 gap-2">
                           <div className="w-4 h-4 rounded-full bg-purple-500/50"></div>
                           <div className="w-16 h-1.5 bg-white/20 rounded"></div>
                        </div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">AI Prompt</h4><p className="text-[9px] text-gray-500 mt-1">Smart text input field</p></div>
                    </div>

                    {/* 2. Crypto Wallet */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "cryptoWallet"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-amber-500/50 transition-all">
                      <div className="h-20 bg-[#1A1B1E] flex flex-col items-center justify-center border-b border-white/5 p-4 gap-2">
                        <div className="w-24 h-4 bg-amber-500/80 rounded"></div>
                        <div className="flex gap-2"><div className="w-12 h-4 bg-emerald-500/50 rounded-full"></div><div className="w-12 h-4 bg-gray-600/50 rounded-full"></div></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">DeFi Wallet</h4><p className="text-[9px] text-gray-500 mt-1">Crypto balance & actions</p></div>
                    </div>

                    {/* 3. Smart Home Hub */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "smartHomeHub"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all">
                      <div className="h-24 bg-[#1A1B1E] flex items-center justify-center border-b border-white/5 gap-2 p-4">
                         <div className="w-1/2 h-full bg-[#161b22] rounded-lg border border-amber-500/20"></div>
                         <div className="w-1/2 h-full bg-[#161b22] rounded-lg border border-red-500/20"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">IoT Hub</h4><p className="text-[9px] text-gray-500 mt-1">Smart home device cards</p></div>
                    </div>

                    {/* 4. Biometric Auth */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "biometricAuth"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all">
                      <div className="h-24 bg-blue-500/5 flex items-center justify-center border-b border-white/5">
                        <div className="w-12 h-12 rounded-full border-2 border-blue-500/50 border-dashed animate-pulse"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Face / Touch ID</h4><p className="text-[9px] text-gray-500 mt-1">Biometric security gate</p></div>
                    </div>

                    {/* 5. AR Navigation */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "arNavigation"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-24 bg-[#1A1B1E] flex flex-col items-center justify-center border-b border-white/5 p-4 gap-2">
                        <div className="flex items-center gap-2 w-full"><div className="w-6 h-6 bg-pink-500/50 rounded"></div><div className="w-20 h-2 bg-white/50 rounded"></div></div>
                        <div className="w-full h-6 bg-pink-500/20 border border-pink-500/50 rounded-md"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">AR Navigation</h4><p className="text-[9px] text-gray-500 mt-1">Spatial route module</p></div>
                    </div>

                    {/* 6. Holographic Media Player */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "mediaPlayer"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-all">
                      <div className="h-24 bg-[#1A1B1E] flex flex-col items-center justify-center border-b border-white/5 px-4 py-2 gap-2">
                        <div className="w-full h-12 bg-purple-500/20 rounded-lg"></div>
                        <div className="flex gap-2"><div className="w-4 h-4 bg-white/20 rounded-full"></div><div className="w-6 h-6 bg-purple-500/80 rounded-full"></div><div className="w-4 h-4 bg-white/20 rounded-full"></div></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Media Player</h4><p className="text-[9px] text-gray-500 mt-1">Immersive audio controls</p></div>
                    </div>

                    {/* 7. Health Metrics */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "healthMetrics"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-red-500/50 transition-all">
                      <div className="h-20 bg-[#1A1B1E] flex items-center justify-center border-b border-white/5 gap-2 p-3">
                        <div className="w-8 h-12 bg-red-500/20 rounded-lg"></div><div className="w-8 h-12 bg-blue-500/20 rounded-lg"></div><div className="w-8 h-12 bg-purple-500/20 rounded-lg"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Health Tracker</h4><p className="text-[9px] text-gray-500 mt-1">Vitals & Biosensors</p></div>
                    </div>

                    {/* 8. AI Chat Bubble */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "aiChatBubble"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all">
                      <div className="h-20 bg-[#1A1B1E] flex items-start justify-start border-b border-white/5 p-4 gap-2">
                        <div className="w-6 h-6 bg-blue-500/50 rounded-full shrink-0"></div>
                        <div className="w-full h-8 bg-gray-700/50 rounded-r-lg rounded-bl-lg"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">AI Chat Bubble</h4><p className="text-[9px] text-gray-500 mt-1">Assistant conversation</p></div>
                    </div>

                    {/* 9. Premium Pro Paywall */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "proPaywall"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-pink-500/50 transition-all">
                      <div className="h-24 bg-gradient-to-br from-[#1A1B1E] to-pink-500/10 flex flex-col items-center justify-center border-b border-white/5 p-4 gap-2">
                        <div className="w-8 h-8 bg-pink-500/80 rounded-full mb-1"></div>
                        <div className="w-24 h-2 bg-white/80 rounded"></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Pro Paywall</h4><p className="text-[9px] text-gray-500 mt-1">Subscription upgrade UI</p></div>
                    </div>

                    {/* 10. Task Overview */}
                    <div draggable onDragStart={(e) => { e.dataTransfer.setData("action", "template"); e.dataTransfer.setData("templateKey", "taskOverview"); }} className="group p-0 bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-emerald-500/50 transition-all">
                      <div className="h-24 bg-[#1A1B1E] flex flex-col items-start justify-center border-b border-white/5 p-4 gap-3">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500/50"></div><div className="w-16 h-2 bg-white/50 rounded"></div></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500/50"></div><div className="w-12 h-2 bg-white/50 rounded"></div></div>
                      </div>
                      <div className="p-3"><h4 className="text-[11px] font-bold text-gray-200">Workflows</h4><p className="text-[9px] text-gray-500 mt-1">Automated task list</p></div>
                    </div>


                  </div>
                </div>
              )}

              {activeTab === 'layers' && (
                <div className="flex-1 flex flex-col bg-[#0E0F11] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-[#1A1B1E] px-5 py-4 border-b border-white/5"><h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Screen Structure</h3></div>
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">{activePage && <LayerTree node={activePage.root} />}</div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="flex-1 flex flex-col gap-6 pb-10">
                  
                  {/* 1. CLOUD BACKEND SETTINGS */}
                  <div className="bg-[#0E0F11] border border-white/5 p-5 rounded-2xl shadow-sm flex flex-col gap-5">
                    
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <LucideIcons.Cloud size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">1. Cloud Backend</h3>
                        <p className="text-[9px] text-gray-500 mt-0.5">Link your database & auth provider.</p>
                      </div>
                    </div>

                    {/* Segmented Toggle Control */}
                    <div className="flex p-1 bg-[#1A1B1E] rounded-lg border border-white/5 shadow-inner">
                      <button onClick={() => { const newSchema = { ...schema, backendProvider: 'supabase' }; commitHistory(newSchema); }} className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${(!schema.backendProvider || schema.backendProvider === 'supabase') ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>Supabase</button>
                      <button onClick={() => { const newSchema = { ...schema, backendProvider: 'firebase' }; commitHistory(newSchema); }} className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${schema.backendProvider === 'firebase' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>Firebase</button>
                    </div>

                    {/* Dynamic Inputs */}
                    {(!schema.backendProvider || schema.backendProvider === 'supabase') ? (
                      <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Project URL</label>
                          <input type="text" value={schema.supabaseConfig?.url || ''} onChange={(e) => handleGlobalChange('supabaseConfig', 'url', e.target.value)} placeholder="https://your-project.supabase.co" className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#1A1B1E] text-gray-200 outline-none focus:border-emerald-500/50 transition-colors shadow-inner" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Anon Public Key</label>
                          <input type="password" value={schema.supabaseConfig?.anonKey || ''} onChange={(e) => handleGlobalChange('supabaseConfig', 'anonKey', e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsIn..." className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#1A1B1E] text-gray-200 outline-none focus:border-emerald-500/50 transition-colors shadow-inner" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Web API Key</label>
                          <input type="password" value={schema.firebaseConfig?.apiKey || ''} onChange={(e) => handleGlobalChange('firebaseConfig', 'apiKey', e.target.value)} placeholder="AIzaSyB..." className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#1A1B1E] text-gray-200 outline-none focus:border-amber-500/50 transition-colors shadow-inner" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Project ID</label>
                          <input type="text" value={schema.firebaseConfig?.projectId || ''} onChange={(e) => handleGlobalChange('firebaseConfig', 'projectId', e.target.value)} placeholder="my-app-12345" className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#1A1B1E] text-gray-200 outline-none focus:border-amber-500/50 transition-colors shadow-inner" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="flex flex-col gap-1.5">
                             <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">App ID</label>
                             <input type="text" value={schema.firebaseConfig?.appId || ''} onChange={(e) => handleGlobalChange('firebaseConfig', 'appId', e.target.value)} placeholder="1:1234:web:abc" className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#1A1B1E] text-gray-200 outline-none focus:border-amber-500/50 transition-colors shadow-inner" />
                           </div>
                           <div className="flex flex-col gap-1.5">
                             <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sender ID</label>
                             <input type="text" value={schema.firebaseConfig?.messagingSenderId || ''} onChange={(e) => handleGlobalChange('firebaseConfig', 'messagingSenderId', e.target.value)} placeholder="12345678" className="w-full border border-white/10 p-2.5 rounded-lg text-xs bg-[#1A1B1E] text-gray-200 outline-none focus:border-amber-500/50 transition-colors shadow-inner" />
                           </div>
                        </div>
                      </div>
                    )}
                  </div>

                 
                  {/* 2. ADVANCED DATABASE SCHEMA & RLS BUILDER */}
                  <div className="bg-[#0E0F11] border border-white/5 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
                    
                    {/* FIXED: Changed to flex-col so the title and buttons stack cleanly */}
                    <div className="flex flex-col gap-4 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                          <LucideIcons.Database size={16} className="text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">2. Data Schema</h3>
                          <p className="text-[9px] text-gray-500 mt-0.5">Map tables and RLS policies.</p>
                        </div>
                      </div>
                      
                      {/* FIXED: Added flex-wrap and shortened labels so buttons fit beautifully */}
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setShowSqlModal(true)} className="flex-1 justify-center bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-[9px] font-bold px-2 py-1.5 rounded-lg transition-all flex items-center gap-1"><LucideIcons.Code2 size={12}/> SQL</button>
                        
                        <button onClick={handleDeploy} disabled={isBuilding} className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center gap-1.5 ml-1">
                            {isBuilding ? 'Building...' : <><LucideIcons.Rocket size={12} fill="white"/> Deploy</>}
                          </button>
                        
                        <button onClick={handleAiGenerateBackend} disabled={isGeneratingBackend} className="flex-1 justify-center bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30 text-[9px] font-bold px-2 py-1.5 rounded-lg transition-all flex items-center gap-1 disabled:opacity-50">
                           <LucideIcons.Bot size={12}/> {isGeneratingBackend ? 'Wait...' : 'AI Gen'}
                        </button>
                        
                        <button onClick={() => {
                           const tables = schema.appConfig.dbTables || [];
                           handleGlobalChange('appConfig', 'dbTables', [...tables, { id: `tbl_${Date.now()}`, name: 'new_table', columns: [], rlsEnabled: true, rlsAuthOnly: true }]);
                        }} className="flex-1 justify-center bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 text-[9px] font-bold px-2 py-1.5 rounded-lg transition-all">+ Table</button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {(schema.appConfig.dbTables || []).map((table, tIdx) => (
                        <div key={table.id} className="bg-[#161b22] border border-white/5 rounded-xl overflow-hidden shadow-sm">
                           
                           {/* TABLE HEADER - FIXED: min-w-0 on input, shrink-0 on trash */}
                           <div className="bg-[#1A1B1E] p-3 border-b border-white/5 flex justify-between items-center">
                             <div className="flex items-center gap-2 w-full pr-2">
                                <LucideIcons.Table2 size={14} className="text-gray-500 shrink-0" />
                                <input type="text" value={table.name} onChange={(e) => {
                                   const newTables = [...schema.appConfig.dbTables];
                                   newTables[tIdx].name = e.target.value.toLowerCase().replace(/\s+/g, '_');
                                   handleGlobalChange('appConfig', 'dbTables', newTables);
                                }} className="bg-transparent border-none text-xs font-bold text-blue-400 outline-none w-full min-w-0 font-mono placeholder:text-gray-600" placeholder="table_name" />
                             </div>
                             <button onClick={() => {
                                const newTables = schema.appConfig.dbTables.filter(t => t.id !== table.id);
                                handleGlobalChange('appConfig', 'dbTables', newTables);
                             }} className="text-gray-600 hover:text-red-500 transition-colors shrink-0"><LucideIcons.Trash size={14}/></button>
                           </div>

                           {/* RLS SECURITY SETTINGS - FIXED: Changed to flex-col so labels don't get crushed */}
                           <div className="bg-purple-500/5 px-3 py-3 border-b border-white/5 flex flex-col gap-3">
                             <div className="flex items-center gap-2">
                               <LucideIcons.ShieldAlert size={12} className={table.rlsEnabled ? "text-emerald-500 shrink-0" : "text-red-500 shrink-0"} />
                               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Row Level Security (RLS)</span>
                             </div>
                             <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-1.5 text-[9px] text-gray-400 cursor-pointer">
                                  <input type="checkbox" checked={table.rlsEnabled} onChange={(e) => {
                                      const newTables = [...schema.appConfig.dbTables];
                                      newTables[tIdx].rlsEnabled = e.target.checked;
                                      handleGlobalChange('appConfig', 'dbTables', newTables);
                                  }} className="accent-purple-500" />
                                  Enable RLS
                                </label>
                                {table.rlsEnabled && (
                                   <label className="flex items-center gap-1.5 text-[9px] text-gray-400 cursor-pointer border-l border-white/10 pl-3">
                                     <input type="checkbox" checked={table.rlsAuthOnly} onChange={(e) => {
                                         const newTables = [...schema.appConfig.dbTables];
                                         newTables[tIdx].rlsAuthOnly = e.target.checked;
                                         handleGlobalChange('appConfig', 'dbTables', newTables);
                                     }} className="accent-blue-500" />
                                     Auth Users Only
                                   </label>
                                )}
                             </div>
                           </div>
                           
                           {/* COLUMNS - FIXED: added flex-1 and min-w-0 to prevent input pushing */}
                           <div className="p-3 space-y-2">
                             <div className="text-[9px] text-gray-600 font-mono mb-2">id (UUID) & created_at (TIMESTAMP) auto-generated</div>
                             {table.columns.map((col, cIdx) => (
                               <div key={col.id} className="flex items-center gap-1.5">
                                 <div className="w-1 h-3 rounded-full bg-gray-600 shrink-0"></div>
                                 <input type="text" value={col.name} onChange={(e) => {
                                    const newTables = [...schema.appConfig.dbTables];
                                    newTables[tIdx].columns[cIdx].name = e.target.value.toLowerCase().replace(/\s+/g, '_');
                                    handleGlobalChange('appConfig', 'dbTables', newTables);
                                 }} className="flex-1 min-w-0 bg-[#0E0F11] border border-white/5 p-2 rounded-lg text-[10px] text-gray-300 outline-none font-mono focus:border-blue-500/50" placeholder="col_name" />
                                 
                                 <select value={col.type} onChange={(e) => {
                                    const newTables = [...schema.appConfig.dbTables];
                                    newTables[tIdx].columns[cIdx].type = e.target.value;
                                    handleGlobalChange('appConfig', 'dbTables', newTables);
                                 }} className="w-[75px] shrink-0 bg-[#0E0F11] border border-white/5 p-2 rounded-lg text-[10px] text-gray-400 outline-none font-mono cursor-pointer focus:border-blue-500/50">
                                   <option value="text">text</option><option value="numeric">numeric</option><option value="boolean">boolean</option><option value="uuid">uuid</option><option value="timestamp">timestamp</option>
                                 </select>
                                 <button onClick={() => {
                                    const newTables = [...schema.appConfig.dbTables];
                                    newTables[tIdx].columns.splice(cIdx, 1);
                                    handleGlobalChange('appConfig', 'dbTables', newTables);
                                 }} className="text-gray-600 hover:text-red-500 p-1 shrink-0"><LucideIcons.X size={12}/></button>
                               </div>
                             ))}
                             
                             <button onClick={() => {
                                const newTables = [...schema.appConfig.dbTables];
                                newTables[tIdx].columns.push({ id: `col_${Date.now()}`, name: 'new_col', type: 'text' });
                                handleGlobalChange('appConfig', 'dbTables', newTables);
                             }} className="text-[9px] font-bold text-gray-500 hover:text-blue-400 uppercase tracking-widest mt-2 flex items-center gap-1 w-full justify-center py-2 border border-dashed border-white/10 rounded-lg hover:border-blue-500/30 transition-colors">
                               + Add Column
                             </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. APP STATE VARIABLES */}
                  <div className="bg-[#0E0F11] border border-white/5 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                          <LucideIcons.Layers size={16} className="text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Global State</h3>
                          <p className="text-[9px] text-gray-500 mt-0.5">Dynamic UI variables.</p>
                        </div>
                      </div>
                      <button onClick={handleAddStateVar} className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 text-[9px] font-bold px-3 py-1.5 rounded-lg transition-all">+ New</button>
                    </div>
                    
                    {schema.appState.length === 0 ? (
                      <div className="text-center text-[10px] text-gray-600 py-6 border border-dashed border-white/10 rounded-xl bg-[#1A1B1E]">No variables created yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {schema.appState.map((state, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-[#1A1B1E] border border-white/5 p-3 rounded-xl">
                            <div className="flex flex-col">
                               <span className="text-xs font-bold text-gray-200 font-mono">{state.key}</span>
                               <span className="text-[9px] text-gray-500 mt-0.5">Default: "{state.value}"</span>
                            </div>
                            <button onClick={() => handleRemoveStateVar(state.key)} className="text-gray-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><LucideIcons.Trash size={14}/></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. PERMISSIONS */}
                  <div className="bg-[#0E0F11] border border-white/5 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <LucideIcons.Settings size={16} className="text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Permissions</h3>
                        <p className="text-[9px] text-gray-500 mt-0.5">Hardware access (APK).</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-1">
                       {Object.entries(schema.permissions).map(([key, isActive]) => (
                         <div key={key} className="flex items-center justify-between bg-[#1A1B1E] p-3 rounded-xl border border-white/5">
                            <span className="text-[10px] font-bold text-gray-300 capitalize tracking-wide">{key}</span>
                            <button onClick={() => handleTogglePermission(key)} className={`w-9 h-5 rounded-full relative transition-colors ${isActive ? 'bg-orange-500' : 'bg-gray-700'}`}>
                               <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${isActive ? 'left-5' : 'left-0.5'}`}></div>
                            </button>
                         </div>
                       ))}
                    </div>
                  </div>

                </div>
              )}

{activeTab === 'api' && (
                <div className="flex-1 flex flex-col gap-6 pb-10">
                  <div className="bg-[#0E0F11] border border-white/5 p-5 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">🌐 API Connections</h3>
                      <button onClick={() => {
                        const newEndpoints = [...(schema.apiEndpoints || []), { id: `api_${Date.now()}`, name: 'New API', method: 'GET', url: '' }];
                        // FIX: handleGlobalChange('apiEndpoints','',val) set schema.apiEndpoints['']= val, not schema.apiEndpoints.
                        // Use commitHistory directly so the change is undoable.
                        commitHistory({ ...schema, apiEndpoints: newEndpoints });
                      }} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[9px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-orange-500/20 transition-colors">+ Add API</button>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-5 leading-relaxed">Define global REST APIs to bind to ListViews and Action Chains.</p>

                    {(schema.apiEndpoints || []).length === 0 ? (
                      <div className="text-center text-[10px] text-gray-600 py-8 border border-dashed border-white/10 rounded-2xl bg-[#1A1B1E]">No API endpoints defined.</div>
                    ) : (
                      <div className="space-y-4">
                        {(schema.apiEndpoints || []).map((api, idx) => (
                          <div key={api.id} className="bg-[#1A1B1E] border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                               <input type="text" value={api.name} onChange={(e) => {
                                  const updated = [...schema.apiEndpoints];
                                  updated[idx].name = e.target.value;
                                  setSchema(prev => ({ ...prev, apiEndpoints: updated }));
                               }} className="bg-transparent border-none text-xs font-bold text-white outline-none w-2/3" placeholder="API Name" />
                               <button onClick={() => {
                                  const updated = schema.apiEndpoints.filter(a => a.id !== api.id);
                                  setSchema(prev => ({ ...prev, apiEndpoints: updated }));
                               }} className="text-gray-600 hover:text-red-500 transition-colors"><LucideIcons.Trash size={14}/></button>
                            </div>
                            <div className="flex gap-2">
                               <select value={api.method} onChange={(e) => {
                                  const updated = [...schema.apiEndpoints];
                                  updated[idx].method = e.target.value;
                                  setSchema(prev => ({ ...prev, apiEndpoints: updated }));
                               }} className="bg-[#0E0F11] border border-white/10 rounded-lg p-2 text-[10px] text-orange-400 font-bold outline-none cursor-pointer">
                                 <option value="GET">GET</option><option value="POST">POST</option><option value="PUT">PUT</option><option value="DELETE">DELETE</option>
                               </select>
                               <input type="text" value={api.url} onChange={(e) => {
                                  const updated = [...schema.apiEndpoints];
                                  updated[idx].url = e.target.value;
                                  setSchema(prev => ({ ...prev, apiEndpoints: updated }));
                               }} className="flex-1 bg-[#0E0F11] border border-white/10 rounded-lg p-2 text-[10px] text-gray-300 font-mono outline-none" placeholder="https://api.example.com/v1/data" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>

        {/* CANVAS AREA WITH STORYBOARD CONTROLS */}
        <div 
          className="flex-1 min-w-[600px] relative overflow-hidden flex flex-col items-center cursor-crosshair bg-[#050505] shadow-inner"
          onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          onContextMenu={(e) => { if(viewMode === 'storyboard') e.preventDefault(); }}
          onClick={() => { if(viewMode === 'single') { setSelectedId(null); setRightTab('inspector'); setIsRightPanelOpen(true); } }}
        >
          
          {/* TOOLBAR */}
          <div className="flex items-center justify-center gap-6 mt-8 mb-4 shrink-0 z-50">
            <div className="bg-[#1A1B1E] rounded-xl p-1 flex items-center border border-white/5 shadow-2xl">
              <button onClick={() => setViewMode('single')} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${viewMode === 'single' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>Single Screen</button>
              <button onClick={() => { setViewMode('storyboard'); setZoom(0.6); setPan({x: 0, y: 0}); }} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${viewMode === 'storyboard' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>Storyboard</button>
            </div>

            {viewMode === 'single' && (
              <div className="bg-[#1A1B1E] rounded-xl p-1 flex items-center border border-white/5 shadow-2xl">
                {['iphone', 'pixel', 'tablet'].map(mode => (
                  <button key={mode} onClick={(e) => { e.stopPropagation(); setPreviewMode(mode); }} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${previewMode === mode ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-white'}`}>{mode}</button>
                ))}
              </div>
            )}
            
            {viewMode === 'storyboard' && (
              <div className="bg-[#1A1B1E] rounded-xl p-1 flex items-center gap-2 border border-white/5 shadow-2xl px-4">
                <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="text-gray-400 hover:text-white">-</button>
                <span className="text-[10px] text-gray-300 font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="text-gray-400 hover:text-white">+</button>
              </div>
            )}
          </div>

          {/* CANVAS CONTENT */}
          {viewMode === 'single' ? (
            <div className="flex-1 w-full flex justify-center pb-20 overflow-y-auto hide-scrollbar">
              <ErrorBoundary>
                <Canvas schema={schema} rootNode={activePage?.root} selectedId={selectedId} onSelect={(id) => {
                    setSelectedId(id);
                    setIsRightPanelOpen(true);
                    // NEW: Only auto-switch to the inspector if we aren't using the AI or Code tabs
                    setRightTab(currentTab => (currentTab === 'ai' || currentTab === 'code') ? currentTab : 'inspector');
                  }}
                 onDropToNode={handleDropToNode} onResize={handleResize} onDragNodeStart={handleDragNodeStart} previewMode={previewMode} showGrid={showGrid} />
              </ErrorBoundary>
            </div>
          ) : (
            <div className="absolute inset-0 pt-24 overflow-hidden pointer-events-none">
              <div className="w-full h-full transform-gpu origin-center transition-transform duration-75 ease-out flex gap-32 items-start p-32 pointer-events-auto" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, cursor: isPanning ? 'grabbing' : 'grab' }}>
                
                {/* SVG CONNECTIONS */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" /><stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" /></linearGradient>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#ec4899" /></marker>
                  </defs>
                  {getConnections().map((conn, idx) => {
                    const startX = 128 + (conn.fromIndex * (375 + 128)) + 375;
                    const startY = 128 + 400; 
                    const endX = 128 + (conn.toIndex * (375 + 128));
                    const endY = 128 + 400 + (conn.fromIndex > conn.toIndex ? -50 : 50); 
                    return <path key={idx} d={`M ${startX} ${startY} C ${startX + 150} ${startY}, ${endX - 150} ${endY}, ${endX - 5} ${endY}`} fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrowhead)" />;
                  })}
                </svg>

                {/* DEVICE FRAMES */}
                {schema.pages.map((page) => (
                  <div key={page.id} className="flex flex-col items-center gap-6 relative group z-10">
                    <div className="bg-[#1A1B1E] px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-md">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></span>
                      <span className="text-sm font-bold text-white tracking-widest">{page.name}</span>
                    </div>
                    <div onClick={() => setCurrentPageId(page.id)} className={`transition-all duration-300 rounded-[44px] bg-black ${currentPageId === page.id ? 'ring-4 ring-purple-500 ring-offset-8 ring-offset-[#050505] shadow-[0_0_50px_rgba(168,85,247,0.3)]' : 'hover:ring-2 hover:ring-white/20 hover:ring-offset-8 hover:ring-offset-[#050505] opacity-80 hover:opacity-100'}`}>
                      <ErrorBoundary>
                        <Canvas schema={schema} rootNode={page.root} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setCurrentPageId(page.id); setRightTab('inspector'); setIsRightPanelOpen(true); }} onDropToNode={handleDropToNode} onResize={handleResize} onDragNodeStart={handleDragNodeStart} previewMode="iphone" showGrid={false} />
                      </ErrorBoundary>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

{/* RIGHT SIDEBAR: TABS FOR PROPERTIES, AI & CODE */}
        {isRightPanelOpen && (
          <aside className="w-[380px] border-l border-white/10 bg-[#0d0d0d] flex flex-col shrink-0 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20">
            
            {/* RIGHT TAB NAVIGATION */}
            <div className="flex p-2 gap-1 bg-[#161b22] border-b border-white/10 shrink-0 pt-2 px-2">
              <button onClick={() => setRightTab('inspector')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${rightTab === 'inspector' ? 'bg-[#0E0F11] text-blue-400 border border-white/5 shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>
                Inspector
              </button>
              <button onClick={() => setRightTab('ai')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-1.5 ${rightTab === 'ai' ? 'bg-[#0E0F11] text-purple-400 border border-white/5 shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>
                <LucideIcons.Sparkles size={12} /> AI
              </button>
              <button onClick={() => setRightTab('code')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${rightTab === 'code' ? 'bg-[#0E0F11] text-blue-400 border border-white/5 shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>
                Code
              </button>
            </div>

            {/* RIGHT TAB CONTENT WRAPPER */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-[#0d0d0d]">
               
               {/* --- TAB 1: PROPERTIES (INSPECTOR) --- */}
               {rightTab === 'inspector' && (
                  <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-5 animate-in fade-in duration-300">
                     <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0 pb-4 border-b border-white/5">
                       <span className={selectedNode ? "w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"}></span>
                       {selectedNode ? `Editing: ${selectedNode.type}` : 'Global Settings'}
                     </h3>
                     
                     {selectedNode && !selectedNode.id.includes('root') && (
                       <div className="flex gap-2 shrink-0 mb-6 border-b border-white/5 pb-6">
                         <button onClick={() => handleMove('up')} disabled={!canMoveUp} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${canMoveUp ? 'bg-[#161b22] border-white/10 text-gray-200 hover:bg-[#1c2128]' : 'bg-[#0d0d0d] border-white/5 text-gray-600'}`}>↑ Layer Up</button>
                         <button onClick={() => handleMove('down')} disabled={!canMoveDown} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${canMoveDown ? 'bg-[#161b22] border-white/10 text-gray-200 hover:bg-[#1c2128]' : 'bg-[#0d0d0d] border-white/5 text-gray-600'}`}>↓ Layer Down</button>
                       </div>
                     )}

                     {renderPropertyGroups()}
                     
                    {selectedNode && !selectedNode.id.includes('root') && (
                       <div className="flex flex-col gap-3 mt-6 shrink-0 border-t border-white/5 pt-6">
                         
                         {/* Local Save & Delete */}
                         <div className="flex gap-3">
                           <button onClick={handleSaveComponent} className="flex-1 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl text-[11px] font-bold border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors uppercase tracking-wider">⭐ Save Module</button>
                           <button onClick={handleDelete} className="px-5 py-3 bg-red-500/10 text-red-500 rounded-xl text-[11px] font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors">🗑️</button>
                         </div>

                         {/* NEW: THE PUSH TO STORE BUTTON */}
                         <button onClick={handlePushToStore} className="w-full py-3 bg-green-600/10 text-green-400 rounded-xl text-[11px] font-bold border border-green-500/30 hover:bg-green-600 hover:text-white transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                           <LucideIcons.UploadCloud size={14} /> Push to Store
                         </button>

                       </div>
                     )}
                  </div>
               )}

               {/* --- TAB 2: INTELLIGENT AI CHAT --- */}
               {rightTab === 'ai' && (
                 <div className="absolute inset-0 flex flex-col bg-[#050505] animate-in fade-in duration-300">
                   
                   {/* Chat Header with Switcher */}
                   <div className="p-4 border-b border-white/5 bg-[#0E0F11] flex flex-col gap-4 shrink-0">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                           <LucideIcons.Bot size={16} className="text-purple-400" />
                         </div>
                         <div>
                           <h3 className="text-xs font-bold text-white">AppForge Co-Pilot</h3>
                           <p className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Context Aware</p>
                         </div>
                       </div>
                     </div>

                     {/* Bottom Row: The Model Switcher */}
                     <div className="bg-[#161b22] rounded-xl p-2 border border-white/5 shadow-inner">
                        <div className="flex items-center gap-2 px-1 mb-1">
                           <LucideIcons.Cpu size={12} className="text-gray-500" />
                           <select 
                             value={aiProvider} 
                             onChange={(e) => { setAiProvider(e.target.value); setIsKeyInputOpen(true); }} 
                             className="flex-1 bg-transparent text-[10px] font-bold text-gray-300 outline-none cursor-pointer uppercase tracking-wider"
                           >
                             <option value="gemini-default">Gemini 2.5 Flash (Free)</option>
                             <option value="deepseek">DeepSeek V3 (BYOK)</option>
                             <option value="claude-3-5">Claude 3.5 Sonnet (BYOK)</option>
                             <option value="gpt-4o">GPT-4o (BYOK)</option>
                           </select>
                        </div>
                        
                        {/* API Key Input with Visual Feedback & Collapse */}
                        {aiProvider !== 'gemini-default' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1.5">
                            {isKeyInputOpen ? (
                                <div className="relative">
                                  <input 
                                    type="password" 
                                    value={customApiKey}
                                    onChange={(e) => setCustomApiKey(e.target.value)}
                                    placeholder={`Paste ${aiProvider.includes('claude') ? 'Anthropic' : aiProvider === 'deepseek' ? 'DeepSeek' : 'OpenAI'} API Key...`} 
                                    className={`w-full bg-[#050505] border px-3 py-2 rounded-lg text-[10px] text-white outline-none transition-colors pr-14 ${customApiKey.length > 15 ? 'border-green-500/50 focus:border-green-500' : 'border-white/10 placeholder:text-gray-600 focus:border-purple-500/50'}`}
                                  />
                                  {customApiKey.length > 15 && (
                                     <button onClick={() => setIsKeyInputOpen(false)} className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-colors animate-in zoom-in duration-200">
                                        Save
                                     </button>
                                  )}
                                </div>
                            ) : (
                                <div 
                                  onClick={() => setIsKeyInputOpen(true)}
                                  className="flex items-center justify-between bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-green-500/20 transition-colors"
                                >
                                   <div className="flex items-center gap-1.5 text-[9px] text-green-400 font-bold uppercase tracking-widest">
                                      <LucideIcons.CheckCircle2 size={10} /> Key Secured
                                   </div>
                                   <span className="text-[9px] text-gray-500 uppercase tracking-widest">Edit</span>
                                </div>
                            )}
                          </motion.div>
                        )}
                     </div>
                   </div>

                   {/* Chat Messages */}
                   <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                     {aiChatHistory.map((msg, idx) => (
                       <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                         <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-[#161b22] text-gray-300 border border-white/5 rounded-tl-sm'}`}>
                           {msg.text}
                         </div>
                       </div>
                     ))}
                     {isAiThinking && (
                       <div className="flex gap-2 p-3 bg-[#161b22] border border-white/5 rounded-2xl rounded-tl-sm w-fit items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce delay-75"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce delay-150"></div>
                       </div>
                     )}
                   </div>

                   {/* Chat Input Box */}
                   <div className="p-4 bg-[#0E0F11] border-t border-white/5 shrink-0">
                     {/* Dynamic AI Targeting Badge */}
                     {selectedNode && !selectedNode.id.includes('root') ? (
                        <div className="mb-3 flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest bg-blue-900/20 border border-blue-500/30 w-fit px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                           <span className="flex h-2 w-2 relative">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                           </span>
                           AI Locked on: <span className="text-blue-400 font-bold">{selectedNode.type}</span>
                        </div>
                     ) : (
                        <div className="mb-3 flex items-center gap-2 text-[9px] text-gray-600 uppercase tracking-widest bg-white/5 w-fit px-2 py-1 rounded">
                           <LucideIcons.Globe size={10}/> Global App Context
                        </div>
                     )}
                     
                     <div className="relative flex items-center">
                       <input 
                         type="text" 
                         value={chatInput}
                         onChange={(e) => setChatInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                         placeholder="Tell me what to build or fix..." 
                         className="w-full bg-[#161b22] border border-white/10 py-3 pl-4 pr-10 rounded-xl text-xs text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50 transition-all shadow-inner"
                       />
                       <button onClick={handleSendChatMessage} disabled={!chatInput.trim() || isAiThinking} className="absolute right-2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                          <LucideIcons.Send size={14} />
                       </button>
                     </div>
                   </div>
                 </div>
               )}

               {/* --- TAB 3: FLUTTER CODE --- */}
               {rightTab === 'code' && (
                  <div className="absolute inset-0 flex flex-col bg-[#050505] animate-in fade-in duration-300">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#0E0F11]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                        <h2 className="text-[10px] font-mono font-bold text-gray-400 tracking-widest uppercase">flutter_export.dart</h2>
                      </div>
                      <button onClick={() => { navigator.clipboard.writeText(code); alert("Code Copied!"); }} className="text-[9px] bg-blue-600/10 text-blue-400 border border-blue-600/20 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white font-bold transition-all uppercase tracking-widest">Copy</button>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                       <SyntaxHighlightedCode codeStr={code} selectedType={selectedNode?.type} />
                    </div>
                  </div>
               )}
               
            </div>
          </aside>
        )}

      </div>
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-indigo-500 font-bold tracking-widest uppercase text-xs">
        Loading Workspace...
      </div>
    }>
      <Home />
    </Suspense>
  );
}