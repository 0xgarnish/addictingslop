import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GameLeaderboard from '@/components/leaderboards/GameLeaderboard'

export default function LeaderboardsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-2xl font-bold text-[var(--accent-cyan)] mb-4">
            🏆 LEADERBOARDS
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
            The top slop champions across all games. Think you can beat them?
          </p>
        </section>

        {/* Game Leaderboards */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Bubble Trouble */}
          <GameLeaderboard 
            gameSlug="bubble-trouble" 
            gameTitle="Bubble Trouble"
            limit={10}
          />

          {/* Placeholder for future games */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="font-bold text-[var(--accent-cyan)] mb-4 flex items-center gap-2">
              🎮 More Games Coming Soon
            </h3>
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🚧</div>
              <p className="text-sm text-[var(--text-muted)]">
                More slop games cooking...
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Check back soon for more leaderboards!
              </p>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="font-bold text-[var(--accent-cyan)] mb-4 flex items-center gap-2">
              🎯 Your Stats
            </h3>
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm text-[var(--text-muted)]">
                Player stats page coming soon...
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Track your progress across all games!
              </p>
            </div>
          </div>
          
        </section>

        {/* Global Stats Section */}
        <section className="mt-12 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[var(--accent-cyan)] mb-6 text-center">
            🌍 Global Slop Stats
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-[var(--accent-green)]">
                Coming Soon
              </div>
              <div className="text-xs text-[var(--text-muted)]">Total Players</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-[var(--accent-cyan)]">
                Coming Soon
              </div>
              <div className="text-xs text-[var(--text-muted)]">Games Played</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-[var(--accent-pink)]">
                Coming Soon
              </div>
              <div className="text-xs text-[var(--text-muted)]">High Scores Set</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-[var(--accent-yellow)]">
                Coming Soon
              </div>
              <div className="text-xs text-[var(--text-muted)]">Slop Time Played</div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-[var(--text-muted)]">
              Stats tracking will be enabled in the next update!
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}