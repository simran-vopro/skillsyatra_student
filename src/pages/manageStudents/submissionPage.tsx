import { useState } from "react";
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Chip,
    Divider,
    TextField,
    MenuItem,
    Avatar,
} from "@mui/material";
import { ArrowLeft, User } from "lucide-react";
import { Modal } from "../../components/ui/modal";

// Dummy student submissions for a single course
const submissions = [
    {
        student: "John Doe",
        studentId: "STU-101",
        activity: "Quiz 1",
        type: "Quiz",
        attempt: 1,
        module: "Module 1",
        submittedOn: "2025-02-15",
        status: "Graded",
        score: "85%",
        gradedBy: "Jane Smith",
        feedback: "Good work, but revise arrays.",
        lastUpdated: "2025-02-16",
    },
    {
        student: "John Doe",
        studentId: "STU-101",
        activity: "Assignment 1",
        type: "Assignment",
        attempt: 1,
        module: "Module 1",
        submittedOn: "2025-02-16",
        status: "Pending Review",
        score: "-",
        gradedBy: "-",
        feedback: "-",
        lastUpdated: "2025-02-16",
    },
    {
        student: "John Doe",
        studentId: "STU-101",
        activity: "Final Project",
        type: "Project",
        attempt: 1,
        module: "Module 3",
        submittedOn: "2025-03-14",
        status: "Graded",
        score: "A+",
        gradedBy: "Michael Johnson",
        feedback: "Excellent! Clean code and UI.",
        lastUpdated: "2025-03-15",
    },
];

// Dummy course info
const courseInfo = {
    name: "React Basics",
    tier: "Beginner",
    instructor: "Jane Smith",
    duration: "6 weeks",
    enrolledDate: "2025-01-12",
    progress: 70,
};

// Dummy student profile
const student = {
    id: "stu_123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main St, New York, USA",
    joinedAt: "2023-01-15",
    avatar: "/images/user/user-05.jpg",
    isActive: true,
    suspended: false,
    dob: "2000-06-15",
    guardian: "Mr. Richard Doe",
};


