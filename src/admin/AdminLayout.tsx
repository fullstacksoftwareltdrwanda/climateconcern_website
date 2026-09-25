import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Users,
  Grid,
  BookOpen,
  HelpCircle,
  BarChart3,
  Phone,
  Shield,
  FolderArchive,
  UserCheck,
  UserCog,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { ToastProvider } from './Toast';
import { ConfirmProvider, useConfirm } from './ConfirmDialog';

const AdminLayoutInner: React.FC = () => {
  const { admin, loading, logout, hasPermission } = useAdminAuth();
  const confirm = useConfirm();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#00652c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, show: true },
    {
      label: 'Applications',
      path: '/admin/applications',
      icon: GraduationCap,
      show: hasPermission('applications', 'view'),
    },
    {
      label: 'Consultant Requests',
      path: '/admin/consultant-requests',
      icon: FileText,
      show: hasPermission('consultant_requests', 'view'),
    },
    { label: 'Team Members', path: '/admin/team', icon: Users, show: hasPermission('team', 'view') },
    { label: 'Services', path: '/admin/services', icon: Grid, show: hasPermission('services', 'view') },
    { label: 'Training Courses', path: '/admin/training', icon: BookOpen, show: hasPermission('training', 'view') },
    { label: 'FAQs', path: '/admin/faqs', icon: HelpCircle, show: hasPermission('faqs', 'view') },
    { label: 'Stats & Records', path: '/admin/stats', icon: BarChart3, show: hasPermission('stats', 'view') },
    { label: 'Contact Info', path: '/admin/contact', icon: Phone, show: hasPermission('contact', 'view') },
    { label: 'Legal Pages', path: '/admin/legal', icon: Shield, show: hasPermission('legal', 'view') },
    { label: 'Library', path: '/admin/library', icon: FolderArchive, show: hasPermission('library', 'view') },
    { label: 'Admin Accounts', path: '/admin/admins', icon: UserCheck, show: admin.isMainAdmin },
    { label: 'My Profile', path: '/admin/profile', icon: UserCog, show: true },
  ].filter((item) => item.show);

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Confirm Logout',
      message: `Are you sure you want to log out of the admin panel, ${admin.name}?`,
      confirmText: 'Log Out',
      cancelText: 'Stay logged in',
      variant: 'warning',
    });
    if (!ok) return;
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#031d12] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="h-9 px-2 py-0.5 rounded-lg bg-white shadow-xs flex items-center justify-center shrink-0">
                <img
                  src="/images/logoofthewebsite.png"
                  alt="Climate Concern"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight text-white">Climate Concern</h1>
                <p className="text-[11px] text-emerald-400">Admin Control Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#00a859] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Info & Logout */}
        <div className="p-4 border-t border-emerald-900/60 bg-[#02180d]/60">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate pr-2">
              <div className="text-xs font-bold text-white truncate">{admin.name}</div>
              <div className="text-[10px] text-emerald-400 truncate">
                {admin.isMainAdmin ? '★ Main Administrator' : 'Administrator'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600/80 text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 text-[11px] text-gray-400 hover:text-[#00e074] transition-colors pt-2 border-t border-emerald-900/40"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar on mobile */}
        <header className="md:hidden bg-[#031d12] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm">Climate Concern Admin</span>
          <div className="w-8" />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminLayoutInner />
      </ConfirmProvider>
    </ToastProvider>
  );
};
