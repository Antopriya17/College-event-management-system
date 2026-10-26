import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { CollegeEvent } from '../../types';
import { useCampus } from '../../context/CampusContext';

interface EventCardProps {
  event: CollegeEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { currentUser, registrations } = useCampus();

  const isRegistered = registrations.some(
    r => r.event_id === event.id && r.student_id === currentUser.id && r.registration_status !== 'cancelled'
  );

  const spotsLeft = Math.max(0, event.capacity - event.registered_count);
  const fillPercent = Math.min(100, Math.round((event.registered_count / event.capacity) * 100));
  const isFull = event.registered_count >= event.capacity;
  const isPastDeadline = new Date(event.registration_deadline) < new Date();

  // Formatting date
  const startDate = new Date(event.start_at);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col group">
      {/* Poster Media Box */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={event.poster_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
            {event.category_name || 'Event'}
          </span>
          {event.status === 'pending_approval' && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-500/90 backdrop-blur-md text-white shadow-xs">
              Pending Review
            </span>
          )}
        </div>

        {/* Registered status pill */}
        {isRegistered && (
          <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Registered
          </div>
        )}

        {/* Date banner at bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1.5 drop-shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1 drop-shadow-xs text-[11px] text-slate-200">
            <Clock className="w-3 h-3" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-blue-600 truncate max-w-[180px]">
              {event.department_name || 'All Departments'}
            </span>
            {event.club_name && (
              <>
                <span>•</span>
                <span className="truncate max-w-[150px]">{event.club_name}</span>
              </>
            )}
          </div>

          <Link to={`/events/${event.id}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
              {event.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {event.short_description || event.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Capacity bar & Footer CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>
                  {event.registered_count} / {event.capacity} seats filled
                </span>
              </span>
              <span className={`font-semibold ${isFull ? 'text-rose-600' : 'text-slate-700'}`}>
                {isFull ? 'Housefull' : `${spotsLeft} seats left`}
              </span>
            </div>
            {/* Progress track */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-rose-500' : fillPercent > 80 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${fillPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-400">
              {isPastDeadline ? 'Registration Closed' : `By ${event.organizer_name || 'Organizer'}`}
            </span>
            <Link
              to={`/events/${event.id}`}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-all cursor-pointer text-center"
            >
              {isRegistered ? 'View Ticket' : 'Event Details →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
