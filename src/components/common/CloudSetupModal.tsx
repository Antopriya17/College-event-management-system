import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  Layers
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection
} from '../../services/supabase';

export const CloudSetupModal: React.FC = () => {
  const { isCloudModalOpen, setIsCloudModalOpen, showToast, resetToDefaultSeed } = useCampus();

  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'credentials'>('status');
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseCredentials().url);
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseCredentials().anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isCloudModalOpen) return null;

  const handleTest = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setTestResult({ success: false, message: 'Please enter both Supabase URL and Anon Key.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    if (!supabaseUrl || !supabaseKey) {
      showToast('Please provide both URL and Anon Key.', 'error');
      return;
    }
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    showToast('Supabase credentials saved! Platform reloaded.', 'success');
    window.location.reload();
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseKey('');
    showToast('Disconnected from cloud. Switched to local storage engine.', 'info');
    window.location.reload();
  };

  const sqlSample = `-- CAMPUSCONNECT POSTGRESQL SCHEMA SUMMARY
-- Full script available in /supabase/schema.sql

-- 1. Tables: profiles, departments, clubs, event_categories, events, registrations, attendance, certificates, announcements, notifications, event_approvals, audit_logs.
-- 2. Concurrency-safe Registration Function:
CREATE OR REPLACE FUNCTION register_for_event(
    p_event_id VARCHAR(64),
    p_student_id UUID,
    p_registration_code VARCHAR(64)
) RETURNS JSONB ... FOR UPDATE ...

-- 3. Row Level Security:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Run /supabase/schema.sql in your Supabase SQL Editor to execute the full schema.`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopied(true);
    showToast('SQL schema summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const creds = getSupabaseCredentials();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Cloud Database & Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Supabase PostgreSQL, Row Level Security & Demo State
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCloudModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Connection Status
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'credentials'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Supabase Credentials
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sql'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            PostgreSQL Schema (SQL)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  creds.isConfigured
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {creds.isConfigured ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {creds.isConfigured
                      ? 'Connected to Supabase PostgreSQL Cloud'
                      : 'Running in Local Storage & Demo Relational Engine'}
                  </h4>
                  <p className="text-xs mt-1 opacity-90 leading-relaxed">
                    {creds.isConfigured
                      ? `Active Endpoint: ${creds.url}`
                      : 'All tables, relational foreign keys, capacity constraints, QR check-ins, notifications, and certificates are fully active and persisted locally in your browser so you can test all workflows seamlessly.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold mb-1">
                    <Server className="w-4 h-4 text-blue-600" />
                    Storage Engine
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {creds.isConfigured ? 'Supabase Cloud' : 'IndexedDB / Storage'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Persisted across refreshes</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Security (RLS)
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Enforced by Role
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Student, Organizer, Faculty, Admin</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold mb-1">
                    <Layers className="w-4 h-4 text-purple-600" />
                    Capacity Check
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Atomic Locks
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Zero race-condition overbooking</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Need to start fresh with clean sample events and registrations?
                </div>
                <button
                  onClick={() => {
                    resetToDefaultSeed();
                    setIsCloudModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  Reset Seed Data
                </button>
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your live Supabase project to sync events, registrations, certificates, and profiles directly to your remote PostgreSQL database.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supabase Public Anon Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {testResult.message}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save & Connect
                </button>

                {creds.isConfigured && (
                  <button
                    onClick={handleDisconnect}
                    className="ml-auto px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Full production SQL migration script is located at <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">/supabase/schema.sql</code>.
                </p>
                <button
                  onClick={copySql}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy Summary'}
                </button>
              </div>

              <div className="relative">
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-64 leading-relaxed">
                  {sqlSample}
                </pre>
              </div>
              <p className="text-[11px] text-slate-500">
                Includes PostgreSQL schemas for: profiles, events, registrations, attendance, certificates, announcements, notifications, audit logs, and row-level security policies.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            CampusConnect Cloud Core • College Event Management System
          </span>
          <button
            onClick={() => setIsCloudModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
