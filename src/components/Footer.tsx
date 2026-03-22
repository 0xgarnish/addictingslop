"use client";

export default function Footer() {
  return (
    <footer className="border-t-4 border-[var(--accent-cyan)] bg-[var(--bg-card)] mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] text-[var(--text-muted)] mb-2">
              © 2026 ADDICTINGSLOP.COM
            </p>
            <p className="text-[8px] text-[var(--accent-pink)]">
              &quot;THE GAMES STEAM WON&apos;T SELL. THE FUN THEY CAN&apos;T STOP.&quot;
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors">
              DISCORD
            </a>
            <a href="#" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors">
              TWITTER
            </a>
            <a href="#" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors">
              GITHUB
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[8px] text-[var(--accent-green)] mb-1">
              🤖 AI-GENERATED GAMES WELCOME
            </p>
            <p className="text-[8px] text-[var(--text-muted)]">
              NO GATEKEEPERS. JUST GAMES.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
