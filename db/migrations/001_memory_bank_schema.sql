-- ============================================================
-- AppForge RAG Memory Bank — Supabase Schema
-- Run this SQL in your Supabase SQL Editor ONCE to set up the
-- self-learning memory bank.
--
-- Requires the pgvector extension (free on Supabase).
-- ============================================================

-- Step 1: Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Create the memory bank table
CREATE TABLE IF NOT EXISTS public.appforge_memory_bank (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Human-readable metadata
  label         TEXT NOT NULL,           -- e.g. "Fitness Tracker Home Screen"
  description   TEXT NOT NULL,           -- e.g. "Dark screen with step ring, workout cards..."
  category      TEXT NOT NULL,           -- e.g. "fitness", "ecommerce", "auth", "dashboard"
  tags          TEXT[] DEFAULT '{}',     -- e.g. ['dark', 'charts', 'health']
  quality_score NUMERIC DEFAULT 0.8,     -- 0.0–1.0, updated by user feedback
  use_count     INTEGER DEFAULT 0,       -- how many times this was retrieved & used

  -- The actual schema JSON
  schema_json   JSONB NOT NULL,          -- the full AppForge page/widget schema node

  -- The embedding vector (1536 dims = OpenAI text-embedding-3-small)
  -- or 768 dims for Gemini text-embedding-004
  embedding     vector(768),

  -- Source tracking
  source        TEXT DEFAULT 'community', -- 'community' | 'user' | 'curated'
  creator_id    UUID REFERENCES auth.users(id)
);

-- Step 3: Create vector similarity search index (IVFFlat for speed)
CREATE INDEX IF NOT EXISTS appforge_memory_bank_embedding_idx
  ON public.appforge_memory_bank
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Step 4: Full-text search index on label + description
CREATE INDEX IF NOT EXISTS appforge_memory_bank_fts_idx
  ON public.appforge_memory_bank
  USING gin(to_tsvector('english', label || ' ' || description));

-- Step 5: Category index for fast filtering
CREATE INDEX IF NOT EXISTS appforge_memory_bank_category_idx
  ON public.appforge_memory_bank (category);

-- Step 6: RLS policies
ALTER TABLE public.appforge_memory_bank ENABLE ROW LEVEL SECURITY;

-- Anyone can read curated/community patterns
CREATE POLICY "Public read access"
  ON public.appforge_memory_bank FOR SELECT
  USING (source IN ('curated', 'community') OR creator_id = auth.uid());

-- Authenticated users can insert their own patterns
CREATE POLICY "Auth users can save patterns"
  ON public.appforge_memory_bank FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

-- Users can update their own patterns
CREATE POLICY "Users update own patterns"
  ON public.appforge_memory_bank FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid());

