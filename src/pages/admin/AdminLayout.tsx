import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

const navItems = [
  { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/banners', icon: 'image', label: 'Banners' },
  { to: '/admin/doctors', icon: 'doctor', label: 'Doctors' },
  { to: '/admin/services', icon: 'hospital', label: 'Services' },
  { to: '/admin/specialities', icon: 'shield', label: 'Specialities' },
  { to: '/admin/social', icon: 'newspaper', label: 'Social Media' },
  { to: '/admin/settings', icon: 'settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { isAuthenticated, isCheckingSession, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isCheckingSession) return null;
  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-primary font-serif font-bold text-lg">V</div>
          <div>
            <div className="text-sm font-semibold text-white">Admin Panel</div>
            <div className="text-xs text-white/50">Vedant Hospital</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <MedicalIcon name={item.icon as any} size={15} color={iconColor.white} strokeWidth={2.2} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10">
          <MedicalIcon name="globe" size={15} color={iconColor.white} strokeWidth={2.2} /> View Website
        </a>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-danger hover:bg-danger/10 transition-colors rounded-lg mt-0.5">
          <MedicalIcon name="logout" size={15} color={iconColor.white} strokeWidth={2.2} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-primary-dark shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-60 bg-primary-dark z-10">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-md text-text-muted hover:text-text">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="text-sm font-medium text-text-muted">Hospital Content Management</div>
          <button onClick={handleLogout} className="text-sm text-text-muted hover:text-danger transition-colors">Sign Out</button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
