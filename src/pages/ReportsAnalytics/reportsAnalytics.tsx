import {
    CheckCircle,
    Trophy,
    Users,
    Clock,
    Edit,
    MonitorPlay,
    Zap, // New: For urgent notifications/streak
    Lock, // New: For locked tiers
    Unlock, // New: For unlocked tiers
    Target, // New: For tier goals
    ChevronRight, // New: For navigation
    Bell, // Used for Urgent Notification
} from "lucide-react";

import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LineChart,
    Line,
} from "recharts";
import ActivityScheduleSection from "./ActivityScheduleSection";

// ------------------------------------------------------------------
// 📚 DUMMY DATA (ALIGNED WITH PROFESSIONAL DESIGN + TIER LOGIC)
// ------------------------------------------------------------------

const studentInfo = {
    name: "Alysia",
    fullName: "Andreas Iniesta", // Matching the name in the image
    college: "College Student",
    profilePic: "https://i.pravatar.cc/150?img=60", // Reverted to a consistent placeholder for simplicity, using a hardcoded URL can break
    currentTier: 1, // NEW: Current tier for logic
    streak: 5, // NEW: Streak counter
};

// NEW: Tier structure data
const tierData = [
    {
        tier: 1,
        name: "Foundation",
        description: "Covers core concepts.",
        courses: [
            { id: "A", name: "Typography Basics", progress: 60, completed: false },
            { id: "B", name: "Inclusive Design", progress: 100, completed: true },
            { id: "C", name: "Drawing Fundamentals", progress: 20, completed: false },
        ],
    },
    {
        tier: 2,
        name: "Specialist",
        description: "Advanced topics and project work.",
        prerequisites: {
            A: "Typography Basics",
            B: "Inclusive Design",
            C: "Drawing Fundamentals",
        },
        courses: [
            { id: "D", name: "Advanced Grid Systems", completed: false, progress: 0 },
            { id: "E", name: "3D Rendering", completed: false, progress: 0 },
        ],
    },
];

// NEW: Helper function to check if a specific prerequisite course is completed
const isPrerequisiteCompleted = (courseName: string): boolean => {
    // Looks through all tiers to check if a course is marked as completed
    return tierData.some(tier =>
        tier.courses.some(course => course.name === courseName && course.completed)
    );
};


// MODIFIED KPI DATA (Now reflects Tier metrics, but uses the same structure)
const kpiData = [
    { label: "Current Tier", value: studentInfo.currentTier, icon: <Target size={20} />, color: "text-sky-500", bgColor: "bg-sky-50" },
    { label: "Courses in Progress", value: tierData[0].courses.filter(c => c.progress > 0 && c.progress < 100).length, icon: <MonitorPlay size={20} />, color: "text-red-500", bgColor: "bg-red-50" },
    { label: "Courses Completed (Tier)", value: tierData[0].courses.filter(c => c.completed).length, icon: <CheckCircle size={20} />, color: "text-green-500", bgColor: "bg-green-50" },
    { label: "Certificates Earned", value: 15, icon: <Trophy size={20} />, color: "text-indigo-500", bgColor: "bg-indigo-50" }, // Community support replaced by certs/trophy
];

const activelyHoursData = [
    { name: 'M', hours: 3 },
    { name: 'T', hours: 4 },
    { name: 'W', hours: 2.5 },
    { name: 'T', hours: 3.8 },
    { name: 'F', 'hours': 1.5 },
    { name: 'S', hours: 3.2 },
    { name: 'S', hours: 2.9 },
];

// DATA for Tier 2 Unlock Status
const tier2Courses = [
    { task: "Advanced Grid Systems", prereq: "Typography Basics", status: isPrerequisiteCompleted("Typography Basics") ? "UNLOCKED" : "LOCKED" },
    { task: "3D Rendering", prereq: "Inclusive Design", status: isPrerequisiteCompleted("Inclusive Design") ? "UNLOCKED" : "LOCKED" },
    { task: "Design Leadership", prereq: "Drawing Fundamentals", status: isPrerequisiteCompleted("Drawing Fundamentals") ? "UNLOCKED" : "LOCKED" },
];

