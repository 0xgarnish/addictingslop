'use client';

import dynamic from 'next/dynamic';
import GameLeaderboard from '@/components/leaderboards/GameLeaderboard';

// Dynamic import to avoid SSR issues with canvas
const BubbleTroubleGame = dynamic(
  () => import('@/components/games/BubbleTrouble/BubbleTroubleGame'),
  { ssr: false }
);

export default function BubbleTroublePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Game */}
      <div className="relative">
        <BubbleTroubleGame />
        
        {/* Leaderboard Overlay */}
        <div className="absolute bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)] md:w-96 z-20">
          <GameLeaderboard 
            gameSlug="bubble-trouble" 
            gameTitle="Bubble Trouble"
            limit={5}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
}
