-- Supabase Database Setup for Addicting Slop
-- Run this in your Supabase SQL editor

-- Enable RLS (Row Level Security)
-- This is done automatically in Supabase for new projects

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  PRIMARY KEY (id),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- High scores table
CREATE TABLE high_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_slug TEXT NOT NULL,
  score BIGINT NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  UNIQUE(user_id, game_slug) -- One high score per user per game
);

-- Play sessions table (track when users play games)
CREATE TABLE play_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_slug TEXT NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comments table
CREATE TABLE game_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_slug TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT comment_length CHECK (char_length(content) >= 1 AND char_length(content) <= 1000)
);

-- Favorites table
CREATE TABLE game_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  UNIQUE(user_id, game_slug) -- One favorite per user per game
);

-- Row Level Security Policies

-- Profiles: Users can read all profiles, but only update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- High Scores: Everyone can read, only owner can insert/update
ALTER TABLE high_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "High scores are viewable by everyone" ON high_scores
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own high scores" ON high_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own high scores" ON high_scores
  FOR UPDATE USING (auth.uid() = user_id);

-- Play Sessions: Everyone can read, only owner can insert
ALTER TABLE play_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Play sessions are viewable by everyone" ON play_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own play sessions" ON play_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments: Everyone can read, only owner can insert/update/delete
ALTER TABLE game_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" ON game_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON game_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON game_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON game_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Favorites: Users can read their own, insert/delete their own
ALTER TABLE game_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON game_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" ON game_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" ON game_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Functions

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON game_comments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Indexes for performance
CREATE INDEX high_scores_user_game_idx ON high_scores(user_id, game_slug);
CREATE INDEX high_scores_game_score_idx ON high_scores(game_slug, score DESC);
CREATE INDEX play_sessions_user_idx ON play_sessions(user_id);
CREATE INDEX play_sessions_game_idx ON play_sessions(game_slug);
CREATE INDEX game_comments_game_idx ON game_comments(game_slug);
CREATE INDEX game_favorites_user_idx ON game_favorites(user_id);
CREATE INDEX game_favorites_game_idx ON game_favorites(game_slug);