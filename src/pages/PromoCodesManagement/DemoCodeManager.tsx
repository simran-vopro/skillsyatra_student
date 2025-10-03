import React, { useState, useMemo } from 'react';
import { Plus, Tag, TrendingUp, Users, CheckCircle, Clock, X, Search, Upload, Download } from 'lucide-react';

// --- TYPE DEFINITIONS ---

interface DemoCode {
    id: string;
    code: string;
    course: string;
    limit: number;
    used: number;
    expiryDate: string;
    status: 'Active' | 'Expired' | 'Depleted';
    conversionRate: number; // Conversion to Paid Course
}

interface PerformanceMetric {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string; // Not used in new StatCard, but kept for interface consistency
}

// --- MOCK DATA ---

const INITIAL_CODES: DemoCode[] = [
    { id: '1', code: 'DEMO-REACT-FREE', course: 'Advanced React Course', limit: 500, used: 452, expiryDate: '2024-12-31', status: 'Active', conversionRate: 15.2 },
    { id: '2', code: 'STARTER-JSS-24', course: 'JavaScript Fundamentals', limit: 100, used: 100, expiryDate: '2024-08-15', status: 'Depleted', conversionRate: 21.0 },
    { id: '3', code: 'PYTHON-TRIAL', course: 'Python for Data Science', limit: 200, used: 120, expiryDate: '2025-06-01', status: 'Active', conversionRate: 12.8 },
    { id: '4', code: 'EXPIRED-TEST', course: 'Testing Course', limit: 10, used: 5, expiryDate: '2023-01-01', status: 'Expired', conversionRate: 0.0 },
];

// --- UTILITY ---
const generateRandomCode = (prefix: string) => {
    // Generate 6 uppercase alphanumeric characters
    return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

// --- COMPONENTS ---

/**
 * Circular Progress Graph Component
 */
const CircularProgress: React.FC<{ percent: number, color: string, label: string }> = ({ percent, color, label }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="flex items-center justify-center p-4 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[200px] lg:w-full">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Circle */}
                <circle
                    className="text-gray-200"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                {/* Progress Circle (FIXED: Apply the text color class directly and use stroke="currentColor") */}
                <circle
                    className={color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor" // Now uses the color set by the className
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
            </svg>
            <div className="text-left ml-4">
                {/* Text color is also set using the 'color' prop */}
                <span className={`block text-3xl font-extrabold ${color}`}>{percent.toFixed(1)}%</span>
                <p className="text-sm text-gray-500 font-medium mt-1">{label}</p>
            </div>
        </div>
    );
};

/**
 * Stat Card Component redesigned to match the uploaded image (Icon box, title, value, View button).
 */
const StatCard: React.FC<{ metric: PerformanceMetric }> = ({ metric }) => {
    const Icon = metric.icon;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between h-48 transition-shadow duration-200 hover:shadow-lg">

            {/* Icon Container (Top Left) */}
            <div className="mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-700">
                    <Icon size={20} />
                </div>
            </div>

            {/* Title */}
            <div className="flex-grow">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
            </div>

            {/* Value and Button (Bottom Row) */}
            <div className="flex items-end justify-between mt-4">
                {/* Value: Large, bold, dark text */}
                <p className="text-4xl font-extrabold text-gray-900">{metric.value}</p>

                {/* View Button */}
                <button
                    onClick={() => console.log(`Viewing details for: ${metric.title}`)}
                    className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition shadow-sm"
                >
                    View
                </button>
            </div>
        </div>
    );
};

interface CreateCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (code: DemoCode) => void;
}

/**
 * Modal for creating a new demo code.
 */
const CreateCodeModal: React.FC<CreateCodeModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [newCodeName, setNewCodeName] = useState('DEMO');
    const [newCodeLimit, setNewCodeLimit] = useState(100);
    const [newCourse, setNewCourse] = useState('Advanced React Course');
    const [newExpiry, setNewExpiry] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
    const PREVIEW_SUFFIX = 'A7B8C9';

    const handleCreateCode = (e: React.FormEvent) => {
        e.preventDefault();
        const newCode: DemoCode = {
            id: crypto.randomUUID(),
            code: generateRandomCode(newCodeName),
            course: newCourse,
            limit: newCodeLimit,
            used: 0,
            expiryDate: newExpiry,
            status: 'Active',
            conversionRate: parseFloat((Math.random() * 10 + 10).toFixed(1)),
        };
        onCreate(newCode);
        onClose();
        setNewCodeName('DEMO');
        setNewCodeLimit(100);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>

                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center"><Tag size={20} className="mr-2 text-purple-600" /> Generate New Demo Code</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleCreateCode} className="space-y-4">
                    {/* Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="modal-prefix" className="block text-sm font-semibold text-gray-800 mb-1">Code Prefix</label>
                            <input
                                id="modal-prefix"
                                type="text"
                                value={newCodeName}
                                onChange={(e) => setNewCodeName(e.target.value.toUpperCase().slice(0, 12).replace(/[^A-Z0-9-]/g, ''))}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 text-lg font-mono tracking-wider uppercase"
                                placeholder="E.g., FREE-TRIAL"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="modal-limit" className="block text-sm font-semibold text-gray-800 mb-1">Max Limit</label>
                            <input
                                id="modal-limit"
                                type="number"
                                value={newCodeLimit}
                                onChange={(e) => setNewCodeLimit(parseInt(e.target.value) || 0)}
                                min="1"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 text-base"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="modal-course" className="block text-sm font-semibold text-gray-800 mb-1">Target Course</label>
                            <select
                                id="modal-course"
                                value={newCourse}
                                onChange={(e) => setNewCourse(e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 text-base"
                            >
                                <option>Advanced React Course</option>
                                <option>JavaScript Fundamentals</option>
                                <option>Python for Data Science</option>
                                <option>Machine Learning Basics</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="modal-expiry" className="block text-sm font-semibold text-gray-800 mb-1">Expiry Date</label>
                            <input
                                id="modal-expiry"
                                type="date"
                                value={newExpiry}
                                onChange={(e) => setNewExpiry(e.target.value)}
                                min={new Date().toISOString().substring(0, 10)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 text-base"
                                required
                            />
                        </div>
                    </div>

                    {/* Code Preview */}
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 mt-4 text-center">
                        <span className="text-xs font-medium text-gray-700">Preview:</span>
                        <p className="text-2xl font-extrabold text-purple-800 font-mono mt-1">
                            {newCodeName || 'DEMO'}{newCodeName ? '-' : ''}{PREVIEW_SUFFIX}
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors mt-6"
                    >
                        <Tag size={18} className="mr-2" /> Generate & Activate Code
                    </button>
                </form>
            </div>
        </div>
    );
};


