import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  Users,
  Award,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Terminal,
  Laptop,
  Trophy,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { BentoCard } from '../components/bento/BentoCard';
import { EventCard } from '../components/events/EventCard';

export const HomePage: React.FC = () => {
  const { events, categories, departments, currentUser } = useCampus();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const publishedEvents = events.filter(e => e.status === 'published');
  const featuredEvents = publishedEvents.slice(0, 3);
  const upcomingEvents = publishedEvents.slice(3, 7);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/events?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const totalSeats = publishedEvents.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalRegistered = publishedEvents.reduce((acc, curr) => acc + curr.registered_count, 0);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        ></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Autonomous College Event Management Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover. Participate.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Celebrate.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Welcome to CampusConnect — the centralized cloud platform for college technical symposiums, hackathons, sports championships, workshops, and cultural fests.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-300 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search events (e.g. HackApex, ByteCraft, Robotics, AI)..."
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 sm:bg-transparent rounded-xl text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-sm text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Events
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Micro badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              100% Verified Digital Certificates
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Real-time QR Check-In
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Instant Registration Code
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Bento Grid: Platform Pulse & Metrics */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Campus Pulse
              </h2>
              <p className="text-xs text-slate-500">Live metrics across departments & clubs</p>
            </div>
            <Link
              to="/events"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All Events <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <BentoCard
              title="Active Events"
              subtitle="Published campus-wide"
              icon={<Calendar className="w-5 h-5 text-blue-600" />}
              badge="Open"
              badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {publishedEvents.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Across 6 academic departments</p>
            </BentoCard>

            {/* Stat 2 */}
            <BentoCard
              title="Total Registrations"
              subtitle="Confirmed student attendees"
              icon={<Users className="w-5 h-5 text-indigo-600" />}
            >
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {totalRegistered}
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${Math.round((totalRegistered / (totalSeats || 1)) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {totalSeats - totalRegistered} remaining spots left
              </p>
            </BentoCard>

            {/* Stat 3 */}
            <BentoCard
              title="Certificates Issued"
              subtitle="Verified digital credentials"
              icon={<Award className="w-5 h-5 text-amber-600" />}
            >
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                142+
              </div>
              <p className="text-xs text-slate-500 mt-1">Instant PDF download upon check-in</p>
            </BentoCard>

            {/* Stat 4 */}
            <BentoCard
              title="Your Status"
              subtitle={`Signed in as ${currentUser.full_name}`}
              icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
              badge={currentUser.role.toUpperCase()}
              badgeColor="bg-purple-50 text-purple-700 border-purple-200"
            >
              <div className="text-xs text-slate-600 mt-2">
                Department: <strong className="text-slate-800">{currentUser.department_name || 'Engineering'}</strong>
              </div>
              <Link
                to={currentUser.role === 'student' ? '/student' : `/${currentUser.role}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Go to {currentUser.role} portal →
              </Link>
            </BentoCard>
          </div>
        </section>

        {/* Featured Events Bento Showcase */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Featured Highlights
              </h2>
              <p className="text-xs text-slate-500">
                Flagship annual technical, cultural and innovation symposiums
              </p>
            </div>
            <Link
              to="/events"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Explore directory →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Categories Bento Row */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Event Categories
            </h2>
            <p className="text-xs text-slate-500">Filter by domain, format, or interest</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/events?category=${cat.id}`}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Laptop className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                  {cat.slug}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* More Upcoming Events Grid */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Upcoming on Campus
              </h2>
              <p className="text-xs text-slate-500">Register early before seats fill up</p>
            </div>
            <Link
              to="/events"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Full calendar →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Academic Project CTA Banner */}
        <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Role-Based College Experience
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Are you an Event Organizer or Faculty Member?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use the top demo role switcher to jump straight into proposing new events, reviewing student proposals, conducting live QR check-ins, or monitoring college-wide participation analytics.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/organizer/create"
              className="px-5 py-2.5 rounded-xl bg-white text-blue-950 font-bold text-xs hover:bg-slate-100 transition-colors shadow-md"
            >
              Propose New Event
            </Link>
            <Link
              to="/about"
              className="px-5 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-semibold text-xs border border-blue-400/30 transition-colors"
            >
              System Documentation
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
