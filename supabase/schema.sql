-- ============================================================================
-- CAMPUSCONNECT: CLOUD-BASED COLLEGE EVENT MANAGEMENT SYSTEM
-- COMPLETE POSTGRESQL RELATIONAL SCHEMA, RLS POLICIES, TRANSACTIONS & SEED DATA
-- Target Engine: PostgreSQL 15+ / Supabase PostgreSQL
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. DEPARTMENTS & CLUBS
-- ============================================================================

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clubs (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL UNIQUE,
    description TEXT,
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    lead_name VARCHAR(255),
    avatar_url TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. USER PROFILES & ROLES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'organizer', 'faculty', 'admin');

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    student_id VARCHAR(64),
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    phone VARCHAR(32),
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department_id);

-- ============================================================================
-- 3. EVENT CATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    slug VARCHAR(128) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(64) DEFAULT 'Calendar',
    color VARCHAR(64) DEFAULT 'from-blue-600 to-indigo-700',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. EVENTS TABLE
-- ============================================================================

CREATE TYPE event_status AS ENUM (
    'draft',
    'pending_approval',
    'approved',
    'published',
    'rejected',
    'completed',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    category_id VARCHAR(64) NOT NULL REFERENCES event_categories(id) ON DELETE RESTRICT,
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    club_id VARCHAR(64) REFERENCES clubs(id) ON DELETE SET NULL,
    organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    poster_url TEXT NOT NULL,
    venue VARCHAR(255) NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    registered_count INT NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
    eligibility TEXT DEFAULT 'Open to all enrolled students',
    status event_status NOT NULL DEFAULT 'draft',
    tags TEXT[] DEFAULT '{}',
    schedule JSONB DEFAULT '[]'::jsonb,
    rules JSONB DEFAULT '[]'::jsonb,
    contact_info VARCHAR(255),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_event_times CHECK (end_at > start_at),
    CONSTRAINT chk_deadline CHECK (registration_deadline <= end_at),
    CONSTRAINT chk_capacity_limit CHECK (registered_count <= capacity)
);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_department ON events(department_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);

-- ============================================================================
-- 5. REGISTRATIONS TABLE
-- ============================================================================

CREATE TYPE registration_status AS ENUM ('confirmed', 'waitlisted', 'cancelled', 'attended');

CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    registration_status registration_status NOT NULL DEFAULT 'confirmed',
    registration_code VARCHAR(64) NOT NULL UNIQUE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    
    -- Constraint: A student cannot register for the same event twice
    CONSTRAINT uq_event_student UNIQUE (event_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_reg_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_student ON registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_reg_code ON registrations(registration_code);

-- ============================================================================
-- 6. ATTENDANCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    checked_in_by UUID NOT NULL REFERENCES profiles(id),
    checked_in_at TIMESTAMPTZ DEFAULT NOW(),
    attendance_status VARCHAR(32) NOT NULL DEFAULT 'present'
);

CREATE INDEX IF NOT EXISTS idx_attendance_event ON attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);

-- ============================================================================
-- 7. CERTIFICATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    certificate_number VARCHAR(128) NOT NULL UNIQUE,
    file_path TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);

-- ============================================================================
-- 8. ANNOUNCEMENTS & IN-APP NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM (
    'registration',
    'approval',
    'rejection',
    'announcement',
    'reminder',
    'certificate',
    'attendance'
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_id VARCHAR(64) REFERENCES events(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type notification_type NOT NULL,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);

-- ============================================================================
-- 9. EVENT APPROVALS & AUDIT LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    decision VARCHAR(32) NOT NULL CHECK (decision IN ('approved', 'rejected')),
    comments TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES profiles(id),
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================================
-- 10. CONCURRENCY-SAFE REGISTRATION TRANSACTION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION register_for_event(
    p_event_id VARCHAR(64),
    p_student_id UUID,
    p_registration_code VARCHAR(64)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_event RECORD;
    v_existing_reg UUID;
    v_new_reg_id UUID;
BEGIN
    -- 1. Check if event exists and lock row FOR UPDATE to prevent race conditions
    SELECT id, capacity, registered_count, status, registration_deadline, end_at, title
    INTO v_event
    FROM events
    WHERE id = p_event_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event does not exist');
    END IF;

    -- 2. Validate event status
    IF v_event.status != 'published' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event is not open for registrations');
    END IF;

    -- 3. Check registration deadline
    IF NOW() > v_event.registration_deadline THEN
        RETURN jsonb_build_object('success', false, 'error', 'Registration deadline has passed');
    END IF;

    -- 4. Check capacity atomically
    IF v_event.registered_count >= v_event.capacity THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event capacity is full');
    END IF;

    -- 5. Check duplicate registration
    SELECT id INTO v_existing_reg
    FROM registrations
    WHERE event_id = p_event_id AND student_id = p_student_id;

    IF FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'You are already registered for this event');
    END IF;

    -- 6. Insert registration record
    INSERT INTO registrations (event_id, student_id, registration_code, registration_status, registered_at)
    VALUES (p_event_id, p_student_id, p_registration_code, 'confirmed', NOW())
    RETURNING id INTO v_new_reg_id;

    -- 7. Increment registered_count safely
    UPDATE events
    SET registered_count = registered_count + 1,
        updated_at = NOW()
    WHERE id = p_event_id;

    -- 8. Create confirmation notification
    INSERT INTO notifications (recipient_id, event_id, title, message, notification_type, link)
    VALUES (
        p_student_id,
        p_event_id,
        'Registration Confirmed',
        'You have successfully registered for ' || v_event.title || '. Registration Code: ' || p_registration_code,
        'registration',
        '/events/' || p_event_id
    );

    RETURN jsonb_build_object(
        'success', true,
        'registration_id', v_new_reg_id,
        'registration_code', p_registration_code,
        'registered_count', v_event.registered_count + 1
    );
END;
$$;

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE sql
STABLE
AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by all authenticated users"
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
ON profiles FOR ALL USING (get_my_role() = 'admin');

-- EVENTS POLICIES
CREATE POLICY "Published events are viewable by everyone"
ON events FOR SELECT USING (status = 'published' OR organizer_id = auth.uid() OR get_my_role() IN ('faculty', 'admin'));

CREATE POLICY "Organizers can create events"
ON events FOR INSERT WITH CHECK (auth.uid() = organizer_id AND get_my_role() IN ('organizer', 'admin'));

CREATE POLICY "Organizers can update own events"
ON events FOR UPDATE USING (organizer_id = auth.uid() OR get_my_role() = 'admin');

-- REGISTRATIONS POLICIES
CREATE POLICY "Students can view own registrations"
ON registrations FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM events WHERE events.id = registrations.event_id AND events.organizer_id = auth.uid()) OR
    get_my_role() IN ('faculty', 'admin')
);

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view and update own notifications"
ON notifications FOR ALL USING (recipient_id = auth.uid());

-- CERTIFICATES POLICIES
CREATE POLICY "Students can view own certificates"
ON certificates FOR SELECT USING (
    student_id = auth.uid() OR
    get_my_role() IN ('organizer', 'faculty', 'admin')
);
