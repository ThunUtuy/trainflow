import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { ArrowLeft, CheckCircle2, Circle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ModuleStatus {
  module_id: string;
  title: string;
  status: string;
  quiz_score: string | null;
}

const ManagerStaffDetail = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [staffName, setStaffName] = useState("");
  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!staffId || !profile?.establishment_id) return;
    const fetch = async () => {
      const [nameRes, modsRes, progRes, attemptsRes] = await Promise.all([
        supabase.from("profiles").select("name").eq("user_id", staffId).single(),
        supabase.from("modules").select("id, title").eq("establishment_id", profile.establishment_id!).order("sort_order"),
        supabase.from("staff_module_progress").select("module_id, status").eq("user_id", staffId),
        supabase.from("staff_quiz_attempts").select("quiz_id, score, total").eq("user_id", staffId),
      ]);

      setStaffName(nameRes.data?.name || "Unknown");

      const modules = modsRes.data || [];
      const progMap: Record<string, string> = {};
      progRes.data?.forEach((p: any) => { progMap[p.module_id] = p.status; });

      // Get quiz scores per module
      const quizMap: Record<string, { score: number; total: number }> = {};
      if (attemptsRes.data) {
        for (const a of attemptsRes.data as any[]) {
          const { data: quizData } = await supabase.from("quizzes").select("module_id").eq("id", a.quiz_id).single();
          if (quizData) {
            quizMap[quizData.module_id] = { score: a.score, total: a.total };
          }
        }
      }

      setModuleStatuses(modules.map((m: any) => ({
        module_id: m.id,
        title: m.title,
        status: progMap[m.id] || "not_started",
        quiz_score: quizMap[m.id] ? `${quizMap[m.id].score}/${quizMap[m.id].total}` : null,
      })));
      setLoading(false);
    };
    fetch();
  }, [staffId, profile]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate("/manager/team")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ArrowLeft className="h-4 w-4" /> Back to team
      </button>

      <h1 className="text-2xl font-bold mb-1">{staffName}</h1>
      <p className="text-sm text-muted-foreground mb-6">Module-by-module progress</p>

      <div className="grid gap-3">
        {moduleStatuses.map((ms, i) => (
          <motion.div
            key={ms.module_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-xl border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              {ms.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : ms.status === "in_progress" ? (
                <Circle className="h-5 w-5 text-warning" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="font-medium">{ms.title}</span>
            </div>
            {ms.quiz_score && (
              <span className="text-sm text-muted-foreground">{ms.quiz_score}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManagerStaffDetail;
