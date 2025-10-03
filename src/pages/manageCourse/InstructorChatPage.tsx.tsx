// Assuming this is a new file: InstructorChatPage.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Paper, Avatar, TextField, IconButton } from '@mui/material';
import { Send, ArrowLeft, Paperclip } from 'lucide-react';

// NOTE: You would need to pass COURSE_DETAILS and the instructor's online status 
// from the CourseDetailPage via state/context/routing params.

type ChatMessage = {
    id: number;
    text: string;
    sender: 'student' | 'instructor';
    time: string;
}

// --- MOCK DATA for Chat (To be replaced with actual API data) ---
const MOCK_MESSAGES: ChatMessage[] = [
    { id: 1, text: "Hi Dr. Thorne, I have a quick question about the black hole problem in Chapter 3.", sender: 'student', time: '1:05 PM' },
    { id: 2, text: "Hello! I'm glad you reached out. I'm available now. What specifically about the problem is giving you trouble?", sender: 'instructor', time: '1:10 PM' },
    { id: 3, text: "I'm confused about why the mass value is squared in the final step. I thought the Schwarzschild radius was linearly proportional to M.", sender: 'student', time: '1:12 PM' },
    { id: 4, text: "That's a sharp observation! Let's clarify: The mass (M) itself is NOT squared in the formula $R_s = \\frac{2GM}{c^2}$. Are you perhaps confusing it with the $c^2$ in the denominator (speed of light squared)?", sender: 'instructor', time: '1:15 PM' },
    // A hypothetical message to show the instructor's special badge
    { id: 5, text: "I see! I was looking at the wrong equation. Thank you for clearing that up!", sender: 'student', time: '1:17 PM' },
];

const COURSE_DETAILS = {
    title: "Advanced Astrophysics 101",
    instructor: "Dr. Aris Thorne",
    instructorAvatarUrl: "/avatars/instructor_thorne.jpg" // Placeholder
};
const IS_INSTRUCTOR_ONLINE = true; // Mock status

interface ChatBubbleProps {
    message: ChatMessage;
}

// --- Chat Bubble Component ---
const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isInstructor = message.sender === 'instructor';

    return (
        <Box
            className={`flex mb-4 ${isInstructor ? 'justify-start' : 'justify-end'}`}
        >
            {/* Instructor Avatar (Left side) */}
            {isInstructor && (
                <Avatar
                    src={COURSE_DETAILS.instructorAvatarUrl}
                    alt={COURSE_DETAILS.instructor}
                    className="mr-3 flex-shrink-0 bg-indigo-200 text-indigo-800 text-sm"
                >
                    {COURSE_DETAILS.instructor.charAt(0)}
                </Avatar>
            )}

            <Box className={`flex flex-col max-w-[70%] ${isInstructor ? 'items-start' : 'items-end'}`}>
                <Paper
                    elevation={1}
                    className={`p-3 rounded-xl shadow-md ${isInstructor
                        ? 'rounded-tl-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : 'rounded-tr-none bg-indigo-600 text-white'
                        }`}
                >
                    <Typography variant="body2">{message.text}</Typography>
                </Paper>

                <Box className={`mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center ${isInstructor ? 'pl-2' : 'pr-2'}`}>
                    {/* Instructor Badge */}
                    {isInstructor && (
                        <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-semibold mr-2">
                            Instructor
                        </span>
                    )}
                    {message.time}
                </Box>
            </Box>
        </Box>
    );
};



// --- MAIN CHAT PAGE COMPONENT ---
export default function InstructorChatPage() {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom of the chat when messages update
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            const newMessage: ChatMessage = {
                id: MOCK_MESSAGES.length + 1,
                text: input,
                sender: 'student',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, newMessage]);
            setInput('');
        }
    };

    // Simulates returning to the previous course detail page
    const handleGoBack = () => {
        console.log("Navigating back to CourseDetailPage...");
        // In a real app, this would be router.push('/course/AA101')
        window.history.back();
    };

    return (
        <Box className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">

            {/* --- FIXED HEADER --- */}
            <Paper elevation={3} className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-b border-gray-200">
                <Box className="flex items-center justify-between">
                    <Box className="flex items-center">
                        <IconButton onClick={handleGoBack} size="large" className="mr-3 text-indigo-600">
                            <ArrowLeft />
                        </IconButton>
                        <Avatar
                            src={COURSE_DETAILS.instructorAvatarUrl}
                            alt={COURSE_DETAILS.instructor}
                            className="w-10 h-10 mr-3 bg-indigo-200 text-indigo-800"
                        >
                            {COURSE_DETAILS.instructor.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                                {COURSE_DETAILS.instructor}
                            </Typography>
                            <Typography variant="caption" className="flex items-center text-gray-500 dark:text-gray-400">
                                <Box
                                    component="span"
                                    className={`w-2 h-2 rounded-full mr-1 ${IS_INSTRUCTOR_ONLINE ? 'bg-green-500' : 'bg-red-500'}`}
                                />
                                {IS_INSTRUCTOR_ONLINE ? 'Online' : 'Offline'} for {COURSE_DETAILS.title}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* --- SCROLLABLE CHAT AREA --- */}
            <Box className="flex-grow p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}
                <div ref={chatEndRef} />
            </Box>

            {/* --- FIXED INPUT FOOTER --- */}
            <Paper elevation={6} className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200">
                <Box className="flex items-center space-x-2">
                    <IconButton color="primary">
                        <Paperclip size={20} />
                    </IconButton>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message to the instructor..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                                e.preventDefault();
                            }
                        }}
                        size="small"
                        className="flex-grow"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '25px',
                                paddingRight: '0'
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        endIcon={<Send size={18} />}
                        className="rounded-full h-10 w-10 min-w-0 bg-indigo-600 hover:bg-indigo-700 shadow-md"
                        disabled={input.trim() === ''}
                    >

                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}