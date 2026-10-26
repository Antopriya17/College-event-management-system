import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCampus } from '../../context/CampusContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

const PRESET_POSTERS = [
  { label: 'Technology / Code', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80' },
  { label: 'Hackathon / Innovation', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Robotics & Hardware', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80' },
  { label: 'AI & Data Science', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cultural & Performing Arts', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sports & Athletics', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80' },
  { label: 'Business & Pitch', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80' }
];

export const CreateEventPage: React.FC = () => {
  const { categories, departments, clubs, createEventProposal, showToast } = useCampus();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-tech');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-cse');
  const [clubId, setClubId] = useState('');
  const [venue, setVenue] = useState('');
  const [startAt, setStartAt] = useState('2026-11-25T09:00');
  const [endAt, setEndAt] = useState('2026-11-25T17:00');
  const [deadline, setDeadline] = useState('2026-11-23T23:59');
  const [capacity, setCapacity] = useState('100');
  const [eligibility, setEligibility] = useState('Open to all registered undergraduate and graduate students.');
  const [posterUrl, setPosterUrl] = useState(PRESET_POSTERS[0].url);
  const [contactInfo, setContactInfo] = useState('organizers@campus.edu');
  const [tagsStr, setTagsStr] = useState('Symposium, Campus, Workshop');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !venue.trim()) {
      showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    if (new Date(endAt) <= new Date(startAt)) {
      showToast('Event End Time must be strictly after Start Time.', 'error');
      return;
    }

    if (new Date(deadline) > new Date(endAt)) {
      showToast('Registration Deadline cannot be after the event ends.', 'error');
      return;
    }

    const selectedCategory = categories.find(c => c.id === categoryId);
    const selectedDept = departments.find(d => d.id === departmentId);
    const selectedClub = clubs.find(c => c.id === clubId);

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newEvent = createEventProposal({
      title: title.trim(),
      short_description: shortDesc.trim() || description.trim().substring(0, 120),
      description: description.trim(),
      category_id: categoryId,
      category_name: selectedCategory?.name,
      department_id: departmentId,
      department_name: selectedDept?.name,
      club_id: clubId || undefined,
      club_name: selectedClub?.name,
      venue: venue.trim(),
      start_at: new Date(startAt).toISOString(),
      end_at: new Date(endAt).toISOString(),
      registration_deadline: new Date(deadline).toISOString(),
      capacity: parseInt(capacity, 10) || 50,
      eligibility: eligibility.trim(),
      poster_url: posterUrl,
      contact_info: contactInfo.trim(),
      status: 'pending_approval',
      tags,
      schedule: [
        { time: '09:00 AM - 10:00 AM', activity: 'Inauguration & Registration Desk' },
        { time: '10:15 AM - 01:00 PM', activity: 'Morning Sessions & Technical Challenges' },
        { time: '02:00 PM - 05:00 PM', activity: 'Afternoon Track, Evaluations & Award Presentation' }
      ],
      rules: [
        'College ID card is compulsory for on-campus verification.',
        'Attendees must arrive on time to receive attendance credit and verified certificate.'
      ]
    });

    navigate(`/events/${newEvent.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back button */}
      <div>
        <Link
          to="/organizer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Organizer Studio
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Departmental Event Proposal Workflow</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create New Event Proposal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Proposals are saved to the persistent database and automatically routed to the designated faculty approver or administrative dean for review before publication.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
            1. Event Information
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NextGen Web & AI Symposium 2026"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Host Department *
              </label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Affiliated Club (Optional)
              </label>
              <select
                value={clubId}
                onChange={e => setClubId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="">No Specific Club</option>
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brief Summary (1-2 sentences)
            </label>
            <input
              type="text"
              placeholder="High-level description for cards and search snippets"
              value={shortDesc}
              onChange={e => setShortDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Event Description *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide complete event details, tracks, evaluation criteria, and speaker info..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Schedule & Venue */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
            2. Date, Venue & Capacity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Campus Venue / Hall *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Computing Auditorium Hall A"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Maximum Student Capacity *
              </label>
              <input
                type="number"
                min="5"
                max="5000"
                required
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={startAt}
                onChange={e => setStartAt(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={endAt}
                onChange={e => setEndAt(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Eligibility Criteria
            </label>
            <input
              type="text"
              value={eligibility}
              onChange={e => setEligibility(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Media Poster Selection */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
            3. Poster & Visuals
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select High-Quality Poster Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_POSTERS.map((preset, idx) => {
                const isSelected = posterUrl === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPosterUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                      isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-20 object-cover" />
                    <div className="p-1.5 bg-white text-[10px] font-bold text-slate-800 truncate">
                      {preset.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Or Custom Poster Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={posterUrl}
              onChange={e => setPosterUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Additional Tags & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="Symposium, Hackathon, Coding"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Convener Contact Email / Phone
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={e => setContactInfo(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Event will be queued for Faculty Review</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/organizer')}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Proposal for Review
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
