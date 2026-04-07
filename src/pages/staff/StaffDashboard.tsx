import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import CircularProgress from "@/components/CircularProgress";
import { motion } from "framer-motion";
import { BookOpen, LogOut, KeyRound, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Module {
  id: string;
  title: string;
  description: string;
}

interface QuizScore {
  score: number;
  total: number;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const subtitles = [
  "Let's keep the momentum going 💪",
  "Ready to learn something new?",
  "You're doing great — keep it up!",
  "Time to level up your skills ✨",
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

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
      const [groupAssignRes, individualAssignRes] = await Promise.all([
        supabase.from("staff_playlist_assignments").select("playlist_id").eq("user_id", user.id),
        supabase.from("staff_module_assignments").select("module_id").eq("user_id", user.id),
      ]);

      const assignedModuleIds = new Set<string>();

      if (groupAssignRes.data && groupAssignRes.data.length > 0) {
        const playlistIds = groupAssignRes.data.map((a: any) => a.playlist_id);
        const { data: plMods } = await supabase
          .from("playlist_modules")
          .select("module_id")
          .in("playlist_id", playlistIds);
        (plMods || []).forEach((pm: any) => assignedModuleIds.add(pm.module_id));
      }

      (individualAssignRes.data || []).forEach((r: any) => assignedModuleIds.add(r.module_id));

      if (assignedModuleIds.size === 0) {
        setModules([]);
        setProgress({});
        setLoading(false);
        return;
      }

      const [modRes, progRes, quizRes] = await Promise.all([
        supabase.from("modules").select("id, title, description").in("id", Array.from(assignedModuleIds)).order("sort_order"),
        supabase.from("staff_module_progress").select("module_id, status").eq("user_id", user.id),
        supabase.from("staff_quiz_attempts").select("quiz_id, score, total, completed_at, quizzes!inner(module_id)").eq("user_id", user.id).order("completed_at", { ascending: false }),
      ]);
      setModules((modRes.data as Module[]) || []);
      const map: Record<string, string> = {};
      progRes.data?.forEach((p: any) => { map[p.module_id] = p.status; });
      setProgress(map);

      const scoreMap: Record<string, QuizScore> = {};
      (quizRes.data || []).forEach((a: any) => {
        const moduleId = a.quizzes?.module_id;
        if (moduleId && !scoreMap[moduleId]) {
          scoreMap[moduleId] = { score: a.score, total: a.total };
        }
      });
      setQuizScores(scoreMap);
      setLoading(false);
    };
    fetchData();
  }, [hasEstablishment, user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <div className="px-5 pt-6 pb-2 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="flex justify-center py-8">
          <Skeleton className="h-28 w-28 rounded-full" />
        </div>
        <div className="px-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
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
  const subtitle = subtitles[Math.floor(Math.random() * subtitles.length)];

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-5 pt-6 pb-2"
      >
        <div>
          <p className="text-sm text-muted-foreground">{getGreeting()},</p>
          <h1 className="text-xl font-bold">{profile?.name || "Staff"}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-5 w-5" /></Button>
      </motion.header>

      {/* Circular progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex justify-center py-6"
      >
        <CircularProgress value={overallPct} />
      </motion.div>

      <section className="px-5">
        <h2 className="mb-3 text-lg font-semibold">Training modules</h2>
        {modules.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No modules assigned to you yet. Ask your manager!</p>
        ) : (
          <div className="grid gap-3">
            {modules.map((mod, i) => {
              const status = progress[mod.id] || "not_started";
              const score = quizScores[mod.id];
              const isCompleted = status === "completed";
              const isInProgress = status === "in_progress";
              return (
                <motion.button
                  key={mod.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/staff/modules/${mod.id}`)}
                  className={`glass-card flex items-start gap-3 rounded-xl p-4 text-left transition-shadow hover:shadow-lg w-full ${
                    isCompleted
                      ? "border-l-[3px] border-l-success"
                      : isInProgress
                      ? "border-l-[3px] border-l-primary"
                      : ""
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isCompleted ? "bg-success/15" : "bg-primary/10"}`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : isInProgress ? (
                      <Clock className="h-5 w-5 text-primary" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-snug">{mod.title}</p>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-success/15 text-success border-0">
                          Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{mod.description}</p>
                    {score && (
                      <p className={`text-xs font-medium mt-1 ${
                        Math.round((score.score / score.total) * 100) >= 70
                          ? "text-success"
                          : "text-warning"
                      }`}>
                        Quiz: {score.score}/{score.total} ({Math.round((score.score / score.total) * 100)}%)
                        {Math.round((score.score / score.total) * 100) < 70 && " — Retry needed"}
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>

      {/* Reset progress — for testing */}
      <div className="px-5 pb-28 pt-6">
        <button
          onClick={async () => {
            if (!user) return;
            const ok = window.confirm("Reset ALL your training progress and quiz attempts? This cannot be undone.");
            if (!ok) return;
            await Promise.all([
              supabase.from("staff_module_progress").delete().eq("user_id", user.id),
              supabase.from("staff_quiz_attempts").delete().eq("user_id", user.id),
            ]);
            window.location.reload();
          }}
          className="w-full text-xs text-muted-foreground/60 hover:text-destructive transition-colors py-2"
        >
          Reset all progress
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default StaffDashboard;
