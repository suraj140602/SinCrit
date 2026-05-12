"use client";
import React, { useState, useEffect, useRef } from 'react';
import Canvas from '../../components/Canvas';
import { TEMPLATES } from '../../data/templates';

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'All Assets', icon: '◈', count: 68 },
  { id: 'premium', label: 'Premium Pages', icon: '✦', count: 14 },
  { id: 'wireframes', label: 'Wireframes', icon: '⊞', count: 10 },
  { id: 'animated-cards', label: 'Animated Cards', icon: '◎', count: 8 },
  { id: 'buttons', label: 'Button Packs', icon: '⬡', count: 7 },
  { id: 'navbars', label: 'Navbars', icon: '≡', count: 6 },
  { id: 'dashboards', label: 'Dashboards', icon: '⊟', count: 5 },
  { id: 'auth', label: 'Auth Flows', icon: '⊛', count: 5 },
  { id: 'ecommerce', label: 'E-Commerce', icon: '◱', count: 5 },
  { id: 'saas', label: 'SaaS Landing', icon: '⟡', count: 4 },
  { id: 'portfolio', label: 'Portfolio', icon: '◐', count: 4 },
];

const ITEMS = [
  // ── PREMIUM PAGES ─────────────────────────────────────────────────────────
  {
    id: 'p1', cat: 'premium', price: 'PRO', tag: 'HOT',
    title: 'Crypto Wallet Pro', sub: 'Premium Pages',
    desc: 'Full glassmorphic Web3 dashboard with live balance charts, NFT gallery, and swap interface.',
    colors: ['#6366f1','#8b5cf6'], accentColor: '#a78bfa',
    icon: '◈', templateKey: 'cryptoWallet',
    features: ['NFT Gallery', 'Live Charts', 'Swap UI', 'Dark Mode'],
  },
  {
    id: 'p2', cat: 'premium', price: 'PRO', tag: 'NEW',
    title: 'AI SaaS Landing', sub: 'Premium Pages',
    desc: 'Conversion-optimized landing for AI tools. Animated hero, feature grid, pricing table, and testimonials.',
    colors: ['#0ea5e9','#6366f1'], accentColor: '#38bdf8',
    icon: '⟡', templateKey: 'aiSaas',
    features: ['Animated Hero', 'Pricing Table', 'Testimonials', 'CTA Sections'],
  },
  {
    id: 'p3', cat: 'premium', price: 'PRO', tag: '',
    title: 'Agency Portfolio', sub: 'Premium Pages',
    desc: 'Bold editorial layout for creative agencies. Full-bleed case studies, team section, award counters.',
    colors: ['#f59e0b','#ef4444'], accentColor: '#fbbf24',
    icon: '◐', templateKey: 'agencyPortfolio',
    features: ['Case Studies', 'Team Grid', 'Award Counters', 'Contact Form'],
  },
  {
    id: 'p4', cat: 'premium', price: 'PRO', tag: 'HOT',
    title: 'FinTech Dashboard', sub: 'Premium Pages',
    desc: 'Advanced analytics dashboard for fintech with portfolio tracking, transaction history, and market data.',
    colors: ['#10b981','#0ea5e9'], accentColor: '#34d399',
    icon: '⊟', templateKey: 'fintechDash',
    features: ['Portfolio Charts', 'Transactions', 'Market Data', 'Export CSV'],
  },
  {
    id: 'p5', cat: 'premium', price: 'PRO', tag: '',
    title: 'E-Commerce Store', sub: 'Premium Pages',
    desc: 'Complete storefront with product listings, cart drawer, wishlist, and checkout flow.',
    colors: ['#ec4899','#f59e0b'], accentColor: '#f472b6',
    icon: '◱', templateKey: 'ecomStore',
    features: ['Product Grid', 'Cart Drawer', 'Wishlist', 'Checkout Flow'],
  },
  {
    id: 'p6', cat: 'premium', price: 'PRO', tag: 'NEW',
    title: 'Music Streaming UI', sub: 'Premium Pages',
    desc: 'Spotify-inspired player with playlist management, waveform visualizer, and artist profiles.',
    colors: ['#1db954','#191414'], accentColor: '#1db954',
    icon: '◎', templateKey: 'musicPlayer',
    features: ['Waveform Viz', 'Playlist Mgmt', 'Artist Profiles', 'Queue View'],
  },
  {
    id: 'p7', cat: 'premium', price: 'PRO', tag: '',
    title: 'Healthcare Portal', sub: 'Premium Pages',
    desc: 'Patient-facing healthcare app with appointment booking, health metrics, and doctor profiles.',
    colors: ['#06b6d4','#10b981'], accentColor: '#22d3ee',
    icon: '⊛', templateKey: 'healthcare',
    features: ['Appointment Booking', 'Health Metrics', 'Doctor Profiles', 'Med Records'],
  },
  {
    id: 'p8', cat: 'premium', price: 'PRO', tag: '',
    title: 'Travel Planner', sub: 'Premium Pages',
    desc: 'Full trip planning app with destination cards, itinerary builder, map integration, and booking.',
    colors: ['#f59e0b','#10b981'], accentColor: '#fbbf24',
    icon: '⟡', templateKey: 'travelPlanner',
    features: ['Destination Cards', 'Itinerary', 'Map View', 'Booking Flow'],
  },
  {
    id: 'p9', cat: 'premium', price: 'PRO', tag: 'NEW',
    title: 'Social Media Hub', sub: 'Premium Pages',
    desc: 'Multi-platform social management dashboard with analytics, post scheduling, and comment threads.',
    colors: ['#8b5cf6','#ec4899'], accentColor: '#a78bfa',
    icon: '◈', templateKey: 'socialHub',
    features: ['Post Scheduler', 'Analytics', 'Comment Threads', 'Trend Reports'],
  },
  {
    id: 'p10', cat: 'premium', price: 'PRO', tag: '',
    title: 'Real Estate App', sub: 'Premium Pages',
    desc: 'Property listing platform with map search, virtual tour, mortgage calculator, and agent profiles.',
    colors: ['#64748b','#0ea5e9'], accentColor: '#94a3b8',
    icon: '◱', templateKey: 'realEstate',
    features: ['Map Search', 'Virtual Tour', 'Mortgage Calc', 'Agent Profiles'],
  },
  {
    id: 'p11', cat: 'premium', price: 'PRO', tag: 'HOT',
    title: 'NFT Marketplace', sub: 'Premium Pages',
    desc: 'Full-featured NFT marketplace with minting flow, auction system, creator profiles, and wallet connect.',
    colors: ['#7c3aed','#db2777'], accentColor: '#a78bfa',
    icon: '◎', templateKey: 'nftMarket',
    features: ['Minting Flow', 'Auction System', 'Creator Profiles', 'Wallet Connect'],
  },
  {
    id: 'p12', cat: 'premium', price: 'PRO', tag: '',
    title: 'EdTech Platform', sub: 'Premium Pages',
    desc: 'Online learning platform with course catalog, video player, progress tracking, and certificates.',
    colors: ['#2563eb','#7c3aed'], accentColor: '#60a5fa',
    icon: '⊟', templateKey: 'edtech',
    features: ['Course Catalog', 'Video Player', 'Progress Tracker', 'Certificates'],
  },
  {
    id: 'p13', cat: 'premium', price: 'FREE', tag: '',
    title: 'Personal Blog', sub: 'Premium Pages',
    desc: 'Elegant minimalist blog with dark mode, reading progress, table of contents, and comment section.',
    colors: ['#374151','#6366f1'], accentColor: '#818cf8',
    icon: '◐', templateKey: 'personalBlog',
    features: ['Dark Mode', 'Reading Progress', 'TOC', 'Comments'],
  },
  {
    id: 'p14', cat: 'premium', price: 'FREE', tag: 'NEW',
    title: 'Restaurant Landing', sub: 'Premium Pages',
    desc: 'Luxurious restaurant page with animated menu, reservation form, chef profiles, and gallery.',
    colors: ['#7f1d1d','#92400e'], accentColor: '#fca5a5',
    icon: '⬡', templateKey: 'restaurant',
    features: ['Animated Menu', 'Reservations', 'Chef Profiles', 'Gallery'],
  },
  // ── WIREFRAMES ────────────────────────────────────────────────────────────
  {
    id: 'w1', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'Login & Auth Flow', sub: 'Wireframe',
    desc: 'Complete authentication wireframe: login, register, forgot password, OTP, and reset screens.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '⊛', templateKey: 'wfAuth',
    features: ['Login', 'Register', 'OTP Screen', 'Reset Flow'],
  },
  {
    id: 'w2', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'Dashboard Wireframe', sub: 'Wireframe',
    desc: 'Annotated admin dashboard wireframe with sidebar, header, KPI cards, charts, and data tables.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '⊟', templateKey: 'wfDash',
    features: ['KPI Cards', 'Chart Zones', 'Sidebar', 'Data Table'],
  },
  {
    id: 'w3', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'E-Commerce Wireframe', sub: 'Wireframe',
    desc: 'Full store wireframe: homepage, PDP, cart, and checkout annotated with UX notes.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '◱', templateKey: 'wfEcom',
    features: ['Homepage', 'Product Page', 'Cart', 'Checkout'],
  },
  {
    id: 'w4', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'Mobile App Wireframe', sub: 'Wireframe',
    desc: 'iOS-style mobile wireframe set: onboarding, home, profile, and settings screens.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '⬡', templateKey: 'wfMobile',
    features: ['Onboarding', 'Home Screen', 'Profile', 'Settings'],
  },
  {
    id: 'w5', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'SaaS Landing Wireframe', sub: 'Wireframe',
    desc: 'Conversion-focused SaaS wireframe with hero, features, social proof, pricing, and footer sections.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '⟡', templateKey: 'wfSaas',
    features: ['Hero Section', 'Features Grid', 'Pricing', 'Footer'],
  },
  {
    id: 'w6', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'Blog & CMS Wireframe', sub: 'Wireframe',
    desc: 'Editorial blog wireframe with article listing, single post, categories, and author page.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '◐', templateKey: 'wfBlog',
    features: ['Article List', 'Post Page', 'Categories', 'Author Page'],
  },
  {
    id: 'w7', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'Portfolio Wireframe', sub: 'Wireframe',
    desc: 'Creative portfolio wireframe with hero, work grid, case study, about, and contact sections.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '◎', templateKey: 'wfPortfolio',
    features: ['Hero', 'Work Grid', 'Case Study', 'Contact'],
  },
  {
    id: 'w8', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'Marketplace Wireframe', sub: 'Wireframe',
    desc: 'Two-sided marketplace wireframe with search, filters, listings, and seller/buyer flows.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '◈', templateKey: 'wfMarket',
    features: ['Search & Filter', 'Listings', 'Seller Flow', 'Buyer Flow'],
  },
  {
    id: 'w9', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'Admin Panel Wireframe', sub: 'Wireframe',
    desc: 'Full admin panel wireframe with user management, settings, analytics, and audit logs.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '⊞', templateKey: 'wfAdmin',
    features: ['User Management', 'Settings', 'Analytics', 'Audit Logs'],
  },
  {
    id: 'w10', cat: 'wireframes', price: 'FREE', tag: '',
    title: 'Chat & Messaging Wireframe', sub: 'Wireframe',
    desc: 'Real-time chat wireframe: thread list, message view, user presence, and media upload.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '⬡', templateKey: 'wfChat',
    features: ['Thread List', 'Message View', 'User Presence', 'Media Upload'],
  },
  // ── ANIMATED CARDS ────────────────────────────────────────────────────────
  {
    id: 'ac1', cat: 'animated-cards', price: 'PRO', tag: 'HOT',
    title: 'Glass Credit Card', sub: 'Animated Card',
    desc: 'Translucent animated debit card with holographic shimmer, tilt effect, and flip-to-CVV.',
    colors: ['#6366f1','#0ea5e9'], accentColor: '#818cf8',
    icon: '◎', templateKey: 'glassCard',
    features: ['Tilt Effect', 'Flip Animation', 'Shimmer', 'Tap to Copy'],
  },
  {
    id: 'ac2', cat: 'animated-cards', price: 'PRO', tag: '',
    title: 'NFT Art Card', sub: 'Animated Card',
    desc: '3D floating NFT showcase card with particle glow, rarity badge, and bid countdown.',
    colors: ['#7c3aed','#ec4899'], accentColor: '#a78bfa',
    icon: '◈', templateKey: 'nftCard',
    features: ['3D Float', 'Particle Glow', 'Rarity Badge', 'Countdown'],
  },
  {
    id: 'ac3', cat: 'animated-cards', price: 'FREE', tag: '',
    title: 'Stats Flip Card', sub: 'Animated Card',
    desc: 'Metric card with flip-reveal animation, number counter, and sparkline on hover.',
    colors: ['#10b981','#0ea5e9'], accentColor: '#34d399',
    icon: '⊟', templateKey: 'statsCard',
    features: ['Flip Reveal', 'Number Counter', 'Sparkline', 'Hover State'],
  },
  {
    id: 'ac4', cat: 'animated-cards', price: 'PRO', tag: 'NEW',
    title: 'Morphing Profile Card', sub: 'Animated Card',
    desc: 'User card that morphs layout on hover: avatar zooms, bio expands, social links appear.',
    colors: ['#f59e0b','#ef4444'], accentColor: '#fbbf24',
    icon: '◐', templateKey: 'profileCard',
    features: ['Morph Layout', 'Avatar Zoom', 'Bio Expand', 'Social Links'],
  },
  {
    id: 'ac5', cat: 'animated-cards', price: 'FREE', tag: '',
    title: 'Pricing Card Hover', sub: 'Animated Card',
    desc: 'Pricing tier card with gradient reveal, feature list animation, and CTA glow on hover.',
    colors: ['#6366f1','#8b5cf6'], accentColor: '#a78bfa',
    icon: '⬡', templateKey: 'pricingCard',
    features: ['Gradient Reveal', 'List Animation', 'CTA Glow', 'Popular Badge'],
  },
  {
    id: 'ac6', cat: 'animated-cards', price: 'PRO', tag: '',
    title: 'Music Player Card', sub: 'Animated Card',
    desc: 'Compact music player card with album art rotation, waveform animation, and progress scrubber.',
    colors: ['#1db954','#191414'], accentColor: '#1db954',
    icon: '◎', templateKey: 'musicCard',
    features: ['Art Rotation', 'Waveform', 'Progress Scrubber', 'Like Animation'],
  },
  {
    id: 'ac7', cat: 'animated-cards', price: 'FREE', tag: '',
    title: 'Testimonial Card Carousel', sub: 'Animated Card',
    desc: 'Auto-sliding testimonial cards with fade transition, star rating reveal, and author avatar.',
    colors: ['#64748b','#334155'], accentColor: '#94a3b8',
    icon: '◱', templateKey: 'testimonialCard',
    features: ['Auto-slide', 'Fade Transition', 'Star Rating', 'Avatar'],
  },
  {
    id: 'ac8', cat: 'animated-cards', price: 'PRO', tag: 'HOT',
    title: 'Holographic Product Card', sub: 'Animated Card',
    desc: 'E-commerce product card with holographic foil effect, quick-add, and image zoom on hover.',
    colors: ['#ec4899','#8b5cf6'], accentColor: '#f472b6',
    icon: '◈', templateKey: 'holoCard',
    features: ['Holo Foil', 'Quick Add', 'Image Zoom', '360° Preview'],
  },
  // ── BUTTONS ───────────────────────────────────────────────────────────────
  {
    id: 'b1', cat: 'buttons', price: 'FREE', tag: '',
    title: 'Gradient Button Pack', sub: 'Button Pack',
    desc: '8 gradient CTA buttons with shimmer sweep, press states, and loading spinners.',
    colors: ['#6366f1','#8b5cf6'], accentColor: '#a78bfa',
    icon: '⬡', templateKey: 'gradientBtn',
    features: ['8 Variants', 'Shimmer Sweep', 'Loading State', 'Press Effect'],
  },
  {
    id: 'b2', cat: 'buttons', price: 'FREE', tag: '',
    title: 'Neon Glow Buttons', sub: 'Button Pack',
    desc: '6 neon-glow buttons with pulse animation, icon slots, and disabled states.',
    colors: ['#22d3ee','#a78bfa'], accentColor: '#22d3ee',
    icon: '⬡', templateKey: 'neonBtn',
    features: ['6 Colors', 'Pulse Anim', 'Icon Slots', 'Disabled States'],
  },
  {
    id: 'b3', cat: 'buttons', price: 'FREE', tag: '',
    title: 'Magnetic Hover Buttons', sub: 'Button Pack',
    desc: 'Buttons that track cursor position with a magnetic pull effect and particle burst on click.',
    colors: ['#f59e0b','#ef4444'], accentColor: '#fbbf24',
    icon: '⬡', templateKey: 'magnetBtn',
    features: ['Cursor Tracking', 'Magnetic Pull', 'Particle Burst', '5 Sizes'],
  },
  {
    id: 'b4', cat: 'buttons', price: 'PRO', tag: 'HOT',
    title: 'Liquid Fill Buttons', sub: 'Button Pack',
    desc: 'Outline buttons that fill with liquid animation on hover. 7 color variants.',
    colors: ['#10b981','#0ea5e9'], accentColor: '#34d399',
    icon: '⬡', templateKey: 'liquidBtn',
    features: ['Liquid Fill', '7 Colors', 'Ripple Effect', 'Tooltip Slot'],
  },
  {
    id: 'b5', cat: 'buttons', price: 'FREE', tag: '',
    title: '3D Push Buttons', sub: 'Button Pack',
    desc: '3D skeuomorphic push buttons with shadow depth, press-down, and spring return animation.',
    colors: ['#64748b','#475569'], accentColor: '#94a3b8',
    icon: '⬡', templateKey: 'pushBtn',
    features: ['3D Shadow', 'Press-Down', 'Spring Return', '4 Sizes'],
  },
  {
    id: 'b6', cat: 'buttons', price: 'PRO', tag: '',
    title: 'Morphing Icon Buttons', sub: 'Button Pack',
    desc: 'Buttons where icons morph on click: play→pause, add→check, menu→close. All animated.',
    colors: ['#7c3aed','#2563eb'], accentColor: '#a78bfa',
    icon: '⬡', templateKey: 'morphBtn',
    features: ['Icon Morph', 'State Machine', 'SVG Paths', '10 Pairs'],
  },
  {
    id: 'b7', cat: 'buttons', price: 'FREE', tag: 'NEW',
    title: 'Brutalist Button Pack', sub: 'Button Pack',
    desc: 'Raw, edgy brutalist buttons with offset shadow, border shift, and typewriter label.',
    colors: ['#000000','#facc15'], accentColor: '#facc15',
    icon: '⬡', templateKey: 'brutalistBtn',
    features: ['Offset Shadow', 'Border Shift', 'Typewriter', 'Bold Typography'],
  },
  // ── NAVBARS ───────────────────────────────────────────────────────────────
  {
    id: 'n1', cat: 'navbars', price: 'FREE', tag: '',
    title: 'Glassmorphic Navbar', sub: 'Navbar',
    desc: 'Frosted glass top nav with scroll-shrink animation, mega menu, and search modal.',
    colors: ['#6366f1','#8b5cf6'], accentColor: '#a78bfa',
    icon: '≡', templateKey: 'glassNav',
    features: ['Scroll Shrink', 'Mega Menu', 'Search Modal', 'Mobile Drawer'],
  },
  {
    id: 'n2', cat: 'navbars', price: 'FREE', tag: '',
    title: 'Animated Sidebar Nav', sub: 'Navbar',
    desc: 'Collapsible sidebar with icon-to-label expand, nested items, and badge notifications.',
    colors: ['#0f172a','#1e293b'], accentColor: '#6366f1',
    icon: '≡', templateKey: 'sideNav',
    features: ['Collapse/Expand', 'Nested Items', 'Badges', 'Active States'],
  },
  {
    id: 'n3', cat: 'navbars', price: 'PRO', tag: 'HOT',
    title: 'Dock Navigation', sub: 'Navbar',
    desc: 'macOS-style dock nav with magnification on hover, tooltip labels, and active bounce.',
    colors: ['#1c1c1e','#2c2c2e'], accentColor: '#0ea5e9',
    icon: '≡', templateKey: 'dockNav',
    features: ['Magnification', 'Tooltips', 'Active Bounce', 'Drag Reorder'],
  },
  {
    id: 'n4', cat: 'navbars', price: 'FREE', tag: '',
    title: 'Command Palette Nav', sub: 'Navbar',
    desc: 'Minimal top bar that opens a full command palette (⌘K) with fuzzy search and shortcuts.',
    colors: ['#111827','#374151'], accentColor: '#818cf8',
    icon: '≡', templateKey: 'cmdNav',
    features: ['⌘K Palette', 'Fuzzy Search', 'Keyboard Nav', 'Shortcuts'],
  },
  {
    id: 'n5', cat: 'navbars', price: 'PRO', tag: 'NEW',
    title: 'Floating Pill Nav', sub: 'Navbar',
    desc: 'Floating island navbar that shifts background and label on scroll, with a gliding active pill.',
    colors: ['#6366f1','#0ea5e9'], accentColor: '#818cf8',
    icon: '≡', templateKey: 'pillNav',
    features: ['Floating Island', 'Gliding Pill', 'Scroll Reaction', 'Dark/Light Toggle'],
  },
  {
    id: 'n6', cat: 'navbars', price: 'FREE', tag: '',
    title: 'Brutalist Top Bar', sub: 'Navbar',
    desc: 'Bold, raw editorial navigation with thick borders, scrolling ticker, and dramatic hover.',
    colors: ['#000000','#facc15'], accentColor: '#facc15',
    icon: '≡', templateKey: 'brutalistNav',
    features: ['Scrolling Ticker', 'Bold Typography', 'Dramatic Hover', 'Hamburger Morph'],
  },
  // ── DASHBOARDS ────────────────────────────────────────────────────────────
  {
    id: 'd1', cat: 'dashboards', price: 'PRO', tag: 'HOT',
    title: 'Analytics Pro Dashboard', sub: 'Dashboard',
    desc: 'Full analytics suite: real-time line charts, funnel, cohort table, geo heatmap, and alerts.',
    colors: ['#0ea5e9','#6366f1'], accentColor: '#38bdf8',
    icon: '⊟', templateKey: 'analyticsDash',
    features: ['Real-time Charts', 'Funnel', 'Cohort Table', 'Geo Heatmap'],
  },
  {
    id: 'd2', cat: 'dashboards', price: 'PRO', tag: '',
    title: 'Project Management Board', sub: 'Dashboard',
    desc: 'Kanban-style PM dashboard with drag-drop cards, gantt timeline, and team workload view.',
    colors: ['#7c3aed','#2563eb'], accentColor: '#a78bfa',
    icon: '⊟', templateKey: 'pmDash',
    features: ['Kanban Board', 'Gantt Timeline', 'Team Workload', 'Sprint View'],
  },
  {
    id: 'd3', cat: 'dashboards', price: 'PRO', tag: 'NEW',
    title: 'CRM Sales Dashboard', sub: 'Dashboard',
    desc: 'Sales pipeline CRM with deal stage tracking, revenue forecast, and rep leaderboard.',
    colors: ['#10b981','#0ea5e9'], accentColor: '#34d399',
    icon: '⊟', templateKey: 'crmDash',
    features: ['Pipeline View', 'Revenue Forecast', 'Leaderboard', 'Deal Details'],
  },
  {
    id: 'd4', cat: 'dashboards', price: 'FREE', tag: '',
    title: 'Personal Finance Tracker', sub: 'Dashboard',
    desc: 'Budget tracker with income/expense donut, category breakdown, savings goal, and history.',
    colors: ['#f59e0b','#10b981'], accentColor: '#fbbf24',
    icon: '⊟', templateKey: 'financeDash',
    features: ['Budget Donut', 'Category Breakdown', 'Savings Goal', 'History'],
  },
  {
    id: 'd5', cat: 'dashboards', price: 'PRO', tag: '',
    title: 'IoT Monitoring Dashboard', sub: 'Dashboard',
    desc: 'Device monitoring with live sensor feeds, alert rules, energy usage graph, and device map.',
    colors: ['#22d3ee','#6366f1'], accentColor: '#22d3ee',
    icon: '⊟', templateKey: 'iotDash',
    features: ['Live Sensor Feed', 'Alert Rules', 'Energy Usage', 'Device Map'],
  },
  // ── AUTH ──────────────────────────────────────────────────────────────────
  {
    id: 'a1', cat: 'auth', price: 'FREE', tag: '',
    title: 'Split-Screen Login', sub: 'Auth Flow',
    desc: 'Elegant split-screen login with animated illustration side and social auth buttons.',
    colors: ['#6366f1','#8b5cf6'], accentColor: '#a78bfa',
    icon: '⊛', templateKey: 'splitLogin',
    features: ['Social Auth', 'Animated Side', 'Remember Me', 'Error States'],
  },
  {
    id: 'a2', cat: 'auth', price: 'FREE', tag: '',
    title: 'Full-Screen Auth', sub: 'Auth Flow',
    desc: 'Immersive full-screen auth with animated gradient background and glassmorphic form card.',
    colors: ['#0f172a','#6366f1'], accentColor: '#818cf8',
    icon: '⊛', templateKey: 'fullAuth',
    features: ['Animated BG', 'Glass Card', 'OTP Step', 'Password Strength'],
  },
  {
    id: 'a3', cat: 'auth', price: 'PRO', tag: 'NEW',
    title: 'Multi-Step Onboarding', sub: 'Auth Flow',
    desc: '5-step onboarding wizard with progress bar, role selection, preferences, and avatar upload.',
    colors: ['#10b981','#2563eb'], accentColor: '#34d399',
    icon: '⊛', templateKey: 'onboarding',
    features: ['5-Step Wizard', 'Progress Bar', 'Role Selection', 'Avatar Upload'],
  },
  {
    id: 'a4', cat: 'auth', price: 'FREE', tag: '',
    title: 'Biometric Login UI', sub: 'Auth Flow',
    desc: 'Futuristic biometric/fingerprint scan UI with animated ring, face ID prompt, and fallback PIN.',
    colors: ['#0ea5e9','#6366f1'], accentColor: '#38bdf8',
    icon: '⊛', templateKey: 'bioAuth',
    features: ['Fingerprint Scan', 'Face ID', 'PIN Fallback', 'Animated Ring'],
  },
  {
    id: 'a5', cat: 'auth', price: 'PRO', tag: '',
    title: 'Passwordless Magic Link', sub: 'Auth Flow',
    desc: 'Email magic link auth with animated envelope, countdown, and resend with cooldown.',
    colors: ['#f59e0b','#6366f1'], accentColor: '#fbbf24',
    icon: '⊛', templateKey: 'magicLink',
    features: ['Magic Link Flow', 'Animated Envelope', 'Countdown', 'Resend Cooldown'],
  },
  // ── ECOMMERCE ─────────────────────────────────────────────────────────────
  {
    id: 'e1', cat: 'ecommerce', price: 'PRO', tag: 'HOT',
    title: 'Product Detail Page', sub: 'E-Commerce',
    desc: '360° product viewer, size guide, variant selector, reviews, and animated add-to-cart.',
    colors: ['#ec4899','#f59e0b'], accentColor: '#f472b6',
    icon: '◱', templateKey: 'pdpPage',
    features: ['360° View', 'Variant Selector', 'Reviews', 'Add-to-Cart Anim'],
  },
  {
    id: 'e2', cat: 'ecommerce', price: 'FREE', tag: '',
    title: 'Shopping Cart Drawer', sub: 'E-Commerce',
    desc: 'Slide-in cart drawer with quantity stepper, item remove, cross-sell, and order summary.',
    colors: ['#374151','#6b7280'], accentColor: '#9ca3af',
    icon: '◱', templateKey: 'cartDrawer',
    features: ['Slide-In', 'Qty Stepper', 'Cross-Sell', 'Order Summary'],
  },
  {
    id: 'e3', cat: 'ecommerce', price: 'PRO', tag: '',
    title: 'Checkout Flow', sub: 'E-Commerce',
    desc: '3-step checkout: address, shipping, payment with card animation and order confirmation.',
    colors: ['#10b981','#0ea5e9'], accentColor: '#34d399',
    icon: '◱', templateKey: 'checkout',
    features: ['3-Step Flow', 'Card Animation', 'Address Autocomplete', 'Confirmation'],
  },
  {
    id: 'e4', cat: 'ecommerce', price: 'FREE', tag: 'NEW',
    title: 'Product Listing Grid', sub: 'E-Commerce',
    desc: 'Filterable, sortable product grid with lazy load, skeleton state, and wishlist toggle.',
    colors: ['#6366f1','#8b5cf6'], accentColor: '#a78bfa',
    icon: '◱', templateKey: 'plpPage',
    features: ['Filters', 'Sort', 'Skeleton Load', 'Wishlist Toggle'],
  },
  {
    id: 'e5', cat: 'ecommerce', price: 'PRO', tag: '',
    title: 'Flash Sale Banner', sub: 'E-Commerce',
    desc: 'Animated flash sale section with countdown timer, product spotlight, and urgency indicators.',
    colors: ['#ef4444','#f59e0b'], accentColor: '#fca5a5',
    icon: '◱', templateKey: 'flashSale',
    features: ['Countdown Timer', 'Urgency UI', 'Product Spotlight', 'Share CTA'],
  },
  // ── SAAS ──────────────────────────────────────────────────────────────────
  {
    id: 's1', cat: 'saas', price: 'PRO', tag: 'HOT',
    title: 'AI Tool Landing Page', sub: 'SaaS Landing',
    desc: 'Animated hero with typewriter, bento feature grid, interactive demo, and pricing table.',
    colors: ['#0ea5e9','#6366f1'], accentColor: '#38bdf8',
    icon: '⟡', templateKey: 'aiLanding',
    features: ['Typewriter Hero', 'Bento Grid', 'Interactive Demo', 'Pricing Table'],
  },
  {
    id: 's2', cat: 'saas', price: 'PRO', tag: '',
    title: 'Developer Tool Landing', sub: 'SaaS Landing',
    desc: 'Terminal-aesthetic landing with code syntax highlights, CLI demo, and API doc previews.',
    colors: ['#1e1e1e','#4ade80'], accentColor: '#4ade80',
    icon: '⟡', templateKey: 'devLanding',
    features: ['Terminal Aesthetic', 'Code Highlights', 'CLI Demo', 'API Docs Preview'],
  },
  {
    id: 's3', cat: 'saas', price: 'PRO', tag: 'NEW',
    title: 'Startup One-Pager', sub: 'SaaS Landing',
    desc: 'Scroll-driven one-pager with parallax sections, animated counters, and press logo bar.',
    colors: ['#f59e0b','#ec4899'], accentColor: '#fbbf24',
    icon: '⟡', templateKey: 'startupPager',
    features: ['Parallax', 'Animated Counters', 'Press Bar', 'Video Embed'],
  },
  {
    id: 's4', cat: 'saas', price: 'FREE', tag: '',
    title: 'Newsletter Landing', sub: 'SaaS Landing',
    desc: 'Minimal, high-conversion newsletter page with social proof counter and sample issue preview.',
    colors: ['#374151','#6366f1'], accentColor: '#818cf8',
    icon: '⟡', templateKey: 'newsletter',
    features: ['Social Proof', 'Sample Preview', 'Conversion Form', 'Unsubscribe Promise'],
  },
  // ── PORTFOLIO ─────────────────────────────────────────────────────────────
  {
    id: 'pf1', cat: 'portfolio', price: 'FREE', tag: '',
    title: 'Developer Portfolio', sub: 'Portfolio',
    desc: 'Terminal-inspired dev portfolio with typing animation, project cards, and GitHub activity.',
    colors: ['#1e1e1e','#4ade80'], accentColor: '#4ade80',
    icon: '◐', templateKey: 'devPortfolio',
    features: ['Typing Animation', 'Project Cards', 'GitHub Activity', 'Tech Stack'],
  },
  {
    id: 'pf2', cat: 'portfolio', price: 'PRO', tag: 'HOT',
    title: 'Designer Portfolio', sub: 'Portfolio',
    desc: 'Bold editorial grid portfolio with hover-reveal case studies and animated transitions.',
    colors: ['#000000','#f5f5f5'], accentColor: '#facc15',
    icon: '◐', templateKey: 'designPortfolio',
    features: ['Hover Reveal', 'Case Studies', 'Transitions', 'Dark/Light Toggle'],
  },
  {
    id: 'pf3', cat: 'portfolio', price: 'FREE', tag: '',
    title: 'Photographer Portfolio', sub: 'Portfolio',
    desc: 'Masonry photo grid with lightbox, smooth scroll, category filters, and EXIF display.',
    colors: ['#111827','#374151'], accentColor: '#9ca3af',
    icon: '◐', templateKey: 'photoPortfolio',
    features: ['Masonry Grid', 'Lightbox', 'Category Filters', 'EXIF Display'],
  },
  {
    id: 'pf4', cat: 'portfolio', price: 'PRO', tag: 'NEW',
    title: '3D Interactive Portfolio', sub: 'Portfolio',
    desc: 'WebGL-powered 3D portfolio where projects float as cards in a navigable 3D space.',
    colors: ['#6366f1','#0ea5e9'], accentColor: '#818cf8',
    icon: '◐', templateKey: '3dPortfolio',
    features: ['WebGL 3D Space', 'Floating Cards', '3D Navigation', 'Ambient Particles'],
  },
];

