// src/components/ui/course/CourseCard.tsx

import { Course } from "../../../types/course";
import { useNavigate } from "react-router";

// Import LinearProgress here
import { Box, Typography, LinearProgress } from "@mui/material";
import { ArrowRight, Download, Package, Award, FileText } from "lucide-react";

// --- INTERFACES (Updated to include metadata for the footer) ---
interface StudentCourse extends Course {
    progress: number; // e.g., 0-100
    isCompleted: boolean;
    tier: string;
    category?: string;
    thumbnail: string | undefined; // Ensure this is explicitly defined as string | undefined
    // NEW MOCK FIELDS FOR FOOTER (assuming these come from your actual data)
    totalModules: number;
    totalBadges: number;
    hasCertificate: boolean;
}

interface CourseCardProps {
    course: StudentCourse;
    mode?: "owned" | "recommended"; // NEW
}
// ---------------------------------------------------

// --- COLOR UTILITY (Defines ACCENT colors for the icon/visual) ---
const getTierStyles = (tier: string) => {
    switch (tier.toLowerCase()) {
        case "tier 1":
            return { accentColor: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900", progressColor: "#8b5cf6" };
        case "tier 2":
            return { accentColor: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900", progressColor: "#eab308" };
        case "tier 3":
            return { accentColor: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900", progressColor: "#3b82f6" };
        default:
            return { accentColor: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-100 dark:bg-gray-700", progressColor: "#6b7280" };
    }
};

// -------------------------------------------------------------------------

export default function CourseCard({ course, mode = "owned" }: CourseCardProps) {
    const navigate = useNavigate();
    const progressPercent = Math.min(100, Math.max(0, course.progress));
    const { accentColor, bgColor, progressColor } = getTierStyles(course.tier);
    const primaryProgressColor = course.isCompleted ? "#10b981" : progressColor;

    const handleActionClick = () => {
        if (mode === "owned") {
            navigate(`/course/${course._id}/learn`);
        } else {
            console.log(`Purchasing course: ${course.title}`);
        }
    };

    const handleCertificateDownload = () => {
        console.log(`Downloading certificate for: ${course.title}`);
    };

    const isStarted = progressPercent > 0 && progressPercent < 100;
    const actionText =
        course.isCompleted
            ? "Download"
            : isStarted
                ? "Continue"
                : "Start";
    const ActionIcon = course.isCompleted ? Download : ArrowRight;

    // CourseVisual stays the same
    const CourseVisual = () => (
        <div
            className={`w-14 h-14 flex-shrink-0 mr-4 rounded-lg overflow-hidden flex items-center justify-center 
                        ${bgColor} border border-transparent`}
        >
            <img
                src={course.thumbnail || "/placeholder-course-thumb.svg"}
                alt={course.title}
                className="w-full h-full object-cover"
            />
        </div>
    );

    const mockCategory = course.category || (course.title.includes("Job") ? "PATHWAY" : "SKILLS");

    const FooterItem = ({
        value,
        label,
        icon: Icon,
        isCertified = false,
    }: {
        value: number | string;
        label: string;
        icon: any;
        isCertified?: boolean;
    }) => (
        <div className="flex items-center text-sm">
            <Icon
                size={14}
                className={`mr-1 ${isCertified ? "text-green-500" : "text-gray-500 dark:text-gray-400"
                    }`}
            />
            <Typography
                variant="body2"
                className="text-xs font-medium text-gray-700 dark:text-gray-300"
            >
                <span className="font-bold mr-0.5">{value}</span> {label}
            </Typography>
        </div>
    );

    return (
        <Box
            className="
        bg-white dark:bg-gray-800 
        rounded-xl shadow-sm hover:shadow-lg 
        transition-all duration-300 flex flex-col overflow-hidden
      "
            sx={{ border: "1px solid", borderColor: "divider" }}
        >
            {/* 1. Main Content Area */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Visual + Title */}
                <div className="flex items-start mb-3">
                    <CourseVisual />
                    <div className="flex flex-col min-w-0 flex-grow">
                        <Typography
                            variant="overline"
                            className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-0.5"
                        >
                            {mockCategory}
                        </Typography>
                        <Typography
                            variant="body1"
                            component="h3"
                            className="font-bold text-gray-900 dark:text-white line-clamp-2"
                            title={course.title}
                            sx={{ lineHeight: 1.3 }}
                        >
                            {course.title}
                        </Typography>
                    </div>
                </div>

                {/* Content section */}
                <div className="flex flex-col flex-grow pt-2">
                    {mode === "owned" ? (
                        <>
                            {/* Progress + Action */}
                            <div className="flex items-center justify-between mt-1 mb-3">
                                <div className="flex items-center flex-1 gap-2">
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressPercent}
                                        sx={{
                                            width: "70%",
                                            height: 4,
                                            borderRadius: 2,
                                            backgroundColor: "rgba(0,0,0,0.05)",
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: primaryProgressColor,
                                            },
                                        }}
                                    />
                                    <p className="text-[12px]">{progressPercent}%</p>
                                </div>

                                <button
                                    onClick={
                                        course.isCompleted
                                            ? handleCertificateDownload
                                            : handleActionClick
                                    }
                                    className={`flex items-center text-xs font-bold transition-colors ${accentColor} hover:underline`}
                                >
                                    {actionText}
                                    <ActionIcon size={14} className="ml-1" />
                                </button>
                            </div>

                            <Typography
                                variant="body2"
                                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4"
                                sx={{ minHeight: "6rem" }}
                            >
                                {course.isCompleted
                                    ? "This course is complete. You can download your certificate and review the materials."
                                    : "Master this skill through hands-on projects, expert guidance, and detailed curriculum designed to get you job-ready."}
                            </Typography>
                        </>
                    ) : (
                        <>
                            {/* For Recommended */}
                            <Typography
                                variant="body2"
                                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4 mb-4"
                            >
                                Unlock this course and continue your learning journey. Get access
                                to all modules, badges, and a certificate upon completion.
                            </Typography>
                            <button
                                onClick={handleActionClick}
                                className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition mt-5"
                            >
                                Purchase
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Box className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <FooterItem value={course.totalModules || 10} label="modules" icon={Package} />
                <FooterItem value={course.totalBadges || 14} label="chapters" icon={FileText} />
                <FooterItem
                    value={course.hasCertificate ? "1" : "0"}
                    label="certificate"
                    icon={Award}
                    isCertified={course.hasCertificate}
                />
            </Box>
        </Box>
    );
}
