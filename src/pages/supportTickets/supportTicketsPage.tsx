import React, { useState, useMemo } from 'react';
import { PlusCircle, Ticket, Clock, MessageSquare, AlertTriangle, ChevronDown, CheckCircle, XCircle, Loader, Filter, Send } from 'lucide-react';

// Global variables for Firebase (not used in this mock, but kept for context)
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- TYPE DEFINITIONS & MOCK DATA ---

type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
type TicketType = 'Technical' | 'Payment' | 'Course Content' | 'Account' | 'Other';
type ViewState = 'list' | 'new';

interface Course {
    id: string;
    name: string;
}

interface SupportTicket {
    id: string;
    subject: string;
    type: TicketType;
    courseId?: string;
    courseName?: string;
    description: string;
    status: TicketStatus;
    lastUpdated: string; // ISO date string
    priority: 'Low' | 'Medium' | 'High';
}

const MOCK_COURSES: Course[] = [
    { id: 'C101', name: 'Intro to Web Development' },
    { id: 'C205', name: 'Advanced React Hooks' },
    { id: 'C310', name: 'Cloud Infrastructure Tier' },
    { id: 'C400', name: 'Python for Data Science' },
];

const INITIAL_TICKETS: SupportTicket[] = [
    {
        id: 'TKT-001A',
        subject: 'Cannot access lecture video 5 in C205',
        type: 'Course Content',
        courseId: 'C205',
        courseName: 'Advanced React Hooks',
        description: 'The video player just shows a black screen and an error message.',
        status: 'Open',
        lastUpdated: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        priority: 'High',
    },
    {
        id: 'TKT-002B',
        subject: 'Need invoice for March payment',
        type: 'Payment',
        courseId: 'C310',
        courseName: 'Cloud Infrastructure Tier',
        description: 'I need a PDF invoice for my last monthly subscription payment for tax purposes.',
        status: 'In Progress',
        lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        priority: 'Medium',
    },
    {
        id: 'TKT-003C',
        subject: 'Login button is broken on mobile',
        type: 'Technical',
        description: 'When I try to log in on my iPhone, the login button is unresponsive.',
        status: 'Resolved',
        lastUpdated: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
        priority: 'Low',
    },
];

// --- UTILITY COMPONENTS ---

// Custom alert/message box implementation instead of window.alert()
const useAppAlert = () => {
    return (message: string, title: string = 'Information') => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
          <div class="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
            <h3 class="text-xl font-bold mb-3 text-indigo-700">${title}</h3>
            <p class="text-gray-700 text-sm">${message}</p>
            <button id="closeAlert" class="mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
              Close
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('closeAlert')?.addEventListener('click', () => document.body.removeChild(modal));
    };
};

// Component to display status chips
interface StatusChipProps {
    status: TicketStatus;
}
const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
    let colorClasses = "bg-gray-100 text-gray-700 ring-gray-500/10";
    let Icon = Loader;

    switch (status) {
        case "Open":
            colorClasses = "bg-red-100 text-red-700 ring-red-500/10";
            Icon = AlertTriangle;
            break;
        case "In Progress":
            colorClasses = "bg-blue-100 text-blue-700 ring-blue-500/10";
            Icon = Loader;
            break;
        case "Resolved":
            colorClasses = "bg-green-100 text-green-700 ring-green-500/10";
            Icon = CheckCircle;
            break;
        case "Closed":
            colorClasses = "bg-gray-200 text-gray-600 ring-gray-500/10";
            Icon = XCircle;
            break;
    }

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses}`}>
            <Icon size={14} className="mr-1" /> {status}
        </span>
    );
};

// Component to display priority chips
interface PriorityChipProps {
    priority: 'Low' | 'Medium' | 'High';
}
const PriorityChip: React.FC<PriorityChipProps> = ({ priority }) => {
    let colorClasses = "bg-gray-100 text-gray-700";

    switch (priority) {
        case "High":
            colorClasses = "bg-red-500 text-white";
            break;
        case "Medium":
            colorClasses = "bg-yellow-500 text-white";
            break;
        case "Low":
            colorClasses = "bg-green-500 text-white";
            break;
    }

    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colorClasses}`}>
            {priority}
        </span>
    );
};

// --- SUB-COMPONENT: NEW TICKET FORM ---

interface NewTicketFormProps {
    onBack: () => void;
    onSubmit: (newTicket: Omit<SupportTicket, 'id' | 'status' | 'lastUpdated'>) => void;
    courses: Course[];
}

