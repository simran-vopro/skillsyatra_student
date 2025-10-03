import { Megaphone, ArrowLeft, Check, X, Send, AlertTriangle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Dummy announcements submitted by instructors
const announcements = [
    {
        id: "ANN-101",
        title: "Upcoming Workshop: React Advanced",
        content: "We are organizing a hands-on React workshop next month. Registration opens next week.",
        submittedBy: "Instructor John",
        date: "2025-03-10",
        status: "Pending",
    },
    {
        id: "ANN-102",
        title: "Deadline Reminder for Assignments",
        content: "All students must submit their assignments by March 15. Late submissions will not be accepted.",
        submittedBy: "Instructor Sarah",
        date: "2025-03-09",
        status: "Approved",
    },
    {
        id: "ANN-103",
        title: "Lab Maintenance Notice",
        content: "The design lab will be closed for maintenance this weekend (March 16-17). Please plan accordingly.",
        submittedBy: "Instructor Alex",
        date: "2025-03-07",
        status: "Rejected",
    },
];

// Helper function to map status to Tailwind styles
const getStatusProps = (status: string) => {
    switch (status) {
        case "Pending":
            return { color: "text-amber-700", bgColor: "bg-amber-100", label: "Pending" };
        case "Approved":
            return { color: "text-green-700", bgColor: "bg-green-100", label: "Approved" };
        case "Rejected":
            return { color: "text-red-700", bgColor: "bg-red-100", label: "Rejected" };
        default:
            return { color: "text-gray-700", bgColor: "bg-gray-100", label: "Draft" };
    }
};

// Reusable Card component for structure
const ManagementCard = ({ title, children, className = "" }: { title: string; children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
        <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

export default function AnnouncementManagementPage() {
    const navigate = useNavigate();
    const [targetRole, setTargetRole] = useState("Students");
    const [alertMessage, setAlertMessage] = useState("");
    const [targetedMessage, setTargetedMessage] = useState("");

    const handleApprove = (id: string) => console.log("Approve Announcement:", id);
    const handleReject = (id: string) => console.log("Reject Announcement:", id);
    const handleSendAlert = () => console.log("Send Platform Alert:", alertMessage);
    const handleSendTargetedMessage = () => console.log(`Send Targeted Message to ${targetRole}:`, targetedMessage);

    return (
        <div className="bg-gray-50 min-h-screen p-6 md:p-10">
            
            {/* Header - Professional and Clear */}
            <header className="flex justify-between items-center pb-4 mb-8 border-b border-slate-200">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
                    <Megaphone size={28} className="text-blue-600" /> Announcement & Communication Hub
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-1 rounded-md transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                </button>
            </header>

            {/* Announcement Submission Review Section */}
            <ManagementCard title="📢 Review Submitted Announcements" className="mb-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">
                                    Announcement Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                                    Submitted By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {announcements.map((a) => {
                                const { color, bgColor, label } = getStatusProps(a.status);
                                return (
                                    <tr key={a.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{a.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-base font-semibold text-slate-800">{a.title}</p>
                                            <p className="text-sm text-gray-500 italic mt-0.5">{a.content}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {a.submittedBy} <span className="text-xs text-gray-400 block">on {a.date}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${color}`}>
                                                {label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {a.status === "Pending" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(a.id)}
                                                        className="flex items-center bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                                                        title="Approve Announcement"
                                                    >
                                                        <Check size={14} className="mr-1" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(a.id)}
                                                        className="flex items-center bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                                                        title="Reject Announcement"
                                                    >
                                                        <X size={14} className="mr-1" /> Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">Action Taken</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </ManagementCard>

            {/* Communication Tools Section (Two-Column Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Platform-wide Alert */}
                <ManagementCard title="🚨 Send Urgent Platform Alert">
                    <div className="space-y-4">
                        <textarea
                            placeholder="Enter urgent, platform-wide alert message (e.g., 'System maintenance starting in 1 hour')."
                            value={alertMessage}
                            onChange={(e) => setAlertMessage(e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-red-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm placeholder-gray-400"
                        />
                        <button
                            onClick={handleSendAlert}
                            disabled={!alertMessage.trim()}
                            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-50"
                        >
                            <AlertTriangle size={18} className="mr-2" /> Send Global Emergency Alert
                        </button>
                    </div>
                </ManagementCard>

                {/* Targeted Message */}
                <ManagementCard title="🎯 Send Targeted Message">
                    <div className="space-y-4">
                        
                        {/* Target Role Dropdown (Simulated Select) */}
                        <div className="relative">
                            <select
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="w-full appearance-none p-3 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="All">All Users</option>
                                <option value="Students">Students</option>
                                <option value="Instructors">Instructors</option>
                                <option value="Support">Support Team</option>
                            </select>
                            <ChevronRight size={16} className="absolute right-3 top-3.5 transform rotate-90 text-gray-400 pointer-events-none" />
                            <label className="absolute top-[-0.75rem] left-3 bg-white px-1 text-xs text-gray-500">Target Audience</label>
                        </div>
                        
                        {/* Message Textarea */}
                        <textarea
                            placeholder={`Message for ${targetRole}...`}
                            value={targetedMessage}
                            onChange={(e) => setTargetedMessage(e.target.value)}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                        />
                        <button
                            onClick={handleSendTargetedMessage}
                            disabled={!targetedMessage.trim()}
                            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-50"
                        >
                            <Send size={18} className="mr-2" /> Send Message
                        </button>
                    </div>
                </ManagementCard>
            </div>
        </div>
    );
}