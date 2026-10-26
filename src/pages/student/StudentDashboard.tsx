import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Bell,
  ArrowRight,
  ExternalLink,
  User,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { BentoCard } from '../../components/bento/BentoCard';
import { CertificateModal } from '../../components/certificates/CertificateModal';
import { Certificate } from '../../types';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    registrations,
    events,
    certificates,
    attendance,
    notifications,
    updateProfile
  } = useCampus();

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [bio, setBio] = useState(currentUser.bio || '');

  // Filter student registrations
  const studentRegistrations = registrations.filter(
    r => r.student_id === currentUser.id && r.registration_status !== 'cancelled'
  );

  const upcomingRegistrations = studentRegistrations.filter(r => {
    const evt = events.find(e => e.id === r.event_id);
    return evt && new Date(evt.start_at) >= new Date() && r.registration_status === 'confirmed';
  });

  const attendedRegistrations = studentRegistrations.filter(
    r => r.registration_status === 'attended'
  );

  const studentCertificates = certificates.filter(c => c.student_id === currentUser.id);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ phone, bio });
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner Bento */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.full_name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Welcome back, {currentUser.full_name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 border border-blue-400/30 text-blue-200 uppercase">
                Student
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              Roll / College ID: <strong className="text-white font-mono">{currentUser.student_id || 'CS-2023-042'}</strong> • {currentUser.department_name || 'Computer Science & Engineering'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
          <Link
            to="/events"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shadow-md flex items-center gap-1.5"
          >
            Explore Events
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Profile Edit Drawer if open */}
      {isEditingProfile && (
        <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-sm">Update Student Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Interests & Bio</label>
              <input
                type="text"
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Bento Grid Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BentoCard
          title="Upcoming Passes"
          subtitle="Events scheduled soon"
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {upcomingRegistrations.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Ready for check-in</p>
        </BentoCard>

        <BentoCard
          title="Events Attended"
          subtitle="Verified check-ins"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {attendedRegistrations.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">100% attendance recorded</p>
        </BentoCard>

        <BentoCard
          title="Earned Certificates"
          subtitle="Digital university credentials"
          icon={<Award className="w-5 h-5 text-amber-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {studentCertificates.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Ready to download & share</p>
        </BentoCard>

        <BentoCard
          title="Notification Alerts"
          subtitle="In-app announcements"
          icon={<Bell className="w-5 h-5 text-purple-600" />}
        >
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {notifications.filter(n => !n.read_at).length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Unread updates from organizers</p>
        </BentoCard>
      </div>

      {/* Main Grid: Left Registered Passes & Right Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Upcoming Registered Events */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              My Active Event Passes
            </h2>
            <Link
              to="/events"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Browse more events <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No upcoming registered events</h4>
              <p className="text-xs text-slate-500">
                You haven't registered for any upcoming events yet. Discover competitions, hackathons, and symposiums happening this semester!
              </p>
              <Link
                to="/events"
                className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-xs"
              >
                Explore Events Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingRegistrations.map(reg => {
                const event = events.find(e => e.id === reg.event_id);
                return (
                  <div
                    key={reg.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {event?.poster_url && (
                        <img
                          src={event.poster_url}
                          alt={reg.event_title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                          Confirmed Seat
                        </span>
                        <Link to={`/events/${reg.event_id}`}>
                          <h4 className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors">
                            {reg.event_title}
                          </h4>
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {event ? new Date(event.start_at).toLocaleDateString() : 'Upcoming'}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {event?.venue || reg.event_venue}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Check-In Code
                        </span>
                        <span className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                          {reg.registration_code}
                        </span>
                      </div>
                      <Link
                        to={`/events/${reg.event_id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View Pass Ticket →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Registration History */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Registration & Attendance History
            </h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-3">Event</th>
                    <th className="p-3">Ticket Code</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentRegistrations.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-medium text-slate-900 max-w-[200px] truncate">
                        {r.event_title}
                      </td>
                      <td className="p-3 font-mono text-slate-600">{r.registration_code}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.registration_status === 'attended'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {r.registration_status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">
                        {new Date(r.registered_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Issued Certificates Bento */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              My Certificates
            </h2>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {studentCertificates.length} Issued
            </span>
          </div>

          {studentCertificates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="font-semibold text-slate-800 text-xs">No certificates yet</h4>
              <p className="text-[11px] text-slate-500">
                Certificates are automatically issued as soon as you are marked present by the event convener at the check-in desk.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentCertificates.map(cert => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {cert.certificate_number}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                      {cert.event_title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Completed on {cert.event_date}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    View & Download Certificate
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 space-y-1">
            <h5 className="font-bold text-slate-800">Attendance Policy</h5>
            <p className="text-[11px] leading-relaxed">
              Arrive at the venue at least 15 minutes before the start time with your student ID and display your registration code to the organizer.
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};
