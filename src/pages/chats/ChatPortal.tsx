import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, MessageSquareText, Send, User, BookOpen, Users } from 'lucide-react';

// --- CONSTANTS ---
const STUDENT_USER_ID = 'stud-1'; // We'll set the current user as Student Ben Smith

// --- TYPE DEFINITIONS ---

interface User {
    id: string;
    name: string;
    role: 'Super Admin' | 'Instructor' | 'Student';
    avatar: string;
}

interface Message {
    senderId: string;
    text: string;
    time: string;
    adminIntervention?: boolean;
}

interface Conversation {
    id: string;
    type: 'Course' | 'Direct'; // Changed 'Audit' to 'Course' for student perspective
    participants: string[]; // Array of User IDs
    title: string;
    lastMessage: string;
    lastTime: string;
    messages: Message[];
    courseId?: string; // New field for student-specific filtering
}

type ActiveTab = 'Course' | 'Direct';
type ViewMode = 'list' | 'chat';

// Map of User IDs to User objects
interface MockUsersMap {
    [key: string]: User;
}

// --- MOCK DATA ---
const MOCK_USERS: MockUsersMap = {
    'admin-1': { id: 'admin-1', name: 'Super Admin Ava', role: 'Super Admin', avatar: 'https://placehold.co/40x40/5b21b6/ffffff?text=SA' },
    'instr-1': { id: 'instr-1', name: 'Instructor Jane Doe', role: 'Instructor', avatar: 'https://placehold.co/40x40/059669/ffffff?text=JD' },
    'instr-2': { id: 'instr-2', name: 'Instructor Alex Ray', role: 'Instructor', avatar: 'https://placehold.co/40x40/c2410c/ffffff?text=AR' },
    'stud-1': { id: 'stud-1', name: 'Student Ben Smith', role: 'Student', avatar: 'https://placehold.co/40x40/6366f1/ffffff?text=BS' }, // Current User
    'stud-2': { id: 'stud-2', name: 'Student Chris Lee', role: 'Student', avatar: 'https://placehold.co/40x40/e11d48/ffffff?text=CL' },
};

const INITIAL_CONVERSATIONS: Conversation[] = [
    // This was an 'Audit' chat, now repurposed as a 'Course' chat involving the student
    {
        id: 'course-1',
        type: 'Course',
        participants: ['instr-1', 'stud-1', 'admin-1'],
        title: 'Advanced React Course Q&A', // More student-centric title
        lastMessage: 'I found the missing semicolon! Thanks.',
        lastTime: '10:05 AM',
        courseId: 'react-101', // Identifies this as a course chat
        messages: [
            { senderId: 'stud-1', text: 'I am stuck on module 3. The code won\'t compile.', time: '9:50 AM' },
            { senderId: 'instr-1', text: 'I see. Can you send me the screenshot of your error message?', time: '9:52 AM' },
            { senderId: 'stud-1', text: 'Yes, here it is (image attached).', time: '9:55 AM' },
            { senderId: 'instr-1', text: 'Ah, you have a missing semicolon. It\'s a common mistake!', time: '10:00 AM' },
            { senderId: 'admin-1', text: 'Please review the documentation on basic syntax errors. It is linked in the course resources.', time: '10:05 AM', adminIntervention: true },
            { senderId: 'stud-1', text: 'I found the missing semicolon! Thanks.', time: '10:05 AM' },
        ]
    },
    // Another course chat, but not for the current student, so it should be filtered out
    {
        id: 'course-2',
        type: 'Course',
        participants: ['instr-2', 'stud-2'],
        title: 'Intro to Python Q&A',
        lastMessage: 'I will submit the request to the admin panel.',
        lastTime: 'Yesterday',
        courseId: 'python-101',
        messages: [
            { senderId: 'stud-2', text: 'I think my grade for the final project is incorrect.', time: '4:00 PM' },
            { senderId: 'instr-2', text: 'Let me double-check the rubric against your submission.', time: '4:15 PM' },
        ]
    },
    // Direct chat with an Instructor
    {
        id: 'direct-1',
        type: 'Direct',
        participants: ['stud-1', 'instr-1'],
        title: 'Jane Doe (Instructor)',
        lastMessage: 'I can meet tomorrow at 2 PM.',
        lastTime: '1 day ago',
        messages: [
            { senderId: 'stud-1', text: 'Hi Jane, could I schedule a quick 1-on-1 to discuss project ideas?', time: '9:30 AM' },
            { senderId: 'instr-1', text: 'Sure! I can meet tomorrow at 2 PM. Does that work for you?', time: '10:00 AM' },
        ]
    },
    // Direct chat with a different Instructor
    {
        id: 'direct-2',
        type: 'Direct',
        participants: ['stud-1', 'instr-2'],
        title: 'Alex Ray (Instructor)',
        lastMessage: 'The deadline is next Friday.',
        lastTime: '3 days ago',
        messages: [
            { senderId: 'instr-2', text: 'Just a reminder that the final assignment is due next Friday.', time: '1:00 PM' },
            { senderId: 'stud-1', text: 'Got it, thanks for the heads-up.', time: '1:05 PM' },
        ]
    },
    // Direct chat between Admin and another Instructor (should be filtered out)
    {
        id: 'direct-3',
        type: 'Direct',
        participants: ['admin-1', 'instr-1'],
        title: 'Super Admin Ava',
        lastMessage: 'I have approved your new course proposal.',
        lastTime: '1 day ago',
        messages: [
            { senderId: 'instr-1', text: 'Hi Ava, I submitted the course proposal.', time: '9:30 AM' },
            { senderId: 'admin-1', text: 'Approved.', time: '10:00 AM' },
        ]
    },
];

