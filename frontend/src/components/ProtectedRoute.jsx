import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />
  }

  return children
}
