import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    const role = data.user.user_metadata?.role
    if (role === 'customer') navigate('/customer')
    else if (role === 'provider') navigate('/provider')
    else if (role === 'admin') navigate('/admin')
    else navigate('/login')
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.screenLabel}>LOGIN SCREEN</div>

        <div style={s.phone}>
          <div style={s.statusBar}>
          </div>

          <div style={s.content}>
            <div style={s.logoArea}>
              <div style={s.appName}>SewaSathi</div>
              <div style={s.tagline}>Find trusted local workers</div>
              <div style={s.nepali}>विश्वसनीय कामदार खोज्नुहोस्</div>
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            <div style={s.fieldGroup}>
              <div style={s.fieldLabel}>Email address</div>
              <div style={s.phoneRow}>
                <input
                  style={s.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
                />
              </div>
            </div>

            <button style={s.btnRed} onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Get OTP'}
            </button>

            <div style={s.divider} />

            <div style={s.fieldGroup}>
              <div style={s.fieldLabel}>Password</div>
              <input
                style={s.input}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
              />
            </div>

            <button style={s.btnNavy} onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Verify & Login'}
            </button>

            <div style={s.twoLinks}>
              <Link to="/register?role=customer" style={s.linkBtn}>
                Register as<br />client
              </Link>
              <Link to="/register?role=provider" style={s.linkBtn}>
                Register as<br />worker
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const NAVY = '#1A3C5E'
const RED = '#C0392B'

const s = {
  page: {
    minHeight: '100vh',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Georgia, "Times New Roman", serif',
    padding: '20px',
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
  },
  screenLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    letterSpacing: '0.12em',
    marginBottom: '0',
    padding: '10px 0 0',
    fontFamily: 'Arial, sans-serif',
  },
  phone: {
    width: '340px',
    background: '#fff',
    border: '1.5px solid #bbb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  statusBar: {
    background: NAVY,
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 12px',
  },
  time: {
    color: '#fff',
    fontSize: '11px',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    padding: '24px 28px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    background: '#fff',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '4px',
  },
  appName: {
    fontSize: '28px',
    fontWeight: '400',
    color: NAVY,
    fontFamily: 'Georgia, serif',
    marginBottom: '4px',
  },
  tagline: {
    fontSize: '13px',
    color: '#555',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '2px',
  },
  nepali: {
    fontSize: '12px',
    color: '#777',
    fontFamily: 'Arial, sans-serif',
  },
  errorBox: {
    background: '#fdf0f0',
    border: '1px solid #e0a0a0',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '12px',
    color: RED,
    fontFamily: 'Arial, sans-serif',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '12px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
  phoneRow: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    border: 'none',
    borderBottom: '1px solid #ccc',
    background: 'transparent',
    fontSize: '13px',
    color: '#222',
    outline: 'none',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
  },
  btnRed: {
    width: '100%',
    padding: '13px',
    background: RED,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    letterSpacing: '0.02em',
  },
  divider: {
    height: '1px',
    background: '#e0e0e0',
    margin: '2px 0',
  },
  btnNavy: {
    width: '100%',
    padding: '13px',
    background: NAVY,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    letterSpacing: '0.02em',
  },
  twoLinks: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
  },
  linkBtn: {
    fontSize: '12px',
    color: '#333',
    textDecoration: 'none',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.5',
  },
  lang: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#888',
    fontFamily: 'Arial, sans-serif',
    marginTop: '4px',
  },
}