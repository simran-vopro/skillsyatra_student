import React, { useMemo, useState } from "react";
import { Clock, Users, Search, Filter, ArrowLeft, Trash2, Edit, LogIn, Eye, Layers } from "lucide-react";

// --- TYPE DEFINITIONS (For context) ---

type UserRole = "Student" | "Parent" | "Instructor" | "Subadmin" | "Superadmin";
type ActionType = "Auth" | "Create" | "Update" | "Delete" | "View" | "System";

interface ActivityLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    userRole: UserRole;
    actionType: ActionType;
    details: string; // Brief description of the action
    targetResource: string; // e.g., "Course: Algebra 101", "User: John Doe"
    ipAddress: string;
}

// --- DUMMY DATA ---
const activityLogs: ActivityLog[] = [
    {
        id: "LOG-001",
        timestamp: "2025-09-29 11:30:15 AM",
        userId: "U-1001",
        userName: "Super Admin (You)",
        userRole: "Superadmin",
        actionType: "System",
        details: "Updated platform security settings to enforce 2FA",
        targetResource: "System Settings",
        ipAddress: "203.0.113.44",
    },
    {
        id: "LOG-002",
        timestamp: "2025-09-29 10:45:00 AM",
        userId: "U-1015",
        userName: "Sarah Johnson",
        userRole: "Subadmin",
        actionType: "Create",
        details: "Approved and created new Instructor profile: Dr. Chen",
        targetResource: "User: Dr. Chen",
        ipAddress: "192.168.1.50",
    },
    {
        id: "LOG-003",
        timestamp: "2025-09-29 10:30:22 AM",
        userId: "U-1022",
        userName: "Michael Lee",
        userRole: "Instructor",
        actionType: "Update",
        details: "Modified lesson plan for 'Advanced Calculus' - Module 5 quiz scores",
        targetResource: "Course: Advanced Calculus",
        ipAddress: "172.16.0.12",
    },
    {
        id: "LOG-004",
        timestamp: "2025-09-29 09:15:40 AM",
        userId: "U-3005",
        userName: "Emily Brown",
        userRole: "Student",
        actionType: "View",
        details: "Accessed and downloaded 'History of Modern Art' reading material",
        targetResource: "Resource: Modern Art PDF",
        ipAddress: "10.0.0.101",
    },
    {
        id: "LOG-005",
        timestamp: "2025-09-29 09:00:10 AM",
        userId: "U-5001",
        userName: "David Wilson",
        userRole: "Parent",
        actionType: "Auth",
        details: "Successful login via web portal",
        targetResource: "Auth Session",
        ipAddress: "10.0.0.88",
    },
    {
        id: "LOG-006",
        timestamp: "2025-09-28 04:55:01 PM",
        userId: "U-1022",
        userName: "Michael Lee",
        userRole: "Instructor",
        actionType: "Delete",
        details: "Removed outdated file 'Old_Lecture_Notes.zip' from server",
        targetResource: "File Storage",
        ipAddress: "172.16.0.12",
    },
    {
        id: "LOG-007",
        timestamp: "2025-09-28 03:20:11 PM",
        userId: "U-1015",
        userName: "Sarah Johnson",
        userRole: "Subadmin",
        actionType: "Update",
        details: "Changed the status of student 'John Doe' to 'Inactive'",
        targetResource: "User: John Doe",
        ipAddress: "192.168.1.50",
    },
    {
        id: "LOG-008",
        timestamp: "2025-09-28 01:10:33 PM",
        userId: "U-3008",
        userName: "Lisa Chen",
        userRole: "Student",
        actionType: "Auth",
        details: "Failed login attempt (Incorrect Password)",
        targetResource: "Auth Session",
        ipAddress: "10.0.0.25",
    },
];

// --- Custom Components ---

/**
 * Helper to determine badge colors based on role or action type
 */
