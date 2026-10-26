import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Database, Server, Code, FileText } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const Footer: React.FC = () => {
  const { setIsCloudModalOpen } = useCampus();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                CampusConnect
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cloud-Based College Event Management System designed for digital university life. Discover technical symposiums, hackathons, sports meets, and cultural festivals.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Academic Year 2026–2027
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Explore Events Directory
                </Link>
              </li>
              <li>
                <Link to="/student" className="hover:text-white transition-colors">
                  Student Portal & Passes
                </Link>
              </li>
              <li>
                <Link to="/organizer" className="hover:text-white transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="hover:text-white transition-colors">
                  Faculty Approvals
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin System Console
                </Link>
              </li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Cloud Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>PostgreSQL Relational DB</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Row Level Security (RLS)</span>
              </li>
              <li className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-purple-400" />
                <span>Atomic Concurrency Functions</span>
              </li>
              <li className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>React 19 & TypeScript</span>
              </li>
            </ul>
          </div>

          {/* Academic Project Credits */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Academic Project
            </h4>
            <p className="text-xs text-slate-400">
              Department of Computer Science & Engineering. Designed as a capstone enterprise web platform.
            </p>
            <button
              onClick={() => setIsCloudModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              View Database Schema & SQL
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 CampusConnect. College Event Management Academic System.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white">Architecture & Schema</Link>
            <Link to="/events" className="hover:text-white">Public Catalog</Link>
            <span className="text-slate-500">Demo Seed Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
