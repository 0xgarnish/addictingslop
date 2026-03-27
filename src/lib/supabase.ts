import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a dummy client if env vars aren't set (for build time)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Types for our database
export type Profile = {
  id: string
  username: string
  email: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type HighScore = {
  id: string
  user_id: string
  game_slug: string
  score: number
  achieved_at: string
  profile?: Profile
}

export type PlaySession = {
  id: string
  user_id: string
  game_slug: string
  played_at: string
}

export type GameComment = {
  id: string
  user_id: string
  game_slug: string
  content: string
  created_at: string
  profile?: Profile
}

export type GameFavorite = {
  id: string
  user_id: string
  game_slug: string
  created_at: string
}