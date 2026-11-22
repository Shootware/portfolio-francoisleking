-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- RATE LIMITING
-- ============================================================
-- Utilisé par /api/contact via la clé service_role.
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE rate_limit_buckets ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION consume_rate_limit(
  p_key TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
  current_reset_at TIMESTAMPTZ;
  now_ts TIMESTAMPTZ := clock_timestamp();
BEGIN
  SELECT count, reset_at
  INTO current_count, current_reset_at
  FROM rate_limit_buckets
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND OR now_ts >= current_reset_at THEN
    INSERT INTO rate_limit_buckets (key, count, reset_at, updated_at)
    VALUES (
      p_key,
      1,
      now_ts + make_interval(secs => p_window_seconds),
      now_ts
    )
    ON CONFLICT (key) DO UPDATE SET
      count = EXCLUDED.count,
      reset_at = EXCLUDED.reset_at,
      updated_at = EXCLUDED.updated_at;
    RETURN TRUE;
  END IF;

  IF current_count >= p_limit THEN
    RETURN FALSE;
  END IF;

  UPDATE rate_limit_buckets
  SET count = count + 1,
      updated_at = now_ts
  WHERE key = p_key;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION consume_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION consume_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'François Leking',
  tagline TEXT DEFAULT 'Tech Lead & Software Architect',
  bio TEXT DEFAULT 'Full-stack developer passionate about building scalable systems and clean architectures.',
  email TEXT,
  location TEXT DEFAULT 'Yaoundé, Cameroon',
  avatar_url TEXT,
  socials JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HERO SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT DEFAULT 'François',
  last_name TEXT DEFAULT 'Leking',
  role TEXT DEFAULT 'Tech Lead & Software Architect',
  description TEXT DEFAULT 'Building scalable systems with clean architecture.',
  quote TEXT DEFAULT '"Code is not just syntax—it\'s architecture, decisions, and trade-offs."',
  cta_primary JSONB DEFAULT '{"label": "View Work", "href": "/work"}'::jsonb,
  cta_secondary JSONB DEFAULT '{"label": "Contact Me", "href": "#contact"}'::jsonb,
  stats JSONB DEFAULT '[{"label": "Years Experience", "value": "8+"}, {"label": "Projects Delivered", "value": "25+"}, {"label": "Technologies", "value": "30+"}]'::jsonb,
  background_3d_config JSONB DEFAULT '{"enabled": true, "type": "starfield", "density": 0.5}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- ============================================================
-- ABOUT SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS about_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT DEFAULT 'Passionate full-stack developer with expertise in building scalable web applications, cloud architectures, and developer tools. I believe in clean code, thoughtful architecture, and continuous learning.',
  values JSONB DEFAULT '[
    {"id": "1", "title": "Clean Code", "description": "Writing maintainable, readable code that stands the test of time.", "icon": "CleanCode", "accent": "#3b82f6"},
    {"id": "2", "title": "Local-First", "description": "Building products that work offline and respect user data sovereignty.", "icon": "LocalProducts", "accent": "#10b981"},
    {"id": "3", "title": "Performance", "description": "Optimizing every layer for speed and efficiency.", "icon": "Performance", "accent": "#f59e0b"},
    {"id": "4", "title": "Education & AI", "description": "Exploring how AI can enhance learning and development workflows.", "icon": "EducationAI", "accent": "#8b5cf6"},
    {"id": "5", "title": "Security", "description": "Security by design, not as an afterthought.", "icon": "Security", "accent": "#ef4444"},
    {"id": "6", "title": "Architecture", "description": "Designing systems that scale with clarity and purpose.", "icon": "Architecture", "accent": "#ec4899"}
  ]'::jsonb,
  stats JSONB DEFAULT '[{"label": "Projects", "value": "25+"}, {"label": "Clients", "value": "15+"}, {"label": "Technologies", "value": "30+"}, {"label": "Coffee Cups", "value": "∞"}]'::jsonb,
  tech_stack JSONB DEFAULT '["React", "Next.js", "TypeScript", "Python", "Django", "PostgreSQL", "Docker", "AWS", "GraphQL", "Tailwind CSS", "Framer Motion", "Three.js"]'::jsonb,
  photo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- ============================================================
-- EXPERIENCES (Work, Projects, Education)
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('work', 'project', 'education')),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  thumbnail_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'web' CHECK (category IN ('web', 'mobile', 'desktop', 'ai', 'other')),
  order_index INTEGER DEFAULT 0,
  case_study_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, slug)
);