-- Step 7: Vector similarity search function
-- Returns the top N most similar patterns given a query embedding
CREATE OR REPLACE FUNCTION search_memory_bank(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.6,
  match_count     INT   DEFAULT 5,
  filter_category TEXT  DEFAULT NULL
)
RETURNS TABLE (
  id            UUID,
  label         TEXT,
  description   TEXT,
  category      TEXT,
  tags          TEXT[],
  quality_score NUMERIC,
  use_count     INTEGER,
  schema_json   JSONB,
  similarity    FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mb.id,
    mb.label,
    mb.description,
    mb.category,
    mb.tags,
    mb.quality_score,
    mb.use_count,
    mb.schema_json,
    1 - (mb.embedding <=> query_embedding) AS similarity
  FROM public.appforge_memory_bank mb
  WHERE
    (filter_category IS NULL OR mb.category = filter_category)
    AND 1 - (mb.embedding <=> query_embedding) > match_threshold
  ORDER BY mb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Step 8: Increment use_count when a pattern is retrieved and applied
CREATE OR REPLACE FUNCTION increment_pattern_use(pattern_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.appforge_memory_bank
  SET use_count = use_count + 1, updated_at = NOW()
  WHERE id = pattern_id;
END;
$$;

-- Step 9: Seed with 5 curated patterns (no embeddings yet — API will add them)
INSERT INTO public.appforge_memory_bank
  (label, description, category, tags, quality_score, source, schema_json)
VALUES
(
  'Dark Auth Login Screen',
  'Full-screen dark login with email/password fields, logo icon, sign in button, and forgot password link. Glassmorphism surface cards.',
  'auth',
  ARRAY['dark', 'login', 'auth', 'glassmorphism'],
  0.95,
  'curated',
  '{"type":"Column","props":{"width":"100%","height":"100%","backgroundColor":"#0E0F11","mainAxisAlignment":"center","padding":"32px"},"children":[{"type":"Icon","props":{"iconName":"Hexagon","size":"64","color":"#6366f1","margin":"0 0 20px 0"}},{"type":"Text","props":{"content":"Welcome Back","fontSize":"28","color":"#ffffff","textAlign":"center","margin":"0 0 8px 0"}},{"type":"TextInput","props":{"placeholder":"Email Address","width":"100%","padding":"16px","backgroundColor":"#1A1B1E","radiusTopLeft":"12","radiusTopRight":"12","radiusBottomLeft":"12","radiusBottomRight":"12","margin":"0 0 12px 0"}},{"type":"TextInput","props":{"placeholder":"Password","width":"100%","padding":"16px","backgroundColor":"#1A1B1E","radiusTopLeft":"12","radiusTopRight":"12","radiusBottomLeft":"12","radiusBottomRight":"12","margin":"0 0 24px 0"}},{"type":"Button","props":{"label":"Sign In","width":"100%","padding":"18px","backgroundColor":"#6366f1","color":"#ffffff","radiusTopLeft":"12","radiusTopRight":"12","radiusBottomLeft":"12","radiusBottomRight":"12"}}]}'
),
(
  'Fitness Tracker Home',
  'Dark fitness home screen with animated step counter ring, weekly bar chart, workout cards, and health vitals grid.',
  'fitness',
  ARRAY['dark', 'health', 'charts', 'progress', 'fitness'],
  0.93,
  'curated',
  '{"type":"Column","props":{"width":"100%","height":"100%","backgroundColor":"#060609","padding":"24px"},"children":[{"type":"Text","props":{"content":"Good morning 💪","fontSize":"26","color":"#ffffff","margin":"0 0 24px 0"}},{"type":"Container","props":{"width":"160px","height":"160px","radiusTopLeft":"80","radiusTopRight":"80","radiusBottomLeft":"80","radiusBottomRight":"80","border":"12px solid #10b981","margin":"0 auto 32px"}},{"type":"Row","props":{"gap":"12px","width":"100%","margin":"0 0 24px 0"},"children":[{"type":"Container","props":{"flex":"1","padding":"16px","backgroundColor":"#111118","radiusTopLeft":"14","radiusTopRight":"14","radiusBottomLeft":"14","radiusBottomRight":"14"}},{"type":"Container","props":{"flex":"1","padding":"16px","backgroundColor":"#111118","radiusTopLeft":"14","radiusTopRight":"14","radiusBottomLeft":"14","radiusBottomRight":"14"}}]}]}'
),
(
  'E-Commerce Product Card',
  'White card with product image, title, price in pink, add to cart button, and star rating row.',
  'ecommerce',
  ARRAY['light', 'card', 'product', 'shop', 'ecommerce'],
  0.91,
  'curated',
  '{"type":"Container","props":{"width":"100%","padding":"0","backgroundColor":"#ffffff","radiusTopLeft":"20","radiusTopRight":"20","radiusBottomLeft":"20","radiusBottomRight":"20","shadowColor":"rgba(0,0,0,0.08)","shadowBlur":"20","shadowOffsetY":"8"},"children":[{"type":"Image","props":{"width":"100%","height":"200px","radiusTopLeft":"20","radiusTopRight":"20","radiusBottomLeft":"0","radiusBottomRight":"0"}},{"type":"Column","props":{"padding":"16px","gap":"8px"},"children":[{"type":"Text","props":{"content":"Product Name","fontSize":"18","color":"#111827"}},{"type":"Text","props":{"content":"$99.00","fontSize":"22","color":"#ec4899"}},{"type":"Button","props":{"label":"Add to Cart","backgroundColor":"#111827","color":"#ffffff","width":"100%","padding":"14px","radiusTopLeft":"12","radiusTopRight":"12","radiusBottomLeft":"12","radiusBottomRight":"12"}}]}]}'
),
(
  'Analytics Dashboard Header',
  'Dark dashboard with 4 KPI metric cards in a grid, each with icon, label, value, and trend indicator.',
  'dashboard',
  ARRAY['dark', 'analytics', 'metrics', 'dashboard', 'kpi'],
  0.90,
  'curated',
  '{"type":"Column","props":{"width":"100%","padding":"24px","backgroundColor":"#0f172a"},"children":[{"type":"Text","props":{"content":"Dashboard","fontSize":"24","color":"#ffffff","margin":"0 0 24px 0"}},{"type":"Row","props":{"gap":"12px","width":"100%","mainAxisAlignment":"spaceBetween"},"children":[{"type":"Container","props":{"flex":"1","padding":"16px","backgroundColor":"#1e293b","radiusTopLeft":"16","radiusTopRight":"16","radiusBottomLeft":"16","radiusBottomRight":"16"},"children":[{"type":"Icon","props":{"iconName":"Users","color":"#3b82f6","size":"24","margin":"0 0 8px 0"}},{"type":"Text","props":{"content":"Users","fontSize":"12","color":"#94a3b8"}},{"type":"Text","props":{"content":"8,412","fontSize":"24","color":"#ffffff"}}]},{"type":"Container","props":{"flex":"1","padding":"16px","backgroundColor":"#1e293b","radiusTopLeft":"16","radiusTopRight":"16","radiusBottomLeft":"16","radiusBottomRight":"16"},"children":[{"type":"Icon","props":{"iconName":"TrendingUp","color":"#10b981","size":"24","margin":"0 0 8px 0"}},{"type":"Text","props":{"content":"Revenue","fontSize":"12","color":"#94a3b8"}},{"type":"Text","props":{"content":"$48.2K","fontSize":"24","color":"#10b981"}}]}]}]}'
),
(
  'Chat Messaging Screen',
  'Dark chat UI with message bubbles (sent/received), input bar, send button, and online indicator in header.',
  'social',
  ARRAY['dark', 'chat', 'messaging', 'social', 'bubbles'],
  0.92,
  'curated',
  '{"type":"Column","props":{"width":"100%","height":"100%","backgroundColor":"#0F172A","mainAxisAlignment":"spaceBetween"},"children":[{"type":"Row","props":{"padding":"20px","backgroundColor":"#0F172A","gap":"12px"},"children":[{"type":"Image","props":{"width":"40px","height":"40px","radiusTopLeft":"20","radiusTopRight":"20","radiusBottomLeft":"20","radiusBottomRight":"20"}},{"type":"Column","props":{},"children":[{"type":"Text","props":{"content":"Alex Rivera","fontSize":"16","color":"#ffffff"}},{"type":"Text","props":{"content":"Online","fontSize":"12","color":"#10b981"}}]}]},{"type":"Column","props":{"padding":"16px","gap":"12px","flex":"1"},"children":[{"type":"Container","props":{"padding":"14px","backgroundColor":"#1e293b","radiusTopLeft":"16","radiusTopRight":"16","radiusBottomLeft":"16","radiusBottomRight":"4","width":"70%"},"children":[{"type":"Text","props":{"content":"Hey! How are you?","fontSize":"14","color":"#ffffff"}}]},{"type":"Container","props":{"padding":"14px","backgroundColor":"#6366f1","radiusTopLeft":"16","radiusTopRight":"4","radiusBottomLeft":"16","radiusBottomRight":"16","width":"70%","selfAlign":"end"},"children":[{"type":"Text","props":{"content":"Doing great! 🚀","fontSize":"14","color":"#ffffff"}}]}]},{"type":"Row","props":{"padding":"16px","backgroundColor":"#111827","gap":"12px"},"children":[{"type":"TextInput","props":{"placeholder":"Message...","flex":"1","backgroundColor":"#1e293b","radiusTopLeft":"24","radiusTopRight":"24","radiusBottomLeft":"24","radiusBottomRight":"24","padding":"12px 16px"}},{"type":"Button","props":{"label":"Send","backgroundColor":"#6366f1","radiusTopLeft":"24","radiusTopRight":"24","radiusBottomLeft":"24","radiusBottomRight":"24","padding":"12px 20px"}}]}]}'
);