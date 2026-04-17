import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard')
    }
  }, [isSignedIn, isLoaded, navigate])

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white mb-6">LangAI Dashboard</h1>
      <p className="text-xl text-white mb-8">Master LangChain with interactive challenges</p>
      <button
        onClick={() => window.location.href = '/sign-in'}
        className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
      >
        Get Started
      </button>
    </div>
  )
}
