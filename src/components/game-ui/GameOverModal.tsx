'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'

interface GameOverModalProps {
  isOpen: boolean
  score: number
  isHighScore: boolean
  isPersonalBest: boolean
  previousBest?: number
  gameTitle: string
  onPlayAgain: () => void
  onClose: () => void
}

export default function GameOverModal({
  isOpen,
  score,
  isHighScore,
  isPersonalBest,
  previousBest,
  gameTitle,
  onPlayAgain,
  onClose
}: GameOverModalProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, profile } = useAuth()

  if (!isOpen) return null

  const handlePlayAgain = () => {
    onPlayAgain()
    onClose()
  }

  const handleSignUp = () => {
    setShowAuthModal(true)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg max-w-md w-full p-6 text-center">
          
          {/* Header */}
          <div className="mb-6">
            {isHighScore ? (
              <div className="text-3xl mb-2">🏆</div>
            ) : isPersonalBest ? (
              <div className="text-3xl mb-2">🎉</div>
            ) : (
              <div className="text-3xl mb-2">💀</div>
            )}
            
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              {isHighScore ? 'NEW HIGH SCORE!' : isPersonalBest ? 'PERSONAL BEST!' : 'GAME OVER'}
            </h2>
            
            <p className="text-sm text-[var(--text-muted)]">
              {gameTitle}
            </p>
          </div>

          {/* Score Display */}
          <div className="mb-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 mb-4">
              <div className="text-sm text-[var(--text-muted)] mb-1">FINAL SCORE</div>
              <div className={`text-3xl font-bold ${
                isPersonalBest ? 'text-[var(--accent-green)]' : 'text-[var(--accent-cyan)]'
              }`}>
                {score.toLocaleString()}
              </div>
              
              {isPersonalBest && previousBest !== undefined && (
                <div className="text-sm text-[var(--text-muted)] mt-2">
                  Previous Best: {previousBest.toLocaleString()}
                  <span className="text-[var(--accent-green)] ml-2">
                    (+{(score - previousBest).toLocaleString()})
                  </span>
                </div>
              )}
            </div>

            {/* Achievement Messages */}
            {isHighScore && (
              <div className="bg-gradient-to-r from-[var(--accent-green)]/20 to-[var(--accent-cyan)]/20 border border-[var(--accent-green)]/30 rounded p-3 mb-3">
                <div className="text-sm text-[var(--accent-green)] font-bold">
                  🌟 GLOBAL HIGH SCORE! 🌟
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  You're now #1 on the leaderboard!
                </div>
              </div>
            )}

            {isPersonalBest && !isHighScore && (
              <div className="bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/30 rounded p-3 mb-3">
                <div className="text-sm text-[var(--accent-cyan)] font-bold">
                  Personal Best Achieved!
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  Keep climbing those leaderboards!
                </div>
              </div>
            )}

            {!user && score > 0 && (
              <div className="bg-[var(--accent-pink)]/20 border border-[var(--accent-pink)]/30 rounded p-3 mb-3">
                <div className="text-sm text-[var(--accent-pink)] font-bold">
                  Sign up to save this score!
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  Track your progress and compete on leaderboards
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePlayAgain}
              className="w-full bg-[var(--accent-cyan)] text-[var(--bg-primary)] py-3 px-4 rounded text-sm font-bold hover:bg-[var(--accent-cyan)]/80 transition-colors"
            >
              🎮 PLAY AGAIN
            </button>

            {!user && (
              <button
                onClick={handleSignUp}
                className="w-full bg-[var(--accent-green)] text-[var(--bg-primary)] py-3 px-4 rounded text-sm font-bold hover:bg-[var(--accent-green)]/80 transition-colors"
              >
                📊 SIGN UP & SAVE SCORES
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] py-2 px-4 rounded text-sm hover:bg-[var(--bg-card)] transition-colors"
              >
                Back to Game
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] py-2 px-4 rounded text-sm hover:bg-[var(--bg-card)] transition-colors"
              >
                More Slop
              </button>
            </div>
          </div>

          {/* User Info */}
          {user && profile && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <div className="text-xs text-[var(--text-muted)]">
                Playing as <span className="text-[var(--accent-cyan)]">{profile.username}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </>
  )
}