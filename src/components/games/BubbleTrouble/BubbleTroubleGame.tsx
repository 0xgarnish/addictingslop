'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, InputState } from './types';
import {
  createInitialState,
  startLevel,
  updateGameState,
  nextLevel,
  resetGame,
} from './gameLogic';
import { renderGame } from './renderer';
import { useGameScoring } from '@/hooks/useGameScoring';
import ScoreDisplay from '@/components/game-ui/ScoreDisplay';
import GameOverModal from '@/components/game-ui/GameOverModal';

interface BubbleTroubleGameProps {
  width?: number;
  height?: number;
}

export default function BubbleTroubleGame({
  width: initialWidth,
  height: initialHeight,
}: BubbleTroubleGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const inputRef = useRef<InputState>({ left: false, right: false, shoot: false });
  const lastShootRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  
  const [dimensions, setDimensions] = useState({ 
    width: initialWidth || 800, 
    height: initialHeight || 600 
  });

  // Game scoring integration
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverData, setGameOverData] = useState<{
    score: number;
    isHighScore: boolean;
    isPersonalBest: boolean;
    previousBest?: number;
  } | null>(null);
  const [personalBest, setPersonalBest] = useState<number | undefined>(undefined);

  const {
    startSession,
    endSession,
    updateScore,
    getPersonalBest,
    isSignedIn,
    playerName
  } = useGameScoring({
    gameSlug: 'bubble-trouble',
    onHighScore: (score, isPersonalBest) => {
      console.log(`High score achieved: ${score}, Personal best: ${isPersonalBest}`);
    }
  });

  // Handle responsive sizing - fullscreen with 20px padding
  useEffect(() => {
    const updateSize = () => {
      const padding = 20;
      const width = window.innerWidth - (padding * 2);
      const height = window.innerHeight - (padding * 2);
      
      setDimensions({ width: Math.floor(width), height: Math.floor(height) });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize game state when dimensions change
  useEffect(() => {
    gameStateRef.current = createInitialState(dimensions.width, dimensions.height);
  }, [dimensions]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (!gameStateRef.current) return;

      const input = { ...inputRef.current };
      
      // Only trigger shoot on press, not hold
      if (input.shoot && lastShootRef.current) {
        input.shoot = false;
      }
      lastShootRef.current = inputRef.current.shoot;

      const previousState = { ...gameStateRef.current };
      
      // Update game state
      gameStateRef.current = updateGameState(gameStateRef.current, input);

      // Update score if it changed
      if (gameStateRef.current.score !== previousState.score) {
        updateScore(gameStateRef.current.score);
      }

      // Handle game over
      if ((gameStateRef.current.status === 'gameOver' || gameStateRef.current.status === 'won') && 
          previousState.status !== gameStateRef.current.status) {
        handleGameOver(gameStateRef.current.score);
      }

      // Render
      renderGame(ctx, gameStateRef.current);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, updateScore]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStateRef.current) return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          inputRef.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          inputRef.current.right = true;
          break;
        case 'Space':
          e.preventDefault();
          handleAction();
          break;
        case 'Escape':
          if (gameStateRef.current.status === 'playing') {
            gameStateRef.current = { ...gameStateRef.current, status: 'paused' };
          } else if (gameStateRef.current.status === 'paused') {
            gameStateRef.current = { ...gameStateRef.current, status: 'playing' };
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          inputRef.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          inputRef.current.right = false;
          break;
        case 'Space':
          inputRef.current.shoot = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Load personal best on mount
  useEffect(() => {
    const loadPersonalBest = async () => {
      const pb = await getPersonalBest();
      setPersonalBest(pb?.score);
    };
    loadPersonalBest();
  }, [getPersonalBest]);

  // Handle game over
  const handleGameOver = useCallback(async (finalScore: number) => {
    const result = await endSession(finalScore);
    setGameOverData({
      score: finalScore,
      isHighScore: result.isHighScore,
      isPersonalBest: result.isPersonalBest,
      previousBest: result.previousBest || personalBest
    });
    setShowGameOver(true);
    
    // Update personal best if needed
    if (result.isPersonalBest) {
      setPersonalBest(finalScore);
    }
  }, [endSession, personalBest]);

  // Handle new game start
  const handleNewGame = useCallback(() => {
    startSession();
    if (gameStateRef.current) {
      gameStateRef.current = startLevel(resetGame(gameStateRef.current));
    }
  }, [startSession]);

  const handleAction = useCallback(() => {
    if (!gameStateRef.current) return;

    const state = gameStateRef.current;

    switch (state.status) {
      case 'menu':
        handleNewGame();
        break;
      case 'playing':
        inputRef.current.shoot = true;
        break;
      case 'paused':
        gameStateRef.current = { ...state, status: 'playing' };
        break;
      case 'levelComplete':
        gameStateRef.current = nextLevel(state);
        break;
      case 'gameOver':
      case 'won':
        handleNewGame();
        break;
    }
  }, [handleNewGame]);

  // Touch input
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (!gameStateRef.current) return;
    if (gameStateRef.current.status !== 'playing') {
      handleAction();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches.item(i);
      if (!touch) continue;
      const x = touch.clientX - rect.left;
      const relativeX = x / rect.width;

      if (relativeX < 0.33) {
        inputRef.current.left = true;
      } else if (relativeX > 0.66) {
        inputRef.current.right = true;
      } else {
        inputRef.current.shoot = true;
      }
    }
  }, [handleAction]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    // Check remaining touches
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    inputRef.current = { left: false, right: false, shoot: false };
    
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches.item(i);
      if (!touch) continue;
      const x = touch.clientX - rect.left;
      const relativeX = x / rect.width;

      if (relativeX < 0.33) {
        inputRef.current.left = true;
      } else if (relativeX > 0.66) {
        inputRef.current.right = true;
      }
    }
  }, []);

  const handleClick = useCallback((_e: React.MouseEvent) => {
    if (!gameStateRef.current) return;
    if (gameStateRef.current.status !== 'playing') {
      handleAction();
    }
  }, [handleAction]);

  return (
    <div 
      ref={containerRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0f0f1a',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => e.preventDefault()}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: 'none',
          cursor: 'pointer',
        }}
      />

      {/* Score Display */}
      {gameStateRef.current && (gameStateRef.current.status === 'playing' || gameStateRef.current.status === 'paused') && (
        <div 
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            zIndex: 10,
          }}
        >
          <ScoreDisplay 
            score={gameStateRef.current.score}
            personalBest={personalBest}
            compact={true}
          />
        </div>
      )}

      {/* Game Status Overlay */}
      {gameStateRef.current && gameStateRef.current.status !== 'playing' && !showGameOver && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--text-primary)',
            backgroundColor: 'rgba(15, 15, 26, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            zIndex: 10,
          }}
        >
          {gameStateRef.current.status === 'menu' && (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '10px', color: 'var(--accent-cyan)' }}>
                BUBBLE TROUBLE
              </h2>
              <p style={{ fontSize: '14px', marginBottom: '15px', color: 'var(--text-muted)' }}>
                {isSignedIn ? `Welcome back, ${playerName}!` : 'Pop bubbles to score points!'}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                SPACE to start • WASD/Arrows to move • SPACE to shoot
              </p>
            </>
          )}
          
          {gameStateRef.current.status === 'paused' && (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '10px', color: 'var(--accent-yellow)' }}>
                PAUSED
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                ESC or SPACE to resume
              </p>
            </>
          )}
          
          {gameStateRef.current.status === 'levelComplete' && (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '10px', color: 'var(--accent-green)' }}>
                LEVEL {gameStateRef.current.level} COMPLETE!
              </h2>
              <p style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--accent-cyan)' }}>
                Score: {gameStateRef.current.score.toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                SPACE to continue
              </p>
            </>
          )}
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOver && gameOverData && (
        <GameOverModal
          isOpen={showGameOver}
          score={gameOverData.score}
          isHighScore={gameOverData.isHighScore}
          isPersonalBest={gameOverData.isPersonalBest}
          previousBest={gameOverData.previousBest}
          gameTitle="Bubble Trouble"
          onPlayAgain={handleNewGame}
          onClose={() => setShowGameOver(false)}
        />
      )}
    </div>
  );
}
