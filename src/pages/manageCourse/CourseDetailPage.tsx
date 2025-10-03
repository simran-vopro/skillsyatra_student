// src/pages/CourseDetailPage.tsx - CLEAN, MODERN, WITH COURSE DETAILS CARD & ADVANCED DISCUSSION

import { useState, useMemo } from "react";
import {
    Box,
    Typography,
    Button,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Avatar,
    Paper,
    Tabs,
    Tab,
    useMediaQuery,
    Drawer,
    IconButton,
    InputAdornment
} from "@mui/material";
import {
    CheckCircle,
    Play,
    Lock,
    ChevronDown,
    Download,
    FileText,
    Zap,
    MessageCircle,
    Menu,
    Star,
    Heart,
    Send,
    Filter,
    HelpCircle,
    MessageSquare,
    User
} from "lucide-react";
import { useNavigate } from "react-router";

// ---------- DATA STRUCTURES ----------
interface Reply { id: number; user: string; comment: string; time: string; isInstructor: boolean; }
interface Thread {
    id: number;
    type: "question" | "comment";
    user: string;
    title: string;
    comment: string;
    time: string;
    likes: number;
    isAnswered: boolean;
    replies: Reply[];
}
interface Chapter {
    id: number;
    title: string;
    isCompleted: boolean;
    isLocked: boolean;
    hasVideo: boolean;
    htmlContent: string;
    resources?: { name: string; url: string }[];
    quiz?: Quiz;
    discussionThreads?: Thread[]; // Changed to discussionThreads
}
interface Module { id: number; title: string; chapters: Chapter[]; }
interface Quiz { type: "mcq" | "yesno" | "fillblank"; question: string; options?: string[]; correctAnswer?: string | boolean; isAttempted: boolean; isCorrect: boolean; }

// ---------- MOCK DATA ----------
const MOCK_COURSE_DATA: Module[] = [
    {
        id: 1, title: "Module 1: Foundations (3 Lessons)", chapters: [
            {
                id: 101,
                title: "1.1 Welcome & Course Setup",
                isCompleted: true,
                isLocked: false,
                hasVideo: true,
                htmlContent: "<h2>Introduction to Web Development</h2><p>This section covers initial setup and expectations. Focus on setting up your local environment.</p>",
                discussionThreads: [
                    {
                        id: 1, type: "question", user: "Alice", title: "Setup Help",
                        comment: "I'm having trouble installing the dependencies. Any advice?", time: "2h ago",
                        likes: 5, isAnswered: false, replies: []
                    },
                    {
                        id: 2, type: "comment", user: "Bob", title: "Excited to start!",
                        comment: "The intro video was great! Feeling motivated.", time: "1h ago",
                        likes: 12, isAnswered: true,
                        replies: [
                            { id: 21, user: "Jane Doe", comment: "Glad to hear it, Bob! Keep up the great work. (Instructor)", time: "30m ago", isInstructor: true }
                        ]
                    }
                ]
            },
            { id: 102, title: "1.2 Core Principles of Design", isCompleted: false, isLocked: false, hasVideo: false, htmlContent: "<h2>Design Theory</h2><p>Focus on responsive design and grid systems.</p>" },
            { id: 103, title: "1.3 Knowledge Check: Quiz 1", isCompleted: false, isLocked: false, hasVideo: false, htmlContent: "<h2>Time for a quick quiz!</h2>", quiz: { type: 'mcq', question: "What is an Atom in design systems?", options: ["UI element", "Full page layout"], isAttempted: false, isCorrect: false } }
        ]
    },
    {
        id: 2, title: "Module 2: Advanced Components (2 Lessons)", chapters: [
            { id: 201, title: "2.1 Building Atomic Buttons", isCompleted: false, isLocked: true, hasVideo: true, htmlContent: "<h2>Button Component Deep Dive</h2><p>Focus on accessibility and states.</p>" },
            { id: 202, title: "2.2 Style Documentation", isCompleted: false, isLocked: true, hasVideo: false, htmlContent: "<h2>Creating your documentation hub.</h2>" }
        ]
    }
];

const COURSE_DETAILS = {
    modeium: "Professional",
    title: "Web Dev Bootcamp",
    description: "Learn how to build modern, responsive websites and understand full-stack development principles.",
    instructor: "Jane Doe",
    rating: 4.9,
    reviews: 1204,
    level: "Intermediate"
};

const CURRENT_USER = "You"; // For local testing of 'My Questions' filter

