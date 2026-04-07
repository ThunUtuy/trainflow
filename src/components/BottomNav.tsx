import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { BookOpen, Users, Settings, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const { role } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  if (!role) return null;

  const items = role === "manager"
    ? [
        { icon: Users, label: "Team", path: "/manager/team" },
        { icon: FolderOpen, label: "Roles", path: "/manager/groups" },
        { icon: Settings, label: "Settings", path: "/manager/settings" },
      ]
    : [
        { icon: BookOpen, label: "Modules", path: "/staff/dashboard" },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav px-2 pb-safe">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.div
                  layoutId="bottomnav-pill"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
