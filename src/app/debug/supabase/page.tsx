'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function SupabaseDebugPage() {
  const { user, profile, loading } = useAuth()
  const [env, setEnv] = useState({
    url: 'unknown',
    hasUrl: false,
    hasAnon: false,
  })

  useEffect(() => {
    // NEXT_PUBLIC env vars are baked at build time; this tells us what the client bundle sees.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    setEnv({
      url: url || '(missing)',
      hasUrl: !!url,
      hasAnon: !!anon,
    })
  }, [])

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">Supabase Debug</h1>

      <div className="bg-black/30 border border-white/10 rounded p-4 space-y-2 text-sm">
        <div><b>NEXT_PUBLIC_SUPABASE_URL:</b> {env.url}</div>
        <div><b>has anon key:</b> {env.hasAnon ? 'yes' : 'no'}</div>
        <div><b>auth loading:</b> {loading ? 'yes' : 'no'}</div>
        <div><b>user:</b> {user ? `${user.id} (${user.email})` : '(none)'}</div>
        <div><b>profile:</b> {profile ? profile.username : '(none)'} </div>
      </div>

      <p className="text-xs opacity-70 mt-4">
        If hasUrl/hasAnon is false here, the Vercel build did not include env vars and the client bundle can’t talk to Supabase.
      </p>
    </div>
  )
}
