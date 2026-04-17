import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Phases from './pages/Phases'
import PhaseDetail from './pages/PhaseDetail'
import SessionDetail from './pages/SessionDetail'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/phases"
          element={
            <ProtectedRoute>
              <Phases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/phases/:phaseId"
          element={
            <ProtectedRoute>
              <PhaseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/phases/:phaseId/sessions/:sessionId"
          element={
            <ProtectedRoute>
              <SessionDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