const DemoCodeDashboard: React.FC = () => {
    const [codes, setCodes] = useState<DemoCode[]>(INITIAL_CODES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const totalUsed = useMemo(() => codes.reduce((sum, code) => sum + code.used, 0), [codes]);
    const totalLimit = useMemo(() => codes.reduce((sum, code) => sum + code.limit, 0), [codes]);

    const totalConversions = useMemo(() => {
        const totalConversionCount = codes.reduce((sum, code) => sum + (code.used * (code.conversionRate / 100)), 0);
        return Math.round(totalConversionCount);
    }, [codes]);

    const overallConversionRate = useMemo(() => {
        if (totalUsed === 0) return 0;
        return (totalConversions / totalUsed) * 100;
    }, [totalUsed, totalConversions]);

    const averageRedemptionRate = useMemo(() => {
        if (totalLimit === 0) return 0;
        return (totalUsed / totalLimit) * 100;
    }, [totalUsed, totalLimit]);

    const performanceMetrics: PerformanceMetric[] = [
        // Using Package icon (as seen in image) for code-related metrics
        { title: 'Total Codes Issued', value: codes.length.toString(), icon: Tag, color: 'border-blue-500' },
        { title: 'Total Redemptions', value: totalUsed.toLocaleString(), icon: Users, color: 'border-purple-500' },
        { title: 'Estimated Paid Conversions', value: totalConversions.toLocaleString(), icon: CheckCircle, color: 'border-green-500' },
    ];

    const filteredCodes = codes.filter(code =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateCode = (newCode: DemoCode) => {
        setCodes([...codes, newCode]);
        console.log(`New code created: ${newCode.code}`);
    };

    const getStatusStyles = (status: DemoCode['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 border border-green-300';
            case 'Expired': return 'bg-red-100 text-red-800 border border-red-300';
            case 'Depleted': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto p-6 space-y-8 bg-gray-50 font-['Inter']">
            <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-2 flex items-center gap-3">
                <Tag size={28} className="text-purple-600" /> Demo Code Management Dashboard
            </h1>

            {/* Performance Dashboard & Graphs */}
            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-green-500" /> Conversion Performance Summary
                    </h2>
                </div>

                {/* Main Summary Layout: 3 Cards Left, 2 Graphs Right (Stacked) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Side: Key Metrics (3 Cards - New Design) */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {performanceMetrics.map((metric) => (
                            <StatCard key={metric.title} metric={metric} />
                        ))}
                    </div>

                    {/* Right Side: Visual Graphs (Stacked) */}
                    <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-around gap-4">
                        <CircularProgress
                            percent={overallConversionRate}
                            color="text-green-600"
                            label="Overall Conversion Rate"
                        />
                        <CircularProgress
                            percent={averageRedemptionRate}
                            color="text-blue-600"
                            label="Avg. Redemption Rate"
                        />
                    </div>
                </div>
            </section>

            {/* Existing Codes Table Section */}
            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Clock size={20} className="mr-2 text-gray-500" /> Active & Historical Codes Register</h2>

                {/* Control Panel (Matching Coupon Image Style) */}
                <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-gray-100 mb-4 space-y-3 sm:space-y-0">
                    <div className="flex space-x-3">
                        <button className="flex items-center text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition shadow-sm border border-gray-200">
                            <Download size={16} className="mr-2" /> Export CSV
                        </button>
                        <button className="flex items-center text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition shadow-sm border border-gray-200">
                            <Upload size={16} className="mr-2" /> Import CSV
                        </button>
                    </div>

                    <div className="flex space-x-3 items-center w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search codes or courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center py-2 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors transform hover:scale-[1.01] whitespace-nowrap"
                        >
                            <Plus size={18} className="mr-1" /> Create Code
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Target Course</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Usage (Used/Limit)</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Conv. Rate</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Expiry</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCodes.length > 0 ? (
                                filteredCodes.map((code) => (
                                    <tr key={code.id} className="hover:bg-purple-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-700 font-mono">{code.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{code.course}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{code.used} / {code.limit}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{code.conversionRate.toFixed(1)}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.expiryDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(code.status)}`}>
                                                {code.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-lg">
                                        No codes found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal Component */}
            <CreateCodeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCode}
            />
        </div>
    );
};


export default DemoCodeDashboard;
