import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { BookOpen, Users, Settings, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { role } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  if (!role) return null;

  const items = role === "manager"
    ? [
        { icon: Users, label: "Team", path: "/manager/team" },
        { icon: FolderOpen, label: "Roles", path: "/manager/groups" },
        { icon: Settings, label: "Settings", path: "/manager/invite" },
      ]
    : [
        { icon: BookOpen, label: "Modules", path: "/staff/dashboard" },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card px-2 pb-safe">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