export default function SubmissionsPage() {
    const [filter, setFilter] = useState("");

    const filteredData =
        filter === "" ? submissions : submissions.filter((s) => s.status === filter);


    const [openModal, setOpenModal] = useState<string | null>(null);
    const handleClose = () => setOpenModal(null);

    return (
        <Box p={4} sx={{ bgcolor: "#f3f4f6", minHeight: "100vh" }}>

            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                    <User size={28} /> Student Submissions
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowLeft />}>
                    Back
                </Button>
            </Box>


            <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, position: "relative" }}>
                <Box display="flex" gap={4} flexWrap="wrap" alignItems="center">
                    {/* Avatar */}
                    <Avatar
                        src={"./images/user/user-01.jpg"}
                        sx={{ width: 120, height: 120, border: "3px solid #1976d2" }}
                    />

                    {/* Basic Info */}
                    <Box flex={1}>
                        <Typography variant="h5" fontWeight="bold">
                            {student.firstName} {student.lastName}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {student.email} | {student.phone}
                        </Typography>
                        <Typography color="text.secondary">{student.address}</Typography>
                        <Typography variant="body2" mt={1} color="text.secondary">
                            Joined on <strong>{student.joinedAt}</strong> | DOB: <strong>{student.dob}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Guardian: <strong>{student.guardian}</strong>
                        </Typography>
                    </Box>

                    {/* Status & Quick Info */}
                    <Box textAlign="right" display="flex" flexDirection="column" gap={1}>
                        <Chip
                            label={student.isActive ? "Active" : "Inactive"}
                            color={student.isActive ? "success" : "default"}
                            sx={{ fontWeight: "bold" }}
                        />
                        <Chip
                            label={student.suspended ? "Suspended" : "Good Standing"}
                            color={student.suspended ? "error" : "primary"}
                        />
                    </Box>
                </Box>

                {/* Divider */}
                <Divider sx={{ my: 3 }} />

                {/* Course Section */}
                <Box display="flex" flexDirection="column" gap={2}>
                    {/* Course Header */}
                    <Card sx={{ p: 2, bgcolor: "grey.100", borderRadius: 2, boxShadow: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                            📘 {courseInfo.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Instructor: {courseInfo.instructor}
                        </Typography>
                    </Card>

                    {/* Course Details */}
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        <Card sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "blue.50" }}>
                            <Typography variant="body2" color="text.secondary">
                                Tier
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                {courseInfo.tier}
                            </Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "green.50" }}>
                            <Typography variant="body2" color="text.secondary">
                                Duration
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                {courseInfo.duration}
                            </Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "orange.50" }}>
                            <Typography variant="body2" color="text.secondary">
                                Enrolled
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                {courseInfo.enrolledDate}
                            </Typography>
                        </Card>
                    </Box>

                    {/* Course Progress */}
                    <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            Progress
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                                sx={{
                                    flex: 1,
                                    height: 12,
                                    background: "#e0e0e0",
                                    borderRadius: 6,
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${courseInfo.progress}%`,
                                        height: "100%",
                                        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                                        borderRadius: 6,
                                        transition: "width 0.5s ease-in-out",
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {courseInfo.progress}%
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Card>




            {/* Submissions Table */}
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardHeader
                    title="📑 Student Submissions"
                    titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
                    action={
                        <Box display="flex" gap={2}>
                            <TextField
                                select
                                size="small"
                                label="Filter by Status"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                sx={{ minWidth: 200 }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Graded">Graded</MenuItem>
                                <MenuItem value="Pending Review">Pending Review</MenuItem>
                            </TextField>
                            <Button variant="contained" color="primary">
                                Export Report
                            </Button>
                        </Box>
                    }
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student</TableCell>
                                <TableCell>Activity</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Attempt</TableCell>
                                <TableCell>Module</TableCell>
                                <TableCell>Submitted On</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Graded By</TableCell>
                                <TableCell>Feedback</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((s, i) => (
                                <TableRow
                                    key={i}
                                    hover
                                    sx={{
                                        "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                                        "&:hover": { bgcolor: "#f1f5f9" },
                                    }}
                                >
                                    <TableCell>
                                        {s.student} <br />
                                        <Typography variant="caption" color="text.secondary">
                                            {s.studentId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{s.activity}</TableCell>
                                    <TableCell>{s.type}</TableCell>
                                    <TableCell>{s.attempt}</TableCell>
                                    <TableCell>{s.module}</TableCell>
                                    <TableCell>{s.submittedOn}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={s.status}
                                            color={
                                                s.status === "Graded"
                                                    ? "success"
                                                    : s.status === "Pending Review"
                                                        ? "warning"
                                                        : "default"
                                            }
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{s.score}</TableCell>
                                    <TableCell>{s.gradedBy}</TableCell>
                                    <TableCell>{s.feedback}</TableCell>
                                    <TableCell>{s.lastUpdated}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                setOpenModal("review");
                                            }}
                                        >
                                            Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>



                    {/* Review Submission Modal */}
                    <Modal isOpen={openModal === "review"} onClose={handleClose}>
                        <Box p={0} width={900} className="bg-white rounded-2xl shadow-xl">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b px-6 py-4">
                                <h2 className="text-xl font-bold">Review Submission</h2>
                            </div>

                            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                                {/* Student & Activity Info */}
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div>
                                        <p className="font-semibold">
                                            Student: John Doe (STU-101)
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Module: Module 3 | Attempt: 1
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Activity: Final Project (Project)
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Submitted On: 2025-03-14 | Last Updated: 2025-03-15
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                {/* File Preview & Submission Info */}
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: File Preview */}
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold mb-2">Submitted File</p>
                                        <div className="border rounded-lg bg-gray-50 p-3 max-h-56 overflow-auto font-mono text-sm mb-5">
                                            📄 final_project_johndoe.zip (unzipped preview)
                                            <pre className="mt-2 text-xs">
                                                {`function App() {
  return <h1>Hello React!</h1>;
}`}
                                            </pre>
                                        </div>
                                        <Button variant="outlined" size="small">
                                            Download File
                                        </Button>
                                    </div>

                                    {/* Right: Meta Info */}
                                    <div className="w-full md:w-1/3 space-y-1">
                                        <p className="text-sm font-semibold">Submission Info</p>
                                        <p className="text-sm text-gray-600">Word Count: 2,350</p>
                                        <p className="text-sm text-gray-600">Time Spent: 12h 15m</p>
                                        <p className="text-sm text-gray-600">Status: Graded</p>
                                        <p className="text-sm text-gray-600">Graded By: Michael Johnson</p>
                                    </div>
                                </div>

                                <hr />

                                {/* Rubric / Criteria - Two columns */}
                                <div>
                                    <p className="text-sm font-semibold mb-10">Evaluation Criteria</p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <TextField label="Code Quality" fullWidth defaultValue="Excellent, modular and clean." />
                                        <TextField label="Completeness" fullWidth defaultValue="All requirements met." />
                                        <TextField label="UI / Presentation" fullWidth defaultValue="Modern and intuitive UI." />
                                        <TextField label="Documentation" fullWidth defaultValue="Good README and comments." />
                                    </div>
                                </div>

                                <hr />

                                {/* Feedback Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextField
                                        label="Feedback (Visible to Student)"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        defaultValue="Outstanding work! Consider optimizing API calls."

                                    />

                                    <TextField
                                        label="Instructor Notes (Private)"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        defaultValue="Possible candidate for showcase next term."

                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center px-6 py-4 border-t">
                                <Button variant="outlined" color="secondary">
                                    Allow Resubmission
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outlined" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => console.log("Save review")}
                                    >
                                        Save Review
                                    </Button>
                                </div>
                            </div>
                        </Box>
                    </Modal>



                </CardContent>
            </Card>
        </Box>
    );
}
