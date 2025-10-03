import { useState, useMemo, useCallback } from "react";
import {
    User,
    Users,
    Pin,
    AlertTriangle,
    ThumbsUp,
    Settings,
    X,
    MessageCircle,
    BookOpen,
    Hash
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
}
    from "recharts";

// --- Type Definitions ---
interface Reply {
    id: string;
    userType: "Student" | "Instructor";
    userName: string;
    userAvatar: string;
    message: string;
    timestamp: string;
    likes: number;
    flagged: boolean;
}

interface Message {
    id: string;
    course: string;
    forum: string;
    userType: "Student" | "Instructor";
    userName: string;
    userAvatar: string;
    message: string;
    timestamp: string;
    likes: number;
    flagged: boolean;
    severity: "Low" | "Medium" | "High";
    pinned: boolean;
    officialAnswer: boolean;
    replies?: Reply[];
}

interface RulesForm {
    keywordFlags: string;
    severityLevel: "Low" | "Medium" | "High";
    autoPinOfficial: boolean;
}

// --- DUMMY DATA ---
const initialForumMessages: Message[] = [
    {
        id: "msg_101", course: "React Basics", forum: "React Basics Forum", userType: "Student", userName: "John Doe", userAvatar: "https://placehold.co/40x40/f0abf0/000000?text=JD",
        message: "I didn't understand the useEffect hook 😕. The examples provided were too complex for a beginner.", timestamp: "14:32, 10 Mar 2025",
        likes: 5, flagged: true, severity: "High", pinned: false, officialAnswer: false,
        replies: [
            {
                id: "reply_1011", userType: "Instructor", userName: "Jane Smith", userAvatar: "https://placehold.co/40x40/94a3b8/ffffff?text=JS",
                message: "Check out the official React docs for simpler, state-only examples. Focus on the dependency array.", timestamp: "15:00, 10 Mar 2025",
                likes: 2, flagged: false,
            },
        ],
    },
    {
        id: "msg_102", course: "Advanced JS", forum: "Advanced JS Forum", userType: "Instructor", userName: "Jane Smith", userAvatar: "https://placehold.co/40x40/94a3b8/ffffff?text=JS",
        message: "📌 **Announcement**: Remember to always check variable scoping in JavaScript! Use `let` or `const`.", timestamp: "09:15, 11 Mar 2025",
        likes: 12, flagged: false, severity: "Low", pinned: true, officialAnswer: true,
        replies: [],
    },
    {
        id: "msg_103", course: "React Basics", forum: "React Basics Forum", userType: "Student", userName: "Alex Johnson", userAvatar: "https://placehold.co/40x40/fb7185/ffffff?text=AJ",
        message: "Can someone explain props drilling? Is there an easy way to avoid it without Redux?", timestamp: "11:22, 12 Mar 2025",
        likes: 3, flagged: false, severity: "Medium", pinned: false, officialAnswer: false,
        replies: [
            {
                id: "reply_1031", userType: "Instructor", userName: "Mike Brown", userAvatar: "https://placehold.co/40x40/22c55e/ffffff?text=MB",
                message: "Props drilling is passing props down multiple components. Use the React Context API to inject data where it's needed.", timestamp: "12:05, 12 Mar 2025",
                likes: 4, flagged: false,
            },
        ],
    },
    {
        id: "msg_104", course: "Advanced JS", forum: "Advanced JS Forum", userType: "Student", userName: "Sarah Lee", userAvatar: "https://placehold.co/40x40/facc15/000000?text=SL",
        message: "What is closure in JavaScript? I saw a strange error when a function retained access to outer variables.", timestamp: "13:30, 13 Mar 2025",
        likes: 7, flagged: true, severity: "Medium", pinned: false, officialAnswer: false,
        replies: [],
    },
];

const courses: string[] = ["All Courses", "React Basics", "Advanced JS", "Data Structures"];
const forums: string[] = ["All Forums", "React Basics Forum", "Advanced JS Forum", "General Questions"];

// --- Custom Styled Components ---

interface ChipProps {
    label: string;
    color?: "gray" | "info" | "secondary" | "success" | "error" | "warning";
    icon?: React.ElementType;
    className?: string;
}

