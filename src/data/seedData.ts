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
  AuditLog
} from '../types';

export const SEED_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'Department of Computing, AI, Software Engineering & Systems'
  },
  {
    id: 'dept-ece',
    name: 'Electronics & Communication',
    code: 'ECE',
    description: 'Embedded Systems, IoT, Robotics & Signal Processing'
  },
  {
    id: 'dept-mech',
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'Design, Thermodynamics, Automotive & Manufacturing'
  },
  {
    id: 'dept-mba',
    name: 'Management & Business Studies',
    code: 'MBA',
    description: 'Entrepreneurship, Marketing, Finance & Operations'
  },
  {
    id: 'dept-biotech',
    name: 'Biotechnology & Bioinformatics',
    code: 'BIOTECH',
    description: 'Genetic Engineering, Pharma, Bio-Computing & Research'
  },
  {
    id: 'dept-arts',
    name: 'Humanities & Fine Arts',
    code: 'ARTS',
    description: 'Creative Writing, Performing Arts, Philosophy & Media'
  }
];

export const SEED_CLUBS: Club[] = [
  {
    id: 'club-code',
    name: 'BitByte Developers Guild',
    code: 'BITBYTE',
    description: 'Competitive coding, open-source development, and hackathons.',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    lead_name: 'Alex Chen',
    avatar_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'club-robotics',
    name: 'MechaCorp Robotics Club',
    code: 'MECHA',
    description: 'Building autonomous rovers, combat bots, and IoT hardware.',
    department_id: 'dept-ece',
    department_name: 'Electronics & Communication',
    lead_name: 'Vikram Rao',
    avatar_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'club-culture',
    name: 'Tarang Cultural Society',
    code: 'TARANG',
    description: 'Music, theater, dance, arts festivals, and creative stages.',
    department_id: 'dept-arts',
    department_name: 'Humanities & Fine Arts',
    lead_name: 'Ananya Roy',
    avatar_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'club-ecell',
    name: 'Campus E-Cell (Incubator)',
    code: 'ECELL',
    description: 'Startup mentorship, pitch fests, and venture creation.',
    department_id: 'dept-mba',
    department_name: 'Management & Business Studies',
    lead_name: 'Siddharth Nair',
    avatar_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'club-sports',
    name: 'Apex Athletic Federation',
    code: 'APEX',
    description: 'Intramural tournaments, track events, and team championships.',
    lead_name: 'Captain Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&auto=format&fit=crop&q=80'
  }
];

export const SEED_CATEGORIES: EventCategory[] = [
  {
    id: 'cat-tech',
    name: 'Technical Symposium',
    slug: 'technical',
    description: 'Paper presentations, code jams, algorithmic contests and tech expos',
    icon: 'Cpu',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'cat-hackathon',
    name: 'Hackathons',
    slug: 'hackathon',
    description: 'Intensive 24h-48h collaborative software and hardware hack marathons',
    icon: 'Terminal',
    color: 'from-violet-600 to-purple-800'
  },
  {
    id: 'cat-workshop',
    name: 'Workshops & Bootcamps',
    slug: 'workshop',
    description: 'Hands-on guided skill acquisition with industry mentors and certifications',
    icon: 'Laptop',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'cat-cultural',
    name: 'Cultural & Arts',
    slug: 'cultural',
    description: 'Music concerts, dance showcases, dramatic plays, and fine art galleries',
    icon: 'Sparkles',
    color: 'from-pink-600 to-rose-700'
  },
  {
    id: 'cat-sports',
    name: 'Sports & Athletics',
    slug: 'sports',
    description: 'Inter-college tournaments, track & field, football, basketball & chess',
    icon: 'Trophy',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'cat-seminar',
    name: 'Seminars & Keynotes',
    slug: 'seminar',
    description: 'Distinguished lectures by industry executives, researchers, and founders',
    icon: 'Presentation',
    color: 'from-cyan-600 to-blue-700'
  }
];