// --- COMPONENTS ---

interface UserAvatarProps {
    userId: string;
    size?: string;
}

/**
 * Avatar Helper - Adjusted to remove the admin-specific setting icon
 */
const UserAvatar: React.FC<UserAvatarProps> = ({ userId, size = 'h-8 w-8' }) => {
    const user: User = MOCK_USERS[userId] || {} as User;
    const initials = user.name?.split(' ').map(n => n[0]).join('') || '??';
    const bgColor = user.role === 'Student' ? 'bg-indigo-100' : user.role === 'Instructor' ? 'bg-green-100' : 'bg-gray-100';
    const textColor = user.role === 'Student' ? 'text-indigo-600' : user.role === 'Instructor' ? 'text-green-600' : 'text-gray-600';

    return (
        <div className={`relative flex items-center justify-center rounded-full font-semibold text-xs ${size} flex-shrink-0 ${bgColor} ${textColor}`}>
            <span className="p-1">{initials}</span>
        </div>
    );
};

interface ConversationItemProps {
    convo: Conversation;
    selected: boolean;
    onClick: (convo: Conversation) => void;
}

/**
 * Conversation Item in the List
 */
const ConversationItem: React.FC<ConversationItemProps> = ({ convo, selected, onClick }) => {
    // Find the primary non-student user for the avatar (i.e., the Instructor or Admin)
    const primaryUserId = convo.participants.find(id => id !== STUDENT_USER_ID) || convo.participants[0];
    // A message is "unread" if the last message was NOT sent by the current student
    const unread = convo.messages.slice(-1)[0].senderId !== STUDENT_USER_ID;

    return (
        <div
            onClick={() => onClick(convo)}
            className={`flex items-center p-3 border-b cursor-pointer transition-colors ${selected ? 'bg-indigo-100 border-indigo-300' : 'hover:bg-gray-50'}`}
        >
            <UserAvatar userId={primaryUserId} />
            <div className="ml-3 flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${selected ? 'text-indigo-900' : 'text-gray-800'}`}>
                    {convo.title}
                </p>
                <p className={`text-xs truncate mt-0.5 ${unread ? 'font-bold text-gray-700' : 'text-gray-500'}`}>
                    {convo.lastMessage}
                </p>
            </div>
            <div className="text-xs text-gray-400 ml-2 flex-shrink-0 text-right">
                {convo.lastTime}
                {unread && (
                    <div className="h-2 w-2 bg-red-500 rounded-full ml-auto mt-1"></div>
                )}
            </div>
        </div>
    );
};

interface ChatMessageProps {
    message: Message;
    isSender: boolean;
}

