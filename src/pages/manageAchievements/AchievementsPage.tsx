import { Download, ArrowLeft, Award, ChevronRight, CheckCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy achievements
const achievements = [
    {
        id: "ach_101",
        title: "Top Performer - React Basics",
        description: "Awarded for scoring above 90% in React Basics final exam.",
        date: "Feb 20, 2025",
        type: "Gold",
    },
    {
        id: "ach_102",
        title: "Quiz Champion - JavaScript",
        description: "Completed 5 consecutive quizzes with full marks.",
        date: "Mar 05, 2025",
        type: "Silver",
    },
    {
        id: "ach_103",
        title: "Consistent Learner",
        description: "Maintained daily streak for 30 days.",
        date: "Mar 10, 2025",
        type: "Bronze",
    },
];

// Dummy certificates - Includes 'credentialID' for professional systems
const certificates = [
    {
        id: "cert_201",
        name: "React Basics Professional Certificate",
        issuedOn: "Feb 15, 2025",
        issuedBy: "Code Academy",
        url: "#",
        credentialID: "CA-R-2025-1A7B", 
    },
    {
        id: "cert_202",
        name: "Advanced JavaScript Specialist",
        issuedOn: "Mar 01, 2025",
        issuedBy: "SkillUp Institute",
        url: "#",
        credentialID: "SI-AJS-2025-X9Y1",
    },
];

// Helper function to map achievement type to Tailwind styles and icons
const getAchievementProps = (type: string) => {
    switch (type) {
        case "Gold":
            return { iconColor: "text-amber-500", bgColor: "bg-amber-100", ringColor: "ring-amber-400", label: "Gold" };
        case "Silver":
            return { iconColor: "text-slate-500", bgColor: "bg-slate-100", ringColor: "ring-slate-400", label: "Silver" };
        case "Bronze":
            return { iconColor: "text-yellow-700", bgColor: "bg-yellow-100", ringColor: "ring-yellow-700", label: "Bronze" };
        default:
            return { iconColor: "text-blue-500", bgColor: "bg-blue-100", ringColor: "ring-blue-500", label: "Award" };
    }
};

// Reusable Card component for structure
const DataCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
        </div>
        <div className="flex-grow p-4 space-y-3">{children}</div>
    </div>
);

// Reusable List Item component for a clean list look
const ListItem = ({ children, isLast = false, className = "" }: { children: React.ReactNode, isLast?: boolean, className?: string }) => (
    <div className={`py-4 px-1 ${!isLast ? 'border-b border-gray-100' : ''} transition duration-150 hover:bg-gray-50 ${className}`}>
        {children}
    </div>
);


export default function AchievementsPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-screen p-6 md:p-10">

            {/* Header - Professional and Clean */}
            <header className="flex justify-between items-center pb-4 mb-8 border-b border-slate-200">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
                    <Award size={28} className="text-slate-600" /> Learning Credentials & Records
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-1 rounded-md transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                </button>
            </header>

            {/* Main Content: Two-Column Layout */}
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Achievements Section (Left Column) */}
                <div className="w-full md:w-1/2">
                    <DataCard title="🏆 Recognitions & Milestones">
                        {achievements.map((ach, index) => {
                            const { iconColor, bgColor, ringColor, label } = getAchievementProps(ach.type);
                            return (
                                <ListItem key={ach.id} isLast={index === achievements.length - 1}>
                                    <div className="flex justify-between items-start">
                                        
                                        {/* Left: Icon and Details */}
                                        <div className="flex gap-4 items-start">
                                            <div className={`p-2 rounded-full ${bgColor} ring-2 ${ringColor}`}>
                                                <Award size={24} className={iconColor} fill={iconColor.replace('text-', 'fill-').replace('-500', '-300')} />
                                            </div>
                                            <div>
                                                <p className="text-base font-semibold text-slate-800">{ach.title}</p>
                                                <p className="text-sm text-gray-600 mt-0.5">{ach.description}</p>
                                                <p className="text-xs text-gray-400 mt-1">Awarded: {ach.date}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Right: Chip/Badge */}
                                        <div className={`text-xs font-bold px-3 py-1 rounded-full ${bgColor} ${iconColor}`}>
                                            {label}
                                        </div>
                                    </div>
                                </ListItem>
                            );
                        })}
                    </DataCard>
                </div>

                {/* Certificates Section (Right Column) */}
                <div className="w-full md:w-1/2">
                    <DataCard title="🎓 Course Certifications">
                        {certificates.map((cert, index) => (
                            <ListItem key={cert.id} isLast={index === certificates.length - 1} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                
                                {/* Left: Details */}
                                <div className="flex gap-4 items-start mb-2 sm:mb-0">
                                    <div className="p-2 rounded-full bg-blue-100 ring-2 ring-blue-400">
                                        <CheckCircle size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-slate-800">{cert.name}</p>
                                        <p className="text-sm text-gray-600">
                                            **Credential ID:** <span className="font-mono text-xs bg-gray-100 px-1 rounded">{cert.credentialID}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Issued: {cert.issuedOn} by {cert.issuedBy}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Right: Actions */}
                                <div className="flex gap-2 ml-10 sm:ml-0">
                                    <a
                                        href={cert.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                                    >
                                        <Search size={16} className="mr-1" /> View
                                    </a>
                                    <button
                                        onClick={() => console.log("Download certificate:", cert.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md flex items-center transition-colors shadow-md"
                                    >
                                        <Download size={16} className="mr-1" /> Download
                                    </button>
                                </div>
                            </ListItem>
                        ))}
                    </DataCard>
                </div>

            </div>
        </div>
    );
}