export const SEED_PROFILES: Profile[] = [
  {
    id: 'user-student-1',
    email: 'priya.sharma@campus.edu',
    full_name: 'Priya Sharma',
    role: 'student',
    student_id: 'CS-2023-042',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 392-8812',
    bio: 'Junior CSE student passionate about distributed systems, cloud computing, and UI design.',
    created_at: '2026-01-15T09:00:00Z',
    updated_at: '2026-10-20T14:30:00Z'
  },
  {
    id: 'user-organizer-1',
    email: 'alex.chen@campus.edu',
    full_name: 'Alex Chen',
    role: 'organizer',
    student_id: 'CS-2022-019',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-9011',
    bio: 'President of BitByte Guild. Lead organizer for TechFest & HackApex 2026.',
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-10-22T11:00:00Z'
  },
  {
    id: 'user-faculty-1',
    email: 'dr.mitchell@campus.edu',
    full_name: 'Dr. Sarah Mitchell',
    role: 'faculty',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 765-4321',
    bio: 'Associate Professor & Student Activities Committee Chair. CSE Faculty Mentor.',
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2026-10-18T09:15:00Z'
  },
  {
    id: 'user-admin-1',
    email: 'admin.taylor@campus.edu',
    full_name: 'Dean Robert Taylor',
    role: 'admin',
    department_id: 'dept-cse',
    department_name: 'Campus Academic Council',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 999-0001',
    bio: 'Dean of Student Affairs & Central Platform Administrator for CampusConnect.',
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2026-10-24T16:00:00Z'
  },
  {
    id: 'user-student-2',
    email: 'rohit.verma@campus.edu',
    full_name: 'Rohit Verma',
    role: 'student',
    student_id: 'EC-2023-108',
    department_id: 'dept-ece',
    department_name: 'Electronics & Communication',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-11T12:00:00Z',
    updated_at: '2026-02-11T12:00:00Z'
  },
  {
    id: 'user-student-3',
    email: 'emily.zhao@campus.edu',
    full_name: 'Emily Zhao',
    role: 'student',
    student_id: 'MB-2024-055',
    department_id: 'dept-mba',
    department_name: 'Management & Business Studies',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z'
  }
];

