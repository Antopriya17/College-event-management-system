import React, { useState } from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Scan,
  UserCheck,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import confetti from 'canvas-confetti';

interface QRCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEventId?: string;
}

export const QRCheckInModal: React.FC<QRCheckInModalProps> = ({ isOpen, onClose, defaultEventId }) => {
  const { checkInAttendee, registrations, events, attendance } = useCampus();
  const [ticketCode, setTicketCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; studentName?: string; certNumber?: string } | null>(null);

  if (!isOpen) return null;

  const handleCheckInSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ticketCode.trim()) return;

    const res = checkInAttendee(ticketCode);
    if (res.success) {
      confetti({ particleCount: 50, spread: 60 });
      setResult({
        success: true,
        message: 'Attendee verified and marked present!',
        studentName: res.record?.student_name,
        certNumber: res.certificate?.certificate_number
      });
      setTicketCode('');
    } else {
      setResult({
        success: false,
        message: res.error || 'Check-in failed.'
      });
    }
  };

  // Find sample ticket codes from confirmed registrations for quick testing
  const sampleRegistrations = registrations
    .filter(r => r.registration_status === 'confirmed')
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Event Attendance Check-in
              </h3>
              <p className="text-xs text-slate-500">
                Scan attendee QR code or enter registration ticket ID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="p-6 space-y-5">
          <div className="relative w-full aspect-video sm:aspect-21/9 bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800 text-center p-4">
            {/* Scanner frame */}
            <div className="w-40 h-28 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center relative">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></div>
              <Scan className="w-8 h-8 text-emerald-400/80 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              [ CAMERA VIEW OPTICAL SCANNER ACTIVE ]
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCheckInSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Enter Registration Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. CC-TECH-4829"
                  value={ticketCode}
                  onChange={e => setTicketCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3.5 py-2.5 text-sm font-mono uppercase bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!ticketCode.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  Verify
                </button>
              </div>
            </div>
          </form>

          {/* Result Alert */}
          {result && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                result.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {result.success ? 'Attendance Verified!' : 'Check-In Error'}
                  </h4>
                  <p className="mt-0.5">{result.message}</p>
                  {result.studentName && (
                    <div className="mt-2 font-medium">
                      Student: <strong>{result.studentName}</strong>
                    </div>
                  )}
                  {result.certNumber && (
                    <div className="mt-1 flex items-center gap-1 text-emerald-700 font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      Certificate #{result.certNumber} Generated!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Test Codes */}
          {sampleRegistrations.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Click a sample ticket to test instant check-in:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleRegistrations.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setTicketCode(r.registration_code);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{r.registration_code}</span>
                    <span className="text-[10px] text-slate-500 font-sans">
                      ({r.student_name?.split(' ')[0]})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Total check-ins recorded: {attendance.length}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
