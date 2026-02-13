import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './Dashboard.css'

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    // We'll implement Canvas data fetching in the next phase
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your data...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Integra</h1>
          <div className="user-info">
            <span>{user.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <h2>Welcome to Integra! 🎉</h2>
          <p>Your assignment analysis dashboard is coming soon.</p>
          <p>Next steps:</p>
          <ul>
            <li>Fetch your Canvas courses and assignments</li>
            <li>Calculate true weight for each assignment</li>
            <li>Show impact scenarios</li>
            <li>Display recommendations</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
