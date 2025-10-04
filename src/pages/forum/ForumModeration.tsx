import React, { useState, useMemo } from 'react';
// Note: We are simulating MUI components (Box, Tabs, Tab) using Tailwind classes for a unified single-file environment.

// --- Type Definitions for Data Structures ---

interface Comment {
    id: number;
    author: string;
    authorRole: 'Student' | 'Instructor' | 'Mentor';
    content: string;
    date: string;
    likes: number;
    isBestAnswer: boolean;
}

interface Thread {
    id: number;
    title: string;
    author: string;
    authorRole: 'Student' | 'Instructor';
    date: string;
    likes: number;
    repliesCount: number;
    status: 'Answered' | 'Unanswered';
    isMyQuestion: boolean;
    hasInstructorComment: boolean;
    content: string; // Original question body
    comments: Comment[];
}


// --- STATIC DUMMY FORUM DATA ---

const CURRENT_COURSE_TITLE = "Mastering Modern Art & Design Principles (Tier 1)";

const DUMMY_THREADS: Thread[] = [
    {
        id: 1,
        title: "What is the core difference between Bauhaus and De Stijl?",
        author: "Alex Johnson",
        authorRole: "Student",
        date: "3 hours ago",
        likes: 45,
        repliesCount: 8,
        status: "Answered",
        isMyQuestion: true, // This is 'My Question'
        hasInstructorComment: true,
        content: "I'm having trouble distinguishing the foundational philosophy of these two movements. Both seem focused on utility and geometry. Can someone provide a concise summary of their main ideological separation?",
        comments: [
            { id: 101, author: "Sarah Lee", authorRole: "Student", content: "Bauhaus was more about marrying art and industrial design, making objects accessible. De Stijl was strictly about abstract, pure geometric forms and primary colors.", date: "2 hours ago", likes: 12, isBestAnswer: true },
            { id: 102, author: "Dr. Elena Vance", authorRole: "Instructor", content: "That's a great question, Alex! Sarah's summary is accurate. To add: De Stijl was an *ideology* for total abstraction, while Bauhaus was a *school* focused on vocational training and mass-production principles.", date: "1 hour ago", likes: 25, isBestAnswer: false },
        ]
    },
    {
        id: 2,
        title: "Help understanding the color theory behind Impressionism",
        author: "Priya Sharma",
        authorRole: "Student",
        date: "1 day ago",
        likes: 12,
        repliesCount: 3,
        status: "Unanswered",
        isMyQuestion: false,
        hasInstructorComment: false,
        content: "I'm confused about complementary colors in Impressionism. Monet seems to mix them directly on the canvas, while others use optical mixing. Is there a rule?",
        comments: [
            { id: 201, author: "Chris Green", authorRole: "Mentor", content: "It varies by artist! Monet's approach heavily relied on optical mixing—placing pure colors side-by-side. I recommend checking out the section on 'Broken Color' in Module 3.", date: "23 hours ago", likes: 8, isBestAnswer: false },
        ]
    },
    {
        id: 3,
        title: "Does Surrealism still influence modern digital art?",
        author: "Jake Peralta",
        authorRole: "Student",
        date: "4 days ago",
        likes: 88,
        repliesCount: 15,
        status: "Answered",
        isMyQuestion: false,
        hasInstructorComment: true,
        content: "I see a lot of uncanny valley and dream-like scenarios in modern 3D rendering. Is this a direct influence of Surrealism or just a coincidence?",
        comments: [
            { id: 301, author: "Dr. Elena Vance", authorRole: "Instructor", content: "Absolutely. Surrealism's exploration of the subconscious is a cornerstone of modern conceptual art, especially in the digital space. The uncanny valley is a very direct descendant of Dali's work!", date: "2 days ago", likes: 30, isBestAnswer: true },
            { id: 302, author: "Jane Doe", authorRole: "Student", content: "Check out the artist 'Beeple'—his work is heavily rooted in Surrealist principles!", date: "2 days ago", likes: 5, isBestAnswer: false },
        ]
    },
];

// --- Type Definitions for Component Props ---

interface FilterTabProps {
    label: string;
    value: string;
    isActive: boolean;
    onClick: (value: string) => void;
}

interface BadgeProps {
    children: React.ReactNode;
    colorClass: string;
    size?: string;
}

interface ThreadCardProps {
    thread: Thread;
    onSelect: (id: number) => void;
}

interface CommentItemProps {
    comment: Comment;
}


// --- Utility Components (Simulating MUI/Design Elements) ---

/**
 * Custom Tab Button component to maintain the design consistency.
 */