const performanceData = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 40 },
    { name: 'Mar', value: 35 },
    { name: 'Apr', value: 50 },
    { name: 'May', value: 45 },
    { name: 'Jun', value: 60 },
    { name: 'Jul', value: 55 },
];

const upcomingEvents = [
    { time: "9:30", type: "Team Meetup (Deadline)", day: "Mon", color: "bg-orange-500" },
    { time: "11:30", type: "Illustration (Workshop)", day: "Tue", color: "bg-black" },
    { time: "12:30", type: "Research (Live Session)", day: "Wed", color: "bg-blue-600" },
]; // Reduced to 3 to keep the list clean

// NEW: Urgent Notification Data
const urgentNotification = {
    message: "Your **Inclusive Design** Test grade is available. View now!",
    link: "#",
    isUrgent: true,
};

// ------------------------------------------------------------------
// 🎨 CUSTOM COMPONENTS
// ------------------------------------------------------------------

// Custom Tooltip for Actively Hours Chart
const CustomHoursTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 text-xs shadow-lg rounded-lg border border-gray-200">
                <p className="font-bold text-sky-700">{`${payload[0].payload.name}:`}</p>
                <p className="text-gray-600">{`${payload[0].value} hours`}</p>
            </div>
        );
    }
    return null;
};

// ---

// NEW Component: Row to show current course progress (For Tier 1)
const CourseProgressRow = ({ course, tierName }: { course: typeof tierData[0]['courses'][0], tierName: string }) => {
    // Determine progress color based on completion
    const progressColor = course.progress === 100 ? 'bg-green-500' : 'bg-indigo-600';
    const textColor = course.progress === 100 ? 'text-green-600' : 'text-indigo-600';
    const isCompleted = course.progress === 100;

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 text-sm">
            {/* Course Name */}
            <div className="w-1/3">
                <p className="font-semibold text-gray-800">{course.name}</p>
                <p className="text-xs text-gray-500">{tierName}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-1/2">
                <div className="h-2 bg-gray-200 rounded-full">
                    <div
                        className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Status / Percentage */}
            <div className={`w-1/6 text-right font-bold flex items-center justify-end gap-1 ${textColor}`}>
                {isCompleted ? (
                    <>
                        <CheckCircle size={16} /> COMPLETED
                    </>
                ) : (
                    `${course.progress}%`
                )}
            </div>
        </div>
    );
};
// ---

