import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/BottomNav";
import { motion } from "framer-motion";
import { BookOpen, LogOut, KeyRound, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Module {
  id: string;
  title: string;
  description: string;
}

interface QuizScore {
  score: number;
  total: number;
}

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthContext();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [quizScores, setQuizScores] = useState<Record<string, QuizScore>>({});
  const [loading, setLoading] = useState(true);

  const hasEstablishment = !!profile?.establishment_id;

  useEffect(() => {
    if (!hasEstablishment || !user) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      // Get modules from groups
      const [groupAssignRes, individualAssignRes] = await Promise.all([
        supabase.from("staff_playlist_assignments").select("playlist_id").eq("user_id", user.id),
        supabase.from("staff_module_assignments").select("module_id").eq("user_id", user.id),
      ]);

      const assignedModuleIds = new Set<string>();

      // Modules from groups
      if (groupAssignRes.data && groupAssignRes.data.length > 0) {
        const playlistIds = groupAssignRes.data.map((a: any) => a.playlist_id);
        const { data: plMods } = await supabase
          .from("playlist_modules")
          .select("module_id")
          .in("playlist_id", playlistIds);
        (plMods || []).forEach((pm: any) => assignedModuleIds.add(pm.module_id));
      }

      // Individual module assignments
      (individualAssignRes.data || []).forEach((r: any) => assignedModuleIds.add(r.module_id));

      if (assignedModuleIds.size === 0) {
        setModules([]);
        setProgress({});
        setLoading(false);
        return;
      }

      const [modRes, progRes] = await Promise.all([
        supabase.from("modules").select("id, title, description").in("id", Array.from(assignedModuleIds)).order("sort_order"),
        supabase.from("staff_module_progress").select("module_id, status").eq("user_id", user.id),
      ]);
      setModules((modRes.data as Module[]) || []);
      const map: Record<string, string> = {};
      progRes.data?.forEach((p: any) => { map[p.module_id] = p.status; });
      setProgress(map);
      setLoading(false);
    };
    fetchData();
  }, [hasEstablishment, user, profile]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (!hasEstablishment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-5 text-center">
          <KeyRound className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">No team yet</h1>
          <p className="text-muted-foreground">Ask your manager for an invite code to get started.</p>
          <Button className="w-full" onClick={() => navigate("/staff/setup")}>Enter invite code</Button>
          <Button variant="ghost" className="w-full" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
        </motion.div>
      </div>
    );
  }

  const completed = modules.filter((m) => progress[m.id] === "completed").length;
  const overallPct = modules.length ? Math.round((completed / modules.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-xl font-bold">{profile?.name || "Staff"}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-5 w-5" /></Button>
      </header>

      <div className="px-5 py-4">
        <div className="rounded-xl bg-primary/10 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall progress</span>
            <span className="text-primary font-semibold">{overallPct}%</span>
          </div>
          <Progress value={overallPct} className="mt-2 h-2" />
        </div>
      </div>

      <section className="px-5">
        <h2 className="mb-3 text-lg font-semibold">Training modules</h2>
        {modules.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No modules assigned to you yet. Ask your manager!</p>
        ) : (
          <div className="grid gap-3">
            {modules.map((mod) => {
              const status = progress[mod.id] || "not_started";
              return (
                <motion.button
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/staff/modules/${mod.id}`)}
                  className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md w-full"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-snug">{mod.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{mod.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>
      <BottomNav />
    </div>
  );
};

export default StaffDashboard;
