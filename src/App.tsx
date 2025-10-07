import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Toaster } from "react-hot-toast";

import CourseManagement from "./pages/manageCourse/courses";
import Tiptap from "./Tiptap";
import InstructorManagement from "./pages/manageInstructors/instructor";
import InstructorCreate from "./pages/manageInstructors/instructorCreate";
import TierPathwayControl from "./pages/manageTiers/tierPathwayControl";

import StudentsManagement from "./pages/manageStudents/students";
import PracticalCalendarManagement from "./pages/practicalManagement/practicalCalendarManagement";
import StudentCreate from "./pages/manageStudents/studentCreate";
import StudentDetails from "./pages/manageStudents/studentDetails";
import SubmissionPage from "./pages/manageStudents/submissionPage";
import AdminManagement from "./pages/manageAdmins/admin";
import SubAdminPermissions from "./pages/manageAdmins/permissions";
import AchievementsPage from "./pages/manageAchievements/AchievementsPage";
import PaymentsPage from "./pages/managePayments/payments";
import SupportTicketsPage from "./pages/supportTickets/supportTicketsPage";
import AnnouncementManagementPage from "./pages/AnnouncementManagement/announcements";
import ForumModerationPage from "./pages/forum/ForumModeration";
import AdminCreate from "./pages/manageAdmins/adminCreate";
import ReportsAnalytics from "./pages/ReportsAnalytics/reportsAnalytics";
import AuditLogsPage from "./pages/activities/Activities";
import UserProfiles from "./pages/UserProfiles";
import SystemSettingsPage from "./pages/settings/SystemSettings";
import SuperAdminChatPortal from "./pages/chats/ChatPortal";
import DemoCodeDashboard from "./pages/PromoCodesManagement/DemoCodeManager";
import CourseDetailPage from "./pages/manageCourse/CourseDetailPage";
import StudentKnowledgeBase from "./pages/managePayments/faq";
import ReferralInvitePage from "./pages/activities/ReferralInvitePage";
import SkillAssessmentPage from "./pages/manageCourse/SkillAssessmentPage";
import MySubmissionsPage from "./pages/manageCourse/SkillAssessmentPage";

export default function App() {
  return (
    <Router basename="/admin/">
      <Toaster containerStyle={{ zIndex: 999999999999 }} position="top-right" />
      <ScrollToTop />
      <Routes>
        <Route index path="/Texteditor" element={<Tiptap />} />
        {/* Protected Admin Routes */}

        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />

          <Route path="/my-courses" element={<CourseManagement />} />
          <Route path="/course/:id/learn" element={<CourseDetailPage />} />

          {/* <Route path="/editCourse" element={<EditCourse />} /> */}

          <Route path="/instructors" element={<InstructorManagement />} />
          <Route path="/addInstructor" element={<InstructorCreate />} />

          <Route path="/tiers" element={<TierPathwayControl />} />
          <Route path="/events" element={<PracticalCalendarManagement />} />

          <Route path="/students" element={<StudentsManagement />} />
          <Route path="/studentCreate" element={<StudentCreate />} />
          <Route path="/studentDetails" element={<StudentDetails />} />

          <Route path="/certificates" element={<AchievementsPage />} />
          <Route path="/payment-history" element={<PaymentsPage />} />

          <Route path="/tickets" element={<SupportTicketsPage />} />

          <Route
            path="/announcements"
            element={<AnnouncementManagementPage />}
          />
          <Route path="/faq" element={<StudentKnowledgeBase />} />

          <Route path="/studentSubmissions" element={<SubmissionPage />} />

          <Route path="/subAdmins" element={<AdminManagement />} />

          <Route path="/managePermissions" element={<SubAdminPermissions />} />

          <Route path="/forum" element={<ForumModerationPage />} />

          <Route path="/addAdmin" element={<AdminCreate />} />

          <Route path="/reports" element={<ReportsAnalytics />} />

          <Route path="/security" element={<AuditLogsPage />} />

          <Route path="/profile" element={<UserProfiles />} />

          <Route path="/settings" element={<SystemSettingsPage />} />

          <Route path="/chats" element={<SuperAdminChatPortal />} />

          <Route path="/promoCodes" element={<DemoCodeDashboard />} />
          <Route path="/referral" element={<ReferralInvitePage />} />
          <Route path="/assessments" element={<SkillAssessmentPage />} />
          <Route path="/submissions" element={<MySubmissionsPage />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
