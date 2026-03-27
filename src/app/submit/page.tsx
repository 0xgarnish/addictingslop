import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
          <h1 className="text-2xl font-bold text-[var(--accent-cyan)] mb-4">Submit Your Slop</h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            This page is a placeholder for now. Soon you’ll be able to submit games directly.
            For the moment, drop your idea/link in Discord.
          </p>

          <div className="space-y-3 text-sm text-[var(--text-muted)]">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-4">
              <div className="font-bold text-[var(--text-primary)] mb-1">What to send</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Game idea + title</li>
                <li>Controls (mobile + keyboard)</li>
                <li>Scoring / win condition</li>
                <li>Any references (GIF/video/old game inspiration)</li>
              </ul>
            </div>

            <div className="bg-[var(--accent-pink)]/10 border border-[var(--accent-pink)]/30 rounded p-4">
              <div className="font-bold text-[var(--accent-pink)] mb-1">Note</div>
              <div>
                We’ll wire this into accounts + leaderboards so every slop has stats.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
