import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    LinearProgress,
    TextField,
    MenuItem,
} from "@mui/material";
import {
    ArrowLeft,
    BookOpen,
    CreditCard,
    Activity,
    User,
} from "lucide-react";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { Modal } from "../../components/ui/modal";


// Dummy student details
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

// Dummy courses
const courses = [
    {
        id: 1,
        name: "React Basics",
        tier: "Beginner",
        instructor: "Jane Smith",
        duration: "6 weeks",
        status: "In Progress",
        progress: 70,
        enrolled: "2025-01-12",
    },
    {
        id: 2,
        name: "Advanced JavaScript",
        tier: "Advanced",
        instructor: "Michael Johnson",
        duration: "8 weeks",
        status: "Completed",
        progress: 100,
        enrolled: "2024-11-20",
    },
    {
        id: 3,
        name: "UI/UX Design",
        tier: "Intermediate",
        instructor: "Emily Davis",
        duration: "4 weeks",
        status: "In Progress",
        progress: 40,
        enrolled: "2025-02-05",
    },
];

// Dummy payments
const payments = [
    {
        id: "pay_101",
        amount: 200,
        method: "Credit Card",
        date: "2025-03-01",
        status: "Success",
        invoiceUrl: "#",
    },
    {
        id: "pay_102",
        amount: 150,
        method: "PayPal",
        date: "2025-02-15",
        status: "Failed",
        invoiceUrl: "#",
    },
    {
        id: "pay_103",
        amount: 300,
        method: "Stripe",
        date: "2025-01-20",
        status: "Success",
        invoiceUrl: "#",
    },
];

// Dummy attendance
const attendance = [
    { date: "2025-03-01", status: "Present" },
    { date: "2025-03-02", status: "Absent" },
    { date: "2025-03-03", status: "Present" },
    { date: "2025-03-04", status: "Present" },
    { date: "2025-03-05", status: "Late" },
];

// Dummy activities
const activities = [
    { time: "2025-03-01 10:00 AM", activity: "Logged in" },
    { time: "2025-03-01 10:15 AM", activity: "Viewed React Basics course" },
    { time: "2025-03-01 11:00 AM", activity: "Completed Lesson 2 of React Basics" },
    { time: "2025-03-02 09:30 AM", activity: "Downloaded JavaScript resources" },
    { time: "2025-03-03 05:45 PM", activity: "Attempted Quiz on React Basics" },
];

// Dummy Certificates
const certificates = [
    { id: "cert_101", name: "React Basics Completion", issuedOn: "2025-02-15", url: "#" },
    { id: "cert_102", name: "JavaScript Advanced", issuedOn: "2025-03-01", url: "#" },
];

// Dummy Upcoming Practicals/Sessions
const upcomingSessions = [
    { id: "sess_101", course: "React Basics", date: "2025-03-10", time: "10:00 AM - 12:00 PM", instructor: "Jane Smith" },
    { id: "sess_102", course: "UI/UX Design", date: "2025-03-12", time: "02:00 PM - 04:00 PM", instructor: "Emily Davis" },
];


