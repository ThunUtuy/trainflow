import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import type { AppRole } from "@/hooks/useAuth";

interface RoleGuardProps {
  role: AppRole;
  children: React.ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const { user, role: userRole, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!userRole) return <Navigate to="/select-role" replace />;
  if (userRole !== role) return <Navigate to={`/${userRole}/dashboard`} replace />;

  return <>{children}</>;
}
