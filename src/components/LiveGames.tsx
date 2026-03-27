"use client";

import Link from "next/link";

interface LiveGame {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  href: string;
  aiGenerated: boolean;
  tags: string[];
}

const LIVE_GAMES: LiveGame[] = [
  {
    id: "bubble-trouble",
    title: "BUBBLE TROUBLE",
    thumbnail: "🫧",
    description: "Classic arcade bubble popper. Shoot, split, survive!",
    href: "/games/bubble-trouble",
    aiGenerated: true,
    tags: ["arcade", "classic", "mobile"],
  },
];

export default function LiveGames() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {LIVE_GAMES.map((game) => (
        <Link
          key={game.id}
          href={game.href}
          className="game-card bg-[var(--bg-card)] pixel-border cursor-pointer group relative overflow-hidden block hover:scale-[1.02] transition-transform"
        >
          {/* Live indicator */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse"></span>
            <span className="text-[8px] text-[var(--accent-green)] font-bold">LIVE</span>
          </div>

          {/* Thumbnail */}
          <div className="aspect-square flex items-center justify-center text-6xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] relative">
            {game.thumbnail}
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[var(--accent-green)] text-2xl">▶</span>
            </div>
          </div>
          
          {/* Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs text-[var(--text-main)] font-bold">
                {game.title}
              </h4>
              {game.aiGenerated && (
                <span className="text-[8px] text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 px-2 py-0.5 rounded">
                  AI
                </span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mb-3">
              {game.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] text-[var(--text-muted)] bg-[var(--bg-dark)]/50 px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
      
      {/* Coming soon placeholder if only 1 game */}
      {LIVE_GAMES.length < 4 && (
        <div className="game-card bg-[var(--bg-card)]/30 pixel-border border-dashed flex flex-col items-center justify-center aspect-[3/4] text-center p-4">
          <span className="text-4xl mb-3 opacity-50">🎮</span>
          <span className="text-[10px] text-[var(--text-muted)]">
            More games coming soon...
          </span>
          <span className="text-[8px] text-[var(--accent-cyan)] mt-2">
            Submit yours →
          </span>
        </div>
      )}
    </div>
  );
}
