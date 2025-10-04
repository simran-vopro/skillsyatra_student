import React, { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, User, BookOpen, Clock, Tag, Filter, CheckCircle, List, AlertTriangle } from 'lucide-react';

// --- CONSTANTS & TYPE DEFINITIONS ---

const STUDENT_ID = 'stud-1';
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0); // Normalize to midnight

interface Course {
  id: string;
  name: string;
}

interface Venue {
  id: string;
  name: string;
  location: string;
}

interface Instructor {
  id: string;
  name: string;
}

interface PracticalSession {
  id: string;
  courseId: string;
  venueId: string;
  instructorId: string;
  startTime: string; // ISO string for the date and time
  capacity: number;
  bookedSeats: number;
  students: string[]; // Array of student IDs who have booked
}

type SessionStatus = 'full' | 'almost-full' | 'available' | 'booked';

// --- MOCK DATA ---
const MOCK_COURSES: Course[] = [
  { id: 'C101', name: 'Advanced React' },
  { id: 'C102', name: 'Python for Data Science' },
  { id: 'C103', name: 'Cloud Infrastructure' },
];

const MOCK_VENUES: Venue[] = [
  { id: 'V1', name: 'Lab 2', location: 'Delhi Center' },
  { id: 'V2', name: 'Virtual Room A', location: 'Online' },
  { id: 'V3', name: 'Workshop Hall', location: 'Bangalore Center' },
];

const MOCK_INSTRUCTORS: Instructor[] = [
  { id: 'I1', name: 'Ms. Jane Doe' },
  { id: 'I2', name: 'Mr. Alex Ray' },
  { id: 'I3', name: 'Mr. Sharma' },
];

// Helper to find name from ID
const COURSE_MAP = MOCK_COURSES.reduce((map, c) => ({ ...map, [c.id]: c.name }), {} as Record<string, string>);
const VENUE_MAP = MOCK_VENUES.reduce((map, v) => ({ ...map, [v.id]: v.name }), {} as Record<string, string>);
const INSTRUCTOR_MAP = MOCK_INSTRUCTORS.reduce((map, i) => ({ ...map, [i.id]: i.name }), {} as Record<string, string>);

const MOCK_PRACTICALS: PracticalSession[] = [
  // Past/Full Slot - Booked by stud-1
  { id: 'P1', courseId: 'C101', venueId: 'V1', instructorId: 'I3', startTime: '2025-09-28T10:00:00.000Z', capacity: 5, bookedSeats: 5, students: ['stud-1', 'stud-2', 'stud-3', 'stud-4', 'stud-5'] },
  // Full Slot (Red) - NOT Booked
  { id: 'P2', courseId: 'C102', venueId: 'V2', instructorId: 'I1', startTime: '2025-10-15T14:00:00.000Z', capacity: 10, bookedSeats: 10, students: ['s2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'] },
  // Almost Full Slot (Orange) - Booked by stud-1
  { id: 'P3', courseId: 'C101', venueId: 'V1', instructorId: 'I3', startTime: '2025-10-17T09:00:00.000Z', capacity: 10, bookedSeats: 9, students: [STUDENT_ID, 'stud-2', 's3', 's4', 's5', 's6', 's7', 's8'] },
  // Available Slot (Green) - NOT Booked
  { id: 'P4', courseId: 'C103', venueId: 'V3', instructorId: 'I2', startTime: '2025-10-20T11:00:00.000Z', capacity: 15, bookedSeats: 5, students: ['stud-2', 's3', 's4', 's5', 's6'] },
  // Available Slot (Green) - Booked by stud-1
  { id: 'P5', courseId: 'C101', venueId: 'V1', instructorId: 'I3', startTime: '2025-10-20T14:00:00.000Z', capacity: 8, bookedSeats: 3, students: [STUDENT_ID, 'stud-2', 'stud-3'] },
  // Second session on the same day for P4, P5
  { id: 'P6', courseId: 'C103', venueId: 'V3', instructorId: 'I2', startTime: '2025-10-20T16:00:00.000Z', capacity: 15, bookedSeats: 14, students: ['stud-2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15'] },
];

// --- UTILITY FUNCTIONS ---