/**
 * Chat Message Bubble - Adjusted for Student perspective
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender }) => {
    const sender: User = MOCK_USERS[message.senderId] || {} as User;
    const isInstructor = sender.role === 'Instructor';
    const isIntervention = message.adminIntervention; // Keep for the rare case of an admin being in the course chat

    let bubbleClass = 'p-3 rounded-xl max-w-xs sm:max-w-md';
    const textClass = 'text-sm';
    let containerClass = 'flex my-3';

    if (isIntervention) {
        // Admin Intervention (rarely seen by student, but kept for data integrity)
        bubbleClass += ' bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 shadow-lg';
        containerClass += ' justify-center';
    } else if (isSender) {
        // Student's message
        bubbleClass += ' bg-indigo-600 text-white rounded-br-none shadow-md';
        containerClass += ' justify-end';
    } else if (isInstructor) {
        // Instructor's message
        bubbleClass += ' bg-green-100 text-green-800 rounded-tl-none shadow-sm';
        containerClass += ' justify-start';
    } else {
        // Other (e.g., another student, admin direct)
        bubbleClass += ' bg-gray-200 text-gray-800 rounded-tl-none shadow-sm';
        containerClass += ' justify-start';
    }

    return (
        <div className={containerClass}>
            {!isIntervention && !isSender && <UserAvatar userId={message.senderId} size="h-8 w-8" />}
            <div className={`flex flex-col ${isIntervention ? 'items-center' : isSender ? 'items-end' : 'items-start'} ${isIntervention ? 'w-full' : 'mx-2'}`}>
                {/* Sender Name for non-Student messages (and non-intervention) */}
                {!isSender && !isIntervention && (
                    <span className={`text-xs font-medium mb-1 ${isInstructor ? 'text-green-700' : 'text-gray-600'}`}>
                        {sender.name} ({sender.role})
                    </span>
                )}

                {/* The Bubble */}
                <div className={bubbleClass}>
                    {isIntervention && <div className="font-bold mb-1 text-center">🛡️ Admin Notice</div>}
                    <p className={textClass}>
                        {message.text}
                    </p>
                    <span className={`block text-right mt-1 ${isSender ? 'text-indigo-200' : isIntervention ? 'text-yellow-600' : 'text-gray-500'} text-[10px]`}>
                        {message.time}
                    </span>
                </div>
            </div>
            {isSender && <UserAvatar userId={message.senderId} size="h-8 w-8" />}
        </div>
    );
};

interface ChatWindowProps {
    conversation: Conversation | undefined;
    onSend: (convoId: string | null, text?: string) => void;
    currentUserId: string;
}

// Icon added for the mobile back button
const ArrowLeft: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m15 18-6-6 6-6" />
    </svg>
);

/**
 * Chat Window / Message Display
 */
const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onSend, currentUserId }) => {
    const [newMessage, setNewMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (conversation) {
            scrollToBottom();
        }
    }, [conversation]);

    if (!conversation) {
        return (
            <div className="flex-1 hidden md:flex items-center justify-center p-8 bg-gray-50">
                <div className="text-center text-gray-500">
                    <MessageSquare size={48} className="mx-auto text-indigo-400" />
                    <p className="mt-4 text-lg font-semibold">Select a Conversation</p>
                    <p className="text-sm">
                        Use the tabs on the left to chat in **Course Q&A** or **Direct Chat** with an instructor.
                    </p>
                </div>
            </div>
        );
    }

    const isCourseChat: boolean = conversation.type === 'Course';
    // Get all participants *except* the current student
    const otherParticipants: string = conversation.participants
        .filter(id => id !== currentUserId)
        .map(id => MOCK_USERS[id]?.name)
        .join(' & ');

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSend(conversation.id, newMessage.trim());
            setNewMessage('');
        }
    };

    const inputPlaceholder = isCourseChat
        ? "Ask your course question..."
        : `Message ${conversation.title.replace(/\s\(Instructor\)/, '')}...`;

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 shadow-sm flex items-center justify-between bg-indigo-50">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        {isCourseChat ? <BookOpen size={18} className="text-green-600 mr-2" /> : <MessageSquareText size={18} className="text-indigo-700 mr-2" />}
                        {conversation.title}
                    </h3>
                    <p className={`text-xs font-medium mt-1 ${isCourseChat ? 'text-green-700' : 'text-indigo-600'}`}>
                        {isCourseChat ? 'Participants: ' : 'Chatting with: '} {otherParticipants}
                    </p>
                </div>
                {/* Mock Back Button for Mobile */}
                <button
                    onClick={() => onSend(null)} // Signals mobile back navigation
                    className="md:hidden p-2 rounded-full hover:bg-indigo-100 text-indigo-600"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {conversation.messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        message={msg}
                        isSender={msg.senderId === currentUserId}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={inputPlaceholder}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};


