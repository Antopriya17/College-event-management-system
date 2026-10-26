import {
  Profile,
  Department,
  Club,
  EventCategory,
  CollegeEvent,
  Registration,
  AttendanceRecord,
  Certificate,
  Announcement,
  InAppNotification,
  AuditLog,
  UserRole,
  EventStatus
} from '../types';
import {
  SEED_DEPARTMENTS,
  SEED_CLUBS,
  SEED_CATEGORIES,
  SEED_PROFILES,
  SEED_EVENTS,
  SEED_REGISTRATIONS,
  SEED_ATTENDANCE,
  SEED_CERTIFICATES,
  SEED_ANNOUNCEMENTS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS
} from '../data/seedData';
import { getSupabaseClient, isConfigured as checkSupabaseConfigured } from './supabase';

const STORE_VERSION = 'campusconnect_v1_store';

interface StoreState {
  departments: Department[];
  clubs: Club[];
  categories: EventCategory[];
  profiles: Profile[];
  events: CollegeEvent[];
  registrations: Registration[];
  attendance: AttendanceRecord[];
  certificates: Certificate[];
  announcements: Announcement[];
  notifications: InAppNotification[];
  auditLogs: AuditLog[];
  currentUserId: string;
}

type Listener = () => void;

class CampusStore {
  private state: StoreState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): StoreState {
    try {
      const stored = localStorage.getItem(STORE_VERSION);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored CampusConnect data, resetting to seed', e);
    }

    const defaultState: StoreState = {
      departments: SEED_DEPARTMENTS,
      clubs: SEED_CLUBS,
      categories: SEED_CATEGORIES,
      profiles: SEED_PROFILES,
      events: SEED_EVENTS,
      registrations: SEED_REGISTRATIONS,
      attendance: SEED_ATTENDANCE,
      certificates: SEED_CERTIFICATES,
      announcements: SEED_ANNOUNCEMENTS,
      notifications: SEED_NOTIFICATIONS,
      auditLogs: SEED_AUDIT_LOGS,
      currentUserId: 'user-student-1' // Default demo user: Priya Sharma (Student)
    };

    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: StoreState) {
    try {
      localStorage.setItem(STORE_VERSION, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to persist CampusConnect state', err);
    }
  }

  private notify() {
    this.saveState(this.state);
    this.listeners.forEach(fn => fn());
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public resetToDefaultSeed() {
    localStorage.removeItem(STORE_VERSION);
    this.state = this.loadInitialState();
    this.notify();
  }

  // --- Auth / User Session ---
  public getCurrentUser(): Profile {
    const user = this.state.profiles.find(p => p.id === this.state.currentUserId);
    if (!user) {
      return this.state.profiles[0];
    }
    return user;
  }

  public switchUser(userId: string): Profile {
    const user = this.state.profiles.find(p => p.id === userId);
    if (user) {
      this.state.currentUserId = user.id;
      this.notify();
      return user;
    }
    return this.getCurrentUser();
  }

  public switchRole(role: UserRole): Profile {
    const match = this.state.profiles.find(p => p.role === role);
    if (match) {
      return this.switchUser(match.id);
    }
    return this.getCurrentUser();
  }

  public updateProfile(id: string, updates: Partial<Profile>): Profile {
    this.state.profiles = this.state.profiles.map(p => {
      if (p.id === id) {
        return { ...p, ...updates, updated_at: new Date().toISOString() };
      }
      return p;
    });
    this.logAudit(id, 'UPDATE_PROFILE', 'user', id, 'Updated personal profile details');
    this.notify();
    return this.getCurrentUser();
  }

  public registerNewUser(data: {
    email: string;
    full_name: string;
    role: UserRole;
    student_id?: string;
    department_id?: string;
  }): Profile {
    const dept = this.state.departments.find(d => d.id === data.department_id);
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      student_id: data.student_id,
      department_id: data.department_id,
      department_name: dept ? dept.name : undefined,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.full_name)}&backgroundColor=1e3a8a`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.state.profiles.push(newProfile);
    this.state.currentUserId = newProfile.id;
    this.logAudit(newProfile.id, 'REGISTER_USER', 'user', newProfile.id, `User signed up as ${data.role}`);
    this.notify();
    return newProfile;
  }

  // --- Departments, Clubs & Categories ---
  public getDepartments(): Department[] {
    return this.state.departments;
  }

  public getClubs(): Club[] {
    return this.state.clubs;
  }

  public getCategories(): EventCategory[] {
    return this.state.categories;
  }

  public addCategory(cat: Omit<EventCategory, 'id'>): EventCategory {
    const newCat: EventCategory = {
      id: `cat-${Date.now()}`,
      ...cat
    };
    this.state.categories.push(newCat);
    this.logAudit(this.state.currentUserId, 'CREATE_CATEGORY', 'category', newCat.id, `Added category ${cat.name}`);
    this.notify();
    return newCat;
  }

  public addDepartment(dept: Omit<Department, 'id'>): Department {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      ...dept
    };
    this.state.departments.push(newDept);
    this.logAudit(this.state.currentUserId, 'CREATE_DEPARTMENT', 'department', newDept.id, `Added department ${dept.name}`);
    this.notify();
    return newDept;
  }

  // --- Events ---
  public getEvents(): CollegeEvent[] {
    return this.state.events;
  }

  public getEventById(id: string): CollegeEvent | undefined {
    return this.state.events.find(e => e.id === id);
  }

  public createEventProposal(eventData: Omit<CollegeEvent, 'id' | 'slug' | 'registered_count' | 'created_at' | 'updated_at'>): CollegeEvent {
    const user = this.getCurrentUser();
    const slug = eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newEvent: CollegeEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
      organizer_id: user.id,
      organizer_name: user.full_name,
      organizer_email: user.email,
      registered_count: 0,
      status: 'pending_approval',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.state.events.unshift(newEvent);

    // Notify faculty & admins of pending review
    const facultyAndAdmins = this.state.profiles.filter(p => p.role === 'faculty' || p.role === 'admin');
    facultyAndAdmins.forEach(p => {
      this.createNotification({
        recipient_id: p.id,
        event_id: newEvent.id,
        title: 'New Event Approval Request',
        message: `${user.full_name} submitted "${newEvent.title}" for review.`,
        notification_type: 'approval',
        link: p.role === 'faculty' ? '/faculty' : '/admin'
      });
    });

    this.logAudit(user.id, 'CREATE_EVENT_PROPOSAL', 'event', newEvent.id, `Submitted event "${newEvent.title}"`);
    this.notify();
    return newEvent;
  }

  public reviewEvent(eventId: string, decision: 'approved' | 'rejected', comments: string): CollegeEvent {
    const reviewer = this.getCurrentUser();
    const event = this.state.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');

    const newStatus: EventStatus = decision === 'approved' ? 'published' : 'rejected';
    event.status = newStatus;
    if (decision === 'rejected') {
      event.rejection_reason = comments;
    }
    event.updated_at = new Date().toISOString();

    // Notify Organizer
    this.createNotification({
      recipient_id: event.organizer_id,
      event_id: event.id,
      title: decision === 'approved' ? 'Event Approved & Published' : 'Event Proposal Rejected',
      message: `Your event "${event.title}" was ${decision} by ${reviewer.full_name}. ${comments ? `Note: ${comments}` : ''}`,
      notification_type: decision === 'approved' ? 'approval' : 'rejection',
      link: `/events/${event.id}`
    });

    this.logAudit(reviewer.id, decision === 'approved' ? 'APPROVE_EVENT' : 'REJECT_EVENT', 'event', event.id, comments);
    this.notify();
    return event;
  }

  public updateEvent(eventId: string, updates: Partial<CollegeEvent>): CollegeEvent {
    const user = this.getCurrentUser();
    const event = this.state.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');

    Object.assign(event, updates, { updated_at: new Date().toISOString() });
    this.logAudit(user.id, 'UPDATE_EVENT', 'event', event.id, 'Updated event details');
    this.notify();
    return event;
  }

  public cancelEvent(eventId: string, reason: string): CollegeEvent {
    const user = this.getCurrentUser();
    const event = this.state.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');

    event.status = 'cancelled';
    event.updated_at = new Date().toISOString();

    // Notify registered participants
    const regs = this.state.registrations.filter(r => r.event_id === eventId && r.registration_status === 'confirmed');
    regs.forEach(r => {
      this.createNotification({
        recipient_id: r.student_id,
        event_id: event.id,
        title: 'Event Cancelled',
        message: `"${event.title}" has unfortunately been cancelled. Reason: ${reason}`,
        notification_type: 'reminder',
        link: `/events/${event.id}`
      });
    });

    this.logAudit(user.id, 'CANCEL_EVENT', 'event', event.id, reason);
    this.notify();
    return event;
  }

  // --- Registrations (Concurrency & Capacity Safe) ---
  public getRegistrations(): Registration[] {
    return this.state.registrations;
  }

  public registerStudentForEvent(eventId: string, studentId: string): { success: boolean; error?: string; registration?: Registration } {
    const event = this.state.events.find(e => e.id === eventId);
    const student = this.state.profiles.find(p => p.id === studentId);

    if (!event) {
      return { success: false, error: 'Event not found.' };
    }
    if (!student) {
      return { success: false, error: 'Student profile not found.' };
    }
    if (event.status !== 'published') {
      return { success: false, error: 'Event is not open for registration.' };
    }

    const now = new Date();
    if (new Date(event.registration_deadline) < now) {
      return { success: false, error: 'Registration deadline has passed.' };
    }

    // Capacity check
    if (event.registered_count >= event.capacity) {
      return { success: false, error: 'Event capacity has been reached. No seats available.' };
    }

    // Check duplicate registration
    const existing = this.state.registrations.find(
      r => r.event_id === eventId && r.student_id === studentId && r.registration_status !== 'cancelled'
    );
    if (existing) {
      return { success: false, error: 'You are already registered for this event.' };
    }

    // Atomically increment registered count
    event.registered_count += 1;
    event.updated_at = new Date().toISOString();

    const categoryPrefix = event.category_name ? event.category_name.substring(0, 4).toUpperCase() : 'CAMP';
    const regCode = `CC-${categoryPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      event_id: event.id,
      event_title: event.title,
      event_poster: event.poster_url,
      event_start_at: event.start_at,
      event_venue: event.venue,
      student_id: student.id,
      student_name: student.full_name,
      student_email: student.email,
      student_college_id: student.student_id,
      student_dept: student.department_name,
      registration_code: regCode,
      registration_status: 'confirmed',
      registered_at: new Date().toISOString()
    };

    this.state.registrations.unshift(newRegistration);

    // Create In-App Notification
    this.createNotification({
      recipient_id: student.id,
      event_id: event.id,
      title: 'Registration Confirmed!',
      message: `Your seat for "${event.title}" is confirmed. Your check-in code is ${regCode}.`,
      notification_type: 'registration',
      link: `/events/${event.id}`
    });

    this.logAudit(student.id, 'REGISTER_FOR_EVENT', 'registration', newRegistration.id, `Registered for ${event.title}`);
    this.notify();

    return { success: true, registration: newRegistration };
  }

  public cancelRegistration(registrationId: string, studentId: string): { success: boolean; error?: string } {
    const reg = this.state.registrations.find(r => r.id === registrationId && r.student_id === studentId);
    if (!reg) {
      return { success: false, error: 'Registration record not found.' };
    }

    if (reg.registration_status === 'cancelled') {
      return { success: false, error: 'Registration is already cancelled.' };
    }

    if (reg.registration_status === 'attended') {
      return { success: false, error: 'Cannot cancel an event you have already attended.' };
    }

    const event = this.state.events.find(e => e.id === reg.event_id);
    if (event) {
      event.registered_count = Math.max(0, event.registered_count - 1);
      event.updated_at = new Date().toISOString();
    }

    reg.registration_status = 'cancelled';
    reg.cancelled_at = new Date().toISOString();

    this.createNotification({
      recipient_id: studentId,
      event_id: reg.event_id,
      title: 'Registration Cancelled',
      message: `Your registration for "${reg.event_title}" has been cancelled.`,
      notification_type: 'reminder',
      link: `/events/${reg.event_id}`
    });

    this.logAudit(studentId, 'CANCEL_REGISTRATION', 'registration', reg.id, `Cancelled seat for ${reg.event_title}`);
    this.notify();
    return { success: true };
  }

  // --- Attendance & Check-In ---
  public getAttendance(): AttendanceRecord[] {
    return this.state.attendance;
  }

  public checkInAttendee(registrationCode: string): { success: boolean; error?: string; record?: AttendanceRecord; certificate?: Certificate } {
    const checker = this.getCurrentUser();
    const cleanCode = registrationCode.trim().toUpperCase();

    const registration = this.state.registrations.find(
      r => r.registration_code.toUpperCase() === cleanCode && r.registration_status !== 'cancelled'
    );

    if (!registration) {
      return { success: false, error: `Invalid ticket code "${registrationCode}". No active registration found.` };
    }

    // Check if already checked in
    const existing = this.state.attendance.find(a => a.registration_id === registration.id);
    if (existing) {
      return {
        success: false,
        error: `Participant ${registration.student_name} was already checked in at ${new Date(existing.checked_in_at).toLocaleTimeString()}.`
      };
    }

    // Record attendance
    const attendanceRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      registration_id: registration.id,
      event_id: registration.event_id,
      student_id: registration.student_id,
      student_name: registration.student_name,
      registration_code: registration.registration_code,
      checked_in_by: checker.id,
      checked_in_by_name: checker.full_name,
      checked_in_at: new Date().toISOString(),
      attendance_status: 'present'
    };

    this.state.attendance.unshift(attendanceRecord);
    registration.registration_status = 'attended';

    const event = this.state.events.find(e => e.id === registration.event_id);

    // Auto-generate official certificate
    const certNumber = `CC-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      registration_id: registration.id,
      event_id: registration.event_id,
      event_title: registration.event_title || (event?.title ?? 'Campus Event'),
      event_date: event ? new Date(event.start_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '2026',
      student_id: registration.student_id,
      student_name: registration.student_name || 'Student Attendee',
      student_dept: registration.student_dept || 'Engineering & Sciences',
      certificate_number: certNumber,
      issued_at: new Date().toISOString(),
      organizer_name: event?.organizer_name || checker.full_name,
      authority_title: 'Dean of Student Affairs'
    };

    this.state.certificates.unshift(newCert);

    // Notify student
    this.createNotification({
      recipient_id: registration.student_id,
      event_id: registration.event_id,
      title: 'Attendance Confirmed & Certificate Ready!',
      message: `You were marked present for ${newCert.event_title}. Your verified Certificate #${certNumber} is now ready to download.`,
      notification_type: 'certificate',
      link: '/certificates'
    });

    this.logAudit(checker.id, 'MARK_ATTENDANCE', 'attendance', attendanceRecord.id, `Checked in ${registration.student_name}`);
    this.notify();

    return { success: true, record: attendanceRecord, certificate: newCert };
  }

  // --- Certificates ---
  public getCertificates(): Certificate[] {
    return this.state.certificates;
  }

  public getCertificatesForUser(studentId: string): Certificate[] {
    return this.state.certificates.filter(c => c.student_id === studentId);
  }

  // --- Announcements ---
  public getAnnouncements(eventId?: string): Announcement[] {
    if (eventId) {
      return this.state.announcements.filter(a => a.event_id === eventId);
    }
    return this.state.announcements;
  }

  public postAnnouncement(eventId: string, title: string, message: string): Announcement {
    const user = this.getCurrentUser();
    const event = this.state.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');

    const newAnnouncement: Announcement = {
      id: `anc-${Date.now()}`,
      event_id: eventId,
      event_title: event.title,
      organizer_id: user.id,
      organizer_name: user.full_name,
      title,
      message,
      created_at: new Date().toISOString()
    };

    this.state.announcements.unshift(newAnnouncement);

    // Notify all registered students for this event
    const registeredStudents = this.state.registrations.filter(
      r => r.event_id === eventId && r.registration_status !== 'cancelled'
    );

    registeredStudents.forEach(r => {
      this.createNotification({
        recipient_id: r.student_id,
        event_id: eventId,
        title: `Announcement: ${title}`,
        message: `${event.title}: ${message}`,
        notification_type: 'announcement',
        link: `/events/${eventId}`
      });
    });

    this.logAudit(user.id, 'POST_ANNOUNCEMENT', 'event', eventId, title);
    this.notify();
    return newAnnouncement;
  }

  // --- Notifications ---
  public getNotifications(userId?: string): InAppNotification[] {
    const id = userId || this.state.currentUserId;
    return this.state.notifications.filter(n => n.recipient_id === id);
  }

  public createNotification(data: Omit<InAppNotification, 'id' | 'created_at'>): InAppNotification {
    const notif: InAppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      read_at: null,
      ...data
    };
    this.state.notifications.unshift(notif);
    this.notify();
    return notif;
  }

  public markNotificationAsRead(id: string) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif && !notif.read_at) {
      notif.read_at = new Date().toISOString();
      this.notify();
    }
  }

  public markAllNotificationsAsRead(userId?: string) {
    const id = userId || this.state.currentUserId;
    const now = new Date().toISOString();
    this.state.notifications.forEach(n => {
      if (n.recipient_id === id && !n.read_at) {
        n.read_at = now;
      }
    });
    this.notify();
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }

  public logAudit(actorId: string, action: string, entityType: AuditLog['entity_type'], entityId: string, details?: string) {
    const actor = this.state.profiles.find(p => p.id === actorId);
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: actorId,
      actor_name: actor ? actor.full_name : 'System User',
      actor_role: actor ? actor.role : 'student',
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString()
    };
    this.state.auditLogs.unshift(newLog);
  }

  // --- Platform Analytics (Real Calculated Data) ---
  public getPlatformStats() {
    const totalUsers = this.state.profiles.length;
    const totalStudents = this.state.profiles.filter(p => p.role === 'student').length;
    const totalOrganizers = this.state.profiles.filter(p => p.role === 'organizer').length;
    const totalFaculty = this.state.profiles.filter(p => p.role === 'faculty').length;

    const totalEvents = this.state.events.length;
    const publishedEvents = this.state.events.filter(e => e.status === 'published').length;
    const pendingApprovals = this.state.events.filter(e => e.status === 'pending_approval').length;
    const completedEvents = this.state.events.filter(e => e.status === 'completed').length;

    const activeRegistrations = this.state.registrations.filter(r => r.registration_status !== 'cancelled');
    const totalRegistrations = activeRegistrations.length;
    const totalAttended = this.state.attendance.length;
    const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0;
    const certificatesIssued = this.state.certificates.length;

    return {
      totalUsers,
      totalStudents,
      totalOrganizers,
      totalFaculty,
      totalEvents,
      publishedEvents,
      pendingApprovals,
      completedEvents,
      totalRegistrations,
      attendanceRate,
      certificatesIssued
    };
  }

  // All Profiles for Admin Management
  public getAllProfiles(): Profile[] {
    return this.state.profiles;
  }

  public updateUserRole(profileId: string, newRole: UserRole): Profile {
    const admin = this.getCurrentUser();
    const profile = this.state.profiles.find(p => p.id === profileId);
    if (!profile) throw new Error('Profile not found');

    profile.role = newRole;
    profile.updated_at = new Date().toISOString();

    this.logAudit(admin.id, 'CHANGE_USER_ROLE', 'user', profile.id, `Changed role of ${profile.full_name} to ${newRole}`);
    this.notify();
    return profile;
  }
}

export const campusStore = new CampusStore();
