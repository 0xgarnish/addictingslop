'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, profile, signOut } = useAuth()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user || !profile) return null

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 hover:border-[var(--accent-cyan)] transition-colors"
      >
        <div className="w-6 h-6 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-green)] rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-[var(--bg-primary)]">
            {profile.username[0].toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-[var(--text-primary)] hidden md:block">
          {profile.username}
        </span>
        <svg 
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-[var(--border)]">
            <div className="text-sm font-bold text-[var(--text-primary)]">
              {profile.username}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              {user.email}
            </div>
          </div>

          <div className="py-1">
            <Link 
              href={`/profile/${profile.username}`}
              className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              onClick={() => setIsOpen(false)}
            >
              📊 My Profile
            </Link>
            <Link 
              href="/leaderboards"
              className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              onClick={() => setIsOpen(false)}
            >
              🏆 Leaderboards
            </Link>
            <Link 
              href="/favorites"
              className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              onClick={() => setIsOpen(false)}
            >
              ⭐ My Favorites
            </Link>
          </div>

          <div className="border-t border-[var(--border)] py-1">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-pink)]"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}