// ─── CARD COMPONENT ───────────────────────────────────────────────────────────

function MarketplaceCard({ item, onInstall }) {
  const [hovered, setHovered] = useState(false);
  const isWireframe = item.cat === 'wireframes';
  const isFree = item.price === 'FREE';

  // Check if we actually have the JSON code for this template yet
  const templateSchema = TEMPLATES[item.templateKey];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onInstall(item.templateKey)}
      style={{
        background: isWireframe
          ? 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)'
          : `linear-gradient(135deg, ${item.colors[0]}18 0%, ${item.colors[1]}12 100%)`,
        border: hovered
          ? `1px solid ${item.accentColor}60`
          : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 24px 48px ${item.accentColor}25, 0 0 0 1px ${item.accentColor}40`
          : '0 2px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── LIVE RENDERING HERO AREA ── */}
      <div style={{
        height: 220, // Taller to fit the UI preview
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderBottom: `1px solid rgba(255,255,255,0.04)`,
        background: '#050505',
      }}>
        
        {/* If we have the template JSON, render the LIVE CANVAS! */}
        {templateSchema ? (
          <div style={{
            position: 'absolute',
            top: 20, // Padding from top
            width: 375, // Standard mobile width
            height: 812,
            transform: `scale(${hovered ? 0.55 : 0.5})`, // Scales the whole UI down!
            transformOrigin: 'top center',
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: 'none', // Prevents the user from clicking buttons inside the preview
            zIndex: 1,
            // Add a subtle border to mimic a phone screen edge
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: '40px',
            overflow: 'hidden',
            backgroundColor: '#0E0F11'
          }}>
            <Canvas 
               // We pass a dummy schema just to satisfy the Canvas requirements
               schema={{ theme: { primary: item.colors[0], secondary: item.colors[1], background: '#0E0F11' } }} 
               rootNode={templateSchema} 
               previewMode="iphone"
               showGrid={false}
               isLivePreview={false}
            />
          </div>
        ) : (
          /* FALLBACK: If we haven't coded this JSON template yet, show the beautiful orbs */
          <>
            <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${item.colors[0]}30 0%, transparent 70%)`, top: '-20%', left: '10%', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.4)' : 'scale(1)' }} />
            <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${item.colors[1]}25 0%, transparent 70%)`, bottom: '-10%', right: '15%', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.3)' : 'scale(1)' }} />
            <div style={{ fontSize: 48, opacity: 0.35, filter: `drop-shadow(0 0 12px ${item.accentColor})`, transition: 'all 0.4s ease', transform: hovered ? 'scale(1.15) translateY(20px)' : 'scale(1) translateY(20px)', color: item.accentColor, zIndex: 1 }}>
              {item.icon}
            </div>
            {/* "Coming Soon" Badge for templates you haven't written JSON for yet */}
            <div style={{ position: 'absolute', bottom: 10, fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', tracking: 'widest', zIndex: 2 }}>JSON COMING SOON</div>
          </>
        )}

        {/* Price & Tag Badges */}
        <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', background: isFree ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(239,68,68,0.9))', color: isFree ? '#34d399' : '#fff', border: isFree ? '1px solid rgba(52,211,153,0.3)' : 'none', zIndex: 10 }}>
          {item.price}
        </div>
        {item.tag && (
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 8, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', background: item.tag === 'NEW' ? 'rgba(99,102,241,0.8)' : 'rgba(236,72,153,0.8)', color: '#fff', zIndex: 10 }}>
            {item.tag}
          </div>
        )}
      </div>

      {/* Card Body (Text and CTA remain unchanged) */}
      <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: item.accentColor, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.8 }}>{item.sub}</div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8, lineHeight: 1.3 }}>{item.title}</h3>
        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginBottom: 14, flex: 1 }}>{item.desc}</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {item.features.slice(0, 3).map(f => <span key={f} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: `${item.accentColor}15`, color: item.accentColor, border: `1px solid ${item.accentColor}25` }}>{f}</span>)}
          {item.features.length > 3 && <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>+{item.features.length - 3}</span>}
        </div>

        <button style={{ width: '100%', padding: '11px 0', borderRadius: 12, border: `1px solid ${hovered ? item.accentColor : item.accentColor + '40'}`, background: hovered ? `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` : `${item.accentColor}10`, color: hovered ? '#fff' : item.accentColor, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>↓</span> {isFree ? 'Install Free' : 'Push to Canvas'}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ThemeStore() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [installed, setInstalled] = useState({});
  const [notification, setNotification] = useState(null);

  const handleInstall = (templateKey) => {
    setInstalled(prev => ({ ...prev, [templateKey]: true }));
    setNotification(templateKey);
    setTimeout(() => setNotification(null), 2500);
  };

  const filtered = ITEMS.filter(item => {
    const catMatch = activeCategory === 'all' || item.cat === activeCategory;
    const searchMatch = !search
      || item.title.toLowerCase().includes(search.toLowerCase())
      || item.desc.toLowerCase().includes(search.toLowerCase())
      || item.sub.toLowerCase().includes(search.toLowerCase());
    const priceMatch = sortBy === 'all' || item.price === sortBy;
    return catMatch && searchMatch && priceMatch;
  });

  const activeLabel = CATEGORIES.find(c => c.id === activeCategory)?.label || 'All Assets';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060609',
      color: '#f1f5f9',
      fontFamily: '"Sora", "DM Sans", system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .nav-item:hover { background: rgba(255,255,255,0.06) !important; color: #f1f5f9 !important; }
        .nav-item.active { background: linear-gradient(135deg, #6366f1, #8b5cf6) !important; color: white !important; }
        input::placeholder { color: #475569; }
        input:focus { outline: none; border-color: #6366f1 !important; }
        select:focus { outline: none; }
      `}</style>

      {/* ── TICKER BAR ── */}
      <div style={{
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #0ea5e9, #6366f1)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 4s linear infinite',
        height: 36, overflow: 'hidden', display: 'flex', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap' }}>
          {Array(4).fill(['✦ 68 PREMIUM ASSETS', '◎ ANIMATED CARDS', '⟡ SAAS PAGES', '⬡ BUTTON PACKS', '≡ NAVBAR SYSTEMS', '◱ E-COMMERCE FLOWS', '◈ NFT DASHBOARDS']).flat().map((t, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#fff', padding: '0 24px' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,6,9,0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 72,
        gap: 24,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 0 24px rgba(99,102,241,0.5)',
            animation: 'float 3s ease-in-out infinite',
          }}>◈</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#f1f5f9' }}>AppForge</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#6366f1', textTransform: 'uppercase' }}>Marketplace</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 520, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#475569' }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates, components, pages..."
            style={{
              width: '100%', height: 44,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, paddingLeft: 44, paddingRight: 16,
              fontSize: 13, color: '#f1f5f9',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14,
            }}>✕</button>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#94a3b8', cursor: 'pointer',
            }}
          >
            <option value="all">All Plans</option>
            <option value="FREE">Free Only</option>
            <option value="PRO">Pro Only</option>
          </select>
          <div style={{
            padding: '8px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            cursor: 'pointer',
          }}>
            ✦ Go Pro
          </div>
        </div>
      </header>

      {/* ── LAYOUT ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 256, flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '24px 16px',
          overflowY: 'auto',
          position: 'sticky', top: 72,
          height: 'calc(100vh - 108px)',
          background: 'rgba(255,255,255,0.01)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: '#334155', textTransform: 'uppercase', marginBottom: 16, paddingLeft: 12 }}>
            Browse
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`nav-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                width: '100%', padding: '10px 12px',
                borderRadius: 10, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 4, cursor: 'pointer', transition: 'all 0.2s ease',
                background: activeCategory === cat.id ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                color: activeCategory === cat.id ? '#fff' : '#64748b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, opacity: 0.8 }}>{cat.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.label}</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: activeCategory === cat.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                padding: '2px 7px', borderRadius: 6,
                color: activeCategory === cat.id ? '#fff' : '#475569',
              }}>{cat.count}</span>
            </button>
          ))}

          {/* Stats Box */}
          <div style={{
            marginTop: 24, padding: 16, borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>✦ Pro Plan</div>
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginBottom: 14 }}>
              Get access to all 52 PRO templates, priority support, and early access to new releases.
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>$19<span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>/mo</span></div>
            <button style={{
              width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            }}>
              Upgrade Now
            </button>
          </div>
        </aside>

        {/* ── GRID ── */}
        <main style={{ flex: 1, padding: '32px 32px', overflowY: 'auto', minWidth: 0 }}>

          {/* Header */}
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#f8fafc', marginBottom: 8, lineHeight: 1 }}>
                {search ? `Results for "${search}"` : activeLabel}
              </h1>
              <p style={{ fontSize: 14, color: '#64748b' }}>
                {filtered.length} asset{filtered.length !== 1 ? 's' : ''} · One-click install to your canvas
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'FREE', 'PRO'].map(p => (
                <button key={p} onClick={() => setSortBy(p === sortBy ? 'all' : p)} style={{
                  padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                  background: sortBy === p ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: sortBy === p ? '#818cf8' : '#64748b',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  {p === 'all' ? 'All' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                padding: '6px 14px', borderRadius: 20,
                border: activeCategory === cat.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.07)',
                background: activeCategory === cat.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: activeCategory === cat.id ? '#818cf8' : '#64748b',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {filtered.map(item => (
                <MarketplaceCard key={item.id} item={item} onInstall={handleInstall} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>◎</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', marginBottom: 8 }}>No assets found</div>
              <div style={{ fontSize: 13, color: '#334155' }}>Try a different search or category</div>
            </div>
          )}

          {/* Footer spacer */}
          <div style={{ height: 80 }} />
        </main>
      </div>

      {/* ── TOAST NOTIFICATION ── */}
      {notification && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 1000,
          background: 'rgba(15,20,30,0.95)',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 16, padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: 14,
          animation: 'fadeInDown 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.3)',
          minWidth: 300,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>✓</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>Installed to Canvas</div>
            <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>inject={notification}</div>
          </div>
          <div style={{ marginLeft: 'auto', width: 28, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: '#6366f1', animation: 'shimmer 2.5s linear forwards', transformOrigin: 'left' }} />
          </div>
        </div>
      )}
    </div>
  );

}