// ---------- HELPERS ----------
const ChapterIcon = ({ isCompleted, isLocked }: { isCompleted: boolean; isLocked: boolean }) => {
    if (isCompleted) return <CheckCircle size={18} className="text-green-600 mr-2 flex-shrink-0" />;
    if (isLocked) return <Lock size={18} className="text-gray-400 mr-2 flex-shrink-0" />;
    return <Play size={18} className="text-indigo-600 mr-2 flex-shrink-0" />;
};

const ActivityPanel = ({ quiz }: { quiz?: Quiz }) => {
    if (!quiz) return null;
    return (
        <Paper elevation={0} className="mt-8 p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 transition-all duration-300">
            <Typography variant="h6" className="flex items-center mb-4 font-bold text-yellow-800">
                <Zap size={20} className="mr-2" /> Activity / Quiz
            </Typography>
            <Typography variant="body1" className="mb-4 font-semibold">{quiz.question}</Typography>

            {quiz.options?.map((opt, i) => (
                <Box key={i} className={`flex items-center mb-2 transition rounded p-2 ${!quiz.isAttempted ? 'hover:bg-yellow-100 cursor-pointer' : ''}`}>
                    <input type="radio" name="quiz" disabled={quiz.isAttempted} className="mr-3 accent-indigo-600" />
                    <Typography variant="body2">{opt}</Typography>
                </Box>
            ))}

            <Box className="flex justify-between items-center mt-4 pt-3 border-t border-yellow-200">
                <Typography variant="body2" color={quiz.isAttempted ? "success.main" : "text.secondary"}>
                    Status: **{quiz.isAttempted ? "Attempted" : "Pending"}**
                </Typography>
                <Button size="small" variant="contained" className="bg-indigo-600 hover:bg-indigo-700 normal-case" disabled={quiz.isAttempted}>Submit Answer</Button>
            </Box>
        </Paper>
    );
};

