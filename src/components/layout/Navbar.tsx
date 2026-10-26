import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Bell,
  Database,
  UserCheck,
  ChevronDown,
  LayoutDashboard,
  Award,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Menu,
  X,
  FileCheck2,
  Users
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    switchUser,
    isCloudConnected,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsCloudModalOpen
  } = useCampus();

  const navigate = useNavigate();
  const location = useLocation();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardRoute = (role: UserRole) => {
    switch (role) {
      case 'student':
        return '/student';
      case 'organizer':
        return '/organizer';
      case 'faculty':
        return '/faculty';
      case 'admin':
        return '/admin';
      default:
        return '/student';
    }
  };

  const roleLabels: Record<UserRole, { label: string; badgeClass: string; userDesc: string }> = {
    student: {
      label: 'Student',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      userDesc: 'Priya Sharma (CS-2023-042)'
    },
    organizer: {
      label: 'Event Organizer',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      userDesc: 'Alex Chen (BitByte Guild)'
    },
    faculty: {
      label: 'Faculty Approver',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      userDesc: 'Dr. Sarah Mitchell (CSE Dept)'
    },
    admin: {
      label: 'System Admin',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      userDesc: 'Dean Robert Taylor'
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Events', path: '/events' },
    { label: 'My Dashboard', path: getDashboardRoute(currentUser.role) },
    { label: 'Certificates', path: '/certificates' },
    { label: 'About', path: '/about' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg tracking-tight flex items-center gap-1.5">
                  CampusConnect
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                    Cloud
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:inline-block">
                  College Event Management System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cloud Status Button */}
            <button
              onClick={() => setIsCloudModalOpen(true)}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isCloudConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click to configure live Supabase credentials or view PostgreSQL schema"
            >
              <Database className={`w-3.5 h-3.5 ${isCloudConnected ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span className="hidden sm:inline">
                {isCloudConnected ? 'Cloud Active' : 'Local DB (Demo)'}
              </span>
            </button>

            {/* Fast Role Switcher */}
            <div className="relative" ref={roleMenuRef}>
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                title="Switch role instantly to test student, organizer, faculty or admin perspective"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="capitalize">{currentUser.role}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Demo Role Switcher
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Switch instantly to test role-based permissions
                    </p>
                  </div>
                  {(['student', 'organizer', 'faculty', 'admin'] as UserRole[]).map(role => {
                    const isCurrent = currentUser.role === role;
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role);
                          setIsRoleMenuOpen(false);
                          navigate(getDashboardRoute(role));
                        }}
                        className={`w-full text-left px-3 py-2 flex flex-col hover:bg-slate-50 transition-colors ${
                          isCurrent ? 'bg-blue-50/70 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800 capitalize">
                            {roleLabels[role].label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-blue-700 uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {roleLabels[role].userDesc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {isNotifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                      <p className="text-[11px] text-slate-500">
                        {unreadNotifsCount} unread message{unreadNotifsCount === 1 ? '' : 's'}
                      </p>
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) {
                              setIsNotifMenuOpen(false);
                              navigate(n.link);
                            }
                          }}
                          className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                            !n.read_at ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotifMenuOpen(false)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      View all in Notification Center →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.full_name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/20"
                />
                <div className="text-left hidden lg:block mr-1">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.full_name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${roleLabels[currentUser.role].badgeClass}`}>
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={getDashboardRoute(currentUser.role)}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                    My Dashboard
                  </Link>

                  <Link
                    to="/certificates"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    My Certificates
                  </Link>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsCloudModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-slate-500" />
                    Cloud & DB Settings
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <Link
                    to="/login"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out / Switch User
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCloudModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 font-medium flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Configure Cloud Database
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
