import {
    CheckCircle,
    Trophy,
    Clock,
    Edit,
    Zap,
    Lock,
    Unlock,
    ChevronRight,
    Target,
} from "lucide-react";

// --- DUMMY DATA FOR ACHIEVEMENTS ---
const achievementsData = [
    { name: "First Streak 🔥", description: "Maintained a 3-day learning streak.", icon: <Zap size={16} className="text-amber-500" />, achieved: true },
    { name: "Tier 1 Master 🏆", description: "Completed all Foundation Tier courses.", icon: <Trophy size={16} className="text-indigo-600" />, achieved: false },
    { name: "Active Learner ⏱️", description: "Logged 20+ hours in one week.", icon: <Clock size={16} className="text-sky-500" />, achieved: true },
    { name: "Collaboration Pro 🧑‍🤝‍🧑", description: "Contributed to 5 discussion threads.", icon: <Target size={16} className="text-green-500" />, achieved: false },
];

const upcomingEvents = [
    { time: "9:30", type: "Team Meetup (Deadline)", day: "Mon", color: "bg-orange-500" },
    { time: "11:30", type: "Illustration (Workshop)", day: "Tue", color: "bg-black" },
    { time: "12:30", type: "Research (Live Session)", day: "Wed", color: "bg-blue-600" },
];

// --- CUSTOM COMPONENTS ---

const AchievementRow = ({ achievement }: { achievement: typeof achievementsData[0] }) => {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-3">
                {/* Icon based on achievement */}
                <div className="p-2 rounded-full bg-gray-50 border border-gray-200">
                    {achievement.icon}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{achievement.name}</p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
            </div>
            {/* Status Checkmark/Lock */}
            <div>
                {achievement.achieved ? (
                    <CheckCircle size={20} className="text-green-500" />
                ) : (
                    <Lock size={20} className="text-gray-300" />
                )}
            </div>
        </div>
    );
};

// --- FINAL SECTION CODE ---

export default function ActivityScheduleSection() {
    return (

        <div className="col-span-12 lg:col-span-12 space-y-6 mt-5">

            {/* NEW BLOCK: ACHIEVEMENTS LIST */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Achievements List</h2>

                <div className="divide-y divide-gray-100">
                    {achievementsData.map((achievement, index) => (
                        <AchievementRow key={index} achievement={achievement} />
                    ))}
                </div>

                <div className="mt-4 text-right">
                    <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-end">
                        View All Badges <ChevronRight size={16} />
                    </a>
                </div>
            </div>
            {/* END NEW BLOCK */}

        </div>
    );
}