export const SEED_EVENTS: CollegeEvent[] = [
  {
    id: 'evt-bytecraft-2026',
    title: 'ByteCraft 2026: National Technical Symposium',
    slug: 'bytecraft-2026-national-technical-symposium',
    short_description: 'Flagship university technical fest featuring algorithm sprints, system architecture showcases, and project expos.',
    description: 'ByteCraft 2026 brings together over 500 undergraduate and graduate minds for a 2-day technical symposium. Featuring keynote addresses from Silicon Valley leaders, competitive coding arenas, machine learning model challenges, and research paper presentations.',
    category_id: 'cat-tech',
    category_name: 'Technical Symposium',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    club_id: 'club-code',
    club_name: 'BitByte Developers Guild',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    venue: 'Main University Auditorium & Turing Computing Complex',
    start_at: '2026-11-12T09:00:00Z',
    end_at: '2026-11-13T18:00:00Z',
    registration_deadline: '2026-11-10T23:59:00Z',
    capacity: 250,
    registered_count: 184,
    eligibility: 'All college undergraduate and postgraduate engineering students.',
    status: 'published',
    tags: ['Coding', 'Symposium', 'Keynotes', 'Algorithms'],
    schedule: [
      { time: '09:00 AM - 10:30 AM', activity: 'Inaugural Keynote: Future of Autonomous Software' },
      { time: '11:00 AM - 01:30 PM', activity: 'Round 1: Rapid Code Marathon & System Design' },
      { time: '02:30 PM - 05:30 PM', activity: 'Technical Project Expo & Judge Evaluations' }
    ],
    rules: [
      'College ID card is strictly mandatory for campus entry.',
      'Participants must bring their own laptops and chargers.',
      'Plagiarism or unauthorized external code tools result in immediate disqualification.'
    ],
    contact_info: 'techsymposium@campus.edu | +1 (555) 234-9011',
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-20T12:00:00Z'
  },
  {
    id: 'evt-hackapex-2026',
    title: 'HackApex: 48-Hour Intercollege Innovation Hackathon',
    slug: 'hackapex-48-hour-intercollege-innovation-hackathon',
    short_description: 'Build high-impact solutions in HealthTech, EdTech, Climate, and AI over an exhilarating 48 hours.',
    description: 'HackApex is the premier collegiate hackathon. Form teams of 2 to 4 students, receive live mentorship from tech startup founders, and pitch to VC judges for prize pools exceeding $10,000.',
    category_id: 'cat-hackathon',
    category_name: 'Hackathons',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    club_id: 'club-code',
    club_name: 'BitByte Developers Guild',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    venue: 'Innovation & Research Hub, 3rd Floor Co-working Lab',
    start_at: '2026-11-20T17:00:00Z',
    end_at: '2026-11-22T17:00:00Z',
    registration_deadline: '2026-11-18T18:00:00Z',
    capacity: 120,
    registered_count: 98,
    eligibility: 'Open to all enrolled students with valid college email.',
    status: 'published',
    tags: ['Hackathon', 'Teams', 'Cash Prizes', 'Mentorship'],
    schedule: [
      { time: 'Friday 05:00 PM', activity: 'Team Check-in & Dinner Mixer' },
      { time: 'Friday 07:00 PM', activity: 'Hacking Commences: Problem Statements Released' },
      { time: 'Saturday 02:00 PM', activity: 'Mentor Feedback Checkpoints' },
      { time: 'Sunday 03:00 PM', activity: 'Final Product Demos & Award Ceremony' }
    ],
    rules: [
      'Teams must consist of 2 to 4 members.',
      'All code and design assets must be created during the official 48-hour window.',
      'Repositories must be open on GitHub with continuous commit logs.'
    ],
    contact_info: 'hackapex@campus.edu',
    created_at: '2026-10-05T09:00:00Z',
    updated_at: '2026-10-21T14:00:00Z'
  },
  {
    id: 'evt-tarangini-2026',
    title: 'Tarangini 2026: Annual Cultural & Arts Festival',
    slug: 'tarangini-2026-annual-cultural-arts-festival',
    short_description: 'Three vibrant days of music, theatrical performances, dance battles, and art installations.',
    description: 'The campus comes alive with Tarangini 2026. Join over 2,000 students celebrating heritage, fusion music, battle of the bands, classical dances, fashion runways, and street food carnivals.',
    category_id: 'cat-cultural',
    category_name: 'Cultural & Arts',
    department_id: 'dept-arts',
    department_name: 'Humanities & Fine Arts',
    club_id: 'club-culture',
    club_name: 'Tarang Cultural Society',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    venue: 'University Open Air Amphitheatre',
    start_at: '2026-12-04T16:00:00Z',
    end_at: '2026-12-06T22:00:00Z',
    registration_deadline: '2026-12-02T23:59:00Z',
    capacity: 600,
    registered_count: 420,
    eligibility: 'All students, alumni, and faculty welcome.',
    status: 'published',
    tags: ['Music', 'Dance', 'Festival', 'Theater'],
    schedule: [
      { time: 'Day 1 Evening', activity: 'Acoustic Night & Classical Solo Showcases' },
      { time: 'Day 2 Evening', activity: 'Inter-College Dance Faceoff & Fashion Gala' },
      { time: 'Day 3 Night', activity: 'Star Celebrity Concert & Pyrotechnics' }
    ],
    rules: [
      'Campus security wristbands must be worn at all times.',
      'Outside beverages and prohibited items strictly barred at entrance gates.'
    ],
    contact_info: 'culturalaffairs@campus.edu',
    created_at: '2026-10-08T11:00:00Z',
    updated_at: '2026-10-23T15:00:00Z'
  },
  {
    id: 'evt-ai-workshop',
    title: 'Generative AI & Deep Learning Masterclass',
    slug: 'generative-ai-deep-learning-masterclass',
    short_description: 'Practical training on Transformer architectures, prompt tuning, vector databases, and PyTorch.',
    description: 'An intensive, hands-on weekend workshop where participants build real AI applications. Guided by PhD researchers, you will train a lightweight vision transformer and deploy an end-to-end RAG application.',
    category_id: 'cat-workshop',
    category_name: 'Workshops & Bootcamps',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    club_id: 'club-code',
    club_name: 'BitByte Developers Guild',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    venue: 'Computing Seminar Hall 204 (Equipped with GPU Workstations)',
    start_at: '2026-11-05T10:00:00Z',
    end_at: '2026-11-05T17:00:00Z',
    registration_deadline: '2026-11-03T18:00:00Z',
    capacity: 80,
    registered_count: 76,
    eligibility: 'Basic Python programming proficiency required.',
    status: 'published',
    tags: ['AI', 'PyTorch', 'Transformers', 'Certified'],
    schedule: [
      { time: '10:00 AM - 12:30 PM', activity: 'Session 1: Neural Networks & Transformer Fundamentals' },
      { time: '01:30 PM - 03:30 PM', activity: 'Session 2: Hands-on Fine-Tuning with Colab Enterprise' },
      { time: '03:45 PM - 05:00 PM', activity: 'Session 3: Vector Embeddings & Agentic Systems' }
    ],
    rules: [
      'Must complete the lab assignments to qualify for verified digital certificate.'
    ],
    contact_info: 'aiworkshops@campus.edu',
    created_at: '2026-10-12T08:00:00Z',
    updated_at: '2026-10-24T18:00:00Z'
  },
  {
    id: 'evt-phoenix-cup-2026',
    title: 'Phoenix Cup: Interdepartmental Sports Tournament',
    slug: 'phoenix-cup-interdepartmental-sports-tournament',
    short_description: 'Battle for the Chancellor Trophy across Basketball, Soccer, Volleyball, and Badminton.',
    description: 'The annual college sports clash! Departments compete in intense round-robin and knockout fixtures over one week. Cheer for your departmental athletes or represent your branch on the field.',
    category_id: 'cat-sports',
    category_name: 'Sports & Athletics',
    department_id: 'dept-mech',
    department_name: 'Mechanical Engineering',
    club_id: 'club-sports',
    club_name: 'Apex Athletic Federation',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    venue: 'University Sports Complex & Stadium Turf',
    start_at: '2026-11-25T08:00:00Z',
    end_at: '2026-11-29T19:00:00Z',
    registration_deadline: '2026-11-20T20:00:00Z',
    capacity: 300,
    registered_count: 210,
    eligibility: 'Must be a bona-fide student of an affiliated department.',
    status: 'published',
    tags: ['Basketball', 'Football', 'Athletics', 'Trophy'],
    schedule: [
      { time: 'Nov 25 Morning', activity: 'Opening Ceremony & Track 100m/400m Heats' },
      { time: 'Nov 26-28', activity: 'Basketball & Football Group Stages' },
      { time: 'Nov 29 Afternoon', activity: 'Grand Finals & Trophy Handover' }
    ],
    rules: [
      'Standard FIFA/FIBA guidelines enforced.',
      'Sports shoes and departmental jerseys mandatory.'
    ],
    contact_info: 'sports@campus.edu',
    created_at: '2026-10-14T09:30:00Z',
    updated_at: '2026-10-22T10:00:00Z'
  },
  {
    id: 'evt-ignite-pitch-fest',
    title: 'Ignite Campus: Student Startup Pitch Competition',
    slug: 'ignite-campus-student-startup-pitch-competition',
    short_description: 'Pitch your entrepreneurial venture to angel investors and seed fund partners for equity-free grants.',
    description: 'Have an innovative prototype or venture idea? The Campus E-Cell brings you Ignite Campus, offering $5,000 in seed grant funding, legal incorporation support, and university incubator space for winning student teams.',
    category_id: 'cat-seminar',
    category_name: 'Seminars & Keynotes',
    department_id: 'dept-mba',
    department_name: 'Management & Business Studies',
    club_id: 'club-ecell',
    club_name: 'Campus E-Cell (Incubator)',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
    venue: 'Executive MBA Conference Hall',
    start_at: '2026-12-10T13:00:00Z',
    end_at: '2026-12-10T18:00:00Z',
    registration_deadline: '2026-12-05T23:59:00Z',
    capacity: 100,
    registered_count: 54,
    eligibility: 'Student-led teams with at least an executive summary deck.',
    status: 'published',
    tags: ['Startup', 'Pitch', 'Grants', 'Incubation'],
    schedule: [
      { time: '01:00 PM - 02:00 PM', activity: 'Keynote: From Dorm Room to Series A' },
      { time: '02:15 PM - 04:30 PM', activity: 'Top 10 Team Pitches (7 min pitch + 5 min Q&A)' },
      { time: '05:00 PM', activity: 'Grant Announcement & Networking Cocktail' }
    ],
    rules: [
      'Decks must be submitted in PDF format before the deadline.',
      'Maximum 4 members per venture pitch.'
    ],
    contact_info: 'ecell@campus.edu',
    created_at: '2026-10-15T11:00:00Z',
    updated_at: '2026-10-23T16:00:00Z'
  },
  {
    id: 'evt-web-dev-bootcamp',
    title: 'Full-Stack Modern Cloud & React Intensive',
    slug: 'full-stack-modern-cloud-react-intensive',
    short_description: 'Build and deploy scalable full-stack web applications using React, Tailwind, and Cloud databases.',
    description: 'Fast-track your software engineering career with practical, production-ready patterns: TypeScript, modern state management, database schema design, and serverless architectures.',
    category_id: 'cat-workshop',
    category_name: 'Workshops & Bootcamps',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    club_id: 'club-code',
    club_name: 'BitByte Developers Guild',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    venue: 'CS Computer Lab 3',
    start_at: '2026-11-08T09:00:00Z',
    end_at: '2026-11-09T16:00:00Z',
    registration_deadline: '2026-11-06T18:00:00Z',
    capacity: 60,
    registered_count: 60, // full event test case!
    eligibility: 'All students interested in software development.',
    status: 'published',
    tags: ['WebDev', 'React', 'TypeScript', 'Full-Capacity'],
    schedule: [
      { time: 'Day 1', activity: 'Modern React Architecture, Hooks & Tailwind CSS' },
      { time: 'Day 2', activity: 'PostgreSQL Relational DBs, Auth & Production Deployment' }
    ],
    rules: [
      'Node.js 20+ must be pre-installed on personal laptop.'
    ],
    contact_info: 'alex.chen@campus.edu',
    created_at: '2026-10-10T12:00:00Z',
    updated_at: '2026-10-20T17:00:00Z'
  },
  {
    id: 'evt-robowars-2026',
    title: 'RoboWars & Autonomous Line Follower Challenge',
    slug: 'robowars-autonomous-line-follower-challenge',
    short_description: 'Combat robotics arena and micro-controller autonomous navigation competitions.',
    description: 'Watch 15kg and 30kg metal warriors battle it out inside the heavy-duty plexiglass arena, alongside the precision Autonomous Line Follower speed track where milliseconds dictate victory.',
    category_id: 'cat-tech',
    category_name: 'Technical Symposium',
    department_id: 'dept-ece',
    department_name: 'Electronics & Communication',
    club_id: 'club-robotics',
    club_name: 'MechaCorp Robotics Club',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    venue: 'Mechanical Workshop High-Bay Arena',
    start_at: '2026-11-18T10:00:00Z',
    end_at: '2026-11-18T18:00:00Z',
    registration_deadline: '2026-11-15T23:59:00Z',
    capacity: 150,
    registered_count: 82,
    eligibility: 'Undergrad robotics teams and enthusiast spectators.',
    status: 'published',
    tags: ['Robotics', 'Hardware', 'Combat', 'Arduino'],
    schedule: [
      { time: '10:00 AM - 12:00 PM', activity: 'Safety Scrutiny & Weight Certification' },
      { time: '01:00 PM - 03:30 PM', activity: 'Line Follower Time Trials' },
      { time: '04:00 PM - 06:00 PM', activity: 'Combat Bot Elimination & Arena Finals' }
    ],
    rules: [
      'Safety cutoff switches required on all battery-powered combatants.',
      'Spectators must remain behind barrier perimeter.'
    ],
    contact_info: 'robotics@campus.edu',
    created_at: '2026-10-11T14:00:00Z',
    updated_at: '2026-10-22T09:00:00Z'
  },
  {
    id: 'evt-cybersecurity-workshop',
    title: 'CyberDefenders: Hands-on Ethical Hacking & Blue Team Ops',
    slug: 'cyberdefenders-ethical-hacking-blue-team-ops',
    short_description: 'Capture The Flag (CTF) challenges, network security analysis, and cloud defense methodologies.',
    description: 'Learn modern security defense from certified penetration testers. Test your skills on an isolated CTF range containing real vulnerabilities, SQL injections, privilege escalations, and cryptographic puzzles.',
    category_id: 'cat-workshop',
    category_name: 'Workshops & Bootcamps',
    department_id: 'dept-cse',
    department_name: 'Computer Science & Engineering',
    club_id: 'club-code',
    club_name: 'BitByte Developers Guild',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    venue: 'Cyber Security Operations Center, Academic Block B',
    start_at: '2026-11-30T10:00:00Z',
    end_at: '2026-11-30T17:30:00Z',
    registration_deadline: '2026-11-28T20:00:00Z',
    capacity: 90,
    registered_count: 64,
    eligibility: 'All students with basic networking and Linux knowledge.',
    status: 'published',
    tags: ['Cybersecurity', 'CTF', 'EthicalHacking', 'Infosec'],
    schedule: [
      { time: '10:00 AM - 12:30 PM', activity: 'Defensive Architecture & Vulnerability Scanning' },
      { time: '01:30 PM - 04:30 PM', activity: 'Live CTF Competition on Private Range' },
      { time: '04:45 PM - 05:30 PM', activity: 'Walkthroughs and Winner Recognition' }
    ],
    rules: [
      'Attacks outside the designated range subnet will trigger disciplinary review.'
    ],
    contact_info: 'cybersec@campus.edu',
    created_at: '2026-10-16T15:00:00Z',
    updated_at: '2026-10-24T11:00:00Z'
  },
  {
    id: 'evt-quantum-symposium-pending',
    title: 'Future Horizons: Quantum Computing & Nanotech Symposium',
    slug: 'future-horizons-quantum-computing-nanotech-symposium',
    short_description: 'Exploring quantum gates, qubit algorithms, and cryogenic circuit engineering.',
    description: 'A cutting-edge symposium proposal awaiting departmental review. Involves guest researchers from national laboratories giving talks on superconducting quantum hardware.',
    category_id: 'cat-tech',
    category_name: 'Technical Symposium',
    department_id: 'dept-ece',
    department_name: 'Electronics & Communication',
    club_id: 'club-code',
    club_name: 'BitByte Developers Guild',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    venue: 'Advanced Research Auditorium, Block D',
    start_at: '2026-12-18T09:30:00Z',
    end_at: '2026-12-18T16:30:00Z',
    registration_deadline: '2026-12-15T23:59:00Z',
    capacity: 100,
    registered_count: 0,
    eligibility: 'Third and Fourth year undergrads, postgrads, and research scholars.',
    status: 'pending_approval', // Pending review for Faculty/Admin to test approval workflow!
    tags: ['Quantum', 'Physics', 'Research', 'AwaitingApproval'],
    schedule: [
      { time: '09:30 AM', activity: 'Registration & Coffee' },
      { time: '10:00 AM', activity: 'Superconducting Qubits & Decoherence Mitigation' },
      { time: '02:00 PM', activity: 'Interactive Qiskit Workshop' }
    ],
    rules: [
      'Pre-reading of Qiskit SDK basics recommended.'
    ],
    contact_info: 'quantum@campus.edu',
    created_at: '2026-10-23T14:00:00Z',
    updated_at: '2026-10-23T14:00:00Z'
  },
  {
    id: 'evt-biotech-past-symposium',
    title: 'BioConvergence 2026: CRISPR & Genomic Medicine',
    slug: 'bioconvergence-2026-crispr-genomic-medicine',
    short_description: 'Completed conference on gene editing, bioinformatics pipelines, and clinical ethics.',
    description: 'A completed college event where attendees have already been marked present and verified certificates are available for download.',
    category_id: 'cat-seminar',
    category_name: 'Seminars & Keynotes',
    department_id: 'dept-biotech',
    department_name: 'Biotechnology & Bioinformatics',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    organizer_email: 'alex.chen@campus.edu',
    poster_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    venue: 'Bio-Sciences Lecture Theatre 1',
    start_at: '2026-10-15T09:00:00Z',
    end_at: '2026-10-15T17:00:00Z',
    registration_deadline: '2026-10-12T23:59:00Z',
    capacity: 150,
    registered_count: 142,
    eligibility: 'Open to Biotech, Medical & CSE bioinformatics enthusiasts.',
    status: 'completed',
    tags: ['Biotech', 'Genomics', 'CRISPR', 'Completed'],
    schedule: [
      { time: '09:00 AM', activity: 'Keynote by Prof. Ronald Vance' }
    ],
    contact_info: 'biotech@campus.edu',
    created_at: '2026-09-15T09:00:00Z',
    updated_at: '2026-10-16T10:00:00Z'
  }
];

