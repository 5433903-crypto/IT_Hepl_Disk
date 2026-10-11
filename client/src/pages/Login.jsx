import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2, UserPlus, Mail, Monitor, Building } from 'lucide-react';

const S = {
  page: {
    minHeight: '100vh', background: 'var(--g0)', color: 'var(--ink)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '24px 16px', position: 'relative', overflow: 'hidden',
  },
  lineH: {
    position: 'absolute', left: 0, right: 0, height: 1,
    background: 'var(--hair)', pointerEvents: 'none',
  },
  lineV: {
    position: 'absolute', top: 0, bottom: 0, width: 1,
    background: 'var(--hair)', pointerEvents: 'none',
  },
  card: {
    width: '100%', maxWidth: 440, position: 'relative', zIndex: 2,
  },
  brand: {
    textAlign: 'center', marginBottom: 28,
  },
  wordmark: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800,
    fontSize: 'clamp(28px,5vw,40px)', letterSpacing: '-.03em',
    color: 'var(--ink)', display: 'block', lineHeight: 1,
  },
  period: { color: 'var(--amber)' },
  tagline: {
    display: 'block', fontFamily: "'Sora', sans-serif",
    fontSize: 10.5, fontWeight: 600, letterSpacing: '.14em',
    textTransform: 'uppercase', color: 'var(--muted)', marginTop: 8,
  },
  panel: {
    background: 'var(--g1)', border: '1px solid var(--hair)',
    borderRadius: 6, padding: '24px 26px',
  },
  modeTabs: {
    display: 'flex', gap: 2, marginBottom: 20,
    background: 'var(--g0)', border: '1px solid var(--hair)',
    borderRadius: 4, padding: 3,
  },
  roleTabs: {
    display: 'flex', gap: 2, marginBottom: 16,
    background: 'var(--g0)', border: '1px solid var(--hair)',
    borderRadius: 4, padding: 3,
  },
  label: {
    display: 'block', fontFamily: "'Sora', sans-serif",
    fontSize: 10.5, fontWeight: 600, letterSpacing: '.10em',
    textTransform: 'uppercase', color: 'var(--ink2)', marginBottom: 6,
  },
  input: {
    width: '100%', background: 'var(--g0)',
    border: '1px solid var(--hair)', borderRadius: 4,
    padding: '9px 12px 9px 36px',
    fontFamily: "'Sora', sans-serif", fontSize: 13, color: 'var(--ink)',
    outline: 'none',
  },
  select: {
    width: '100%', background: 'var(--g0)',
    border: '1px solid var(--hair)', borderRadius: 4,
    padding: '9px 12px 9px 36px',
    fontFamily: "'Sora', sans-serif", fontSize: 13, color: 'var(--ink)',
    outline: 'none', cursor: 'pointer',
  },
  inputWrap: { position: 'relative' },
  icon: {
    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--muted)', pointerEvents: 'none', width: 14, height: 14,
  },
  submitBtn: {
    width: '100%', marginTop: 8,
    padding: '10px 0',
    background: 'var(--ink)', color: 'var(--g0)',
    border: 'none', borderRadius: 4,
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, transition: 'background .2s, color .2s',
  },
  demoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8,
  },
  demoBtn: {
    padding: '8px 10px', background: 'var(--g0)',
    border: '1px solid var(--hair)', borderRadius: 4,
    cursor: 'pointer', textAlign: 'left', transition: 'border-color .2s',
  },
  divider: {
    borderTop: '1px solid var(--hair)', marginTop: 20, paddingTop: 18,
  },
  toggleLink: {
    background: 'transparent', border: 'none', color: 'var(--amber)',
    fontFamily: "'Sora', sans-serif", fontSize: 11.5, fontWeight: 600,
    cursor: 'pointer', padding: 0, textDecoration: 'underline',
  },
  footer: {
    textAlign: 'center', marginTop: 20,
    fontFamily: "'Sora', sans-serif", fontSize: 10.5,
    color: 'var(--muted)', letterSpacing: '.06em',
  },
};

