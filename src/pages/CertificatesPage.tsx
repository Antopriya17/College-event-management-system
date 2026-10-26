import React, { useState } from 'react';
import { Award, ShieldCheck, Download, Search, CheckCircle, ExternalLink } from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { CertificateModal } from '../components/certificates/CertificateModal';
import { Certificate } from '../types';

export const CertificatesPage: React.FC = () => {
  const { certificates, currentUser } = useCampus();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // If student, display own certificates. If admin/faculty, show all with filter.
  const isPrivileged = currentUser.role === 'admin' || currentUser.role === 'faculty';
  const displayCertificates = isPrivileged
    ? certificates
    : certificates.filter(c => c.student_id === currentUser.id);

  const filteredCerts = displayCertificates.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.certificate_number.toLowerCase().includes(q) ||
      c.event_title.toLowerCase().includes(q) ||
      c.student_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Verified Digital Credentials & Certificates
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/30 text-amber-200 uppercase">
              Academic Registry
            </span>
          </div>
          <p className="text-xs text-amber-100 mt-1">
            Official cryptographic records generated automatically upon verified QR check-in by event conveners.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{displayCertificates.length} Total Issued Credentials</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by certificate ID (e.g. CC-CERT-2026), student name, or event title..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 text-xs sm:text-sm bg-transparent focus:outline-hidden"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredCerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500 max-w-md mx-auto space-y-3">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No certificates found</h3>
          <p className="leading-relaxed">
            Attend college events and verify your entry with the organizer using your registration code to receive certified credentials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {cert.certificate_number}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                    {cert.event_title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Conferred on <strong className="text-slate-700">{cert.student_name}</strong>
                  </p>
                  {cert.student_dept && (
                    <p className="text-[11px] text-slate-400">
                      Dept of {cert.student_dept}
                    </p>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Issued Date:</span>
                    <strong>{cert.event_date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Authority:</span>
                    <span>{cert.authority_title || 'Dean of Affairs'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  View & Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};
