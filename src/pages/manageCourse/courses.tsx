import { useState, useMemo } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Input from "../../components/form/input/InputField";
import CourseCard from "../../components/ui/course/CourseCard"; // Import the new component

// --- Custom Type for Student Course Data (Self-Contained) ---
// Define the structure of the dummy data
interface StudentCourse {
  _id: string;
  title: string;
  thumbnail: string | undefined; // Removed 'File' type
  progress: number; // e.g., 0-100
  isCompleted: boolean;
  tier: string; // Tier information
  category?: string;
}

// --- STATIC DUMMY COURSE DATA ---
// Create a hardcoded array of courses to drive the UI
const STATIC_COURSES: StudentCourse[] = [
  {
    _id: "c-001",
    title: "Mastering Modern Art & Design Principles (Tier 1)",
    thumbnail: "https://cdn1.careeraddict.com/uploads/article/60468/computer-science-course.jpg", // Use a placeholder path
    progress: 70,
    isCompleted: false,
    tier: "Tier 1",
  },
  {
    _id: "c-002",
    title: "The Art of Effective Presentation and Public Speaking",
    thumbnail: "https://cdn1.careeraddict.com/uploads/article/60468/computer-science-course.jpg",
    progress: 100,
    isCompleted: true,
    tier: "Tier 1",
  },
  {
    _id: "c-003",
    title: "Introduction to Artificial Intelligence & Machine Learning",
    thumbnail: "https://cdn1.careeraddict.com/uploads/article/60468/computer-science-course.jpg",
    progress: 0,
    isCompleted: false,
    tier: "Tier 2",
  },
  {
    _id: "c-004",
    title: "About Social Media Course: Strategy and Growth",
    thumbnail: "https://cdn1.careeraddict.com/uploads/article/60468/computer-science-course.jpg",
    progress: 45,
    isCompleted: false,
    tier: "Tier 3",
  },

];

// --- STATIC RECOMMENDED COURSE DATA ---
const RECOMMENDED_COURSES: StudentCourse[] = [
  {
    _id: "r-001",
    title: "Advanced Graphic Design Techniques (Tier 2)",
    thumbnail: "https://cdn1.careeraddict.com/uploads/article/60468/computer-science-course.jpg",
    progress: 0,
    isCompleted: false,
    tier: "Tier 2",
  },
  {
    _id: "r-002",
    title: "Data Science with Python & R",
    thumbnail: "https://cdn1.careeraddict.com/uploads/article/60468/computer-science-course.jpg",
    progress: 0,
    isCompleted: false,
    tier: "Tier 3",
  },
  {
    _id: "r-003",
    title: "Creative Writing & Storytelling Masterclass",
    thumbnail: "https://cdn1.careeraddict.com/uploads/article/60468/computer-science-course.jpg",
    progress: 0,
    isCompleted: false,
    tier: "Tier 1",
  },
];

// Custom hook that now just returns the static data
const useStudentCourseList = () => {
  // Simulate a small loading delay for a better user experience on refresh/first load
  const [loading, setLoading] = useState(true);

  // In a real app, you might use useEffect for an API call here.
  // For static data, we just use a timeout.
  useMemo(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 500ms mock delay
    return () => clearTimeout(timer);
  }, []);

  return { studentCourseData: STATIC_COURSES, loading };
};

// ========================================> StudentCourseDashboard
export default function StudentCourseDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch the static student data
  const { studentCourseData, loading } = useStudentCourseList();

  const filterTabs = ["All", "Ongoing", "Completed", "Tier 1", "Tier 2", "Tier 3"];

  const filteredCourses = useMemo(() => {
    let courses = studentCourseData;

    // 1. Filter by Tab
    if (activeFilter === "Ongoing") {
      courses = courses.filter(course => course.progress > 0 && course.progress < 100);
    } else if (activeFilter === "Completed") {
      courses = courses.filter(course => course.progress >= 100);
    } else if (activeFilter.startsWith("Tier")) {
      courses = courses.filter(course => course.tier === activeFilter);
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      courses = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(lowerCaseQuery) ||
          course.tier.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return courses;
  }, [studentCourseData, activeFilter, searchQuery]);


  return (
    <div className="p-6">
      {/* Page Header and Search (Matching the screenshot's top bar vibe) */}
      <Box className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Purchased Courses
        </h2>
        <Input
          name="search"
          type="search"
          placeholder="Search my courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // endAdornment={<Search size={18} className="text-gray-400" />}
          className="max-w-xs" // Tailored for a cleaner look
        />
      </Box>

      {/* --- Horizontal Line --- */}
      <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

      {/* Filter Tabs */}
      <Box className="mb-6">
        <Tabs
          value={activeFilter}
          onChange={(e, newValue) => setActiveFilter(newValue)}
          aria-label="course filter tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {filterTabs.map((filter) => (
            <Tab key={filter} label={filter} value={filter} />
          ))}
        </Tabs>
      </Box>

      {loading ? (
        <Box className="text-center py-10 text-xl text-blue-500 font-semibold">
          Loading your courses... ⏳
        </Box>
      ) : filteredCourses.length === 0 ? (
        <Box className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
          No courses found for the current selection. Adjust your filters or search. 📚
        </Box>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course as any} mode="owned" />
            ))}
          </div>

          {/* --- Recommendations Section --- */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {RECOMMENDED_COURSES.map((course) => (
                <CourseCard key={course._id} course={course as any} mode="recommended" />
              ))}
            </div>
          </div>
        </>
      )}


    </div>
  );
}