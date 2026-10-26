import React from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { Department, EventCategory } from '../../types';

interface EventFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  availabilityFilter: string;
  onAvailabilityChange: (av: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  departments: Department[];
  categories: EventCategory[];
  totalResults: number;
  onReset: () => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDepartment,
  onDepartmentChange,
  availabilityFilter,
  onAvailabilityChange,
  sortBy,
  onSortChange,
  departments,
  categories,
  totalResults,
  onReset
}) => {
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedDepartment !== 'all' ||
    availabilityFilter !== 'all' ||
    sortBy !== 'date-asc'
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* Top search & Sort bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event title, keyword, venue, or technology..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="date-asc">Upcoming First</option>
              <option value="popularity">Most Popular (Registrations)</option>
              <option value="newest">Recently Added</option>
              <option value="capacity-low">Fewest Spots Left</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Category selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={e => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Department
          </label>
          <select
            value={selectedDepartment}
            onChange={e => onDepartmentChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        {/* Availability selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Status & Availability
          </label>
          <select
            value={availabilityFilter}
            onChange={e => onAvailabilityChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="all">All Events</option>
            <option value="open">Seats Available Now</option>
            <option value="registered">My Registered Events</option>
            <option value="completed">Past / Completed Events</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Showing <strong className="text-slate-800">{totalResults}</strong> event{totalResults === 1 ? '' : 's'} matching criteria
        </span>
      </div>
    </div>
  );
};
