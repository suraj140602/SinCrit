"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "../../utils/supabase";
import UserMenu from "../../components/UserMenu";
import LiveWidgetPreview from "../../components/LiveWidgetPreview";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'All Assets', icon: '◈', count: 10 },
  { id: 'flutter-pages', label: 'Flutter Pages', icon: '⟡', count: 10 },
];

const ITEMS = [
  // ── 1. Onboarding Splash ──────────────────────────────────────────────────
  {
    id: 'fp1', cat: 'flutter-pages', price: 'FREE', tag: 'HOT',
    title: 'Onboarding Splash',
    sub: 'Flutter Page',
    desc: 'Animated onboarding with gradient background, page indicators, hero illustration slot, and a "Get Started" CTA.',
    colors: ['#6366f1','#8b5cf6'], accentColor: '#a78bfa',
    icon: '⟡',
    features: ['Page Indicators', 'Gradient BG', 'Hero Slot', 'CTA Button'],
    templateKey: 'onboardingSplash',
    dartCode: `
import 'package:flutter/material.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});
  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  int _page = 0;
  final _pages = [
    {'title': 'Discover', 'sub': 'Find what you love, curated just for you.', 'icon': Icons.explore_rounded},
    {'title': 'Connect', 'sub': 'Build meaningful connections every day.', 'icon': Icons.people_rounded},
    {'title': 'Grow', 'sub': 'Track progress and reach your goals.', 'icon': Icons.trending_up_rounded},
  ];

  @override
  Widget build(BuildContext context) {
    final p = _pages[_page];
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const Spacer(),
              Icon(p['icon'] as IconData, size: 100, color: Colors.white.withOpacity(0.9)),
              const SizedBox(height: 40),
              Text(p['title'] as String,
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: Colors.white)),
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Text(p['sub'] as String,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.75))),
              ),
              const Spacer(),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_pages.length, (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _page == i ? 24 : 8, height: 8,
                  decoration: BoxDecoration(
                    color: _page == i ? Colors.white : Colors.white30,
                    borderRadius: BorderRadius.circular(4)),
                )),
              ),
              const SizedBox(height: 32),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => setState(() => _page = (_page + 1) % _pages.length),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF6366F1),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: Text(_page < _pages.length - 1 ? 'Next' : 'Get Started',
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}`,
  },

  // ── 2. Login Screen ──────────────────────────────────────────────────────
  {
    id: 'fp2', cat: 'flutter-pages', price: 'FREE', tag: '',
    title: 'Login Screen',
    sub: 'Flutter Page',
    desc: 'Clean glassmorphic login with email/password fields, social auth buttons, and forgot password link.',
    colors: ['#0f172a','#6366f1'], accentColor: '#818cf8',
    icon: '⊛',
    features: ['Email & Password', 'Social Auth', 'Forgot Password', 'Remember Me'],
    templateKey: 'loginScreen',
    dartCode: `
import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              const Text('Welcome back 👋',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: Colors.white)),
              const SizedBox(height: 8),
              Text('Sign in to continue', style: TextStyle(fontSize: 15, color: Colors.white.withOpacity(0.5))),
              const SizedBox(height: 40),
              _buildField('Email', 'you@example.com', Icons.mail_outline_rounded),
              const SizedBox(height: 16),
              _buildField('Password', '••••••••', Icons.lock_outline_rounded, obscure: true),
              const SizedBox(height: 12),
              Align(alignment: Alignment.centerRight,
                child: Text('Forgot password?',
                  style: const TextStyle(color: Color(0xFF818CF8), fontWeight: FontWeight.w600))),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Sign In', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 24),
              Row(children: [
                Expanded(child: Divider(color: Colors.white.withOpacity(0.1))),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Text('or', style: TextStyle(color: Colors.white.withOpacity(0.4))),
                ),
                Expanded(child: Divider(color: Colors.white.withOpacity(0.1))),
              ]),
              const SizedBox(height: 24),
              _socialBtn('Continue with Google', Icons.g_mobiledata_rounded, const Color(0xFF1E293B)),
              const SizedBox(height: 12),
              _socialBtn('Continue with Apple', Icons.apple_rounded, const Color(0xFF1E293B)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField(String label, String hint, IconData icon, {bool obscure = false}) =>
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8))),
      const SizedBox(height: 8),
      TextField(
        obscureText: obscure,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
          prefixIcon: Icon(icon, color: const Color(0xFF6366F1), size: 20),
          filled: true,
          fillColor: const Color(0xFF1E293B),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
        ),
      ),
    ]);

  Widget _socialBtn(String text, IconData icon, Color bg) =>
    SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: () {},
        icon: Icon(icon, color: Colors.white, size: 20),
        label: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
        style: OutlinedButton.styleFrom(
          backgroundColor: bg,
          side: BorderSide(color: Colors.white.withOpacity(0.08)),
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
      ),
    );
}`,
  },

  // ── 3. Home Feed ─────────────────────────────────────────────────────────
  {
    id: 'fp3', cat: 'flutter-pages', price: 'FREE', tag: 'NEW',
    title: 'Home Feed',
    sub: 'Flutter Page',
    desc: 'Social media-style home feed with story row, post cards, like/comment actions, and bottom nav.',
    colors: ['#0a0a0b','#1e1e2e'], accentColor: '#6366f1',
    icon: '◈',
    features: ['Story Row', 'Post Cards', 'Like / Comment', 'Bottom Nav'],
    templateKey: 'homeFeed',
    dartCode: `
import 'package:flutter/material.dart';

class HomeFeedPage extends StatefulWidget {
  const HomeFeedPage({super.key});
  @override
  State<HomeFeedPage> createState() => _HomeFeedPageState();
}

class _HomeFeedPageState extends State<HomeFeedPage> {
  int _navIdx = 0;
  final List<bool> _liked = [false, false, false];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0A0A0B),
        elevation: 0,
        title: const Text('AppFeed', style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white, fontSize: 22)),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_none_rounded, color: Colors.white), onPressed: () {}),
          IconButton(icon: const Icon(Icons.send_rounded, color: Colors.white), onPressed: () {}),
        ],
      ),
      body: ListView(children: [
        _buildStoryRow(),
        ...[0, 1, 2].map((i) => _buildPost(i)),
      ]),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFF111118),
        selectedItemColor: const Color(0xFF6366F1),
        unselectedItemColor: Colors.white38,
        currentIndex: _navIdx,
        onTap: (i) => setState(() => _navIdx = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.search_rounded), label: 'Explore'),
          BottomNavigationBarItem(icon: Icon(Icons.add_box_outlined), label: 'Post'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline_rounded), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildStoryRow() => SizedBox(
    height: 90,
    child: ListView.builder(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: 6,
      itemBuilder: (_, i) => Padding(
        padding: const EdgeInsets.only(right: 12),
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Container(
            width: 56, height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(colors: [const Color(0xFF6366F1), const Color(0xFFEC4899)],
                begin: Alignment.topLeft, end: Alignment.bottomRight),
            ),
            child: Padding(
              padding: const EdgeInsets.all(2),
              child: CircleAvatar(backgroundColor: const Color(0xFF1E293B),
                child: Text(['A','B','C','D','E','F'][i], style: const TextStyle(color: Colors.white))),
            ),
          ),
          const SizedBox(height: 4),
          Text(['You','Mia','Jake','Sara','Leo','Noa'][i],
            style: const TextStyle(fontSize: 11, color: Colors.white54)),
        ]),
      ),
    ),
  );

  Widget _buildPost(int i) {
    final names = ['Alex Rivera', 'Sam Chen', 'Jordan Blake'];
    final times = ['2m ago', '15m ago', '1h ago'];
    final likes = [142, 89, 231];
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(children: [
            CircleAvatar(radius: 20, backgroundColor: const Color(0xFF6366F1).withOpacity(0.3),
              child: Text(names[i][0], style: const TextStyle(color: Color(0xFF818CF8), fontWeight: FontWeight.w700))),
            const SizedBox(width: 10),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(names[i], style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white)),
              Text(times[i], style: const TextStyle(fontSize: 12, color: Colors.white38)),
            ]),
          ]),
        ),
        Container(height: 200, color: Color(0xFF1E293B + i * 0x050505),
          alignment: Alignment.center,
          child: Icon(Icons.image_rounded, size: 48, color: Colors.white12)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Row(children: [
            GestureDetector(
              onTap: () => setState(() => _liked[i] = !_liked[i]),
              child: Row(children: [
                Icon(_liked[i] ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                  color: _liked[i] ? Colors.pinkAccent : Colors.white54, size: 22),
                const SizedBox(width: 4),
                Text((likes[i] + (_liked[i] ? 1 : 0)).toString(), style: const TextStyle(color: Colors.white54)),
              ]),
            ),
            const SizedBox(width: 20),
            const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white54, size: 22),
            const SizedBox(width: 4),
            const Text('12', style: TextStyle(color: Colors.white54)),
          ]),
        ),
      ]),
    );
  }
}`,
  },

  // ── 4. Dashboard / Analytics ─────────────────────────────────────────────
  {
    id: 'fp4', cat: 'flutter-pages', price: 'FREE', tag: '',
    title: 'Analytics Dashboard',
    sub: 'Flutter Page',
    desc: 'Dark analytics dashboard with KPI stat cards, progress bars, recent activity list, and a side drawer.',
    colors: ['#0ea5e9','#6366f1'], accentColor: '#38bdf8',
    icon: '⊟',
    features: ['KPI Cards', 'Progress Bars', 'Activity List', 'Drawer Nav'],
    templateKey: 'analyticsDash',
    dartCode: `
import 'package:flutter/material.dart';

class AnalyticsDashPage extends StatelessWidget {
  const AnalyticsDashPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060609),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Dashboard', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
        leading: Builder(builder: (ctx) => IconButton(
          icon: const Icon(Icons.menu_rounded, color: Colors.white),
          onPressed: () => Scaffold.of(ctx).openDrawer(),
        )),
        actions: [CircleAvatar(radius: 18, backgroundColor: const Color(0xFF6366F1),
          child: const Text('A', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)))],
      ),
      drawer: Drawer(
        backgroundColor: const Color(0xFF0D1017),
        child: ListView(padding: EdgeInsets.zero, children: [
          DrawerHeader(
            decoration: const BoxDecoration(gradient: LinearGradient(colors: [Color(0xFF6366F1), Color(0xFF0EA5E9)])),
            child: const Text('AppForge', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800)),
          ),
          ...['Overview','Analytics','Reports','Settings'].map((t) => ListTile(
            title: Text(t, style: const TextStyle(color: Colors.white70)),
            leading: const Icon(Icons.chevron_right, color: Color(0xFF6366F1)),
            onTap: () {},
          )),
        ]),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Overview', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
          const SizedBox(height: 20),
          Row(children: [
            Expanded(child: _kpiCard('Revenue', r'$48.2K', '+12%', const Color(0xFF6366F1))),
            const SizedBox(width: 12),
            Expanded(child: _kpiCard('Users', '8,412', '+5%', const Color(0xFF0EA5E9))),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: _kpiCard('Orders', '1,204', '-2%', const Color(0xFFEC4899))),
            const SizedBox(width: 12),
            Expanded(child: _kpiCard('Churn', '3.1%', '-0.4%', const Color(0xFF10B981))),
          ]),
          const SizedBox(height: 28),
          const Text('Channel Performance', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16)),
          const SizedBox(height: 16),
          ...[('Organic', 0.72, const Color(0xFF6366F1)),
              ('Paid', 0.48, const Color(0xFF0EA5E9)),
              ('Referral', 0.31, const Color(0xFFEC4899)),
              ('Direct', 0.61, const Color(0xFF10B981))].map((e) => _progressRow(e.$1, e.$2, e.$3)),
          const SizedBox(height: 28),
          const Text('Recent Activity', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16)),
          const SizedBox(height: 12),
          ...[('New signup: alex@mail.com', '2m ago'),
              ('Upgrade: Pro Plan', '14m ago'),
              ('Export: reports_q4.csv', '1h ago')].map((e) => _activityRow(e.$1, e.$2)),
        ]),
      ),
    );
  }

  Widget _kpiCard(String label, String val, String delta, Color color) =>
    Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color.withOpacity(0.2)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label, style: TextStyle(fontSize: 12, color: color.withOpacity(0.8))),
        const SizedBox(height: 8),
        Text(val, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
        Text(delta, style: TextStyle(fontSize: 11, color: delta.startsWith('-') && label != 'Churn' ? Colors.redAccent : const Color(0xFF4ADE80))),
      ]),
    );

  Widget _progressRow(String label, double val, Color color) =>
    Padding(padding: const EdgeInsets.only(bottom: 14), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 13)),
        Text((val * 100).toInt().toString() + '%', style: TextStyle(color: color, fontWeight: FontWeight.w600, fontSize: 12)),
      ]),
      const SizedBox(height: 6),
      ClipRRect(borderRadius: BorderRadius.circular(4), child: LinearProgressIndicator(
        value: val, backgroundColor: Colors.white10, color: color, minHeight: 6,
      )),
    ]));

  Widget _activityRow(String msg, String time) =>
    Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: const Color(0xFF111118), borderRadius: BorderRadius.circular(12)),
      child: Row(children: [
        const Icon(Icons.circle_notifications_outlined, color: Color(0xFF6366F1), size: 20),
        const SizedBox(width: 12),
        Expanded(child: Text(msg, style: const TextStyle(color: Colors.white70, fontSize: 13))),
        Text(time, style: const TextStyle(color: Colors.white38, fontSize: 11)),
      ]),
    );
}`,
  },

  // ── 5. E-Commerce Product Page ───────────────────────────────────────────
  {
    id: 'fp5', cat: 'flutter-pages', price: 'FREE', tag: '',
    title: 'Product Detail Page',
    sub: 'Flutter Page',
    desc: 'E-commerce product page with image carousel, size selector, ratings, and animated add-to-cart.',
    colors: ['#ec4899','#f59e0b'], accentColor: '#f472b6',
    icon: '◱',
    features: ['Image Carousel', 'Size Selector', 'Star Ratings', 'Add to Cart'],
    templateKey: 'productDetail',
    dartCode: `
import 'package:flutter/material.dart';

class ProductDetailPage extends StatefulWidget {
  const ProductDetailPage({super.key});
  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  int _selectedSize = 1;
  int _qty = 1;
  bool _wishlist = false;
  final List<String> _sizes = ['XS', 'S', 'M', 'L', 'XL'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0B),
      body: CustomScrollView(slivers: [
        SliverAppBar(
          expandedHeight: 320,
          backgroundColor: const Color(0xFF1A1A2E),
          pinned: true,
          leading: IconButton(icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white), onPressed: () {}),
          actions: [
            IconButton(
              icon: Icon(_wishlist ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                color: _wishlist ? Colors.pinkAccent : Colors.white),
              onPressed: () => setState(() => _wishlist = !_wishlist),
            ),
          ],
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              color: const Color(0xFF1A1A2E),
              child: const Center(child: Icon(Icons.shopping_bag_rounded, size: 120, color: Color(0xFFEC4899))),
            ),
          ),
        ),
        SliverToBoxAdapter(child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('LUXE', style: TextStyle(color: Color(0xFFEC4899), fontWeight: FontWeight.w700, letterSpacing: 2)),
              Row(children: List.generate(5, (i) => Icon(Icons.star_rounded,
                color: i < 4 ? const Color(0xFFFBBF24) : Colors.white24, size: 16))),
            ]),
            const SizedBox(height: 8),
            const Text('Premium Leather Bag', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white)),
            const SizedBox(height: 4),
            const Text('142 reviews · In Stock', style: TextStyle(color: Colors.white38, fontSize: 13)),
            const SizedBox(height: 20),
            const Text(r'$128.00', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFFEC4899))),
            const SizedBox(height: 24),
            const Text('Select Size', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white)),
            const SizedBox(height: 12),
            Row(children: List.generate(_sizes.length, (i) => GestureDetector(
              onTap: () => setState(() => _selectedSize = i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(right: 10),
                width: 44, height: 44,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: _selectedSize == i ? const Color(0xFFEC4899) : Colors.white10,
                  border: Border.all(color: _selectedSize == i ? const Color(0xFFEC4899) : Colors.white12),
                ),
                alignment: Alignment.center,
                child: Text(_sizes[i], style: TextStyle(
                  color: _selectedSize == i ? Colors.white : Colors.white60,
                  fontWeight: FontWeight.w700)),
              ),
            ))),
            const SizedBox(height: 24),
            Row(children: [
              const Text('Qty:', style: TextStyle(color: Colors.white70)),
              const SizedBox(width: 16),
              IconButton(icon: const Icon(Icons.remove_circle_outline, color: Color(0xFFEC4899)),
                onPressed: () => setState(() => _qty = _qty > 1 ? _qty - 1 : 1)),
              Text(_qty.toString(), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 18)),
              IconButton(icon: const Icon(Icons.add_circle_outline, color: Color(0xFFEC4899)),
                onPressed: () => setState(() => _qty++)),
            ]),
            const SizedBox(height: 28),
            SizedBox(width: double.infinity, child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.shopping_cart_checkout_rounded),
              label: const Text('Add to Cart', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEC4899),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
            )),
          ]),
        )),
      ]),
    );
  }
}`,
  },

  // ── 6. Chat / Messaging ──────────────────────────────────────────────────
  {
    id: 'fp6', cat: 'flutter-pages', price: 'FREE', tag: 'NEW',
    title: 'Chat Messaging UI',
    sub: 'Flutter Page',
    desc: 'WhatsApp-style chat screen with bubble messages, typing indicator, emoji picker, and attachment bar.',
    colors: ['#0f172a','#1e293b'], accentColor: '#6366f1',
    icon: '⊞',
    features: ['Chat Bubbles', 'Typing Indicator', 'Emoji Picker', 'Attach Media'],
    templateKey: 'chatUI',
    dartCode: `
import 'package:flutter/material.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});
  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final _ctrl = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {'text': 'Hey! How are you?', 'mine': false, 'time': '9:41'},
    {'text': 'Doing great! Just finished the new app UI 🚀', 'mine': true, 'time': '9:42'},
    {'text': 'That sounds amazing. Can I see it?', 'mine': false, 'time': '9:43'},
    {'text': 'Sure! Sending screenshots now 📸', 'mine': true, 'time': '9:43'},
    {'text': 'Wow, love the dark theme!', 'mine': false, 'time': '9:45'},
  ];

  void _send() {
    if (_ctrl.text.isEmpty) return;
    setState(() {
      _messages.add({'text': _ctrl.text, 'mine': true, 'time': 'Now'});
      _ctrl.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white), onPressed: () {}),
        title: Row(children: [
          const CircleAvatar(radius: 18, backgroundColor: Color(0xFF6366F1),
            child: Text('M', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
          const SizedBox(width: 10),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Mia Chen', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)),
            Row(children: [
              Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFF4ADE80), shape: BoxShape.circle)),
              const SizedBox(width: 4),
              const Text('Online', style: TextStyle(color: Colors.white38, fontSize: 11)),
            ]),
          ]),
        ]),
        actions: [
          IconButton(icon: const Icon(Icons.videocam_outlined, color: Colors.white), onPressed: () {}),
          IconButton(icon: const Icon(Icons.call_outlined, color: Colors.white), onPressed: () {}),
        ],
      ),
      body: Column(children: [
        Expanded(child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: _messages.length,
          itemBuilder: (_, i) {
            final m = _messages[i];
            final mine = m['mine'] as bool;
            return Align(
              alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.7),
                decoration: BoxDecoration(
                  color: mine ? const Color(0xFF6366F1) : const Color(0xFF1E293B),
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(16),
                    topRight: const Radius.circular(16),
                    bottomLeft: Radius.circular(mine ? 16 : 4),
                    bottomRight: Radius.circular(mine ? 4 : 16),
                  ),
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Text(m['text'] as String, style: const TextStyle(color: Colors.white, fontSize: 14)),
                  const SizedBox(height: 4),
                  Text(m['time'] as String, style: TextStyle(fontSize: 10, color: Colors.white.withOpacity(0.5))),
                ]),
              ),
            );
          },
        )),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          color: const Color(0xFF111827),
          child: Row(children: [
            IconButton(icon: const Icon(Icons.add_rounded, color: Color(0xFF6366F1)), onPressed: () {}),
            Expanded(child: TextField(
              controller: _ctrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Message...',
                hintStyle: const TextStyle(color: Colors.white38),
                filled: true,
                fillColor: const Color(0xFF1E293B),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                suffixIcon: IconButton(icon: const Icon(Icons.emoji_emotions_outlined, color: Colors.white38), onPressed: () {}),
              ),
            )),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: _send,
              child: Container(
                width: 44, height: 44,
                decoration: const BoxDecoration(color: Color(0xFF6366F1), shape: BoxShape.circle),
                child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
              ),
            ),
          ]),
        ),
      ]),
    );
  }
}`,
  },

  // ── 7. Profile Screen ────────────────────────────────────────────────────
  {
    id: 'fp7', cat: 'flutter-pages', price: 'FREE', tag: '',
    title: 'Profile Screen',
    sub: 'Flutter Page',
    desc: 'User profile with cover photo, avatar, stats row, edit button, post grid, and settings list.',
    colors: ['#7c3aed','#2563eb'], accentColor: '#a78bfa',
    icon: '◐',
    features: ['Cover Photo', 'Stats Row', 'Post Grid', 'Settings List'],
    templateKey: 'profileScreen',
    dartCode: `
import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0B),
      body: CustomScrollView(slivers: [
        SliverAppBar(
          expandedHeight: 200,
          pinned: true,
          backgroundColor: const Color(0xFF0A0A0B),
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [Color(0xFF7C3AED), Color(0xFF2563EB)],
                  begin: Alignment.topLeft, end: Alignment.bottomRight),
              ),
            ),
          ),
          actions: [
            IconButton(icon: const Icon(Icons.more_horiz_rounded, color: Colors.white), onPressed: () {}),
          ],
        ),
        SliverToBoxAdapter(child: Column(children: [
          Transform.translate(
            offset: const Offset(0, -44),
            child: Column(children: [
              const CircleAvatar(radius: 44, backgroundColor: Color(0xFF7C3AED),
                child: Text('A', style: TextStyle(fontSize: 36, color: Colors.white, fontWeight: FontWeight.w800))),
              const SizedBox(height: 12),
              const Text('Alex Rivera', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
              const SizedBox(height: 4),
              const Text('@alex.rivera · Product Designer', style: TextStyle(color: Colors.white54, fontSize: 13)),
              const SizedBox(height: 20),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                _stat('Posts', '128'),
                Container(height: 30, width: 1, color: Colors.white12, margin: const EdgeInsets.symmetric(horizontal: 20)),
                _stat('Followers', '4.2K'),
                Container(height: 30, width: 1, color: Colors.white12, margin: const EdgeInsets.symmetric(horizontal: 20)),
                _stat('Following', '312'),
              ]),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: SizedBox(width: double.infinity, child: OutlinedButton(
                  onPressed: () {},
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFF7C3AED)),
                    foregroundColor: const Color(0xFFA78BFA),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('Edit Profile', style: TextStyle(fontWeight: FontWeight.w700)),
                )),
              ),
              const SizedBox(height: 24),
              GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 2),
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, crossAxisSpacing: 2, mainAxisSpacing: 2),
                itemCount: 9,
                itemBuilder: (_, i) => Container(
                  color: Color(0xFF1E293B + i * 0x030303),
                  child: Icon(Icons.image_rounded, color: Colors.white.withOpacity(0.1)),
                ),
              ),
            ]),
          ),
        ])),
      ]),
    );
  }

  Widget _stat(String label, String val) => Column(children: [
    Text(val, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
    Text(label, style: const TextStyle(fontSize: 12, color: Colors.white38)),
  ]);
}`,
  },

  // ── 8. Settings Screen ───────────────────────────────────────────────────
  {
    id: 'fp8', cat: 'flutter-pages', price: 'FREE', tag: '',
    title: 'Settings Screen',
    sub: 'Flutter Page',
    desc: 'Full settings page with grouped list tiles, toggles, user header, and destructive actions.',
    colors: ['#111827','#374151'], accentColor: '#6366f1',
    icon: '⊛',
    features: ['Grouped Sections', 'Toggle Switches', 'User Header', 'Danger Zone'],
    templateKey: 'settingsScreen',
    dartCode: `
import 'package:flutter/material.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});
  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _notifications = true;
  bool _darkMode = true;
  bool _biometric = false;
  bool _newsletter = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF060609),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Settings', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 22)),
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white), onPressed: () {}),
      ),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        // User header
        Container(
          padding: const EdgeInsets.all(16),
          margin: const EdgeInsets.only(bottom: 24),
          decoration: BoxDecoration(
            color: const Color(0xFF111118),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Row(children: [
            const CircleAvatar(radius: 28, backgroundColor: Color(0xFF6366F1),
              child: Text('A', style: TextStyle(fontSize: 22, color: Colors.white, fontWeight: FontWeight.w800))),
            const SizedBox(width: 14),
            const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Alex Rivera', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16)),
              Text('alex@example.com', style: TextStyle(color: Colors.white38, fontSize: 13)),
            ]),
            const Spacer(),
            const Icon(Icons.chevron_right_rounded, color: Colors.white38),
          ]),
        ),

        _sectionLabel('Preferences'),
        _toggle('Push Notifications', Icons.notifications_outlined, _notifications, (v) => setState(() => _notifications = v)),
        _toggle('Dark Mode', Icons.dark_mode_outlined, _darkMode, (v) => setState(() => _darkMode = v)),
        _toggle('Biometric Login', Icons.fingerprint_rounded, _biometric, (v) => setState(() => _biometric = v)),
        _toggle('Newsletter', Icons.mail_outline_rounded, _newsletter, (v) => setState(() => _newsletter = v)),

        const SizedBox(height: 20),
        _sectionLabel('Account'),
        _tile('Privacy Policy', Icons.privacy_tip_outlined),
        _tile('Terms of Service', Icons.description_outlined),
        _tile('Help & Support', Icons.help_outline_rounded),
        _tile('About App', Icons.info_outline_rounded),

        const SizedBox(height: 20),
        _sectionLabel('Danger Zone'),
        _dangerTile('Delete Account', Icons.delete_forever_rounded, Colors.redAccent),
        _dangerTile('Sign Out', Icons.logout_rounded, Colors.orangeAccent),
      ]),
    );
  }

  Widget _sectionLabel(String label) => Padding(
    padding: const EdgeInsets.only(bottom: 8, left: 4),
    child: Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700,
      letterSpacing: 1.2, color: Color(0xFF6366F1), textBaseline: TextBaseline.alphabetic)),
  );

  Widget _toggle(String label, IconData icon, bool val, Function(bool) onChanged) =>
    Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(color: const Color(0xFF111118), borderRadius: BorderRadius.circular(12)),
      child: SwitchListTile(
        title: Text(label, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
        secondary: Icon(icon, color: const Color(0xFF6366F1), size: 20),
        value: val,
        activeColor: const Color(0xFF6366F1),
        onChanged: onChanged,
        dense: true,
      ),
    );

  Widget _tile(String label, IconData icon) =>
    Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(color: const Color(0xFF111118), borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(icon, color: Colors.white54, size: 20),
        title: Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
        trailing: const Icon(Icons.chevron_right_rounded, color: Colors.white24, size: 18),
        dense: true,
        onTap: () {},
      ),
    );

  Widget _dangerTile(String label, IconData icon, Color color) =>
    Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2))),
      child: ListTile(
        leading: Icon(icon, color: color, size: 20),
        title: Text(label, style: TextStyle(color: color, fontSize: 14, fontWeight: FontWeight.w600)),
        dense: true,
        onTap: () {},
      ),
    );
}`,
  },

  // ── 9. Food Delivery Order ───────────────────────────────────────────────
  {
    id: 'fp9', cat: 'flutter-pages', price: 'FREE', tag: 'HOT',
    title: 'Food Delivery Order',
    sub: 'Flutter Page',
    desc: 'Swiggy-style food ordering page with restaurant hero, menu items, cart counter, and order summary.',
    colors: ['#f97316','#ef4444'], accentColor: '#fb923c',
    icon: '⬡',
    features: ['Restaurant Hero', 'Menu Items', 'Cart Counter', 'Order Summary'],
    templateKey: 'foodDelivery',
    dartCode: `
import 'package:flutter/material.dart';

class FoodOrderPage extends StatefulWidget {
  const FoodOrderPage({super.key});
  @override
  State<FoodOrderPage> createState() => _FoodOrderPageState();
}

class _FoodOrderPageState extends State<FoodOrderPage> {
  final Map<String, int> _cart = {};
  final List<Map<String, dynamic>> _items = [
    {'name': 'Margherita Pizza', 'price': 12.99, 'cal': '820 kcal', 'icon': '🍕'},
    {'name': 'Cheeseburger Deluxe', 'price': 9.49, 'cal': '640 kcal', 'icon': '🍔'},
    {'name': 'Chicken Tacos', 'price': 8.99, 'cal': '520 kcal', 'icon': '🌮'},
    {'name': 'Caesar Salad', 'price': 7.50, 'cal': '310 kcal', 'icon': '🥗'},
    {'name': 'Garlic Bread', 'price': 3.99, 'cal': '210 kcal', 'icon': '🥖'},
  ];

  int get _totalItems => _cart.values.fold(0, (a, b) => a + b);
  double get _totalPrice => _items.fold(0.0, (sum, item) => sum + (item['price'] as double) * (_cart[item['name'] as String] ?? 0));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0B),
      body: CustomScrollView(slivers: [
        SliverAppBar(
          expandedHeight: 220,
          pinned: true,
          backgroundColor: const Color(0xFFF97316),
          leading: IconButton(icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white), onPressed: () {}),
          flexibleSpace: FlexibleSpaceBar(
            title: const Text('Flame Kitchen 🔥', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
            background: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [Color(0xFFF97316), Color(0xFFEF4444)],
                  begin: Alignment.topLeft, end: Alignment.bottomRight),
              ),
              child: const Center(child: Text('🍕', style: TextStyle(fontSize: 80))),
            ),
          ),
        ),
        SliverToBoxAdapter(child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(children: [
            Row(children: [
              _badge(Icons.star_rounded, '4.8', const Color(0xFFFBBF24)),
              const SizedBox(width: 8),
              _badge(Icons.delivery_dining_rounded, '30 min', Colors.green),
              const SizedBox(width: 8),
              _badge(Icons.delivery_dining_outlined, 'Free Delivery', Colors.blue),
            ]),
            const SizedBox(height: 20),
            const Align(alignment: Alignment.centerLeft,
              child: Text('Menu', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white))),
            const SizedBox(height: 12),
            ..._items.map((item) => _itemCard(item)),
          ]),
        )),
      ]),
      bottomSheet: _totalItems > 0
        ? Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(color: Color(0xFF111118),
              border: Border(top: BorderSide(color: Colors.white10))),
            child: SafeArea(child: Row(children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(color: const Color(0xFFF97316).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFF97316).withOpacity(0.4))),
                child: Text(_totalItems.toString() + ' item' + (_totalItems > 1 ? 's' : ''),
                  style: const TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.w700)),
              ),
              const SizedBox(width: 12),
              Expanded(child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF97316),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text('View Cart · \\$' + _totalPrice.toStringAsFixed(2),
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: Colors.white)),
              )),
            ])),
          )
        : null,
    );
  }

  Widget _badge(IconData icon, String label, Color color) =>
    Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
      child: Row(children: [
        Icon(icon, color: color, size: 14),
        const SizedBox(width: 4),
        Text(label, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600)),
      ]),
    );

  Widget _itemCard(Map<String, dynamic> item) {
    final name = item['name'] as String;
    final qty = _cart[name] ?? 0;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: const Color(0xFF111118), borderRadius: BorderRadius.circular(14)),
      child: Row(children: [
        Text(item['icon'] as String, style: const TextStyle(fontSize: 32)),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(name, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white)),
          Text(item['cal'] as String, style: const TextStyle(color: Colors.white38, fontSize: 12)),
          Text('\\$' + (item['price'] as double).toStringAsFixed(2),
            style: const TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.w800)),
        ])),
        Row(children: [
          if (qty > 0) ...[
            GestureDetector(
              onTap: () => setState(() => _cart[name] = qty - 1),
              child: Container(width: 28, height: 28,
                decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(8)),
                child: const Icon(Icons.remove, color: Colors.white, size: 16)),
            ),
            Padding(padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(qty.toString(), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
          ],
          GestureDetector(
            onTap: () => setState(() => _cart[name] = qty + 1),
            child: Container(width: 28, height: 28,
              decoration: BoxDecoration(color: const Color(0xFFF97316), borderRadius: BorderRadius.circular(8)),
              child: const Icon(Icons.add, color: Colors.white, size: 16)),
          ),
        ]),
      ]),
    );
  }
}`,
  },

  // ── 10. Fitness Tracker ──────────────────────────────────────────────────
  {
    id: 'fp10', cat: 'flutter-pages', price: 'FREE', tag: 'NEW',
    title: 'Fitness Tracker',
    sub: 'Flutter Page',
    desc: 'Health & fitness home with step counter ring, workout cards, weekly bar chart, and quick stats.',
    colors: ['#10b981','#06b6d4'], accentColor: '#34d399',
    icon: '◎',
    features: ['Step Ring', 'Workout Cards', 'Weekly Chart', 'Quick Stats'],
    templateKey: 'fitnessTracker',
    dartCode: `
import 'package:flutter/material.dart';
import 'dart:math' as math;

class FitnessPage extends StatelessWidget {
  const FitnessPage({super.key});

  @override
  Widget build(BuildContext context) {
    const steps = 7432;
    const goal = 10000;
    final pct = steps / goal;
    final days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    final bars = [0.6, 0.8, 0.45, 0.9, 0.7, 0.55, 0.3];

    return Scaffold(
      backgroundColor: const Color(0xFF060609),
      body: SafeArea(child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Good morning 💪', style: TextStyle(fontSize: 12, color: Colors.white38)),
              Text('Alex', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white)),
            ]),
            Container(
              width: 44, height: 44,
              decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle),
              child: const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 22),
            ),
          ]),
          const SizedBox(height: 32),

          // Step ring
          Center(child: SizedBox(
            width: 180, height: 180,
            child: CustomPaint(
              painter: _RingPainter(pct),
              child: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                Text(steps.toString(), style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white)),
                const Text('steps', style: TextStyle(fontSize: 13, color: Colors.white38)),
                Text((pct * 100).toInt().toString() + '% of goal',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF10B981))),
              ])),
            ),
          )),
          const SizedBox(height: 32),

          // Quick stats
          Row(children: [
            Expanded(child: _statCard('Calories', '412 kcal', Icons.local_fire_department_rounded, Colors.orange)),
            const SizedBox(width: 12),
            Expanded(child: _statCard('Distance', '5.2 km', Icons.directions_walk_rounded, const Color(0xFF06B6D4))),
            const SizedBox(width: 12),
            Expanded(child: _statCard('Active', '48 min', Icons.timer_outlined, const Color(0xFF10B981))),
          ]),
          const SizedBox(height: 28),

          const Text('Weekly Steps', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16)),
          const SizedBox(height: 16),
          SizedBox(height: 100, child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: List.generate(7, (i) => Expanded(child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 600),
                  height: bars[i] * 80,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFF10B981), Color(0xFF06B6D4)],
                      begin: Alignment.topCenter, end: Alignment.bottomCenter),
                    borderRadius: BorderRadius.circular(6),
                  ),
                ),
                const SizedBox(height: 6),
                Text(days[i], style: const TextStyle(fontSize: 11, color: Colors.white38)),
              ]),
            ))),
          )),
          const SizedBox(height: 28),

          const Text("Today's Workouts", style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16)),
          const SizedBox(height: 12),
          _workoutCard('Morning Run', '5.2 km · 32 min', Icons.directions_run_rounded, const Color(0xFF10B981), true),
          _workoutCard('HIIT Training', '20 min · 180 kcal', Icons.fitness_center_rounded, const Color(0xFF6366F1), false),
          _workoutCard('Evening Yoga', '30 min · 95 kcal', Icons.self_improvement_rounded, const Color(0xFF06B6D4), false),
        ]),
      )),
    );
  }

  Widget _statCard(String label, String val, IconData icon, Color color) =>
    Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.2))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: color, size: 18),
        const SizedBox(height: 8),
        Text(val, style: const TextStyle(fontWeight: FontWeight.w800, color: Colors.white, fontSize: 13)),
        Text(label, style: const TextStyle(color: Colors.white38, fontSize: 10)),
      ]),
    );

  Widget _workoutCard(String title, String sub, IconData icon, Color color, bool done) =>
    Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFF111118), borderRadius: BorderRadius.circular(14)),
      child: Row(children: [
        Container(width: 44, height: 44, decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: color, size: 22)),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white)),
          Text(sub, style: const TextStyle(color: Colors.white38, fontSize: 12)),
        ])),
        if (done) const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 22)
        else Icon(Icons.play_circle_outline_rounded, color: color, size: 22),
      ]),
    );
}

class _RingPainter extends CustomPainter {
  final double value;
  _RingPainter(this.value);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 12;
    final strokeWidth = 14.0;
    final bgPaint = Paint()..color = Colors.white10..style = PaintingStyle.stroke..strokeWidth = strokeWidth;
    final fgPaint = Paint()
      ..shader = const LinearGradient(colors: [Color(0xFF10B981), Color(0xFF06B6D4)]).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.stroke..strokeWidth = strokeWidth..strokeCap = StrokeCap.round;
    canvas.drawCircle(center, radius, bgPaint);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2, 2 * math.pi * value, false, fgPaint);
  }

  @override
  bool shouldRepaint(_) => true;
}
`
  },
];

