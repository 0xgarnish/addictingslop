import {
  Bubble,
  BubbleSize,
  BUBBLE_RADII,
  BUBBLE_COLORS,
  GameState,
  Player,
  Harpoon,
  InputState,
  GRAVITY,
  BOUNCE_DAMPING,
  PLAYER_SPEED,
  HARPOON_SPEED,
  MAX_LEVELS,
} from './types';

let bubbleIdCounter = 0;

function generateBubbleId(): string {
  return `bubble_${++bubbleIdCounter}`;
}

function getNextSize(size: BubbleSize): BubbleSize | null {
  const order: BubbleSize[] = ['xl', 'lg', 'md', 'sm'];
  const idx = order.indexOf(size);
  if (idx < order.length - 1) {
    return order[idx + 1] as BubbleSize;
  }
  return null;
}

function randomColor(): string {
  return BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)] ?? '#FF6B6B';
}

export function createBubble(
  x: number,
  y: number,
  size: BubbleSize,
  vx: number = 0,
  vy: number = 0,
  color?: string
): Bubble {
  return {
    id: generateBubbleId(),
    position: { x, y },
    velocity: { x: vx || (Math.random() > 0.5 ? 2 : -2), y: vy },
    size,
    color: color || randomColor(),
  };
}

export function createInitialState(canvasWidth: number, canvasHeight: number): GameState {
  const playerWidth = 40;
  const playerHeight = 50;
  
  return {
    player: {
      position: { x: canvasWidth / 2 - playerWidth / 2, y: canvasHeight - playerHeight - 10 },
      width: playerWidth,
      height: playerHeight,
      speed: PLAYER_SPEED,
      isAlive: true,
    },
    harpoon: {
      position: { x: 0, y: 0 },
      active: false,
      speed: HARPOON_SPEED,
      width: 4,
    },
    bubbles: [],
    score: 0,
    lives: 3,
    level: 1,
    status: 'menu',
    canvasWidth,
    canvasHeight,
  };
}

export function generateLevelBubbles(level: number, canvasWidth: number): Bubble[] {
  const bubbles: Bubble[] = [];
  
  // More bubbles as levels progress
  const xlCount = Math.min(level, 3);
  const lgCount = Math.max(0, Math.floor((level - 3) / 2));
  
  for (let i = 0; i < xlCount; i++) {
    const x = (canvasWidth / (xlCount + 1)) * (i + 1);
    bubbles.push(createBubble(x, 100, 'xl', (Math.random() - 0.5) * 4, 0));
  }
  
  for (let i = 0; i < lgCount; i++) {
    const x = 100 + Math.random() * (canvasWidth - 200);
    bubbles.push(createBubble(x, 150, 'lg', (Math.random() - 0.5) * 4, 0));
  }
  
  return bubbles;
}

export function startLevel(state: GameState): GameState {
  const bubbles = generateLevelBubbles(state.level, state.canvasWidth);
  
  return {
    ...state,
    bubbles,
    player: {
      ...state.player,
      position: { 
        x: state.canvasWidth / 2 - state.player.width / 2, 
        y: state.canvasHeight - state.player.height - 10 
      },
      isAlive: true,
    },
    harpoon: { ...state.harpoon, active: false },
    status: 'playing',
  };
}

function updateBubbles(bubbles: Bubble[], canvasWidth: number, canvasHeight: number): Bubble[] {
  return bubbles.map(bubble => {
    const radius = BUBBLE_RADII[bubble.size];
    let { x, y } = bubble.position;
    let { x: vx, y: vy } = bubble.velocity;
    
    // Apply gravity
    vy += GRAVITY;
    
    // Update position
    x += vx;
    y += vy;
    
    // Bounce off walls
    if (x - radius < 0) {
      x = radius;
      vx = Math.abs(vx) * BOUNCE_DAMPING;
    } else if (x + radius > canvasWidth) {
      x = canvasWidth - radius;
      vx = -Math.abs(vx) * BOUNCE_DAMPING;
    }
    
    // Bounce off floor
    if (y + radius > canvasHeight - 10) {
      y = canvasHeight - 10 - radius;
      // Consistent bounce height based on size
      const bounceHeight = 8 + (4 - ['xl', 'lg', 'md', 'sm'].indexOf(bubble.size)) * 2;
      vy = -bounceHeight;
    }
    
    // Ceiling collision
    if (y - radius < 0) {
      y = radius;
      vy = Math.abs(vy) * 0.5;
    }
    
    return {
      ...bubble,
      position: { x, y },
      velocity: { x: vx, y: vy },
    };
  });
}

function updatePlayer(player: Player, input: InputState, canvasWidth: number): Player {
  let newX = player.position.x;
  
  if (input.left) {
    newX -= player.speed;
  }
  if (input.right) {
    newX += player.speed;
  }
  
  // Clamp to canvas bounds
  newX = Math.max(0, Math.min(canvasWidth - player.width, newX));
  
  return {
    ...player,
    position: { ...player.position, x: newX },
  };
}

