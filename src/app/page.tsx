import GameGrid from "@/components/GameGrid";
import LiveGames from "@/components/LiveGames";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-sm md:text-base text-[var(--accent-cyan)] mb-4">
            THE GAMES STEAM WON&apos;T SELL
          </h2>
          <p className="text-[10px] md:text-xs text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            AI-generated. Community-curated. Zero gatekeeping.<br/>
            The home for games that got rejected everywhere else.
          </p>
        </section>

        {/* Live Games Section */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse"></span>
              <h3 className="text-sm text-[var(--accent-green)] font-bold">LIVE SLOP</h3>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-green)] to-transparent"></div>
          </div>
          <LiveGames />
        </section>

        {/* Coming Soon Section */}
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xs text-[var(--accent-yellow)]">▶ SLOPPING SOON</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-yellow)] to-transparent"></div>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mb-4">
            These games are cooking. Check back soon.
          </p>
          <GameGrid category="hot" />
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xs text-[var(--accent-pink)]">▶ COMMUNITY PICKS</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-pink)] to-transparent"></div>
          </div>
          <GameGrid category="community" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
