import React, { useMemo, useState } from "react";
import {
  ClipboardCheck,
  Layers,
  Search,
  BookOpen,
  Timer,
  CheckCircle2,
  Clock,
  X,
  MessageSquareText,
} from "lucide-react";

interface Assessment {
  id: string;
  course: string;
  module: string;
  chapter: string;
  title: string;
  duration: string;
  type: "Quiz" | "Assignment" | "Placement Test";
  status: "Available" | "Completed" | "Locked";
  checked?: boolean;
  marks?: string | null;
  feedback?: string | null;
}

const assessments: Assessment[] = [
  {
    id: "A1",
    course: "Data Structures & Algorithms",
    module: "Module 1 - Arrays & Strings",
    chapter: "Chapter 2 - Arrays Practice",
    title: "Array Basics Quiz",
    duration: "20 mins",
    type: "Quiz",
    status: "Completed",
    checked: true,
    marks: "18 / 20",
    feedback: "Great job! Just review edge cases for array rotation.",
  },
  {
    id: "A2",
    course: "Data Structures & Algorithms",
    module: "Module 3 - Linked Lists",
    chapter: "Chapter 1 - Concepts",
    title: "Linked List Skill Test",
    duration: "30 mins",
    type: "Placement Test",
    status: "Completed",
    checked: false,
    marks: null,
    feedback: null,
  },
  {
    id: "A3",
    course: "Web Development",
    module: "Module 2 - HTML & CSS",
    chapter: "Chapter 3 - CSS Styling",
    title: "Frontend Styling Assignment",
    duration: "40 mins",
    type: "Assignment",
    status: "Completed",
    checked: true,
    marks: "27 / 30",
    feedback: "Excellent structure and creativity in layout!",
  },
  {
    id: "A4",
    course: "Web Development",
    module: "Module 3 - React Basics",
    chapter: "Chapter 1 - Components",
    title: "React Components Quiz",
    duration: "25 mins",
    type: "Quiz",
    status: "Completed",
    checked: false,
    marks: null,
    feedback: null,
  },
  {
    id: "A5",
    course: "Database Management",
    module: "Module 1 - SQL Fundamentals",
    chapter: "Chapter 2 - Queries",
    title: "SQL Query Writing Assessment",
    duration: "35 mins",
    type: "Assignment",
    status: "Completed",
    checked: true,
    marks: "29 / 35",
    feedback: "Good understanding of SQL joins. Try optimizing query 3.",
  },
];

export default function MySubmissionsPage() {
  const [courseFilter, setCourseFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const courses = ["All", ...Array.from(new Set(assessments.map((a) => a.course)))];

  const filteredData = useMemo(() => {
    return assessments.filter(
      (a) =>
        a.status === "Completed" &&
        (courseFilter === "All" || a.course === courseFilter) &&
        (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.chapter.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [courseFilter, searchTerm]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ClipboardCheck size={28} className="text-red-600" /> My Submissions
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            View all your completed quizzes, tests, and assignments in one place.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-xl border p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Layers
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 text-sm"
            >
              {courses.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by title, module, or chapter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Course</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Module</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Chapter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Title / Review
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Marks</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredData.length ? (
              filteredData.map((a) => (
                <tr key={a.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{a.course}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.module}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.chapter}</td>

                  {/* Title + Review */}
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {a.title}
                    {a.checked ? (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Reviewed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                        Pending Review
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-indigo-600">{a.type}</td>

                  <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                    <Timer size={14} /> {a.duration}
                  </td>

                  {/* Marks */}
                  <td className="px-4 py-3 text-sm">
                    {a.checked ? (
                      <span className="flex items-center gap-1 text-green-700 font-medium">
                        <CheckCircle2 size={14} /> {a.marks}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-500 italic">
                        <Clock size={14} /> Under Review
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setSelectedAssessment(a)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                    >
                      <BookOpen size={15} /> View Result
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No completed submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Result Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-lg p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedAssessment(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <BookOpen className="text-red-600" /> {selectedAssessment.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">{selectedAssessment.course}</span> →{" "}
              {selectedAssessment.module} → {selectedAssessment.chapter}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-sm text-gray-700">
                <strong>Type:</strong> {selectedAssessment.type}
              </div>
              <div className="text-sm text-gray-700 flex items-center gap-1">
                <Timer size={14} /> {selectedAssessment.duration}
              </div>
              <div className="col-span-2 text-sm">
                <strong>Status:</strong>{" "}
                {selectedAssessment.checked ? (
                  <span className="text-green-700 font-medium">Reviewed</span>
                ) : (
                  <span className="text-yellow-700 font-medium">Pending Review</span>
                )}
              </div>
            </div>

            {/* Marks */}
            <div className="bg-gray-50 border rounded-lg p-3 mb-3">
              {selectedAssessment.checked ? (
                <div className="text-lg font-semibold text-green-700 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Marks: {selectedAssessment.marks}
                </div>
              ) : (
                <div className="text-sm italic text-gray-600 flex items-center gap-2">
                  <Clock size={16} /> Marks will be visible once reviewed by instructor.
                </div>
              )}
            </div>

            {/* Feedback */}
            {selectedAssessment.checked && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex gap-2">
                <MessageSquareText className="text-red-500 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold text-gray-900">Instructor Feedback</p>
                  <p className="text-gray-700 text-sm">{selectedAssessment.feedback}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
