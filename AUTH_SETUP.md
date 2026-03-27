# 🔐 Auth System Setup

## Quick Start

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy your project URL and anon key

2. **Set Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Run Database Setup**
   - In Supabase dashboard, go to SQL Editor
   - Copy/paste the contents of `supabase_setup.sql`
   - Run it to create all tables and security policies

4. **Test It Out**
   ```bash
   npm run dev
   ```
   - Click "SIGN IN" in header
   - Create an account
   - Check your profile at `/profile/yourusername`

## What's Included

### 🎯 **Core Auth Features**
- Username/password signup & signin
- User profiles with stats
- Session management
- Protected routes

### 📊 **Database Tables**
- `profiles` - User accounts & basic info
- `high_scores` - Game leaderboards (1 per user per game)
- `play_sessions` - Track when users play games
- `game_comments` - Comments on games
- `game_favorites` - User favorites

### 🔒 **Security**
- Row Level Security (RLS) policies
- Users can only edit their own data
- Public read access for leaderboards
- Automatic profile creation on signup

### 🎨 **UI Components**
- `AuthModal` - Login/signup modal
- `UserMenu` - User dropdown in header
- `UserProfile` - Full profile pages with stats

## Next Steps (Phase 2)

1. **Add scoring to existing games**
2. **Build leaderboard components**
3. **Add play session tracking**
4. **Test on mobile**

## Database Schema

```sql
profiles: id, username, email, avatar_url, created_at, updated_at
high_scores: id, user_id, game_slug, score, achieved_at
play_sessions: id, user_id, game_slug, played_at
game_comments: id, user_id, game_slug, content, created_at
game_favorites: id, user_id, game_slug, created_at
```

---

**Ready to ship some slop with user accounts! 🫠**