const getRoleColor = (role: UserRole) => {
    switch (role) {
        case 'Student': return 'bg-sky-100 text-sky-700';
        case 'Parent': return 'bg-green-100 text-green-700';
        case 'Instructor': return 'bg-indigo-100 text-indigo-700';
        case 'Subadmin': return 'bg-amber-100 text-amber-700';
        case 'Superadmin': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getActionColor = (type: ActionType) => {
    switch (type) {
        case 'Auth': return { icon: LogIn, color: 'text-blue-500' };
        case 'Create': return { icon: Layers, color: 'text-green-500' };
        case 'Update': return { icon: Edit, color: 'text-amber-500' };
        case 'Delete': return { icon: Trash2, color: 'text-red-500' };
        case 'View': return { icon: Eye, color: 'text-indigo-500' };
        case 'System': return { icon: Clock, color: 'text-purple-500' };
        default: return { icon: Eye, color: 'text-gray-500' };
    }
};


// --- MAIN COMPONENT ---

export default function AuditLogsPage() {
    // State for filters
    const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
    const [actionFilter, setActionFilter] = useState<'All' | ActionType>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [dateRangeFilter, setDateRangeFilter] = useState<'All' | 'Today' | '7D' | '30D'>('All');

    // Mock the navigation function
    const mockNavigateBack = () => {
        console.log("Mock Navigation: Attempted to go back.");
    };

    // Filter Options
    const roleOptions: UserRole[] = ["Student", "Parent", "Instructor", "Subadmin", "Superadmin"];
    const actionOptions: ActionType[] = ["Auth", "Create", "Update", "Delete", "View", "System"];
    const dateRangeOptions = [
        { label: 'All Time', value: 'All' },
        { label: 'Today', value: 'Today' },
        { label: 'Last 7 Days', value: '7D' },
        { label: 'Last 30 Days', value: '30D' },
    ];


    // Filtering and Sorting logic
    const filteredLogs: ActivityLog[] = useMemo(() => {
        let filtered = activityLogs;

        // 1. Role Filter
        if (roleFilter !== 'All') {
            filtered = filtered.filter(log => log.userRole === roleFilter);
        }

        // 2. Action Filter
        if (actionFilter !== 'All') {
            filtered = filtered.filter(log => log.actionType === actionFilter);
        }

        // 3. Search Term Filter (User Name, Details, Target Resource, IP Address)
        const lowerSearchTerm = searchTerm.toLowerCase();
        if (lowerSearchTerm) {
            filtered = filtered.filter(log =>
                log.userName.toLowerCase().includes(lowerSearchTerm) ||
                log.details.toLowerCase().includes(lowerSearchTerm) ||
                log.targetResource.toLowerCase().includes(lowerSearchTerm) ||
                log.ipAddress.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // 4. Date Filter (Simplified check based on dummy data timestamp format)
        // In a real app, this would require complex date logic using moment or Date objects.
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

        if (dateRangeFilter === 'Today') {
            filtered = filtered.filter(log => log.timestamp.startsWith(today) || log.timestamp.startsWith(yesterday));
        }
        // Note: '7D' and '30D' are omitted for simplicity in dummy data, but the filter is present.

        // Sort by timestamp (most recent first)
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return filtered;
    }, [roleFilter, actionFilter, searchTerm, dateRangeFilter]);


    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 mb-3 sm:mb-0">
                    <Clock size={28} className="text-red-600" /> Audit Logs & Activities
                </h1>
                <button
                    onClick={mockNavigateBack}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>
            </div>

            {/* Filter Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Activity Stream</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Role Filter */}
                    <div className="relative">
                        <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as 'All' | UserRole)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 appearance-none text-sm font-medium transition-colors"
                        >
                            <option value="All">All User Roles</option>
                            {roleOptions.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    {/* Action Type Filter */}
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value as 'All' | ActionType)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 appearance-none text-sm font-medium transition-colors"
                        >
                            <option value="All">All Action Types</option>
                            {actionOptions.map(action => (
                                <option key={action} value={action}>{action}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range Filter */}
                    <div className="relative">
                        <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                            value={dateRangeFilter}
                            onChange={(e) => setDateRangeFilter(e.target.value as 'All' | 'Today' | '7D' | '30D')}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 appearance-none text-sm font-medium transition-colors"
                        >
                            {dateRangeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search user, detail, or IP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock size={20} className="text-red-600" /> Activity Stream ({filteredLogs.length} Records)
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Viewing logs for **{roleFilter}** where action is **{actionFilter}**.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User & Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target/Resource</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">Activity Details</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredLogs.length > 0 ? filteredLogs.map((log) => {
                                const { icon: ActionIcon, color: ActionColor } = getActionColor(log.actionType);
                                const RoleColorClasses = getRoleColor(log.userRole);

                                return (
                                    <tr key={log.id} className="hover:bg-red-50/20 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{log.timestamp}</td>

                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                            <div className="font-medium text-gray-800">{log.userName}</div>
                                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${RoleColorClasses}`}>
                                                {log.userRole}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <ActionIcon size={16} className={ActionColor} />
                                                <span className={`font-semibold ${ActionColor.replace('text-', 'text-')}`}>{log.actionType}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-indigo-700 font-medium">{log.targetResource}</td>
                                        
                                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-normal max-w-lg">
                                            {log.details}
                                        </td>
                                        
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 font-mono">{log.ipAddress}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500 text-base">
                                        No activity logs found matching the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note on Mobile View: Tailwind handles the responsiveness, but for complex audit logs,
                the table structure is generally preferred on desktop. On mobile, the overflow-x-auto
                will allow horizontal scrolling of the table, which is usually the best compromise
                for highly dense data tables like this. */}

        </div>
    );
}
