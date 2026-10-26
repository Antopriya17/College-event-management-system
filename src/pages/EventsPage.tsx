import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCampus } from '../context/CampusContext';
import { EventCard } from '../components/events/EventCard';
import { EventFilter } from '../components/events/EventFilter';
import { Calendar, SearchX } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, departments, categories, registrations, currentUser } = useCampus();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search params initialization
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  // Keep state in sync with URL search param
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery !== null && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
    const urlCat = searchParams.get('category');
    if (urlCat !== null && urlCat !== selectedCategory) {
      setSelectedCategory(urlCat);
    }
  }, [searchParams]);

  // Filter & sort logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Visibility rule: published events or events organized by user
      const isVisible =
        event.status === 'published' ||
        event.status === 'completed' ||
        (event.status === 'pending_approval' && (currentUser.role === 'admin' || currentUser.role === 'faculty' || event.organizer_id === currentUser.id));

      if (!isVisible) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesDesc = (event.description || '').toLowerCase().includes(q);
        const matchesVenue = (event.venue || '').toLowerCase().includes(q);
        const matchesDept = (event.department_name || '').toLowerCase().includes(q);
        const matchesTags = (event.tags || []).some(t => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesDept && !matchesTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && event.category_id !== selectedCategory) {
        return false;
      }

      // Department
      if (selectedDepartment !== 'all' && event.department_id !== selectedDepartment) {
        return false;
      }

      // Availability
      if (availabilityFilter === 'open') {
        const isPast = new Date(event.registration_deadline) < new Date();
        const isFull = event.registered_count >= event.capacity;
        if (isPast || isFull || event.status !== 'published') return false;
      } else if (availabilityFilter === 'registered') {
        const isRegistered = registrations.some(
          r => r.event_id === event.id && r.student_id === currentUser.id && r.registration_status !== 'cancelled'
        );
        if (!isRegistered) return false;
      } else if (availabilityFilter === 'completed') {
        if (event.status !== 'completed') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
      }
      if (sortBy === 'popularity') {
        return b.registered_count - a.registered_count;
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'capacity-low') {
        const spotsA = a.capacity - a.registered_count;
        const spotsB = b.capacity - b.registered_count;
        return spotsA - spotsB;
      }
      return 0;
    });
  }, [events, searchQuery, selectedCategory, selectedDepartment, availabilityFilter, sortBy, registrations, currentUser]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDepartment('all');
    setAvailabilityFilter('all');
    setSortBy('date-asc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Collegiate Events Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover upcoming hackathons, symposiums, guest keynotes, sports cups, and workshops.
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <EventFilter
        searchQuery={searchQuery}
        onSearchChange={q => {
          setSearchQuery(q);
          if (q) setSearchParams({ search: q });
          else setSearchParams({});
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        departments={departments}
        categories={categories}
        totalResults={filteredEvents.length}
        onReset={handleReset}
      />

      {/* Results Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No events match your criteria</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search keywords, resetting department or category filters, or exploring all upcoming dates.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