/**
 * Main Application Component (Student Portal)
 */
export default function StudentChatPortal() {
    const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
    const [activeTab, setActiveTab] = useState<ActiveTab>('Course');
    const [currentView, setCurrentView] = useState<ViewMode>('list');

    // Filter conversations to only include those the student is a participant in
    const studentConversations = conversations.filter(c => c.participants.includes(STUDENT_USER_ID));
    
    // Set initial selected ID to the first chat the student is in
    const initialSelectedId = studentConversations.length > 0 ? studentConversations[0].id : '';
    const [selectedConvoId, setSelectedConvoId] = useState<string>(initialSelectedId);


    const selectedConversation = studentConversations.find(c => c.id === selectedConvoId);

    // Filter by the active tab
    const filteredConversations = studentConversations.filter(c => c.type === activeTab);

    // Ensure the selected convo is still in the filtered list when tabs change
    useEffect(() => {
        if (!filteredConversations.some(c => c.id === selectedConvoId)) {
            setSelectedConvoId(filteredConversations.length > 0 ? filteredConversations[0].id : '');
        }
    }, [activeTab, filteredConversations, selectedConvoId]);


    const handleSelectConvo = (convo: Conversation) => {
        setSelectedConvoId(convo.id);
        setCurrentView('chat'); // Switch view on mobile
    };

    const handleSendMessage = (convoId: string | null, text?: string) => {
        if (convoId === null) {
            // Used for mobile back navigation
            setCurrentView('list');
            return;
        }

        if (!text) return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12; // Convert to 12-hour format

        const timeString = `${displayHours}:${minutes} ${ampm}`;

        const isCourse = activeTab === 'Course';

        const newMessage: Message = {
            senderId: STUDENT_USER_ID,
            text: text,
            time: timeString,
        };

        setConversations(prevConvos =>
            prevConvos.map(c => {
                if (c.id === convoId) {
                    return {
                        ...c,
                        messages: [...c.messages, newMessage],
                        lastMessage: `You: ${text}`,
                        lastTime: timeString,
                    };
                }
                return c;
            })
        );
    };

    return (
        <div className="flex h-190 w-full bg-gray-100 font-sans">
            <div className="flex w-full max-w-full h-full bg-white overflow-hidden">

                {/* Left Panel: Conversation List */}
                <div
                    className={`h-full border-r border-gray-200 transition-all duration-300 ease-in-out 
                        flex flex-col w-full md:w-80 lg:w-96 flex-shrink-0
                        ${currentView === 'chat' ? 'hidden md:flex' : ''}`
                    }
                >
                    <div className="p-4 border-b bg-indigo-700 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <User size={24} /> Student Portal
                        </h2>
                        <p className="text-sm opacity-80 mt-1">{MOCK_USERS[STUDENT_USER_ID].name}</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('Course')}
                            className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center transition-colors ${activeTab === 'Course' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-indigo-50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <BookOpen size={18} className="mr-2" /> Course Q&A
                        </button>
                        <button
                            onClick={() => setActiveTab('Direct')}
                            className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center transition-colors ${activeTab === 'Direct' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-indigo-50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <MessageSquareText size={18} className="mr-2" /> Direct Chat
                        </button>
                    </div>

                    {/* Search Mock */}
                    <div className="p-3 border-b">
                        <div className="relative">
                            <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search instructors..."
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Conversation List - This area scrolls */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map(convo => (
                                <ConversationItem
                                    key={convo.id}
                                    convo={convo}
                                    selected={convo.id === selectedConvoId}
                                    onClick={handleSelectConvo}
                                />
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">No active chats in this category.</div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Chat Window */}
                <div
                    className={`h-full flex-1 transition-all duration-300 ease-in-out 
                        ${currentView === 'list' ? 'hidden md:flex' : 'flex'}`
                    }
                >
                    <ChatWindow
                        conversation={selectedConversation}
                        onSend={handleSendMessage}
                        currentUserId={STUDENT_USER_ID}
                    />
                </div>
            </div>
        </div>
    );
}