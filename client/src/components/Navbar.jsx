import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert, Server, Activity, Layers, Database, BarChart3,
  LogOut, UserCheck, RefreshCw, Cpu, Radio, FileText, CheckCircle2, ChevronDown,
} from 'lucide-react';
import { seedDatabase } from '../services/api';

export default function Navbar() {
  const { user, logout, demoLogin, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
      window.location.reload();
    } catch {
      alert('Failed to re-seed database');
    } finally {
      setIsSeeding(false);
      setDropdownOpen(false);
    }
  };

  const handleSwitch = async (role) => {
    await demoLogin(role);
    setDropdownOpen(false);
    navigate(role === 'admin' || role === 'tech' ? '/admin' : '/student');
  };

  const isActive = (path) => location.pathname === path;

  const linkCls = (path) =>
    `px-3 py-1.5 rounded text-xs font-semibold transition-colors tracking-wide uppercase ${
      isActive(path)
        ? 'text-amber bg-amber/10 border border-amber/30'
        : 'text-ink2 hover:text-ink hover:bg-white/5'
    }`;

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 900,
        background: 'rgba(10,12,14,.84)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(237,231,220,.13)',
        height: 58,
        display: 'flex', alignItems: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between h-full">

        {/* ── Wordmark ── */}
        <Link
          to={isAdmin ? '/admin' : '/student'}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <span
            style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 16, letterSpacing: '-.025em',
              color: 'var(--ink)',
            }}
          >
            CAMPUS<span style={{ color: 'var(--amber)' }}>IT.</span>
          </span>
          <span
            style={{
              fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 600,
              letterSpacing: '.14em', textTransform: 'uppercase',
              color: 'var(--muted)', borderLeft: '1px solid var(--hair)',
              paddingLeft: 10,
            }}
            className="hidden sm:inline"
          >
            Help Desk &amp; Lab Monitor
          </span>
        </Link>

        {/* ── System status pill ── */}
        <div
          className="hidden lg:flex items-center gap-2 ml-4"
          style={{
            padding: '4px 12px', borderRadius: 999,
            border: '1px solid rgba(46,107,114,.3)',
            background: 'rgba(46,107,114,.08)',
          }}
        >
          <span className="status-dot status-dot-teal animate-pulse-dot" />
          <span className="lbl" style={{ color: 'var(--teal)', fontSize: 10 }}>
            System Nominal
          </span>
        </div>

        {/* ── Nav links ── */}
        <div className="hidden md:flex items-center gap-1 ml-auto mr-4">
          {!isAdmin ? (
            <>
              <Link to="/student" className={linkCls('/student')}>Diagnostics</Link>
              <Link to="/student/tickets" className={linkCls('/student/tickets')}>My Tickets</Link>
            </>
          ) : (
            <>
              <Link to="/admin" className={linkCls('/admin')}>Overview</Link>
              <Link to="/admin/broadcasts" className={linkCls('/admin/broadcasts') + ' flex items-center gap-1.5'}>
                <Radio className="w-3 h-3" />Outages
              </Link>
              <Link to="/admin/tickets" className={linkCls('/admin/tickets') + ' flex items-center gap-1.5'}>
                <FileText className="w-3 h-3" />Tickets
              </Link>
              <Link to="/admin/labs" className={linkCls('/admin/labs') + ' flex items-center gap-1.5'}>
                <Layers className="w-3 h-3" />Labs
              </Link>
              <Link to="/admin/analytics" className={linkCls('/admin/analytics') + ' flex items-center gap-1.5'}>
                <BarChart3 className="w-3 h-3" />Analytics
              </Link>
              <Link to="/admin/kb" className={linkCls('/admin/kb') + ' flex items-center gap-1.5'}>
                <Database className="w-3 h-3" />KB
              </Link>
            </>
          )}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">

          {/* Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 4,
                border: '1px solid var(--hair)',
                background: 'var(--g1)',
                fontFamily: "'Sora', sans-serif",
                fontSize: 10.5, fontWeight: 600,
                letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'var(--ink2)',
                cursor: 'pointer', transition: 'border-color .2s, color .2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--hair)'; e.currentTarget.style.color = 'var(--ink2)'; }}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {dropdownOpen && (
              <>
                {/* backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: 256,
                    background: 'var(--g1)',
                    border: '1px solid var(--hair)',
                    borderRadius: 6,
                    zIndex: 50,
                    boxShadow: '0 16px 40px rgba(0,0,0,.6)',
                  }}
                >
                  <div className="lbl px-3 py-2 border-b" style={{ borderColor: 'var(--hair)', fontSize: 9, color: 'var(--muted)' }}>
                    Switch Active Persona
                  </div>

                  {[
                    { role: 'admin',    label: 'Head Admin',   name: 'Prof. Rajesh Sharma',   color: 'var(--amber)' },
                    { role: 'tech',     label: 'Technician',   name: 'Suresh Patil (Hardware)', color: 'var(--teal)' },
                    { role: 'student',  label: 'Student',      name: 'Aarav Mehta · CS-2022-042', color: 'var(--ink2)' },
                    { role: 'student2', label: 'Student',      name: 'Priya Nair · CS-2022-018',  color: 'var(--ink2)' },
                  ].map(p => (
                    <button
                      key={p.role}
                      onClick={() => handleSwitch(p.role)}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '8px 12px', background: 'none', border: 'none',
                        cursor: 'pointer', transition: 'background .15s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(237,231,220,.05)'}
                      onMouseOut={e => e.currentTarget.style.background = 'none'}
                    >
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: p.color }}>
                        {p.label}
                      </div>
                      <div className="lbl" style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '.08em', textTransform: 'none' }}>
                        {p.name}
                      </div>
                    </button>
                  ))}

                  <div style={{ borderTop: '1px solid var(--hair)', padding: '6px 8px' }}>
                    <button
                      onClick={handleSeed}
                      disabled={isSeeding}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 12px', background: 'none', border: 'none',
                        borderRadius: 4, cursor: 'pointer',
                        fontFamily: "'Sora', sans-serif", fontSize: 11,
                        color: seedSuccess ? 'var(--teal)' : 'var(--muted)',
                        transition: 'color .2s',
                      }}
                    >
                      {seedSuccess
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />}
                      {isSeeding ? 'Seeding…' : seedSuccess ? 'Done!' : 'Reset & Re-seed Demo DB'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User chip */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 10, borderLeft: '1px solid var(--hair)' }}>
              <div className="hidden sm:block text-right">
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--ink)', letterSpacing: '-.01em' }}>
                  {user.name.split(' ')[0]}
                </div>
                <div className="lbl" style={{ color: 'var(--amber)', fontSize: 9 }}>
                  {user.role}{user.rollNo ? ` · ${user.rollNo}` : ''}
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{
                  padding: '6px', borderRadius: 4, background: 'none', border: 'none',
                  color: 'var(--muted)', cursor: 'pointer', transition: 'color .2s',
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--amber)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
