import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  Download,
  QrCode,
  Megaphone,
  BarChart3,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { BentoCard } from '../../components/bento/BentoCard';
import { QRCheckInModal } from '../../components/attendance/QRCheckInModal';

export const OrganizerDashboard: React.FC = () => {
  const {
    currentUser,
    events,
    registrations,
    attendance,
    announcements,
    showToast
  } = useCampus();

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedEventForCheckIn, setSelectedEventForCheckIn] = useState<string | undefined>();

  // Filter events organized by this user (or all if demo organizer)
  const organizerEvents = events.filter(
    e => e.organizer_id === currentUser.id || currentUser.role === 'admin'
  );

  const totalCapacity = organizerEvents.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalRegistrations = organizerEvents.reduce((acc, curr) => acc + curr.registered_count, 0);
  const totalCheckedIn = attendance.length;

  const handleExportAll = () => {
    const headers = ['Event ID', 'Event Title', 'Student Name', 'College ID', 'Ticket Code', 'Status', 'Registered At'];
    const rows = registrations
      .filter(r => organizerEvents.some(e => e.id === r.event_id) && r.registration_status !== 'cancelled')
      .map(r => [
        r.event_id,
        `"${r.event_title || ''}"`,
        `"${r.student_name || ''}"`,
        r.student_college_id || '',
        r.registration_code,
        r.registration_status,
        new Date(r.registered_at).toLocaleString()
      ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusconnect-organizer-roster-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported complete participant roster to CSV!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with CTA */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Event Organizer Studio
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 uppercase">
              Organizer Mode
            </span>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            Organizing as <strong className="text-white">{currentUser.full_name}</strong> • {currentUser.department_name || 'Engineering Faculty'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSelectedEventForCheckIn(undefined);
              setIsCheckInOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            Launch QR Scanner
          </button>
          <button
            onClick={handleExportAll}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <Link
            to="/organizer/create"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-white transition-colors shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Event Proposal
          </Link>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BentoCard
          title="Events Created"
          subtitle="Managed in system"
          icon={<Calendar className="w-5 h-5 text-emerald-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {organizerEvents.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {organizerEvents.filter(e => e.status === 'published').length} published • {organizerEvents.filter(e => e.status === 'pending_approval').length} awaiting review
          </p>
        </BentoCard>

        <BentoCard
          title="Total Registrations"
          subtitle="Participants enrolled"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalRegistrations}
          </div>
          <p className="text-xs text-slate-500 mt-1">Across all managed events</p>
        </BentoCard>

        <BentoCard
          title="Attendance Check-Ins"
          subtitle="Verified on site"
          icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalCheckedIn}
          </div>
          <p className="text-xs text-slate-500 mt-1">QR check-in stamps logged</p>
        </BentoCard>

        <BentoCard
          title="Overall Fill Rate"
          subtitle="Capacity utilization"
          icon={<BarChart3 className="w-5 h-5 text-purple-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full"
              style={{ width: `${totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0}%` }}
            ></div>
          </div>
        </BentoCard>
      </div>

      {/* Events Proposal List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              My Events & Proposals
            </h2>
            <p className="text-xs text-slate-500">
              Track approval status, participant rosters, and event lifecycle
            </p>
          </div>
          <Link
            to="/organizer/create"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
          >
            + New Proposal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizerEvents.map(event => {
            const spots = Math.max(0, event.capacity - event.registered_count);
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        event.status === 'published'
                          ? 'bg-emerald-600 text-white'
                          : event.status === 'pending_approval'
                          ? 'bg-amber-500 text-white'
                          : event.status === 'completed'
                          ? 'bg-blue-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}>
                        {event.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <span className="text-xs font-semibold text-blue-600 block">
                      {event.category_name}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div>Date: <strong>{new Date(event.start_at).toLocaleDateString()}</strong></div>
                      <div>Venue: <strong>{event.venue}</strong></div>
                      <div>
                        Roster: <strong>{event.registered_count} / {event.capacity}</strong> ({spots} remaining)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedEventForCheckIn(event.id);
                      setIsCheckInOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Check-in
                  </button>
                  <Link
                    to={`/events/${event.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Manage Event →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Check in modal */}
      <QRCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        defaultEventId={selectedEventForCheckIn}
      />
    </div>
  );
};