// ─── CARD COMPONENT ───────────────────────────────────────────────────────────

const MarketplaceCard = ({ item, onInstall }) => {
  return (
    <div
      className="group"
      style={{
        background: '#0d1017',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* ── TOP HALF: CONDITIONAL PREVIEW ── */}
      <div style={{ height: 280, position: 'relative', background: '#050505', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.dartCode || item.dbSchema ? (
          <LiveWidgetPreview dartCode={item.dartCode} schema={item.dbSchema} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${item.colors?.[0] || '#333'}, ${item.colors?.[1] || '#111'})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, opacity: 0.9,
          }}>
            <div style={{
              width: 90, height: 90, background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)', borderRadius: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}>{item.icon}</div>
          </div>
        )}

        {/* Floating Price Tag */}
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 20,
          background: item.price === 'FREE' || item.price === 0 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
          color: item.price === 'FREE' || item.price === 0 ? '#4ade80' : '#fbbf24',
          border: item.price === 'FREE' || item.price === 0 ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(245,158,11,0.3)',
          padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800,
          backdropFilter: 'blur(8px)',
        }}>
          {item.price === 0 ? 'FREE' : String(item.price).startsWith('$') ? item.price : `$${item.price}`}
        </div>

        {/* Tag badge */}
        {item.tag && (
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 20,
            background: item.tag === 'HOT' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)',
            color: item.tag === 'HOT' ? '#f87171' : '#818cf8',
            border: item.tag === 'HOT' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(99,102,241,0.3)',
            padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800,
            backdropFilter: 'blur(8px)',
          }}>
            {item.tag === 'HOT' ? '🔥 HOT' : '✦ NEW'}
          </div>
        )}
      </div>

      {/* ── BOTTOM HALF: INFO & ACTIONS ── */}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            {item.sub || 'Flutter Page'}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
            {item.title || 'Custom Component'}
          </h3>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.desc || 'A Flutter page component.'}
          </p>
        </div>

        {/* Feature pills */}
        {item.features && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {item.features.map((f, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 600, color: '#475569',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                padding: '3px 8px', borderRadius: 6,
              }}>{f}</span>
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onInstall) onInstall(item);
          }}
          style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            background: 'rgba(255,255,255,0.05)', color: '#f1f5f9',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(99,102,241,0.15)';
            e.target.style.color = '#818cf8';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.05)';
            e.target.style.color = '#f1f5f9';
          }}
        >
          <span>⟡</span> {item.price === 'FREE' || item.price === 0 ? 'Add to Canvas' : `Buy for ${item.price}`}
        </button>
      </div>
    </div>
  );
};


// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ThemeStore() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [installed, setInstalled] = useState({});
  const [notification, setNotification] = useState(null);
  const [storeItems, setStoreItems] = useState(ITEMS);

  useEffect(() => {
    const fetchCommunityItems = async () => {
      const { data, error } = await supabase.from('marketplace_items').select('*').eq('is_verified', true);
      if (data && data.length > 0) {
        const communityItems = data.map(dbItem => {
          let parsedColors = ['#3b82f6', '#8b5cf6'];
          let parsedIcon = '🧩';
          if (dbItem.schema_json) {
            try {
              const schemaData = JSON.parse(dbItem.schema_json);
              if (schemaData.colors) parsedColors = schemaData.colors;
              if (schemaData.icon) parsedIcon = schemaData.icon;
            } catch(e) {}
          }
          return {
            id: dbItem.id,
            title: dbItem.title,
            desc: dbItem.description,
            sub: 'COMMUNITY ASSET',
            price: dbItem.price_usd === 0 ? 'FREE' : `$${dbItem.price_usd.toFixed(2)}`,
            cat: dbItem.category || 'flutter-pages',
            features: ['Community Made', 'Auto-Updates'],
            colors: parsedColors,
            icon: parsedIcon,
            templateKey: `db_${dbItem.id}`,
            dartCode: dbItem.dart_code || null,
          };
        });
        setStoreItems([...ITEMS, ...communityItems]);
      }
    };
    fetchCommunityItems();
  }, []);

  // ─── TEMPORARY DB SEEDER (DELETE AFTER USING ONCE!) ───

  const handleSeedDatabase = async () => {
    if(!confirm("Upload all 10 items to Supabase?")) return;
    
    // 1. Get the current logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("❌ You must be logged into the app to upload assets!");
      return;
    }
    
    for (const item of ITEMS) {
      const { error } = await supabase.from('marketplace_items').insert({
        title: item.title,
        description: item.desc,
        price_usd: item.price === 'FREE' ? 0 : 9.99,
        category: item.cat,
        is_verified: true,
        dart_code: item.dartCode,
        schema_json: JSON.stringify({ icon: item.icon, colors: item.colors }),
        creator_id: user.id // 2. Assign ownership to YOU!
      });
      
      if (error) {
        console.error("Error uploading " + item.title + ":", error.message);
        alert("Failed on " + item.title + ". Check console!");
        break; 
      } else {
        console.log("Successfully uploaded: " + item.title);
      }
    }
    alert("All 10 Flutter Pages successfully uploaded to Supabase!");
  };
  // --- ANTI-THEFT HOOK ---
  useEffect(() => {
    const preventTheft = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
      }
    };
    const preventContextMenu = (e) => e.preventDefault();
    window.addEventListener('keydown', preventTheft);
    window.addEventListener('contextmenu', preventContextMenu);
    return () => {
      window.removeEventListener('keydown', preventTheft);
      window.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  const handleInstall = async (item) => {
    if (item.price === 'FREE' || installed[item.templateKey]) {
      setInstalled(prev => ({ ...prev, [item.templateKey]: true }));
      setNotification(item.templateKey);
      setTimeout(() => {
        setNotification(null);
        router.push(`/builder?inject=${item.templateKey}`);
      }, 1000);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert('Please log in to purchase this item.');

      const res = await fetch('/api/store-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId: item.id, buyerId: user.id }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    }
  };

  const filtered = storeItems.filter(item => {
    const catMatch = activeCategory === 'all' || item.cat === activeCategory;
    const searchMatch = !search
      || item.title?.toLowerCase().includes(search.toLowerCase())
      || item.desc?.toLowerCase().includes(search.toLowerCase())
      || item.sub?.toLowerCase().includes(search.toLowerCase());
    const itemPriceType = (item.price === 'FREE' || item.price === 0) ? 'FREE' : 'PRO';
    const priceMatch = sortBy === 'all' || itemPriceType === sortBy;
    return catMatch && searchMatch && priceMatch;
  });

  const activeLabel = CATEGORIES.find(c => c.id === activeCategory)?.label || 'All Assets';

  return (
    <div className="select-none" style={{
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
          {Array(4).fill(['⟡ 10 FLUTTER PAGES', '◎ REAL DART CODE', '⊟ ANALYTICS DASHBOARD', '⬡ FOOD DELIVERY UI', '◈ HOME FEED', '⊛ LOGIN SCREEN', '◱ PRODUCT PAGE']).flat().map((t, i) => (
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
        height: 72, gap: 24,
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
            placeholder="Search Flutter pages, components..."
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

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button onClick={handleSeedDatabase} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg">
            UPLOAD TO DB
          </button>
          <select className="bg-[#1c1c1e] text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/5 outline-none cursor-pointer hidden md:block">
            <option>All Plans</option>
            <option>Free Assets</option>
            <option>Premium Only</option>
          </select>
          <button className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            + Go Pro
          </button>
          <div className="ml-2 pl-4 border-l border-white/10">
            <UserMenu />
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

          {/* Flutter Info Box */}
          <div style={{
            marginTop: 24, padding: 16, borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>⟡ Flutter Pages</div>
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginBottom: 14 }}>
              All 10 pages ship with real, production-ready Dart code. One-click add to your builder canvas.
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', marginBottom: 8 }}>✓ All FREE</div>
            <button style={{
              width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            }}>
              View All Pages
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
                {filtered.length} Flutter page{filtered.length !== 1 ? 's' : ''} · Real Dart code · One-click install
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'FREE', 'PRO'].map(p => (
                <button key={p} onClick={() => setSortBy(p === sortBy ? 'all' : p)} style={{
                  padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                  background: sortBy === p ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: sortBy === p ? '#818cf8' : '#64748b',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {p === 'all' ? 'All' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {filtered.map(item => (
                <MarketplaceCard key={item.id} item={item} onInstall={handleInstall} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>◎</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', marginBottom: 8 }}>No pages found</div>
              <div style={{ fontSize: 13, color: '#334155' }}>Try a different search</div>
            </div>
          )}

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
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>Added to Canvas</div>
            <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>inject={notification}</div>
          </div>
        </div>
      )}
    </div>
  );
}