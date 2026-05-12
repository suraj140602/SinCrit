
import { useState, useEffect, useRef, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

import * as LucideIcons from "lucide-react";



// ---------------------------------------------------------------------------

// Helpers

// ---------------------------------------------------------------------------



/** Call the Anthropic API (no key needed — proxied by claude.ai artifact env) */

/** Call the AI via Next.js Backend to avoid CORS and hide API keys */
const callClaude = async (systemPrompt, userMessage, maxTokens = 1200) => {
  const res = await fetch("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // Combine system and user prompt for your backend
      prompt: `${systemPrompt}\n\nUser Request: ${userMessage}`,
      // Optionally pass maxTokens if your backend supports it
      maxTokens: maxTokens 
    }),
  });
  
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  
  return data.reply || data.newCode || "";
};



/** Analyse a schema object for common Flutter-generation problems */

const scanSchemaHealth = (schema) => {

  const issues = [];

  const walk = (node, path = "root") => {

    if (!node) return;

    const p = node.props || {};



    // Unbound text that contains $ (will crash Dart string interpolation)

    if (node.type === "Text" && !p.isBound) {

      const text = p.content || p.label || "";

      if (text.includes("$")) {

        issues.push({

          type: "error",

          title: `Dollar sign in text — "${text.slice(0, 40)}"`,

          description: `Node ${path} contains "$" which breaks Dart string literals. The generator escapes this, but verify the intent is literal text, not a state variable binding.`,

          nodeId: node.id,

        });

      }

    }



    // Images with no URL

    if (node.type === "Image" && !p.url) {

      issues.push({

        type: "warning",

        title: "Image node has no URL",

        description: `Node ${path} (${node.id}) is an Image with an empty URL. It will render a broken-image placeholder at runtime.`,

        nodeId: node.id,

      });

    }



    // Buttons with no action

    if (node.type === "Button" && (!p.actionType || p.actionType === "none") && (!p.actionChain || p.actionChain.length === 0)) {

      issues.push({

        type: "info",

        title: "Button has no action",

        description: `Node ${path} is a Button with no actionType or actionChain. It will render as a no-op ElevatedButton.`,

        nodeId: node.id,

      });

    }



    // TextInput bound to non-existent state

    if (node.type === "TextInput" && p.isBound && p.boundVariable) {

      const exists = schema.appState?.some((s) => s.key === p.boundVariable);

      if (!exists) {

        issues.push({

          type: "error",

          title: `TextInput bound to missing state "${p.boundVariable}"`,

          description: `Node ${path} references appState key "${p.boundVariable}" which does not exist. The generated Dart will compile but produce a runtime null access.`,

          nodeId: node.id,

        });

      }

    }



    // Deeply nested Columns inside ListViews (perf)

    if (node.type === "ListView") {

      const hasDeepColumn = (n, depth = 0) =>

        n?.type === "Column" && depth > 0

          ? true

          : (n?.children || []).some((c) => hasDeepColumn(c, depth + 1));

      if (hasDeepColumn(node)) {

        issues.push({

          type: "warning",

          title: "Nested Column inside ListView",

          description: `Node ${path} contains a Column nested inside a ListView. In Flutter this can cause unbounded height errors. Wrap child columns with shrinkWrap or fixed heights.`,

          nodeId: node.id,

        });

      }

    }



    // Icon with unknown name (not in our map — may fall through to safety net)

    const knownIconNames = new Set([

      "log_out","logout","plus","add","x","close","user","person","users","people",

      "trash","delete","play","play_arrow","layout","dashboard","database","storage",

      "zap","bolt","message_square","chat","sliders_horizontal","tune","refresh_cw",

      "refresh","trending_up","play_circle","chevron_left","chevron_right",

      "shopping_bag","credit_card","mail","bell","notifications","activity",

      "show_chart","heart","favorite","star","image","box","inventory_2",

      "search","settings","home","menu","arrow_left","arrow_right","check",

      "alert_circle","info","eye","lock","edit","copy","share","download","upload",

      "link","map_pin","phone","video","camera","mic","calendar","clock","filter",

      "grid","list","bar_chart","pie_chart","file","folder","send","inbox","archive",

      "bookmark","tag","flag","award","gift","shopping_cart","package","truck",

      "wifi","bluetooth","sun","moon","cloud","globe","maximize","minimize",

      "rotate_cw","rotate_ccw","zoom_in","zoom_out","more_horizontal","more_vertical",

      "chevron_up","chevron_down","help_circle","thumbs_up","thumbs_down","smile",

      "music","skip_back","skip_forward","pause","stop_circle","repeat","shuffle",

      "minus","dollar_sign","briefcase","building","compass","at_sign","hash",

      "bold","italic","underline","thermometer","droplet","wind","layers",

      "toggle_left","toggle_right","sliders","sidebar","columns","log_in",

      "user_plus","user_minus","shield","key","terminal","code","cpu","server",

      "monitor","smartphone","tablet","headphones","film","rss","podcast","radio","tv",

    ]);

    if (node.type === "Icon" && p.iconName) {

      const cleaned = p.iconName.trim().replace(/[- ]/g, "_").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

      if (!knownIconNames.has(cleaned)) {

        issues.push({

          type: "info",

          title: `Unknown icon "${p.iconName}"`,

          description: `Node ${path} uses icon "${p.iconName}" which is not in the explicit Lucide→Material map. The safety-net will sanitise it, but the rendered icon may not match your intent. Add it to the iconMap in flutterGenerator.js.`,

          nodeId: node.id,

        });

      }

    }



    (node.children || []).forEach((c, i) => walk(c, `${path}>${node.type}[${i}]`));

  };



  (schema.pages || []).forEach((pg) => walk(pg.root, pg.id));



  if (issues.length === 0) {

    issues.push({

      type: "info",

      title: "Schema looks healthy ✓",

      description: "No structural issues detected. All nodes, bindings, and icon references passed automated checks.",

      nodeId: null,

    });

  }

  return issues;

};



