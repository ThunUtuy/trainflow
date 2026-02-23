import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ShieldCheck, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AssignRole = () => {
  const navigate = useNavigate();
  const { user, role, refetch } = useAuthContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === "manager") navigate("/manager/team", { replace: true });
    else if (role === "staff") navigate("/staff/dashboard", { replace: true });
  }, [role, navigate]);

  // Check if a role was passed via signup metadata
  useEffect(() => {
    if (!user || role) return;
    const metaRole = user.user_metadata?.app_role;
    if (metaRole === "manager" || metaRole === "staff") {
      assignRole(metaRole);
    }
  }, [user, role]);

  const assignRole = async (selectedRole: "manager" | "staff") => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: selectedRole });
    setLoading(false);
    if (error) {
      toast({ title: "Failed to set role", variant: "destructive" });
      return;
    }
    refetch();
  };

  if (role) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Choose your role</h1>
          <p className="mt-1 text-muted-foreground">This determines your experience</p>
        </div>

        <div className="grid gap-4">
          <button
            disabled={loading}
            onClick={() => assignRole("manager")}
            className={cn(
              "flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md",
              loading && "opacity-50"
            )}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Manager</p>
              <p className="text-sm text-muted-foreground">Create modules, manage your team</p>
            </div>
          </button>

          <button
            disabled={loading}
            onClick={() => assignRole("staff")}
            className={cn(
              "flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md",
              loading && "opacity-50"
            )}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <User className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold">Staff</p>
              <p className="text-sm text-muted-foreground">Complete training & quizzes</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignRole;