function updateHarpoon(
  harpoon: Harpoon,
  player: Player,
  input: InputState,
  _canvasHeight: number
): Harpoon {
  if (!harpoon.active && input.shoot) {
    // Fire harpoon from player center
    return {
      ...harpoon,
      active: true,
      position: {
        x: player.position.x + player.width / 2 - harpoon.width / 2,
        y: player.position.y,
      },
    };
  }
  
  if (harpoon.active) {
    const newY = harpoon.position.y - harpoon.speed;
    
    // Harpoon reached top
    if (newY < 0) {
      return { ...harpoon, active: false };
    }
    
    return {
      ...harpoon,
      position: { ...harpoon.position, y: newY },
    };
  }
  
  return harpoon;
}

function checkHarpoonBubbleCollision(harpoon: Harpoon, bubble: Bubble): boolean {
  if (!harpoon.active) return false;
  
  const radius = BUBBLE_RADII[bubble.size];
  const harpoonTop = harpoon.position.y;
  const harpoonBottom = harpoonTop + 20; // Harpoon tip height
  const harpoonCenterX = harpoon.position.x + harpoon.width / 2;
  
  // Check if harpoon line intersects bubble circle
  const dx = harpoonCenterX - bubble.position.x;
  
  // Simple circle-line intersection
  if (Math.abs(dx) < radius && 
      harpoonTop < bubble.position.y + radius &&
      harpoonBottom > bubble.position.y - radius) {
    return true;
  }
  
  return false;
}

function checkPlayerBubbleCollision(player: Player, bubble: Bubble): boolean {
  const radius = BUBBLE_RADII[bubble.size];
  
  // Player hitbox (rectangle)
  const playerLeft = player.position.x;
  const playerRight = player.position.x + player.width;
  const playerTop = player.position.y;
  const playerBottom = player.position.y + player.height;
  
  // Find closest point on player rect to bubble center
  const closestX = Math.max(playerLeft, Math.min(bubble.position.x, playerRight));
  const closestY = Math.max(playerTop, Math.min(bubble.position.y, playerBottom));
  
  // Check distance from closest point to bubble center
  const dx = bubble.position.x - closestX;
  const dy = bubble.position.y - closestY;
  
  return (dx * dx + dy * dy) < (radius * radius);
}

function splitBubble(bubble: Bubble): Bubble[] {
  const nextSize = getNextSize(bubble.size);
  if (!nextSize) return []; // Smallest bubble, just destroy
  
  const radius = BUBBLE_RADII[nextSize];
  const splitSpeed = 3;
  
  return [
    createBubble(
      bubble.position.x - radius,
      bubble.position.y,
      nextSize,
      -splitSpeed,
      -4,
      bubble.color
    ),
    createBubble(
      bubble.position.x + radius,
      bubble.position.y,
      nextSize,
      splitSpeed,
      -4,
      bubble.color
    ),
  ];
}

function getScoreForBubble(size: BubbleSize): number {
  const scores: Record<BubbleSize, number> = {
    xl: 100,
    lg: 200,
    md: 300,
    sm: 500,
  };
  return scores[size];
}

export function updateGameState(state: GameState, input: InputState): GameState {
  if (state.status !== 'playing') return state;
  
  let { player, harpoon, bubbles, score, lives, level } = state;
  let status: GameState['status'] = state.status;
  
  // Update player position
  player = updatePlayer(player, input, state.canvasWidth);
  
  // Update harpoon
  harpoon = updateHarpoon(harpoon, player, input, state.canvasHeight);
  
  // Update bubble positions
  bubbles = updateBubbles(bubbles, state.canvasWidth, state.canvasHeight);
  
  // Check harpoon-bubble collisions
  let newBubbles: Bubble[] = [];
  let harpoonHit = false;
  
  for (const bubble of bubbles) {
    if (!harpoonHit && checkHarpoonBubbleCollision(harpoon, bubble)) {
      // Bubble hit! Split it
      score += getScoreForBubble(bubble.size);
      newBubbles.push(...splitBubble(bubble));
      harpoonHit = true;
    } else {
      newBubbles.push(bubble);
    }
  }
  
  if (harpoonHit) {
    harpoon = { ...harpoon, active: false };
  }
  
  bubbles = newBubbles;
  
  // Check player-bubble collisions
  for (const bubble of bubbles) {
    if (checkPlayerBubbleCollision(player, bubble)) {
      lives--;
      if (lives <= 0) {
        status = 'gameOver';
      } else {
        // Reset player position but keep bubbles
        player = {
          ...player,
          position: {
            x: state.canvasWidth / 2 - player.width / 2,
            y: state.canvasHeight - player.height - 10,
          },
        };
        harpoon = { ...harpoon, active: false };
      }
      break;
    }
  }
  
  // Check win condition
  if (bubbles.length === 0 && status === 'playing') {
    if (level >= MAX_LEVELS) {
      status = 'won';
    } else {
      status = 'levelComplete';
    }
  }
  
  return {
    ...state,
    player,
    harpoon,
    bubbles,
    score,
    lives,
    level,
    status,
  };
}

export function nextLevel(state: GameState): GameState {
  return startLevel({
    ...state,
    level: state.level + 1,
  });
}

export function resetGame(state: GameState): GameState {
  return {
    ...createInitialState(state.canvasWidth, state.canvasHeight),
    status: 'menu',
  };
}
