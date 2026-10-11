import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OutageBroadcast from './pages/OutageBroadcast';
import TicketQueue from './pages/TicketQueue';
import LabMatrix from './pages/LabMatrix';
import Analytics from './pages/Analytics';
import KnowledgeBasePage from './pages/KnowledgeBasePage';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--g0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
          Loading Campus IT Session…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/student" replace />;
  }

  return children;
};

function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--g0)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', fontFamily: "'Sora', sans-serif" }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <StudentDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/tickets"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <StudentDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin & Department Staff Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/broadcasts"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <OutageBroadcast />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <TicketQueue />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/labs"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <LabMatrix />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kb"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AppLayout>
                  <KnowledgeBasePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