const FilterTab: React.FC<FilterTabProps> = ({ label, value, isActive, onClick }) => (
    <button
        onClick={() => onClick(value)}
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2
            ${isActive
                ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
    >
        {label}
    </button>
);

/**
 * Badge for identifying roles or status.
 */
const Badge: React.FC<BadgeProps> = ({ children, colorClass, size = 'text-xs' }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${size} font-semibold leading-none ${colorClass}`}>
        {children}
    </span>
);

/**
 * Renders an individual discussion thread card in the list view.
 */
const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onSelect }) => {
    const statusColor = thread.status === 'Answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

    return (
        <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100 dark:border-gray-700"
            onClick={() => onSelect(thread.id)}
        >
            <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate hover:underline">
                    {thread.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Posted by **{thread.author}** {thread.hasInstructorComment && (
                        <span className="ml-2 font-bold text-blue-600 dark:text-blue-400 text-xs">
                            (Instructor Replied)
                        </span>
                    )}
                    <span className="ml-2 text-xs"> $\cdot$ {thread.date}</span>
                </p>
            </div>

            <div className="flex items-center space-x-4 text-sm font-medium flex-shrink-0">
                <Badge colorClass={statusColor}>{thread.status}</Badge>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="mr-1">❤️</span> {thread.likes}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="mr-1">💬</span> {thread.repliesCount}
                </div>
            </div>
        </div>
    );
};

/**
 * Renders a single comment/reply in the detail view.
 */
const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    let roleColor = 'bg-gray-200 text-gray-700';
    let roleTag = 'Student';
    let isImportant = false;

    if (comment.authorRole === 'Instructor') {
        roleColor = 'bg-blue-600 text-white';
        roleTag = 'Instructor';
        isImportant = true;
    } else if (comment.authorRole === 'Mentor') {
        roleColor = 'bg-purple-600 text-white';
        roleTag = 'Mentor';
        isImportant = true;
    }

    return (
        <div className={`p-4 rounded-lg mt-4 ${isImportant ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 dark:text-white">{comment.author}</span>
                    <Badge colorClass={roleColor} size='text-[10px]'>
                        {roleTag}
                    </Badge>
                    {comment.isBestAnswer && (
                        <Badge colorClass="bg-green-500 text-white" size='text-[10px]'>
                            ✓ Best Answer
                        </Badge>
                    )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</div>
            </div>
            <p className={`text-gray-700 dark:text-gray-200 ${isImportant ? 'font-medium' : ''}`}>{comment.content}</p>
            <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <button className="flex items-center hover:text-blue-600 transition">
                    <span className="mr-1 text-red-500">❤️</span> Like ({comment.likes})
                </button>
                <button className="hover:text-blue-600 transition">
                    Reply
                </button>
            </div>
        </div>
    );
};


// --- MAIN FORUM PAGE COMPONENT ---

const CourseForumPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
    const filterTabs = ["All", "Unanswered", "My Questions", "Most Liked"];

    const selectedThread = useMemo(() => {
        return DUMMY_THREADS.find(t => t.id === selectedThreadId);
    }, [selectedThreadId]);

    const filteredThreads = useMemo(() => {
        let threads = DUMMY_THREADS;

        if (activeFilter === "Unanswered") {
            threads = threads.filter(thread => thread.status === "Unanswered");
        } else if (activeFilter === "My Questions") {
            threads = threads.filter(thread => thread.isMyQuestion);
        } else if (activeFilter === "Most Liked") {
            // Sort by likes descending
            threads = [...threads].sort((a, b) => b.likes - a.likes);
        }

        return threads;
    }, [activeFilter]);

    // Conditional rendering: Show detail view if a thread is selected, otherwise show the list view.
    const renderContent = () => {
        if (selectedThread) {
            return (
                <div>
                    {/* Header for Detail View */}
                    <div className="mb-6">
                        <button
                            onClick={() => setSelectedThreadId(null)}
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-4 text-sm font-medium"
                        >
                            <span className="mr-1">&larr;</span> Back to Discussion List
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedThread.title}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Posted by **{selectedThread.author}** $\cdot$ {selectedThread.date}
                        </p>
                    </div>

                    {/* Original Question Content */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                            {selectedThread.content}
                        </p>
                        <div className="flex items-center mt-4 space-x-4 text-sm text-gray-500 dark:text-gray-400 border-t pt-3 border-gray-100 dark:border-gray-700">
                            <button className="flex items-center text-red-500 font-semibold hover:text-red-600 transition">
                                <span className="mr-1">❤️</span> Like ({selectedThread.likes})
                            </button>
                            <Badge colorClass={selectedThread.status === 'Answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {selectedThread.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Comments/Replies Section */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        {selectedThread.comments.length} Replies
                    </h2>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedThread.comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>

                    {/* Ask/Reply Box */}
                    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-200 dark:border-blue-900">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
                            Post Your Answer or Reply
                        </h3>
                        <textarea
                            className="w-full p-3 h-24 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Share your knowledge or ask a follow-up..."
                        />
                        <div className="flex justify-end mt-3">
                            <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-md">
                                Submit Reply
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // --- LIST VIEW (Default) ---
        return (
            <div className="animate-in fade-in">
                {/* Filter Tabs & New Post Button */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-1">
                        {filterTabs.map((filter) => (
                            <FilterTab
                                key={filter}
                                label={filter}
                                value={filter}
                                isActive={activeFilter === filter}
                                onClick={setActiveFilter}
                            />
                        ))}
                    </div>
                    <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-lg flex items-center mb-10">
                        <span className="text-xl mr-2">+</span> Ask a Question
                    </button>
                </div>

                {/* Thread List */}
                <div className="space-y-4">
                    {filteredThreads.length > 0 ? (
                        filteredThreads.map((thread) => (
                            <ThreadCard key={thread.id} thread={thread} onSelect={setSelectedThreadId} />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                            No threads found matching the **{activeFilter}** filter.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Page Header and Context */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
                {/* Back Link (Simulated navigation) */}
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-3 block">
                    &larr; Back to Course Dashboard
                </a>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                    Forum: {CURRENT_COURSE_TITLE}
                </h2>

                {/* Search Input (Simulating the Input component from your demo) */}
                <div className="mt-4">
                    <input
                        type="search"
                        placeholder={`Search discussions in ${CURRENT_COURSE_TITLE}...`}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Main Content Area: List or Detail View */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
}

export default CourseForumPage;