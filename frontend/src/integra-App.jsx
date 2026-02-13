import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import TokenSetup from './components/TokenSetup'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleTokenComplete = () => {
    setHasToken(true)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Integra...</p>
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return <Login />
  }

  // Logged in but no Canvas token
  if (!hasToken) {
    return <TokenSetup user={session.user} onComplete={handleTokenComplete} />
  }

  // Fully authenticated
  return <Dashboard user={session.user} />
}

export default App
