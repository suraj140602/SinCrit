// --- PREMIUM AI TEMPLATE LIBRARY ---
export const TEMPLATES = {
  login: {
    id: "login_root",
    type: "Column",
    props: { width: "100%", height: "100%", padding: "30px", mainAxisAlignment: "center", crossAxisAlignment: "center", backgroundColor: "#0E0F11" },
    children: [
      { id: "log_icon", type: "Icon", props: { iconName: "Hexagon", size: "64", color: "#6366f1", margin: "0 0 20px 0" } },
      { id: "log_t1", type: "Text", props: { content: "Welcome Back", fontSize: "28", fontFamily: "Inter", color: "#ffffff", textAlign: "center", margin: "0 0 10px 0" } },
      { id: "log_t2", type: "Text", props: { content: "Sign in to continue to AppForge", fontSize: "14", color: "#888888", textAlign: "center", margin: "0 0 40px 0" } },
      { id: "log_in1", type: "TextInput", props: { placeholder: "Email Address", width: "100%", padding: "16px", backgroundColor: "#1A1B1E", color: "#ffffff", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 16px 0" } },
      { id: "log_in2", type: "TextInput", props: { placeholder: "Password", width: "100%", padding: "16px", backgroundColor: "#1A1B1E", color: "#ffffff", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 30px 0" } },
      { id: "log_btn", type: "Button", props: { label: "Sign In", width: "100%", padding: "18px", backgroundColor: "#6366f1", color: "#ffffff", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", shadowColor: "#6366f1", shadowBlur: "20", shadowOffsetY: "8" } }
    ]
  },
  
  cryptoWallet: {
    id: "crypto_root",
    type: "Container",
    props: { width: "100%", padding: "24px", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", backgroundType: "gradient", gradientStart: "#6366f1", gradientEnd: "#a855f7", shadowColor: "#a855f7", shadowBlur: "30", shadowOffsetY: "10", margin: "20px 0" },
    children: [
      { id: "cw_row1", type: "Row", props: { width: "100%", mainAxisAlignment: "spaceBetween", margin: "0 0 20px 0" }, children: [
          { id: "cw_t1", type: "Text", props: { content: "Total Balance", fontSize: "14", color: "#ffffff" } },
          { id: "cw_icon", type: "Icon", props: { iconName: "Wallet", size: "20", color: "#ffffff" } }
      ]},
      { id: "cw_t2", type: "Text", props: { content: "$24,532.89", fontSize: "36", fontFamily: "Inter", color: "#ffffff", margin: "0 0 30px 0" } },
      { id: "cw_btn", type: "Button", props: { label: "Send Crypto", width: "100%", padding: "16px", backgroundColor: "#000000", color: "#ffffff", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } }
    ]
  },

  userProfile: {
    id: "profile_root",
    type: "Column",
    props: { width: "100%", padding: "20px", crossAxisAlignment: "center" },
    children: [
      { id: "prof_img", type: "Image", props: { url: "https://i.pravatar.cc/150?img=11", width: "100px", height: "100px", radiusTopLeft: "50", radiusTopRight: "50", radiusBottomLeft: "50", radiusBottomRight: "50", margin: "0 0 16px 0", shadowColor: "#000000", shadowBlur: "20" } },
      { id: "prof_t1", type: "Text", props: { content: "Sarah Jenkins", fontSize: "24", fontFamily: "Inter", color: "#ffffff", textAlign: "center", margin: "0 0 4px 0" } },
      { id: "prof_t2", type: "Text", props: { content: "Lead Designer @ AppForge", fontSize: "12", color: "#888888", textAlign: "center", margin: "0 0 24px 0" } },
      { id: "prof_stats", type: "Row", props: { width: "100%", mainAxisAlignment: "spaceBetween", padding: "20px", backgroundColor: "#161b22", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 24px 0" }, children: [
          { id: "stat1", type: "Column", props: { crossAxisAlignment: "center" }, children: [ { id: "s1_v", type: "Text", props: { content: "1.2k", fontSize: "18", color: "#ffffff" } }, { id: "s1_l", type: "Text", props: { content: "Followers", fontSize: "10", color: "#888888" } } ] },
          { id: "stat2", type: "Column", props: { crossAxisAlignment: "center" }, children: [ { id: "s2_v", type: "Text", props: { content: "48", fontSize: "18", color: "#ffffff" } }, { id: "s2_l", type: "Text", props: { content: "Projects", fontSize: "10", color: "#888888" } } ] },
          { id: "stat3", type: "Column", props: { crossAxisAlignment: "center" }, children: [ { id: "s3_v", type: "Text", props: { content: "4.9", fontSize: "18", color: "#ffffff" } }, { id: "s3_l", type: "Text", props: { content: "Rating", fontSize: "10", color: "#888888" } } ] }
      ]},
      { id: "prof_btn", type: "Button", props: { label: "Edit Profile", width: "100%", padding: "16px", backgroundColor: "#3b82f6", color: "#ffffff", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
    ]
  },

aiSaas: {
    id: "ai_saas_root",
    type: "Column",
    props: { width: "100%", height: "100%", backgroundColor: "#0E0F11", padding: "0px", mainAxisAlignment: "start", crossAxisAlignment: "center" },
    children: [
      {
        id: "hero_sec", type: "Column", props: { width: "100%", padding: "60px 20px 40px", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [
          { id: "badge", type: "Row", props: { padding: "8px 16px", backgroundColor: "rgba(14, 165, 233, 0.1)", radiusTopLeft: "20px", radiusTopRight: "20px", radiusBottomLeft: "20px", radiusBottomRight: "20px", margin: "0 0 24px 0", mainAxisAlignment: "center" }, children: [
            { id: "badge_txt", type: "Text", props: { content: "v2.0 is Live 🚀", color: "#38bdf8", fontSize: "12", fontFamily: "Inter" } }
          ]},
          { id: "h1", type: "Text", props: { content: "Build Faster with AI", color: "#ffffff", fontSize: "38", fontFamily: "Inter", textAlign: "center", margin: "0 0 16px 0" } },
          { id: "h2", type: "Text", props: { content: "The ultimate tool for modern teams to ship products at lightspeed.", color: "#94a3b8", fontSize: "14", textAlign: "center", margin: "0 0 32px 0", fontFamily: "Inter" } },
          { id: "cta", type: "Button", props: { label: "Start for Free", backgroundColor: "#0ea5e9", color: "#ffffff", width: "100%", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
        ]
      },
      { id: "dash_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", width: "90%", height: "200px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", shadowColor: "#0ea5e9", shadowBlur: "30", shadowOffsetY: "10", margin: "0 0 40px 0" } },
      {
         id: "bento", type: "Row", props: { width: "100%", padding: "0 20px", gap: "12px", mainAxisAlignment: "spaceBetween" }, children: [
           { id: "b1", type: "Column", props: { backgroundColor: "#1e293b", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", height: "140px", padding: "16px", width: "48%" }, children: [
              { id: "ic1", type: "Icon", props: { iconName: "Zap", color: "#38bdf8", size: "24", margin: "0 0 12px 0" } },
              { id: "t1", type: "Text", props: { content: "Fast", color: "#ffffff", fontSize: "16", fontFamily: "Inter" } }
           ]},
           { id: "b2", type: "Column", props: { backgroundColor: "#1e293b", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", height: "140px", padding: "16px", width: "48%" }, children: [
              { id: "ic2", type: "Icon", props: { iconName: "Shield", color: "#38bdf8", size: "24", margin: "0 0 12px 0" } },
              { id: "t2", type: "Text", props: { content: "Secure", color: "#ffffff", fontSize: "16", fontFamily: "Inter" } }
           ]}
         ]
      }
    ]
  },

  agencyPortfolio: {
    id: "ag_port_root",
    type: "Column",
    props: { width: "100%", height: "100%", backgroundColor: "#000000", padding: "24px" },
    children: [
      { id: "nav", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 60px 0", width: "100%" }, children: [
         { id: "logo", type: "Text", props: { content: "STUDIO.", color: "#ffffff", fontSize: "20", fontFamily: "Inter" } },
         { id: "menu", type: "Icon", props: { iconName: "Menu", color: "#ffffff", size: "24" } }
      ]},
      { id: "h1", type: "Text", props: { content: "WE CREATE DIGITAL EXPERIENCES.", color: "#ffffff", fontSize: "44", fontFamily: "Inter", margin: "0 0 40px 0" } },
      { id: "img", type: "Image", props: { url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800", width: "100%", height: "280px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 24px 0" } },
      { id: "h2", type: "Text", props: { content: "Selected Works 2026", color: "#facc15", fontSize: "12", fontFamily: "Inter", margin: "0 0 16px 0" } }
    ]
  },

  // ─── PREMIUM DASHBOARDS ───
  fintechDash: {
    id: "fintech_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#0f172a", padding: "24px" },
    children: [
      { id: "fd_head", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 32px 0", width: "100%" }, children: [
        { id: "fd_h1", type: "Text", props: { content: "Overview", color: "#f8fafc", fontSize: "24", fontFamily: "Inter" } },
        { id: "fd_ic", type: "Icon", props: { iconName: "Bell", color: "#94a3b8", size: "24" } }
      ]},
      { id: "fd_bal_card", type: "Container", props: { width: "100%", padding: "24px", backgroundColor: "#1e293b", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", margin: "0 0 24px 0", shadowColor: "#000000", shadowOffsetY: "8", shadowBlur: "20" }, children: [
        { id: "fd_bal_l", type: "Text", props: { content: "Total Portfolio", color: "#94a3b8", fontSize: "14", margin: "0 0 8px 0" } },
        { id: "fd_bal_v", type: "Text", props: { content: "$124,592.50", color: "#10b981", fontSize: "36", fontFamily: "Inter", margin: "0 0 20px 0" } },
        { id: "fd_chart", type: "Image", props: { url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800", height: "120px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
      ]},
      { id: "fd_h2", type: "Text", props: { content: "Recent Activity", color: "#f8fafc", fontSize: "18", fontFamily: "Inter", margin: "0 0 16px 0" } },
      { id: "fd_list", type: "Column", props: { gap: "12px", width: "100%" }, children: [
        { id: "fd_item1", type: "Row", props: { mainAxisAlignment: "spaceBetween", backgroundColor: "#1e293b", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [
           { id: "fd_i1_l", type: "Text", props: { content: "Apple Inc. (AAPL)", color: "#f8fafc", fontSize: "14" } },
           { id: "fd_i1_r", type: "Text", props: { content: "+$420.00", color: "#10b981", fontSize: "14", fontFamily: "Inter" } }
        ]},
        { id: "fd_item2", type: "Row", props: { mainAxisAlignment: "spaceBetween", backgroundColor: "#1e293b", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [
           { id: "fd_i2_l", type: "Text", props: { content: "Netflix (NFLX)", color: "#f8fafc", fontSize: "14" } },
           { id: "fd_i2_r", type: "Text", props: { content: "-$85.50", color: "#ef4444", fontSize: "14", fontFamily: "Inter" } }
        ]}
      ]}
    ]
  },

  // ─── PREMIUM E-COMMERCE ───
  ecomStore: {
    id: "ecom_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "20px" },
    children: [
      { id: "ec_nav", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 24px 0", width: "100%" }, children: [
        { id: "ec_ic1", type: "Icon", props: { iconName: "Menu", color: "#111827", size: "28" } },
        { id: "ec_ic2", type: "Icon", props: { iconName: "ShoppingBag", color: "#111827", size: "28" } }
      ]},
      { id: "ec_h1", type: "Text", props: { content: "Discover", color: "#111827", fontSize: "36", fontFamily: "Inter", margin: "0 0 20px 0" } },
      { id: "ec_search", type: "TextInput", props: { placeholder: "Search products...", backgroundColor: "#f3f4f6", color: "#111827", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 32px 0", padding: "20px", width: "100%" } },
      { id: "ec_grid", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
        { id: "ec_item1", type: "Column", props: { width: "47%" }, children: [
          { id: "ec_i1_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400", width: "100%", height: "180px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 12px 0", shadowColor: "#000000", shadowOffsetY: "10", shadowBlur: "20" } },
          { id: "ec_i1_t", type: "Text", props: { content: "Smart Watch", color: "#111827", fontSize: "16", fontFamily: "Inter", margin: "0 0 4px 0" } },
          { id: "ec_i1_p", type: "Text", props: { content: "$299.00", color: "#ec4899", fontSize: "16", fontFamily: "Inter", margin: "0 0 16px 0" } }
        ]},
        { id: "ec_item2", type: "Column", props: { width: "47%" }, children: [
          { id: "ec_i2_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400", width: "100%", height: "180px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 12px 0", shadowColor: "#000000", shadowOffsetY: "10", shadowBlur: "20" } },
          { id: "ec_i2_t", type: "Text", props: { content: "Headphones", color: "#111827", fontSize: "16", fontFamily: "Inter", margin: "0 0 4px 0" } },
          { id: "ec_i2_p", type: "Text", props: { content: "$199.00", color: "#ec4899", fontSize: "16", fontFamily: "Inter", margin: "0 0 16px 0" } }
        ]}
      ]}
    ]
  },

  // ─── MUSIC PLAYER APP ───
  musicPlayer: {
    id: "mp_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#191414", padding: "32px", crossAxisAlignment: "center" }, children: [
      { id: "mp_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800", width: "100%", height: "300px", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", margin: "0 0 32px 0", shadowColor: "#1db954", shadowBlur: "40", shadowOffsetY: "10" } },
      { id: "mp_t1", type: "Text", props: { content: "Neon Nights", color: "#ffffff", fontSize: "28", fontFamily: "Inter", textAlign: "center", margin: "0 0 8px 0" } },
      { id: "mp_t2", type: "Text", props: { content: "Synthwave Records", color: "#1db954", fontSize: "16", textAlign: "center", margin: "0 0 32px 0" } },
      { id: "mp_scrub", type: "ProgressBar", props: { progress: "0.4", color: "#1db954", backgroundColor: "#333333", width: "100%", height: "6px", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4", margin: "0 0 32px 0" } },
      { id: "mp_ctrl", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "80%" }, children: [
         { id: "mc_1", type: "Icon", props: { iconName: "SkipBack", color: "#ffffff", size: "32" } },
         { id: "mc_2", type: "Icon", props: { iconName: "PlayCircle", color: "#1db954", size: "64" } },
         { id: "mc_3", type: "Icon", props: { iconName: "SkipForward", color: "#ffffff", size: "32" } }
      ]}
    ]
  },

  // ─── AUTH WIREFRAME ───
  wfAuth: {
    id: "wf_auth_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "32px", mainAxisAlignment: "center" },
    children: [
      { id: "wf_box", type: "Container", props: { width: "80px", height: "80px", backgroundColor: "#374151", margin: "0 auto 40px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } },
      { id: "wf_l1", type: "Container", props: { width: "70%", height: "32px", backgroundColor: "#374151", margin: "0 auto 16px", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" } },
      { id: "wf_l2", type: "Container", props: { width: "50%", height: "16px", backgroundColor: "#1f2937", margin: "0 auto 48px", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
      { id: "wf_in1", type: "Container", props: { width: "100%", height: "60px", backgroundColor: "#1f2937", margin: "0 0 16px 0", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "2px solid #374151" } },
      { id: "wf_in2", type: "Container", props: { width: "100%", height: "60px", backgroundColor: "#1f2937", margin: "0 0 40px 0", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "2px solid #374151" } },
      { id: "wf_btn", type: "Container", props: { width: "100%", height: "64px", backgroundColor: "#4b5563", margin: "0 0 0 0", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
    ]
  },

  // ─── AUTH: SPLIT SCREEN LOGIN ───
  splitLogin: {
    id: "sl_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "0px" }, children: [
      { id: "sl_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", width: "100%", height: "35%", radiusBottomLeft: "40", radiusBottomRight: "40" } },
      { id: "sl_form", type: "Column", props: { width: "100%", padding: "32px" }, children: [
         { id: "sl_h1", type: "Text", props: { content: "Welcome Back", color: "#111827", fontSize: "32", fontFamily: "Inter", margin: "0 0 8px 0" } },
         { id: "sl_h2", type: "Text", props: { content: "Log in to your account.", color: "#6b7280", fontSize: "16", margin: "0 0 32px 0" } },
         { id: "sl_i1", type: "TextInput", props: { placeholder: "Email", backgroundColor: "#f3f4f6", color: "#111827", padding: "20px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 16px 0", width: "100%" } },
         { id: "sl_i2", type: "TextInput", props: { placeholder: "Password", backgroundColor: "#f3f4f6", color: "#111827", padding: "20px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 32px 0", width: "100%" } },
         { id: "sl_btn", type: "Button", props: { label: "Log In", backgroundColor: "#6366f1", color: "#ffffff", padding: "20px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", width: "100%" } }
      ]}
    ]
  },

  // ─── ANIMATED CARDS: STATS FLIP ───
  statsCard: {
     id: "sc_root", type: "Container", props: { width: "100%", padding: "24px", backgroundColor: "#1e293b", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", border: "1px solid #334155" }, children: [
       { id: "sc_r1", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 16px 0", width: "100%" }, children: [
         { id: "sc_t1", type: "Text", props: { content: "Monthly Revenue", color: "#94a3b8", fontSize: "14" } },
         { id: "sc_ic", type: "Icon", props: { iconName: "TrendingUp", color: "#10b981", size: "24" } }
       ]},
       { id: "sc_t2", type: "Text", props: { content: "$42,890", color: "#f8fafc", fontSize: "40", fontFamily: "Inter", margin: "0 0 12px 0" } },
       { id: "sc_t3", type: "Text", props: { content: "+14.5% from last month", color: "#10b981", fontSize: "14" } }
     ]
  },

  // ─── NAVBARS: GLASS NAV ───
  glassNav: {
    id: "gn_root", type: "Row", props: { width: "100%", padding: "20px 24px", backgroundColor: "rgba(15, 23, 42, 0.6)", mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, children: [
      { id: "gn_logo", type: "Text", props: { content: "AppForge", color: "#ffffff", fontSize: "20", fontFamily: "Inter" } },
      { id: "gn_ic", type: "Icon", props: { iconName: "Menu", color: "#ffffff", size: "24" } }
    ]
  },

  // ─── BUTTONS: BRUTALIST ───
  brutalistBtn: {
    id: "brut_btn_root", type: "Button", props: { label: "CLICK ME", backgroundColor: "#facc15", color: "#000000", width: "100%", padding: "24px", fontSize: "20", fontFamily: "Inter", shadowColor: "#000000", shadowOffsetX: "10", shadowOffsetY: "10", shadowBlur: "0", border: "4px solid #000000", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0" }
  },

  // ─── PREMIUM PAGES: BATCH 2 ───

  healthcare: {
    id: "hc_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#f8fafc", padding: "24px" }, children: [
      { id: "hc_h", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 24px 0", width: "100%" }, children: [
        { id: "hc_h_t", type: "Column", props: {}, children: [ 
          { id: "t1", type: "Text", props: { content: "Good morning,", fontSize: "14", color: "#64748b", margin: "0 0 4px 0" } }, 
          { id: "t2", type: "Text", props: { content: "Sarah Jenkins", fontSize: "20", color: "#0f172a", fontFamily: "Inter" } } 
        ]},
        { id: "hc_img", type: "Image", props: { url: "https://i.pravatar.cc/150?img=11", width: "48px", height: "48px", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24" } }
      ]},
      { id: "hc_card", type: "Container", props: { width: "100%", backgroundColor: "#06b6d4", padding: "20px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 24px 0", shadowColor: "#06b6d4", shadowBlur: "20", shadowOffsetY: "8" }, children: [
        { id: "c_t1", type: "Text", props: { content: "Dr. Emily Chen", color: "#ffffff", fontSize: "18", fontFamily: "Inter", margin: "0 0 4px 0" } },
        { id: "c_t2", type: "Text", props: { content: "Cardiology • Today, 10:30 AM", color: "rgba(255,255,255,0.8)", fontSize: "12", margin: "0 0 20px 0" } },
        { id: "c_btn", type: "Button", props: { label: "Join Video Call", backgroundColor: "#ffffff", color: "#06b6d4", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", padding: "12px", width: "100%" } }
      ]},
      { id: "hc_h2", type: "Text", props: { content: "Health Vitals", color: "#0f172a", fontSize: "16", fontFamily: "Inter", margin: "0 0 16px 0" } },
      { id: "hc_vitals", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
        { id: "v1", type: "Container", props: { width: "48%", backgroundColor: "#ffffff", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #e2e8f0" }, children: [
          { id: "v1_i", type: "Icon", props: { iconName: "Heart", color: "#ef4444", size: "24", margin: "0 0 12px 0" } },
          { id: "v1_t1", type: "Text", props: { content: "72 bpm", color: "#0f172a", fontSize: "18", fontFamily: "Inter" } }
        ]},
        { id: "v2", type: "Container", props: { width: "48%", backgroundColor: "#ffffff", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #e2e8f0" }, children: [
          { id: "v2_i", type: "Icon", props: { iconName: "Activity", color: "#10b981", size: "24", margin: "0 0 12px 0" } },
          { id: "v2_t1", type: "Text", props: { content: "120/80", color: "#0f172a", fontSize: "18", fontFamily: "Inter" } }
        ]}
      ]}
    ]
  },

  travelPlanner: {
    id: "tp_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#fdf8f6", padding: "20px" }, children: [
      { id: "tp_h1", type: "Text", props: { content: "Where to next?", color: "#111827", fontSize: "28", fontFamily: "Inter", margin: "0 0 16px 0" } },
      { id: "tp_search", type: "TextInput", props: { placeholder: "Search destinations...", backgroundColor: "#ffffff", color: "#111827", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 24px 0", width: "100%", shadowColor: "rgba(0,0,0,0.05)", shadowBlur: "10", shadowOffsetY: "4" } },
      { id: "tp_map", type: "MapView", props: { width: "100%", height: "220px", latitude: "48.8566", longitude: "2.3522", zoom: "12", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 24px 0" } },
      { id: "tp_h2", type: "Text", props: { content: "Popular Trips", color: "#111827", fontSize: "18", fontFamily: "Inter", margin: "0 0 12px 0" } },
      { id: "tp_cards", type: "Row", props: { gap: "16px", width: "100%", scrollDirection: "horizontal" }, children: [
        { id: "tc1", type: "Container", props: { width: "160px", height: "200px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", backgroundColor: "#f59e0b" }, children: [
           { id: "tc1_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=400", width: "100%", height: "100%", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } }
        ]}
      ]}
    ]
  },

  socialHub: {
    id: "sh_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#0f172a", padding: "20px" }, children: [
      { id: "sh_head", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 24px 0", width: "100%" }, children: [
        { id: "sh_t1", type: "Text", props: { content: "Social Hub", color: "#ffffff", fontSize: "24", fontFamily: "Inter" } },
        { id: "sh_ic", type: "Icon", props: { iconName: "PlusCircle", color: "#8b5cf6", size: "28" } }
      ]},
      { id: "sh_stats", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 24px 0", width: "100%" }, children: [
        { id: "s1", type: "Container", props: { width: "48%", backgroundColor: "#1e293b", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [
           { id: "s1_t", type: "Text", props: { content: "Followers", color: "#94a3b8", fontSize: "12", margin: "0 0 4px 0" } },
           { id: "s1_v", type: "Text", props: { content: "12.4K", color: "#ffffff", fontSize: "20", fontFamily: "Inter" } }
        ]},
        { id: "s2", type: "Container", props: { width: "48%", backgroundColor: "#1e293b", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [
           { id: "s2_t", type: "Text", props: { content: "Engagement", color: "#94a3b8", fontSize: "12", margin: "0 0 4px 0" } },
           { id: "s2_v", type: "Text", props: { content: "8.2%", color: "#ec4899", fontSize: "20", fontFamily: "Inter" } }
        ]}
      ]},
      { id: "sh_h2", type: "Text", props: { content: "Scheduled Posts", color: "#f8fafc", fontSize: "16", fontFamily: "Inter", margin: "0 0 16px 0" } },
      { id: "sh_post", type: "Container", props: { width: "100%", backgroundColor: "#1e293b", padding: "16px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" }, children: [
        { id: "shp_r1", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 16px 0", width: "100%" }, children: [
           { id: "shp_user", type: "Row", props: { gap: "8px" }, children: [
              { id: "shp_av", type: "Image", props: { url: "https://i.pravatar.cc/150?img=32", width: "32px", height: "32px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } },
              { id: "shp_name", type: "Text", props: { content: "@design_studio", color: "#ffffff", fontSize: "14", fontFamily: "Inter" } }
           ]},
           { id: "shp_tag", type: "Container", props: { padding: "4px 8px", backgroundColor: "rgba(139,92,246,0.2)", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" }, children: [ { id: "shpt", type: "Text", props: { content: "Today 5PM", color: "#8b5cf6", fontSize: "10", fontFamily: "Inter" } } ] }
        ]},
        { id: "shp_txt", type: "Text", props: { content: "Excited to share our latest brand identity project! Let us know what you think below 👇", color: "#cbd5e1", fontSize: "14", margin: "0 0 16px 0", fontFamily: "Inter" } },
        { id: "shp_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600", width: "100%", height: "160px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
      ]}
    ]
  },

  realEstate: {
    id: "re_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#f8fafc", padding: "0" }, children: [
      { id: "re_map", type: "MapView", props: { width: "100%", height: "350px", latitude: "34.0522", longitude: "-118.2437", zoom: "13" } },
      { id: "re_body", type: "Column", props: { padding: "24px", width: "100%" }, children: [
        { id: "re_h1", type: "Text", props: { content: "Nearby Properties", color: "#0f172a", fontSize: "20", fontFamily: "Inter", margin: "0 0 16px 0" } },
        { id: "re_card", type: "Container", props: { width: "100%", backgroundColor: "#ffffff", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", border: "1px solid #e2e8f0", overflow: "hidden", shadowColor: "rgba(0,0,0,0.05)", shadowBlur: "10", shadowOffsetY: "4" }, children: [
           { id: "re_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600", width: "100%", height: "200px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "0", radiusBottomRight: "0" } },
           { id: "re_c_body", type: "Column", props: { padding: "20px" }, children: [
              { id: "re_price", type: "Text", props: { content: "$1,250,000", color: "#0ea5e9", fontSize: "24", fontFamily: "Inter", margin: "0 0 8px 0" } },
              { id: "re_addr", type: "Text", props: { content: "1248 Beverly Hills Ave, CA", color: "#64748b", fontSize: "14", margin: "0 0 16px 0" } },
              { id: "re_feats", type: "Row", props: { gap: "20px", width: "100%" }, children: [
                 { id: "f1", type: "Row", props: { gap: "6px" }, children: [ { id: "i1", type: "Icon", props: { iconName: "Bed", color: "#94a3b8", size: "18" } }, { id: "t1", type: "Text", props: { content: "4 Beds", color: "#475569", fontSize: "14", fontFamily: "Inter" } } ] },
                 { id: "f2", type: "Row", props: { gap: "6px" }, children: [ { id: "i2", type: "Icon", props: { iconName: "Bath", color: "#94a3b8", size: "18" } }, { id: "t2", type: "Text", props: { content: "3 Baths", color: "#475569", fontSize: "14", fontFamily: "Inter" } } ] }
              ]}
           ]}
        ]}
      ]}
    ]
  },

  nftMarket: {
    id: "nft_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#000000", padding: "24px" }, children: [
      { id: "nft_nav", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 24px 0", width: "100%" }, children: [
        { id: "n_l", type: "Text", props: { content: "OpenArt", color: "#ffffff", fontSize: "20", fontFamily: "Inter" } },
        { id: "n_r", type: "Icon", props: { iconName: "Search", color: "#ffffff", size: "24" } }
      ]},
      { id: "nft_img_wrap", type: "Container", props: { width: "100%", padding: "4px", backgroundType: "gradient", gradientStart: "#7c3aed", gradientEnd: "#db2777", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", margin: "0 0 24px 0", shadowColor: "#7c3aed", shadowBlur: "30", shadowOffsetY: "10" }, children: [
        { id: "nft_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800", width: "100%", height: "320px", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } }
      ]},
      { id: "nft_title", type: "Text", props: { content: "Abstract Dimension #042", color: "#ffffff", fontSize: "24", fontFamily: "Inter", margin: "0 0 8px 0" } },
      { id: "nft_creator", type: "Text", props: { content: "By @CyberArtist", color: "#a78bfa", fontSize: "14", margin: "0 0 24px 0" } },
      { id: "nft_bid_box", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", backgroundColor: "#111827", padding: "20px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 32px 0", border: "1px solid #374151" }, children: [
         { id: "bid_l", type: "Column", props: {}, children: [ { id: "bt1", type: "Text", props: { content: "Current Bid", color: "#9ca3af", fontSize: "12", margin: "0 0 4px 0", fontFamily: "Inter" } }, { id: "bt2", type: "Text", props: { content: "4.25 ETH", color: "#ffffff", fontSize: "20", fontFamily: "Inter" } } ] },
         { id: "bid_r", type: "Column", props: { crossAxisAlignment: "end" }, children: [ { id: "bt3", type: "Text", props: { content: "Ending in", color: "#9ca3af", fontSize: "12", margin: "0 0 4px 0", fontFamily: "Inter" } }, { id: "bt4", type: "Text", props: { content: "12h 45m", color: "#ffffff", fontSize: "20", fontFamily: "Inter" } } ] }
      ]},
      { id: "nft_btn", type: "Button", props: { label: "Place a Bid", backgroundColor: "#db2777", color: "#ffffff", width: "100%", padding: "18px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", shadowColor: "#db2777", shadowBlur: "20" } }
    ]
  },

  edtech: {
    id: "ed_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#f8fafc", padding: "0" }, children: [
      { id: "ed_vid", type: "VideoPlayer", props: { width: "100%", height: "260px", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0" } },
      { id: "ed_body", type: "Column", props: { padding: "24px", width: "100%" }, children: [
        { id: "ed_h1", type: "Text", props: { content: "Advanced UI/UX Design", color: "#0f172a", fontSize: "24", fontFamily: "Inter", margin: "0 0 8px 0" } },
        { id: "ed_auth", type: "Text", props: { content: "Instructor: Jane Doe", color: "#64748b", fontSize: "14", margin: "0 0 24px 0" } },
        { id: "ed_prog_lbl", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 12px 0" }, children: [
           { id: "pl1", type: "Text", props: { content: "Course Progress", color: "#0f172a", fontSize: "14", fontFamily: "Inter" } },
           { id: "pl2", type: "Text", props: { content: "45%", color: "#2563eb", fontSize: "14", fontFamily: "Inter", fontWeight: "bold" } }
        ]},
        { id: "ed_prog", type: "ProgressBar", props: { progress: "0.45", width: "100%", height: "8px", color: "#2563eb", backgroundColor: "#e2e8f0", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4", margin: "0 0 32px 0" } },
        { id: "ed_h2", type: "Text", props: { content: "Curriculum", color: "#0f172a", fontSize: "18", fontFamily: "Inter", margin: "0 0 16px 0" } },
        { id: "ed_l1", type: "Row", props: { backgroundColor: "#ffffff", padding: "16px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #e2e8f0", margin: "0 0 12px 0", gap: "16px", crossAxisAlignment: "center" }, children: [
          { id: "l1_ic", type: "Container", props: { width: "44px", height: "44px", backgroundColor: "#dbeafe", radiusTopLeft: "22", radiusTopRight: "22", radiusBottomLeft: "22", radiusBottomRight: "22", padding: "12px", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [ { id: "i1", type: "Icon", props: { iconName: "Check", color: "#2563eb", size: "20" } } ] },
          { id: "l1_t", type: "Column", props: {}, children: [ { id: "t1a", type: "Text", props: { content: "1. Introduction to Figma", color: "#0f172a", fontSize: "15", fontFamily: "Inter", margin: "0 0 4px 0" } }, { id: "t1b", type: "Text", props: { content: "12:45 • Completed", color: "#64748b", fontSize: "12" } } ] }
        ]},
        { id: "ed_l2", type: "Row", props: { backgroundColor: "#ffffff", padding: "16px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #e2e8f0", gap: "16px", crossAxisAlignment: "center" }, children: [
          { id: "l2_ic", type: "Container", props: { width: "44px", height: "44px", backgroundColor: "#f1f5f9", radiusTopLeft: "22", radiusTopRight: "22", radiusBottomLeft: "22", radiusBottomRight: "22", padding: "12px", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [ { id: "i2", type: "Icon", props: { iconName: "Play", color: "#64748b", size: "20" } } ] },
          { id: "l2_t", type: "Column", props: {}, children: [ { id: "t2a", type: "Text", props: { content: "2. Color Theory Basics", color: "#0f172a", fontSize: "15", fontFamily: "Inter", margin: "0 0 4px 0" } }, { id: "t2b", type: "Text", props: { content: "18:20 • Up Next", color: "#64748b", fontSize: "12" } } ] }
        ]}
      ]}
    ]
  },

  // ─── PREMIUM PAGES: BATCH 3 ───

  personalBlog: {
    id: "pb_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#0f172a", padding: "0" }, children: [
      { id: "pb_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800", width: "100%", height: "250px", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0" } },
      { id: "pb_prog", type: "ProgressBar", props: { progress: "0.3", color: "#818cf8", backgroundColor: "#334155", width: "100%", height: "4px", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0" } },
      { id: "pb_body", type: "Column", props: { padding: "32px", width: "100%" }, children: [
        { id: "pb_h1", type: "Text", props: { content: "The Future of Design Systems", color: "#f8fafc", fontSize: "32", fontFamily: "Playfair Display", margin: "0 0 16px 0" } },
        { id: "pb_meta", type: "Row", props: { gap: "12px", margin: "0 0 32px 0" }, children: [
           { id: "pb_av", type: "Image", props: { url: "https://i.pravatar.cc/150?img=47", width: "32px", height: "32px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } },
           { id: "pb_auth", type: "Text", props: { content: "Alex Rivera • 5 min read", color: "#94a3b8", fontSize: "14", fontFamily: "Inter" } }
        ]},
        { id: "pb_txt1", type: "Text", props: { content: "Design systems are evolving from static sticker sheets to dynamic, code-connected ecosystems...", color: "#cbd5e1", fontSize: "16", fontFamily: "Inter", margin: "0 0 24px 0", lineHeight: "1.6" } },
        { id: "pb_qt", type: "Container", props: { border: "l-4 solid #818cf8", padding: "0 0 0 16px", margin: "0 0 24px 0" }, children: [
           { id: "pb_qtxt", type: "Text", props: { content: "\"Consistency is not about making everything the same. It's about establishing a predictable rhythm.\"", color: "#818cf8", fontSize: "18", fontFamily: "Playfair Display", fontStyle: "italic" } }
        ]}
      ]}
    ]
  },

  restaurant: {
    id: "rest_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#1c1917", padding: "0" }, children: [
      { id: "rest_hero", type: "Container", props: { width: "100%", height: "350px", backgroundType: "gradient", gradientStart: "#7f1d1d", gradientEnd: "#450a0a" }, children: [
        { id: "rest_nav", type: "Row", props: { width: "100%", padding: "24px", mainAxisAlignment: "spaceBetween" }, children: [
           { id: "r_logo", type: "Text", props: { content: "LUMIÈRE", color: "#fca5a5", fontSize: "20", fontFamily: "Playfair Display", fontWeight: "bold", tracking: "widest" } },
           { id: "r_menu", type: "Icon", props: { iconName: "Menu", color: "#fca5a5", size: "24" } }
        ]},
        { id: "rest_h_col", type: "Column", props: { padding: "40px 24px", crossAxisAlignment: "center" }, children: [
           { id: "r_h1", type: "Text", props: { content: "A Culinary Journey.", color: "#ffffff", fontSize: "36", fontFamily: "Playfair Display", textAlign: "center", margin: "0 0 16px 0" } },
           { id: "r_btn", type: "Button", props: { label: "Book a Table", backgroundColor: "#b91c1c", color: "#ffffff", padding: "16px 32px", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0", fontFamily: "Inter" } }
        ]}
      ]},
      { id: "rest_menu", type: "Column", props: { padding: "40px 24px", width: "100%", crossAxisAlignment: "center" }, children: [
         { id: "rm_h", type: "Text", props: { content: "Tasting Menu", color: "#fca5a5", fontSize: "14", fontFamily: "Inter", tracking: "widest", margin: "0 0 32px 0" } },
         { id: "rm_i1", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 24px 0", border: "b 1px dashed rgba(252,165,165,0.3)", padding: "0 0 12px 0" }, children: [
            { id: "rmi_l1", type: "Text", props: { content: "Truffle Risotto", color: "#f5f5f4", fontSize: "18", fontFamily: "Playfair Display" } },
            { id: "rmi_r1", type: "Text", props: { content: "$42", color: "#fca5a5", fontSize: "16", fontFamily: "Inter" } }
         ]},
         { id: "rm_i2", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 24px 0", border: "b 1px dashed rgba(252,165,165,0.3)", padding: "0 0 12px 0" }, children: [
            { id: "rmi_l2", type: "Text", props: { content: "Wagyu Ribeye", color: "#f5f5f4", fontSize: "18", fontFamily: "Playfair Display" } },
            { id: "rmi_r2", type: "Text", props: { content: "$85", color: "#fca5a5", fontSize: "16", fontFamily: "Inter" } }
         ]}
      ]}
    ]
  },

  // ─── WIREFRAMES: BATCH 3 ───

  wfDash: {
    id: "wfd_root", type: "Row", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "0" }, children: [
      { id: "wfd_side", type: "Column", props: { width: "80px", height: "100%", backgroundColor: "#1f2937", padding: "24px 0", crossAxisAlignment: "center", gap: "32px", border: "r 1px solid #374151" }, children: [
        { id: "wfd_logo", type: "Container", props: { width: "40px", height: "40px", backgroundColor: "#4b5563", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" } },
        { id: "wfd_i1", type: "Container", props: { width: "24px", height: "24px", backgroundColor: "#374151", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
        { id: "wfd_i2", type: "Container", props: { width: "24px", height: "24px", backgroundColor: "#374151", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
        { id: "wfd_i3", type: "Container", props: { width: "24px", height: "24px", backgroundColor: "#374151", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
      ]},
      { id: "wfd_main", type: "Column", props: { flex: "1", padding: "32px", gap: "24px", width: "100%" }, children: [
        { id: "wfd_hdr", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
           { id: "wfd_h_l", type: "Container", props: { width: "150px", height: "32px", backgroundColor: "#374151", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" } },
           { id: "wfd_h_r", type: "Container", props: { width: "40px", height: "40px", backgroundColor: "#4b5563", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } }
        ]},
        { id: "wfd_cards", type: "Row", props: { gap: "16px", width: "100%", mainAxisAlignment: "spaceBetween" }, children: [
           { id: "wfd_c1", type: "Container", props: { width: "30%", height: "100px", backgroundColor: "#1f2937", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #374151" } },
           { id: "wfd_c2", type: "Container", props: { width: "30%", height: "100px", backgroundColor: "#1f2937", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #374151" } },
           { id: "wfd_c3", type: "Container", props: { width: "30%", height: "100px", backgroundColor: "#1f2937", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #374151" } }
        ]},
        { id: "wfd_chart", type: "Container", props: { width: "100%", height: "250px", backgroundColor: "#1f2937", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #374151" } }
      ]}
    ]
  },

  wfEcom: {
    id: "wfe_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "0" }, children: [
      { id: "wfe_nav", type: "Row", props: { mainAxisAlignment: "spaceBetween", padding: "24px", width: "100%", border: "b 1px solid #374151" }, children: [
        { id: "wfe_n1", type: "Container", props: { width: "100px", height: "24px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
        { id: "wfe_n2", type: "Container", props: { width: "32px", height: "32px", backgroundColor: "#374151", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } }
      ]},
      { id: "wfe_hero", type: "Container", props: { width: "100%", height: "200px", backgroundColor: "#1f2937", margin: "0 0 24px 0" } },
      { id: "wfe_b", type: "Column", props: { padding: "0 24px", gap: "24px", width: "100%" }, children: [
        { id: "wfe_f1", type: "Container", props: { width: "150px", height: "20px", backgroundColor: "#374151", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
        { id: "wfe_grid", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
           { id: "wfe_p1", type: "Column", props: { width: "47%", gap: "12px" }, children: [
              { id: "p1_i", type: "Container", props: { width: "100%", height: "160px", backgroundColor: "#374151", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } },
              { id: "p1_t", type: "Container", props: { width: "80%", height: "16px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
              { id: "p1_p", type: "Container", props: { width: "40%", height: "16px", backgroundColor: "#6b7280", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
           ]},
           { id: "wfe_p2", type: "Column", props: { width: "47%", gap: "12px" }, children: [
              { id: "p2_i", type: "Container", props: { width: "100%", height: "160px", backgroundColor: "#374151", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } },
              { id: "p2_t", type: "Container", props: { width: "80%", height: "16px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
              { id: "p2_p", type: "Container", props: { width: "40%", height: "16px", backgroundColor: "#6b7280", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
           ]}
        ]}
      ]}
    ]
  },

  wfMobile: {
    id: "wfm_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "0", mainAxisAlignment: "spaceBetween" }, children: [
      { id: "wfm_top", type: "Column", props: { width: "100%", padding: "40px 24px 24px", gap: "24px" }, children: [
        { id: "wfm_nav", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
          { id: "n1", type: "Container", props: { width: "40px", height: "40px", backgroundColor: "#374151", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } },
          { id: "n2", type: "Container", props: { width: "120px", height: "24px", backgroundColor: "#4b5563", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" } },
          { id: "n3", type: "Container", props: { width: "40px", height: "40px", backgroundColor: "#374151", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } }
        ]},
        { id: "wfm_story", type: "Row", props: { gap: "16px", width: "100%", scrollDirection: "horizontal" }, children: [
           { id: "s1", type: "Container", props: { width: "64px", height: "64px", backgroundColor: "#4b5563", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32", border: "2px solid #9ca3af" } },
           { id: "s2", type: "Container", props: { width: "64px", height: "64px", backgroundColor: "#374151", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32" } },
           { id: "s3", type: "Container", props: { width: "64px", height: "64px", backgroundColor: "#374151", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32" } },
           { id: "s4", type: "Container", props: { width: "64px", height: "64px", backgroundColor: "#374151", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32" } }
        ]},
        { id: "wfm_feed", type: "Container", props: { width: "100%", height: "300px", backgroundColor: "#1f2937", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", border: "1px solid #374151" } }
      ]},
      { id: "wfm_bot", type: "Row", props: { width: "100%", padding: "24px 32px", backgroundColor: "#1f2937", mainAxisAlignment: "spaceBetween", border: "t 1px solid #374151" }, children: [
         { id: "b1", type: "Container", props: { width: "24px", height: "24px", backgroundColor: "#9ca3af", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
         { id: "b2", type: "Container", props: { width: "24px", height: "24px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
         { id: "b3", type: "Container", props: { width: "48px", height: "48px", backgroundColor: "#6b7280", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", margin: "-20px 0 0 0" } },
         { id: "b4", type: "Container", props: { width: "24px", height: "24px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
         { id: "b5", type: "Container", props: { width: "24px", height: "24px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
      ]}
    ]
  },

  // ─── WIREFRAMES: BATCH 4 ───

  wfSaas: {
    id: "wfs_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "0" }, children: [
      { id: "wfs_nav", type: "Row", props: { mainAxisAlignment: "spaceBetween", padding: "24px", border: "b 1px solid #374151", width: "100%" }, children: [
        { id: "n1", type: "Container", props: { width: "120px", height: "24px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
        { id: "n2", type: "Row", props: { gap: "16px" }, children: [
           { id: "i1", type: "Container", props: { width: "40px", height: "16px", backgroundColor: "#374151", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
           { id: "i2", type: "Container", props: { width: "80px", height: "32px", backgroundColor: "#6b7280", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" } }
        ]}
      ]},
      { id: "wfs_hero", type: "Column", props: { padding: "48px 24px", crossAxisAlignment: "center", gap: "16px", width: "100%" }, children: [
        { id: "h1", type: "Container", props: { width: "60%", height: "40px", backgroundColor: "#6b7280", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" } },
        { id: "h2", type: "Container", props: { width: "40%", height: "16px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
        { id: "h3", type: "Container", props: { width: "140px", height: "48px", backgroundColor: "#9ca3af", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", margin: "16px 0 0 0" } }
      ]},
      { id: "wfs_feat", type: "Row", props: { width: "100%", padding: "24px", gap: "16px", mainAxisAlignment: "spaceBetween" }, children: [
        { id: "f1", type: "Container", props: { width: "30%", height: "120px", backgroundColor: "#1f2937", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #374151" } },
        { id: "f2", type: "Container", props: { width: "30%", height: "120px", backgroundColor: "#1f2937", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #374151" } },
        { id: "f3", type: "Container", props: { width: "30%", height: "120px", backgroundColor: "#1f2937", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #374151" } }
      ]}
    ]
  },

  wfBlog: {
    id: "wfb_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "24px" }, children: [
       { id: "wfb_n", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 32px 0" }, children: [
          { id: "n1", type: "Container", props: { width: "40px", height: "40px", backgroundColor: "#374151", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } },
          { id: "n2", type: "Container", props: { width: "100px", height: "20px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
       ]},
       { id: "wfb_feat", type: "Container", props: { width: "100%", height: "180px", backgroundColor: "#1f2937", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 24px 0" } },
       { id: "wfb_l1", type: "Row", props: { width: "100%", gap: "16px", margin: "0 0 16px 0" }, children: [
          { id: "l1_i", type: "Container", props: { width: "80px", height: "80px", backgroundColor: "#374151", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" } },
          { id: "l1_t", type: "Column", props: { gap: "8px", flex: "1" }, children: [
             { id: "t1", type: "Container", props: { width: "80%", height: "16px", backgroundColor: "#6b7280", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
             { id: "t2", type: "Container", props: { width: "40%", height: "12px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
          ]}
       ]},
       { id: "wfb_l2", type: "Row", props: { width: "100%", gap: "16px" }, children: [
          { id: "l2_i", type: "Container", props: { width: "80px", height: "80px", backgroundColor: "#374151", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" } },
          { id: "l2_t", type: "Column", props: { gap: "8px", flex: "1" }, children: [
             { id: "t3", type: "Container", props: { width: "90%", height: "16px", backgroundColor: "#6b7280", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
             { id: "t4", type: "Container", props: { width: "50%", height: "12px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
          ]}
       ]}
    ]
  },

  wfPortfolio: {
    id: "wfp_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "32px", crossAxisAlignment: "center" }, children: [
       { id: "p_av", type: "Container", props: { width: "96px", height: "96px", backgroundColor: "#4b5563", radiusTopLeft: "48", radiusTopRight: "48", radiusBottomLeft: "48", radiusBottomRight: "48", margin: "0 0 24px 0", border: "4px solid #374151" } },
       { id: "p_t1", type: "Container", props: { width: "60%", height: "32px", backgroundColor: "#9ca3af", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6", margin: "0 0 16px 0" } },
       { id: "p_t2", type: "Container", props: { width: "40%", height: "16px", backgroundColor: "#6b7280", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4", margin: "0 0 48px 0" } },
       { id: "p_g", type: "Row", props: { width: "100%", mainAxisAlignment: "spaceBetween" }, children: [
          { id: "g1", type: "Container", props: { width: "47%", height: "140px", backgroundColor: "#1f2937", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } },
          { id: "g2", type: "Container", props: { width: "47%", height: "140px", backgroundColor: "#1f2937", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } }
       ]}
    ]
  },

  wfMarket: {
    id: "wfmkt_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "0" }, children: [
       { id: "m_h", type: "Row", props: { width: "100%", padding: "24px", border: "b 1px solid #374151" }, children: [
          { id: "sbar", type: "Container", props: { width: "100%", height: "48px", backgroundColor: "#1f2937", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", border: "1px solid #374151" } }
       ]},
       { id: "m_c", type: "Row", props: { width: "100%", padding: "16px 24px", gap: "12px", border: "b 1px solid #1f2937" }, children: [
          { id: "c1", type: "Container", props: { width: "64px", height: "24px", backgroundColor: "#374151", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } },
          { id: "c2", type: "Container", props: { width: "80px", height: "24px", backgroundColor: "#374151", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } },
          { id: "c3", type: "Container", props: { width: "72px", height: "24px", backgroundColor: "#374151", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
       ]},
       { id: "m_l", type: "Column", props: { width: "100%", padding: "24px", gap: "16px" }, children: [
          { id: "i1", type: "Row", props: { width: "100%", gap: "16px", backgroundColor: "#1f2937", padding: "12px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [
             { id: "i1_img", type: "Container", props: { width: "80px", height: "80px", backgroundColor: "#374151", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" } },
             { id: "i1_t", type: "Column", props: { gap: "8px", flex: "1", mainAxisAlignment: "center" }, children: [
                { id: "i1_t1", type: "Container", props: { width: "90%", height: "16px", backgroundColor: "#6b7280", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
                { id: "i1_t2", type: "Container", props: { width: "40%", height: "12px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
             ]}
          ]},
          { id: "i2", type: "Row", props: { width: "100%", gap: "16px", backgroundColor: "#1f2937", padding: "12px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [
             { id: "i2_img", type: "Container", props: { width: "80px", height: "80px", backgroundColor: "#374151", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" } },
             { id: "i2_t", type: "Column", props: { gap: "8px", flex: "1", mainAxisAlignment: "center" }, children: [
                { id: "i2_t1", type: "Container", props: { width: "70%", height: "16px", backgroundColor: "#6b7280", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
                { id: "i2_t2", type: "Container", props: { width: "50%", height: "12px", backgroundColor: "#4b5563", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
             ]}
          ]}
       ]}
    ]
  },

  wfAdmin: {
    id: "wfa_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "24px" }, children: [
       { id: "a_h", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 32px 0" }, children: [
          { id: "h1", type: "Container", props: { width: "120px", height: "24px", backgroundColor: "#6b7280", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } },
          { id: "h2", type: "Container", props: { width: "80px", height: "32px", backgroundColor: "#4b5563", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" } }
       ]},
       { id: "a_t", type: "Container", props: { width: "100%", height: "200px", backgroundColor: "#1f2937", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #374151", padding: "16px" }, children: [
          { id: "tr1", type: "Row", props: { mainAxisAlignment: "spaceBetween", border: "b 1px solid #374151", padding: "0 0 12px 0", margin: "0 0 12px 0" }, children: [
             { id: "th1", type: "Container", props: { width: "20%", height: "12px", backgroundColor: "#4b5563", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } },
             { id: "th2", type: "Container", props: { width: "30%", height: "12px", backgroundColor: "#4b5563", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } },
             { id: "th3", type: "Container", props: { width: "20%", height: "12px", backgroundColor: "#4b5563", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } }
          ]},
          { id: "tr2", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 16px 0" }, children: [
             { id: "td1", type: "Container", props: { width: "20%", height: "12px", backgroundColor: "#6b7280", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } },
             { id: "td2", type: "Container", props: { width: "30%", height: "12px", backgroundColor: "#6b7280", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } },
             { id: "td3", type: "Container", props: { width: "10%", height: "12px", backgroundColor: "#9ca3af", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } }
          ]},
          { id: "tr3", type: "Row", props: { mainAxisAlignment: "spaceBetween" }, children: [
             { id: "td4", type: "Container", props: { width: "20%", height: "12px", backgroundColor: "#6b7280", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } },
             { id: "td5", type: "Container", props: { width: "30%", height: "12px", backgroundColor: "#6b7280", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } },
             { id: "td6", type: "Container", props: { width: "10%", height: "12px", backgroundColor: "#9ca3af", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } }
          ]}
       ]}
    ]
  },

  wfChat: {
    id: "wfc_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#111827", padding: "0", mainAxisAlignment: "spaceBetween" }, children: [
       { id: "wfc_h", type: "Row", props: { padding: "20px 24px", backgroundColor: "#1f2937", border: "b 1px solid #374151", gap: "16px" }, children: [
          { id: "a1", type: "Container", props: { width: "32px", height: "32px", backgroundColor: "#4b5563", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } },
          { id: "a2", type: "Container", props: { width: "100px", height: "16px", backgroundColor: "#9ca3af", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4" } }
       ]},
       { id: "wfc_b", type: "Column", props: { padding: "24px", gap: "16px", flex: "1", width: "100%" }, children: [
          { id: "m1", type: "Row", props: { width: "100%", mainAxisAlignment: "start" }, children: [
             { id: "b1", type: "Container", props: { width: "60%", height: "40px", backgroundColor: "#374151", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
          ]},
          { id: "m2", type: "Row", props: { width: "100%", mainAxisAlignment: "end" }, children: [
             { id: "b2", type: "Container", props: { width: "50%", height: "40px", backgroundColor: "#4b5563", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
          ]},
          { id: "m3", type: "Row", props: { width: "100%", mainAxisAlignment: "start" }, children: [
             { id: "b3", type: "Container", props: { width: "70%", height: "64px", backgroundColor: "#374151", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
          ]}
       ]},
       { id: "wfc_f", type: "Row", props: { padding: "16px 24px", backgroundColor: "#1f2937", border: "t 1px solid #374151", gap: "16px" }, children: [
          { id: "f1", type: "Container", props: { flex: "1", height: "40px", backgroundColor: "#374151", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } },
          { id: "f2", type: "Container", props: { width: "40px", height: "40px", backgroundColor: "#6b7280", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } }
       ]}
    ]
  },

  // ─── ANIMATED CARDS: BATCH 5 ───

  nftCard: {
    id: "nftc_root", type: "Container", props: { width: "100%", padding: "16px", backgroundColor: "#1e1b4b", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", border: "1px solid #4c1d95", shadowColor: "#4c1d95", shadowBlur: "40", animationType: "slideUp", animationDuration: "0.6" },
    children: [
      { id: "nftc_img_wrap", type: "Container", props: { width: "100%", margin: "0 0 16px 0", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", overflow: "hidden" }, children: [
         { id: "nftc_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1614590164655-0814fccb9826?w=600&q=80", width: "100%", height: "240px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } }
      ]},
      { id: "nftc_row1", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 8px 0" }, children: [
         { id: "nftc_badge", type: "Container", props: { padding: "4px 8px", backgroundColor: "#ec4899", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" }, children: [
            { id: "nftc_bt", type: "Text", props: { content: "LEGENDARY", color: "#ffffff", fontSize: "10", fontFamily: "Inter", fontWeight: "bold", tracking: "widest" } }
         ]},
         { id: "nftc_fav", type: "Icon", props: { iconName: "Heart", color: "#ec4899", size: "20" } }
      ]},
      { id: "nftc_title", type: "Text", props: { content: "Cosmic Voyager #77", color: "#ffffff", fontSize: "18", fontFamily: "Inter", margin: "0 0 16px 0", fontWeight: "bold" } },
      { id: "nftc_row2", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", padding: "12px", backgroundColor: "rgba(0,0,0,0.3)", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid rgba(255,255,255,0.1)" }, children: [
         { id: "nftc_b_col", type: "Column", props: {}, children: [
            { id: "nftc_bl", type: "Text", props: { content: "Current Bid", color: "#a78bfa", fontSize: "10", margin: "0 0 4px 0" } },
            { id: "nftc_bv", type: "Text", props: { content: "2.4 ETH", color: "#ffffff", fontSize: "16", fontFamily: "Inter", fontWeight: "bold" } }
         ]},
         { id: "nftc_t_col", type: "Column", props: { crossAxisAlignment: "end" }, children: [
            { id: "nftc_tl", type: "Text", props: { content: "Ends In", color: "#a78bfa", fontSize: "10", margin: "0 0 4px 0" } },
            { id: "nftc_tv", type: "Text", props: { content: "04:12:30", color: "#ffffff", fontSize: "16", fontFamily: "Inter", fontWeight: "bold" } }
         ]}
      ]}
    ]
  },

  glassCard: {
    id: "glc_root", type: "Container", props: { width: "100%", height: "220px", padding: "24px", backgroundType: "gradient", gradientStart: "rgba(99,102,241,0.2)", gradientEnd: "rgba(14,165,233,0.1)", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", shadowColor: "rgba(14,165,233,0.3)", shadowBlur: "30", shadowOffsetY: "15", border: "1px solid rgba(255,255,255,0.2)", animationType: "scale", animationDuration: "0.5" },
    children: [
      { id: "glc_r1", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 40px 0", width: "100%" }, children: [
        { id: "glc_chip", type: "Container", props: { width: "40px", height: "28px", backgroundColor: "rgba(255,255,255,0.4)", radiusTopLeft: "4", radiusTopRight: "4", radiusBottomLeft: "4", radiusBottomRight: "4", border: "1px solid rgba(255,255,255,0.5)" } },
        { id: "glc_logo", type: "Text", props: { content: "VISA", color: "#ffffff", fontSize: "24", fontFamily: "Inter", fontWeight: "bold", fontStyle: "italic" } }
      ]},
      { id: "glc_num", type: "Text", props: { content: "4281  9012  3456  7890", color: "#ffffff", fontSize: "22", fontFamily: "monospace", tracking: "widest", margin: "0 0 24px 0" } },
      { id: "glc_r2", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
        { id: "glc_name_col", type: "Column", props: {}, children: [
           { id: "glc_nl", type: "Text", props: { content: "CARDHOLDER", color: "rgba(255,255,255,0.6)", fontSize: "10", margin: "0 0 4px 0", tracking: "widest" } },
           { id: "glc_nv", type: "Text", props: { content: "ALEX RIVERA", color: "#ffffff", fontSize: "14", fontFamily: "Inter", tracking: "widest", fontWeight: "bold" } }
        ]},
        { id: "glc_exp_col", type: "Column", props: { crossAxisAlignment: "end" }, children: [
           { id: "glc_el", type: "Text", props: { content: "EXPIRES", color: "rgba(255,255,255,0.6)", fontSize: "10", margin: "0 0 4px 0", tracking: "widest" } },
           { id: "glc_ev", type: "Text", props: { content: "12/28", color: "#ffffff", fontSize: "14", fontFamily: "Inter", tracking: "widest", fontWeight: "bold" } }
        ]}
      ]}
    ]
  },

  profileCard: {
    id: "profc_root", type: "Column", props: { width: "100%", padding: "24px", backgroundColor: "#1e293b", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", border: "1px solid #334155", crossAxisAlignment: "center", shadowColor: "rgba(0,0,0,0.2)", shadowBlur: "20", animationType: "fade", animationDuration: "0.4" }, children: [
      { id: "profc_av", type: "Image", props: { url: "https://i.pravatar.cc/150?img=68", width: "80px", height: "80px", radiusTopLeft: "40", radiusTopRight: "40", radiusBottomLeft: "40", radiusBottomRight: "40", border: "3px solid #f59e0b", margin: "0 0 16px 0" } },
      { id: "profc_n", type: "Text", props: { content: "David Park", color: "#f8fafc", fontSize: "20", fontFamily: "Inter", fontWeight: "bold", margin: "0 0 4px 0" } },
      { id: "profc_r", type: "Text", props: { content: "Senior UX Engineer", color: "#f59e0b", fontSize: "14", margin: "0 0 16px 0" } },
      { id: "profc_b", type: "Text", props: { content: "Crafting digital experiences that merge code and aesthetics.", color: "#94a3b8", fontSize: "14", textAlign: "center", margin: "0 0 24px 0", lineHeight: "1.5" } },
      { id: "profc_soc", type: "Row", props: { gap: "16px", margin: "0 0 24px 0", mainAxisAlignment: "center", width: "100%" }, children: [
         { id: "s1", type: "Container", props: { padding: "8px", backgroundColor: "#0f172a", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [ { id: "si1", type: "Icon", props: { iconName: "Twitter", color: "#ef4444", size: "18" } } ] },
         { id: "s2", type: "Container", props: { padding: "8px", backgroundColor: "#0f172a", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [ { id: "si2", type: "Icon", props: { iconName: "Github", color: "#f8fafc", size: "18" } } ] },
         { id: "s3", type: "Container", props: { padding: "8px", backgroundColor: "#0f172a", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [ { id: "si3", type: "Icon", props: { iconName: "Dribbble", color: "#f59e0b", size: "18" } } ] }
      ]},
      { id: "profc_btn", type: "Button", props: { label: "Follow", backgroundColor: "#ef4444", color: "#ffffff", width: "100%", padding: "12px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", fontWeight: "bold" } }
    ]
  },

  pricingCard: {
    id: "pric_root", type: "Column", props: { width: "100%", padding: "32px", backgroundColor: "#0f172a", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", border: "2px solid #8b5cf6", shadowColor: "rgba(139,92,246,0.2)", shadowBlur: "40", shadowOffsetY: "10", animationType: "slideUp" }, children: [
      { id: "pric_tag", type: "Container", props: { padding: "6px 12px", backgroundColor: "rgba(139,92,246,0.2)", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 24px 0" }, children: [
         { id: "pric_tt", type: "Text", props: { content: "MOST POPULAR", color: "#a78bfa", fontSize: "10", fontWeight: "bold", tracking: "widest" } }
      ]},
      { id: "pric_n", type: "Text", props: { content: "Pro Plan", color: "#ffffff", fontSize: "24", fontFamily: "Inter", fontWeight: "bold", margin: "0 0 12px 0" } },
      { id: "pric_p_row", type: "Row", props: { crossAxisAlignment: "end", margin: "0 0 16px 0" }, children: [
         { id: "pric_p", type: "Text", props: { content: "$29", color: "#ffffff", fontSize: "48", fontFamily: "Inter", fontWeight: "bold" } },
         { id: "pric_m", type: "Text", props: { content: "/month", color: "#94a3b8", fontSize: "16", margin: "0 0 8px 4px" } }
      ]},
      { id: "pric_d", type: "Text", props: { content: "Everything you need to scale your startup to the next level.", color: "#94a3b8", fontSize: "14", margin: "0 0 32px 0", lineHeight: "1.5" } },
      { id: "pric_fl", type: "Column", props: { gap: "16px", margin: "0 0 32px 0", width: "100%" }, children: [
         { id: "pf1", type: "Row", props: { gap: "12px", width: "100%" }, children: [ { id: "pfi1", type: "Icon", props: { iconName: "CheckCircle2", color: "#a78bfa", size: "18" } }, { id: "pft1", type: "Text", props: { content: "Unlimited Projects", color: "#e2e8f0", fontSize: "14" } } ] },
         { id: "pf2", type: "Row", props: { gap: "12px", width: "100%" }, children: [ { id: "pfi2", type: "Icon", props: { iconName: "CheckCircle2", color: "#a78bfa", size: "18" } }, { id: "pft2", type: "Text", props: { content: "Custom Domains", color: "#e2e8f0", fontSize: "14" } } ] },
         { id: "pf3", type: "Row", props: { gap: "12px", width: "100%" }, children: [ { id: "pfi3", type: "Icon", props: { iconName: "CheckCircle2", color: "#a78bfa", size: "18" } }, { id: "pft3", type: "Text", props: { content: "Priority 24/7 Support", color: "#e2e8f0", fontSize: "14" } } ] },
         { id: "pf4", type: "Row", props: { gap: "12px", width: "100%" }, children: [ { id: "pfi4", type: "Icon", props: { iconName: "CheckCircle2", color: "#a78bfa", size: "18" } }, { id: "pft4", type: "Text", props: { content: "Advanced Analytics", color: "#e2e8f0", fontSize: "14" } } ] }
      ]},
      { id: "pric_btn", type: "Button", props: { label: "Get Started", backgroundColor: "#8b5cf6", color: "#ffffff", width: "100%", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", shadowColor: "#8b5cf6", shadowBlur: "20", shadowOffsetY: "8", fontWeight: "bold" } }
    ]
  },

  musicCard: {
    id: "musc_root", type: "Row", props: { width: "100%", padding: "16px", backgroundColor: "#18181b", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20", border: "1px solid #27272a", gap: "16px", crossAxisAlignment: "center", shadowColor: "rgba(0,0,0,0.5)", shadowBlur: "20" }, children: [
      { id: "musc_art", type: "Image", props: { url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200", width: "80px", height: "80px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", shadowColor: "#1db954", shadowBlur: "15" } },
      { id: "musc_body", type: "Column", props: { flex: "1", mainAxisAlignment: "center" }, children: [
         { id: "musc_r1", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 4px 0" }, children: [
            { id: "musc_t", type: "Text", props: { content: "Midnight City", color: "#f8fafc", fontSize: "16", fontFamily: "Inter", fontWeight: "bold" } },
            { id: "musc_fav", type: "Icon", props: { iconName: "Heart", color: "#1db954", size: "16" } }
         ]},
         { id: "musc_a", type: "Text", props: { content: "M83", color: "#94a3b8", fontSize: "12", margin: "0 0 12px 0" } },
         { id: "musc_ctrl", type: "Row", props: { width: "100%", mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, children: [
            { id: "musc_pb", type: "ProgressBar", props: { progress: "0.6", width: "60%", height: "4px", backgroundColor: "#3f3f46", color: "#1db954", radiusTopLeft: "2", radiusTopRight: "2", radiusBottomLeft: "2", radiusBottomRight: "2" } },
            { id: "musc_btns", type: "Row", props: { gap: "12px" }, children: [
               { id: "mb1", type: "Icon", props: { iconName: "SkipBack", color: "#d4d4d8", size: "16" } },
               { id: "mb2", type: "Icon", props: { iconName: "Pause", color: "#1db954", size: "16" } },
               { id: "mb3", type: "Icon", props: { iconName: "SkipForward", color: "#d4d4d8", size: "16" } }
            ]}
         ]}
      ]}
    ]
  },

  testimonialCard: {
    id: "testc_root", type: "Column", props: { width: "100%", padding: "32px", backgroundColor: "#ffffff", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", border: "1px solid #e2e8f0", shadowColor: "rgba(0,0,0,0.05)", shadowBlur: "20", shadowOffsetY: "10" }, children: [
      { id: "testc_stars", type: "Row", props: { gap: "4px", margin: "0 0 20px 0" }, children: [
         { id: "st1", type: "Icon", props: { iconName: "Star", color: "#f59e0b", size: "20" } },
         { id: "st2", type: "Icon", props: { iconName: "Star", color: "#f59e0b", size: "20" } },
         { id: "st3", type: "Icon", props: { iconName: "Star", color: "#f59e0b", size: "20" } },
         { id: "st4", type: "Icon", props: { iconName: "Star", color: "#f59e0b", size: "20" } },
         { id: "st5", type: "Icon", props: { iconName: "Star", color: "#f59e0b", size: "20" } }
      ]},
      { id: "testc_q", type: "Text", props: { content: "\"Switching to AppForge was the best decision for our agency. We're building full mobile apps in literally 1/10th of the time it used to take us. Absolute game changer.\"", color: "#334155", fontSize: "16", fontFamily: "Inter", lineHeight: "1.6", fontStyle: "italic", margin: "0 0 32px 0" } },
      { id: "testc_u", type: "Row", props: { gap: "16px", crossAxisAlignment: "center" }, children: [
         { id: "tu_av", type: "Image", props: { url: "https://i.pravatar.cc/150?img=32", width: "48px", height: "48px", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24" } },
         { id: "tu_c", type: "Column", props: {}, children: [
            { id: "tu_n", type: "Text", props: { content: "Sarah Jenkins", color: "#0f172a", fontSize: "14", fontFamily: "Inter", fontWeight: "bold" } },
            { id: "tu_r", type: "Text", props: { content: "CTO @ CreativePulse", color: "#64748b", fontSize: "12" } }
         ]}
      ]}
    ]
  },

  // ─── BATCH 6: HOLOGRAPHIC CARD & BUTTON PACKS ───

  holoCard: {
    id: "holo_root", type: "Column", props: { width: "100%", padding: "2px", backgroundType: "gradient", gradientStart: "#ec4899", gradientEnd: "#8b5cf6", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", shadowColor: "rgba(236,72,153,0.3)", shadowBlur: "30", shadowOffsetY: "10" }, 
    children: [
      { id: "holo_inner", type: "Column", props: { backgroundColor: "#0f172a", width: "100%", radiusTopLeft: "22", radiusTopRight: "22", radiusBottomLeft: "22", radiusBottomRight: "22", padding: "20px" }, children: [
         { id: "hc_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600", width: "100%", height: "200px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 20px 0" } },
         { id: "hc_row", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 8px 0" }, children: [
            { id: "hc_t1", type: "Text", props: { content: "Sony WH-1000XM4", color: "#ffffff", fontSize: "18", fontFamily: "Inter", fontWeight: "bold" } },
            { id: "hc_t2", type: "Text", props: { content: "$348", color: "#f472b6", fontSize: "18", fontFamily: "Inter", fontWeight: "bold" } }
         ]},
         { id: "hc_t3", type: "Text", props: { content: "Premium Noise Cancelling Headphones with holographic foil wrap.", color: "#94a3b8", fontSize: "12", margin: "0 0 24px 0", lineHeight: "1.5" } },
         { id: "hc_btn", type: "Button", props: { label: "Add to Cart", backgroundType: "gradient", gradientStart: "#ec4899", gradientEnd: "#8b5cf6", color: "#ffffff", width: "100%", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", fontWeight: "bold" } }
      ]}
    ]
  },

  gradientBtn: {
    id: "gbtn_root", type: "Column", props: { width: "100%", padding: "32px", gap: "20px", backgroundColor: "#09090b", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [
      { id: "gb1", type: "Button", props: { label: "Primary Action", backgroundType: "gradient", gradientStart: "#6366f1", gradientEnd: "#ec4899", color: "#ffffff", padding: "18px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", fontWeight: "bold", tracking: "wider" } },
      { id: "gb2", type: "Button", props: { label: "Secondary Sweep", backgroundType: "gradient", gradientStart: "#10b981", gradientEnd: "#3b82f6", color: "#ffffff", padding: "18px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", fontWeight: "bold", tracking: "wider" } }
    ]
  },

  neonBtn: {
    id: "nbtn_root", type: "Column", props: { width: "100%", padding: "32px", gap: "24px", backgroundColor: "#000000", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [
      { id: "nb1", type: "Button", props: { label: "CYAN GLOW", backgroundColor: "transparent", border: "2px solid #22d3ee", color: "#22d3ee", padding: "18px", width: "100%", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", shadowColor: "#22d3ee", shadowBlur: "20", shadowOffsetY: "0", fontWeight: "bold", tracking: "widest" } },
      { id: "nb2", type: "Button", props: { label: "MAGENTA PULSE", backgroundColor: "transparent", border: "2px solid #f472b6", color: "#f472b6", padding: "18px", width: "100%", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", shadowColor: "#f472b6", shadowBlur: "20", shadowOffsetY: "0", fontWeight: "bold", tracking: "widest" } }
    ]
  },

  magnetBtn: {
    id: "mbtn_root", type: "Column", props: { width: "100%", padding: "40px", gap: "24px", backgroundColor: "#f8fafc", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [
      { id: "mb1", type: "Button", props: { label: "Magnetic Pull", backgroundColor: "#f59e0b", color: "#ffffff", padding: "20px 40px", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32", shadowColor: "rgba(245,158,11,0.3)", shadowBlur: "20", shadowOffsetY: "10", fontWeight: "bold", fontSize: "16" } },
      { id: "mb2", type: "Button", props: { label: "Hover Me", backgroundColor: "#ef4444", color: "#ffffff", padding: "16px 32px", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", shadowColor: "rgba(239,68,68,0.3)", shadowBlur: "15", shadowOffsetY: "8", fontWeight: "bold" } }
    ]
  },

  liquidBtn: {
    id: "lbtn_root", type: "Column", props: { width: "100%", padding: "32px", gap: "24px", backgroundColor: "#0f172a", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [
      { id: "lb1", type: "Button", props: { label: "Liquid Fill UI", backgroundColor: "transparent", border: "2px solid #38bdf8", color: "#38bdf8", padding: "18px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", fontWeight: "bold", tracking: "wider" } },
      { id: "lb2", type: "Button", props: { label: "Wave Effect", backgroundColor: "transparent", border: "2px solid #10b981", color: "#10b981", padding: "18px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", fontWeight: "bold", tracking: "wider" } }
    ]
  },

  pushBtn: {
    id: "pbtn_root", type: "Column", props: { width: "100%", padding: "40px", gap: "32px", backgroundColor: "#e2e8f0", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [
      { id: "pb1", type: "Button", props: { label: "3D PUSH BUTTON", backgroundColor: "#3b82f6", color: "#ffffff", padding: "20px", width: "100%", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", shadowColor: "#1e3a8a", shadowBlur: "0", shadowOffsetY: "8", fontWeight: "bold", fontSize: "16", tracking: "widest" } },
      { id: "pb2", type: "Button", props: { label: "SECONDARY", backgroundColor: "#64748b", color: "#ffffff", padding: "20px", width: "100%", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", shadowColor: "#334155", shadowBlur: "0", shadowOffsetY: "8", fontWeight: "bold", fontSize: "16", tracking: "widest" } }
    ]
  },

  // ─── FINAL BUTTONS & NAVBARS: BATCH 7 ───

  morphBtn: {
    id: "mrfb_root", type: "Column", props: { width: "100%", padding: "40px", gap: "24px", backgroundColor: "#f8fafc", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [
      { id: "mb_row", type: "Row", props: { gap: "24px", mainAxisAlignment: "center" }, children: [
         { id: "mb_1", type: "Container", props: { width: "64px", height: "64px", backgroundColor: "#7c3aed", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32", padding: "20px", shadowColor: "rgba(124,58,237,0.4)", shadowBlur: "20", shadowOffsetY: "8" }, children: [
            { id: "mi_1", type: "Icon", props: { iconName: "Play", color: "#ffffff", size: "24" } }
         ]},
         { id: "mb_2", type: "Container", props: { width: "64px", height: "64px", backgroundColor: "#2563eb", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32", padding: "20px", shadowColor: "rgba(37,99,235,0.4)", shadowBlur: "20", shadowOffsetY: "8" }, children: [
            { id: "mi_2", type: "Icon", props: { iconName: "Plus", color: "#ffffff", size: "24" } }
         ]}
      ]},
      { id: "mb_hint", type: "Text", props: { content: "Icons morph to Pause / Check on tap.", color: "#64748b", fontSize: "12", fontFamily: "Inter", tracking: "widest" } }
    ]
  },

  brutalistBtn: {
    id: "brutb_root", type: "Column", props: { width: "100%", padding: "40px", gap: "32px", backgroundColor: "#ffffff", crossAxisAlignment: "center", mainAxisAlignment: "center" }, children: [
      { id: "brtb_1", type: "Button", props: { label: "CONFIRM", backgroundColor: "#facc15", color: "#000000", padding: "20px 40px", width: "100%", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0", border: "4px solid #000000", shadowColor: "#000000", shadowBlur: "0", shadowOffsetX: "8", shadowOffsetY: "8", fontWeight: "bold", fontFamily: "monospace", fontSize: "20", tracking: "widest" } },
      { id: "brtb_2", type: "Button", props: { label: "CANCEL", backgroundColor: "#ffffff", color: "#000000", padding: "20px 40px", width: "100%", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0", border: "4px solid #000000", shadowColor: "#000000", shadowBlur: "0", shadowOffsetX: "8", shadowOffsetY: "8", fontWeight: "bold", fontFamily: "monospace", fontSize: "20", tracking: "widest" } }
    ]
  },

  sideNav: {
    id: "snav_root", type: "Column", props: { width: "260px", height: "100%", backgroundColor: "#0f172a", border: "r 1px solid #1e293b", padding: "24px 16px", mainAxisAlignment: "spaceBetween" }, children: [
      { id: "sn_top", type: "Column", props: { width: "100%", gap: "8px" }, children: [
         { id: "sn_logo_row", type: "Row", props: { gap: "12px", margin: "0 0 32px 0", padding: "0 8px", crossAxisAlignment: "center" }, children: [
            { id: "sn_l_ic", type: "Container", props: { width: "32px", height: "32px", backgroundColor: "linear-gradient(135deg, #6366f1, #8b5cf6)", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" } },
            { id: "sn_l_t", type: "Text", props: { content: "Workspace", color: "#f8fafc", fontSize: "16", fontFamily: "Inter", fontWeight: "bold" } }
         ]},
         { id: "sn_i1", type: "Row", props: { gap: "12px", padding: "12px", backgroundColor: "#1e293b", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", crossAxisAlignment: "center" }, children: [
            { id: "si_1", type: "Icon", props: { iconName: "LayoutDashboard", color: "#6366f1", size: "20" } },
            { id: "st_1", type: "Text", props: { content: "Dashboard", color: "#f8fafc", fontSize: "14", fontFamily: "Inter" } }
         ]},
         { id: "sn_i2", type: "Row", props: { gap: "12px", padding: "12px", backgroundColor: "transparent", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", crossAxisAlignment: "center" }, children: [
            { id: "si_2", type: "Icon", props: { iconName: "Users", color: "#64748b", size: "20" } },
            { id: "st_2", type: "Text", props: { content: "Team", color: "#cbd5e1", fontSize: "14", fontFamily: "Inter" } }
         ]},
         { id: "sn_i3", type: "Row", props: { gap: "12px", padding: "12px", backgroundColor: "transparent", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", crossAxisAlignment: "center", mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
            { id: "sn_i3_l", type: "Row", props: { gap: "12px" }, children: [
               { id: "si_3", type: "Icon", props: { iconName: "MessageSquare", color: "#64748b", size: "20" } },
               { id: "st_3", type: "Text", props: { content: "Messages", color: "#cbd5e1", fontSize: "14", fontFamily: "Inter" } }
            ]},
            { id: "sn_bdg", type: "Container", props: { padding: "2px 6px", backgroundColor: "#ef4444", radiusTopLeft: "10", radiusTopRight: "10", radiusBottomLeft: "10", radiusBottomRight: "10" }, children: [
               { id: "snb_t", type: "Text", props: { content: "3", color: "#ffffff", fontSize: "10", fontWeight: "bold" } }
            ]}
         ]}
      ]},
      { id: "sn_bot", type: "Row", props: { gap: "12px", padding: "12px", border: "t 1px solid #1e293b", width: "100%", crossAxisAlignment: "center" }, children: [
         { id: "sb_ic", type: "Image", props: { url: "https://i.pravatar.cc/150?img=11", width: "32px", height: "32px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } },
         { id: "sb_t", type: "Text", props: { content: "Settings", color: "#cbd5e1", fontSize: "14", fontFamily: "Inter" } }
      ]}
    ]
  },

  dockNav: {
    id: "dk_root", type: "Row", props: { width: "100%", padding: "20px", mainAxisAlignment: "center", backgroundColor: "transparent", position: "absolute", bottom: "0" }, children: [
      { id: "dk_bar", type: "Row", props: { gap: "16px", padding: "12px 20px", backgroundColor: "rgba(28, 28, 30, 0.8)", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", border: "1px solid rgba(255,255,255,0.1)", shadowColor: "rgba(0,0,0,0.5)", shadowBlur: "30", crossAxisAlignment: "center" }, children: [
         { id: "di1", type: "Container", props: { width: "48px", height: "48px", backgroundColor: "#0ea5e9", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", padding: "12px" }, children: [ { id: "ic1", type: "Icon", props: { iconName: "Home", color: "#ffffff", size: "24" } } ] },
         { id: "di2", type: "Container", props: { width: "48px", height: "48px", backgroundColor: "rgba(255,255,255,0.1)", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", padding: "12px" }, children: [ { id: "ic2", type: "Icon", props: { iconName: "Search", color: "#ffffff", size: "24" } } ] },
         { id: "di3", type: "Container", props: { width: "48px", height: "48px", backgroundColor: "rgba(255,255,255,0.1)", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", padding: "12px" }, children: [ { id: "ic3", type: "Icon", props: { iconName: "FolderOpen", color: "#ffffff", size: "24" } } ] },
         { id: "di_sep", type: "Container", props: { width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.2)", margin: "0 8px" } },
         { id: "di4", type: "Container", props: { width: "48px", height: "48px", backgroundColor: "rgba(255,255,255,0.1)", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", padding: "12px" }, children: [ { id: "ic4", type: "Icon", props: { iconName: "Settings", color: "#ffffff", size: "24" } } ] }
      ]}
    ]
  },

  cmdNav: {
    id: "cmn_root", type: "Column", props: { width: "100%", padding: "24px", backgroundColor: "#030712", crossAxisAlignment: "center" }, children: [
      { id: "cmn_modal", type: "Column", props: { width: "100%", backgroundColor: "#111827", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", border: "1px solid #1f2937", shadowColor: "rgba(0,0,0,0.5)", shadowBlur: "40", overflow: "hidden" }, children: [
         { id: "cmn_search", type: "Row", props: { padding: "16px", border: "b 1px solid #1f2937", width: "100%", crossAxisAlignment: "center", gap: "12px" }, children: [
            { id: "cs_ic", type: "Icon", props: { iconName: "Search", color: "#6b7280", size: "20" } },
            { id: "cs_in", type: "Text", props: { content: "Search or jump to...", color: "#9ca3af", fontSize: "14", fontFamily: "Inter", flex: "1" } },
            { id: "cs_kbd", type: "Container", props: { padding: "4px 8px", backgroundColor: "#1f2937", radiusTopLeft: "6", radiusTopRight: "6", radiusBottomLeft: "6", radiusBottomRight: "6" }, children: [ { id: "ck_t", type: "Text", props: { content: "ESC", color: "#9ca3af", fontSize: "10", fontFamily: "monospace" } } ] }
         ]},
         { id: "cmn_list", type: "Column", props: { padding: "8px", width: "100%", gap: "4px" }, children: [
            { id: "cl_1", type: "Row", props: { padding: "12px", backgroundColor: "#1f2937", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", gap: "12px", width: "100%", crossAxisAlignment: "center" }, children: [
               { id: "cli_1", type: "Icon", props: { iconName: "FileText", color: "#e5e7eb", size: "18" } },
               { id: "clt_1", type: "Text", props: { content: "Create New Document", color: "#e5e7eb", fontSize: "14", fontFamily: "Inter", flex: "1" } }
            ]},
            { id: "cl_2", type: "Row", props: { padding: "12px", backgroundColor: "transparent", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", gap: "12px", width: "100%", crossAxisAlignment: "center" }, children: [
               { id: "cli_2", type: "Icon", props: { iconName: "Users", color: "#6b7280", size: "18" } },
               { id: "clt_2", type: "Text", props: { content: "Invite Team Members", color: "#9ca3af", fontSize: "14", fontFamily: "Inter", flex: "1" } }
            ]}
         ]}
      ]}
    ]
  },

  pillNav: {
    id: "pln_root", type: "Row", props: { width: "100%", padding: "24px", mainAxisAlignment: "center", backgroundColor: "#f8fafc" }, children: [
      { id: "pln_bar", type: "Row", props: { backgroundColor: "#ffffff", padding: "8px", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32", border: "1px solid #e2e8f0", shadowColor: "rgba(0,0,0,0.05)", shadowBlur: "20", shadowOffsetY: "8", gap: "8px" }, children: [
         { id: "pln_1", type: "Container", props: { padding: "10px 20px", backgroundColor: "#6366f1", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24" }, children: [ { id: "pt_1", type: "Text", props: { content: "Overview", color: "#ffffff", fontSize: "14", fontFamily: "Inter", fontWeight: "bold" } } ] },
         { id: "pln_2", type: "Container", props: { padding: "10px 20px", backgroundColor: "transparent", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24" }, children: [ { id: "pt_2", type: "Text", props: { content: "Analytics", color: "#64748b", fontSize: "14", fontFamily: "Inter", fontWeight: "bold" } } ] },
         { id: "pln_3", type: "Container", props: { padding: "10px 20px", backgroundColor: "transparent", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24" }, children: [ { id: "pt_3", type: "Text", props: { content: "Settings", color: "#64748b", fontSize: "14", fontFamily: "Inter", fontWeight: "bold" } } ] }
      ]}
    ]
  },

  brutalistNav: {
    id: "btn_root", type: "Row", props: { width: "100%", padding: "20px 24px", backgroundColor: "#facc15", border: "b 4px solid #000000", mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, children: [
      { id: "btn_l", type: "Text", props: { content: "AGENCY.", color: "#000000", fontSize: "28", fontFamily: "monospace", fontWeight: "bold", tracking: "tighter" } },
      { id: "btn_c", type: "Row", props: { gap: "24px" }, children: [
         { id: "bc_1", type: "Text", props: { content: "WORK", color: "#000000", fontSize: "14", fontFamily: "Inter", fontWeight: "bold", border: "b 2px solid #000000", padding: "0 0 4px 0" } },
         { id: "bc_2", type: "Text", props: { content: "STUDIO", color: "#000000", fontSize: "14", fontFamily: "Inter", fontWeight: "bold" } }
      ]},
      { id: "btn_r", type: "Button", props: { label: "HIRE US", backgroundColor: "#000000", color: "#facc15", padding: "12px 24px", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0", fontWeight: "bold", fontFamily: "monospace" } }
    ]
  },

  analyticsDash: {
    id: "and_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#0f172a", padding: "24px" }, children: [
      { id: "and_h", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 32px 0", width: "100%" }, children: [
        { id: "at1", type: "Text", props: { content: "Real-time Stats", color: "#f8fafc", fontSize: "24", fontFamily: "Inter", fontWeight: "bold" } },
        { id: "at2", type: "Icon", props: { iconName: "RefreshCw", color: "#38bdf8", size: "20" } }
      ]},
      { id: "and_grid", type: "Row", props: { gap: "12px", width: "100%", margin: "0 0 24px 0" }, children: [
        { id: "ak1", type: "Container", props: { flex: "1", padding: "16px", backgroundColor: "#1e293b", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" }, children: [
           { id: "akt1", type: "Text", props: { content: "Users", color: "#94a3b8", fontSize: "12", margin: "0 0 4px 0" } },
           { id: "akv1", type: "Text", props: { content: "12.8k", color: "#ffffff", fontSize: "20", fontWeight: "bold" } }
        ]},
        { id: "ak2", type: "Container", props: { flex: "1", padding: "16px", backgroundColor: "#1e293b", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" }, children: [
           { id: "akt2", type: "Text", props: { content: "Sessions", color: "#94a3b8", fontSize: "12", margin: "0 0 4px 0" } },
           { id: "akv2", type: "Text", props: { content: "45.2k", color: "#38bdf8", fontSize: "20", fontWeight: "bold" } }
        ]}
      ]},
      { id: "and_chart", type: "Container", props: { width: "100%", height: "240px", backgroundColor: "#1e293b", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", padding: "20px", shadowColor: "rgba(0,0,0,0.3)", shadowBlur: "20" }, children: [
         { id: "ct1", type: "Text", props: { content: "Traffic Funnel", color: "#ffffff", fontSize: "16", margin: "0 0 20px 0" } },
         { id: "cimg", type: "Image", props: { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600", width: "100%", height: "150px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
      ]}
    ]
  },

  pmDash: {
    id: "pm_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#f8fafc", padding: "20px" }, children: [
      { id: "pm_h", type: "Text", props: { content: "Q4 Roadmap", fontSize: "24", color: "#0f172a", fontFamily: "Inter", fontWeight: "bold", margin: "0 0 24px 0" } },
      { id: "pm_scroll", type: "Row", props: { width: "100%", gap: "16px", scrollDirection: "horizontal" }, children: [
        { id: "p_col1", type: "Column", props: { width: "280px", backgroundColor: "#f1f5f9", padding: "16px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", gap: "12px" }, children: [
           { id: "ct1", type: "Text", props: { content: "TO DO (3)", fontSize: "12", fontWeight: "bold", color: "#64748b", margin: "0 0 8px 0" } },
           { id: "t1", type: "Container", props: { width: "100%", backgroundColor: "#ffffff", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #e2e8f0" }, children: [ { id: "tt1", type: "Text", props: { content: "Fix API Auth Header", fontSize: "14", color: "#1e293b" } } ] },
           { id: "t2", type: "Container", props: { width: "100%", backgroundColor: "#ffffff", padding: "16px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #e2e8f0" }, children: [ { id: "tt2", type: "Text", props: { content: "Write Schema Batch 7", fontSize: "14", color: "#1e293b" } } ] }
        ]}
      ]}
    ]
  },

  crmDash: {
    id: "crm_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "24px" }, children: [
      { id: "crm_h", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 32px 0" }, children: [
        { id: "ct1", type: "Text", props: { content: "Sales Pipeline", fontSize: "22", fontWeight: "bold", color: "#111827" } },
        { id: "ct2", type: "Button", props: { label: "Add Deal", backgroundColor: "#10b981", color: "#ffffff", padding: "8px 16px", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" } }
      ]},
      { id: "crm_f", type: "Column", props: { width: "100%", gap: "8px", margin: "0 0 32px 0" }, children: [
        { id: "f1", type: "Container", props: { width: "100%", height: "40px", backgroundColor: "#ecfdf5", border: "l-4 solid #10b981", padding: "10px" }, children: [ { id: "ft1", type: "Text", props: { content: "Leads: $450k", fontSize: "12", color: "#065f46", fontWeight: "bold" } } ] },
        { id: "f2", type: "Container", props: { width: "80%", height: "40px", backgroundColor: "#fffbeb", border: "l-4 solid #f59e0b", padding: "10px" }, children: [ { id: "ft2", type: "Text", props: { content: "Proposal: $210k", fontSize: "12", color: "#92400e", fontWeight: "bold" } } ] },
        { id: "f3", type: "Container", props: { width: "40%", height: "40px", backgroundColor: "#fef2f2", border: "l-4 solid #ef4444", padding: "10px" }, children: [ { id: "ft3", type: "Text", props: { content: "Negotiation: $85k", fontSize: "12", color: "#991b1b", fontWeight: "bold" } } ] }
      ]}
    ]
  },

  financeDash: {
    id: "fin_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#000000", padding: "24px" }, children: [
      { id: "fh", type: "Text", props: { content: "Monthly Spending", color: "#ffffff", fontSize: "20", margin: "0 0 24px 0" } },
      { id: "fchart", type: "Container", props: { width: "160px", height: "160px", radiusTopLeft: "80", radiusTopRight: "80", radiusBottomLeft: "80", radiusBottomRight: "80", border: "15px solid #6366f1", margin: "0 auto 32px", mainAxisAlignment: "center", crossAxisAlignment: "center" }, children: [
         { id: "ft1", type: "Text", props: { content: "$2,450", color: "#ffffff", fontSize: "24", fontWeight: "bold" } }
      ]},
      { id: "flist", type: "Column", props: { gap: "16px", width: "100%" }, children: [
        { id: "fi1", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
           { id: "fit1", type: "Row", props: { gap: "12px" }, children: [ { id: "fic1", type: "Icon", props: { iconName: "ShoppingBag", color: "#ec4899", size: "20" } }, { id: "fl1", type: "Text", props: { content: "Shopping", color: "#94a3b8" } } ] },
           { id: "fiv1", type: "Text", props: { content: "$850.00", color: "#ffffff" } }
        ]},
        { id: "fi2", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%" }, children: [
           { id: "fit2", type: "Row", props: { gap: "12px" }, children: [ { id: "fic2", type: "Icon", props: { iconName: "Coffee", color: "#f59e0b", size: "20" } }, { id: "fl2", type: "Text", props: { content: "Food & Drink", color: "#94a3b8" } } ] },
           { id: "fiv2", type: "Text", props: { content: "$420.50", color: "#ffffff" } }
        ]}
      ]}
    ]
  },

  iotDash: {
    id: "iot_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#0f172a", padding: "24px" }, children: [
      { id: "ioth", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 32px 0", width: "100%" }, children: [
        { id: "iott", type: "Text", props: { content: "Smart Home", color: "#ffffff", fontSize: "22", fontWeight: "bold" } },
        { id: "ioti", type: "Icon", props: { iconName: "Settings", color: "#94a3b8", size: "24" } }
      ]},
      { id: "iotg", type: "Row", props: { gap: "16px", width: "100%", flexWrap: "wrap" }, children: [
        { id: "iotc1", type: "Container", props: { width: "47%", padding: "20px", backgroundColor: "#1e293b", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", border: "1px solid #334155" }, children: [
           { id: "ic1r", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 16px 0" }, children: [ { id: "ici1", type: "Icon", props: { iconName: "Lightbulb", color: "#facc15", size: "24" } }, { id: "ics1", type: "Container", props: { width: "32px", height: "18px", backgroundColor: "#3b82f6", radiusTopLeft: "9", radiusTopRight: "9", radiusBottomLeft: "9", radiusBottomRight: "9" } } ] },
           { id: "ict1", type: "Text", props: { content: "Living Room", color: "#ffffff", fontSize: "14", fontWeight: "bold" } }
        ]},
        { id: "iotc2", type: "Container", props: { width: "47%", padding: "20px", backgroundColor: "#1e293b", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", border: "1px solid #334155" }, children: [
           { id: "ic2r", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 16px 0" }, children: [ { id: "ici2", type: "Icon", props: { iconName: "Thermometer", color: "#38bdf8", size: "24" } }, { id: "ict2v", type: "Text", props: { content: "22°C", color: "#38bdf8", fontSize: "14", fontWeight: "bold" } } ] },
           { id: "ict2", type: "Text", props: { content: "Temperature", color: "#ffffff", fontSize: "14", fontWeight: "bold" } }
        ]}
      ]}
    ]
  },

  fullAuth: {
    id: "fau_root", type: "Container", props: { width: "100%", height: "100%", backgroundType: "gradient", gradientStart: "#1e1b4b", gradientEnd: "#000000", mainAxisAlignment: "center", crossAxisAlignment: "center", padding: "24px" }, children: [
      { id: "fauc", type: "Column", props: { width: "100%", backgroundColor: "rgba(255,255,255,0.05)", padding: "32px", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", border: "1px solid rgba(255,255,255,0.1)", shadowColor: "rgba(0,0,0,0.5)", shadowBlur: "40" }, children: [
         { id: "fal", type: "Text", props: { content: "Sign In", color: "#ffffff", fontSize: "28", textAlign: "center", margin: "0 0 32px 0", fontWeight: "bold" } },
         { id: "fai1", type: "TextInput", props: { placeholder: "Email", backgroundColor: "rgba(0,0,0,0.3)", color: "#ffffff", padding: "18px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 16px 0", width: "100%" } },
         { id: "fai2", type: "TextInput", props: { placeholder: "Password", backgroundColor: "rgba(0,0,0,0.3)", color: "#ffffff", padding: "18px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 32px 0", width: "100%" } },
         { id: "fab", type: "Button", props: { label: "Enter Workspace", backgroundColor: "#6366f1", color: "#ffffff", padding: "18px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", width: "100%", fontWeight: "bold" } }
      ]}
    ]
  },

  onboarding: {
    id: "onb_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "32px", mainAxisAlignment: "spaceBetween" }, children: [
      { id: "onbp", type: "ProgressBar", props: { progress: "0.6", color: "#3b82f6", backgroundColor: "#e2e8f0", height: "6px", width: "100%", radiusTopLeft: "3", radiusTopRight: "3", radiusBottomLeft: "3", radiusBottomRight: "3" } },
      { id: "onbc", type: "Column", props: { crossAxisAlignment: "center" }, children: [
         { id: "onbi", type: "Icon", props: { iconName: "Sparkles", color: "#3b82f6", size: "64", margin: "0 0 24px 0" } },
         { id: "onbt1", type: "Text", props: { content: "Pick your path", color: "#111827", fontSize: "24", fontWeight: "bold", textAlign: "center", margin: "0 0 8px 0" } },
         { id: "onbt2", type: "Text", props: { content: "How will you be using AppForge?", color: "#6b7280", fontSize: "14", textAlign: "center", margin: "0 0 40px 0" } },
         { id: "onbo1", type: "Container", props: { width: "100%", padding: "16px", border: "2px solid #3b82f6", backgroundColor: "#eff6ff", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 12px 0" }, children: [ { id: "ot1", type: "Text", props: { content: "Individual Developer", color: "#1d4ed8", fontWeight: "bold" } } ] },
         { id: "onbo2", type: "Container", props: { width: "100%", padding: "16px", border: "1px solid #e5e7eb", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [ { id: "ot2", type: "Text", props: { content: "Agency / Enterprise", color: "#4b5563" } } ] }
      ]},
      { id: "onbb", type: "Button", props: { label: "Continue", backgroundColor: "#3b82f6", color: "#ffffff", padding: "18px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", width: "100%", fontWeight: "bold" } }
    ]
  },

  bioAuth: {
    id: "bio_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#030712", mainAxisAlignment: "center", crossAxisAlignment: "center", padding: "32px" }, children: [
      { id: "bioi", type: "Container", props: { width: "120px", height: "120px", backgroundColor: "rgba(56, 189, 248, 0.1)", radiusTopLeft: "60", radiusTopRight: "60", radiusBottomLeft: "60", radiusBottomRight: "60", border: "2px solid #38bdf8", mainAxisAlignment: "center", crossAxisAlignment: "center", margin: "0 0 32px 0", shadowColor: "#38bdf8", shadowBlur: "30" }, children: [
         { id: "biic", type: "Icon", props: { iconName: "Fingerprint", color: "#38bdf8", size: "56" } }
      ]},
      { id: "biot1", type: "Text", props: { content: "Biometric Login", color: "#ffffff", fontSize: "20", fontWeight: "bold", margin: "0 0 8px 0" } },
      { id: "biot2", type: "Text", props: { content: "Scanning for FaceID...", color: "#94a3b8", fontSize: "14" } }
    ]
  },

  magicLink: {
    id: "ml_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "32px", mainAxisAlignment: "center" }, children: [
      { id: "mlic", type: "Icon", props: { iconName: "Mail", color: "#6366f1", size: "48", margin: "0 0 24px 0" } },
      { id: "mlt1", type: "Text", props: { content: "Check your inbox", color: "#111827", fontSize: "24", fontWeight: "bold", margin: "0 0 8px 0" } },
      { id: "mlt2", type: "Text", props: { content: "We've sent a secure login link to your email. Tap it to enter instantly.", color: "#6b7280", fontSize: "15", margin: "0 0 40px 0", lineHeight: "1.5" } },
      { id: "mlb", type: "Button", props: { label: "Open Mail App", backgroundColor: "#6366f1", color: "#ffffff", padding: "18px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", width: "100%", fontWeight: "bold" } }
    ]
  },

  pdpPage: {
    id: "pdp_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "0" }, children: [
      { id: "pdpimg", type: "Image", props: { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800", width: "100%", height: "45%", radiusBottomLeft: "40", radiusBottomRight: "40" } },
      { id: "pdpb", type: "Column", props: { padding: "24px", width: "100%" }, children: [
         { id: "pdph", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 8px 0" }, children: [
            { id: "pdpt", type: "Text", props: { content: "Premium Watch", fontSize: "24", fontWeight: "bold", color: "#111827" } },
            { id: "pdpp", type: "Text", props: { content: "$299", fontSize: "24", color: "#ec4899", fontWeight: "bold" } }
         ]},
         { id: "pdps", type: "Text", props: { content: "Minimalist Series • v2", color: "#6b7280", fontSize: "14", margin: "0 0 24px 0" } },
         { id: "pdpd", type: "Text", props: { content: "Handcrafted with titanium and sapphire crystal. Designed for the modern professional.", color: "#4b5563", fontSize: "15", lineHeight: "1.6", margin: "0 0 32px 0" } },
         { id: "pdpbtn", type: "Button", props: { label: "Add to Bag", backgroundColor: "#111827", color: "#ffffff", padding: "18px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", width: "100%", fontWeight: "bold" } }
      ]}
    ]
  },

  cartDrawer: {
    id: "cd_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#f9fafb", padding: "24px" }, children: [
      { id: "cdh", type: "Text", props: { content: "Your Cart (2)", fontSize: "20", fontWeight: "bold", color: "#111827", margin: "0 0 24px 0" } },
      { id: "cdl", type: "Column", props: { gap: "16px", flex: "1" }, children: [
        { id: "ci1", type: "Row", props: { gap: "16px", backgroundColor: "#ffffff", padding: "12px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" }, children: [
           { id: "ci1i", type: "Image", props: { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200", width: "60px", height: "60px", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" } },
           { id: "ci1t", type: "Column", props: { flex: "1" }, children: [ { id: "ci1n", type: "Text", props: { content: "Smart Watch", fontSize: "14", fontWeight: "bold" } }, { id: "ci1p", type: "Text", props: { content: "$299.00", fontSize: "12", color: "#ec4899" } } ] }
        ]}
      ]},
      { id: "cdf", type: "Column", props: { border: "t 1px solid #e5e7eb", padding: "24px 0 0" }, children: [
         { id: "cdtr", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 16px 0" }, children: [ { id: "cdtl", type: "Text", props: { content: "Total", fontSize: "18", fontWeight: "bold" } }, { id: "cdtv", type: "Text", props: { content: "$342.50", fontSize: "18", fontWeight: "bold" } } ] },
         { id: "cdb", type: "Button", props: { label: "Checkout", backgroundColor: "#111827", color: "#ffffff", padding: "18px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12" } }
      ]}
    ]
  },

  checkout: {
    id: "chk_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "24px" }, children: [
      { id: "chkh", type: "Text", props: { content: "Payment", fontSize: "22", fontWeight: "bold", margin: "0 0 32px 0" } },
      { id: "chkic", type: "Container", props: { width: "100%", height: "200px", backgroundColor: "#1e293b", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", margin: "0 0 32px 0", padding: "24px" }, children: [
         { id: "chki1", type: "Icon", props: { iconName: "CreditCard", color: "#ffffff", size: "32", margin: "0 0 60px 0" } },
         { id: "chki2", type: "Text", props: { content: "**** **** **** 4281", color: "#ffffff", fontSize: "18", tracking: "widest" } }
      ]},
      { id: "chki3", type: "TextInput", props: { placeholder: "CVV", width: "100%", padding: "16px", backgroundColor: "#f3f4f6", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 32px 0" } },
      { id: "chkb", type: "Button", props: { label: "Confirm Order", backgroundColor: "#10b981", color: "#ffffff", padding: "18px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", fontWeight: "bold" } }
    ]
  },

  plpPage: {
    id: "plp_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#f9fafb", padding: "20px" }, children: [
      { id: "plph", type: "Row", props: { mainAxisAlignment: "spaceBetween", width: "100%", margin: "0 0 24px 0" }, children: [
         { id: "plpt", type: "Text", props: { content: "All Products", fontSize: "20", fontWeight: "bold" } },
         { id: "plpi", type: "Icon", props: { iconName: "SlidersHorizontal", color: "#6b7280", size: "20" } }
      ]},
      { id: "plpg", type: "Row", props: { gap: "12px", width: "100%" }, children: [
        { id: "p1", type: "Container", props: { width: "48%", backgroundColor: "#ffffff", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", overflow: "hidden" }, children: [
           { id: "p1i", type: "Image", props: { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400", width: "100%", height: "140px" } },
           { id: "p1b", type: "Column", props: { padding: "12px" }, children: [ { id: "p1t", type: "Text", props: { content: "Watch", fontSize: "14", fontWeight: "bold" } }, { id: "p1p", type: "Text", props: { content: "$299", color: "#ec4899" } } ] }
        ]}
      ]}
    ]
  },

  flashSale: {
    id: "fs_root", type: "Container", props: { width: "100%", height: "100%", backgroundType: "gradient", gradientStart: "#ef4444", gradientEnd: "#991b1b", padding: "32px", mainAxisAlignment: "center", crossAxisAlignment: "center" }, children: [
      { id: "fsc", type: "Column", props: { crossAxisAlignment: "center" }, children: [
         { id: "fsh", type: "Text", props: { content: "FLASH SALE", color: "#ffffff", fontSize: "42", fontWeight: "bold", tracking: "widest", margin: "0 0 8px 0" } },
         { id: "fss", type: "Text", props: { content: "ENDING IN 02:45:12", color: "#fca5a5", fontSize: "16", fontWeight: "bold", margin: "0 0 40px 0" } },
         { id: "fsi", type: "Image", props: { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600", width: "240px", height: "160px", shadowColor: "rgba(0,0,0,0.4)", shadowBlur: "30" } },
         { id: "fsb", type: "Button", props: { label: "Shop 50% Off", backgroundColor: "#ffffff", color: "#ef4444", padding: "18px 40px", radiusTopLeft: "32", radiusTopRight: "32", radiusBottomLeft: "32", radiusBottomRight: "32", margin: "32px 0 0 0", fontWeight: "bold" } }
      ]}
    ]
  },

  // ─── FINAL MEGA-BATCH: SAAS & PORTFOLIOS ───

  aiLanding: {
    id: "ail_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#020617", padding: "0" }, children: [
      { id: "ail_hero", type: "Column", props: { padding: "60px 24px", crossAxisAlignment: "center" }, children: [
        { id: "ail_h1", type: "Text", props: { content: "Intelligence, Optimized.", color: "#ffffff", fontSize: "36", fontFamily: "Inter", fontWeight: "bold", textAlign: "center", margin: "0 0 16px 0" } },
        { id: "ail_h2", type: "Text", props: { content: "The next generation of neural workflows for creative engineers.", color: "#94a3b8", fontSize: "14", textAlign: "center", margin: "0 0 40px 0" } },
        { id: "ail_prompt", type: "Container", props: { width: "100%", padding: "4px", backgroundColor: "#1e293b", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #334155", margin: "0 0 40px 0" }, children: [
           { id: "ail_pr", type: "Row", props: { padding: "12px 16px", mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, children: [
              { id: "ail_pt", type: "Text", props: { content: "Generate a custom API...", color: "#64748b", fontSize: "13" } },
              { id: "ail_pb", type: "Container", props: { padding: "8px", backgroundColor: "#38bdf8", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8" }, children: [ { id: "aipb_i", type: "Icon", props: { iconName: "ArrowUpRight", color: "#000", size: "16" } } ] }
           ]}
        ]},
        { id: "ail_bento", type: "Row", props: { width: "100%", gap: "12px" }, children: [
           { id: "b1", type: "Container", props: { flex: "1", height: "120px", backgroundColor: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } },
           { id: "b2", type: "Container", props: { flex: "1", height: "120px", backgroundColor: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.2)", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16" } }
        ]}
      ]}
    ]
  },

  devLanding: {
    id: "devl_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#000000", padding: "24px" }, children: [
      { id: "dl_nav", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 60px 0" }, children: [
        { id: "dl_logo", type: "Text", props: { content: "root@appforge:~", color: "#4ade80", fontSize: "16", fontFamily: "monospace" } },
        { id: "dl_m", type: "Icon", props: { iconName: "Terminal", color: "#4ade80", size: "24" } }
      ]},
      { id: "dl_h1", type: "Text", props: { content: "Deploy in 60s.", color: "#ffffff", fontSize: "42", fontFamily: "Inter", fontWeight: "bold", margin: "0 0 16px 0" } },
      { id: "dl_code", type: "Container", props: { width: "100%", backgroundColor: "#111111", padding: "20px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", border: "1px solid #222222", margin: "0 0 32px 0" }, children: [
         { id: "c1", type: "Text", props: { content: "$ npm install @appforge/core", color: "#4ade80", fontSize: "13", fontFamily: "monospace", margin: "0 0 8px 0" } },
         { id: "c2", type: "Text", props: { content: "$ appforge deploy --prod", color: "#ffffff", fontSize: "13", fontFamily: "monospace" } }
      ]},
      { id: "dl_btn", type: "Button", props: { label: "Read documentation", backgroundColor: "#4ade80", color: "#000000", width: "100%", padding: "16px", radiusTopLeft: "8", radiusTopRight: "8", radiusBottomLeft: "8", radiusBottomRight: "8", fontWeight: "bold" } }
    ]
  },

  startupPager: {
    id: "sup_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "0" }, children: [
      { id: "sup_h", type: "Container", props: { width: "100%", height: "300px", backgroundColor: "#f59e0b", padding: "40px 24px", crossAxisAlignment: "start" }, children: [
         { id: "sh1", type: "Text", props: { content: "Moving fast.", color: "#ffffff", fontSize: "48", fontWeight: "bold", margin: "0 0 12px 0" } },
         { id: "sh2", type: "Text", props: { content: "The simple way to track every asset in your business.", color: "rgba(255,255,255,0.8)", fontSize: "16" } }
      ]},
      { id: "sup_feat", type: "Column", props: { padding: "40px 24px", gap: "32px" }, children: [
         { id: "f1", type: "Row", props: { gap: "20px" }, children: [
            { id: "f1i", type: "Container", props: { width: "48px", height: "48px", backgroundColor: "#fef3c7", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", padding: "12px" }, children: [ { id: "fi1", type: "Icon", props: { iconName: "Zap", color: "#d97706", size: "24" } } ] },
            { id: "f1t", type: "Column", props: { flex: "1" }, children: [ { id: "f1h", type: "Text", props: { content: "Instant Sync", fontWeight: "bold" } }, { id: "f1d", type: "Text", props: { content: "Real-time updates across all devices.", fontSize: "13", color: "#64748b" } } ] }
         ]},
         { id: "f2", type: "Row", props: { gap: "20px" }, children: [
            { id: "f2i", type: "Container", props: { width: "48px", height: "48px", backgroundColor: "#fef3c7", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", padding: "12px" }, children: [ { id: "fi2", type: "Icon", props: { iconName: "Shield", color: "#d97706", size: "24" } } ] },
            { id: "f2t", type: "Column", props: { flex: "1" }, children: [ { id: "f2h", type: "Text", props: { content: "Bank-level Security", fontWeight: "bold" } }, { id: "f2d", type: "Text", props: { content: "Your data is encrypted end-to-end.", fontSize: "13", color: "#64748b" } } ] }
         ]}
      ]}
    ]
  },

  newsletter: {
    id: "news_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#f8fafc", padding: "32px", mainAxisAlignment: "center" }, children: [
      { id: "ni", type: "Icon", props: { iconName: "Mail", color: "#6366f1", size: "64", margin: "0 auto 24px" } },
      { id: "nh1", type: "Text", props: { content: "The Design Dispatch", color: "#0f172a", fontSize: "28", fontWeight: "bold", textAlign: "center", margin: "0 0 12px 0" } },
      { id: "nh2", type: "Text", props: { content: "Join 12,000+ creators and get weekly design tips directly in your inbox.", color: "#64748b", fontSize: "15", textAlign: "center", margin: "0 0 40px 0", lineHeight: "1.5" } },
      { id: "nin", type: "TextInput", props: { placeholder: "email@example.com", backgroundColor: "#ffffff", padding: "18px", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", margin: "0 0 12px 0", width: "100%", border: "1px solid #e2e8f0" } },
      { id: "nb", type: "Button", props: { label: "Subscribe Now", backgroundColor: "#6366f1", color: "#ffffff", padding: "18px", width: "100%", radiusTopLeft: "12", radiusTopRight: "12", radiusBottomLeft: "12", radiusBottomRight: "12", fontWeight: "bold" } },
      { id: "nf", type: "Text", props: { content: "No spam. Unsubscribe at any time.", color: "#94a3b8", fontSize: "11", textAlign: "center", margin: "16px 0 0 0" } }
    ]
  },

  devPortfolio: {
    id: "dp_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#0a0a0a", padding: "32px" }, children: [
      { id: "dp_h", type: "Row", props: { mainAxisAlignment: "spaceBetween", margin: "0 0 48px 0" }, children: [
        { id: "dp_av", type: "Image", props: { url: "https://i.pravatar.cc/150?img=53", width: "56px", height: "56px", radiusTopLeft: "28", radiusTopRight: "28", radiusBottomLeft: "28", radiusBottomRight: "28" } },
        { id: "dp_s", type: "Icon", props: { iconName: "Github", color: "#ffffff", size: "28" } }
      ]},
      { id: "dp_t1", type: "Text", props: { content: "Full-Stack Engineer.", color: "#4ade80", fontSize: "14", fontFamily: "monospace", margin: "0 0 12px 0" } },
      { id: "dp_t2", type: "Text", props: { content: "Building tools that scale with your vision.", color: "#ffffff", fontSize: "32", fontWeight: "bold", margin: "0 0 32px 0" } },
      { id: "dp_grid", type: "Column", props: { gap: "16px" }, children: [
        { id: "p1", type: "Container", props: { width: "100%", backgroundColor: "#111111", padding: "20px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", border: "1px solid #222222" }, children: [
           { id: "p1h", type: "Text", props: { content: "AppForge Core", color: "#ffffff", fontWeight: "bold", margin: "0 0 4px 0" } },
           { id: "p1d", type: "Text", props: { content: "A visual engine for Flutter.", color: "#666666", fontSize: "12" } }
        ]},
        { id: "p2", type: "Container", props: { width: "100%", backgroundColor: "#111111", padding: "20px", radiusTopLeft: "16", radiusTopRight: "16", radiusBottomLeft: "16", radiusBottomRight: "16", border: "1px solid #222222" }, children: [
           { id: "p2h", type: "Text", props: { content: "Supabase Swift", color: "#ffffff", fontWeight: "bold", margin: "0 0 4px 0" } },
           { id: "p2d", type: "Text", props: { content: "Client library for iOS.", color: "#666666", fontSize: "12" } }
        ]}
      ]}
    ]
  },

  designPortfolio: {
    id: "desp_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "24px" }, children: [
      { id: "des_h", type: "Text", props: { content: "Selected Works", fontSize: "42", fontWeight: "bold", margin: "0 0 40px 0", tracking: "tighter" } },
      { id: "des_g", type: "Row", props: { gap: "16px", width: "100%" }, children: [
        { id: "c1", type: "Column", props: { width: "47%", gap: "16px" }, children: [
           { id: "i1", type: "Image", props: { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400", height: "200px", width: "100%", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } },
           { id: "i2", type: "Image", props: { url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400", height: "280px", width: "100%", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } }
        ]},
        { id: "c2", type: "Column", props: { width: "47%", gap: "16px" }, children: [
           { id: "i3", type: "Image", props: { url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400", height: "280px", width: "100%", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } },
           { id: "i4", type: "Image", props: { url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400", height: "200px", width: "100%", radiusTopLeft: "20", radiusTopRight: "20", radiusBottomLeft: "20", radiusBottomRight: "20" } }
        ]}
      ]}
    ]
  },

  photoPortfolio: {
    id: "photp_root", type: "Column", props: { width: "100%", height: "100%", backgroundColor: "#ffffff", padding: "0" }, children: [
      { id: "ph_nav", type: "Row", props: { padding: "24px", mainAxisAlignment: "spaceBetween" }, children: [
         { id: "ph_l", type: "Text", props: { content: "ELARA.", fontWeight: "bold", tracking: "widest" } },
         { id: "ph_i", type: "Icon", props: { iconName: "Camera", size: "24" } }
      ]},
      { id: "ph_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800", width: "100%", height: "450px", radiusTopLeft: "0", radiusTopRight: "0", radiusBottomLeft: "0", radiusBottomRight: "0" } },
      { id: "ph_cap", type: "Row", props: { padding: "24px", mainAxisAlignment: "spaceBetween" }, children: [
         { id: "ph_ct", type: "Text", props: { content: "VINTAGE SOUL, 2025", fontSize: "12", tracking: "widest" } },
         { id: "ph_cl", type: "Text", props: { content: "LONDON", fontSize: "12", tracking: "widest", color: "#94a3b8" } }
      ]}
    ]
  },

  "3dPortfolio": {
    id: "3dp_root", type: "Column", props: { width: "100%", height: "100%", backgroundType: "gradient", gradientStart: "#0f172a", gradientEnd: "#000000", padding: "32px", mainAxisAlignment: "center" }, children: [
      { id: "3d_c1", type: "Container", props: { width: "100%", height: "240px", backgroundColor: "rgba(255,255,255,0.05)", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24", border: "1px solid rgba(255,255,255,0.1)", shadowColor: "rgba(99,102,241,0.4)", shadowBlur: "40", margin: "0 0 24px 0" }, children: [
         { id: "3d_img", type: "Image", props: { url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600", width: "100%", height: "100%", radiusTopLeft: "24", radiusTopRight: "24", radiusBottomLeft: "24", radiusBottomRight: "24" } }
      ]},
      { id: "3d_h1", type: "Text", props: { content: "Immersive Experiences", color: "#ffffff", fontSize: "24", fontWeight: "bold", textAlign: "center", margin: "0 0 8px 0" } },
      { id: "3d_h2", type: "Text", props: { content: "Scroll to explore my digital garden.", color: "#6366f1", fontSize: "14", textAlign: "center" } }
    ]
  },

};