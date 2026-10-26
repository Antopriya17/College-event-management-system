import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Award,
  ShieldAlert,
  BarChart2,
  TrendingUp,
  Database,
  Building2,
  FolderPlus,
  Plus,
  History,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { BentoCard } from '../../components/bento/BentoCard';
import { UserRole } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    events,
    departments,
    categories,
    registrations,
    attendance,
    certificates,
    auditLogs,
    updateUserRole,
    reviewEvent,
    showToast,
    setIsCloudModalOpen
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'approvals' | 'taxonomy' | 'audit'>('overview');
  const [selectedUserRoleChange, setSelectedUserRoleChange] = useState<{ id: string; name: string; role: UserRole } | null>(null);

  // Compute stats
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'published').length;
  const pendingApprovals = events.filter(e => e.status === 'pending_approval');
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalRegistrations = registrations.filter(r => r.registration_status !== 'cancelled').length;
  const attendanceRate = totalRegistrations > 0 ? Math.round((attendance.length / totalRegistrations) * 100) : 0;

  // Chart data: Events by Category
  const categoryChartData = categories.map(cat => ({
    name: cat.name.split(' ')[0],
    fullName: cat.name,
    count: events.filter(e => e.category_id === cat.id).length
  }));

  // Chart data: Registrations by Department
  const departmentChartData = departments.map(dept => ({
    name: dept.code,
    fullName: dept.name,
    registrations: registrations.filter(r => {
      const evt = events.find(e => e.id === r.event_id);
      return evt && evt.department_id === dept.id;
    }).length
  }));

  const COLORS = ['#2563eb', '#7c3aed', '#059669', '#db2777', '#d97706', '#0284c7'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Administrative Central Console
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/30 border border-rose-400/30 text-rose-200 uppercase">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Managing institution platform parameters as <strong className="text-white">{currentUser.full_name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCloudModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Database className="w-3.5 h-3.5" />
            Cloud Database Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Analytics & Metrics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          User Role Governance
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-2.5 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'approvals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <span>Approval Queue</span>
          {pendingApprovals.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">
              {pendingApprovals.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'audit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Security & Audit Logs
        </button>
      </div>

      {/* Tab 1: Overview & Recharts */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Bento Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BentoCard
              title="Catalog Volume"
              subtitle="All registered events"
              icon={<Calendar className="w-5 h-5 text-blue-600" />}
            >
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {totalEvents}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {publishedEvents} published • {pendingApprovals.length} in queue
              </p>
            </BentoCard>

            <BentoCard
              title="Total Enrolments"
              subtitle="Confirmed student spots"
              icon={<Users className="w-5 h-5 text-indigo-600" />}
            >
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {totalRegistrations}
              </div>
              <p className="text-xs text-slate-500 mt-1">Concurrency safe check active</p>
            </BentoCard>

            <BentoCard
              title="Attendance Rate"
              subtitle="Live QR conversions"
              icon={<Award className="w-5 h-5 text-emerald-600" />}
            >
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {attendanceRate}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {attendance.length} checked-in participants
              </p>
            </BentoCard>

            <BentoCard
              title="Certificates"
              subtitle="Digital blockchain verified"
              icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
            >
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {certificates.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Cryptographic seals attached</p>
            </BentoCard>
          </div>

          {/* Interactive Recharts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Events by Category */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Events Distribution by Category
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                    <YAxis allowDecimals={false} fontSize={11} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Registrations by Department */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Registrations by Academic Department
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentChartData}>
                    <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                    <YAxis allowDecimals={false} fontSize={11} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="registrations" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Role Governance */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform User Directory</h3>
              <p className="text-xs text-slate-500">
                Grant or revoke organizer, faculty, and administrator privileges
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">College ID / Dept</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'user-student-1', name: 'Priya Sharma', email: 'priya.sharma@campus.edu', idNumber: 'CS-2023-042', dept: 'CSE', role: 'student' as UserRole },
                  { id: 'user-organizer-1', name: 'Alex Chen', email: 'alex.chen@campus.edu', idNumber: 'CS-2022-019', dept: 'CSE', role: 'organizer' as UserRole },
                  { id: 'user-faculty-1', name: 'Dr. Sarah Mitchell', email: 'dr.mitchell@campus.edu', idNumber: 'FAC-082', dept: 'CSE', role: 'faculty' as UserRole },
                  { id: 'user-admin-1', name: 'Dean Robert Taylor', email: 'admin.taylor@campus.edu', idNumber: 'ADM-001', dept: 'Admin', role: 'admin' as UserRole },
                  { id: 'user-student-2', name: 'Rohit Verma', email: 'rohit.verma@campus.edu', idNumber: 'EC-2023-108', dept: 'ECE', role: 'student' as UserRole },
                  { id: 'user-student-3', name: 'Emily Zhao', email: 'emily.zhao@campus.edu', idNumber: 'MB-2024-055', dept: 'MBA', role: 'student' as UserRole }
                ].map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{u.idNumber}</div>
                      <div className="text-[11px] text-slate-400">{u.dept}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-rose-100 text-rose-800'
                          : u.role === 'faculty'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'organizer'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="organizer">Organizer</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Admin Approval Queue */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Pending Event Submissions</h3>
          {pendingApprovals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No events currently awaiting administrative or faculty review.
            </div>
          ) : (
            pendingApprovals.map(evt => (
              <div key={evt.id} className="bg-white rounded-2xl border border-amber-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                    Awaiting Decision
                  </span>
                  <h4 className="font-bold text-slate-900 text-base mt-1">{evt.title}</h4>
                  <p className="text-xs text-slate-500">
                    Organizer: {evt.organizer_name} • Venue: {evt.venue} • Capacity: {evt.capacity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => reviewEvent(evt.id, 'rejected', 'Administrative rejection')}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => reviewEvent(evt.id, 'approved', 'Approved by Central Administration')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Approve & Publish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Administrative Audit Trails</h3>
              <p className="text-xs text-slate-500">Immutable chronological record of events, approvals, and permissions</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold font-sans">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 15).map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="p-3 text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-3 font-sans font-semibold text-slate-800">
                      {log.actor_name}
                      <span className="text-[10px] text-slate-400 font-normal ml-1">({log.actor_role})</span>
                    </td>
                    <td className="p-3 font-bold text-blue-600">{log.action}</td>
                    <td className="p-3 text-slate-500 uppercase text-[10px]">{log.entity_type}</td>
                    <td className="p-3 text-slate-600 font-sans">{log.details || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
