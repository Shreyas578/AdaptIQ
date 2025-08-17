-- Create user profiles table with accessibility preferences
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INTEGER,
  disability_type TEXT[], -- Array of disability types
  learning_preferences JSONB DEFAULT '{}', -- Stores adaptive preferences
  accessibility_settings JSONB DEFAULT '{}', -- UI/UX accessibility settings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning content table
CREATE TABLE IF NOT EXISTS learning_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL, -- 'lesson', 'exercise', 'game', 'assessment'
  subject TEXT NOT NULL, -- 'math', 'reading', 'science', etc.
  difficulty_level INTEGER DEFAULT 1, -- 1-5 scale
  age_range INTEGER[] DEFAULT '{5,12}', -- [min_age, max_age]
  content_data JSONB NOT NULL, -- Stores the actual content
  accessibility_features TEXT[], -- Available accessibility features
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress tracking table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES learning_content(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in minutes
  attempts INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  performance_data JSONB DEFAULT '{}', -- Stores detailed performance metrics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Create adaptive learning sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  content_accessed UUID[] DEFAULT '{}', -- Array of content IDs accessed
  adaptations_made JSONB DEFAULT '{}', -- AI adaptations applied during session
  engagement_metrics JSONB DEFAULT '{}', -- User engagement data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sign language interpretations table
CREATE TABLE IF NOT EXISTS sign_language_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES learning_content(id) ON DELETE CASCADE,
  language_code TEXT DEFAULT 'asl', -- 'asl', 'bsl', etc.
  interpretation_type TEXT DEFAULT 'video', -- 'video', 'avatar', 'text'
  interpretation_url TEXT,
  interpretation_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, language_code, interpretation_type)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON learning_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON learning_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for learning content and sign language content
CREATE POLICY "Anyone can view learning content" ON learning_content FOR SELECT USING (true);
CREATE POLICY "Anyone can view sign language content" ON sign_language_content FOR SELECT USING (true);
