import { useAuth, UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { apiCall } = useApi()
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const data = await apiCall('/phases/')
        setPhases(data)
      } catch (error) {
        console.error('Failed to fetch phases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhases()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">LangAI Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Learning Phases</h2>
        
        {loading ? (
          <div className="text-center">Loading phases...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <div
                key={phase.id}
                onClick={() => navigate(`/phases/${phase.id}`)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition"
              >
                <h3 className="text-xl font-bold mb-2">{phase.name}</h3>
                <p className="text-gray-600 mb-4">{phase.description}</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Start Phase
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