// --- ADVANCED DISCUSSION PANEL ---
const DiscussionPanel = ({ chapterId, threads, onAddThread, onAddReply, onLikeThread }:
    {
        chapterId: number;
        threads: Thread[];
        onAddThread: (thread: Omit<Thread, 'id' | 'time' | 'likes' | 'replies' | 'isAnswered'>) => void;
        onAddReply: (threadId: number, comment: string) => void;
        onLikeThread: (threadId: number) => void;
    }) => {
    const [tab, setTab] = useState(0); // 0: All, 1: Unanswered, 2: My Questions, 3: Most Liked
    const [isPosting, setIsPosting] = useState(false);
    const [newThreadTitle, setNewThreadTitle] = useState("");
    const [newThreadComment, setNewThreadComment] = useState("");
    const [newThreadType, setNewThreadType] = useState<"question" | "comment">("question");

    const filteredThreads = useMemo(() => {
        let list = [...threads];

        if (tab === 1) { // Unanswered
            list = list.filter(t => t.type === 'question' && !t.isAnswered);
        } else if (tab === 2) { // My Questions
            list = list.filter(t => t.type === 'question' && t.user === CURRENT_USER);
        } else if (tab === 3) { // Most Liked
            list.sort((a, b) => b.likes - a.likes);
        } else { // All Threads
            list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()); // Sort by newest
        }
        return list;
    }, [threads, tab]);

    const handlePostThread = () => {
        if (!newThreadComment.trim() || (newThreadType === 'question' && !newThreadTitle.trim())) return;

        onAddThread({
            user: CURRENT_USER,
            type: newThreadType,
            title: newThreadType === 'question' ? newThreadTitle : newThreadType.charAt(0).toUpperCase() + newThreadType.slice(1),
            comment: newThreadComment,
        });

        setNewThreadTitle("");
        setNewThreadComment("");
        setIsPosting(false);
    };

    const ThreadItem = ({ thread }: { thread: Thread }) => {
        const [showReply, setShowReply] = useState(false);
        const [replyText, setReplyText] = useState("");

        const handleReply = () => {
            if (!replyText.trim()) return;
            onAddReply(thread.id, replyText);
            setReplyText("");
            setShowReply(false);
        };

        const isMyQuestion = thread.user === CURRENT_USER;
        const isQuestion = thread.type === 'question';
        const isUnanswered = isQuestion && !thread.isAnswered;

        return (
            <Paper elevation={0} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 transition hover:shadow-md">
                <Box className="flex space-x-3">
                    <Avatar className="bg-indigo-100 text-indigo-800 flex-shrink-0">{thread.user.charAt(0)}</Avatar>
                    <Box className="flex-grow">
                        <Box className="flex justify-between items-center">
                            <Typography variant="subtitle2" className="font-semibold flex items-center">
                                {thread.user}
                                <span className="text-xs text-gray-400 font-normal ml-2">· {thread.time}</span>
                                {isQuestion &&
                                    <span className={`text-xs ml-3 px-2 py-0.5 rounded-full font-bold ${isUnanswered ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {isUnanswered ? 'Unanswered Question' : 'Answered'}
                                    </span>
                                }
                            </Typography>
                        </Box>
                        <Typography variant="h6" className="mt-1 font-bold text-gray-900">{thread.title}</Typography>
                        <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mt-1">{thread.comment}</Typography>

                        {/* Actions */}
                        <Box className="flex items-center space-x-4 mt-3 pt-2 border-t border-gray-100">
                            <Button
                                size="small"
                                startIcon={<Heart size={16} fill="currentColor" />}
                                onClick={() => onLikeThread(thread.id)}
                                className="normal-case text-red-500 hover:bg-red-50"
                            >
                                {thread.likes} Likes
                            </Button>
                            <Button
                                size="small"
                                startIcon={<MessageSquare size={16} />}
                                onClick={() => setShowReply(!showReply)}
                                className="normal-case text-indigo-600 hover:bg-indigo-50"
                            >
                                {thread.replies.length} Replies
                            </Button>
                        </Box>

                        {/* Replies */}
                        {thread.replies.length > 0 && (
                            <Box className="mt-4 pl-4 border-l border-gray-200 space-y-3">
                                <Typography variant="caption" className="font-semibold text-gray-500">Replies ({thread.replies.length}):</Typography>
                                {thread.replies.map(r => (
                                    <Box key={r.id} className="flex space-x-2">
                                        <Avatar className={`w-6 h-6 text-xs ${r.isInstructor ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>{r.user.charAt(0)}</Avatar>
                                        <Box>
                                            <Typography variant="caption" className="font-semibold flex items-center">
                                                {r.user}
                                                {r.isInstructor && <span className="ml-2 px-1 rounded bg-purple-600 text-white text-[10px] font-bold">INSTRUCTOR</span>}
                                                <span className="text-[10px] text-gray-400 font-normal ml-2">· {r.time}</span>
                                            </Typography>
                                            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">{r.comment}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Reply Input */}
                        {showReply && (
                            <Box className="mt-4 pt-3 border-t border-gray-100">
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={`Reply to ${thread.user}...`}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton edge="end" onClick={handleReply} disabled={!replyText.trim()}><Send size={18} className="text-indigo-600" /></IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Paper>
        );
    };

    return (
        <Box className="mt-12 pt-6 border-t border-gray-200">
            <Typography variant="h5" className="flex items-center mb-6 font-bold text-gray-900">
                <MessageCircle size={24} className="mr-3 text-indigo-600" /> Lesson Discussion ({threads.length})
            </Typography>

            {/* Post New Thread Button */}
            <Box className="my-6">
                <Button variant="contained" className="bg-indigo-600 hover:bg-indigo-700 normal-case" onClick={() => setIsPosting(!isPosting)} startIcon={isPosting ? <ChevronDown size={20} /> : <HelpCircle size={20} />}>
                    {isPosting ? 'Hide Post Form' : 'Ask a Question / Leave a Comment'}
                </Button>
            </Box>

            {/* New Thread Form */}
            {isPosting && (
                <Paper elevation={1} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 mb-8 border border-gray-200">
                    <Box className="mb-4 flex space-x-4 gap-5">
                        <Button
                            variant={newThreadType === 'question' ? 'contained' : 'outlined'}
                            onClick={() => setNewThreadType('question')}
                            startIcon={<HelpCircle size={18} />}
                            className={newThreadType === 'question' ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-indigo-600 border-indigo-200'}
                            size="small"
                        >
                            Question
                        </Button>
                        <Button
                            variant={newThreadType === 'comment' ? 'contained' : 'outlined'}
                            onClick={() => setNewThreadType('comment')}
                            startIcon={<MessageSquare size={18} />}
                            className={newThreadType === 'comment' ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-indigo-600 border-indigo-200'}
                            size="small"
                        >
                            Comment
                        </Button>
                    </Box>
                    {newThreadType === 'question' && (
                        <TextField
                            fullWidth
                            label="Question Title (e.g., Error on step 3)"
                            value={newThreadTitle}
                            onChange={(e) => setNewThreadTitle(e.target.value)}
                            className="mb-5"
                        />
                    )}
                    <div className="mt-5"></div>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={newThreadType === 'question' ? "Describe your question in detail..." : "Share your thoughts or feedback..."}
                        value={newThreadComment}
                        onChange={(e) => setNewThreadComment(e.target.value)}
                        className="my-4"
                    />
                    <Box className="text-right mt-5">
                        <Button
                            variant="contained"
                            className="bg-green-600 hover:bg-green-700 normal-case"
                            onClick={handlePostThread}
                            disabled={!newThreadComment.trim() || (newThreadType === 'question' && !newThreadTitle.trim())}
                        >
                            Post {newThreadType.charAt(0).toUpperCase() + newThreadType.slice(1)}
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Filter Tabs */}
            <Paper elevation={0} className="mb-6 p-2 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center">
                <Filter size={18} className="text-gray-600 mr-2 ml-1 flex-shrink-0" />
                <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto" className="flex-grow">
                    <Tab label="All Threads" className="normal-case min-h-0 py-2" />
                    <Tab label="Unanswered" className="normal-case min-h-0 py-2" />
                    <Tab label="My Questions" className="normal-case min-h-0 py-2" />
                    <Tab label="Most Liked" className="normal-case min-h-0 py-2" />
                </Tabs>
            </Paper>

            {/* Thread List */}
            <Box className="space-y-6">
                {filteredThreads.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" className="p-4 text-center">
                        No threads match the current filter.
                    </Typography>
                ) : (
                    filteredThreads.map(thread => <ThreadItem key={thread.id} thread={thread} />)
                )}
            </Box>
        </Box>
    );
};

// ---------- MAIN COMPONENT ----------
export default function CourseDetailPage() {
    const [courseModules, setCourseModules] = useState(MOCK_COURSE_DATA);
    const [selectedChapterId, setSelectedChapterId] = useState<number>(101);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:768px)');

    const allChapters = useMemo(() => courseModules.flatMap(m => m.chapters), [courseModules]);
    const currentChapter = allChapters.find(c => c.id === selectedChapterId)!;

    const totalChapters = allChapters.length;
    const completedChapters = allChapters.filter(c => c.isCompleted).length;
    const globalProgress = Math.round((completedChapters / totalChapters) * 100);

    const currentIndex = allChapters.findIndex(c => c.id === selectedChapterId);
    const previousChapter = allChapters[currentIndex - 1];
    const nextChapter = allChapters[currentIndex + 1];

    const getNewThreadId = (threads: Thread[]) => threads.length > 0 ? Math.max(...threads.map(t => t.id)) + 1 : 1;

    // Handler for adding a new main discussion thread
    const handleAddThread = (newThread: Omit<Thread, 'id' | 'time' | 'likes' | 'replies' | 'isAnswered'>) => {
        setCourseModules(prev => prev.map(m => ({
            ...m,
            chapters: m.chapters.map(c => {
                if (c.id === selectedChapterId) {
                    const newThreads = c.discussionThreads || [];
                    const newId = getNewThreadId(newThreads);
                    return {
                        ...c,
                        discussionThreads: [
                            {
                                ...newThread,
                                id: newId,
                                time: "Just now",
                                likes: 0,
                                replies: [],
                                isAnswered: newThread.type === 'comment'
                            },
                            ...newThreads
                        ]
                    };
                }
                return c;
            })
        })));
    };

    // Handler for adding a reply to an existing thread
    const handleAddReply = (threadId: number, comment: string) => {
        setCourseModules(prev => prev.map(m => ({
            ...m,
            chapters: m.chapters.map(c => {
                if (c.id === selectedChapterId) {
                    const updatedThreads = (c.discussionThreads || []).map(t => {
                        if (t.id === threadId) {
                            const newReplyId = t.replies.length > 0 ? Math.max(...t.replies.map(r => r.id)) + 1 : 1;
                            return {
                                ...t,
                                replies: [
                                    ...t.replies,
                                    { id: newReplyId, user: CURRENT_USER, comment, time: "Just now", isInstructor: false }
                                ],
                                // Mark question as answered if it was a question and someone replied
                                isAnswered: t.type === 'question' ? true : t.isAnswered
                            };
                        }
                        return t;
                    });
                    return { ...c, discussionThreads: updatedThreads };
                }
                return c;
            })
        })));
    };

    // Handler for liking a thread
    const handleLikeThread = (threadId: number) => {
        setCourseModules(prev => prev.map(m => ({
            ...m,
            chapters: m.chapters.map(c => {
                if (c.id === selectedChapterId) {
                    const updatedThreads = (c.discussionThreads || []).map(t => {
                        if (t.id === threadId) {
                            return { ...t, likes: t.likes + 1 }; // Simple increment for mock
                        }
                        return t;
                    });
                    return { ...c, discussionThreads: updatedThreads };
                }
                return c;
            })
        })));
    };

    const handleMarkComplete = () => {
        setCourseModules(prev => prev.map(m => ({
            ...m,
            chapters: m.chapters.map((c, idx) => {
                if (c.id === selectedChapterId) return { ...c, isCompleted: true };
                // Unlock the next chapter
                if (idx === currentIndex + 1 && c.isLocked) return { ...c, isLocked: false };
                return c;
            })
        })));
    };

    const SidebarContent = (
        <Box className="w-72 bg-white dark:bg-gray-800 p-4 h-full">
            <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white">
                Course Curriculum
            </Typography>
            {courseModules.map(m => {
                const moduleTotal = m.chapters.length;
                const moduleCompleted = m.chapters.filter(c => c.isCompleted).length;
                const moduleProgress = Math.round((moduleCompleted / moduleTotal) * 100);

                return (
                    <Accordion key={m.id} defaultExpanded className="!shadow-none !mt-2 !bg-transparent !before:hidden transition-all border-b border-gray-200 dark:border-gray-700">
                        <AccordionSummary expandIcon={<ChevronDown size={18} className="text-indigo-500" />}>
                            <Box className="w-full">
                                <Typography variant="body2" className="font-semibold text-gray-800 dark:text-gray-200">{m.title}</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={moduleProgress}
                                    sx={{ height: 4, borderRadius: 2, mt: 1, bgcolor: '#e5e7eb', '& .MuiLinearProgress-bar': { bgcolor: moduleProgress === 100 ? '#10b981' : '#4f46e5' } }} // green or indigo
                                />
                                <Typography variant="caption" color="text.secondary">{moduleCompleted}/{moduleTotal} lessons</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails className="!p-0">
                            {m.chapters.map(c => (
                                <Box
                                    key={c.id}
                                    onClick={() => { if (!c.isLocked) { setSelectedChapterId(c.id); if (isMobile) setMobileOpen(false); } }}
                                    className={`flex items-start pl-4 pr-3 py-3 rounded-lg cursor-pointer transition 
                                                 ${c.isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} 
                                                 ${c.id === selectedChapterId ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
                                >
                                    <ChapterIcon isCompleted={c.isCompleted} isLocked={c.isLocked} />
                                    <Typography variant="body2" className="flex-grow">{c.title}</Typography>
                                </Box>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );

    const navigate = useNavigate();

    return (
        <Box className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">


            <Paper elevation={2} className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200">
                <Box className="flex justify-between items-start mb-4">
                    <Box>
                        <Typography variant="h4" className="font-extrabold text-gray-900 dark:text-white mb-1">{COURSE_DETAILS.title}</Typography>
                        <Typography variant="subtitle2" className="text-indigo-600 font-semibold mb-2">
                            <span className="bg-indigo-100 px-2 py-0.5 rounded-full text-xs mr-2 font-bold">{COURSE_DETAILS.modeium}</span>
                            Level: {COURSE_DETAILS.level}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="max-w-3xl">{COURSE_DETAILS.description}</Typography>
                    </Box>
                    <Box className="text-right flex-shrink-0">
                        <Box className="flex items-center space-x-1 justify-end">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <Typography variant="h6" className="font-bold">{COURSE_DETAILS.rating}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">({COURSE_DETAILS.reviews} reviews)</Typography>
                        <Box className="flex items-center mt-2">
                            <Avatar className="w-6 h-6 mr-1 text-xs bg-gray-200 text-gray-800">JD</Avatar>
                            <Typography variant="body2">By **{COURSE_DETAILS.instructor}**</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className="mt-4 pt-4 border-t border-gray-100">
                    <Typography variant="body2" className="font-medium text-gray-700 dark:text-gray-300">
                        Overall Progress: {completedChapters}/{totalChapters} Lessons ({globalProgress}%)
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={globalProgress}
                        className="mt-2"
                        sx={{ height: 8, borderRadius: 4, bgcolor: '#e5e7eb', '& .MuiLinearProgress-bar': { bgcolor: globalProgress === 100 ? '#10b981' : '#4f46e5' } }}
                    />
                </Box>
            </Paper>

            {/* --- TOP FIXED HEADER / QUICK MENU (Floating Add On Top After Card) --- */}
            <Box className="sticky top-0 z-40 bg-white dark:bg-gray-800 p-3 shadow-lg flex justify-between items-center border-b border-gray-200 my-5">
                <Typography variant="subtitle1" className="font-bold text-indigo-600 flex-grow">{COURSE_DETAILS.title}</Typography>

                {/* Floating Add On Top (Quick Menu) */}
                <Box className="flex space-x-2 gap-2">
                    <Button onClick={() => {
                        navigate('/chats', { state: { instructor: COURSE_DETAILS.instructor } });
                    }} variant="outlined" size="small" startIcon={<Zap size={16} />} className="text-indigo-600 border-indigo-200 normal-case">Ask Instructor</Button>
                    <Button variant="outlined" size="small" startIcon={<FileText size={16} />} className="text-indigo-600 border-indigo-200 normal-case">Get Certificate</Button>
                    {isMobile && <IconButton onClick={() => setMobileOpen(true)}><Menu /></IconButton>}
                </Box>
            </Box>


            {/* --- MAIN LAYOUT --- */}
            <Box className="flex flex-grow relative">

                {/* 3.1 Sidebar (Curriculum) */}
                {isMobile ?
                    <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} variant="temporary" anchor="left">
                        {SidebarContent}
                    </Drawer>
                    :
                    <Box className="flex-shrink-0 w-72 h-[calc(100vh-60px)] sticky top-[60px] bg-white dark:bg-gray-800 overflow-y-auto shadow-md border-r border-gray-200">
                        {SidebarContent}
                    </Box>
                }

                {/* 3.2 Main Content Area */}
                <Box className="flex-grow p-8 pt-0 overflow-y-auto">

                    {/* --- COURSE DETAILS CARD (Requested Card Format) --- */}



                    {/* --- CURRENT CHAPTER CONTENT --- */}
                    <Paper elevation={1} className="p-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-200">
                        <Typography variant="h5" className="font-bold mb-6 text-gray-900 dark:text-white border-b pb-3 border-gray-100">
                            {currentChapter.title}
                        </Typography>

                        {currentChapter.hasVideo &&
                            <Box className="w-full aspect-video bg-black rounded-xl flex items-center justify-center text-white mb-8 shadow-xl">
                                <Play size={48} className="opacity-80" />
                                <Typography variant="h6" className="ml-4 opacity-70">Lesson Video Player</Typography>
                            </Box>}

                        <Typography variant="body1" component="div" className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-8" dangerouslySetInnerHTML={{ __html: currentChapter.htmlContent }} />

                        {/* Resources */}
                        {currentChapter.resources && currentChapter.resources.length > 0 &&
                            <Box className="mb-10 pt-4 border-t border-gray-100">
                                <Typography variant="subtitle1" className="mb-3 flex items-center font-semibold text-gray-900"><Download size={18} className="mr-2 text-indigo-600" />Downloadable Resources</Typography>
                                {currentChapter.resources.map((r, i) => <Button key={i} variant="outlined" startIcon={<Download size={18} />} href={r.url} target="_blank" className="mr-3 mb-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50 normal-case">{r.name}</Button>)}
                            </Box>
                        }

                        <ActivityPanel quiz={currentChapter.quiz} />

                        {/* Advanced Discussion Panel */}
                        <DiscussionPanel
                            chapterId={currentChapter.id}
                            threads={currentChapter.discussionThreads || []}
                            onAddThread={handleAddThread}
                            onAddReply={handleAddReply}
                            onLikeThread={handleLikeThread}
                        />

                        {/* Navigation Footer */}
                        <Box className="flex justify-between mt-10 pt-6 border-t border-gray-200">
                            <Button variant="outlined" disabled={!previousChapter} onClick={() => setSelectedChapterId(previousChapter?.id!)} className="normal-case">← Previous</Button>

                            <Button
                                variant="contained"
                                onClick={handleMarkComplete}
                                disabled={currentChapter.isCompleted}
                                className={`font-bold normal-case ${currentChapter.isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                startIcon={currentChapter.isCompleted ? <CheckCircle size={20} /> : null}
                            >
                                {currentChapter.isCompleted ? 'Completed' : 'Mark as Complete'}
                            </Button>

                            <Button variant="outlined" disabled={!nextChapter || nextChapter.isLocked} onClick={() => setSelectedChapterId(nextChapter?.id!)} className="normal-case">Next →</Button>
                        </Box>
                    </Paper>

                </Box>
            </Box>
        </Box>
    );
}