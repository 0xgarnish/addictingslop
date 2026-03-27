// Bubble Trouble Game Types

export interface Vector2 {
  x: number;
  y: number;
}

export interface Bubble {
  id: string;
  position: Vector2;
  velocity: Vector2;
  size: BubbleSize;
  color: string;
}

export type BubbleSize = 'xl' | 'lg' | 'md' | 'sm';

export const BUBBLE_RADII: Record<BubbleSize, number> = {
  xl: 50,
  lg: 35,
  md: 24,
  sm: 16,
};

export const BUBBLE_COLORS = [
  '#FF6B6B', // red
  '#4ECDC4', // teal
  '#45B7D1', // blue
  '#96CEB4', // green
  '#FFEAA7', // yellow
  '#DDA0DD', // plum
  '#FF8C42', // orange
];

export interface Player {
  position: Vector2;
  width: number;
  height: number;
  speed: number;
  isAlive: boolean;
}

export interface Harpoon {
  position: Vector2;
  active: boolean;
  speed: number;
  width: number;
}

export interface GameState {
  player: Player;
  harpoon: Harpoon;
  bubbles: Bubble[];
  score: number;
  lives: number;
  level: number;
  status: 'menu' | 'playing' | 'paused' | 'levelComplete' | 'gameOver' | 'won';
  canvasWidth: number;
  canvasHeight: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  shoot: boolean;
}

export interface TouchState {
  leftPressed: boolean;
  rightPressed: boolean;
  shootPressed: boolean;
}

export const GRAVITY = 0.15;
export const BOUNCE_DAMPING = 0.98;
export const PLAYER_SPEED = 6;
export const HARPOON_SPEED = 12;
export const MAX_LEVELS = 10;