export default function StudentDetails() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [openModal, setOpenModal] = useState<string | null>(null);

    const handleOpen = (modalType: string) => setOpenModal(modalType);

    const handleClose = () => setOpenModal(null);

    return (
        <Box p={3} position={"relative"}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                    <User size={28} /> Student Profile
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowLeft />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            </Box>

            {/* Profile Section */}
            <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3, position: "relative" }}>
                <Box display="flex" gap={4} flexWrap="wrap" alignItems="center">
                    {/* Avatar */}
                    <Avatar src={"./images/user/user-01.jpg"} sx={{ width: 120, height: 120, border: "3px solid #1976d2" }} />


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

                    <Box display="flex" gap={1} flexWrap="wrap" >
                        <Button
                            size="small"
                            variant="outlined"
                            color={student.isActive ? "error" : "success"}
                            onClick={() => handleOpen("toggleStatus")}
                        >
                            {student.isActive ? "Suspend" : "Activate"}
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleOpen("edit")}
                        >
                            Edit
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleOpen("password")}
                        >
                            Change Password
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpen("delete")}
                        >
                            Delete
                        </Button>
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

                {/* Overall Progress */}
                <Box>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        Overall Progress
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ flex: 1, background: "#e0e0e0", borderRadius: 2, height: 16, overflow: "hidden" }}>
                            <Box
                                sx={{
                                    width: "68%", // dummy progress
                                    height: "100%",
                                    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                                    borderRadius: 2,
                                    transition: "width 0.5s ease-in-out",
                                }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            68%
                        </Typography>
                    </Box>
                </Box>

                {/* Quick Stats */}
                <Box display="flex" gap={2} mt={3} flexWrap="wrap">
                    <Card sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "grey.100" }}>
                        <Typography variant="h6">{courses.length}</Typography>
                        <Typography variant="caption">Courses Enrolled</Typography>
                    </Card>
                    <Card sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "grey.100" }}>
                        <Typography variant="h6">{certificates.length}</Typography>
                        <Typography variant="caption">Achivemets</Typography>
                    </Card>
                    <Card sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "grey.100" }}>
                        <Typography variant="h6">{payments.length}</Typography>
                        <Typography variant="caption">Payments Made</Typography>
                    </Card>
                    <Card sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "grey.100" }}>
                        <Typography variant="h6">{attendance.filter(a => a.status === "Present").length}</Typography>
                        <Typography variant="caption">Days Present</Typography>
                    </Card>
                </Box>

                {/* Example Modals */}
                {/* Edit Student Info */}
                <Modal isOpen={openModal === "edit"} onClose={handleClose}>
                    <Box p={3} width={500}>
                        <Typography variant="h6" gutterBottom>
                            Edit Student Info
                        </Typography>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="First Name"
                            defaultValue="John"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Last Name"
                            defaultValue="Doe"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            defaultValue="john.doe@example.com"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Phone"
                            defaultValue="+1 234 567 890"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Enrollment Number"
                            defaultValue="ENR-2025-001"
                        />

                        <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleClose}>
                                Save Changes
                            </Button>
                        </Box>
                    </Box>
                </Modal>


                {/* Change Password */}
                <Modal isOpen={openModal === "password"} onClose={handleClose}>
                    <Box p={3} width={400}>
                        <Typography variant="h6" gutterBottom>
                            Change Password
                        </Typography>

                        <TextField
                            fullWidth
                            margin="normal"
                            type="password"
                            label="Current Password"
                            placeholder="Enter current password"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            type="password"
                            label="New Password"
                            placeholder="Enter new password"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            type="password"
                            label="Confirm New Password"
                            placeholder="Re-enter new password"
                        />

                        <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleClose}>
                                Save Password
                            </Button>
                        </Box>
                    </Box>
                </Modal>



                {/* Delete Student */}
                <Modal isOpen={openModal === "delete"} onClose={handleClose}>
                    <Box p={3} width={450}>
                        <Typography variant="h6" color="error" gutterBottom>
                            Delete Student
                        </Typography>

                        <Typography mb={2}>
                            Are you sure you want to <strong>permanently delete</strong> this student?
                            This action cannot be undone.
                        </Typography>

                        {/* Dummy student info */}
                        <Box mb={2} p={2} bgcolor="grey.100" borderRadius={2}>
                            <Typography variant="body2">
                                Name: <strong>John Doe</strong>
                            </Typography>
                            <Typography variant="body2">
                                Email: <strong>john.doe@example.com</strong>
                            </Typography>
                            <Typography variant="body2">
                                Enrollment: <strong>ENR-2025-001</strong>
                            </Typography>
                        </Box>

                        <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="error" onClick={handleClose}>
                                Delete Permanently
                            </Button>
                        </Box>
                    </Box>
                </Modal>


                {/* Suspend / Activate Student */}
                <Modal isOpen={openModal === "toggleStatus"} onClose={handleClose}>
                    <Box p={3} width={450}>
                        <Typography variant="h6" gutterBottom>
                            {true ? "Suspend Student" : "Activate Student"}
                        </Typography>

                        <Typography mb={2}>
                            Are you sure you want to {true ? "suspend" : "activate"} this student?
                        </Typography>

                        {/* Dummy student info */}
                        <Box mb={2} p={2} bgcolor="grey.100" borderRadius={2}>
                            <Typography variant="body2">
                                Name: <strong>John Doe</strong>
                            </Typography>
                            <Typography variant="body2">
                                Status: <strong>{true ? "Active" : "Inactive"}</strong>
                            </Typography>
                        </Box>

                        <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color={true ? "error" : "success"}
                                onClick={handleClose}
                            >
                                {true ? "Suspend" : "Activate"}
                            </Button>
                        </Box>
                    </Box>
                </Modal>



                <Modal isOpen={openModal === "cancelPractical"} onClose={handleClose}>
                    <Box p={3} width={500}>
                        <Typography variant="h6" gutterBottom color="error">
                            Cancel Practical Session
                        </Typography>

                        {/* Session Info */}
                        <Box mb={2}>
                            <Typography variant="body2" color="text.secondary">
                                Course: <strong>Physics 101</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Date: <strong>25th Sept 2025</strong> | Time: <strong>10:00 AM - 12:00 PM</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Instructor: <strong>Dr. Jane Smith</strong>
                            </Typography>
                        </Box>

                        <Typography>
                            Are you sure you want to cancel this session? This action cannot be undone.
                        </Typography>

                        {/* Reason for Cancellation */}
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Reason for Cancellation"
                            multiline
                            rows={3}
                            placeholder="Provide a reason for canceling this session..."
                        />

                        <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleClose}>
                                Back
                            </Button>
                            <Button variant="contained" color="error" onClick={handleClose}>
                                Confirm Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>


                <Modal isOpen={openModal === "announcement"} onClose={handleClose}>
                    <Box p={3} width={600}>
                        <Typography variant="h6" gutterBottom>
                            Send Announcement
                        </Typography>

                        {/* Session Info */}
                        <Box mb={2}>
                            <Typography variant="body2" color="text.secondary">
                                Course: <strong>Physics 101</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Date: <strong>25th Sept 2025</strong> | Time: <strong>10:00 AM - 12:00 PM</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Instructor: <strong>Dr. Jane Smith</strong>
                            </Typography>
                        </Box>

                        {/* Announcement Form */}
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Subject"
                            placeholder="Enter subject of announcement"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Message"
                            multiline
                            rows={4}
                            placeholder="Type your announcement message here..."
                        />

                        {/* Optional Audience Selection */}
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Audience"
                            select
                            defaultValue="all"
                        >
                            <MenuItem value="all">All Participants</MenuItem>
                            <MenuItem value="students">Students Only</MenuItem>
                            <MenuItem value="instructors">Instructors Only</MenuItem>
                        </TextField>

                        <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleClose}>
                                Send Announcement
                            </Button>
                        </Box>
                    </Box>
                </Modal>



            </Card>

            <Box display="flex" gap={3} flexWrap="wrap" mb={4} alignItems="stretch">
                {/* Left - Certificates */}
                <Box flex={1} minWidth={300} display="flex">
                    <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <CardHeader title="🎓 Certificates Earned" sx={{ pb: 0 }} />
                        <CardContent sx={{ pt: 1, flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                            {certificates.map((c) => (
                                <Card
                                    key={c.id}
                                    sx={{
                                        p: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 1,
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        transition: "transform 0.2s",

                                        "&:hover": { transform: "scale(1.02)" },
                                    }}
                                >
                                    {/* Certificate Info */}
                                    <Box display="flex" flexDirection="column" gap={0.3}>
                                        <Typography fontWeight="bold" fontSize="13px">{c.name}</Typography>
                                        <Typography color="text.secondary" fontSize="13px">{c.issuedOn}</Typography>
                                    </Box>

                                    {/* Actions */}
                                    <Box display="flex" gap={1}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            href={c.url}
                                            sx={{ fontSize: "0.7rem" }}
                                            onClick={() => handleOpen("certificate")}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            sx={{ fontSize: "0.7rem" }}
                                            onClick={() => console.log("Download", c.name)}
                                        >
                                            Download
                                        </Button>
                                    </Box>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </Box>

                {/* Right - Upcoming Practicals */}
                <Box flex={1} minWidth={300} display="flex">
                    <Card sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "rgba(255, 235, 59, 0.15)" }}>
                        <CardHeader title="📅 Upcoming Practicals / Sessions" sx={{ pb: 0 }} />
                        <CardContent sx={{ pt: 1, flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                            {upcomingSessions.map((s) => (
                                <Card
                                    key={s.id}
                                    sx={{
                                        p: 1.5,
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 0.5,
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        transition: "transform 0.2s",
                                        "&:hover": { transform: "scale(1.02)" },
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div>
                                        <Typography fontWeight="bold" fontSize="13px">{s.course}</Typography>
                                        <Typography color="text.secondary" fontSize="13px">{s.date} | {s.time}</Typography>
                                        <Typography color="text.secondary" fontSize="13px">Instructor: {s.instructor}</Typography>
                                    </div>
                                    {/* Practical Actions */}
                                    <Box display="flex" gap={1}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            sx={{
                                                fontSize: "0.7rem",
                                                height: 24,            // fixed height
                                                minHeight: 24,         // reinforce height
                                                lineHeight: 1,
                                                padding: "0 8px",      // vertical padding = 0
                                                whiteSpace: "nowrap",  // prevent text wrap
                                            }}
                                            onClick={() => setOpenModal("cancelPractical")}
                                        >
                                            Cancel Practical
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                fontSize: "0.7rem",
                                                height: 24,
                                                minHeight: 24,
                                                lineHeight: 1,
                                                padding: "0 8px",
                                                whiteSpace: "nowrap",
                                            }}
                                            onClick={() => setOpenModal("announcement")}
                                        >
                                            Send Announcement
                                        </Button>
                                    </Box>

                                </Card>
                            ))}
                        </CardContent>

                    </Card>
                </Box>
            </Box>

            {/* Certificate Preview Modal */}
            <Modal isOpen={openModal === "certificate"} onClose={handleClose}>
                <Box
                    p={4}
                    width={800}
                    sx={{
                        bgcolor: "white",
                        borderRadius: 3,
                        boxShadow: 5,
                        border: "6px solid #1976d2",
                        backgroundImage:
                            "linear-gradient(135deg, rgba(25,118,210,0.05) 25%, transparent 25%, transparent 50%, rgba(25,118,210,0.05) 50%, rgba(25,118,210,0.05) 75%, transparent 75%, transparent)",
                        backgroundSize: "40px 40px",
                    }}
                >
                    <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
                        🎓 Certificate of Completion
                    </Typography>

                    <Typography variant="h6" textAlign="center" gutterBottom>
                        This certificate is proudly presented to
                    </Typography>

                    <Typography
                        variant="h4"
                        textAlign="center"
                        color="primary"
                        gutterBottom
                        sx={{ fontFamily: "serif", fontWeight: "bold" }}
                    >
                        John Doe
                    </Typography>

                    <Typography variant="body1" textAlign="center" gutterBottom>
                        For successfully completing the course
                    </Typography>

                    <Typography
                        variant="h5"
                        textAlign="center"
                        gutterBottom
                        fontStyle="italic"
                        sx={{ color: "#2e7d32" }}
                    >
                        React Basics
                    </Typography>

                    <Typography variant="body2" textAlign="center" mt={3}>
                        Awarded on: 15 Feb 2025
                    </Typography>

                    <Box mt={5} display="flex" justifyContent="space-between" px={6}>
                        <Typography variant="body2">Instructor: Jane Smith</Typography>
                        <Typography variant="body2">Grade: A+</Typography>
                    </Box>

                    <Box mt={4} display="flex" justifyContent="center" gap={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => console.log("Download certificate")}
                        >
                            Download
                        </Button>
                        <Button variant="outlined" onClick={handleClose}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Courses */}
            <Card sx={{ mb: 4 }}>
                <CardHeader
                    title="Enrolled Courses"
                    avatar={<BookOpen size={20} />}
                />
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Course Name</TableCell>
                                <TableCell>Tier</TableCell>
                                <TableCell>Instructor</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Progress</TableCell>
                                <TableCell>Enrolled Date</TableCell>
                                <TableCell align="center">Actions</TableCell> {/* 👈 New column */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={c.tier}
                                            color={
                                                c.tier === "Beginner"
                                                    ? "success"
                                                    : c.tier === "Intermediate"
                                                        ? "warning"
                                                        : "error"
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{c.instructor}</TableCell>
                                    <TableCell>{c.duration}</TableCell>
                                    <TableCell>{c.status}</TableCell>
                                    <TableCell>
                                        <LinearProgress
                                            variant="determinate"
                                            value={c.progress}
                                            sx={{ width: 100 }}
                                        />
                                        <Typography variant="caption">{c.progress}%</Typography>
                                    </TableCell>
                                    <TableCell>{c.enrolled}</TableCell>

                                    {/* Actions */}
                                    <TableCell align="center">
                                        <Box display="flex" gap={1} justifyContent="center">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => console.log("View details of", c.name)}
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => navigate("/studentSubmissions")}
                                            >
                                                Submissions
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Attendance & Activities */}
            <Card sx={{ mb: 4 }}>
                <CardHeader title="Attendance & Activity" avatar={<Activity size={20} />} />
                <CardContent>
                    <Box display="flex" gap={3} flexWrap="wrap">
                        {/* Left - Attendance Calendar */}
                        <Box flex="0 0 280px">
                            <Typography variant="h6" gutterBottom>
                                📅 Attendance Calendar
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <StaticDatePicker
                                    displayStaticWrapperAs="desktop"
                                    value={selectedDate}
                                    onChange={(newValue) => setSelectedDate(newValue)}
                                    slotProps={{
                                        actionBar: { actions: [] }, // hides Today / Clear buttons
                                    }}
                                />
                            </LocalizationProvider>

                            {/* Attendance Legend */}
                            <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                                <Chip size="small" label="Present" sx={{ bgcolor: "green", color: "white" }} />
                                <Chip size="small" label="Absent" sx={{ bgcolor: "red", color: "white" }} />
                                <Chip size="small" label="Late" sx={{ bgcolor: "orange", color: "white" }} />
                            </Box>
                        </Box>

                        {/* Right - Activity Log */}
                        <Box flex={1} minWidth={300}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ mb: 3 }} // 👈 This will add proper margin-bottom
                            >
                                ⚡ Recent Activities
                            </Typography>
                            {activities.map((a, idx) => (
                                <Box
                                    key={idx}
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                    mb={2}
                                    sx={{ p: 1.5, borderRadius: 2, bgcolor: idx % 2 === 0 ? "grey.100" : "grey.50" }}
                                >
                                    {/* Activity icon */}
                                    {a.activity.toLowerCase().includes("logged") ? (
                                        <User size={20} color="#1976d2" />
                                    ) : a.activity.toLowerCase().includes("course") ? (
                                        <BookOpen size={20} color="#2e7d32" />
                                    ) : a.activity.toLowerCase().includes("quiz") ? (
                                        <Activity size={20} color="#ed6c02" />
                                    ) : (
                                        <Activity size={20} />
                                    )}

                                    {/* Activity details */}
                                    <Box>
                                        <Typography variant="body2">
                                            <strong>{a.time}</strong>
                                        </Typography>
                                        <Typography variant="body1">{a.activity}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Payments */}
            <Card sx={{ mb: 4 }}>
                <CardHeader
                    title="Payment History"
                    avatar={<CreditCard size={20} />}
                />
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Method</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Invoice</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.id}</TableCell>
                                    <TableCell>${p.amount}</TableCell>
                                    <TableCell>{p.method}</TableCell>
                                    <TableCell>{p.date}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.status}
                                            color={p.status === "Success" ? "success" : "error"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" href={p.invoiceUrl}>
                                            View Invoice
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Box>
    );
}