const StyledChip: React.FC<ChipProps> = ({ label, color = "gray", icon: Icon, className = "" }) => {
    const baseClasses = "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full transition-colors";
    const colorClasses: Record<string, string> = {
        gray: "bg-gray-100 text-gray-700",
        info: "bg-sky-100 text-sky-700",
        secondary: "bg-indigo-100 text-indigo-700",
        success: "bg-green-100 text-green-700",
        error: "bg-red-100 text-red-700",
        warning: "bg-yellow-100 text-yellow-700",
    };
    const finalClasses = `${baseClasses} ${colorClasses[color]} ${className}`;

    return (
        <span className={finalClasses}>
            {Icon && <Icon size={12} className="mr-1" />}
            {label}
        </span>
    );
};

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "outline-primary" | "outline-success" | "outline-error" | "success" | "error" | "default";
    size?: "small" | "medium";
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
}

const StyledButton: React.FC<ButtonProps> = ({ children, variant = "primary", size = "small", onClick, className = "" }) => {
    // UPDATED: Added flex, justify-center, and items-center for perfect icon/text alignment
    const baseClasses = "rounded-md transition-all duration-200 font-medium whitespace-nowrap shadow-sm flex justify-center items-center";
    const sizeClasses = size === "small" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm";

    let colorClasses: string;
    switch (variant) {
        case "primary":
            colorClasses = "bg-sky-600 text-white hover:bg-sky-700";
            break;
        case "outline-primary":
            colorClasses = "border border-sky-600 text-sky-600 hover:bg-sky-50";
            break;
        case "outline-success":
            colorClasses = "border border-green-600 text-green-600 hover:bg-green-50";
            break;
        case "outline-error":
            colorClasses = "border border-red-600 text-red-600 hover:bg-red-50";
            break;
        case "success":
            colorClasses = "bg-green-600 text-white hover:bg-green-700";
            break;
        case "error":
            colorClasses = "bg-red-600 text-white hover:bg-red-700";
            break;
        default:
            colorClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";
    }

    return (
        <button onClick={onClick} className={`${baseClasses} ${sizeClasses} ${colorClasses} ${className}`}>
            {children}
        </button>
    );
};

interface AvatarProps {
    src: string;
    size?: "sm" | "md";
}

const StyledAvatar: React.FC<AvatarProps> = ({ src, size = "md" }) => {
    const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
    return (
        <img
            src={src || "https://placehold.co/40x40/f3f4f6/374151?text=U"}
            alt="User Avatar"
            className={`${sizeClasses} rounded-full object-cover bg-gray-200 flex-shrink-0`}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/40x40/f3f4f6/374151?text=U"; }}
        />
    );
};

interface SelectProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    minWidth?: string;
}

const StyledSelect: React.FC<SelectProps> = ({ label, value, onChange, options, minWidth = "w-full" }) => (
    <div className={`relative ${minWidth}`}>
        <label className="absolute -top-2 left-2 px-1 text-xs text-gray-500 bg-white z-10">
            {label}
        </label>
        <select
            value={value}
            onChange={onChange}
            className="w-full h-10 border border-gray-300 rounded-lg bg-white appearance-none p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700 relative"
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
        </div>
    </div>
);


// --- Utility Functions ---
const getChartData = (messages: Message[]) => {
    const counts: { [key: string]: { course: string, Flagged: number, Pinned: number, Official: number } } = {};
    messages.forEach((msg) => {
        const course = msg.course;
        counts[course] = counts[course] || { course: course, Flagged: 0, Pinned: 0, Official: 0 };
        if (msg.flagged) counts[course].Flagged++;
        if (msg.pinned) counts[course].Pinned++;
        if (msg.officialAnswer) counts[course].Official++;
    });
    return Object.values(counts);
};

const getSeverityColor = (severity: Message["severity"]) => {
    switch (severity) {
        case "High": return "error";
        case "Medium": return "warning";
        default: return "gray";
    }
};

// --- Custom Modals ---

