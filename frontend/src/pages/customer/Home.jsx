import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const categories = [
  { id: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'tutoring', label: 'Tutoring', icon: '📚' },
  { id: 'delivery', label: 'Delivery', icon: '🚗' },
  { id: 'carpentry', label: 'Carpentry', icon: '🪚' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
]

const mockWorkers = [
  { initials: 'RK', name: 'Ram Kumar', skill: 'Plumber', rating: '★★★★★', distance: '1.2 km', rate: 'Rs.500/hr', color: '#00897B' },
  { initials: 'SB', name: 'Suresh Bista', skill: 'Electrician', rating: '★★★★', distance: '2.8 km', rate: 'Rs.600/hr', color: '#1E8449' },
  { initials: 'MB', name: 'Maya Bajracharya', skill: 'Tutor', rating: '★★★★★', distance: '0.8 km', rate: 'Rs.400/hr', color: '#6C3483' },
]

export default function CustomerHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const [selectedCat, setSelectedCat] = useState('Plumbing')
  const [showPostJob, setShowPostJob] = useState(false)
  const [jobDesc, setJobDesc] = useState('')
  const [jobCategory, setJobCategory] = useState(null)
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  async function handlePostJob() {
    if (!jobCategory || !jobDesc.trim()) return
    setPosting(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      await supabase.from('jobs').insert({
        customer_id: user.id,
        category: jobCategory,
        description: jobDesc,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        status: 'pending'
      })
      setPosting(false)
      setPosted(true)
      setJobDesc('')
      setJobCategory(null)
      setTimeout(() => { setPosted(false); setShowPostJob(false) }, 2000)
    }, async () => {
      await supabase.from('jobs').insert({
        customer_id: user.id, category: jobCategory,
        description: jobDesc, status: 'pending'
      })
      setPosting(false)
      setPosted(true)
      setJobDesc('')
      setJobCategory(null)
      setTimeout(() => { setPosted(false); setShowPostJob(false) }, 2000)
    })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div style={s.brandRow}>
          <div style={s.brandIcon}>S</div>
          <span style={s.brandName}>SewaSathi</span>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={s.body}>
        {activeTab === 'home' && !showPostJob && (
          <>
            <div style={s.header}>
              <div>
                <div style={s.greet}>{greeting}, {firstName}</div>
                <div style={s.location}>📍 Kathmandu, Nepal</div>
              </div>
              <div style={s.avatar}>{firstName.charAt(0).toUpperCase()}</div>
            </div>

            <div style={s.searchBar}>
              <span style={s.searchIcon}>🔍</span>
              <span style={s.searchPlaceholder}>Find a plumber, tutor, electrician...</span>
            </div>

            <div style={s.catScroll}>
              {categories.map(c => (
                <div
                  key={c.id}
                  style={{ ...s.catChip, ...(selectedCat === c.label ? s.catChipActive : {}) }}
                  onClick={() => setSelectedCat(c.label)}
                >
                  {c.icon} {c.label}
                </div>
              ))}
            </div>

            <div style={s.sectionTitle}>Workers near you</div>

            {mockWorkers.map(w => (
              <div key={w.name} style={s.workerCard}>
                <div style={{ ...s.workerAvatar, background: w.color }}>{w.initials}</div>
                <div style={s.workerInfo}>
                  <div style={s.workerName}>{w.name}</div>
                  <div style={s.workerSkill}>{w.skill}</div>
                  <div style={s.workerMeta}>
                    <span style={s.stars}>{w.rating}</span>
                    <span style={s.workerDist}>{w.distance}</span>
                  </div>
                </div>
                <div style={s.workerRate}>{w.rate}</div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'home' && showPostJob && (
          <div style={s.postJobPanel}>
            <div style={s.postJobHeader}>
              <button style={s.backBtn} onClick={() => setShowPostJob(false)}>← Back</button>
              <div style={s.postJobTitle}>Post a Job</div>
            </div>

            {posted ? (
              <div style={s.successBox}>
                <div style={s.successIcon}>✓</div>
                <div style={s.successText}>Job posted! Nearby workers have been notified.</div>
              </div>
            ) : (
              <>
                <div style={s.sectionTitle}>Select category</div>
                <div style={s.catGrid}>
                  {categories.map(c => (
                    <div
                      key={c.id}
                      style={{ ...s.catGridItem, ...(jobCategory === c.label ? s.catGridActive : {}) }}
                      onClick={() => setJobCategory(c.label)}
                    >
                      <div style={s.catGridIcon}>{c.icon}</div>
                      <div style={s.catGridLabel}>{c.label}</div>
                    </div>
                  ))}
                </div>

                <div style={s.sectionTitle}>Describe your problem</div>
                <textarea
                  style={s.textarea}
                  placeholder="e.g. Pipe is leaking in my bathroom..."
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  rows={4}
                />

                <button
                  style={{ ...s.postBtn, opacity: (!jobCategory || !jobDesc.trim() || posting) ? 0.5 : 1 }}
                  onClick={handlePostJob}
                  disabled={!jobCategory || !jobDesc.trim() || posting}
                >
                  {posting ? 'Posting...' : 'Post Job Request'}
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div style={s.tabContent}>
            <div style={s.sectionTitle}>My Job Requests</div>
            <p style={s.emptyText}>
              Your posted jobs will appear here.{' '}
              <span style={s.linkText} onClick={() => { setActiveTab('home'); setShowPostJob(true) }}>Post a job</span>
            </p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div style={s.tabContent}>
            <div style={s.sectionTitle}>Messages</div>
            <p style={s.emptyText}>No messages yet. Accept a job to start chatting.</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={s.tabContent}>
            <div style={s.profileCard}>
              <div style={{ ...s.profileAvatar, background: '#6c47ff' }}>{firstName.charAt(0).toUpperCase()}</div>
              <div style={s.profileName}>{user?.user_metadata?.full_name}</div>
              <div style={s.profileEmail}>{user?.email}</div>
              <div style={s.profilePhone}>{user?.user_metadata?.phone}</div>
              <div style={{ ...s.badge, background: '#6c47ff22', color: '#6c47ff', border: '1px solid #6c47ff44' }}>Customer</div>
            </div>
            <button style={s.logoutBtnFull} onClick={handleLogout}>Sign Out</button>
          </div>
        )}
      </div>

      <div style={s.bottomNav}>
        {[
          { key: 'home', icon: '🏠', label: 'Home' },
          { key: 'search', icon: '🔍', label: 'Search' },
          { key: 'post', icon: '+', label: 'Post', special: true },
          { key: 'messages', icon: '💬', label: 'Messages' },
          { key: 'profile', icon: '👤', label: 'Profile' },
        ].map(item => (
          <div
            key={item.key}
            style={s.navItem}
            onClick={() => {
              if (item.key === 'post') { setActiveTab('home'); setShowPostJob(true) }
              else setActiveTab(item.key)
            }}
          >
            {item.special ? (
              <div style={s.navPost}>{item.icon}</div>
            ) : (
              <div style={{ ...s.navIcon, color: activeTab === item.key ? '#6c47ff' : '#666' }}>{item.icon}</div>
            )}
            <div style={{ ...s.navLabel, color: activeTab === item.key ? '#6c47ff' : '#555' }}>{item.label}</div>
            {activeTab === item.key && !item.special && <div style={s.navDot} />}
          </div>
        ))}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#111', borderBottom: '1px solid #1e1e1e' },
  brandRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  brandIcon: { width: '28px', height: '28px', borderRadius: '8px', background: '#6c47ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: '#fff' },
  brandName: { fontSize: '16px', fontWeight: '700', color: '#fff' },
  logoutBtn: { padding: '6px 12px', borderRadius: '6px', background: 'transparent', border: '1px solid #2a2a2a', color: '#555', cursor: 'pointer', fontSize: '12px' },
  body: { flex: 1, padding: '16px', paddingBottom: '70px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '10px', background: '#111', borderRadius: '12px', border: '1px solid #1e1e1e' },
  greet: { fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '3px' },
  location: { fontSize: '12px', color: '#555' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#6c47ff22', border: '2px solid #6c47ff44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#6c47ff' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', marginBottom: '14px', cursor: 'text' },
  searchIcon: { fontSize: '14px', color: '#555' },
  searchPlaceholder: { fontSize: '13px', color: '#444' },
  catScroll: { display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' },
  catChip: { display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '20px', background: '#111', border: '1px solid #2a2a2a', color: '#666', fontSize: '12px', whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 },
  catChipActive: { background: '#6c47ff22', border: '1px solid #6c47ff66', color: '#fff' },
  sectionTitle: { fontSize: '13px', fontWeight: '600', color: '#aaa', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' },
  workerCard: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', marginBottom: '8px' },
  workerAvatar: { width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: '#fff', flexShrink: 0 },
  workerInfo: { flex: 1 },
  workerName: { fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '2px' },
  workerSkill: { fontSize: '11px', color: '#555', marginBottom: '4px' },
  workerMeta: { display: 'flex', alignItems: 'center', gap: '8px' },
  stars: { fontSize: '10px', color: '#B7770D' },
  workerDist: { fontSize: '10px', color: '#444' },
  workerRate: { fontSize: '12px', fontWeight: '600', color: '#4dff91' },
  postJobPanel: { paddingBottom: '20px' },
  postJobHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  backBtn: { background: 'transparent', border: 'none', color: '#6c47ff', cursor: 'pointer', fontSize: '14px', padding: '0' },
  postJobTitle: { fontSize: '18px', fontWeight: '700', color: '#fff' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' },
  catGridItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 8px', borderRadius: '10px', background: '#111', border: '1px solid #1e1e1e', cursor: 'pointer' },
  catGridActive: { background: '#6c47ff18', border: '1px solid #6c47ff66' },
  catGridIcon: { fontSize: '22px', marginBottom: '6px' },
  catGridLabel: { fontSize: '11px', color: '#aaa', textAlign: 'center' },
  textarea: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #2a2a2a', background: '#111', color: '#fff', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: '16px' },
  postBtn: { width: '100%', padding: '14px', borderRadius: '10px', background: '#6c47ff', color: '#fff', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer' },
  successBox: { textAlign: 'center', padding: '40px 20px' },
  successIcon: { width: '60px', height: '60px', borderRadius: '50%', background: '#4dff9122', border: '2px solid #4dff9166', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#4dff91', margin: '0 auto 16px' },
  successText: { color: '#4dff91', fontSize: '15px', fontWeight: '500' },
  tabContent: { paddingTop: '8px' },
  emptyText: { color: '#444', fontSize: '14px', lineHeight: '1.6' },
  linkText: { color: '#6c47ff', cursor: 'pointer' },
  profileCard: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '16px' },
  profileAvatar: { width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 auto 12px' },
  profileName: { fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' },
  profileEmail: { fontSize: '13px', color: '#555', marginBottom: '4px' },
  profilePhone: { fontSize: '13px', color: '#555', marginBottom: '12px' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  logoutBtnFull: { width: '100%', padding: '14px', borderRadius: '10px', background: '#ff4d4d18', border: '1px solid #ff4d4d44', color: '#ff4d4d', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', background: '#111', borderTop: '1px solid #1e1e1e', padding: '6px 0 10px', zIndex: 100 },
  navItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', padding: '4px 0' },
  navIcon: { fontSize: '18px' },
  navPost: { width: '36px', height: '36px', borderRadius: '50%', background: '#6c47ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '300', color: '#fff', marginTop: '-8px' },
  navLabel: { fontSize: '9px' },
  navDot: { width: '4px', height: '4px', borderRadius: '50%', background: '#6c47ff', marginTop: '1px' },
}