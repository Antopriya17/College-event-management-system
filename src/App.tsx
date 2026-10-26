/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CampusProvider } from './context/CampusContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CloudSetupModal } from './components/common/CloudSetupModal';

// Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { OrganizerDashboard } from './pages/organizer/OrganizerDashboard';
import { CreateEventPage } from './pages/organizer/CreateEventPage';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { NotificationsPage } from './pages/NotificationsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <CampusProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Role-Based Dashboards */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="/organizer/create" element={<CreateEventPage />} />
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* General Core Features */}
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <CloudSetupModal />
        </div>
      </CampusProvider>
    </BrowserRouter>
  );
}
