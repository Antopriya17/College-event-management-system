import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Award,
  Megaphone,
  FileCheck2,
  Clock,
  Filter,
  Check
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { NotificationType } from '../types';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useCampus();

  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read_at;
    return n.notification_type === filterType;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'registration':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'certificate':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-blue-600" />;
      case 'approval':
        return <FileCheck2 className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Activity Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            In-App Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding registrations, approvals, schedules, and certificate issuance
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <Check className="w-4 h-4 text-slate-500" />
          Mark All Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Messages' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'registration', label: 'Registrations' },
          { id: 'certificate', label: 'Certificates' },
          { id: 'announcement', label: 'Announcements' },
          { id: 'approval', label: 'Approvals' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
              filterType === tab.id
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No notifications found in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.link) navigate(n.link);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read_at
                  ? 'bg-blue-50/40 border-blue-200 hover:bg-blue-50/70 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                {getIcon(n.notification_type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(n.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {n.message}
                </p>
                {n.link && (
                  <span className="text-[11px] font-semibold text-blue-600 hover:underline inline-block pt-1">
                    Open Event Details →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
