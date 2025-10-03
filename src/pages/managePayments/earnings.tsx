import React, { useMemo, useState } from "react";
// Import Recharts components for Pie Chart
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ArrowLeft, Check, X, Pause, Users, RefreshCw, Eye, Search, SlidersHorizontal, Filter } from "lucide-react";

// --- TYPE DEFINITIONS ---

type PayoutStatus = "Pending" | "Approved" | "Rejected";
type PaymentStatus = "Success" | "Refunded" | "Failed";

interface Payout {
    id: string;
    recipient: string; // RENAMED: from 'instructor' to 'recipient'
    avatar: string;
    amount: number; // Gross amount
    fee: number; // Platform fee/tax deducted
    date: string;
    status: PayoutStatus;
    method: string;
    accountDetail: string; // Masked account identifier
    source: string; // Why the payment is being made (e.g., Course Revenue Share, Affiliate Commission, Operational Expense)
    rejectionReason?: string; // NEW: Reason if the payout was rejected
}

interface Payment {
    id: string;
    user: string;
    course: string;
    amount: number;
    date: string;
    status: PaymentStatus;
}

interface CourseRevenue {
    course: string;
    revenue: number;
}

interface ChipProps {
    label: string;
    type: 'payout' | 'payment';
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ size: number, className?: string }>;
    iconBgClass: string;
    iconTextClass: string;
    borderClass: string;
    valueColorClass?: string;
}

interface PieChartEntry {
    name: string;
    value: number;
    percentage: number;
}