// The Main Dashboard Content Component (Assumes Header and Sidebar are outside)
export default function DashboardContent() {

    // FIND CURRENT TIER INFO
    const currentTierInfo = tierData.find(tier => tier.tier === studentInfo.currentTier);
    const tierName = currentTierInfo ? `Tier ${currentTierInfo.tier}: ${currentTierInfo.name}` : `Tier ${studentInfo.currentTier}`;

    // Courses for the active tier (all courses in tier 1 in this example)
    const activeTierCourses = currentTierInfo
        ? currentTierInfo.courses
        : [];

    // Simple Card Component for KPIs (Your original KPICard)
    const KPICard = ({ data }: { data: typeof kpiData[0] }) => (
        <div className="flex flex-col bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-shadow duration-300 hover:shadow-md">
            <div className={`p-2 rounded-lg inline-flex mb-2 ${data.bgColor} ${data.color}`}>
                {data.icon}
            </div>
            <p className="text-3xl font-extrabold text-gray-800">{data.value}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{data.label}</p>
        </div>
    );

    // MODIFIED: Tier Unlock Row Component (Replaces AssignmentRow)
    const TierUnlockRow = ({ data }: { data: typeof tier2Courses[0] }) => {
        let statusClasses = "";
        let Icon = Lock;

        switch (data.status) {
            case "UNLOCKED":
                statusClasses = "text-green-600 bg-green-50";
                Icon = Unlock;
                break;
            case "LOCKED":
                statusClasses = "text-red-500 bg-red-50";
                Icon = Lock;
                break;
            default:
                statusClasses = "text-gray-500 bg-gray-100";
        }

        return (
            <div className="grid grid-cols-3 py-3 border-b border-gray-100 items-center text-sm">
                {/* Task (Tier 2 Course Name) */}
                <div>
                    <p className="font-semibold text-gray-800">{data.task}</p>
                    <p className="text-xs text-gray-500">Requires: {data.prereq}</p>
                </div>
                {/* Tier */}
                <div className="text-center font-bold text-sky-600">Tier 2</div>
                {/* Status */}
                <div className="text-right">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center justify-end gap-1 ${statusClasses}`}>
                        <Icon size={14} /> {data.status}
                    </span>
                </div>
            </div>
        );
    };

    return (
        // Main Content Container
        <div className="p-8 bg-gray-100 min-h-screen">

            {/* --- HEADER/GREETING SECTION (Modified for Current Tier Display) --- */}
            <header className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-600 shadow-md">
                        <img src={studentInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Hello {studentInfo.name}</h1>

                        <p className="text-gray-500">Let's learn something new today!</p>
                    </div>
                </div>
                {/* NEW: Streak counter on the top right */}
                <div className="flex items-center text-sm font-semibold text-amber-600 bg-white p-2 rounded-lg shadow-sm border border-amber-300">
                    <Zap size={16} className="mr-1" />
                    {studentInfo.streak} Day Streak
                </div>
            </header>

            {/* NEW: Urgent Notification (Placed on top of the profile card) */}
            {urgentNotification.isUrgent && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-8 rounded-r-lg shadow-md w-full">
                    <h3 className="text-sm font-bold text-red-700 flex items-center mb-1">
                        <Bell size={16} className="mr-2 animate-pulse" /> URGENT NOTIFICATION
                    </h3>
                    <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: urgentNotification.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    <a href={urgentNotification.link} className="text-xs font-semibold text-red-600 hover:text-red-800 mt-1 flex items-center">
                        View Details <ChevronRight size={14} />
                    </a>
                </div>
            )}

            {/* 1. OVERVIEW (KPIs) and PROFILE (Right Column) */} <div className="grid grid-cols-12 gap-6 mb-8">

                {/* Left/Middle Column (KPIs - Tier Metrics) */}
                <div className="col-span-12 lg:col-span-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Tier Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {kpiData.map((data, index) => (
                            <KPICard key={index} data={data} />
                        ))}
                    </div>
                </div>

                {/* Right Column (Profile Card) */}


            </div>

            {/* 3. TIER PROGRESS AND UNLOCKS (Left Column) and CHARTS (Right Column) */}
            <div className="grid grid-cols-12 gap-6 mb-8">

                {/* Left Column Group: Current Courses and Unlocks (Now taking full 8 cols) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">

                    {/* REQUESTED BLOCK: Tier 1: Current Course Progress */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tier 1: Foundation Course Progress</h2>

                        {/* Table Header */}
                        <div className="flex items-center justify-between py-2 font-bold text-sm text-gray-500 border-b-2 border-gray-200">
                            <div className="w-1/3">COURSE NAME</div>
                            <div className="w-1/2">PROGRESS</div>
                            <div className="w-1/6 text-right">STATUS</div>
                        </div>

                        {/* Course Progress Rows */}
                        <div className="divide-y divide-gray-100">
                            {activeTierCourses.length > 0 ? (
                                activeTierCourses.map((data, index) => (
                                    <CourseProgressRow key={index} course={data} tierName={tierName} />
                                ))
                            ) : (
                                <p className="text-gray-500 py-4 text-center">No active courses found for this tier.</p>
                            )}
                        </div>
                    </div>
                    {/* END REQUESTED BLOCK */}

                    {/* Existing Block: Tier 2 Course Unlock Status */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tier 2: Specialist Unlock Status</h2>

                        {/* Table Header */}
                        <div className="grid grid-cols-3 py-2 font-bold text-sm text-gray-500 border-b-2 border-gray-200">
                            <div>COURSE NAME</div>
                            <div className="text-center">TIER</div>
                            <div className="text-right">STATUS</div>
                        </div>

                        {/* Tier Unlock Rows */}
                        <div className="divide-y divide-gray-100">
                            {tier2Courses.map((data, index) => (
                                <TierUnlockRow key={index} data={data} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column Group: Charts (Moved from above for better flow) */}
                <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-6">
                    {/* Actively Hours Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Actively Hours</h2>
                            <span className="text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1 rounded-full">Weekly</span>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={activelyHoursData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} />
                                    <YAxis stroke="#9ca3af" tickLine={false} />
                                    <Tooltip content={<CustomHoursTooltip />} />
                                    <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={16} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Performance</h2>
                        <div className="h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" stroke="#d1d5db" tickLine={false} />
                                    <YAxis hide domain={[0, 80]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <p className="text-3xl font-extrabold text-gray-800">40%</p>
                            <p className="text-sm text-gray-500 mt-1">Your productivity is 40% higher compare to last month</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. CALENDAR AND UPCOMING EVENTS (New row for clean layout) */}
            <div className="grid grid-cols-12 gap-6">

                {/* Left Spacer Column (8 cols) */}
                <div className="col-span-12 lg:col-span-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Activity and Schedule</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-sm font-medium text-gray-500 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span>Time spent</span> <span className="text-green-500 font-bold ml-1 text-lg">28h</span>
                        </div>
                        <div className="text-sm font-medium text-gray-500 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span>Lessons taken</span> <span className="text-green-500 font-bold ml-1 text-lg">60</span>
                        </div>
                        <div className="text-sm font-medium text-gray-500 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span>Exams passed</span> <span className="text-green-500 font-bold ml-1 text-lg">10</span>
                        </div>
                        <div className="text-sm font-medium text-gray-500 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <span>Certificates</span> <span className="text-indigo-500 font-bold ml-1 text-lg">15</span>
                        </div>
                    </div>

                    <ActivityScheduleSection />
                </div>



                {/* Calendar and Upcoming Events (Right Stack) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    {/* Calendar Placeholder */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center text-gray-800 mb-4">
                            <Clock size={20} className="text-sky-500" />
                            <p className="font-bold">OCTOBER 2025</p>
                            <Edit size={20} className="text-gray-400 cursor-pointer" />
                        </div>

                        {/* Simple Calendar Grid Mockup */}
                        <div className="grid grid-cols-7 text-xs font-semibold text-center text-gray-500 mb-2">
                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                        </div>
                        <div className="grid grid-cols-7 text-center text-sm font-medium">
                            {/* Days: Sep 28-30 (Grayed) */}
                            <div className="p-1 mx-0.5 rounded-lg text-gray-400">28</div>
                            <div className="p-1 mx-0.5 rounded-lg text-gray-400">29</div>
                            <div className="p-1 mx-0.5 rounded-lg text-gray-400">30</div>
                            {/* Days: Oct 1 - 25 */}
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(day => (
                                <div key={day} className={`p-1 mx-0.5 rounded-lg ${day === 1 ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-gray-800'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h2>

                        {/* Events List */}
                        <div className="space-y-4">
                            {upcomingEvents.map((event, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="text-sm font-bold w-12 text-gray-800">
                                        {event.time}
                                    </div>
                                    <div className={`flex-1 flex items-center p-2 rounded-xl text-white font-semibold text-xs ${event.color} shadow-md`}>
                                        <Clock size={14} className="mr-2" />
                                        {event.type}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}