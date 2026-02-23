import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { RoleGuard } from "@/components/RoleGuard";
import Welcome from "./pages/Welcome";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AssignRole from "./pages/AssignRole";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffSetup from "./pages/staff/StaffSetup";
import StaffModuleDetail from "./pages/staff/StaffModuleDetail";
import StaffQuiz from "./pages/staff/StaffQuiz";
import ManagerTeam from "./pages/manager/ManagerTeam";
import ManagerSetup from "./pages/manager/ManagerSetup";
import ManagerStaffDetail from "./pages/manager/ManagerStaffDetail";
import ManagerModules from "./pages/manager/ManagerModules";
import ManagerCreateModule from "./pages/manager/ManagerCreateModule";
import ManagerModuleEdit from "./pages/manager/ManagerModuleEdit";
import ManagerInvite from "./pages/manager/ManagerInvite";
import ManagerPlaylists from "./pages/manager/ManagerPlaylists";
import ManagerPlaylistDetail from "./pages/manager/ManagerPlaylistDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, role, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? (role ? <Navigate to={`/${role === "manager" ? "manager/team" : "staff/dashboard"}`} replace /> : <Navigate to="/assign-role" replace />) : <Welcome />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/assign-role" element={user ? <AssignRole /> : <Navigate to="/login" replace />} />

      {/* Staff routes */}
      <Route path="/staff/dashboard" element={<RoleGuard role="staff"><StaffDashboard /></RoleGuard>} />
      <Route path="/staff/setup" element={<RoleGuard role="staff"><StaffSetup /></RoleGuard>} />
      <Route path="/staff/modules/:id" element={<RoleGuard role="staff"><StaffModuleDetail /></RoleGuard>} />
      <Route path="/staff/modules/:id/quiz" element={<RoleGuard role="staff"><StaffQuiz /></RoleGuard>} />

      {/* Manager routes */}
      <Route path="/manager/team" element={<RoleGuard role="manager"><ManagerTeam /></RoleGuard>} />
      <Route path="/manager/setup" element={<RoleGuard role="manager"><ManagerSetup /></RoleGuard>} />
      <Route path="/manager/team/:staffId" element={<RoleGuard role="manager"><ManagerStaffDetail /></RoleGuard>} />
      <Route path="/manager/modules" element={<RoleGuard role="manager"><ManagerModules /></RoleGuard>} />
      <Route path="/manager/modules/create" element={<RoleGuard role="manager"><ManagerCreateModule /></RoleGuard>} />
      <Route path="/manager/modules/:id/edit" element={<RoleGuard role="manager"><ManagerModuleEdit /></RoleGuard>} />
      <Route path="/manager/playlists" element={<RoleGuard role="manager"><ManagerPlaylists /></RoleGuard>} />
      <Route path="/manager/playlists/:id" element={<RoleGuard role="manager"><ManagerPlaylistDetail /></RoleGuard>} />
      <Route path="/manager/invite" element={<RoleGuard role="manager"><ManagerInvite /></RoleGuard>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
