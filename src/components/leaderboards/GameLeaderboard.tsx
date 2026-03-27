'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, HighScore } from '@/lib/supabase'
import Link from 'next/link'

interface GameLeaderboardProps {
  gameSlug: string
  gameTitle: string
  limit?: number
  showRank?: boolean
  compact?: boolean
  className?: string
}

export default function GameLeaderboard({
  gameSlug,
  gameTitle,
  limit = 10,
  showRank = true,
  compact = false,
  className = ''
}: GameLeaderboardProps) {
  const [scores, setScores] = useState<(HighScore & { profile: { username: string } })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchLeaderboard()
  }, [gameSlug, limit])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('high_scores')
        .select(`
          *,
          profile:profiles!user_id (
            username
          )
        `)
        .eq('game_slug', gameSlug)
        .order('score', { ascending: false })
        .limit(limit)

      if (error) throw error

      // Filter out any scores without profiles and type-cast
      const validScores = (data || []).filter(score => score.profile) as (HighScore & { 
        profile: { username: string } 
      })[]
      
      setScores(validScores)
    } catch (err) {
      setError('Failed to load leaderboard')
      console.error('Leaderboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-cyan)] mx-auto"></div>
          <div className="text-xs text-[var(--text-muted)] mt-2">Loading leaderboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 ${className}`}>
        <div className="text-center text-sm text-[var(--text-muted)]">
          Failed to load leaderboard
        </div>
      </div>
    )
  }

  if (scores.length === 0) {
    return (
      <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <div className="text-lg mb-2">🎯</div>
          <div className="text-sm text-[var(--text-muted)]">
            No scores yet for {gameTitle}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">
            Be the first to set a high score!
          </div>
        </div>
      </div>
    )
  }

  const getRankDisplay = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getRankColor = (index: number) => {
    if (index === 0) return 'text-[var(--accent-yellow)]'
    if (index === 1) return 'text-[var(--text-muted)]'
    if (index === 2) return 'text-[var(--accent-yellow)]'
    return 'text-[var(--text-muted)]'
  }

  return (
    <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-lg ${className}`}>
      {/* Header */}
      {!compact && (
        <div className="p-4 border-b border-[var(--border)]">
          <h3 className="font-bold text-[var(--accent-cyan)] flex items-center gap-2">
            🏆 {gameTitle} Leaderboard
          </h3>
        </div>
      )}

      {/* Scores List */}
      <div className={`${compact ? 'p-2' : 'p-4'}`}>
        <div className="space-y-2">
          {scores.map((score, index) => {
            const isCurrentUser = user && score.user_id === user.id
            
            return (
              <div 
                key={score.id} 
                className={`flex items-center justify-between p-2 rounded border transition-colors ${
                  isCurrentUser 
                    ? 'bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/30' 
                    : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {showRank && (
                    <div className={`text-sm font-bold min-w-[30px] ${getRankColor(index)}`}>
                      {getRankDisplay(index)}
                    </div>
                  )}
                  
                  <Link
                    href={`/profile/${score.profile.username}`}
                    className={`text-sm hover:text-[var(--accent-cyan)] transition-colors ${
                      isCurrentUser ? 'text-[var(--accent-cyan)] font-bold' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {score.profile.username}
                    {isCurrentUser && (
                      <span className="text-xs text-[var(--accent-cyan)] ml-1">(You)</span>
                    )}
                  </Link>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    index === 0 ? 'text-[var(--accent-green)]' : 'text-[var(--text-primary)]'
                  }`}>
                    {score.score.toLocaleString()}
                  </div>
                  {!compact && (
                    <div className="text-xs text-[var(--text-muted)]">
                      {new Date(score.achieved_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* View More Link */}
        {!compact && scores.length === limit && (
          <div className="text-center mt-4">
            <Link
              href={`/leaderboards/${gameSlug}`}
              className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]/80"
            >
              View Full Leaderboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}