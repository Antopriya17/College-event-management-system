import React, { useRef } from 'react';
import { X, Download, Printer, ShieldCheck, Award, GraduationCap, CheckCircle } from 'lucide-react';
import { Certificate } from '../../types';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    // In browser, trigger window print styled for certificate landscape or download
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Verified Certificate of Participation
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Render Area */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-100/50 flex justify-center">
          <div
            ref={certRef}
            className="w-full max-w-3xl bg-white border-8 border-slate-900 p-8 sm:p-12 rounded-xl shadow-lg relative text-center select-none"
            style={{
              backgroundImage: 'radial-gradient(#e2e8f0 0.75px, transparent 0.75px)',
              backgroundSize: '16px 16px'
            }}
          >
            {/* Inner Border */}
            <div className="border-2 border-amber-500/60 p-6 sm:p-8 rounded-lg relative">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-500 font-serif text-lg">✦</div>
              <div className="absolute top-2 right-2 text-amber-500 font-serif text-lg">✦</div>
              <div className="absolute bottom-2 left-2 text-amber-500 font-serif text-lg">✦</div>
              <div className="absolute bottom-2 right-2 text-amber-500 font-serif text-lg">✦</div>

              {/* Institution Seal / Header */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-amber-400 mb-2 shadow-sm">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-600">
                  CampusConnect Academic Event Council
                </h4>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-0.5">
                  Autonomous Directorate of Student Development
                </p>
              </div>

              {/* Certificate Title */}
              <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-wide uppercase mb-3">
                Certificate of Participation
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 italic max-w-md mx-auto mb-6">
                This credential certifies that the undersigned has successfully attended and actively participated in the collegiate technical/cultural program.
              </p>

              {/* Recipient */}
              <div className="my-6">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                  Proudly Presented To
                </p>
                <h2 className="text-xl sm:text-3xl font-bold text-blue-900 border-b-2 border-slate-300 pb-2 inline-block px-8 tracking-tight font-serif">
                  {certificate.student_name}
                </h2>
                {certificate.student_dept && (
                  <p className="text-xs font-semibold text-slate-600 mt-2">
                    Department of {certificate.student_dept}
                  </p>
                )}
              </div>

              {/* Event Name */}
              <div className="my-6">
                <p className="text-xs text-slate-500">for successful completion of</p>
                <h3 className="text-base sm:text-xl font-bold text-slate-900 mt-1 max-w-xl mx-auto">
                  {certificate.event_title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Conducted on {certificate.event_date}
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-3 items-center gap-4 text-center">
                {/* Signatory 1 */}
                <div>
                  <div className="font-serif italic text-base text-slate-800 -mb-1">
                    {certificate.organizer_name || 'Alex Chen'}
                  </div>
                  <div className="w-32 border-b border-slate-400 mx-auto my-1"></div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Program Convener
                  </p>
                </div>

                {/* Verified Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-600 bg-amber-50 flex items-center justify-center text-amber-700 shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider mt-1">
                    Digitally Verified
                  </span>
                </div>

                {/* Signatory 2 */}
                <div>
                  <div className="font-serif italic text-base text-slate-800 -mb-1">
                    {certificate.authority_title || 'Dr. Robert Taylor'}
                  </div>
                  <div className="w-32 border-b border-slate-400 mx-auto my-1"></div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Dean of Academic Affairs
                  </p>
                </div>
              </div>

              {/* Certificate ID footer */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-1">
                <span>Certificate ID: <strong className="font-mono text-slate-700">{certificate.certificate_number}</strong></span>
                <span>Issued: {new Date(certificate.issued_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle className="w-3 h-3" /> Blockchain Record Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
