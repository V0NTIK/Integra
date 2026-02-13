import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    })

    if (error) {
      alert(error.message)
    } else {
      setSent(true)
    }
    
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>✉️ Check your email!</h2>
          <p>We sent a login link to:</p>
          <p className="email-sent"><strong>{email}</strong></p>
          <p>Click the link to sign in. You can close this tab.</p>
          <button onClick={() => setSent(false)} className="back-btn">
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <h1>Integra</h1>
          <p className="tagline">Understand what your assignments are really worth</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="your.email@oneschoolglobal.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
            autoFocus
          />
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending...' : 'Send Magic Link →'}
          </button>
        </form>
        
        <p className="info-text">
          🔒 No password needed. We'll email you a secure login link.
        </p>
      </div>
    </div>
  )
}
