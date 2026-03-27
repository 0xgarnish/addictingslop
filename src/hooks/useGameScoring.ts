'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export interface GameSession {
  gameSlug: string
  playerName?: string
  currentScore: number
  isActive: boolean
  startTime: number
}

interface UseGameScoringOptions {
  gameSlug: string
  onHighScore?: (score: number, isPersonalBest: boolean) => void
  autoSaveInterval?: number // milliseconds, 0 = disabled
}

export function useGameScoring({ 
  gameSlug, 
  onHighScore,
  autoSaveInterval = 30000 // 30 seconds default
}: UseGameScoringOptions) {
  const { user, profile } = useAuth()
  const sessionRef = useRef<GameSession | null>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedScore = useRef<number>(0)

  // Start a new game session
  const startSession = useCallback(async () => {
    const session: GameSession = {
      gameSlug,
      playerName: profile?.username,
      currentScore: 0,
      isActive: true,
      startTime: Date.now()
    }
    
    sessionRef.current = session

    // Record play session in database
    if (!user) {
      console.warn('[useGameScoring] startSession: no authed user, not recording play session')
    } else {
      try {
        const { error } = await supabase
          .from('play_sessions')
          .insert({
            user_id: user.id,
            game_slug: gameSlug,
            played_at: new Date().toISOString()
          })

        if (error) {
          console.error('[useGameScoring] play_sessions insert error', error)
        } else {
          console.log('[useGameScoring] play_sessions insert ok')
        }
      } catch (error) {
        console.warn('[useGameScoring] Failed to record play session (exception):', error)
      }
    }

    return session
  }, [gameSlug, profile?.username, user])

  // Save final score and check for high score
  const saveScore = useCallback(async (finalScore: number, endSession: boolean = true) => {
    if (!user || !sessionRef.current) {
      if (endSession && sessionRef.current) {
        sessionRef.current.isActive = false
      }
      return { saved: false, isHighScore: false, isPersonalBest: false }
    }

    try {
      // Check current high score for this user/game
      const { data: currentHighScore } = await supabase
        .from('high_scores')
        .select('score')
        .eq('user_id', user.id)
        .eq('game_slug', gameSlug)
        .single()

      const isPersonalBest = !currentHighScore || finalScore > currentHighScore.score
      
      if (isPersonalBest) {
        // Save new high score (upsert)
        const { error: upsertError } = await supabase
          .from('high_scores')
          .upsert({
            user_id: user.id,
            game_slug: gameSlug,
            score: finalScore,
            achieved_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,game_slug'
          })

        if (upsertError) {
          console.error('[useGameScoring] high_scores upsert error', upsertError)
        }

        // Check if it's a global high score
        const { data: topScores } = await supabase
          .from('high_scores')
          .select('score')
          .eq('game_slug', gameSlug)
          .order('score', { ascending: false })
          .limit(1)

        const isGlobalHighScore = !topScores || topScores.length === 0 || finalScore >= topScores[0].score

        if (onHighScore) {
          onHighScore(finalScore, isPersonalBest)
        }

        if (endSession && sessionRef.current) {
          sessionRef.current.isActive = false
        }

        return { 
          saved: true, 
          isHighScore: isGlobalHighScore, 
          isPersonalBest: true,
          previousBest: currentHighScore?.score || 0
        }
      }

      if (endSession && sessionRef.current) {
        sessionRef.current.isActive = false
      }

      return { 
        saved: false, 
        isHighScore: false, 
        isPersonalBest: false,
        currentBest: currentHighScore?.score || 0
      }
    } catch (error) {
      console.error('Failed to save score:', error)
      if (endSession && sessionRef.current) {
        sessionRef.current.isActive = false
      }
      return { saved: false, isHighScore: false, isPersonalBest: false }
    }
  }, [user, gameSlug, onHighScore])

  // Update score during gameplay
  const updateScore = useCallback((newScore: number) => {
    if (!sessionRef.current) return

    sessionRef.current.currentScore = newScore

    // Auto-save progress if enabled and score increased (don’t require game over)
    if (autoSaveInterval > 0 && newScore > lastSavedScore.current) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveScore(newScore, false) // Don't end session
        lastSavedScore.current = newScore
      }, autoSaveInterval)
    }
  }, [autoSaveInterval, saveScore])

  // End current session
  const endSession = useCallback(async (finalScore?: number) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    if (finalScore !== undefined) {
      return await saveScore(finalScore, true)
    } else if (sessionRef.current) {
      sessionRef.current.isActive = false
      return { saved: false, isHighScore: false, isPersonalBest: false }
    }

    return { saved: false, isHighScore: false, isPersonalBest: false }
  }, [saveScore])

  // Get current session info
  const getSession = useCallback(() => sessionRef.current, [])

  // Get user's personal best for this game
  const getPersonalBest = useCallback(async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('high_scores')
        .select('score, achieved_at')
        .eq('user_id', user.id)
        .eq('game_slug', gameSlug)
        .single()

      return error ? null : data
    } catch (error) {
      return null
    }
  }, [user, gameSlug])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      // Auto-end session on component unmount if still active
      if (sessionRef.current?.isActive) {
        endSession()
      }
    }
  }, [endSession])

  return {
    // Session management
    startSession,
    endSession,
    getSession,
    
    // Score tracking
    updateScore,
    saveScore,
    getPersonalBest,

    // Current session state
    currentSession: sessionRef.current,
    isSignedIn: !!user,
    playerName: profile?.username
  }
}