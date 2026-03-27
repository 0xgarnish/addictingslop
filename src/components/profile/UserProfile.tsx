'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Profile, HighScore } from '@/lib/supabase'
import Link from 'next/link'

interface UserProfileProps {
  username: string
}

interface UserStats {
  totalGamesPlayed: number
  totalPlayTime: number
  favoriteGames: number
  highScoreCount: number
}

export default function UserProfile({ username }: UserProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [highScores, setHighScores] = useState<HighScore[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalGamesPlayed: 0,
    totalPlayTime: 0,
    favoriteGames: 0,
    highScoreCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const isOwnProfile = user && profile && user.id === profile.id

  useEffect(() => {
    fetchUserData()
  }, [username])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (profileError) {
        setError('User not found')
        return
      }

      setProfile(profileData)

      // Fetch user's high scores
      const { data: scoresData, error: scoresError } = await supabase
        .from('high_scores')
        .select('*')
        .eq('user_id', profileData.id)
        .order('score', { ascending: false })
        .limit(10)

      if (!scoresError) {
        setHighScores(scoresData || [])
      }

      // Fetch user stats (these will be placeholders for now)
      // TODO: Replace with actual database queries when we have the tables
      setStats({
        totalGamesPlayed: 42,
        totalPlayTime: 1337,
        favoriteGames: 7,
        highScoreCount: scoresData?.length || 0
      })

    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-cyan)]"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl text-[var(--accent-pink)] mb-4">404 - User Not Found</h1>
        <p className="text-[var(--text-muted)] mb-6">
          This slop enthusiast doesn&apos;t exist or has vanished into the void.
        </p>
        <Link 
          href="/"
          className="bg-[var(--accent-cyan)] text-[var(--bg-primary)] px-4 py-2 rounded text-sm font-bold hover:bg-[var(--accent-cyan)]/80"
        >
          Back to Slop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 mb-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-green)] rounded-full flex items-center justify-center text-2xl font-bold text-[var(--bg-primary)]">
            {profile.username[0].toUpperCase()}
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                {profile.username}
              </h1>
              {isOwnProfile && (
                <span className="bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] px-2 py-1 rounded text-xs">
                  YOU
                </span>
              )}
            </div>
            
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Member since {new Date(profile.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long'
              })}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--accent-cyan)]">
                  {stats.totalGamesPlayed}
                </div>
                <div className="text-xs text-[var(--text-muted)]">Games Played</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--accent-green)]">
                  {stats.highScoreCount}
                </div>
                <div className="text-xs text-[var(--text-muted)]">High Scores</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--accent-pink)]">
                  {stats.favoriteGames}
                </div>
                <div className="text-xs text-[var(--text-muted)]">Favorites</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--accent-yellow)]">
                  {Math.floor(stats.totalPlayTime / 60)}h
                </div>
                <div className="text-xs text-[var(--text-muted)]">Playtime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High Scores Section */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold text-[var(--accent-cyan)] mb-4 flex items-center gap-2">
          🏆 High Scores
        </h2>
        
        {highScores.length > 0 ? (
          <div className="space-y-2">
            {highScores.map((score, index) => (
              <div key={score.id} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--accent-cyan)] min-w-[20px]">
                    #{index + 1}
                  </span>
                  <Link 
                    href={`/games/${score.game_slug}`}
                    className="text-sm text-[var(--text-primary)] hover:text-[var(--accent-cyan)]"
                  >
                    {score.game_slug.replace('-', ' ').toUpperCase()}
                  </Link>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--accent-green)]">
                    {score.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {new Date(score.achieved_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm">
              {isOwnProfile 
                ? "No high scores yet. Time to get sloppy!" 
                : `${profile.username} hasn't set any high scores yet.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
        <h2 className="text-lg font-bold text-[var(--accent-cyan)] mb-4 flex items-center gap-2">
          📊 Recent Activity
        </h2>
        
        <div className="text-center py-8 text-[var(--text-muted)]">
          <div className="text-4xl mb-2">🚧</div>
          <p className="text-sm">Activity tracking coming soon...</p>
          <p className="text-xs mt-2">We&apos;ll show recent games, achievements, and more slop stats here!</p>
        </div>
      </div>
    </div>
  )
}