const NewTicketForm: React.FC<NewTicketFormProps> = ({ onBack, onSubmit, courses }) => {
    const [subject, setSubject] = useState('');
    const [type, setType] = useState<TicketType | ''>('');
    const [courseId, setCourseId] = useState<string>('');
    const [description, setDescription] = useState('');
    const alert = useAppAlert();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject || !type || !description) {
            alert('Please fill in all required fields (Subject, Type, and Description).', 'Missing Information');
            return;
        }

        const selectedCourse = courses.find(c => c.id === courseId);

        onSubmit({
            subject,
            type: type as TicketType,
            courseId: selectedCourse?.id,
            courseName: selectedCourse?.name,
            description,
            priority: 'Medium', // Default priority, can be calculated later
        });
        
        // Reset form
        setSubject('');
        setType('');
        setCourseId('');
        setDescription('');
        onBack();
    };

    const handleFileUpload = () => {
         alert('File upload mocked. In a real app, this would open a file dialog and handle the upload process.', 'File Upload Mock');
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <header className="mb-6 flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
                    <PlusCircle size={24} className="mr-2" /> Submit a New Ticket
                </h2>
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Subject */}
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Error on checkout, Quiz feedback, Video not loading"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Select Type */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Ticket Type <span className="text-red-500">*</span></label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value as TicketType)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition duration-150 bg-white"
                            required
                        >
                            <option value="">Select a type...</option>
                            {(['Technical', 'Payment', 'Course Content', 'Account', 'Other'] as TicketType[]).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Course Selector */}
                    <div>
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Associated Course (Optional)</label>
                        <select
                            id="course"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition duration-150 bg-white"
                        >
                            <option value="">Select a course...</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Detailed Description <span className="text-red-500">*</span></label>
                    <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide as much detail as possible about your issue or question."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        required
                    ></textarea>
                </div>

                {/* File Upload Mock */}
                <div className="flex justify-between items-center p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600">Attach Screenshot or File (Optional)</p>
                    <button
                        type="button"
                        onClick={handleFileUpload}
                        className="px-3 py-1 text-sm font-medium text-indigo-600 border border-indigo-400 rounded-lg bg-white hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                        Browse Files
                    </button>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-[1.01]"
                    >
                        <Send size={20} className="mr-2" /> Submit Ticket
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- SUB-COMPONENT: TICKET LIST VIEW ---

interface TicketListViewProps {
    tickets: SupportTicket[];
    onNewTicket: () => void;
}

const TicketListView: React.FC<TicketListViewProps> = ({ tickets, onNewTicket }) => {
    const alert = useAppAlert();
    
    // Sort tickets: Open/In Progress first, then by last updated (newest first)
    const sortedTickets = useMemo(() => {
        const statusOrder: Record<TicketStatus, number> = { 'Open': 1, 'In Progress': 2, 'Resolved': 3, 'Closed': 4 };
        return [...tickets].sort((a, b) => {
            if (statusOrder[a.status] !== statusOrder[b.status]) {
                return statusOrder[a.status] - statusOrder[b.status];
            }
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        });
    }, [tickets]);

    const handleViewConversation = (id: string) => {
        alert(`Opening conversation for Ticket ID: ${id}. (Mock Action)`, 'Ticket Conversation');
    };

    const timeSince = (dateString: string) => {
        const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Ticket size={24} className="mr-2 text-indigo-500" /> Your Support Tickets ({tickets.length})
                </h2>
                <div className="flex space-x-3 mt-3 sm:mt-0">
                    <button
                         onClick={onNewTicket}
                         className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                     >
                         <PlusCircle size={18} className="mr-2" /> New Ticket
                     </button>
                    {/* Mock Filter */}
                    <button
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                        onClick={() => alert('Filtering options (by status, type, etc.) would appear here.', 'Filter Mock')}
                    >
                        <Filter size={18} className="mr-1" /> Filter
                    </button>
                </div>
            </div>

            {tickets.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    ID
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                    Subject & Type
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {sortedTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-indigo-50/50 transition-colors">
                                    {/* ID */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                        {ticket.id}
                                    </td>
                                    
                                    {/* Subject & Type */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                                        <p className="font-semibold text-indigo-700">{ticket.subject}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs text-gray-500 block">Type: {ticket.type}</span>
                                            <PriorityChip priority={ticket.priority} />
                                        </div>
                                        {ticket.courseName && (
                                            <span className="text-xs text-gray-400 block mt-0.5 italic">Course: {ticket.courseName}</span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                        <StatusChip status={ticket.status} />
                                    </td>
                                    
                                    {/* Last Updated */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                        <Clock size={16} className="mr-1 text-gray-400" />
                                        {timeSince(ticket.lastUpdated)}
                                    </td>

                                    {/* Action */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewConversation(ticket.id)}
                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-400 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors shadow-sm"
                                        >
                                            <MessageSquare size={14} className="mr-1" />
                                            View Conversation
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-12">
                    <Ticket size={48} className="mx-auto text-gray-300" />
                    <p className="mt-4 text-lg font-semibold text-gray-600">No support tickets found.</p>
                    <p className="text-sm text-gray-500">Click "New Ticket" to raise an issue or question.</p>
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function StudentHelpdesk() {
    const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
    const [view, setView] = useState<ViewState>('list');
    const mockNavigateBack = () => console.log("Mock Navigation: Back to Dashboard");
    
    const handleTicketSubmit = (newTicketData: Omit<SupportTicket, 'id' | 'status' | 'lastUpdated'>) => {
        const newTicket: SupportTicket = {
            ...newTicketData,
            id: `TKT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            status: 'Open',
            lastUpdated: new Date().toISOString(),
        };
        
        // Add new ticket to the state and simulate data saving (e.g., to Firestore)
        setTickets([newTicket, ...tickets]); 
        useAppAlert()('Your new ticket has been successfully submitted! A support agent will respond shortly.', 'Ticket Submitted');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
            <div>
                
                {/* Header */}
                <header className="mb-8 border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center">
                        <Ticket size={32} className="mr-3 text-indigo-500" /> Student Helpdesk
                    </h1>
                    <button
                        onClick={mockNavigateBack}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors mt-3 sm:mt-0"
                    >
                        <ChevronDown size={16} className="mr-2 transform rotate-90" /> Back to Dashboard
                    </button>
                </header>

                {/* Main View Switch */}
                {view === 'list' ? (
                    <TicketListView 
                        tickets={tickets} 
                        onNewTicket={() => setView('new')}
                    />
                ) : (
                    <NewTicketForm
                        onBack={() => setView('list')}
                        onSubmit={handleTicketSubmit}
                        courses={MOCK_COURSES}
                    />
                )}
            </div>
        </div>
    );
}