const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const days: Date[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const getSessionStatus = (session: PracticalSession): SessionStatus => {
  const available = session.capacity - session.bookedSeats;
  const isBooked = session.students.includes(STUDENT_ID);

  if (isBooked) return 'booked';
  if (available === 0) return 'full';
  if (available <= session.capacity * 0.2) return 'almost-full'; // 20% or less
  return 'available';
};

// --- COMPONENTS ---

interface CalendarDayProps {
  day: Date;
  currentMonth: number;
  sessions: PracticalSession[];
  selectedDate: Date | null;
  onDayClick: (date: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, currentMonth, sessions, selectedDate, onDayClick }) => {
  const isToday = formatDate(day) === formatDate(TODAY);
  const isPast = day < TODAY;
  const isSelected = selectedDate && formatDate(day) === formatDate(selectedDate);
  const isInMonth = day.getMonth() === currentMonth;

  const availableSessions = sessions.filter(s => getSessionStatus(s) !== 'full');
  const hasBooked = sessions.some(s => getSessionStatus(s) === 'booked');
  const isFullDay = sessions.length > 0 && availableSessions.length === 0;

  let dayClasses = `p-2 h-24 flex flex-col justify-between cursor-pointer transition-all duration-150 rounded-lg`;
  // let countClasses = 'h-2 w-2 rounded-full'; // Unused, keeping for context

  if (!isInMonth) {
    dayClasses += ' text-gray-400 bg-gray-50 pointer-events-none';
  } else if (isPast || isFullDay) {
    dayClasses += ' bg-red-50 text-gray-500 pointer-events-none opacity-60';
  } else {
    dayClasses += ' hover:bg-indigo-100';
  }

  if (isSelected) {
    dayClasses = dayClasses.replace('bg-gray-50', '').replace('hover:bg-indigo-100', '') + ' ring-2 ring-offset-2 ring-indigo-500 bg-indigo-200 shadow-md';
  }

  // Determine the color indicator for the day based on available sessions
  let indicatorColor = 'hidden';
  if (availableSessions.length > 0) {
    const hasAlmostFull = availableSessions.some(s => getSessionStatus(s) === 'almost-full');
    const hasAvailable = availableSessions.some(s => getSessionStatus(s) === 'available');

    if (hasAlmostFull) indicatorColor = 'bg-orange-500'; // Orange (almost full) takes precedence
    else if (hasAvailable) indicatorColor = 'bg-green-500'; // Green (available)

  } else if (isFullDay) {
    indicatorColor = 'bg-red-500'; // Red (Full)
  }

  const handleClick = () => {
    if (!isPast && !isFullDay && isInMonth) {
      onDayClick(day);
    }
  }

  const sessionsAvailableText = sessions.length === 0 ? 'No sessions' :
    isFullDay ? 'All slots full' :
      `${availableSessions.length} available slot${availableSessions.length !== 1 ? 's' : ''}`;


  return (
    <div
      className={dayClasses}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-semibold ${isToday ? 'text-indigo-700 font-extrabold' : ''}`}>
          {day.getDate()}
        </span>
        {hasBooked && (
          <Tag size={16} className="text-green-600 fill-green-200" title="You are booked on this date" />
        )}
      </div>
      <div className="mt-auto flex flex-col items-center space-y-1">
        <span className={`text-xs text-gray-600 ${isFullDay ? 'text-red-600 font-medium' : hasBooked ? 'text-green-600 font-medium' : ''}`}>
          {sessions.length > 0 ? sessionsAvailableText : ''}
        </span>
        <div className={`w-10 h-1 rounded-full ${indicatorColor}`} title={sessionsAvailableText} />
      </div>
    </div>
  );
};


interface BookedPracticalCardProps {
  session: PracticalSession;
  onUnbook: (sessionId: string) => void;
}

const BookedPracticalCard: React.FC<BookedPracticalCardProps> = ({ session, onUnbook }) => {
  const sessionDate = new Date(session.startTime);
  const startTime = sessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isPast = sessionDate < TODAY;

  const cardClass = isPast
    ? 'border-l-4 border-gray-400 bg-gray-50 opacity-70'
    : 'border-l-4 border-green-500 bg-white shadow-lg hover:shadow-xl transition-shadow';

  const buttonClass = isPast
    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
    : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700';

  return (
    <div className={`p-4 rounded-xl ${cardClass}`}>
      <div className="flex justify-between items-start mb-3">
        {/* Header: Course Name & Status */}
        <h4 className="font-bold text-lg text-gray-900 flex items-center">
          <CheckCircle size={20} className="mr-2 text-green-600 fill-green-200" />
          {COURSE_MAP[session.courseId]}
        </h4>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${isPast ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
          {isPast ? 'COMPLETED' : 'CONFIRMED'}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-700 border-t border-gray-200 pt-3">
        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-2">
          <p className="flex items-center"><Clock size={16} className="mr-2 text-indigo-500" />
            <span className="font-medium">Date & Time:</span> {dateString} at {startTime}</p>
          <p className="flex items-center"><User size={16} className="mr-2 text-green-500" />
            <span className="font-medium">Instructor:</span> {INSTRUCTOR_MAP[session.instructorId]}</p>
          <p className="flex items-center"><MapPin size={16} className="mr-2 text-red-500" />
            <span className="font-medium">Venue:</span> {VENUE_MAP[session.venueId]}</p>
          <p className="flex items-center"><Tag size={16} className="mr-2 text-yellow-500" />
            <span className="font-medium">Capacity:</span> {session.capacity} Seats</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 flex justify-end border-t border-gray-200 pt-3">
        <button
          onClick={() => onUnbook(session.id)}
          disabled={isPast}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-md ${buttonClass}`}
        >
          {isPast ? 'Session Completed' : 'Cancel Booking'}
        </button>
      </div>
    </div>
  );
};