export default function Login() {
  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');

  // Sign In states
  const [activeTab, setActiveTab] = useState('student');
  const [identifier, setIdentifier] = useState('CS-2022-042');
  const [password, setPassword] = useState('Student@123');

  // Registration states
  const [regRole, setRegRole] = useState('student'); // 'student' | 'admin' | 'technician'
  const [regName, setRegName] = useState('');
  const [regRollNo, setRegRollNo] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Engineering');
  const [regLab, setRegLab] = useState('Lab 1');
  const [regPc, setRegPc] = useState('PC-14');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    const res = await login(identifier, password);
    setLoading(false);
    if (res.success) {
      navigate(res.user.role === 'admin' || res.user.role === 'technician' ? '/admin' : '/student');
    } else {
      setError(res.message || 'Login failed. Please verify credentials or register.');
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    const res = await register({
      name: regName.trim(),
      rollNo: regRollNo.trim() || regName.trim().toUpperCase(),
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      department: regDepartment,
      assignedLab: regLab,
      assignedPc: regPc,
    });
    setLoading(false);

    if (res.success) {
      // Pick the registered identifier: rollNo if provided, else name, else email
      const chosenIdentifier = regRollNo.trim() || regName.trim() || regEmail.trim();
      const chosenPassword = regPassword;

      // Switch to SIGN IN mode and prefill credentials
      setAuthMode('login');
      setActiveTab(regRole === 'student' ? 'student' : 'admin');
      setIdentifier(chosenIdentifier);
      setPassword(chosenPassword);

      setError('');
      setSuccessMsg(`Registration successful! Your username and password have been filled below. Click "Sign In" to continue.`);
    } else {
      setError(res.message || 'Registration failed. Please check your information.');
    }
  };

  const handleDemoFill = async (roleType) => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    const res = await demoLogin(roleType);
    setLoading(false);
    if (res.success) {
      navigate(roleType === 'admin' || roleType === 'tech' ? '/admin' : '/student');
    }
  };

  return (
    <div style={S.page}>
      {/* Structural hairline grid lines */}
      <div style={{ ...S.lineH, top: '33%' }} />
      <div style={{ ...S.lineH, top: '66%' }} />
      <div style={{ ...S.lineV, left: '25%' }} aria-hidden="true" />
      <div style={{ ...S.lineV, left: '75%' }} aria-hidden="true" />

      <div style={S.card}>
        {/* Brand */}
        <div style={S.brand}>
          <span style={S.wordmark}>
            CAMPUS<span style={S.period}>IT.</span>
          </span>
          <span style={S.tagline}>Help Desk &amp; Automated Lab Monitor</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--teal)' }} />
            <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 10, color: 'var(--teal)', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              {authMode === 'login' ? 'Secure Access' : 'New User Onboarding'}
            </span>
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--teal)' }} />
          </div>
        </div>

        {/* Card panel */}
        <div style={S.panel}>
          {/* Main Mode Toggle: Sign In vs Register */}
          <div style={S.modeTabs}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 3, border: 'none',
                fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: '.12em', textTransform: 'uppercase', cursor: 'pointer',
                background: authMode === 'login' ? 'var(--ink)' : 'transparent',
                color: authMode === 'login' ? 'var(--g0)' : 'var(--muted)',
                transition: 'background .2s, color .2s',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 3, border: 'none',
                fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: '.12em', textTransform: 'uppercase', cursor: 'pointer',
                background: authMode === 'register' ? 'var(--amber)' : 'transparent',
                color: authMode === 'register' ? 'var(--g0)' : 'var(--muted)',
                transition: 'background .2s, color .2s',
              }}
            >
              Register New User
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div style={{
              marginBottom: 16, padding: '10px 12px',
              background: 'rgba(180,60,60,.12)', border: '1px solid rgba(180,60,60,.35)',
              borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'Sora',sans-serif", fontSize: 12, color: '#f87171',
            }}>
              <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {successMsg && (
            <div style={{
              marginBottom: 16, padding: '10px 12px',
              background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.35)',
              borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'Sora',sans-serif", fontSize: 12, color: '#4ade80',
            }}>
              <CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0 }} />
              <div>{successMsg}</div>
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {authMode === 'login' && (
            <>
              {/* Role Filter Tabs */}
              <div style={S.roleTabs}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('student');
                    setIdentifier('CS-2022-042');
                    setPassword('Student@123');
                    setError('');
                  }}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 3, border: 'none',
                    fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 600,
                    letterSpacing: '.10em', textTransform: 'uppercase', cursor: 'pointer',
                    background: activeTab === 'student' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeTab === 'student' ? 'var(--ink)' : 'var(--muted)',
                  }}
                >
                  Student Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setIdentifier('admin@campus.edu');
                    setPassword('Admin@123');
                    setError('');
                  }}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 3, border: 'none',
                    fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 600,
                    letterSpacing: '.10em', textTransform: 'uppercase', cursor: 'pointer',
                    background: activeTab === 'admin' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeTab === 'admin' ? 'var(--ink)' : 'var(--muted)',
                  }}
                >
                  IT Staff &amp; Admin
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div>
                  <label style={S.label}>
                    {activeTab === 'student' ? 'Roll No / Email / Name' : 'Staff / Admin Email'}
                  </label>
                  <div style={S.inputWrap}>
                    <User style={S.icon} />
                    <input
                      type="text" value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder={activeTab === 'student' ? 'e.g. CS-2022-042 or Abhinandan' : 'admin@campus.edu'}
                      style={S.input} required
                      onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                      onBlur={e => e.target.style.borderColor = 'var(--hair)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={S.label}>Password</label>
                  <div style={S.inputWrap}>
                    <Lock style={S.icon} />
                    <input
                      type="password" value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={S.input} required
                      onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                      onBlur={e => e.target.style.borderColor = 'var(--hair)'}
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  style={{ ...S.submitBtn, ...(loading ? { opacity: .6, cursor: 'not-allowed' } : {}) }}
                  onMouseOver={e => { if (!loading) e.currentTarget.style.background = 'var(--amber)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--ink)'; }}
                >
                  {loading ? 'Authenticating…' : 'Sign In'}
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 11.5, color: 'var(--muted)' }}>
                  Don't have an account?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
                  style={S.toggleLink}
                >
                  Register here
                </button>
              </div>

              {/* Demo shortcuts */}
              <div style={S.divider}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                  fontFamily: "'Sora',sans-serif", fontSize: 10, fontWeight: 600,
                  letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)',
                }}>
                  <Sparkles style={{ width: 12, height: 12, color: 'var(--amber)' }} />
                  1-Click Demo (Quick Fill)
                </div>

                <div style={S.demoGrid}>
                  {[
                    { role: 'student',  top: 'Student: Aarav',    sub: 'CS-2022-042 · Lab 2', color: 'var(--amber)' },
                    { role: 'student2', top: 'Student: Priya',    sub: 'CS-2022-018 · Lab 1', color: 'var(--ink2)' },
                    { role: 'admin',    top: 'IT Head Admin',     sub: 'Prof. Rajesh Sharma', color: 'var(--amber)' },
                    { role: 'tech',     top: 'Lab Technician',   sub: 'Suresh Patil',        color: 'var(--teal)' },
                  ].map(d => (
                    <button
                      key={d.role} type="button"
                      onClick={() => handleDemoFill(d.role)}
                      style={S.demoBtn}
                      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--amber)'}
                      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--hair)'}
                    >
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11, color: d.color, letterSpacing: '-.01em' }}>
                        {d.top}
                      </div>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                        {d.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* MODE 2: REGISTRATION */}
          {authMode === 'register' && (
            <>
              {/* Role Toggle for Registration */}
              <div style={S.roleTabs}>
                <button
                  type="button"
                  onClick={() => setRegRole('student')}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 3, border: 'none',
                    fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 600,
                    letterSpacing: '.10em', textTransform: 'uppercase', cursor: 'pointer',
                    background: regRole === 'student' ? 'var(--amber)' : 'transparent',
                    color: regRole === 'student' ? 'var(--g0)' : 'var(--muted)',
                    transition: 'all .2s',
                  }}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('technician')}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 3, border: 'none',
                    fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 600,
                    letterSpacing: '.10em', textTransform: 'uppercase', cursor: 'pointer',
                    background: regRole === 'technician' ? 'var(--teal)' : 'transparent',
                    color: regRole === 'technician' ? 'var(--g0)' : 'var(--muted)',
                    transition: 'all .2s',
                  }}
                >
                  Staff / Technician
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <div>
                  <label style={S.label}>Full Name *</label>
                  <div style={S.inputWrap}>
                    <User style={S.icon} />
                    <input
                      type="text" value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Abhinandan Sharma"
                      style={S.input} required
                      onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                      onBlur={e => e.target.style.borderColor = 'var(--hair)'}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={S.label}>Roll No / ID</label>
                    <div style={S.inputWrap}>
                      <UserPlus style={S.icon} />
                      <input
                        type="text" value={regRollNo}
                        onChange={e => setRegRollNo(e.target.value)}
                        placeholder={regRole === 'student' ? 'e.g. CS-2024-001' : 'TECH-02'}
                        style={S.input}
                        onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                        onBlur={e => e.target.style.borderColor = 'var(--hair)'}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={S.label}>Email Address</label>
                    <div style={S.inputWrap}>
                      <Mail style={S.icon} />
                      <input
                        type="email" value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="user@campus.edu"
                        style={S.input}
                        onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                        onBlur={e => e.target.style.borderColor = 'var(--hair)'}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={S.label}>Password * (Min 4 chars)</label>
                  <div style={S.inputWrap}>
                    <Lock style={S.icon} />
                    <input
                      type="password" value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      style={S.input} required minLength={4}
                      onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                      onBlur={e => e.target.style.borderColor = 'var(--hair)'}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={S.label}>Assigned Lab</label>
                    <div style={S.inputWrap}>
                      <Monitor style={S.icon} />
                      <select
                        value={regLab}
                        onChange={e => setRegLab(e.target.value)}
                        style={S.select}
                      >
                        <option value="Lab 1">Lab 1 (Comp Networks)</option>
                        <option value="Lab 2">Lab 2 (AI Systems)</option>
                        <option value="Lab 3">Lab 3 (Cyber Security)</option>
                        <option value="Lab 4">Lab 4 (Data Engineering)</option>
                        <option value="Lab 5">Lab 5 (Cloud Comp)</option>
                        <option value="Lab 6">Lab 6 (Hardware &amp; IoT)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={S.label}>Assigned PC</label>
                    <div style={S.inputWrap}>
                      <Monitor style={S.icon} />
                      <input
                        type="text" value={regPc}
                        onChange={e => setRegPc(e.target.value)}
                        placeholder="PC-14"
                        style={S.input}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={S.label}>Department</label>
                  <div style={S.inputWrap}>
                    <Building style={S.icon} />
                    <select
                      value={regDepartment}
                      onChange={e => setRegDepartment(e.target.value)}
                      style={S.select}
                    >
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="AI &amp; Data Science">AI &amp; Data Science</option>
                      <option value="Electronics &amp; Telecom">Electronics &amp; Telecom</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  style={{ ...S.submitBtn, background: 'var(--amber)', color: '#000', marginTop: 10, ...(loading ? { opacity: .6, cursor: 'not-allowed' } : {}) }}
                  onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {loading ? 'Creating Account…' : 'Complete Registration & Sign In'}
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 11.5, color: 'var(--muted)' }}>
                  Already registered?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
                  style={S.toggleLink}
                >
                  Sign In instead
                </button>
              </div>
            </>
          )}
        </div>

        <p style={S.footer}>
          Final Year Computer Engineering Capstone · Network &amp; AI Systems
        </p>
      </div>
    </div>
  );
}
