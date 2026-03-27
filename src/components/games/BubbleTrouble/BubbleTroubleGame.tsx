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

      // Update game state
      gameStateRef.current = updateGameState(gameStateRef.current, input);

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
  }, [dimensions]);

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

  const handleAction = useCallback(() => {
    if (!gameStateRef.current) return;

    const state = gameStateRef.current;

    switch (state.status) {
      case 'menu':
        gameStateRef.current = startLevel(state);
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
        gameStateRef.current = startLevel(resetGame(state));
        break;
    }
  }, []);

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
    </div>
  );
}
