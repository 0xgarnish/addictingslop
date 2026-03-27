"use client";

import { useState } from 'react'
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from './auth/UserMenu'
import AuthModal from './auth/AuthModal'

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, loading } = useAuth()

  return (
    <header className="border-b-4 border-[var(--accent-pink)] bg-[var(--bg-card)]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl">🎮</div>
            <div>
              <h1 className="text-lg md:text-xl glow-text text-[var(--accent-cyan)]">
                ADDICTINGSLOP
              </h1>
              <p className="text-[8px] text-[var(--accent-pink)]">.COM</p>
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/games" 
              className="text-[10px] hover:text-[var(--accent-cyan)] transition-colors"
            >
              ALL GAMES
            </Link>
            {user && (
              <Link 
                href="/leaderboards" 
                className="text-[10px] hover:text-[var(--accent-cyan)] transition-colors"
              >
                LEADERBOARDS
              </Link>
            )}
            <Link 
              href="/submit" 
              className="text-[10px] hover:text-[var(--accent-cyan)] transition-colors"
            >
              SUBMIT
            </Link>
            <Link 
              href="/about" 
              className="text-[10px] hover:text-[var(--accent-cyan)] transition-colors"
            >
              WTF?
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* AI Welcome Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-[var(--accent-green)] blink">●</span>
              <span className="text-[8px] text-[var(--text-muted)]">AI WELCOME</span>
            </div>

            {/* Auth Section */}
            {loading ? (
              <div className="w-8 h-8 bg-[var(--bg-secondary)] rounded animate-pulse"></div>
            ) : user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-[var(--accent-cyan)] text-[var(--bg-primary)] px-3 py-1.5 rounded text-[10px] font-bold hover:bg-[var(--accent-cyan)]/80 transition-colors"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
}