// ---------------------------------------------------------------------------

// Sub-components

// ---------------------------------------------------------------------------



const LogLine = ({ log, index }) => {

  const isError = log.includes("Error:") || log.includes("FAILED") || log.includes("error:");

  const isSuccess = log.includes("BUILD SUCCESSFUL") || log.includes("✓") || log.includes("complete");

  const isAI = log.startsWith("[AI]") || log.startsWith("➜ [AI]");

  const isSystem = log.startsWith("[SYSTEM]") || log.startsWith("➜ [SYSTEM]");



  const color = isError

    ? "text-red-400"

    : isSuccess

    ? "text-green-400"

    : isAI

    ? "text-purple-400"

    : isSystem

    ? "text-blue-400"

    : "text-gray-300";



  return (

    <motion.div

      initial={{ opacity: 0, x: -8 }}

      animate={{ opacity: 1, x: 0 }}

      transition={{ delay: index * 0.015, duration: 0.2 }}

      className={`flex gap-3 ${color}`}

    >

      <span className="text-blue-500/40 shrink-0 select-none">➜</span>

      <span className="whitespace-pre-wrap break-all leading-relaxed">{log}</span>

    </motion.div>

  );

};



const StatCard = ({ label, value, color }) => (

  <div className="bg-[#161b22] p-5 rounded-2xl border border-white/5">

    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{label}</div>

    <div className={`text-3xl font-bold ${color}`}>{value}</div>

  </div>

);



const MOCK_CRASHES = [

  {

    id: "crash-1",

    severity: "Fatal",

    severityColor: "red",

    title: "Null check operator used on a null value",

    time: "2 mins ago • v1.0.4",

    trace: [

      "#0  PageHome.build.<anonymous closure> (package:appforge/main.dart:45:22)",

      "#1  ListenableBuilder.build (package:flutter/src/widgets/transitions.dart:1022:15)",

      "#2  _InheritedNotifierElement._notifyClients (package:flutter/src/widgets/inherited_notifier.dart:89:18)",

    ],

    schemaRef: "Text_1715562000",

  },

  {

    id: "crash-2",

    severity: "Non-fatal",

    severityColor: "orange",

    title: "RangeError (index): Invalid value: Not in inclusive range 0..4: 5",

    time: "14 mins ago • v1.0.4",

    trace: [

      "#0  List.[] (dart:core-patch/growable_array.dart:264:36)",

      "#1  PageProfile.build.<anonymous closure> (package:appforge/main.dart:312:18)",

    ],

    schemaRef: "ListView_1715562120",

  },

  {

    id: "crash-3",

    severity: "Warning",

    severityColor: "yellow",

    title: "A renderObject was still dirty when the build was complete",

    time: "1 hr ago • v1.0.3",

    trace: [

      "#0  RendererBinding.drawFrame (package:flutter/src/rendering/binding.dart:492:7)",

    ],

    schemaRef: "Column_1715561800",

  },

];