interface BanModalProps {
    userName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const BanConfirmationModal: React.FC<BanModalProps> = ({ userName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl w-11/12 max-w-sm p-6 relative shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle size={20} /> Confirm Ban Action
            </h3>
            <p className="text-gray-700">
                Are you sure you want to **permanently ban** the user **{userName}**? This action cannot be undone and will hide all their messages.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t">
                <StyledButton variant="default" size="medium" onClick={onCancel}>
                    Cancel
                </StyledButton>
                <StyledButton variant="error" size="medium" onClick={onConfirm}>
                    <X size={16} className="mr-1" /> Ban {userName}
                </StyledButton>
            </div>
        </div>
    </div>
);

interface ForumsListModalProps {
    onClose: () => void;
    courses: string[];
    forums: string[];
}

const ForumsListModal: React.FC<ForumsListModalProps> = ({ onClose, courses, forums }) => {
    // Simple grouping for display purposes
    const displayCourses = courses.filter(c => c !== "All Courses");
    const displayForums = forums.filter(f => f !== "All Forums");

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-xl p-6 relative shadow-2xl space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MessageCircle size={20} className="text-sky-600" /> All Course Forums
                    </h2>
                    <StyledButton variant="default" onClick={onClose} size="small">
                        <X size={16} />
                    </StyledButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-3 border-b pb-1">
                            <BookOpen size={18} className="text-indigo-500" /> Courses Available
                        </h3>
                        <ul className="space-y-2 text-gray-600 max-h-48 overflow-y-auto pr-2">
                            {displayCourses.map(course => (
                                <li key={course} className="flex items-center gap-2 p-2 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors">
                                    <BookOpen size={14} className="text-indigo-500 flex-shrink-0" />
                                    <span>{course}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-3 border-b pb-1">
                            <Hash size={18} className="text-teal-500" /> Active Forum Channels
                        </h3>
                        <ul className="space-y-2 text-gray-600 max-h-48 overflow-y-auto pr-2">
                            {displayForums.map(forum => (
                                <li key={forum} className="flex items-center gap-2 p-2 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors">
                                    <Hash size={14} className="text-teal-500 flex-shrink-0" />
                                    <span>{forum}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <StyledButton onClick={onClose} size="medium">
                        Close
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};


// Card component for Summary KPIs
interface KPICardProps {
    label: string;
    value: number;
    colorClass?: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, colorClass }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-md flex flex-col items-start transition-shadow hover:shadow-lg">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className={`text-3xl font-bold mt-1 ${colorClass ?? "text-gray-800"}`}>{value}</span>
    </div>
);


// --- MAIN COMPONENT ---
export default function ForumModerationDashboard() {
    // State for all messages
    const [messages, setMessages] = useState<Message[]>(initialForumMessages);

    // UI State
    const [selectedCourse, setSelectedCourse] = useState<string>("All Courses");
    const [selectedForum, setSelectedForum] = useState<string>("All Forums");
    const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
    const [showForumsListModal, setShowForumsListModal] = useState<boolean>(false);
    const [banModal, setBanModal] = useState<{ id: string; userName: string } | null>(null);

    // Rule State (for the modal)
    const [rulesForm, setRulesForm] = useState<RulesForm>({
        keywordFlags: "swearing, simple, beginner, complex",
        severityLevel: "Medium",
        autoPinOfficial: true,
    });

    // --- MODERATION HANDLERS (Simulated updates to local state) ---

    // Generic function to update a single message
    const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
        setMessages(prevMessages =>
            prevMessages.map(msg => (msg.id === id ? { ...msg, ...updates } : msg))
        );
    }, []);

    const handlePin = useCallback((id: string, currentPinStatus: boolean) => {
        updateMessage(id, { pinned: !currentPinStatus });
        console.log(`Message ${id} ${currentPinStatus ? 'unpinned' : 'pinned'}`);
    }, [updateMessage]);

    const handleOfficial = useCallback((id: string, currentOfficialStatus: boolean) => {
        updateMessage(id, { officialAnswer: !currentOfficialStatus });
        console.log(`Message ${id} marked as ${currentOfficialStatus ? 'unofficial' : 'official'}`);
    }, [updateMessage]);

    const initiateBan = useCallback((id: string, userName: string) => {
        setBanModal({ id, userName });
    }, []);

    const confirmBan = useCallback(() => {
        if (!banModal) return;

        // Simulated ban action: Remove all primary messages by this user
        const userToBanName = banModal.userName;

        setMessages(prevMessages =>
            prevMessages.filter(msg => msg.userName !== userToBanName)
        );
        console.log(`User ${userToBanName} banned and messages removed.`);
        setBanModal(null);
    }, [banModal]);

    const cancelBan = useCallback(() => {
        setBanModal(null);
    }, []);


    // --- FILTERING AND COMPUTATION ---

    const filteredMessages: Message[] = useMemo(() => {
        return messages.filter(
            (msg) =>
                (selectedCourse === "All Courses" ? true : msg.course === selectedCourse) &&
                (selectedForum === "All Forums" ? true : msg.forum === selectedForum)
        );
    }, [messages, selectedCourse, selectedForum]);

    const chartData = useMemo(() => getChartData(messages), [messages]);

    // Dashboard summary computation
    const totalFlagged = useMemo(() => filteredMessages.filter((m) => m.flagged).length, [filteredMessages]);
    const totalPinned = useMemo(() => filteredMessages.filter((m) => m.pinned).length, [filteredMessages]);
    const totalOfficial = useMemo(() => filteredMessages.filter((m) => m.officialAnswer).length, [filteredMessages]);


    // Message Rendering Component (Recursive for replies)
    interface MessageItemProps {
        msg: Message | Reply;
        isReply?: boolean;
        onPin?: (id: string, status: boolean) => void;
        onOfficial?: (id: string, status: boolean) => void;
        onBan?: (id: string, userName: string) => void;
    }

    const MessageItem: React.FC<MessageItemProps> = ({ msg, isReply = false, onPin, onOfficial, onBan }) => {
        const message = msg as Message; // Only use Message props if not a reply
        const primaryBg = isReply ? 'bg-white' : 'bg-white';
        const hoverBg = isReply ? 'hover:bg-gray-100' : 'hover:bg-gray-100';
        // Simpler border for replies
        const borderClass = isReply ? 'border-l-4 border-gray-300 ml-8 pl-4' : 'border border-gray-200';
        const avatarSize = isReply ? 'sm' : 'md';

        // Determine if it's the main post and has moderation actions
        const isMainPost = !isReply;

        return (
            <div className={`${primaryBg} p-4 rounded-lg ${borderClass} ${hoverBg} transition-all duration-150`}>
                <div className="flex gap-3 items-start">
                    <StyledAvatar src={msg.userAvatar} size={avatarSize} />
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-800">{msg.userName}</span>
                                <StyledChip
                                    label={msg.userType}
                                    icon={msg.userType === "Student" ? User : Users}
                                    color={msg.userType === "Student" ? "info" : "secondary"}
                                />
                                {isMainPost && message.pinned && <Pin size={16} className="text-sky-600" title="Pinned Post" />}
                                {isMainPost && message.officialAnswer && <StyledChip label="Official Answer" color="success" />}
                            </div>
                            <span className="text-xs text-gray-500">{msg.timestamp}</span>
                        </div>

                        <p className="text-gray-700 text-base leading-relaxed">{msg.message}</p>

                        <div className="flex items-center gap-3 text-sm text-gray-600 pt-2 flex-wrap">
                            {msg.likes > 0 && (
                                <div className="flex items-center gap-1 text-sky-600">
                                    <ThumbsUp size={14} />{msg.likes}
                                </div>
                            )}

                            {/* Flagged status only shown for main messages in this design */}
                            {isMainPost && message.flagged && (
                                <StyledChip
                                    label={`Flagged: ${message.severity}`}
                                    icon={AlertTriangle}
                                    color={getSeverityColor(message.severity)}
                                />
                            )}

                            {/* Moderator Actions */}
                            {isMainPost && onPin && onOfficial && onBan && (
                                <div className="flex gap-2 ml-auto">
                                    <StyledButton
                                        onClick={() => onPin(message.id, message.pinned)}
                                        variant={message.pinned ? "primary" : "outline-primary"} size="small"
                                    >
                                        <Pin size={14} className="mr-1" /> {message.pinned ? "Unpin" : "Pin"}
                                    </StyledButton>
                                    <StyledButton
                                        onClick={() => onOfficial(message.id, message.officialAnswer)}
                                        variant={message.officialAnswer ? "success" : "outline-success"} size="small"
                                    >
                                        <ThumbsUp size={14} className="mr-1" /> {message.officialAnswer ? "Unmark" : "Mark Official"}
                                    </StyledButton>
                                    <StyledButton
                                        onClick={() => onBan(message.id, message.userName)}
                                        variant="outline-error" size="small"
                                    >
                                        <X size={14} className="mr-1" /> Ban User
                                    </StyledButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Replies Container - Only render if it's a primary message */}
                {isMainPost && message.replies && message.replies.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        {message.replies.map((r) => (
                            // Replies don't need moderator actions passed down
                            <MessageItem key={r.id} msg={r} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Modal Content
    const RulesModal: React.FC = () => (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-11/12 md:w-1/2 lg:w-1/3 p-6 relative shadow-2xl">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Settings size={20} className="text-sky-600" /> Moderation Rules Settings
                    </h2>
                    <StyledButton variant="default" onClick={() => setShowRulesModal(false)}>
                        <X size={16} />
                    </StyledButton>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Flagging Keywords (Comma Separated)</label>
                    <textarea
                        rows={3}
                        value={rulesForm.keywordFlags}
                        onChange={(e) => setRulesForm({ ...rulesForm, keywordFlags: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-700 resize-none"
                        placeholder="e.g., help, confused, broken, stupid"
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Default Flag Severity</label>
                        <StyledSelect
                            label="Severity Level"
                            value={rulesForm.severityLevel}
                            onChange={(e) => setRulesForm({ ...rulesForm, severityLevel: e.target.value as RulesForm["severityLevel"] })}
                            options={["Low", "Medium", "High"]}
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <label className="text-sm font-medium text-gray-700">Auto-Pin Official Answers</label>
                        <input
                            type="checkbox"
                            checked={rulesForm.autoPinOfficial}
                            onChange={(e) => setRulesForm({ ...rulesForm, autoPinOfficial: e.target.checked })}
                            className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <StyledButton onClick={() => setShowRulesModal(false)} size="medium">
                        Save Rules
                    </StyledButton>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">

            {/* Header and View List Button */}
            <div className="flex justify-between items-center mb-4 border-b pb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                    <AlertTriangle size={28} className="text-red-500" /> Community Forum Moderation
                </h2>

                <div className="flex items-center gap-3">
                    <StyledButton onClick={() => setShowRulesModal(true)} size="medium" variant="outline-primary" className="w-full">
                        <Settings size={16} className="mr-2" /> Manage Moderation Rules
                    </StyledButton>
                    <StyledButton
                        variant="outline-primary"
                        size="medium"
                        onClick={() => setShowForumsListModal(true)}
                    >
                        <MessageCircle size={16} className="mr-2" /> View All Forums List
                    </StyledButton>
                </div>
            </div>

            {/* Top Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <KPICard label="Total Primary Messages" value={filteredMessages.length} colorClass="text-gray-800" />
                <KPICard label="Flagged Messages" value={totalFlagged} colorClass="text-red-600" />
                <KPICard label="Pinned Announcements" value={totalPinned} colorClass="text-sky-600" />
                <KPICard label="Official Instructor Answers" value={totalOfficial} colorClass="text-green-600" />
            </div>

            {/* Main Content: Filters, Graph, and Messages List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Filters, Actions, and Graph (1/3 width) */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Filter & Rules Card */}
                    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Filter & Settings</h3>

                        <div className="space-y-4 mb-6">
                            <StyledSelect
                                label="Filter by Course"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                options={courses}
                            />

                            <StyledSelect
                                label="Filter by Forum"
                                value={selectedForum}
                                onChange={(e) => setSelectedForum(e.target.value)}
                                options={forums}
                            />
                        </div>


                    </div>

                    {/* Graph Card (New Position) */}
                    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Moderation Trends</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="course" stroke="#9ca3af" tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={50} style={{ fontSize: '10px' }} />
                                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        fontSize: '12px'
                                    }}
                                    labelStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="Flagged" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Pinned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Official" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Messages List (2/3 width) */}
                <div className="lg:col-span-2 flex flex-col space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        Filtered Activity ({filteredMessages.length} Primary Messages)
                    </h3>

                    <div className="space-y-4">
                        {filteredMessages.length > 0 ? (
                            filteredMessages.map((msg) => (
                                <MessageItem
                                    key={msg.id}
                                    msg={msg}
                                    onPin={handlePin}
                                    onOfficial={handleOfficial}
                                    onBan={initiateBan}
                                />
                            ))
                        ) : (
                            <div className="bg-white p-6 rounded-lg text-center text-gray-500 border border-gray-200">
                                No messages found matching the current filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showRulesModal && <RulesModal />}
            {showForumsListModal && <ForumsListModal onClose={() => setShowForumsListModal(false)} courses={courses} forums={forums} />}
            {banModal && <BanConfirmationModal userName={banModal.userName} onConfirm={confirmBan} onCancel={cancelBan} />}
        </div>
    );
}
