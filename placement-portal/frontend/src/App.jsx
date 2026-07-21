import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

// student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentJobs from "./pages/student/StudentJobs";
import MyApplications from "./pages/student/MyApplications";

// company pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyProfile from "./pages/company/CompanyProfile";
import PostJob from "./pages/company/PostJob";
import ManageJobs from "./pages/company/ManageJobs";
import Applicants from "./pages/company/Applicants";

// admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";

// route guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import UserAccess from "./pages/admin/UserAccess";

function App() {
  return (
    <AuthProvider>
        <Routes>
          {/* default */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= STUDENT ROUTES ================= */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/jobs"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute allowedRole="student">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* ================= COMPANY ROUTES ================= */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRole="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/profile"
            element={
              <ProtectedRoute allowedRole="company">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/post-job"
            element={
              <ProtectedRoute allowedRole="company">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/manage-jobs"
            element={
              <ProtectedRoute allowedRole="company">
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/applicants/:jobId"
            element={
              <ProtectedRoute allowedRole="company">
                <Applicants />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <AdminRoute>
                <AdminStudents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <AdminRoute>
                <AdminCompanies />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <AdminRoute>
                <AdminJobs />
              </AdminRoute>
            }
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
          <Route
            path="/admin/applications"
            element={
              <AdminRoute>
                <AdminApplications />
              </AdminRoute>
            }
          />
          <Route
          path="/verify-otp"
          element={<VerifyOTP />}
           />
          <Route
          path="/forgot-password"
          element={<ForgotPassword />}
          />
          <Route
          path="/reset-password"
          element={<ResetPassword />}
          />
          <Route
          path="/admin/user-access"
          element={<UserAccess />}
          />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;