// ---------------------------------------------------------------------------

// Main Component

// ---------------------------------------------------------------------------



export default function AppForgeDashboard({

  schema = { pages: [], appState: [], theme: { primary: "#3B82F6", background: "#050505" }, app: {} },

  apkUrl,

  isBuilding = false,

  buildLogs = [],

  setBuildLogs,

  onClose,

  onTriggerBuild,

  onSetSchema,

}) {

  const [tab, setTab] = useState("deployments");



  // Health tab state

  const [healthTasks, setHealthTasks] = useState([]);

  const [isScanning, setIsScanning] = useState(false);

  const [hasScanned, setHasScanned] = useState(false);



  // CI/CD tab state

  const [isAutoFixing, setIsAutoFixing] = useState(false);

  const [fixResult, setFixResult] = useState(null); // { patch, explanation }

  const logsEndRef = useRef(null);



  // Crash tab state

  const [crashes] = useState(MOCK_CRASHES);

  const [fixingCrash, setFixingCrash] = useState(null);

  const [crashFixes, setCrashFixes] = useState({});



  // Auto-scroll logs

  useEffect(() => {

    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [buildLogs]);



  // -------------------------------------------------------------------------

  // CI/CD: Real AI Auto-Fix

  // -------------------------------------------------------------------------

  const handleAutoFix = useCallback(async () => {

    if (isAutoFixing) return;

    setIsAutoFixing(true);

    setFixResult(null);



    const errorLogs = buildLogs.filter(

      (l) => l.includes("Error:") || l.includes("FAILED") || l.includes("error:")

    );



    setBuildLogs((prev) => [

      ...prev,

      "",

      "[SYSTEM] ═══════════════════════════════════════════",

      "[SYSTEM] Initiating AI Auto-Patch sequence...",

      "[AI] Connecting to AppForge Code Intelligence...",

      "[AI] Analysing stack trace and build output...",

    ]);



    try {

      const systemPrompt = `You are AppForge Code Intelligence — an expert Flutter/Dart build error analyst.

Given build log errors, produce:

1. A concise root-cause explanation (2-3 sentences).

2. The exact code change needed in utils/flutterGenerator.js to fix it.

3. A one-line confirmation message for the terminal log.



Respond ONLY as JSON: { "rootCause": "...", "codeFix": "...", "terminalMsg": "..." }

No markdown fences. No preamble.`;



      const userMsg = `Build errors:\n${errorLogs.join("\n")}\n\nFull schema summary: ${JSON.stringify({ pages: schema.pages?.length, appState: schema.appState?.length, backend: schema.backendProvider })}`;



      const raw = await callClaude(systemPrompt, userMsg, 800);

      let parsed;

      try {

        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

      } catch {

        parsed = { rootCause: raw.slice(0, 200), codeFix: "See root cause above.", terminalMsg: "Analysis complete." };

      }



      setFixResult(parsed);



      setBuildLogs((prev) => [

        ...prev,

        `[AI] Root cause: ${parsed.rootCause}`,

        "[AI] Code fix generated — see patch panel below.",

        `[SYSTEM] ${parsed.terminalMsg}`,

        "[SYSTEM] ✓ Patch ready. Review and apply to utils/flutterGenerator.js",

        "[SYSTEM] ═══════════════════════════════════════════",

      ]);

    } catch (e) {

      setBuildLogs((prev) => [

        ...prev,

        "[AI] Error reaching Code Intelligence API. Check network.",

        "[SYSTEM] ═══════════════════════════════════════════",

      ]);

    } finally {

      setIsAutoFixing(false);

    }

  }, [buildLogs, isAutoFixing, schema, setBuildLogs]);



  // -------------------------------------------------------------------------

  // Health Tab: Run real scan

  // -------------------------------------------------------------------------

  const handleHealthScan = useCallback(async () => {

    setIsScanning(true);

    setHasScanned(false);

    setHealthTasks([]);



    // Structural scan (instant)

    await new Promise((r) => setTimeout(r, 600));

    const structural = scanSchemaHealth(schema);

    setHealthTasks(structural);



    // AI deep scan

    try {

      const systemPrompt = `You are an AppForge schema auditor. Review the schema summary and return an array of health issues (max 4) as JSON:

[{ "type": "error"|"warning"|"info", "title": "...", "description": "..." }]

Focus on: missing nav routes, state variables never referenced, potential Dart type mismatches, backend config issues.

Return only the JSON array, no fences.`;



      const userMsg = `Schema: ${JSON.stringify({

        pages: schema.pages?.map((p) => ({ id: p.id, widgetCount: JSON.stringify(p.root).length })),

        appState: schema.appState,

        appConfig: schema.appConfig,

        backendProvider: schema.backendProvider,

        theme: schema.theme,

      })}`;



      const raw = await callClaude(systemPrompt, userMsg, 600);

      const aiIssues = JSON.parse(raw.replace(/```json|```/g, "").trim());

      if (Array.isArray(aiIssues) && aiIssues.length > 0) {

        setHealthTasks((prev) => [

          ...prev.filter((t) => t.title !== "Schema looks healthy ✓"),

          ...aiIssues,

        ]);

      }

    } catch (_) {

      // AI scan failed silently; structural results are still shown

    }



    setIsScanning(false);

    setHasScanned(true);

  }, [schema]);



  // Auto-scan when switching to health tab

  useEffect(() => {

    if (tab === "maintenance" && !hasScanned && !isScanning) {

      handleHealthScan();

    }

  }, [tab, hasScanned, isScanning, handleHealthScan]);



  // -------------------------------------------------------------------------

  // Crash Tab: AI generates schema fix

  // -------------------------------------------------------------------------

  const handleCrashFix = useCallback(async (crash) => {

    if (fixingCrash === crash.id) return;

    setFixingCrash(crash.id);



    try {

      const systemPrompt = `You are AppForge Crash Intelligence. Given a Flutter runtime crash and a schema node reference, explain:

1. What the crash means in simple terms.

2. What change in the AppForge visual schema (not Dart code) would prevent it.

3. A one-sentence action the developer should take right now.

Respond as JSON: { "plain": "...", "schemaFix": "...", "action": "..." }. No fences.`;



      const userMsg = `Crash: ${crash.title}\nStack: ${crash.trace.join("\n")}\nSchema node: ${crash.schemaRef}`;



      const raw = await callClaude(systemPrompt, userMsg, 500);

      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

      setCrashFixes((prev) => ({ ...prev, [crash.id]: parsed }));

    } catch (_) {

      setCrashFixes((prev) => ({

        ...prev,

        [crash.id]: { plain: "Could not reach AI.", schemaFix: "—", action: "Retry." },

      }));

    } finally {

      setFixingCrash(null);

    }

  }, [fixingCrash]);



  // -------------------------------------------------------------------------

  // Sidebar nav config

  // -------------------------------------------------------------------------

  const navItems = [

    {

      id: "deployments",

      label: "CI/CD Pipeline",

      Icon: LucideIcons.Rocket,

      accent: "blue",

    },

    {

      id: "maintenance",

      label: "Schema Health",

      Icon: LucideIcons.ShieldCheck,

      accent: "purple",

    },

    {

      id: "crashes",

      label: "Crash Analytics",

      Icon: LucideIcons.LineChart,

      accent: "red",

    },

  ];



  const hasErrors = buildLogs.some(

    (l) => l.includes("Error:") || l.includes("FAILED") || l.includes("error:")

  );



  // -------------------------------------------------------------------------

  // Render

  // -------------------------------------------------------------------------

  return (

    <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      exit={{ opacity: 0 }}

      className="absolute inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-10"

    >

      <motion.div

        initial={{ scale: 0.96, y: 24 }}

        animate={{ scale: 1, y: 0 }}

        exit={{ scale: 0.96, y: 24 }}

        transition={{ type: "spring", stiffness: 320, damping: 28 }}

        className="w-full max-w-6xl bg-[#0E0F11] border border-white/10 rounded-3xl shadow-2xl shadow-blue-500/10 flex overflow-hidden h-[88vh] md:h-[82vh]"

      >

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}

        <div className="w-60 bg-[#161b22] border-r border-white/5 flex flex-col p-5 shrink-0">

          {/* Logo */}

          <div className="flex items-center gap-3 mb-8">

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">

              <LucideIcons.Activity size={18} className="text-white" />

            </div>

            <div>

              <h2 className="text-sm font-bold text-white tracking-wide">Project Hub</h2>

              <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate max-w-[100px]">

                {schema.app?.name || "AppForge"}

              </p>

            </div>

          </div>



          {/* Nav */}

          <nav className="space-y-1.5 flex-1">

            {navItems.map(({ id, label, Icon, accent }) => {

              const active = tab === id;

              const accentMap = {

                blue: { active: "bg-blue-600/10 text-blue-400 border-blue-500/20", dot: "bg-blue-500" },

                purple: { active: "bg-purple-600/10 text-purple-400 border-purple-500/20", dot: "bg-purple-500" },

                red: { active: "bg-red-600/10 text-red-400 border-red-500/20", dot: "bg-red-500" },

              };

              return (

                <button

                  key={id}

                  onClick={() => setTab(id)}

                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold border ${

                    active

                      ? accentMap[accent].active

                      : "text-gray-400 hover:bg-white/5 hover:text-white border-transparent"

                  }`}

                >

                  <Icon size={15} />

                  {label}

                  {/* live badge */}

                  {id === "deployments" && isBuilding && (

                    <span className="ml-auto flex h-2 w-2">

                      <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full ${accentMap[accent].dot} opacity-75`} />

                      <span className={`relative inline-flex rounded-full h-2 w-2 ${accentMap[accent].dot}`} />

                    </span>

                  )}

                  {id === "maintenance" && isScanning && (

                    <LucideIcons.Loader2 size={12} className="ml-auto animate-spin text-purple-400" />

                  )}

                </button>

              );

            })}

          </nav>



          {/* Build trigger */}

          {onTriggerBuild && (

            <button

              onClick={onTriggerBuild}

              disabled={isBuilding}

              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors shadow-[0_0_16px_rgba(59,130,246,0.3)]"

            >

              {isBuilding ? (

                <><LucideIcons.Loader2 size={14} className="animate-spin" /> Building...</>

              ) : (

                <><LucideIcons.Play size={14} /> Trigger Build</>

              )}

            </button>

          )}



          <button

            onClick={onClose}

            className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-xs font-bold"

          >

            <LucideIcons.ChevronLeft size={14} /> Back to Builder

          </button>

        </div>



        {/* ── CONTENT ─────────────────────────────────────────────────── */}

        <div className="flex-1 overflow-y-auto bg-[#050505] p-6 md:p-8 custom-scrollbar relative">



          {/* ─── TAB 1: CI/CD ─────────────────────────────────────────── */}

          <AnimatePresence mode="wait">

            {tab === "deployments" && (

              <motion.div

                key="deployments"

                initial={{ opacity: 0, x: 16 }}

                animate={{ opacity: 1, x: 0 }}

                exit={{ opacity: 0, x: -16 }}

                transition={{ duration: 0.22 }}

                className="flex flex-col gap-5 h-full"

              >

                {/* Header */}

                <div className="flex items-center justify-between shrink-0">

                  <div>

                    <h2 className="text-lg font-bold text-white flex items-center gap-2">

                      <LucideIcons.Terminal size={18} className="text-blue-400" />

                      Live Build Terminal

                    </h2>

                    <p className="text-xs text-gray-500 mt-0.5">

                      Monitor GitHub Actions • AI auto-patch on failure

                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    {isBuilding && (

                      <div className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2">

                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />

                        Compiling

                      </div>

                    )}

                    {apkUrl && (

                      <a

                        href={apkUrl}

                        download

                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl transition-colors shadow-[0_0_14px_rgba(22,163,74,0.3)] flex items-center gap-2"

                      >

                        <LucideIcons.Download size={13} /> Download APK

                      </a>

                    )}

                  </div>

                </div>



                {/* Terminal window */}

                <div className="flex-1 bg-[#090909] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl min-h-0">

                  {/* Mac-style bar */}

                  <div className="h-9 bg-[#161b22] flex items-center justify-between px-4 border-b border-white/5 shrink-0">

                    <div className="flex items-center gap-2">

                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />

                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />

                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />

                      <span className="ml-3 text-[10px] text-gray-600 font-mono tracking-widest flex items-center gap-1.5">

                        <LucideIcons.Terminal size={10} /> GITHUB_ACTIONS_LOG

                      </span>

                    </div>

                    <button

                      onClick={() => setBuildLogs([])}

                      className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors font-mono"

                    >

                      clear

                    </button>

                  </div>



                  {/* Log body */}

                  <div className="p-5 font-mono text-xs leading-loose flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">

                    {buildLogs.length === 0 && !isBuilding && (

                      <div className="text-gray-700">Waiting for deployment trigger...</div>

                    )}

                    {buildLogs.map((log, i) => (

                      <LogLine key={i} log={log} index={i} />

                    ))}

                    {isBuilding && (

                      <div className="flex gap-3 mt-2">

                        <span className="text-blue-500/40">➜</span>

                        <span className="text-blue-400 animate-pulse">Running assembleRelease...</span>

                      </div>

                    )}

                    <div ref={logsEndRef} />

                  </div>

                </div>



                {/* Error panel — only visible when logs have errors */}

                <AnimatePresence>

                  {hasErrors && !fixResult && (

                    <motion.div

                      key="error-panel"

                      initial={{ opacity: 0, y: 10 }}

                      animate={{ opacity: 1, y: 0 }}

                      exit={{ opacity: 0, y: 10 }}

                      className="shrink-0 p-4 bg-red-500/8 border border-red-500/25 rounded-2xl flex items-start justify-between gap-4"

                    >

                      <div>

                        <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-1">

                          <LucideIcons.AlertOctagon size={15} /> Build Failed

                        </h4>

                        <p className="text-xs text-red-300/60 leading-relaxed">

                          Compiler hit a fatal error. AppForge AI will analyse your stack trace, identify the root cause, and generate a targeted patch for <code className="bg-white/5 px-1 rounded">utils/flutterGenerator.js</code>.

                        </p>

                      </div>

                      <button

                        onClick={handleAutoFix}

                        disabled={isAutoFixing}

                        className="shrink-0 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-[0_0_16px_rgba(220,38,38,0.3)]"

                      >

                        {isAutoFixing ? (

                          <><LucideIcons.Loader2 size={13} className="animate-spin" /> Analysing...</>

                        ) : (

                          <><LucideIcons.Bot size={13} /> Auto-Fix with AI</>

                        )}

                      </button>

                    </motion.div>

                  )}



                  {/* AI Patch result panel */}

                  {fixResult && (

                    <motion.div

                      key="fix-panel"

                      initial={{ opacity: 0, y: 10 }}

                      animate={{ opacity: 1, y: 0 }}

                      className="shrink-0 p-5 bg-purple-500/8 border border-purple-500/25 rounded-2xl flex flex-col gap-4"

                    >

                      <div className="flex items-center justify-between">

                        <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">

                          <LucideIcons.Sparkles size={15} /> AI Patch Ready

                        </h4>

                        <button onClick={() => setFixResult(null)} className="text-gray-600 hover:text-gray-400 transition-colors">

                          <LucideIcons.X size={14} />

                        </button>

                      </div>

                      <div>

                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Root Cause</p>

                        <p className="text-xs text-gray-300 leading-relaxed">{fixResult.rootCause}</p>

                      </div>

                      <div>

                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Suggested Code Fix</p>

                        <pre className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 text-[11px] text-green-300 font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">

                          {fixResult.codeFix}

                        </pre>

                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">

                        <LucideIcons.Info size={12} className="shrink-0 text-blue-400" />

                        Apply this patch to <code className="bg-white/5 px-1 rounded text-blue-300">src/utils/flutterGenerator.js</code>, commit, then re-trigger the build.

                      </div>

                    </motion.div>

                  )}

                </AnimatePresence>

              </motion.div>

            )}



            {/* ─── TAB 2: SCHEMA HEALTH ──────────────────────────────── */}

            {tab === "maintenance" && (

              <motion.div

                key="maintenance"

                initial={{ opacity: 0, x: 16 }}

                animate={{ opacity: 1, x: 0 }}

                exit={{ opacity: 0, x: -16 }}

                transition={{ duration: 0.22 }}

                className="flex flex-col gap-5 h-full"

              >

                <div className="flex items-center justify-between shrink-0 bg-gradient-to-r from-purple-900/15 to-transparent p-5 rounded-2xl border border-purple-500/15">

                  <div>

                    <h2 className="text-lg font-bold text-white flex items-center gap-2">

                      <LucideIcons.ShieldCheck size={18} className="text-purple-400" /> Schema Health

                    </h2>

                    <p className="text-xs text-gray-500 mt-1 max-w-md leading-relaxed">

                      Structural + AI-powered audit of your visual schema against Flutter SDK rules.

                    </p>

                  </div>

                  <button

                    onClick={handleHealthScan}

                    disabled={isScanning}

                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_16px_rgba(168,85,247,0.35)] flex items-center gap-2"

                  >

                    <LucideIcons.RefreshCw size={14} className={isScanning ? "animate-spin" : ""} />

                    {isScanning ? "Scanning..." : "Re-run Scan"}

                  </button>

                </div>



                {/* Summary bar */}

                {hasScanned && healthTasks.length > 0 && (

                  <div className="shrink-0 flex gap-3">

                    {["error", "warning", "info"].map((type) => {

                      const count = healthTasks.filter((t) => t.type === type).length;

                      const map = { error: ["text-red-400", "bg-red-500/10", "border-red-500/20", "Errors"], warning: ["text-orange-400", "bg-orange-500/10", "border-orange-500/20", "Warnings"], info: ["text-blue-400", "bg-blue-500/10", "border-blue-500/20", "Info"] };

                      const [tc, bg, border, label] = map[type];

                      return (

                        <div key={type} className={`flex items-center gap-2 px-3 py-1.5 ${bg} border ${border} rounded-lg`}>

                          <span className={`text-lg font-bold ${tc}`}>{count}</span>

                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</span>

                        </div>

                      );

                    })}

                  </div>

                )}



                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3 min-h-0">

                  {isScanning && healthTasks.length === 0 && (

                    <div className="flex flex-col items-center justify-center h-40 gap-3">

                      <LucideIcons.Loader2 size={24} className="animate-spin text-purple-400" />

                      <p className="text-xs text-gray-500">Running structural + AI deep scan...</p>

                    </div>

                  )}



                  {healthTasks.map((task, idx) => {

                    const typeConfig = {

                      error: { Icon: LucideIcons.AlertTriangle, bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/20" },

                      warning: { Icon: LucideIcons.AlertCircle, bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/20" },

                      info: { Icon: LucideIcons.Info, bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/20" },

                    };

                    const { Icon, bg, text, border } = typeConfig[task.type] || typeConfig.info;

                    return (

                      <motion.div

                        key={idx}

                        initial={{ opacity: 0, y: 6 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ delay: idx * 0.06 }}

                        className="bg-[#161b22] border border-white/8 p-4 rounded-2xl flex items-start gap-4"

                      >

                        <div className={`mt-0.5 w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>

                          <Icon size={14} className={text} />

                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="flex items-start justify-between gap-2">

                            <h4 className="text-sm font-bold text-gray-200">{task.title}</h4>

                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${border} ${text} shrink-0`}>

                              {task.type}

                            </span>

                          </div>

                          <p className="text-xs text-gray-400 leading-relaxed mt-1">{task.description}</p>

                          {task.nodeId && (

                            <p className="text-[10px] text-gray-600 font-mono mt-1.5">node: {task.nodeId}</p>

                          )}

                        </div>

                      </motion.div>

                    );

                  })}



                  {!isScanning && healthTasks.length === 0 && (

                    <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-600">

                      <LucideIcons.ShieldCheck size={28} />

                      <p className="text-xs">Click "Re-run Scan" to start.</p>

                    </div>

                  )}

                </div>

              </motion.div>

            )}



            {/* ─── TAB 3: CRASH ANALYTICS ────────────────────────────── */}

            {tab === "crashes" && (

              <motion.div

                key="crashes"

                initial={{ opacity: 0, x: 16 }}

                animate={{ opacity: 1, x: 0 }}

                exit={{ opacity: 0, x: -16 }}

                transition={{ duration: 0.22 }}

                className="flex flex-col gap-5 h-full"

              >

                <div className="shrink-0">

                  <h2 className="text-lg font-bold text-white flex items-center gap-2">

                    <LucideIcons.Flame size={18} className="text-red-500" /> Live Crash Analytics

                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5 max-w-lg leading-relaxed">

                    Runtime errors from deployed builds. AI traces each crash back to your visual schema and generates a fix.

                  </p>

                </div>



                <div className="grid grid-cols-3 gap-3 shrink-0">

                  <StatCard label="Crash-Free Users" value="99.8%" color="text-green-400" />

                  <StatCard label="Issues (7d)" value={crashes.length} color="text-red-400" />

                  <StatCard label="AI Auto-Patches" value="4" color="text-purple-400" />

                </div>



                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4 min-h-0">

                  {crashes.map((crash) => {

                    const fix = crashFixes[crash.id];

                    const isFixing = fixingCrash === crash.id;

                    const severityMap = {

                      Fatal: "text-red-400 bg-red-500/10 border-red-500/20",

                      "Non-fatal": "text-orange-400 bg-orange-500/10 border-orange-500/20",

                      Warning: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",

                    };

                    return (

                      <motion.div

                        key={crash.id}

                        initial={{ opacity: 0, y: 8 }}

                        animate={{ opacity: 1, y: 0 }}

                        className="bg-[#161b22] border border-white/8 p-5 rounded-2xl flex flex-col gap-4"

                      >

                        {/* Crash header */}

                        <div className="flex items-start justify-between">

                          <div className="flex items-center gap-3">

                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${severityMap[crash.severity] || severityMap.Warning}`}>

                              {crash.severity}

                            </span>

                            <h4 className="text-sm font-bold text-gray-200">{crash.title}</h4>

                          </div>

                          <span className="text-[10px] text-gray-600 shrink-0 ml-2">{crash.time}</span>

                        </div>



                        {/* Stack trace */}

                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3">

                          {crash.trace.map((line, i) => (

                            <div key={i} className="font-mono text-[10px] text-gray-500 leading-relaxed">

                              {line}

                            </div>

                          ))}

                        </div>



                        {/* Schema ref + action row */}

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">

                          <div className="flex items-center gap-2 text-xs text-gray-500">

                            <LucideIcons.Search size={12} className="text-blue-400" />

                            Schema node:{" "}

                            <span className="font-mono text-blue-400 text-[11px]">{crash.schemaRef}</span>

                          </div>

                          {!fix && (

                            <button

                              onClick={() => handleCrashFix(crash)}

                              disabled={isFixing}

                              className="px-4 py-2 bg-purple-600/15 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/25 text-xs font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-60"

                            >

                              {isFixing ? (

                                <><LucideIcons.Loader2 size={12} className="animate-spin" /> Analysing...</>

                              ) : (

                                <><LucideIcons.Wand2 size={12} /> Generate Schema Fix</>

                              )}

                            </button>

                          )}

                        </div>



                        {/* AI fix result */}

                        <AnimatePresence>

                          {fix && (

                            <motion.div

                              initial={{ opacity: 0, height: 0 }}

                              animate={{ opacity: 1, height: "auto" }}

                              className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4 flex flex-col gap-3"

                            >

                              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">

                                <LucideIcons.Sparkles size={11} /> AI Analysis

                              </p>

                              <p className="text-xs text-gray-300 leading-relaxed">{fix.plain}</p>

                              <div>

                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Schema Fix</p>

                                <p className="text-xs text-green-300 leading-relaxed bg-[#0a0a0a] p-2 rounded-lg border border-white/5 font-mono">

                                  {fix.schemaFix}

                                </p>

                              </div>

                              <div className="flex items-start gap-2 text-xs text-blue-300">

                                <LucideIcons.ArrowRight size={12} className="shrink-0 mt-0.5" />

                                {fix.action}

                              </div>

                            </motion.div>

                          )}

                        </AnimatePresence>

                      </motion.div>

                    );

                  })}

                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </motion.div>

    </motion.div>

  );

}