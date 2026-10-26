import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  QrCode,
  Megaphone,
  FileText,
  ShieldAlert,
  Send,
  Download,
  UserCheck,
  Check,
  ExternalLink,
  Info
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { BentoCard } from '../components/bento/BentoCard';
import { QRCheckInModal } from '../components/attendance/QRCheckInModal';
import confetti from 'canvas-confetti';

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const {
    events,
    currentUser,
    registrations,
    registerForEvent,
    cancelRegistration,
    announcements,
    postAnnouncement,
    showToast
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'about' | 'schedule' | 'announcements' | 'organizer'>('about');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementMsg, setNewAnnouncementMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const event = events.find(e => e.id === eventId || e.slug === eventId);

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-sm text-slate-500">
          The event you are looking for does not exist or may have been unlisted.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events Catalog
        </Link>
      </div>
    );
  }

  // Registration states
  const userRegistration = registrations.find(
    r => r.event_id === event.id && r.student_id === currentUser.id && r.registration_status !== 'cancelled'
  );

  const isRegistered = Boolean(userRegistration);
  const isOrganizer = currentUser.id === event.organizer_id;
  const isFacultyOrAdmin = currentUser.role === 'faculty' || currentUser.role === 'admin';
  const canManageEvent = isOrganizer || isFacultyOrAdmin;

  const eventAnnouncements = announcements.filter(a => a.event_id === event.id);
  const eventParticipants = registrations.filter(r => r.event_id === event.id && r.registration_status !== 'cancelled');

  const now = new Date();
  const deadlineDate = new Date(event.registration_deadline);
  const isPastDeadline = deadlineDate < now;
  const isFull = event.registered_count >= event.capacity;
  const spotsLeft = Math.max(0, event.capacity - event.registered_count);

  const startDate = new Date(event.start_at);
  const endDate = new Date(event.end_at);

  const formattedStart = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedStartTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formattedEndTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Handle student registration
  const handleRegisterClick = () => {
    const res = registerForEvent(event.id);
    if (res.success) {
      confetti({ particleCount: 70, spread: 70 });
    }
  };

  // Handle registration cancel
  const handleCancelClick = () => {
    if (userRegistration) {
      if (confirm('Are you sure you want to cancel your registration? Your seat will be made available to other students.')) {
        cancelRegistration(userRegistration.id);
      }
    }
  };

  // CSV export for participants
  const handleExportCSV = () => {
    const headers = ['Registration Code', 'Student Name', 'College ID', 'Email', 'Department', 'Status', 'Registered At'];
    const rows = eventParticipants.map(p => [
      p.registration_code,
      `"${p.student_name || ''}"`,
      p.student_college_id || '',
      p.student_email || '',
      `"${p.student_dept || ''}"`,
      p.registration_status,
      new Date(p.registered_at).toLocaleString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.slug}-participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Participant roster exported to CSV successfully.', 'success');
  };

  // Organizer announcement submit
  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementTitle.trim() || !newAnnouncementMsg.trim()) return;
    postAnnouncement(event.id, newAnnouncementTitle.trim(), newAnnouncementMsg.trim());
    setNewAnnouncementTitle('');
    setNewAnnouncementMsg('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast('Event link copied to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {isCopied ? 'Link Copied' : 'Share Event'}
          </button>
        </div>
      </div>

      {/* Hero Media Banner & Header Info */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-lg">
        {/* Banner image with overlay */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        {/* Floating Content over bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-md bg-blue-600 text-white shadow-xs">
              {event.category_name || 'Event'}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-slate-100">
              {event.department_name}
            </span>
            {event.club_name && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300">
                {event.club_name}
              </span>
            )}
            {event.status === 'pending_approval' && (
              <span className="text-xs font-bold px-3 py-1 rounded-md bg-amber-500 text-white">
                Pending Review
              </span>
            )}
            {event.status === 'completed' && (
              <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-600 text-white">
                Event Completed
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              {formattedStart}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              {formattedStartTime} – {formattedEndTime}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              {event.venue}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Registration Bento Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Tabs, Description, Rules, Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Rules
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'schedule'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Agenda & Timeline
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'announcements'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Announcements</span>
              {eventAnnouncements.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  {eventAnnouncements.length}
                </span>
              )}
            </button>
            {canManageEvent && (
              <button
                onClick={() => setActiveTab('organizer')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer text-indigo-600 font-bold ${
                  activeTab === 'organizer'
                    ? 'border-indigo-600'
                    : 'border-transparent hover:text-indigo-800'
                }`}
              >
                Organizer Tools ({eventParticipants.length})
              </button>
            )}
          </div>

          {/* Tab 1: About & Rules */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-base">About this Event</h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>

                {event.tags && event.tags.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {event.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Eligibility & Guidelines */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-blue-600" />
                  Eligibility & Instructions
                </h3>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Criteria:</strong> {event.eligibility}
                </p>

                {event.rules && event.rules.length > 0 ? (
                  <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                    {event.rules.map((rule, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {rule}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    College ID card and registration confirmation code required for physical entry.
                  </p>
                )}

                {event.contact_info && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <strong>Organizer Contact:</strong> {event.contact_info}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Schedule */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Event Schedule & Timeline</h3>
              {event.schedule && event.schedule.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="py-3 flex items-start gap-4">
                      <div className="text-xs font-bold text-blue-600 w-36 shrink-0 font-mono">
                        {item.time}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-800 font-medium">
                        {item.activity}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Detailed minute-by-minute itinerary will be broadcasted to registered students prior to kickoff.
                </p>
              )}
            </div>
          )}

          {/* Tab 3: Announcements */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {eventAnnouncements.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  No official announcements yet. Registered students will receive in-app notifications whenever updates are posted.
                </div>
              ) : (
                eventAnnouncements.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{a.message}</p>
                    <div className="text-[11px] text-slate-500 font-medium pt-1">
                      Posted by: {a.organizer_name}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Organizer Management Controls */}
          {canManageEvent && activeTab === 'organizer' && (
            <div className="space-y-6">
              <div className="bg-indigo-50/50 rounded-2xl border border-indigo-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Participant Operations
                    </h3>
                    <p className="text-xs text-slate-500">
                      {eventParticipants.length} registered attendees ({spotsLeft} seats remaining)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      Export CSV Roster
                    </button>
                    <button
                      onClick={() => setIsCheckInModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UserCheck className="w-4 h-4" />
                      Open QR Check-In
                    </button>
                  </div>
                </div>

                {/* Broadcast Announcement Form */}
                <form onSubmit={handleAnnouncementSubmit} className="pt-4 border-t border-indigo-200/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Broadcast Announcement to Participants
                  </h4>
                  <input
                    type="text"
                    placeholder="Announcement Title (e.g. Venue Change / Lab Instructions)"
                    value={newAnnouncementTitle}
                    onChange={e => setNewAnnouncementTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    rows={2}
                    placeholder="Enter message text... (All registered students will immediately receive an in-app alert)"
                    value={newAnnouncementMsg}
                    onChange={e => setNewAnnouncementMsg(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newAnnouncementTitle.trim() || !newAnnouncementMsg.trim()}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Announcement
                  </button>
                </form>

                {/* Participant Table */}
                <div className="pt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 bg-white rounded-xl overflow-hidden">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5">College ID</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Registered At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {eventParticipants.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-400">
                            No students registered yet.
                          </td>
                        </tr>
                      ) : (
                        eventParticipants.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/70">
                            <td className="p-2.5 font-mono font-bold text-slate-700">
                              {p.registration_code}
                            </td>
                            <td className="p-2.5 font-medium text-slate-900">
                              {p.student_name}
                            </td>
                            <td className="p-2.5 text-slate-500">{p.student_college_id || 'N/A'}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                p.registration_status === 'attended'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {p.registration_status}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-400">
                              {new Date(p.registered_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Bento Registration Card / Ticket */}
        <div className="space-y-6">
          {/* If already registered: Digital Pass Card */}
          {isRegistered && userRegistration ? (
            <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-blue-800 space-y-6">
              <div className="flex items-center justify-between border-b border-blue-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Your Event Pass</h3>
                    <p className="text-[11px] text-blue-300">Confirmed Registration</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white uppercase tracking-wider">
                  {userRegistration.registration_status}
                </span>
              </div>

              {/* Ticket Code Display */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/15 space-y-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-300 block">
                  Official Check-in Code
                </span>
                <div className="text-2xl font-mono font-extrabold tracking-wider text-white">
                  {userRegistration.registration_code}
                </div>
                <p className="text-[11px] text-slate-300">
                  Show this code or scan the badge at the registration desk
                </p>

                {/* Simulated QR Visual */}
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center my-2 shadow-inner">
                  <QrCode className="w-28 h-28 text-slate-900" />
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Student:</span>
                  <strong className="text-white">{userRegistration.student_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <strong className="text-white">{userRegistration.student_college_id || 'Campus Student'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Registered:</span>
                  <strong className="text-white">
                    {new Date(userRegistration.registered_at).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              {/* Cancel registration option */}
              <div className="pt-2 border-t border-blue-800/80">
                <button
                  onClick={handleCancelClick}
                  className="w-full text-center text-xs text-rose-300 hover:text-rose-100 hover:underline cursor-pointer"
                >
                  Cancel Registration Pass
                </button>
              </div>
            </div>
          ) : (
            /* Registration Action Box */
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  Registration Status
                </span>
                <h3 className="font-extrabold text-slate-900 text-xl">
                  {event.status === 'published' ? 'Seats Available' : 'Registration Closed'}
                </h3>
              </div>

              {/* Progress and Spots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Capacity:
                  </span>
                  <span className="font-bold text-slate-900">
                    {event.registered_count} / {event.capacity}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-rose-500' : spotsLeft < 15 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{
                      width: `${Math.min(100, (event.registered_count / event.capacity) * 100)}%`
                    }}
                  ></div>
                </div>

                <div className="text-[11px] text-right font-semibold text-slate-500">
                  {isFull ? (
                    <span className="text-rose-600">Event is at maximum capacity</span>
                  ) : (
                    <span>{spotsLeft} spots remaining</span>
                  )}
                </div>
              </div>

              {/* Deadline notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Registration Deadline:
                </div>
                <div className="text-slate-600 font-medium">
                  {deadlineDate.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Registration Button */}
              {isPastDeadline ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold text-center">
                  Registration deadline has passed.
                </div>
              ) : isFull ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center">
                  This event is fully booked.
                </div>
              ) : event.status !== 'published' ? (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold text-center">
                  This event is not currently accepting registrations.
                </div>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Register Now (Free)
                </button>
              )}

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                By registering, your seat is reserved and an official admission code is generated for entry.
              </p>
            </div>
          )}

          {/* Organizer Info Bento Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Event Convener
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {event.organizer_name ? event.organizer_name[0] : 'O'}
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">
                  {event.organizer_name || 'Event Organizing Committee'}
                </h5>
                <p className="text-xs text-slate-500">
                  {event.department_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Check In Modal */}
      <QRCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        defaultEventId={event.id}
      />
    </div>
  );
};
