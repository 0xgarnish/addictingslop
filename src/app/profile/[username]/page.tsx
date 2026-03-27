import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import UserProfile from '@/components/profile/UserProfile'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  
  // URL decode the username in case it has special characters
  const decodedUsername = decodeURIComponent(username)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <UserProfile username={decodedUsername} />
      </main>
      <Footer />
    </div>
  )
}