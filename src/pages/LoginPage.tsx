import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { switchRole, switchUser, showToast } = useCampus();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const demoAccounts = [
    {
      role: 'student' as UserRole,
      id: 'user-student-1',
      name: 'Priya Sharma',
      email: 'priya.sharma@campus.edu',
      desc: 'Student Pass & Registrations',
      route: '/student',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'organizer' as UserRole,
      id: 'user-organizer-1',
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      desc: 'Propose Events & QR Check-in',
      route: '/organizer',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      role: 'faculty' as UserRole,
      id: 'user-faculty-1',
      name: 'Dr. Sarah Mitchell',
      email: 'dr.mitchell@campus.edu',
      desc: 'Department Review & Approvals',
      route: '/faculty',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      role: 'admin' as UserRole,
      id: 'user-admin-1',
      name: 'Dean Robert Taylor',
      email: 'admin.taylor@campus.edu',
      desc: 'System Analytics & Platform Admin',
      route: '/admin',
      badgeColor: 'bg-rose-100 text-rose-800'
    }
  ];

  const handleQuickLogin = (acc: typeof demoAccounts[0]) => {
    switchUser(acc.id);
    navigate(acc.route);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    // Check if matches any demo account
    const matched = demoAccounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
    if (matched) {
      switchUser(matched.id);
      navigate(matched.route);
    } else {
      // Default to student login
      switchRole('student');
      showToast(`Logged in successfully as ${email}`, 'success');
      navigate('/student');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsResetModalOpen(false);
    showToast(`Password recovery link has been dispatched to ${resetEmail}`, 'info');
    setResetEmail('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to CampusConnect
          </h2>
          <p className="text-xs text-slate-500">
            Autonomous collegiate event registration, certificates, and proposals
          </p>
        </div>

        {/* 1-Click Fast Demo Switcher for Evaluation */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              1-Click Demo Evaluator Logins
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Click any role to test full authorization workflows instantly:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map(acc => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-300 text-left transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 capitalize">
                    {acc.role}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded capitalize ${acc.badgeColor}`}>
                    Quick
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium truncate mt-1">
                  {acc.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <form onSubmit={handleStandardSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@campus.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800">
              Register Student / Organizer
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Reset Password</h3>
            <p className="text-xs text-slate-500">
              Enter your college email to receive a password recovery verification link.
            </p>
            <form onSubmit={handleResetSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="your.email@campus.edu"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
