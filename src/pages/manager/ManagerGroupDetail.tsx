import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Users, Trash2, Plus, Library, FilePlus } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Module { id: string; title: string; }
interface StaffMember { user_id: string; name: string; assigned: boolean; }

const ManagerGroupDetail = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [groupName, setGroupName] = useState("");
  const [includedModules, setIncludedModules] = useState<Module[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState<Set<string>>(new Set());
  const [addMode, setAddMode] = useState<"existing" | null>(null);

  useEffect(() => {
    if (!groupId || !profile?.establishment_id) return;
    const fetchData = async () => {
      const estId = profile.establishment_id!;

      const [plRes, allModsRes, plModsRes, allStaffRes, plStaffRes] = await Promise.all([
        supabase.from("playlists").select("name").eq("id", groupId).single(),
        supabase.from("modules").select("id, title").eq("establishment_id", estId).order("sort_order"),
        supabase.from("playlist_modules").select("module_id").eq("playlist_id", groupId),
        supabase.from("profiles").select("user_id, name").eq("establishment_id", estId),
        supabase.from("staff_playlist_assignments").select("user_id").eq("playlist_id", groupId),
      ]);

      setGroupName(plRes.data?.name || "");

      const allMods = (allModsRes.data || []).map((m: any) => ({ id: m.id, title: m.title }));
      setAllModules(allMods);

      const assignedModIds = new Set((plModsRes.data || []).map((r: any) => r.module_id));
      setIncludedModules(allMods.filter((m) => assignedModIds.has(m.id)));

      const assignedStaffIds = new Set((plStaffRes.data || []).map((r: any) => r.user_id));
      const staffProfiles = allStaffRes.data || [];
      const staffWithRoles: StaffMember[] = [];
      for (const sp of staffProfiles) {
        const { data: roleData } = await supabase
          .from("user_roles").select("role").eq("user_id", sp.user_id).eq("role", "staff").maybeSingle();
        if (roleData) {
          staffWithRoles.push({
            user_id: sp.user_id, name: sp.name,
            assigned: assignedStaffIds.has(sp.user_id),
          });
        }
      }
      setStaff(staffWithRoles);
      setLoading(false);
    };
    fetchData();
  }, [groupId, profile]);

  const removeModule = (moduleId: string) => {
    setIncludedModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const toggleAddSelection = (moduleId: string) => {
    setSelectedToAdd((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const confirmAddModules = () => {
    const newMods = allModules.filter(
      (m) => selectedToAdd.has(m.id) && !includedModules.some((inc) => inc.id === m.id)
    );
    setIncludedModules((prev) => [...prev, ...newMods]);
    setSelectedToAdd(new Set());
    setSheetOpen(false);
  };

  const toggleStaff = (userId: string) => {
    setStaff((prev) => prev.map((s) => s.user_id === userId ? { ...s, assigned: !s.assigned } : s));
  };

  const availableModules = allModules.filter(
    (m) => !includedModules.some((inc) => inc.id === m.id)
  );

  const handleSave = async () => {
    if (!groupId) return;
    setSaving(true);

    const currentModIds = includedModules.map((m) => m.id);
    await supabase.from("playlist_modules").delete().eq("playlist_id", groupId);
    if (currentModIds.length > 0) {
      await supabase.from("playlist_modules").insert(
        currentModIds.map((mid, i) => ({ playlist_id: groupId, module_id: mid, sort_order: i }))
      );
    }

    const currentStaffIds = staff.filter((s) => s.assigned).map((s) => s.user_id);
    await supabase.from("staff_playlist_assignments").delete().eq("playlist_id", groupId);
    if (currentStaffIds.length > 0) {
      await supabase.from("staff_playlist_assignments").insert(
        currentStaffIds.map((uid) => ({ playlist_id: groupId, user_id: uid }))
      );
    }

    setSaving(false);
    toast({ title: "Role saved ✓" });
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate("/manager/groups")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ArrowLeft className="h-4 w-4" /> Back to roles
      </button>

      <h1 className="text-2xl font-bold mb-1">{groupName}</h1>
      <p className="text-sm text-muted-foreground mb-4">Manage modules and staff for this role</p>

      <Tabs defaultValue="modules">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="modules" className="flex-1"><BookOpen className="mr-1.5 h-4 w-4" /> Modules ({includedModules.length})</TabsTrigger>
          <TabsTrigger value="staff" className="flex-1"><Users className="mr-1.5 h-4 w-4" /> Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          {includedModules.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No modules in this role yet.</p>
          ) : (
            <div className="grid gap-2">
              <AnimatePresence>
                {includedModules.map((mod) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="flex items-center justify-between rounded-xl border bg-card p-4"
                  >
                    <button
                      onClick={() => navigate(`/manager/modules/${mod.id}/edit?from=role&roleId=${groupId}`)}
                      className="flex items-center gap-3 min-w-0 text-left flex-1"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium truncate">{mod.title}</span>
                    </button>
                    <button
                      onClick={() => removeModule(mod.id)}
                      className="ml-2 p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <Sheet open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); if (!open) { setSelectedToAdd(new Set()); setAddMode(null); } }}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Add module
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[70vh] overflow-y-auto rounded-t-2xl">
              {!addMode ? (
                <>
                  <SheetHeader>
                    <SheetTitle>Add module</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 grid gap-3">
                    <button
                      onClick={() => setAddMode("existing")}
                      className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left hover:shadow-sm transition-shadow"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Library className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Select existing module</p>
                        <p className="text-xs text-muted-foreground">Choose from your module library</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSheetOpen(false);
                        navigate(`/manager/modules/create?roleId=${groupId}`);
                      }}
                      className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left hover:shadow-sm transition-shadow"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FilePlus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Create new module</p>
                        <p className="text-xs text-muted-foreground">Build a module from scratch or template</p>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <SheetHeader>
                    <SheetTitle>
                      <button onClick={() => setAddMode(null)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mr-2">
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                      Module library
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 grid gap-2">
                    {availableModules.length === 0 ? (
                      <p className="text-center py-6 text-muted-foreground">All modules are already included.</p>
                    ) : (
                      availableModules.map((mod) => (
                        <label
                          key={mod.id}
                          className="flex items-center gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:shadow-sm transition-shadow"
                        >
                          <Checkbox
                            checked={selectedToAdd.has(mod.id)}
                            onCheckedChange={() => toggleAddSelection(mod.id)}
                          />
                          <span className="font-medium">{mod.title}</span>
                        </label>
                      ))
                    )}
                  </div>
                  {availableModules.length > 0 && (
                    <Button
                      className="w-full mt-4"
                      onClick={confirmAddModules}
                      disabled={selectedToAdd.size === 0}
                    >
                      Add {selectedToAdd.size} module{selectedToAdd.size !== 1 ? "s" : ""}
                    </Button>
                  )}
                </>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        <TabsContent value="staff">
          {staff.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No staff members yet. Invite them first!</p>
          ) : (
            <div className="grid gap-2">
              {staff.map((s) => (
                <motion.label
                  key={s.user_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:shadow-sm transition-shadow"
                >
                  <Checkbox checked={s.assigned} onCheckedChange={() => toggleStaff(s.user_id)} />
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </motion.label>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save role"}
        </Button>
      </div>
    </div>
  );
};

export default ManagerGroupDetail;
