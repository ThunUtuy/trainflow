import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, Building2, LogOut } from "lucide-react";

interface StaffMember {
  user_id: string;
  name: string;
  completed: number;
  total: number;
  roles: string[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const ManagerTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuthContext();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [estName, setEstName] = useState("");
  const [loading, setLoading] = useState(true);

  const hasEstablishment = !!profile?.establishment_id;

  useEffect(() => {
    if (!hasEstablishment) { setLoading(false); return; }
    const fetch = async () => {
      const estId = profile!.establishment_id!;

      const [estRes, staffRes] = await Promise.all([
        supabase.from("establishments").select("name").eq("id", estId).single(),
        supabase.from("profiles").select("user_id, name").eq("establishment_id", estId),
      ]);

      setEstName(estRes.data?.name || "");

      const staffProfiles = staffRes.data || [];
      const staffWithRoles: StaffMember[] = [];

      for (const sp of staffProfiles) {
        const { data: roleData } = await supabase
          .from("user_roles").select("role").eq("user_id", sp.user_id).eq("role", "staff").maybeSingle();

        if (roleData) {
          const [playlistAssignRes, directAssignRes] = await Promise.all([
            supabase.from("staff_playlist_assignments").select("playlist_id").eq("user_id", sp.user_id),
            supabase.from("staff_module_assignments").select("module_id").eq("user_id", sp.user_id),
          ]);

          const assignedModuleIds = new Set<string>();
          (directAssignRes.data || []).forEach((r: any) => assignedModuleIds.add(r.module_id));

          const playlistIds = (playlistAssignRes.data || []).map((r: any) => r.playlist_id);
          let roleNames: string[] = [];
          if (playlistIds.length > 0) {
            const [plModRes, plNameRes] = await Promise.all([
              supabase.from("playlist_modules").select("module_id").in("playlist_id", playlistIds),
              supabase.from("playlists").select("name").in("id", playlistIds),
            ]);
            (plModRes.data || []).forEach((r: any) => assignedModuleIds.add(r.module_id));
            roleNames = (plNameRes.data || []).map((p: any) => p.name);
          }

          const totalAssigned = assignedModuleIds.size;
          let completedCount = 0;

          if (totalAssigned > 0) {
            const { data: progData } = await supabase.from("staff_module_progress").select("module_id, status").eq("user_id", sp.user_id).eq("status", "completed");
            completedCount = (progData || []).filter((p: any) => assignedModuleIds.has(p.module_id)).length;
          }

          staffWithRoles.push({ user_id: sp.user_id, name: sp.name, completed: completedCount, total: totalAssigned, roles: roleNames });
        }
      }

      setStaff(staffWithRoles);
      setLoading(false);
    };
    fetch();
  }, [hasEstablishment, profile, location.key]);

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <div className="px-5 pt-6 pb-2 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-36" />
        </div>
        <div className="px-5 pt-4 space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!hasEstablishment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center space-y-5">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">No establishment yet</h1>
          <p className="text-muted-foreground">Create your establishment to start managing your team.</p>
          <Button className="w-full" onClick={() => navigate("/manager/setup")}>Create establishment</Button>
          <Button variant="ghost" className="w-full" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-5 pt-6 pb-2"
      >
        <div>
          <p className="text-sm text-muted-foreground">{estName}</p>
          <h1 className="text-xl font-bold">Your team</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-5 w-5" /></Button>
      </motion.header>

      <section className="px-5 pt-4">
        {staff.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No staff members yet.</p>
            <Button variant="outline" onClick={() => navigate("/manager/invite")}>Generate invite code</Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {staff.map((s, i) => {
              const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
              return (
                <motion.button
                  key={s.user_id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/manager/team/${s.user_id}`)}
                  className="glass-card flex items-center justify-between rounded-xl p-4 text-left transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium">{s.name}</span>
                      {s.roles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {s.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{s.completed}/{s.total} modules</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${pct === 100 ? "text-success" : "text-primary"}`}>{pct}%</span>
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

export default ManagerTeam;
