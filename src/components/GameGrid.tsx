"use client";

interface Game {
  id: string;
  title: string;
  thumbnail: string;
  plays: string;
  aiGenerated: boolean;
  tags: string[];
}

const PLACEHOLDER_GAMES: Record<string, Game[]> = {
  hot: [
    { id: "1", title: "DUNGEON CRAWL AI", thumbnail: "🏰", plays: "12.4K", aiGenerated: true, tags: ["roguelike", "rpg"] },
    { id: "2", title: "PIXEL RACERS", thumbnail: "🏎️", plays: "8.2K", aiGenerated: true, tags: ["racing", "arcade"] },
    { id: "3", title: "SLIME STACKER", thumbnail: "🟢", plays: "6.1K", aiGenerated: true, tags: ["puzzle", "casual"] },
    { id: "4", title: "ROBOT WARS 2099", thumbnail: "🤖", plays: "5.8K", aiGenerated: true, tags: ["action", "shooter"] },
    { id: "5", title: "CATS VS DOGS", thumbnail: "🐱", plays: "4.3K", aiGenerated: false, tags: ["strategy", "casual"] },
    { id: "6", title: "NEON SNAKE", thumbnail: "🐍", plays: "3.9K", aiGenerated: true, tags: ["classic", "arcade"] },
  ],
  new: [
    { id: "7", title: "SPACE MINER PRO", thumbnail: "⛏️", plays: "892", aiGenerated: true, tags: ["idle", "space"] },
    { id: "8", title: "WIZARD DEFENSE", thumbnail: "🧙", plays: "654", aiGenerated: true, tags: ["tower-defense"] },
    { id: "9", title: "FRUIT NINJA AI", thumbnail: "🍉", plays: "421", aiGenerated: true, tags: ["casual", "action"] },
    { id: "10", title: "ZOMBIE CLICKER", thumbnail: "🧟", plays: "387", aiGenerated: true, tags: ["clicker", "horror"] },
    { id: "11", title: "MATH BLASTER", thumbnail: "🔢", plays: "256", aiGenerated: true, tags: ["educational"] },
    { id: "12", title: "INFINITE RUNNER", thumbnail: "🏃", plays: "198", aiGenerated: true, tags: ["endless", "arcade"] },
  ],
  community: [
    { id: "13", title: "CHESS BUT WEIRD", thumbnail: "♟️", plays: "15.2K", aiGenerated: false, tags: ["strategy", "board"] },
    { id: "14", title: "FARM SIMULATOR", thumbnail: "🌾", plays: "9.7K", aiGenerated: true, tags: ["simulation", "casual"] },
    { id: "15", title: "BATTLE CARDS AI", thumbnail: "🃏", plays: "7.4K", aiGenerated: true, tags: ["cards", "strategy"] },
    { id: "16", title: "ASTEROID DODGE", thumbnail: "☄️", plays: "5.1K", aiGenerated: true, tags: ["arcade", "space"] },
    { id: "17", title: "COOKING CHAOS", thumbnail: "👨‍🍳", plays: "4.8K", aiGenerated: true, tags: ["simulation"] },
    { id: "18", title: "BUBBLE POP 3000", thumbnail: "🫧", plays: "3.2K", aiGenerated: true, tags: ["puzzle", "casual"] },
  ],
};

interface GameGridProps {
  category: "hot" | "new" | "community";
}

export default function GameGrid({ category }: GameGridProps) {
  const games = PLACEHOLDER_GAMES[category] || [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="game-card bg-[var(--bg-card)] pixel-border cursor-pointer group relative overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="aspect-square flex items-center justify-center text-5xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]">
            {game.thumbnail}
          </div>
          
          {/* Info */}
          <div className="p-3">
            <h4 className="text-[8px] text-[var(--text-main)] truncate mb-2">
              {game.title}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-[var(--text-muted)]">
                {game.plays} plays
              </span>
              {game.aiGenerated && (
                <span className="text-[6px] text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 px-1.5 py-0.5 rounded">
                  AI
                </span>
              )}
            </div>
          </div>
          
          {/* Play overlay on hover */}
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[var(--accent-green)] text-xs">▶ PLAY</span>
          </div>
        </div>
      ))}
    </div>
  );
}
