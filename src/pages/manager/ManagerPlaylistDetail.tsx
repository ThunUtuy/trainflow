import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Module { id: string; title: string; assigned: boolean; }
interface StaffMember { user_id: string; name: string; assigned: boolean; }

const ManagerPlaylistDetail = () => {
  const { id: playlistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [playlistName, setPlaylistName] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!playlistId || !profile?.establishment_id) return;
    const fetch = async () => {
      const estId = profile.establishment_id!;

      const [plRes, allModsRes, plModsRes, allStaffRes, plStaffRes] = await Promise.all([
        supabase.from("playlists").select("name").eq("id", playlistId).single(),
        supabase.from("modules").select("id, title").eq("establishment_id", estId).order("sort_order"),
        supabase.from("playlist_modules").select("module_id").eq("playlist_id", playlistId),
        supabase.from("profiles").select("user_id, name").eq("establishment_id", estId),
        supabase.from("staff_playlist_assignments").select("user_id").eq("playlist_id", playlistId),
      ]);

      setPlaylistName(plRes.data?.name || "");

      const assignedModIds = new Set((plModsRes.data || []).map((r: any) => r.module_id));
      setModules((allModsRes.data || []).map((m: any) => ({
        id: m.id, title: m.title, assigned: assignedModIds.has(m.id),
      })));

      const assignedStaffIds = new Set((plStaffRes.data || []).map((r: any) => r.user_id));
      
      // Filter to only staff role users
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
    fetch();
  }, [playlistId, profile]);

  const toggleModule = (moduleId: string) => {
    setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, assigned: !m.assigned } : m));
  };

  const toggleStaff = (userId: string) => {
    setStaff((prev) => prev.map((s) => s.user_id === userId ? { ...s, assigned: !s.assigned } : s));
  };

  const handleSave = async () => {
    if (!playlistId) return;
    setSaving(true);

    // Sync modules
    const currentModIds = modules.filter((m) => m.assigned).map((m) => m.id);
    await supabase.from("playlist_modules").delete().eq("playlist_id", playlistId);
    if (currentModIds.length > 0) {
      await supabase.from("playlist_modules").insert(
        currentModIds.map((mid, i) => ({ playlist_id: playlistId, module_id: mid, sort_order: i }))
      );
    }

    // Sync staff assignments
    const currentStaffIds = staff.filter((s) => s.assigned).map((s) => s.user_id);
    await supabase.from("staff_playlist_assignments").delete().eq("playlist_id", playlistId);
    if (currentStaffIds.length > 0) {
      await supabase.from("staff_playlist_assignments").insert(
        currentStaffIds.map((uid) => ({ playlist_id: playlistId, user_id: uid }))
      );
    }

    setSaving(false);
    toast({ title: "Playlist saved ✓" });
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate("/manager/playlists")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ArrowLeft className="h-4 w-4" /> Back to playlists
      </button>

      <h1 className="text-2xl font-bold mb-1">{playlistName}</h1>
      <p className="text-sm text-muted-foreground mb-4">Select modules and assign staff</p>

      <Tabs defaultValue="modules">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="modules" className="flex-1"><BookOpen className="mr-1.5 h-4 w-4" /> Modules</TabsTrigger>
          <TabsTrigger value="staff" className="flex-1"><Users className="mr-1.5 h-4 w-4" /> Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          {modules.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No modules in your establishment yet.</p>
          ) : (
            <div className="grid gap-2">
              {modules.map((mod) => (
                <motion.label
                  key={mod.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:shadow-sm transition-shadow"
                >
                  <Checkbox checked={mod.assigned} onCheckedChange={() => toggleModule(mod.id)} />
                  <span className="font-medium">{mod.title}</span>
                </motion.label>
              ))}
            </div>
          )}
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
          {saving ? "Saving..." : "Save playlist"}
        </Button>
      </div>
    </div>
  );
};

export default ManagerPlaylistDetail;
