import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Profile,
  CollegeEvent,
  Registration,
  AttendanceRecord,
  Certificate,
  Announcement,
  InAppNotification,
  AuditLog,
  Department,
  Club,
  EventCategory,
  UserRole
} from '../types';
import { campusStore } from '../services/store';
import { isConfigured } from '../services/supabase';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface CampusContextType {
  currentUser: Profile;
  switchUser: (id: string) => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  isCloudConnected: boolean;
  
  // Data
  events: CollegeEvent[];
  departments: Department[];
  clubs: Club[];
  categories: EventCategory[];
  registrations: Registration[];
  attendance: AttendanceRecord[];
  certificates: Certificate[];
  announcements: Announcement[];
  notifications: InAppNotification[];
  auditLogs: AuditLog[];
  unreadNotifsCount: number;

  // Actions
  registerForEvent: (eventId: string) => { success: boolean; error?: string; registration?: Registration };
  cancelRegistration: (registrationId: string) => { success: boolean; error?: string };
  checkInAttendee: (code: string) => { success: boolean; error?: string; record?: AttendanceRecord; certificate?: Certificate };
  createEventProposal: (data: any) => CollegeEvent;
  reviewEvent: (eventId: string, decision: 'approved' | 'rejected', comments: string) => CollegeEvent;
  updateEvent: (eventId: string, updates: Partial<CollegeEvent>) => CollegeEvent;
  cancelEvent: (eventId: string, reason: string) => CollegeEvent;
  postAnnouncement: (eventId: string, title: string, message: string) => Announcement;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserRole: (profileId: string, newRole: UserRole) => Profile;
  resetToDefaultSeed: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Cloud modal
  isCloudModalOpen: boolean;
  setIsCloudModalOpen: (open: boolean) => void;
}

const CampusContext = createContext<CampusContextType | null>(null);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, setTick] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = campusStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentUser = campusStore.getCurrentUser();
  const events = campusStore.getEvents();
  const departments = campusStore.getDepartments();
  const clubs = campusStore.getClubs();
  const categories = campusStore.getCategories();
  const registrations = campusStore.getRegistrations();
  const attendance = campusStore.getAttendance();
  const certificates = campusStore.getCertificates();
  const announcements = campusStore.getAnnouncements();
  const notifications = campusStore.getNotifications(currentUser.id);
  const auditLogs = campusStore.getAuditLogs();

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter(n => !n.read_at).length;
  }, [notifications]);

  const isCloudConnected = isConfigured();

  const handleRegister = (eventId: string) => {
    const res = campusStore.registerStudentForEvent(eventId, currentUser.id);
    if (res.success) {
      showToast('Registration successful! Check your ticket code and details.', 'success');
    } else {
      showToast(res.error || 'Registration failed.', 'error');
    }
    return res;
  };

  const handleCancelRegistration = (regId: string) => {
    const res = campusStore.cancelRegistration(regId, currentUser.id);
    if (res.success) {
      showToast('Registration has been cancelled.', 'info');
    } else {
      showToast(res.error || 'Failed to cancel.', 'error');
    }
    return res;
  };

  const handleCheckIn = (code: string) => {
    const res = campusStore.checkInAttendee(code);
    if (res.success) {
      showToast(`Success! Attendee verified and Certificate #${res.certificate?.certificate_number} generated!`, 'success');
    } else {
      showToast(res.error || 'Check-in failed.', 'error');
    }
    return res;
  };

  return (
    <CampusContext.Provider
      value={{
        currentUser,
        switchUser: (id) => {
          const u = campusStore.switchUser(id);
          showToast(`Switched account to ${u.full_name} (${u.role.toUpperCase()})`, 'info');
        },
        switchRole: (role) => {
          const u = campusStore.switchRole(role);
          showToast(`Switched active view to ${role.toUpperCase()} mode`, 'info');
        },
        updateProfile: (updates) => {
          campusStore.updateProfile(currentUser.id, updates);
          showToast('Profile updated successfully', 'success');
        },
        isCloudConnected,
        events,
        departments,
        clubs,
        categories,
        registrations,
        attendance,
        certificates,
        announcements,
        notifications,
        auditLogs,
        unreadNotifsCount,

        registerForEvent: handleRegister,
        cancelRegistration: handleCancelRegistration,
        checkInAttendee: handleCheckIn,
        createEventProposal: (data) => {
          const evt = campusStore.createEventProposal(data);
          showToast('Event proposal submitted for faculty review!', 'success');
          return evt;
        },
        reviewEvent: (eventId, decision, comments) => {
          const evt = campusStore.reviewEvent(eventId, decision, comments);
          showToast(`Event proposal ${decision}!`, decision === 'approved' ? 'success' : 'info');
          return evt;
        },
        updateEvent: (eventId, updates) => {
          const evt = campusStore.updateEvent(eventId, updates);
          showToast('Event updated successfully.', 'success');
          return evt;
        },
        cancelEvent: (eventId, reason) => {
          const evt = campusStore.cancelEvent(eventId, reason);
          showToast('Event cancelled. Registered students have been notified.', 'info');
          return evt;
        },
        postAnnouncement: (eventId, title, message) => {
          const a = campusStore.postAnnouncement(eventId, title, message);
          showToast('Announcement broadcasted to all registered students!', 'success');
          return a;
        },
        markNotificationAsRead: (id) => campusStore.markNotificationAsRead(id),
        markAllNotificationsAsRead: () => {
          campusStore.markAllNotificationsAsRead(currentUser.id);
          showToast('All notifications marked as read', 'info');
        },
        updateUserRole: (profileId, role) => {
          const p = campusStore.updateUserRole(profileId, role);
          showToast(`User ${p.full_name} is now ${role}`, 'success');
          return p;
        },
        resetToDefaultSeed: () => {
          campusStore.resetToDefaultSeed();
          showToast('Database reset to clean demo seed state.', 'info');
        },

        toasts,
        showToast,
        removeToast,
        isCloudModalOpen,
        setIsCloudModalOpen
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-700/50'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-100 border-rose-700/50'
                : 'bg-slate-900/95 text-slate-100 border-slate-700/50'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-60 hover:opacity-100 cursor-pointer ml-2 p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
