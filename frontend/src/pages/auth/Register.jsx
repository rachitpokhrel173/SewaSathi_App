import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'customer'

  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState(defaultRole)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone, role } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    const userRole = data.user?.user_metadata?.role
    if (userRole === 'customer') navigate('/customer')
    else if (userRole === 'provider') navigate('/provider')
    else if (userRole === 'admin') navigate('/admin')
    else navigate('/login')
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.screenLabel}>REGISTER SCREEN</div>

        <div style={s.phone}>
          <div style={s.statusBar}>
          </div>

          <div style={s.content}>
            <div style={s.logoArea}>
              <div style={s.appName}>SewaSathi</div>
              <div style={s.tagline}>Create your account</div>
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            <div style={s.stepRow}>
              {['Account', 'Contact', 'Confirm'].map((label, i) => (
                <div key={label} style={s.stepItem}>
                  <div style={{
                    ...s.stepCircle,
                    background: i <= step ? NAVY : '#e0e0e0',
                    color: i <= step ? '#fff' : '#999',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div style={{ ...s.stepLabel, color: i <= step ? NAVY : '#999' }}>{label}</div>
                  {i < 2 && <div style={{ ...s.stepLine, background: i < step ? NAVY : '#e0e0e0' }} />}
                </div>
              ))}
            </div>

            {step === 0 && (
              <>
                <div style={s.fieldGroup}>
                  <div style={s.fieldLabel}>I want to</div>
                  <div style={s.roleRow}>
                    {[
                      { value: 'customer', icon: '🏠', label: 'Hire workers' },
                      { value: 'provider', icon: '🔧', label: 'Find work' },
                      { value: 'admin', icon: '⚙️', label: 'Admin' },
                    ].map(r => (
                      <div
                        key={r.value}
                        style={{
                          ...s.roleBtn,
                          borderColor: role === r.value ? NAVY : '#ccc',
                          background: role === r.value ? '#eaf0f7' : '#fff',
                          color: role === r.value ? NAVY : '#666',
                        }}
                        onClick={() => setRole(r.value)}
                      >
                        <div>{r.icon}</div>
                        <div style={s.roleLabel}>{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={s.fieldGroup}>
                  <div style={s.fieldLabel}>Full name</div>
                  <input style={s.input} type="text" placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>

                <button style={s.btnNavy} onClick={() => {
                  if (!fullName) return setError('Please enter your name.')
                  setError(''); setStep(1)
                }}>
                  Continue →
                </button>
              </>
            )}

            {step === 1 && (
              <>
                <div style={s.fieldGroup}>
                  <div style={s.fieldLabel}>Phone number</div>
                  <div style={s.phoneInputRow}>
                    <span style={s.phoneCode}>+977</span>
                    <input style={{ ...s.input, flex: 1 }} type="tel" placeholder="98XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>

                <div style={s.fieldGroup}>
                  <div style={s.fieldLabel}>Email address</div>
                  <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div style={s.fieldGroup}>
                  <div style={s.fieldLabel}>Password</div>
                  <input style={s.input} type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <div style={s.twoBtn}>
                  <button style={s.btnOutline} onClick={() => setStep(0)}>← Back</button>
                  <button style={s.btnNavy} onClick={() => {
                    if (!phone || !email || !password) return setError('Fill all fields.')
                    if (password.length < 6) return setError('Password too short.')
                    setError(''); setStep(2)
                  }}>Continue →</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={s.confirmCard}>
                  {[['Name', fullName], ['Phone', '+977 ' + phone], ['Email', email], ['Role', role.charAt(0).toUpperCase() + role.slice(1)]].map(([label, val]) => (
                    <div key={label}>
                      <div style={s.confirmRow}>
                        <span style={s.confirmLabel}>{label}</span>
                        <span style={{ ...s.confirmVal, color: label === 'Role' ? NAVY : '#333', fontWeight: label === 'Role' ? '600' : '400' }}>{val}</span>
                      </div>
                      <div style={s.confirmDivider} />
                    </div>
                  ))}
                </div>

                {role === 'provider' && (
                  <div style={s.noteBox}>
                    ⏳ Profile pending admin verification before appearing in search.
                  </div>
                )}

                <div style={s.twoBtn}>
                  <button style={s.btnOutline} onClick={() => setStep(1)}>← Back</button>
                  <button style={{ ...s.btnGreen, opacity: loading ? 0.7 : 1 }} onClick={handleRegister} disabled={loading}>
                    {loading ? 'Creating...' : '✓ Register'}
                  </button>
                </div>
              </>
            )}

            <div style={s.footer}>
              Already have an account?{' '}
              <Link to="/login" style={s.link}>Sign in</Link>
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
  page: { minHeight: '100vh', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, "Times New Roman", serif', padding: '20px' },
  wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  screenLabel: { fontSize: '13px', fontWeight: '600', color: '#333', letterSpacing: '0.12em', padding: '10px 0 0', fontFamily: 'Arial, sans-serif' },
  phone: { width: '340px', background: '#fff', border: '1.5px solid #bbb', borderRadius: '4px', overflow: 'hidden' },
  statusBar: { background: NAVY, height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px' },
  time: { color: '#fff', fontSize: '11px', fontFamily: 'Arial, sans-serif' },
  content: { padding: '24px 28px 20px', display: 'flex', flexDirection: 'column', gap: '14px' },
  logoArea: { textAlign: 'center', marginBottom: '4px' },
  appName: { fontSize: '26px', fontWeight: '400', color: NAVY, fontFamily: 'Georgia, serif', marginBottom: '4px' },
  tagline: { fontSize: '13px', color: '#555', fontFamily: 'Arial, sans-serif' },
  errorBox: { background: '#fdf0f0', border: '1px solid #e0a0a0', borderRadius: '4px', padding: '8px 12px', fontSize: '12px', color: RED, fontFamily: 'Arial, sans-serif' },
  stepRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '4px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '4px' },
  stepCircle: { width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '600', fontFamily: 'Arial, sans-serif', flexShrink: 0 },
  stepLabel: { fontSize: '10px', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' },
  stepLine: { width: '24px', height: '1.5px', margin: '0 4px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldLabel: { fontSize: '12px', color: '#333', fontFamily: 'Arial, sans-serif' },
  input: { width: '100%', padding: '8px 2px', border: 'none', borderBottom: '1px solid #ccc', background: 'transparent', fontSize: '13px', color: '#222', outline: 'none', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' },
  phoneInputRow: { display: 'flex', alignItems: 'baseline', gap: '6px' },
  phoneCode: { fontSize: '13px', color: '#555', fontFamily: 'Arial, sans-serif', flexShrink: 0 },
  roleRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px' },
  roleBtn: { padding: '10px 6px', border: '1.5px solid', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', fontSize: '16px' },
  roleLabel: { fontSize: '10px', marginTop: '4px', fontFamily: 'Arial, sans-serif' },
  btnNavy: { width: '100%', padding: '13px', background: NAVY, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
  btnGreen: { flex: 1, padding: '13px', background: '#1E8449', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
  btnOutline: { flex: 1, padding: '13px', background: '#fff', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', color: '#555', cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
  twoBtn: { display: 'flex', gap: '8px' },
  confirmCard: { border: '1px solid #e0e0e0', borderRadius: '6px', padding: '10px 12px' },
  confirmRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 0' },
  confirmLabel: { fontSize: '11px', color: '#888', fontFamily: 'Arial, sans-serif' },
  confirmVal: { fontSize: '12px', fontFamily: 'Arial, sans-serif' },
  confirmDivider: { height: '0.5px', background: '#f0f0f0' },
  noteBox: { background: '#fef9e7', border: '1px solid #f5a623', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', color: '#7D6608', fontFamily: 'Arial, sans-serif' },
  footer: { textAlign: 'center', fontSize: '11px', color: '#888', fontFamily: 'Arial, sans-serif' },
  link: { color: NAVY, textDecoration: 'none', fontWeight: '500' },
}