export const SEED_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    event_id: 'evt-bytecraft-2026',
    event_title: 'ByteCraft 2026: National Technical Symposium',
    event_poster: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    event_start_at: '2026-11-12T09:00:00Z',
    event_venue: 'Main University Auditorium & Turing Computing Complex',
    student_id: 'user-student-1',
    student_name: 'Priya Sharma',
    student_email: 'priya.sharma@campus.edu',
    student_college_id: 'CS-2023-042',
    student_dept: 'Computer Science & Engineering',
    registration_code: 'CC-TECH-4829',
    registration_status: 'confirmed',
    registered_at: '2026-10-15T14:22:00Z'
  },
  {
    id: 'reg-002',
    event_id: 'evt-hackapex-2026',
    event_title: 'HackApex: 48-Hour Intercollege Innovation Hackathon',
    event_poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    event_start_at: '2026-11-20T17:00:00Z',
    event_venue: 'Innovation & Research Hub, 3rd Floor Co-working Lab',
    student_id: 'user-student-1',
    student_name: 'Priya Sharma',
    student_email: 'priya.sharma@campus.edu',
    student_college_id: 'CS-2023-042',
    student_dept: 'Computer Science & Engineering',
    registration_code: 'CC-HACK-9102',
    registration_status: 'confirmed',
    registered_at: '2026-10-18T10:11:00Z'
  },
  {
    id: 'reg-003',
    event_id: 'evt-biotech-past-symposium',
    event_title: 'BioConvergence 2026: CRISPR & Genomic Medicine',
    event_poster: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    event_start_at: '2026-10-15T09:00:00Z',
    event_venue: 'Bio-Sciences Lecture Theatre 1',
    student_id: 'user-student-1',
    student_name: 'Priya Sharma',
    student_email: 'priya.sharma@campus.edu',
    student_college_id: 'CS-2023-042',
    student_dept: 'Computer Science & Engineering',
    registration_code: 'CC-BIO-3190',
    registration_status: 'attended',
    registered_at: '2026-09-28T11:45:00Z'
  },
  {
    id: 'reg-004',
    event_id: 'evt-bytecraft-2026',
    event_title: 'ByteCraft 2026: National Technical Symposium',
    student_id: 'user-student-2',
    student_name: 'Rohit Verma',
    student_email: 'rohit.verma@campus.edu',
    student_college_id: 'EC-2023-108',
    student_dept: 'Electronics & Communication',
    registration_code: 'CC-TECH-5510',
    registration_status: 'confirmed',
    registered_at: '2026-10-16T16:00:00Z'
  },
  {
    id: 'reg-005',
    event_id: 'evt-bytecraft-2026',
    event_title: 'ByteCraft 2026: National Technical Symposium',
    student_id: 'user-student-3',
    student_name: 'Emily Zhao',
    student_email: 'emily.zhao@campus.edu',
    student_college_id: 'MB-2024-055',
    student_dept: 'Management & Business Studies',
    registration_code: 'CC-TECH-8821',
    registration_status: 'confirmed',
    registered_at: '2026-10-17T09:30:00Z'
  }
];

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-001',
    registration_id: 'reg-003',
    event_id: 'evt-biotech-past-symposium',
    student_id: 'user-student-1',
    student_name: 'Priya Sharma',
    registration_code: 'CC-BIO-3190',
    checked_in_by: 'user-organizer-1',
    checked_in_by_name: 'Alex Chen',
    checked_in_at: '2026-10-15T09:12:00Z',
    attendance_status: 'present'
  }
];

