import React, { useState, useMemo } from "react";
import { MessageSquare, ArrowLeft, Loader, User, Zap, BookOpen, X } from "lucide-react";

// --- TYPE DEFINITION ---
interface Ticket {
    id: string;
    subject: string;
    raisedBy: string;
    role: string;
    date: string;
    status: "Open" | "In Progress" | "Resolved";
    urgency: "High" | "Medium" | "Low";
    assignedTo: string;
}

// --- DUMMY DATA ---
const initialTickets: Ticket[] = [
    {
        id: "TCK-101",
        subject: "Unable to access JavaScript course modules",
        raisedBy: "John Doe",
        role: "Student",
        date: "2025-03-10",
        status: "Open",
        urgency: "High",
        assignedTo: "Unassigned",
    },
    {
        id: "TCK-102",
        subject: "Payment not reflecting after 48 hours",
        raisedBy: "Sarah Lee",
        role: "Student",
        date: "2025-03-09",
        status: "In Progress",
        urgency: "Medium",
        assignedTo: "Support Team A",
    },
    {
        id: "TCK-103",
        subject: "Issue with assignment grading criteria for final project",
        raisedBy: "Mark Smith",
        role: "Instructor",
        date: "2025-03-08",
        status: "Resolved",
        urgency: "Low",
        assignedTo: "Support Team B",
    },
    {
        id: "TCK-104",
        subject: "Bug: Forum post button is not clickable on mobile",
        raisedBy: "Jane Foster",
        role: "Student",
        date: "2025-03-07",
        status: "Open",
        urgency: "High",
        assignedTo: "Unassigned",
    },
    {
        id: "TCK-105",
        subject: "Need access to archived data from 2024",
        raisedBy: "Dr. Elena Rossi",
        role: "Instructor",
        date: "2025-03-06",
        status: "In Progress",
        urgency: "Medium",
        assignedTo: "Support Team B",
    },
];

// List of possible internal team members/roles for assignment
const assigneeOptions = [
    "Support Team A", 
    "Support Team B", 
    "Admin: Alice Johnson", 
    "Admin: Bob Miller", 
    "Instructor: Dr. Smith"
];

// --- Custom Components for Tailwind Styling ---

interface ChipProps {
    label: string;
    type: 'status' | 'urgency' | 'role';
}