// --- DUMMY DATA ---
const payouts: Payout[] = [
    // Instructor Payouts (Existing)
    {
        id: "PAYOUT-101",
        recipient: "Jane Smith (Instructor)",
        avatar: "https://placehold.co/100x100/10B981/ffffff?text=JS",
        amount: 1200,
        fee: 50, 
        date: "2025-03-10",
        status: "Approved",
        method: "Bank Transfer",
        accountDetail: "Acct: ****1234", 
        source: "Advanced JavaScript Share Q1",
    },
    {
        id: "PAYOUT-102",
        recipient: "Alex Johnson (Instructor)",
        avatar: "https://placehold.co/100x100/EF4444/ffffff?text=AJ",
        amount: 900,
        fee: 35, 
        date: "2025-03-09",
        status: "Pending",
        method: "PayPal",
        accountDetail: "user.alex@mail.com", 
        source: "UI/UX Design Revenue - Mar",
    },
    {
        id: "PAYOUT-103",
        recipient: "Maria Rodriguez (Instructor)",
        avatar: "https://placehold.co/100x100/3B82F6/ffffff?text=MR",
        amount: 350,
        fee: 15, 
        date: "2025-03-08",
        status: "Pending",
        method: "Wise",
        accountDetail: "ID: W-56789", 
        source: "Cloud Fundamentals Commission",
    },
    // Marketing/Affiliate Payouts (Existing)
    {
        id: "PAYOUT-104",
        recipient: "Digital Ads Inc. (Agency)",
        avatar: "https://placehold.co/100x100/F97316/ffffff?text=AD",
        amount: 5500,
        fee: 0, 
        date: "2025-03-07",
        status: "Approved",
        method: "Wire Transfer",
        accountDetail: "Inv: #2025-3-001", 
        source: "March Marketing Campaign Fee", 
    },
    {
        id: "PAYOUT-105",
        recipient: "Global Affiliate Network",
        avatar: "https://placehold.co/100x100/6D28D9/ffffff?text=GA",
        amount: 800,
        fee: 30, 
        date: "2025-03-06",
        status: "Approved",
        method: "PayPal",
        accountDetail: "partner@global.net", 
        source: "Affiliate Commissions Feb", 
    },
    // Operational Payouts (Existing) - CHANGED TO REJECTED
    {
        id: "PAYOUT-106",
        recipient: "Office Rent Services",
        avatar: "https://placehold.co/100x100/059669/ffffff?text=OP",
        amount: 2500,
        fee: 0, 
        date: "2025-03-05",
        status: "Rejected", // CHANGED
        method: "Bank Transfer",
        accountDetail: "Ref: Mar Rent", 
        source: "Monthly Operational Expense", 
        rejectionReason: "Invoice details mismatch: Requires updated Q2 contract.", // ADDED REASON
    },
    // --- NEW PAYOUTS ADDED ---
    {
        id: "PAYOUT-107",
        recipient: "Creative Supply Co.",
        avatar: "https://placehold.co/100x100/374151/ffffff?text=SC",
        amount: 450,
        fee: 0, 
        date: "2025-03-12",
        status: "Approved",
        method: "Credit Card",
        accountDetail: "CC: ****9987", 
        source: "Workshop Materials for Q2", // Practical materials/supplies
    },
    {
        id: "PAYOUT-108",
        recipient: "ServerCloud Solutions",
        avatar: "https://placehold.co/100x100/60A5FA/ffffff?text=SS",
        amount: 150,
        fee: 0, 
        date: "2025-03-11",
        status: "Pending",
        method: "Direct Debit",
        accountDetail: "Sub: SVS-2303", 
        source: "Monthly Software Subscription", // Subscription/Software
    },
    {
        id: "PAYOUT-109",
        recipient: "Platform Refund Processor",
        avatar: "https://placehold.co/100x100/9CA3AF/ffffff?text=RP",
        amount: 200,
        fee: 5, 
        date: "2025-03-11",
        status: "Approved",
        method: "PayPal",
        accountDetail: "Ref: REF-704", 
        source: "Customer Refund - Course X", // Refund
    },
    {
        id: "PAYOUT-110",
        recipient: "Jane Smith (Instructor)",
        avatar: "https://placehold.co/100x100/10B981/ffffff?text=JS",
        amount: 750,
        fee: 25, 
        date: "2025-03-04",
        status: "Pending",
        method: "Bank Transfer",
        accountDetail: "Acct: ****1234", 
        source: "React Advanced Share - Feb",
    },
    // NEW REJECTED ENTRY
    {
        id: "PAYOUT-111", 
        recipient: "Unauthorized Vendor",
        avatar: "https://placehold.co/100x100/7C7E83/ffffff?text=UV",
        amount: 1500,
        fee: 0, 
        date: "2025-03-03",
        status: "Rejected",
        method: "Wire Transfer",
        accountDetail: "Inv: #009-SEC", 
        source: "Suspect Equipment Purchase", 
        rejectionReason: "Failed internal security review (recipient not verified).", // ADDED REASON
    },
];

const payments: Payment[] = [
    {
        id: "PAY-301",
        user: "John Doe",
        course: "React Basics",
        amount: 200,
        date: "2025-03-01",
        status: "Success",
    },
    {
        id: "PAY-302",
        user: "Mary Johnson",
        course: "UI/UX Design",
        amount: 150,
        date: "2025-02-28",
        status: "Refunded",
    },
    {
        id: "PAY-303",
        user: "Sam Brown",
        course: "Advanced JavaScript",
        amount: 300,
        date: "2025-02-27",
        status: "Success",
    },
    {
        id: "PAY-304",
        user: "Liam Green",
        course: "Data Science with Python",
        amount: 450,
        date: "2025-03-15",
        status: "Success",
    },
    {
        id: "PAY-305",
        user: "Olivia White",
        course: "Cloud Fundamentals",
        amount: 120,
        date: "2025-03-14",
        status: "Success",
    },
    {
        id: "PAY-306",
        user: "Noah Black",
        course: "Web Security",
        amount: 250,
        date: "2023-03-13",
        status: "Failed",
    },
];

const courseRevenue: CourseRevenue[] = [
    { course: "React Basics", revenue: 5000 },
    { course: "Advanced JavaScript", revenue: 7000 },
    { course: "UI/UX Design", revenue: 3500 },
    { course: "Data Science with Python", revenue: 9000 },
    { course: "Cloud Fundamentals", revenue: 2000 },
    { course: "Web Security", revenue: 4500 },
];