export const SEED_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    registration_id: 'reg-003',
    event_id: 'evt-biotech-past-symposium',
    event_title: 'BioConvergence 2026: CRISPR & Genomic Medicine',
    event_date: 'October 15, 2026',
    student_id: 'user-student-1',
    student_name: 'Priya Sharma',
    student_dept: 'Computer Science & Engineering',
    certificate_number: 'CC-CERT-2026-98214',
    issued_at: '2026-10-16T10:00:00Z',
    organizer_name: 'Prof. Ronald Vance & Alex Chen',
    authority_title: 'Dean of Academic Research'
  }
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-001',
    event_id: 'evt-bytecraft-2026',
    event_title: 'ByteCraft 2026: National Technical Symposium',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    title: 'Room Allocation & GitHub Repo Rules Published',
    message: 'Welcome registered participants! Please check the updated schedule in your dashboard. Lab workstations have been assigned by student registration ID.',
    created_at: '2026-10-22T14:00:00Z'
  },
  {
    id: 'anc-002',
    event_id: 'evt-hackapex-2026',
    event_title: 'HackApex: 48-Hour Intercollege Innovation Hackathon',
    organizer_id: 'user-organizer-1',
    organizer_name: 'Alex Chen',
    title: 'Cloud Credits & Free API Tokens Available',
    message: 'Every team will receive $100 in cloud credits and free AI model access at the Friday registration desk.',
    created_at: '2026-10-24T09:00:00Z'
  }
];

