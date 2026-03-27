'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface ScoreDisplayProps {
  score: number
  personalBest?: number
  showPersonalBest?: boolean
  compact?: boolean
  className?: string
}

export default function ScoreDisplay({ 
  score, 
  personalBest, 
  showPersonalBest = true,
  compact = false,
  className = '' 
}: ScoreDisplayProps) {
  const { user } = useAuth()
  const [showPB, setShowPB] = useState(false)

  const isNewPersonalBest = personalBest !== undefined && score > personalBest

  if (compact) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-lg font-bold text-[var(--accent-cyan)]">
          {score.toLocaleString()}
        </div>
        {personalBest !== undefined && showPersonalBest && (
          <div className="text-xs text-[var(--text-muted)]">
            PB: {personalBest.toLocaleString()}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 ${className}`}>
      <div className="text-center">
        <div className="text-sm text-[var(--text-muted)] mb-1">SCORE</div>
        <div className={`text-2xl font-bold ${
          isNewPersonalBest ? 'text-[var(--accent-green)] animate-pulse' : 'text-[var(--accent-cyan)]'
        }`}>
          {score.toLocaleString()}
        </div>
        
        {isNewPersonalBest && (
          <div className="text-xs text-[var(--accent-green)] mt-1 animate-bounce">
            NEW PERSONAL BEST! 🎉
          </div>
        )}
        
        {user && personalBest !== undefined && showPersonalBest && !isNewPersonalBest && (
          <div className="mt-2">
            <button
              onClick={() => setShowPB(!showPB)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
            >
              {showPB ? 'Hide PB' : 'Show Personal Best'}
            </button>
            {showPB && (
              <div className="text-sm text-[var(--text-muted)] mt-1">
                Personal Best: {personalBest.toLocaleString()}
              </div>
            )}
          </div>
        )}

        {!user && (
          <div className="text-xs text-[var(--text-muted)] mt-2">
            Sign in to save your high scores!
          </div>
        )}
      </div>
    </div>
  )
}