// Colors for Course Revenue Pie Chart
const COURSE_COLORS = ['#0891B2', '#10B981', '#4F46E5', '#DC2626', '#F59E0B', '#6366F1', '#A855F7', '#EF4444', '#EC4899'];


// --- Custom Components ---

/**
 * Custom Tooltip for Recharts Pie Chart
 */
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as PieChartEntry;
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-xl rounded-lg text-sm transition-opacity duration-300">
                <p className="font-semibold text-gray-900">{data.name}</p>
                <p className="text-gray-700">Revenue: <span className="font-bold text-teal-600">${data.value.toLocaleString()}</span></p>
                <p className="text-gray-500">Share: {data.percentage.toFixed(1)}%</p>
            </div>
        );
    }
    return null;
};

/**
 * Reusable component for displaying status chips with consistent Tailwind styling.
 */
const StatusChip: React.FC<ChipProps> = ({ label, type }) => {
    let colorClasses = "bg-gray-100 text-gray-700 ring-gray-500/10";

    if (type === 'payout') {
        switch (label) {
            case "Pending":
                colorClasses = "bg-amber-100 text-amber-700 ring-amber-500/10";
                break;
            case "Approved":
                colorClasses = "bg-green-100 text-green-700 ring-green-500/10";
                break;
            case "Rejected":
                colorClasses = "bg-red-100 text-red-700 ring-red-500/10";
                break;
        }
    } else if (type === 'payment') {
        switch (label) {
            case "Success":
                colorClasses = "bg-green-100 text-green-700 ring-green-500/10";
                break;
            case "Refunded":
                colorClasses = "bg-red-100 text-red-700 ring-red-500/10";
                break;
            case "Failed":
                colorClasses = "bg-gray-100 text-gray-700 ring-gray-500/10";
                break;
        }
    }

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses}`}>
            {label}
        </span>
    );
};

/**
 * Helper component for the snapshot cards
 */
const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    icon: Icon, 
    iconBgClass, 
    iconTextClass, 
    borderClass, 
    valueColorClass = "text-gray-800" 
}) => {
    const handleViewMore = (cardTitle: string) => {
        console.log(`View More clicked for: ${cardTitle}`);
    };

    return (
        <div className={`bg-white rounded-xl ${borderClass} shadow-lg p-4 flex flex-col transition-shadow hover:shadow-xl`}>
            <div className="flex justify-between items-center mb-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${iconBgClass} ${iconTextClass}`}>
                    <Icon size={20} />
                </div>
                {/* Outline View Button */}
                <button
                    onClick={() => handleViewMore(title)}
                    className={`text-xs ${iconTextClass} hover:opacity-80 flex items-center transition-colors px-2 py-1 border border-gray-200 rounded-full font-medium`}
                >
                    <Eye size={12} className="mr-1" />
                    View
                </button>
            </div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-3xl font-bold ${valueColorClass} mt-1`}>{value}</p>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function EarningsFinancePage() {
    // State for course revenue filtering and sorting
    const [courseSearchTerm, setCourseSearchTerm] = useState<string>('');
    const [courseSortOrder, setCourseSortOrder] = useState<'high' | 'low' | 'none'>('high');

    // State for all payouts filtering
    const [payoutSearchTerm, setPayoutSearchTerm] = useState<string>('');
    const [payoutStatusFilter, setPayoutStatusFilter] = useState<'All' | PayoutStatus>('Pending'); // Default to Pending
    
    // State for student payments filtering
    const [paymentSearchTerm, setPaymentSearchTerm] = useState<string>('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<'All' | PaymentStatus>('All');


    // Mock the navigation function for single-file environment
    const mockNavigateBack = () => {
        console.log("Mock Navigation: Attempted to go back.");
    };

    // Summary Calculations
    const { totalEarnings, totalRefunds, pendingPayouts } = useMemo(() => {
        const successPayments = payments.filter((p) => p.status === "Success");
        
        const totalEarnings = successPayments.reduce((sum, p) => sum + p.amount, 0);

        const totalRefunds = payments
            .filter((p) => p.status === "Refunded")
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingPayouts = payouts.filter((p) => p.status === "Pending").length;
        
        return { totalEarnings, totalRefunds, pendingPayouts };
    }, []);

    // 1. Filtering and Sorting logic for Course Revenue
    const filteredRevenue: CourseRevenue[] = useMemo(() => {
        let filtered = courseRevenue;

        // 1. Filtering (Search)
        if (courseSearchTerm) {
            filtered = filtered.filter(c =>
                c.course.toLowerCase().includes(courseSearchTerm.toLowerCase())
            );
        }

        // 2. Sorting
        if (courseSortOrder === 'high') {
            filtered = [...filtered].sort((a, b) => b.revenue - a.revenue);
        } else if (courseSortOrder === 'low') {
            filtered = [...filtered].sort((a, b) => a.revenue - b.revenue);
        }

        return filtered;
    }, [courseSearchTerm, courseSortOrder]);

    // Format data for PieChart
    const pieChartData: PieChartEntry[] = useMemo(() => {
        const totalRevenue = filteredRevenue.reduce((sum, item) => sum + item.revenue, 0);

        return filteredRevenue.map(item => ({
            name: item.course,
            value: item.revenue,
            percentage: totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100) : 0
        }));
    }, [filteredRevenue]);


    // 2. Filtering logic for All Payouts
    const filteredPayouts: Payout[] = useMemo(() => {
        return payouts.filter(payout => {
            // 1. Status Filter
            const statusMatch = payoutStatusFilter === 'All' || payout.status === payoutStatusFilter;

            // 2. Search Term Filter (by recipient, source, or method)
            const searchMatch = payoutSearchTerm === '' ||
                payout.recipient.toLowerCase().includes(payoutSearchTerm.toLowerCase()) ||
                payout.source.toLowerCase().includes(payoutSearchTerm.toLowerCase()) ||
                payout.method.toLowerCase().includes(payoutSearchTerm.toLowerCase());

            return statusMatch && searchMatch;
        });
    }, [payoutSearchTerm, payoutStatusFilter]);


    // 3. Filtering logic for Student Payments
    const filteredPayments: Payment[] = useMemo(() => {
        return payments.filter(payment => {
            // 1. Status Filter
            const statusMatch = paymentStatusFilter === 'All' || payment.status === paymentStatusFilter;

            // 2. Search Term Filter (by user or course)
            const searchMatch = paymentSearchTerm === '' ||
                payment.user.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
                payment.course.toLowerCase().includes(paymentSearchTerm.toLowerCase());

            return statusMatch && searchMatch;
        });
    }, [paymentSearchTerm, paymentStatusFilter]);

    // Action handlers (mocked)
    const handleApprove = (id: string) => console.log(`Action: Approved payout ${id}`);
    const handleHold = (id: string) => console.log(`Action: Held payout ${id}`);
    const handleReject = (id: string) => console.log(`Action: Rejected payout ${id}`);
    
    // Status filter options
    const payoutStatusOptions: PayoutStatus[] = ["Pending", "Approved", "Rejected"];
    const paymentStatusOptions: PaymentStatus[] = ["Success", "Refunded", "Failed"];

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 mb-3 sm:mb-0">
                    <DollarSign size={28} className="text-sky-600" /> Earnings & Finance
                </h1>
                <button
                    onClick={mockNavigateBack}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>
            </div>

            {/* Finance Snapshot - KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Earnings (Success)" 
                    value={`$${totalEarnings.toLocaleString()}`} 
                    icon={DollarSign} 
                    iconBgClass="bg-green-100"
                    iconTextClass="text-green-600"
                    borderClass="border border-green-200"
                />
                <StatCard 
                    title="Pending Payouts" 
                    value={pendingPayouts.toString()} 
                    icon={Pause} 
                    iconBgClass="bg-amber-100"
                    iconTextClass="text-amber-600"
                    borderClass="border border-amber-200"
                    valueColorClass="text-amber-600"
                />
                <StatCard 
                    title="Total Refunds" 
                    value={`$${totalRefunds.toLocaleString()}`} 
                    icon={X} 
                    iconBgClass="bg-red-100"
                    iconTextClass="text-red-600"
                    borderClass="border border-red-200"
                    valueColorClass="text-red-600"
                />
                <StatCard 
                    title="Active Courses Tracked" 
                    value={courseRevenue.length.toString()} 
                    icon={Users} 
                    iconBgClass="bg-indigo-100"
                    iconTextClass="text-indigo-600"
                    borderClass="border border-indigo-200"
                />
            </div>
            
            {/* ALL Payout Transactions - THE DETAILED LEDGER */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <DollarSign size={20} className="text-sky-600" /> All Payout Transactions
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Review and manage all payouts (Instructors, Affiliates, Vendors, Expenses, etc.), showing amount, source, and destination details.
                    </p>
                </div>
                
                {/* Payout Controls */}
                <div className="p-4 flex flex-col sm:flex-row gap-4 border-b border-gray-100">
                    {/* Search */}
                    <div className="relative w-full sm:w-1/2">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            // UPDATED SEARCH PLACEHOLDER
                            placeholder="Search recipient, source, or method..."
                            value={payoutSearchTerm}
                            onChange={(e) => setPayoutSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-colors text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full sm:w-auto flex-shrink-0">
                        <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={payoutStatusFilter}
                            onChange={(e) => setPayoutStatusFilter(e.target.value as 'All' | PayoutStatus)}
                            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-sky-500 focus:border-sky-500 appearance-none text-sm font-medium"
                        >
                            <option value="All">All Statuses</option>
                            {payoutStatusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* COLUMN HEADER RENAMED TO RECIPIENT */}
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Source / Expense</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Amt.</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Payout</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Detail</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">Required Actions / Status Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredPayouts.length > 0 ? filteredPayouts.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                className="h-8 w-8 rounded-full object-cover" 
                                                src={p.avatar} 
                                                alt={p.recipient} 
                                                onError={(e) => {
                                                    const target = e.currentTarget as HTMLImageElement;
                                                    target.src = 'https://placehold.co/100x100/A0A0A0/ffffff?text=User';
                                                    target.onerror = null;
                                                }}
                                            />
                                            {/* RENDERED RECIPIENT NAME */}
                                            {p.recipient}
                                        </div>
                                    </td>
                                    {/* Revenue Source / Period (New Column) */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-sky-700 font-semibold">{p.source}</td>
                                    {/* Gross Amount */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">${p.amount.toLocaleString()}</td>
                                    {/* Fee */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">-${p.fee.toLocaleString()}</td>
                                    {/* Net Payout (Calculated) */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-700">${(p.amount - p.fee).toLocaleString()}</td>
                                    {/* Payment Method */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{p.method}</td>
                                    {/* Account Detail */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{p.accountDetail}</td>
                                    {/* Status */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <StatusChip label={p.status} type="payout" />
                                    </td>
                                    {/* Required Actions / Status Details */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {p.status === "Pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(p.id)}
                                                    className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                                                >
                                                    <Check size={14} /> Approve & Send
                                                </button>
                                                <button
                                                    onClick={() => handleHold(p.id)}
                                                    className="px-3 py-1 text-xs font-medium text-amber-700 border border-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
                                                >
                                                    <Pause size={14} /> Hold Payment
                                                </button>
                                                <button
                                                    onClick={() => handleReject(p.id)}
                                                    className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                                                >
                                                    <X size={14} /> Reject
                                                </button>
                                            </div>
                                        )}
                                        {p.status === "Approved" && (
                                            <span className="text-gray-500 italic">Payment processed on {p.date}</span>
                                        )}
                                        {p.status === "Rejected" && (
                                            <div className="flex flex-col text-red-700">
                                                <span className="font-semibold mb-1 flex items-center gap-1">
                                                    <X size={14} className="flex-shrink-0" /> Rejection Reason:
                                                </span>
                                                <span className="text-xs text-gray-700 font-normal italic whitespace-normal max-w-[280px]">
                                                    {p.rejectionReason || "Reason not provided."}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={9} className="px-4 py-10 text-center text-gray-500 text-sm">
                                        No payout requests found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment History & Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Payment History */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="p-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <RefreshCw size={20} className="text-purple-600" /> Student Payment History
                        </h2>
                    </div>
                    
                    {/* Payment Controls */}
                    <div className="p-4 flex flex-col sm:flex-row gap-4 border-b border-gray-100">
                        {/* Search */}
                        <div className="relative w-full sm:w-1/2">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search user or course..."
                                value={paymentSearchTerm}
                                onChange={(e) => setPaymentSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative w-full sm:w-auto flex-shrink-0">
                            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={paymentStatusFilter}
                                onChange={(e) => setPaymentStatusFilter(e.target.value as 'All' | PaymentStatus)}
                                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500 appearance-none text-sm font-medium"
                            >
                                <option value="All">Filter by Status (All)</option>
                                {paymentStatusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredPayments.length > 0 ? filteredPayments.map((pay) => (
                                    <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{pay.user}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pay.course}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-800">${pay.amount.toLocaleString()}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <StatusChip label={pay.status} type="payment" />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-gray-500 text-sm">
                                            No payment records found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Course-wise Revenue Breakdown - CHART AND FILTERS */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="p-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Users size={20} className="text-teal-600" /> Course Revenue Breakdown
                        </h2>
                    </div>

                    {/* Controls (Search and Sort) */}
                    <div className="p-5 flex flex-col sm:flex-row gap-4 border-b">
                        {/* Search */}
                        <div className="relative w-full sm:w-1/2">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search course..."
                                value={courseSearchTerm}
                                onChange={(e) => setCourseSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors text-sm"
                            />
                        </div>

                        {/* Sort */}
                        <div className="relative w-full sm:w-auto flex-shrink-0">
                            <SlidersHorizontal size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={courseSortOrder}
                                onChange={(e) => setCourseSortOrder(e.target.value as 'high' | 'low' | 'none')}
                                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-teal-500 focus:border-teal-500 appearance-none text-sm font-medium"
                            >
                                <option value="high">Sort: Revenue High</option>
                                <option value="low">Sort: Revenue Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Chart and Legend/Table */}
                    <div className="p-5 flex flex-col md:flex-row items-center">
                        {/* Pie Chart */}
                        <div className="w-full md:w-1/2 h-64 min-h-[256px]">
                            {filteredRevenue.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50} // Doughnut style
                                            outerRadius={80}
                                            paddingAngle={3}
                                            fill="#8884d8"
                                            labelLine={false}
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COURSE_COLORS[index % COURSE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No data available for the selected filters.
                                </div>
                            )}
                        </div>

                        {/* Legend / Filtered List */}
                        <div className="w-full md:w-1/2 md:pl-5 mt-6 md:mt-0 overflow-y-auto max-h-64">
                            <h3 className="text-lg font-semibold mb-3">Revenue List ({filteredRevenue.length} items)</h3>
                            <div className="divide-y divide-gray-100">
                                {filteredRevenue.map((c, index) => {
                                    const totalRevenue = courseRevenue.reduce((sum, item) => sum + item.revenue, 0);
                                    const percentage = totalRevenue > 0 ? ((c.revenue / totalRevenue) * 100) : 0;
                                    return (
                                        <div key={index} className="flex justify-between items-center py-2 hover:bg-gray-50 rounded-md px-2 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    className="h-3 w-3 rounded-full flex-shrink-0" 
                                                    style={{ backgroundColor: COURSE_COLORS[index % COURSE_COLORS.length] }}
                                                />
                                                <span className="text-sm font-medium text-gray-700 truncate">{c.course}</span>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className="text-sm font-bold text-gray-800">${c.revenue.toLocaleString()}</span>
                                                <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredRevenue.length === 0 && (
                                    <p className="text-center py-4 text-gray-500 text-sm">No courses match your criteria.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
