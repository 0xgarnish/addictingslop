'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (mode === 'signup') {
        result = await signUp(email, password, username)
      } else {
        result = await signIn(email, password)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        onClose()
        resetForm()
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setUsername('')
    setError('')
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[var(--accent-cyan)]">
            {mode === 'signin' ? 'SIGN IN' : 'JOIN THE SLOP'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-2">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                placeholder="your_username"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent-cyan)] text-[var(--bg-primary)] py-2 px-4 rounded text-sm font-bold hover:bg-[var(--accent-cyan)]/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? (mode === 'signin' ? 'SIGNING IN...' : 'CREATING ACCOUNT...') 
              : (mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT')
            }
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)]"
          >
            {mode === 'signin' 
              ? "Don't have an account? Join the slop →" 
              : "Already have an account? Sign in →"
            }
          </button>
        </div>

        {mode === 'signup' && (
          <p className="mt-4 text-[10px] text-[var(--text-muted)] text-center leading-relaxed">
            By creating an account, you agree to save your high scores and be part of the chaos that is Addicting Slop.
          </p>
        )}
      </div>
    </div>
  )
}