/**
 * Practical Sessions Booking Calendar (Student View)
 */
export default function PracticalBookingCalendar() {
  const [currentDate, setCurrentDate] = useState(TODAY);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [allPracticals, setAllPracticals] = useState<PracticalSession[]>(MOCK_PRACTICALS);
  const [rightPanelMode, setRightPanelMode] = useState<'details' | 'booked'>('booked'); // New state for right panel
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null); // State for flash message

  // --- FILTERS STATE ---
  const [filters, setFilters] = useState({
    course: '', // ID
    venue: '',  // ID
  });

  const selectedSessionDate = selectedDate ? formatDate(selectedDate) : null;

  // --- COMPUTED VALUES ---

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 1. Filter sessions based on user selection
  const filteredPracticals = useMemo(() => {
    return allPracticals.filter(p => {
      if (filters.course && p.courseId !== filters.course) return false;
      if (filters.venue && p.venueId !== filters.venue) return false;
      return true;
    });
  }, [allPracticals, filters]);

  // 2. Group sessions by date for the calendar grid
  const sessionsByDate = useMemo(() => {
    return filteredPracticals.reduce((acc, session) => {
      const dateStr = session.startTime.split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(session);
      return acc;
    }, {} as Record<string, PracticalSession[]>);
  }, [filteredPracticals]);

  // 3. Get the days for the current month view
  const daysInView = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);

  // 4. Get the detailed sessions for the selected date
  const sessionsOnSelectedDate = useMemo(() => {
    return selectedSessionDate ? (sessionsByDate[selectedSessionDate] || []) : [];
  }, [sessionsByDate, selectedSessionDate]);
  
  // 5. Get all booked sessions for the student
  const bookedPracticals = useMemo(() => {
    return allPracticals
      .filter(p => p.students.includes(STUDENT_ID))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [allPracticals]);


  // --- HANDLERS ---

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    setSelectedDate(null); // Reset selected date on month change
    setRightPanelMode('details'); // Switch back to details view
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setRightPanelMode('details'); // Ensure we are on details mode
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setSelectedDate(null); // Reset selection when filters change
  };

  const handleBookSlot = useCallback((sessionId: string) => {
    setAllPracticals(prevPracticals => prevPracticals.map(p => {
      if (p.id === sessionId && !p.students.includes(STUDENT_ID)) {
        return {
          ...p,
          bookedSeats: p.bookedSeats + 1,
          students: [...p.students, STUDENT_ID]
        };
      }
      return p;
    }));
    setFlashMessage({ type: 'success', text: `Slot booked for ${COURSE_MAP[allPracticals.find(p => p.id === sessionId)?.courseId || '']}` });
    setTimeout(() => setFlashMessage(null), 3000);
  }, [allPracticals]);

  const handleUnbookSlot = useCallback((sessionId: string) => {
    const session = allPracticals.find(p => p.id === sessionId);
    if (!session || new Date(session.startTime) < TODAY) {
      setFlashMessage({ type: 'error', text: 'Cannot cancel booking for a past session.' });
      setTimeout(() => setFlashMessage(null), 3000);
      return;
    }

    setAllPracticals(prevPracticals => prevPracticals.map(p => {
      if (p.id === sessionId && p.students.includes(STUDENT_ID)) {
        return {
          ...p,
          bookedSeats: p.bookedSeats - 1,
          students: p.students.filter(id => id !== STUDENT_ID)
        };
      }
      return p;
    }));
    setFlashMessage({ type: 'success', text: `Booking cancelled for ${COURSE_MAP[session.courseId]}` });
    setTimeout(() => setFlashMessage(null), 3000);
  }, [allPracticals]);


  // --- RENDER FUNCTIONS ---

  const renderFilters = () => (
    <div className="p-4 border-b bg-white flex flex-wrap gap-4 items-center">
      <Filter size={20} className="text-indigo-600 flex-shrink-0" />

      <select name="course" value={filters.course} onChange={handleFilterChange} className="p-2 border rounded-lg text-sm flex-1 min-w-[150px] focus:ring-indigo-500 focus:border-indigo-500">
        <option value="">All Courses</option>
        {MOCK_COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select name="venue" value={filters.venue} onChange={handleFilterChange} className="p-2 border rounded-lg text-sm flex-1 min-w-[150px] focus:ring-indigo-500 focus:border-indigo-500">
        <option value="">All Venues</option>
        {MOCK_VENUES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
      </select>

      <button onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')} className="p-2 border rounded-lg text-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors shadow-sm">
        {viewMode === 'month' ? 'Switch to Week' : 'Switch to Month'}
      </button>
    </div>
  );

  const renderSessionDetails = () => {
    if (!selectedDate || sessionsOnSelectedDate.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500 bg-white min-h-[400px]">
          <BookOpen size={48} className="mx-auto text-gray-300 mt-12" />
          <p className="mt-4 font-semibold">
            {selectedDate ? `No sessions found for ${selectedDate.toLocaleDateString()} after filtering.` : 'Select a date on the calendar.'}
          </p>
          <p className="text-sm">Click on any clickable date to view and book slots.</p>
        </div>
      );
    }

    return (
      <div className="p-6 bg-white overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-indigo-600" />
          Slots for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>

        <div className="space-y-4">
          {sessionsOnSelectedDate
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map(session => {
              const status = getSessionStatus(session);
              const isBooked = status === 'booked';
              const isFull = status === 'full';
              const availableSeats = session.capacity - session.bookedSeats;
              const startTime = new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              const isPast = new Date(session.startTime) < TODAY;

              let cardClass = 'p-4 rounded-xl shadow-md border-l-4';
              let buttonClass = 'px-4 py-2 rounded-lg font-semibold text-sm transition-colors';

              if (isPast) {
                cardClass += ' border-gray-400 bg-gray-50 opacity-60';
                buttonClass = 'bg-gray-300 text-gray-500 cursor-not-allowed';
              }
              else if (isBooked) {
                cardClass += ' border-green-500 bg-green-50';
                buttonClass = 'bg-red-500 text-white hover:bg-red-600';
              } else if (isFull) {
                cardClass += ' border-red-500 bg-red-50 opacity-70';
                buttonClass = 'bg-gray-300 text-gray-500 cursor-not-allowed';
              } else if (status === 'almost-full') {
                cardClass += ' border-orange-500 bg-orange-50';
                buttonClass = 'bg-orange-500 text-white hover:bg-orange-600';
              } else {
                cardClass += ' border-indigo-500 bg-indigo-50';
                buttonClass = 'bg-indigo-600 text-white hover:bg-indigo-700';
              }

              return (
                <div key={session.id} className={cardClass}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-gray-900 flex items-center">
                      <Clock size={18} className="mr-2" />
                      {startTime}
                    </h4>
                    {isBooked && (
                      <span className="text-green-600 font-bold flex items-center">
                        <CheckCircle size={16} className="mr-1 fill-green-200" /> BOOKED
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="flex items-center"><BookOpen size={16} className="mr-2 text-indigo-500" />
                      <span className="font-medium">Course:</span> {COURSE_MAP[session.courseId]}</p>
                    <p className="flex items-center"><MapPin size={16} className="mr-2 text-red-500" />
                      <span className="font-medium">Venue:</span> {VENUE_MAP[session.venueId]} ({MOCK_VENUES.find(v => v.id === session.venueId)?.location})</p>
                    <p className="flex items-center"><User size={16} className="mr-2 text-green-500" />
                      <span className="font-medium">Instructor:</span> {INSTRUCTOR_MAP[session.instructorId]}</p>
                    <p className="flex items-center"><Users size={16} className="mr-2 text-yellow-500" />
                      <span className="font-medium">Available Seats:</span> {availableSeats} / {session.capacity}</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    {isBooked ? (
                      <button onClick={() => handleUnbookSlot(session.id)} disabled={isPast} className={buttonClass}>
                        {isPast ? 'Completed' : 'Cancel Booking'}
                      </button>
                    ) : (
                      <button onClick={() => handleBookSlot(session.id)} disabled={isFull || isPast} className={buttonClass}>
                        {isPast ? 'Session Passed' : isFull ? 'FULLY BOOKED' : '📌 Book Slot'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const renderBookedList = () => {
    if (bookedPracticals.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500 bg-white min-h-[400px]">
          <BookOpen size={48} className="mx-auto text-indigo-300 mt-12" />
          <p className="mt-4 font-semibold">
            You currently have no practical sessions booked.
          </p>
          <p className="text-sm">Use the calendar view to find and book your next slot!</p>
        </div>
      );
    }

    return (
      <div className="p-6 bg-gray-50 overflow-y-auto space-y-4">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
          <List size={20} className="mr-2 text-indigo-600" />
          Total Bookings: {bookedPracticals.length}
        </h3>
        <div className="space-y-4">
          {bookedPracticals.map(session => (
            <BookedPracticalCard key={session.id} session={session} onUnbook={handleUnbookSlot} />
          ))}
        </div>
      </div>
    );
  };

  const getRightPanelContent = () => {
    if (rightPanelMode === 'booked') {
      return renderBookedList();
    }
    return renderSessionDetails();
  }

  // --- MAIN RENDER ---

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans">
      <style>{`
        /* Custom scrollbar for better aesthetics */
        .overflow-y-auto::-webkit-scrollbar {
            width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background-color: #94a3b8;
        }
      `}</style>
      <div className="flex flex-col lg:flex-row w-full overflow-hidden">

        {/* Left Panel: Calendar and Filters */}
        <div className="lg:w-2/3 flex flex-col border-r border-gray-200 bg-white">
          <h1 className="p-4 text-2xl font-bold text-indigo-800 bg-indigo-50 border-b flex items-center">
            <Calendar size={28} className="mr-3" /> Practical Booking Calendar
          </h1>

          {renderFilters()}

          {/* Calendar Header */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
            <button onClick={() => handleMonthChange('prev')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </h2>
            <button onClick={() => handleMonthChange('next')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 bg-gray-100 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-7 gap-1 p-2 bg-white">
            {daysInView.map((day, index) => (
              <CalendarDay
                key={index}
                day={day}
                currentMonth={currentMonth}
                sessions={sessionsByDate[formatDate(day)] || []}
                selectedDate={selectedDate}
                onDayClick={handleDayClick}
              />
            ))}
          </div>
        </div>

        {/* Right Panel: Practical Slot Details / Booked List */}
        <div className="lg:w-1/3 flex flex-col bg-gray-50 relative">

          {/* Toggle Header */}
          <div className="flex justify-between p-2 bg-gray-100 border-b shadow-sm">
            <button
              onClick={() => setRightPanelMode('booked')}
              className={`flex-1 text-center py-3 px-2 text-sm font-semibold transition-colors rounded-lg ${rightPanelMode === 'booked' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <List size={18} className="inline-block mr-1" /> My Booked List ({bookedPracticals.length})
            </button>
            <button
              onClick={() => setRightPanelMode('details')}
              className={`flex-1 text-center py-3 px-2 text-sm font-semibold transition-colors rounded-lg ${rightPanelMode === 'details' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <Calendar size={18} className="inline-block mr-1" /> Slot Details
            </button>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
             {getRightPanelContent()}
          </div>

          {/* Flash Message Overlay */}
          {flashMessage && (
            <div className={`absolute bottom-4 right-4 p-3 rounded-lg shadow-xl text-white font-medium flex items-center transition-opacity duration-300 ${flashMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {flashMessage.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <AlertTriangle size={20} className="mr-2" />}
              {flashMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
