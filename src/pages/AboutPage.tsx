import React from 'react';
import {
  GraduationCap,
  Database,
  ShieldCheck,
  Server,
  Layers,
  Cpu,
  Code2,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';

export const AboutPage: React.FC = () => {
  const { setIsCloudModalOpen } = useCampus();

  const rbacMatrix = [
    { feature: 'Browse Published Events & Search', student: true, organizer: true, faculty: true, admin: true },
    { feature: 'Register for Events (Capacity Checked)', student: true, organizer: true, faculty: true, admin: true },
    { feature: 'Cancel Own Registrations', student: true, organizer: true, faculty: true, admin: true },
    { feature: 'Download Digital PDF Certificates', student: true, organizer: true, faculty: true, admin: true },
    { feature: 'Propose New College Events', student: false, organizer: true, faculty: false, admin: true },
    { feature: 'Export Registered Participants to CSV', student: false, organizer: true, faculty: true, admin: true },
    { feature: 'Scan QR Codes & Record Attendance', student: false, organizer: true, faculty: true, admin: true },
    { feature: 'Broadcast In-App Announcements', student: false, organizer: true, faculty: false, admin: true },
    { feature: 'Review & Approve/Reject Proposals', student: false, organizer: false, faculty: true, admin: true },
    { feature: 'Platform User Role Governance', student: false, organizer: false, faculty: false, admin: true },
    { feature: 'System Audit Logs & Security Metrics', student: false, organizer: false, faculty: false, admin: true }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Capstone System Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          CampusConnect Architecture & Design
        </h1>
        <p className="max-w-3xl text-xs sm:text-sm text-slate-300 leading-relaxed">
          A full-stack, cloud-based college event management system designed with relational PostgreSQL database principles, concurrency-safe capacity enforcement, role-based access control, and digital certificate verification.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setIsCloudModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-colors cursor-pointer flex items-center gap-2 shadow-md"
          >
            <Database className="w-4 h-4" />
            Inspect SQL Schema & Cloud Config
          </button>
        </div>
      </div>

      {/* Relational Database Design */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Relational PostgreSQL Database Architecture
            </h2>
            <p className="text-xs text-slate-500">
              Third Normal Form (3NF) relational design with foreign keys and cascade integrity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            { name: 'profiles', desc: 'UUID linked to auth.users, full_name, role, department_id, student_id, phone' },
            { name: 'departments', desc: 'id, name, code, description (e.g. CSE, ECE, MECH, MBA, BIOTECH)' },
            { name: 'clubs', desc: 'id, name, code, department_id, lead_name, avatar_url' },
            { name: 'event_categories', desc: 'id, name, slug, description, visual icon and color' },
            { name: 'events', desc: 'id, title, slug, venue, capacity, registered_count, start_at, end_at, status' },
            { name: 'registrations', desc: 'id, event_id, student_id, registration_code, status, registered_at' },
            { name: 'attendance', desc: 'id, registration_id, event_id, checked_in_by, checked_in_at, status' },
            { name: 'certificates', desc: 'id, registration_id, student_id, certificate_number, issued_at' },
            { name: 'notifications', desc: 'id, recipient_id, title, message, notification_type, read_at' },
            { name: 'announcements', desc: 'id, event_id, organizer_id, title, message, created_at' },
            { name: 'event_approvals', desc: 'id, event_id, reviewer_id, decision, comments, reviewed_at' },
            { name: 'audit_logs', desc: 'id, actor_id, action, entity_type, entity_id, timestamp' }
          ].map(table => (
            <div key={table.name} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50">
              <span className="font-mono font-bold text-blue-700 block text-xs">
                {table.name}
              </span>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {table.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Concurrency & Safety */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Concurrency-Safe Event Registration
            </h2>
            <p className="text-xs text-slate-500">
              Guaranteed race condition prevention using atomic database row-locking
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          During high-demand collegiate technical symposiums or limited-seat bootcamps, hundreds of students may attempt registration simultaneously. CampusConnect enforces transaction safety via the PostgreSQL stored function <code className="bg-slate-100 text-purple-700 px-1.5 py-0.5 rounded font-mono text-xs">register_for_event(p_event_id, p_student_id, p_code)</code>.
        </p>

        <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto space-y-1">
          <div className="text-slate-400">-- Atomic Row Locking in PostgreSQL:</div>
          <div>SELECT id, capacity, registered_count, status FROM events WHERE id = p_event_id FOR UPDATE;</div>
          <div className="text-emerald-400">IF registered_count &gt;= capacity THEN RAISE EXCEPTION 'Event capacity full';</div>
        </div>
      </section>

      {/* RBAC Matrix */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Role-Based Access Control (RBAC)
            </h2>
            <p className="text-xs text-slate-500">
              Strictly partitioned authorization between Students, Organizers, Faculty, and Admins
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Permission / Capability</th>
                <th className="p-3 text-center">Student</th>
                <th className="p-3 text-center">Organizer</th>
                <th className="p-3 text-center">Faculty</th>
                <th className="p-3 text-center">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rbacMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/70">
                  <td className="p-3 font-medium text-slate-900">{row.feature}</td>
                  <td className="p-3 text-center">
                    {row.student ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="p-3 text-center">
                    {row.organizer ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="p-3 text-center">
                    {row.faculty ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="p-3 text-center">
                    {row.admin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech Stack Summary */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-4 text-xs text-slate-600">
        <h3 className="font-bold text-slate-900 text-sm">Technology Stack & Libraries</h3>
        <p className="leading-relaxed">
          Built using <strong>React 19</strong>, <strong>TypeScript</strong>, <strong>Tailwind CSS</strong>, <strong>React Router</strong>, <strong>Lucide React</strong>, <strong>Recharts</strong>, <strong>Zod</strong>, <strong>Supabase PostgreSQL</strong>, and <strong>Canvas Confetti</strong>.
        </p>
      </section>
    </div>
  );
};