-- ============================================================
-- SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  form_title TEXT DEFAULT 'Travaillons ensemble',
  form_description TEXT DEFAULT 'Un projet complexe à exécuter ou une infrastructure à consolider ? Écris-moi, je réponds sous 24h.',
  form_fields JSONB DEFAULT '[
    {"name": "name", "label": "Nom complet", "type": "text", "required": true, "placeholder": "Ex: François Leking"},
    {"name": "email", "label": "Adresse email", "type": "email", "required": true, "placeholder": "Ex: nom@domaine.com"},
    {"name": "subject", "label": "Objet du build", "type": "text", "required": true, "placeholder": "Ex: Architecture d\'une plateforme e-commerce"},
    {"name": "message", "label": "Spécifications du projet", "type": "textarea", "required": true, "placeholder": "Décris tes charges techniques, l\'état actuel, les technos ou les délais prévus..."}
  ]'::jsonb,
  submit_endpoint TEXT DEFAULT '/api/contact',
  direct_links JSONB DEFAULT '[
    {"label": "GitHub", "url": "https://github.com/francoisleking", "icon": "Github", "primary": true},
    {"label": "LinkedIn", "url": "https://linkedin.com/in/francoisleking", "icon": "Linkedin", "primary": true},
    {"label": "Email", "url": "mailto:contact@francoisleking.dev", "icon": "Mail", "primary": false}
  ]'::jsonb,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
  availability_message TEXT DEFAULT 'Disponible pour des missions techniques ou architectures complexes en freelance.',
  response_time TEXT DEFAULT '24h',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- ============================================================
-- SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  theme JSONB DEFAULT '{"mode": "system", "primaryColor": "#8b5cf6"}'::jsonb,
  seo JSONB DEFAULT '{"title": "François Leking — Tech Lead & Software Architect", "description": "Full-stack developer building scalable systems with clean architecture.", "keywords": ["developer", "architect", "React", "Next.js", "Python", "Django"], "ogImage": "/og-image.png"}'::jsonb,
  analytics JSONB DEFAULT '{"enabled": false, "provider": "none", "trackingId": ""}'::jsonb,
  custom_css TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Hero sections: users can only access their own
CREATE POLICY "Users can manage own hero" ON hero_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = hero_sections.profile_id AND profiles.user_id = auth.uid())
  );

-- About sections
CREATE POLICY "Users can manage own about" ON about_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = about_sections.profile_id AND profiles.user_id = auth.uid())
  );

-- Experiences
CREATE POLICY "Users can manage own experiences" ON experiences
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = experiences.profile_id AND profiles.user_id = auth.uid())
  );

-- Projects
CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = projects.profile_id AND profiles.user_id = auth.uid())
  );

-- Skills
CREATE POLICY "Users can manage own skills" ON skills
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = skills.profile_id AND profiles.user_id = auth.uid())
  );

-- Contact sections
CREATE POLICY "Users can manage own contact" ON contact_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = contact_sections.profile_id AND profiles.user_id = auth.uid())
  );

-- Settings
CREATE POLICY "Users can manage own settings" ON settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = settings.profile_id AND profiles.user_id = auth.uid())
  );

-- ============================================================
-- PUBLIC READ ACCESS FOR PORTFOLIO DISPLAY
-- ============================================================
-- Allow public read access to portfolio data (for the public site)
-- This is safe because we only expose non-sensitive portfolio content

CREATE POLICY "Public can view profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Public can view hero" ON hero_sections
  FOR SELECT USING (true);

CREATE POLICY "Public can view about" ON about_sections
  FOR SELECT USING (true);

CREATE POLICY "Public can view experiences" ON experiences
  FOR SELECT USING (true);

CREATE POLICY "Public can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public can view skills" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Public can view contact" ON contact_sections
  FOR SELECT USING (true);

CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_experiences_profile_id ON experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(profile_id, order_index);
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(profile_id, order_index);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(profile_id, slug);
CREATE INDEX IF NOT EXISTS idx_skills_profile_id ON skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(profile_id, category);

-- ============================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_sections_updated_at BEFORE UPDATE ON hero_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_sections_updated_at BEFORE UPDATE ON about_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_sections_updated_at BEFORE UPDATE ON contact_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STORAGE BUCKET FOR IMAGES
-- ============================================================
-- Run in Supabase Dashboard > Storage > Create bucket "portfolio-images"
-- Then set up policies:
-- INSERT: auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id)
-- SELECT: public
-- UPDATE: auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id)
-- DELETE: auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id)

-- ============================================================
-- SEED DATA (Optional - run after creating admin user)
-- ============================================================
-- INSERT INTO profiles (user_id, name, tagline, bio, email, location)
-- VALUES ('YOUR_AUTH_USER_ID', 'François Leking', 'Tech Lead & Software Architect', '...', 'contact@francoisleking.dev', 'Yaoundé, Cameroon');
