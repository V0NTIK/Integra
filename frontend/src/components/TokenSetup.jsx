import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './TokenSetup.css'

export default function TokenSetup({ user, onComplete }) {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    checkExistingToken()
  }, [])

  const checkExistingToken = async () => {
    const { data, error } = await supabase
      .from('user_tokens')
      .select('canvas_token')
      .eq('user_id', user.id)
      .single()
    
    if (data?.canvas_token) {
      // Token exists, redirect to dashboard
      onComplete()
    }
    setValidating(false)
  }

  const validateCanvasToken = async (token) => {
    try {
      const response = await fetch('https://canvas.oneschoolglobal.com/api/v1/users/self', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        return { valid: true, userId: userData.id }
      }
      return { valid: false }
    } catch (err) {
      console.error('Token validation error:', err)
      return { valid: false }
    }
  }

  const saveToken = async () => {
    if (!token.trim()) {
      alert('Please enter a Canvas token')
      return
    }

    setLoading(true)
    
    // Validate token
    const validation = await validateCanvasToken(token)
    
    if (!validation.valid) {
      alert('Invalid Canvas token. Please check and try again.')
      setLoading(false)
      return
    }
    
    // Save to database
    const { error } = await supabase
      .from('user_tokens')
      .upsert({
        user_id: user.id,
        canvas_token: token,
        canvas_user_id: validation.userId,
        updated_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error saving token:', error)
      alert('Failed to save token. Please try again.')
    } else {
      onComplete()
    }
    
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (validating) {
    return (
      <div className="token-container">
        <div className="token-box">
          <p>Checking for existing token...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="token-container">
      <div className="token-box">
        <div className="header">
          <h2>Connect Your Canvas Account</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        
        <p className="intro">Integra needs your Canvas API token to analyze your assignments.</p>
        
        <div className="instructions">
          <h3>How to get your Canvas token:</h3>
          <ol>
            <li>
              Go to{' '}
              <a 
                href="https://canvas.oneschoolglobal.com/profile/settings" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Canvas Settings
              </a>
            </li>
            <li>Scroll to "Approved Integrations"</li>
            <li>Click "+ New Access Token"</li>
            <li>Purpose: "Integra Analysis"</li>
            <li>Expiration: Leave blank (no expiration)</li>
            <li>Copy the token and paste below</li>
          </ol>
        </div>
        
        <input
          type="password"
          placeholder="Paste your Canvas token here"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="token-input"
          autoFocus
        />
        
        <button 
          onClick={saveToken} 
          disabled={!token || loading}
          className="save-token-btn"
        >
          {loading ? 'Validating...' : 'Connect Canvas →'}
        </button>
        
        <p className="security-note">
          🔒 Your token is encrypted and stored securely. We never share your data.
        </p>
      </div>
    </div>
  )
}
