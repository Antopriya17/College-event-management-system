export type UserRole = 'student' | 'organizer' | 'faculty' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  student_id?: string;
  department_id?: string;
  department_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface Club {
  id: string;
  name: string;
  code: string;
  description: string;
  department_id?: string;
  department_name?: string;
  lead_name?: string;
  avatar_url?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export type EventStatus = 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected' | 'completed' | 'cancelled';

export interface CollegeEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string;
  category_name?: string;
  department_id: string;
  department_name?: string;
  club_id?: string;
  club_name?: string;
  organizer_id: string;
  organizer_name?: string;
  organizer_email?: string;
  poster_url: string;
  venue: string;
  start_at: string; // ISO date
  end_at: string;   // ISO date
  registration_deadline: string; // ISO date
  capacity: number;
  registered_count: number;
  eligibility: string;
  status: EventStatus;
  tags: string[];
  schedule?: { time: string; activity: string }[];
  rules?: string[];
  contact_info?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export type RegistrationStatus = 'confirmed' | 'waitlisted' | 'cancelled' | 'attended';

export interface Registration {
  id: string;
  event_id: string;
  event_title?: string;
  event_poster?: string;
  event_start_at?: string;
  event_venue?: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  student_college_id?: string;
  student_dept?: string;
  registration_code: string; // unique code like CC-TECH-7892
  registration_status: RegistrationStatus;
  registered_at: string;
  cancelled_at?: string;
}

export interface AttendanceRecord {
  id: string;
  registration_id: string;
  event_id: string;
  student_id: string;
  student_name?: string;
  registration_code: string;
  checked_in_by: string; // organizer or faculty id
  checked_in_by_name?: string;
  checked_in_at: string;
  attendance_status: 'present' | 'absent';
}

export interface Certificate {
  id: string;
  registration_id: string;
  event_id: string;
  event_title: string;
  event_date: string;
  student_id: string;
  student_name: string;
  student_dept?: string;
  certificate_number: string; // CC-CERT-2026-XXXX
  file_path?: string;
  issued_at: string;
  organizer_name?: string;
  authority_title?: string;
}

export interface Announcement {
  id: string;
  event_id: string;
  event_title?: string;
  organizer_id: string;
  organizer_name: string;
  title: string;
  message: string;
  created_at: string;
}

export type NotificationType = 'registration' | 'approval' | 'rejection' | 'announcement' | 'reminder' | 'certificate' | 'attendance';

export interface InAppNotification {
  id: string;
  recipient_id: string;
  event_id?: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  read_at?: string | null;
  created_at: string;
  link?: string;
}

export interface EventApproval {
  id: string;
  event_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_role: 'faculty' | 'admin';
  decision: 'approved' | 'rejected';
  comments: string;
  reviewed_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  entity_type: 'event' | 'user' | 'registration' | 'approval' | 'attendance' | 'category' | 'department';
  entity_id: string;
  details?: string;
  created_at: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalStudents: number;
  totalOrganizers: number;
  totalFaculty: number;
  totalEvents: number;
  publishedEvents: number;
  pendingApprovals: number;
  completedEvents: number;
  totalRegistrations: number;
  attendanceRate: number;
  certificatesIssued: number;
}