export const SEED_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-001',
    recipient_id: 'user-student-1',
    event_id: 'evt-bytecraft-2026',
    title: 'Registration Confirmed',
    message: 'Your seat for ByteCraft 2026 has been secured! Registration Code: CC-TECH-4829',
    notification_type: 'registration',
    read_at: null,
    created_at: '2026-10-15T14:22:00Z',
    link: '/events/evt-bytecraft-2026'
  },
  {
    id: 'notif-002',
    recipient_id: 'user-student-1',
    event_id: 'evt-biotech-past-symposium',
    title: 'Certificate Issued',
    message: 'Your official certificate of participation for BioConvergence 2026 is ready to download.',
    notification_type: 'certificate',
    read_at: null,
    created_at: '2026-10-16T10:05:00Z',
    link: '/certificates'
  },
  {
    id: 'notif-003',
    recipient_id: 'user-faculty-1',
    event_id: 'evt-quantum-symposium-pending',
    title: 'Event Approval Request',
    message: 'Alex Chen submitted "Future Horizons: Quantum Computing & Nanotech Symposium" for departmental review.',
    notification_type: 'approval',
    read_at: null,
    created_at: '2026-10-23T14:00:00Z',
    link: '/faculty/approvals'
  },
  {
    id: 'notif-004',
    recipient_id: 'user-admin-1',
    event_id: 'evt-quantum-symposium-pending',
    title: 'New Event in Review Queue',
    message: 'Department of ECE has an event awaiting faculty/admin approval.',
    notification_type: 'approval',
    read_at: null,
    created_at: '2026-10-23T14:05:00Z',
    link: '/admin'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    actor_id: 'user-organizer-1',
    actor_name: 'Alex Chen',
    actor_role: 'organizer',
    action: 'CREATE_EVENT_PROPOSAL',
    entity_type: 'event',
    entity_id: 'evt-quantum-symposium-pending',
    details: 'Submitted proposal for Quantum Computing Symposium',
    created_at: '2026-10-23T14:00:00Z'
  },
  {
    id: 'log-002',
    actor_id: 'user-faculty-1',
    actor_name: 'Dr. Sarah Mitchell',
    actor_role: 'faculty',
    action: 'APPROVE_EVENT',
    entity_type: 'approval',
    entity_id: 'evt-bytecraft-2026',
    details: 'Approved ByteCraft 2026 with venue clearance',
    created_at: '2026-10-02T11:30:00Z'
  },
  {
    id: 'log-003',
    actor_id: 'user-admin-1',
    actor_name: 'Dean Robert Taylor',
    actor_role: 'admin',
    action: 'PUBLISH_EVENT',
    entity_type: 'event',
    entity_id: 'evt-hackapex-2026',
    details: 'Published HackApex to campus catalog',
    created_at: '2026-10-06T09:15:00Z'
  }
];
