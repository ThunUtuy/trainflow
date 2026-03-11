import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { ArrowLeft, CheckCircle2, Circle, XCircle, FolderOpen, BookOpen, UserMinus } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModuleStatus {
  module_id: string;
  title: string;
  status: string;
  quiz_score: string | null;
  source: "group" | "individual";
}

interface GroupAssignment {
  id: string;
  name: string;
  assigned: boolean;
}

interface ModuleAssignment {
  id: string;
  title: string;
  assigned: boolean;
  fromGroup: boolean; // true if already assigned via a group
}

const ManagerStaffDetail = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [staffName, setStaffName] = useState("");
  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([]);
  const [groups, setGroups] = useState<GroupAssignment[]>([]);
  const [allModules, setAllModules] = useState<ModuleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGroups, setSavingGroups] = useState(false);
  const [savingModules, setSavingModules] = useState(false);

  const fetchData = useCallback(async () => {
    if (!staffId || !profile?.establishment_id) return;
    const estId = profile.establishment_id!;

    const [nameRes, allGroupsRes, staffAssignRes, individualAssignRes, allModsRes, progRes, attemptsRes] = await Promise.all([
      supabase.from("profiles").select("name").eq("user_id", staffId).single(),
      supabase.from("playlists").select("id, name").eq("establishment_id", estId).order("created_at"),
      supabase.from("staff_playlist_assignments").select("playlist_id").eq("user_id", staffId),
      supabase.from("staff_module_assignments").select("module_id").eq("user_id", staffId),
      supabase.from("modules").select("id, title").eq("establishment_id", estId).order("sort_order"),
      supabase.from("staff_module_progress").select("module_id, status").eq("user_id", staffId),
      supabase.from("staff_quiz_attempts").select("quiz_id, score, total").eq("user_id", staffId),
    ]);

    setStaffName(nameRes.data?.name || "Unknown");

    // Groups
    const assignedGroupIds = new Set((staffAssignRes.data || []).map((r: any) => r.playlist_id));
    setGroups((allGroupsRes.data || []).map((g: any) => ({
      id: g.id, name: g.name, assigned: assignedGroupIds.has(g.id),
    })));

    // Modules from groups
    let groupModuleIds = new Set<string>();
    if (assignedGroupIds.size > 0) {
      const { data: plMods } = await supabase
        .from("playlist_modules")
        .select("module_id")
        .in("playlist_id", Array.from(assignedGroupIds));
      (plMods || []).forEach((pm: any) => groupModuleIds.add(pm.module_id));
    }

    // Individual module assignments
    const individualModuleIds = new Set((individualAssignRes.data || []).map((r: any) => r.module_id));

    // Combined assigned module IDs
    const allAssignedIds = new Set([...groupModuleIds, ...individualModuleIds]);

    // Build module assignment list (for the Modules tab)
    const estModules = allModsRes.data || [];
    setAllModules(estModules.map((m: any) => ({
      id: m.id,
      title: m.title,
      assigned: individualModuleIds.has(m.id) || groupModuleIds.has(m.id),
      fromGroup: groupModuleIds.has(m.id),
    })));

    // Build progress for assigned modules
    const progMap: Record<string, string> = {};
    progRes.data?.forEach((p: any) => { progMap[p.module_id] = p.status; });

    const quizMap: Record<string, { score: number; total: number }> = {};
    if (attemptsRes.data) {
      for (const a of attemptsRes.data as any[]) {
        const { data: quizData } = await supabase.from("quizzes").select("module_id").eq("id", a.quiz_id).single();
        if (quizData) quizMap[quizData.module_id] = { score: a.score, total: a.total };
      }
    }

    const assignedModules = estModules.filter((m: any) => allAssignedIds.has(m.id));
    setModuleStatuses(assignedModules.map((m: any) => ({
      module_id: m.id,
      title: m.title,
      status: progMap[m.id] || "not_started",
      quiz_score: quizMap[m.id] ? `${quizMap[m.id].score}/${quizMap[m.id].total}` : null,
      source: groupModuleIds.has(m.id) ? "group" as const : "individual" as const,
    })));

    setLoading(false);
  }, [staffId, profile]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleGroup = (groupId: string) => {
    setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, assigned: !g.assigned } : g));
  };

  const toggleModule = (moduleId: string) => {
    setAllModules((prev) => prev.map((m) =>
      m.id === moduleId && !m.fromGroup ? { ...m, assigned: !m.assigned } : m
    ));
  };

  const handleSaveGroups = async () => {
    if (!staffId) return;
    setSavingGroups(true);
    const assignedIds = groups.filter((g) => g.assigned).map((g) => g.id);
    await supabase.from("staff_playlist_assignments").delete().eq("user_id", staffId);
    if (assignedIds.length > 0) {
      await supabase.from("staff_playlist_assignments").insert(
        assignedIds.map((pid) => ({ playlist_id: pid, user_id: staffId }))
      );
    }
    setSavingGroups(false);
    toast({ title: "Groups updated ✓" });
    setLoading(true);
    fetchData();
  };

  const handleSaveModules = async () => {
    if (!staffId) return;
    setSavingModules(true);
    // Only save individually assigned modules (not ones from groups)
    const individualIds = allModules.filter((m) => m.assigned && !m.fromGroup).map((m) => m.id);
    await supabase.from("staff_module_assignments").delete().eq("user_id", staffId);
    if (individualIds.length > 0) {
      await supabase.from("staff_module_assignments").insert(
        individualIds.map((mid) => ({ user_id: staffId, module_id: mid }))
      );
    }
    setSavingModules(false);
    toast({ title: "Modules updated ✓" });
    setLoading(true);
    fetchData();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate("/manager/team")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ArrowLeft className="h-4 w-4" /> Back to team
      </button>

      <h1 className="text-2xl font-bold mb-1">{staffName}</h1>

      <Tabs defaultValue="progress" className="mt-4">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="progress" className="flex-1">Progress</TabsTrigger>
          <TabsTrigger value="modules" className="flex-1"><BookOpen className="mr-1.5 h-4 w-4" /> Modules</TabsTrigger>
          <TabsTrigger value="groups" className="flex-1"><FolderOpen className="mr-1.5 h-4 w-4" /> Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          {moduleStatuses.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-muted-foreground">No modules assigned yet.</p>
              <p className="text-xs text-muted-foreground">Use the Modules or Groups tab to assign training.</p>
            </div>
          ) : (
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
                    <div>
                      <span className="font-medium">{ms.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {ms.source === "group" ? "via group" : "individual"}
                      </span>
                    </div>
                  </div>
                  {ms.quiz_score && (() => {
                    const [s, t] = ms.quiz_score.split("/").map(Number);
                    const pct = Math.round((s / t) * 100);
                    const passed = pct >= 70;
                    return (
                      <span className={`text-sm font-medium ${passed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {ms.quiz_score} ({pct}%)
                      </span>
                    );
                  })()}
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="modules">
          {allModules.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No modules in your establishment yet.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">Modules from groups are marked and can't be individually removed here.</p>
              <div className="grid gap-2">
                {allModules.map((mod) => (
                  <motion.label
                    key={mod.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow ${mod.fromGroup ? "opacity-70" : "cursor-pointer hover:shadow-sm"}`}
                  >
                    <Checkbox
                      checked={mod.assigned}
                      onCheckedChange={() => toggleModule(mod.id)}
                      disabled={mod.fromGroup}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{mod.title}</span>
                      {mod.fromGroup && (
                        <span className="ml-2 text-xs text-muted-foreground">via group</span>
                      )}
                    </div>
                  </motion.label>
                ))}
              </div>
              <Button className="w-full mt-4" onClick={handleSaveModules} disabled={savingModules}>
                {savingModules ? "Saving..." : "Save module assignments"}
              </Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="groups">
          {groups.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No groups created yet.</p>
              <Button variant="outline" onClick={() => navigate("/manager/groups")}>Create a group</Button>
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                {groups.map((g) => (
                  <motion.label
                    key={g.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:shadow-sm transition-shadow"
                  >
                    <Checkbox checked={g.assigned} onCheckedChange={() => toggleGroup(g.id)} />
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">{g.name}</span>
                    </div>
                  </motion.label>
                ))}
              </div>
              <Button className="w-full mt-4" onClick={handleSaveGroups} disabled={savingGroups}>
                {savingGroups ? "Saving..." : "Save group assignments"}
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerStaffDetail;
