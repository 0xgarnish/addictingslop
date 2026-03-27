import { GameState, BUBBLE_RADII } from './types';

export function renderGame(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { canvasWidth, canvasHeight } = state;
  
  // Clear canvas with dark background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw ground line
  ctx.strokeStyle = '#4a4a6a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight - 10);
  ctx.lineTo(canvasWidth, canvasHeight - 10);
  ctx.stroke();
  
  // Draw bubbles
  for (const bubble of state.bubbles) {
    const radius = BUBBLE_RADII[bubble.size];
    
    // Bubble gradient
    const gradient = ctx.createRadialGradient(
      bubble.position.x - radius * 0.3,
      bubble.position.y - radius * 0.3,
      0,
      bubble.position.x,
      bubble.position.y,
      radius
    );
    gradient.addColorStop(0, lightenColor(bubble.color, 40));
    gradient.addColorStop(0.7, bubble.color);
    gradient.addColorStop(1, darkenColor(bubble.color, 20));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(bubble.position.x, bubble.position.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Bubble shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(
      bubble.position.x - radius * 0.3,
      bubble.position.y - radius * 0.3,
      radius * 0.25,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  
  // Draw player
  const { player } = state;
  if (player.isAlive) {
    // Body
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(player.position.x, player.position.y, player.width, player.height);
    
    // Face/visor
    ctx.fillStyle = '#003322';
    ctx.fillRect(
      player.position.x + 8,
      player.position.y + 8,
      player.width - 16,
      12
    );
    
    // Harpoon gun
    ctx.fillStyle = '#666';
    ctx.fillRect(
      player.position.x + player.width / 2 - 3,
      player.position.y - 5,
      6,
      10
    );
  }
  
  // Draw harpoon
  if (state.harpoon.active) {
    const { harpoon, player: p } = state;
    
    // Harpoon line (from player to harpoon tip)
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = harpoon.width;
    ctx.beginPath();
    ctx.moveTo(p.position.x + p.width / 2, p.position.y);
    ctx.lineTo(harpoon.position.x + harpoon.width / 2, harpoon.position.y);
    ctx.stroke();
    
    // Harpoon tip
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.moveTo(harpoon.position.x + harpoon.width / 2, harpoon.position.y - 10);
    ctx.lineTo(harpoon.position.x - 5, harpoon.position.y + 5);
    ctx.lineTo(harpoon.position.x + harpoon.width + 5, harpoon.position.y + 5);
    ctx.closePath();
    ctx.fill();
  }
  
  // Draw HUD
  renderHUD(ctx, state);
  
  // Draw overlays
  if (state.status === 'menu') {
    renderMenu(ctx, state);
  } else if (state.status === 'paused') {
    renderPaused(ctx, state);
  } else if (state.status === 'levelComplete') {
    renderLevelComplete(ctx, state);
  } else if (state.status === 'gameOver') {
    renderGameOver(ctx, state);
  } else if (state.status === 'won') {
    renderWon(ctx, state);
  }
}

function renderHUD(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  
  // Score
  ctx.fillText(`SCORE: ${state.score}`, 15, 30);
  
  // Level
  ctx.textAlign = 'center';
  ctx.fillText(`LEVEL ${state.level}`, state.canvasWidth / 2, 30);
  
  // Lives
  ctx.textAlign = 'right';
  ctx.fillText(`LIVES: ${'❤️'.repeat(state.lives)}`, state.canvasWidth - 15, 30);
}

function renderOverlay(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
}

function renderMenu(ctx: CanvasRenderingContext2D, state: GameState): void {
  renderOverlay(ctx, state);
  
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 36px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BUBBLE', state.canvasWidth / 2, state.canvasHeight / 2 - 60);
  ctx.fillText('TROUBLE', state.canvasWidth / 2, state.canvasHeight / 2 - 15);
  
  ctx.fillStyle = '#fff';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillText('TAP or PRESS SPACE to START', state.canvasWidth / 2, state.canvasHeight / 2 + 40);
  
  ctx.fillStyle = '#888';
  ctx.font = '12px "Press Start 2P", monospace';
  ctx.fillText('← → to move, SPACE to shoot', state.canvasWidth / 2, state.canvasHeight / 2 + 80);
  ctx.fillText('Touch: Left/Right sides to move', state.canvasWidth / 2, state.canvasHeight / 2 + 100);
  ctx.fillText('Center to shoot', state.canvasWidth / 2, state.canvasHeight / 2 + 120);
}

function renderPaused(ctx: CanvasRenderingContext2D, state: GameState): void {
  renderOverlay(ctx, state);
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 32px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', state.canvasWidth / 2, state.canvasHeight / 2);
  
  ctx.font = '14px "Press Start 2P", monospace';
  ctx.fillText('Press ESC or TAP to resume', state.canvasWidth / 2, state.canvasHeight / 2 + 40);
}

function renderLevelComplete(ctx: CanvasRenderingContext2D, state: GameState): void {
  renderOverlay(ctx, state);
  
  ctx.fillStyle = '#4ecdc4';
  ctx.font = 'bold 28px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL COMPLETE!', state.canvasWidth / 2, state.canvasHeight / 2 - 20);
  
  ctx.fillStyle = '#fff';
  ctx.font = '14px "Press Start 2P", monospace';
  ctx.fillText(`Score: ${state.score}`, state.canvasWidth / 2, state.canvasHeight / 2 + 20);
  ctx.fillText('TAP or PRESS SPACE for next level', state.canvasWidth / 2, state.canvasHeight / 2 + 60);
}

function renderGameOver(ctx: CanvasRenderingContext2D, state: GameState): void {
  renderOverlay(ctx, state);
  
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 32px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', state.canvasWidth / 2, state.canvasHeight / 2 - 20);
  
  ctx.fillStyle = '#fff';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillText(`Final Score: ${state.score}`, state.canvasWidth / 2, state.canvasHeight / 2 + 20);
  ctx.font = '14px "Press Start 2P", monospace';
  ctx.fillText('TAP or PRESS SPACE to restart', state.canvasWidth / 2, state.canvasHeight / 2 + 60);
}

function renderWon(ctx: CanvasRenderingContext2D, state: GameState): void {
  renderOverlay(ctx, state);
  
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 28px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('🎉 YOU WIN! 🎉', state.canvasWidth / 2, state.canvasHeight / 2 - 20);
  
  ctx.fillStyle = '#fff';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillText(`Final Score: ${state.score}`, state.canvasWidth / 2, state.canvasHeight / 2 + 20);
  ctx.font = '14px "Press Start 2P", monospace';
  ctx.fillText('TAP or PRESS SPACE to play again', state.canvasWidth / 2, state.canvasHeight / 2 + 60);
}

// Color utility functions
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + Math.floor(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.floor(255 * percent / 100));
  const b = Math.min(255, (num & 0x0000FF) + Math.floor(255 * percent / 100));
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - Math.floor(255 * percent / 100));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.floor(255 * percent / 100));
  const b = Math.max(0, (num & 0x0000FF) - Math.floor(255 * percent / 100));
  return `rgb(${r}, ${g}, ${b})`;
}
