import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveGames from "@/components/LiveGames";
import GameGrid from "@/components/GameGrid";

export default function GamesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[var(--accent-cyan)] mb-3">ALL GAMES</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Every slop creation we can legally host.
          </p>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse" />
              <h2 className="text-sm text-[var(--accent-green)] font-bold">LIVE SLOP</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-green)] to-transparent" />
          </div>
          <LiveGames />
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs text-[var(--accent-yellow)]">▶ SLOPPING SOON</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-yellow)] to-transparent" />
          </div>
          <GameGrid category="hot" />
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs text-[var(--accent-pink)]">▶ COMMUNITY PICKS</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-pink)] to-transparent" />
          </div>
          <GameGrid category="community" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
