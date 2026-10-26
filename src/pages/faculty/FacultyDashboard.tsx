import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Building2,
  Clock,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { BentoCard } from '../../components/bento/BentoCard';
import { CollegeEvent } from '../../types';

export const FacultyDashboard: React.FC = () => {
  const {
    currentUser,
    events,
    departments,
    registrations,
    attendance,
    reviewEvent,
    auditLogs
  } = useCampus();

  const [reviewingEvent, setReviewingEvent] = useState<CollegeEvent | null>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [comments, setComments] = useState('');

  // Events pending approval
  const pendingEvents = events.filter(e => e.status === 'pending_approval');
  const departmentEvents = events.filter(e => e.department_id === currentUser.department_id);
  const totalDeptRegistrations = registrations.filter(r => {
    const evt = events.find(e => e.id === r.event_id);
    return evt && evt.department_id === currentUser.department_id;
  }).length;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingEvent) return;

    reviewEvent(reviewingEvent.id, decision, comments.trim());
    setReviewingEvent(null);
    setComments('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Faculty Approvals & Academic Monitoring
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/30 border border-purple-400/30 text-purple-200 uppercase">
              Faculty Mode
            </span>
          </div>
          <p className="text-xs text-purple-200 mt-1">
            Logged in as <strong className="text-white">{currentUser.full_name}</strong> • {currentUser.department_name || 'Academic Committee'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/events"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-colors shadow-md flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Browse Full Catalog
          </Link>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BentoCard
          title="Awaiting Review"
          subtitle="Proposals pending decision"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          badge={pendingEvents.length > 0 ? `${pendingEvents.length} Actions Required` : 'Clear'}
          badgeColor={pendingEvents.length > 0 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {pendingEvents.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Require faculty approval to publish</p>
        </BentoCard>

        <BentoCard
          title="Department Events"
          subtitle={currentUser.department_name || 'My Department'}
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {departmentEvents.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total sponsored activities</p>
        </BentoCard>

        <BentoCard
          title="Student Participation"
          subtitle="Department registrations"
          icon={<Users className="w-5 h-5 text-indigo-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalDeptRegistrations}
          </div>
          <p className="text-xs text-slate-500 mt-1">Enrolled student seats</p>
        </BentoCard>

        <BentoCard
          title="Attendance Audits"
          subtitle="Verified presences"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {attendance.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total QR scans campus-wide</p>
        </BentoCard>
      </div>

      {/* Event Review Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Event Review Queue
            </h2>
            <p className="text-xs text-slate-500">
              Evaluate venue suitability, safety compliance, academic relevance, and budget limits
            </p>
          </div>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">Review queue is empty</h3>
            <p className="text-xs text-slate-500">
              All student and organizer event proposals have been evaluated.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                        Pending Approval
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        {event.department_name}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {event.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setReviewingEvent(event);
                      setDecision('approved');
                      setComments('Venue and safety guidelines verified. Approved for campus publication.');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Review & Decide
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Organizer</span>
                    <strong className="text-slate-900">{event.organizer_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Venue</span>
                    <strong>{event.venue}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheduled Time</span>
                    <strong>{new Date(event.start_at).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Capacity</span>
                    <strong>{event.capacity} Students</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal if active */}
      {reviewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Faculty Review: {reviewingEvent.title}
              </h3>
              <button
                onClick={() => setReviewingEvent(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Official Recommendation & Decision *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision('approved')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      decision === 'approved'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Approve & Publish
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('rejected')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      decision === 'rejected'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Reject Proposal
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Faculty Review Comments & Directives
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide feedback to the student convener..."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewingEvent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-xs ${
                    decision === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Summary Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Departmental Event History
        </h3>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Event Title</th>
                <th className="p-3">Convener</th>
                <th className="p-3">Status</th>
                <th className="p-3">Registrations</th>
                <th className="p-3">Scheduled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentEvents.map(evt => (
                <tr key={evt.id} className="hover:bg-slate-50/70">
                  <td className="p-3 font-medium text-slate-900">
                    <Link to={`/events/${evt.id}`} className="hover:text-blue-600">
                      {evt.title}
                    </Link>
                  </td>
                  <td className="p-3 text-slate-600">{evt.organizer_name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      evt.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : evt.status === 'pending_approval'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {evt.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">
                    {evt.registered_count} / {evt.capacity}
                  </td>
                  <td className="p-3 text-slate-500">
                    {new Date(evt.start_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