const TicketChip: React.FC<ChipProps> = ({ label, type }) => {
    let colorClasses = "bg-gray-100 text-gray-700";
    let Icon = null;

    if (type === 'status') {
        switch (label) {
            case "Open":
                colorClasses = "bg-amber-100 text-amber-700 ring-amber-500/10";
                Icon = BookOpen;
                break;
            case "In Progress":
                colorClasses = "bg-sky-100 text-sky-700 ring-sky-500/10";
                Icon = Loader;
                break;
            case "Resolved":
                colorClasses = "bg-green-100 text-green-700 ring-green-500/10";
                Icon = Zap;
                break;
        }
    } else if (type === 'urgency') {
        switch (label) {
            case "High":
                colorClasses = "bg-red-100 text-red-700 ring-red-500/10";
                Icon = Zap;
                break;
            case "Medium":
                colorClasses = "bg-yellow-100 text-yellow-700 ring-yellow-500/10";
                Icon = null; // No icon for Medium
                break;
            case "Low":
                colorClasses = "bg-gray-100 text-gray-700 ring-gray-500/10";
                Icon = null; // No icon for Low
                break;
        }
    } else if (type === 'role') {
        switch (label) {
            case "Student":
                colorClasses = "bg-indigo-100 text-indigo-700 ring-indigo-500/10";
                Icon = User;
                break;
            case "Instructor":
                colorClasses = "bg-purple-100 text-purple-700 ring-purple-500/10";
                Icon = BookOpen;
                break;
        }
    }

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses}`}>
            {Icon && <Icon size={12} className="mr-1" />}
            {label}
        </span>
    );
};

// Custom Select Component for cleaner Tailwind styling
interface CustomSelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, onChange, options }) => (
    <div className="relative w-full max-w-[160px] min-w-[120px]">
        <label className="absolute -top-2 left-3 px-1 text-xs font-medium text-gray-500 bg-white z-10">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full h-10 border border-gray-300 rounded-lg bg-white appearance-none p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700 relative text-sm font-medium transition-colors"
        >
            <option value="">All</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
        </div>
    </div>
);

// --- MODAL COMPONENT ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        // Changed background to semi-transparent black (bg-black/50) and added backdrop-blur-md for the effect
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all scale-100">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function SupportTicketsPage() {
    // Note: useNavigate is not available in this single-file environment, 
    // so we mock the back functionality with a console log.
    const mockNavigateBack = () => {
        console.log("Mock Navigation: Attempted to go back.");
    };

    const [filterStatus, setFilterStatus] = useState("");
    const [filterUrgency, setFilterUrgency] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [search, setSearch] = useState("");
    
    // State for Modal Management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<{ type: 'Assign' | 'Respond' | 'Escalate', ticket: Ticket } | null>(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState(''); // New state for assignee selection

    const filteredTickets = useMemo(() => {
        return initialTickets.filter(
            (t) =>
                (!filterStatus || t.status === filterStatus) &&
                (!filterUrgency || t.urgency === filterUrgency) &&
                (!filterRole || t.role === filterRole) &&
                (!search ||
                    t.subject.toLowerCase().includes(search.toLowerCase()) ||
                    t.raisedBy.toLowerCase().includes(search.toLowerCase()))
        );
    }, [filterStatus, filterUrgency, filterRole, search]);

    // Opens the modal and sets the current action context
    const handleActionClick = (type: 'Assign' | 'Respond' | 'Escalate', ticket: Ticket) => {
        setCurrentAction({ type, ticket });
        setIsModalOpen(true);
        setResponseMessage(''); // Clear any previous response text
        
        // If assigning, initialize the selected assignee to the current one
        if (type === 'Assign') {
            setSelectedAssignee(ticket.assignedTo === 'Unassigned' ? '' : ticket.assignedTo);
        } else {
            setSelectedAssignee('');
        }
    };
    
    // Handles the primary action inside the modal
    const handleConfirmAction = () => {
        if (!currentAction) return;

        console.group(`CONFIRMED ACTION: ${currentAction.type} for Ticket ${currentAction.ticket.id}`);
        console.log("Ticket Subject:", currentAction.ticket.subject);
        
        switch (currentAction.type) {
            case 'Assign':
                // Here you would typically send an API call to assign the ticket.
                console.log(`Action: Ticket reassigned.`);
                console.log(`NEW ASSIGNEE: "${selectedAssignee}"`);
                break;
            case 'Respond':
                // Here you would typically send an API call to submit the response.
                console.log(`Response Text: "${responseMessage}"`);
                console.log("Action: Response sent to user.");
                break;
            case 'Escalate':
                // Here you would typically send an API call to change the ticket's priority/owner.
                console.warn(`Action: Ticket escalated due to high urgency.`);
                break;
        }

        console.groupEnd();
        // Close modal after successful action
        setIsModalOpen(false);
        setCurrentAction(null);
        setSelectedAssignee('');
    };

    // Renders the dynamic content based on the selected action
    const renderModalContent = () => {
        if (!currentAction) return null;
        
        const { type, ticket } = currentAction;
        
        if (type === 'Respond') {
            return (
                <div className="space-y-4">
                    <p className="text-gray-700">Ticket ID: <span className="font-semibold">{ticket.id}</span></p>
                    <p className="text-gray-700">Subject: <span className="font-semibold">{ticket.subject}</span></p>
                    <textarea
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Type your response here..."
                        rows={5}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmAction} 
                            disabled={responseMessage.trim() === ''}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors 
                                ${responseMessage.trim() === '' ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
                        >
                            Send Response
                        </button>
                    </div>
                </div>
            );
        }
        
        if (type === 'Assign') {
            const isUnassigned = selectedAssignee === '' || selectedAssignee === 'Unassigned';
            
            return (
                <div className="space-y-4">
                    <p className="text-gray-700">Ticket ID: <span className="font-semibold">{ticket.id}</span></p>
                    <p className="text-gray-700 mb-4">Current Assignee: <span className="font-semibold">{ticket.assignedTo}</span></p>
                    
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select New Assignee</label>
                        <select
                            value={selectedAssignee}
                            onChange={(e) => setSelectedAssignee(e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-lg bg-white p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700 text-sm transition-colors appearance-none"
                        >
                            <option value="" disabled>-- Select a Team or User --</option>
                            {assigneeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 top-7">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmAction} 
                            disabled={isUnassigned}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors 
                                ${isUnassigned ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
                        >
                            Confirm Assignment
                        </button>
                    </div>
                </div>
            );
        }

        // Default confirmation for Escalate
        let message = '';
        let confirmText = '';
        let confirmColor = 'bg-sky-600 hover:bg-sky-700';

        if (type === 'Escalate') {
            message = `WARNING: Are you sure you want to ESCALATE ticket ${ticket.id} due to its high importance/stale status? This action cannot be easily undone.`;
            confirmText = 'Escalate Ticket';
            confirmColor = 'bg-red-600 hover:bg-red-700';
        }

        return (
            <div className="space-y-6">
                <p className="text-gray-700">{message}</p>
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleConfirmAction} className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${confirmColor}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 mb-3 sm:mb-0">
                    <MessageSquare size={28} className="text-sky-600" /> Support & Ticketing
                </h1>
                <button
                    onClick={mockNavigateBack}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>
            </div>

            {/* Filters Card */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg mb-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Filter Tickets</h2>
                <div className="flex gap-4 flex-wrap items-center">
                    
                    {/* Search Field */}
                    <div className="relative w-full max-w-xs min-w-[200px]">
                        <label className="absolute -top-2 left-3 px-1 text-xs font-medium text-gray-500 bg-white z-10">Search</label>
                        <input
                            type="text"
                            placeholder="Subject or User Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-lg bg-white p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700 text-sm transition-colors"
                        />
                    </div>
                    
                    {/* Status Filter */}
                    <CustomSelect
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        options={["Open", "In Progress", "Resolved"]}
                    />
                    
                    {/* Urgency Filter */}
                    <CustomSelect
                        label="Urgency"
                        value={filterUrgency}
                        onChange={(e) => setFilterUrgency(e.target.value)}
                        options={["High", "Medium", "Low"]}
                    />
                    
                    {/* User Role Filter */}
                    <CustomSelect
                        label="User Type"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        options={["Student", "Instructor"]}
                    />
                </div>
            </div>

            {/* Tickets Table Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-4 sm:p-5">
                    <h2 className="text-xl font-semibold text-gray-800">🎫 All Support Tickets ({filteredTickets.length})</h2>
                </div>
                
                <hr className="border-gray-200" />

                {/* Responsive Table Container */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Subject</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised By</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.id}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">{t.subject}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{t.raisedBy}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <TicketChip label={t.role} type="role" />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <TicketChip label={t.status} type="status" />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <TicketChip label={t.urgency} type="urgency" />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{t.assignedTo}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleActionClick('Assign', t)}
                                                    className="px-3 py-1 text-xs font-medium text-sky-600 border border-sky-600 rounded-md hover:bg-sky-50 transition-colors"
                                                >
                                                    Assign
                                                </button>
                                                <button
                                                    onClick={() => handleActionClick('Respond', t)}
                                                    className="px-3 py-1 text-xs font-medium text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700 transition-colors"
                                                >
                                                    Respond
                                                </button>
                                                <button
                                                    onClick={() => handleActionClick('Escalate', t)}
                                                    className="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                                                >
                                                    Escalate
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-6 py-10 text-center text-lg text-gray-500">
                                        No tickets match the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Action Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={currentAction ? `${currentAction.type} Ticket: ${currentAction.ticket.id}` : "Action"}
            >
                {renderModalContent()}
            </Modal>
        </div>
    );
}
