import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
          <h1 className="text-2xl font-bold text-[var(--accent-cyan)] mb-4">WTF is Addicting Slop?</h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
            Addicting Slop is a home for weird little browser games. AI-generated, community-curated,
            zero gatekeeping. If Steam wouldn’t sell it… it belongs here.
          </p>
          <ul className="text-sm text-[var(--text-muted)] list-disc pl-5 space-y-2 mb-6">
            <li>Mobile-first, instant-load, pure Canvas chaos</li>
            <li>Accounts + leaderboards so we can compete like degenerates</li>
            <li>New games shipped fast</li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/games"
              className="bg-[var(--accent-cyan)] text-[var(--bg-primary)] px-4 py-2 rounded text-sm font-bold text-center hover:bg-[var(--accent-cyan)]/80"
            >
              Browse Games
            </Link>
            <Link
              href="/submit"
              className="bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-2 rounded text-sm font-bold text-center hover:bg-[var(--bg-card)]"
            >
              Submit a Game
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
