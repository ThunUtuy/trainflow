import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Plus, ListMusic, Trash2 } from "lucide-react";

interface Playlist {
  id: string;
  name: string;
  module_count: number;
  staff_count: number;
}

const ManagerPlaylists = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchPlaylists = async () => {
    if (!profile?.establishment_id) return;
    const { data } = await supabase
      .from("playlists")
      .select("id, name")
      .eq("establishment_id", profile.establishment_id)
      .order("created_at");

    if (!data) { setPlaylists([]); setLoading(false); return; }

    const enriched: Playlist[] = await Promise.all(
      data.map(async (p) => {
        const [modRes, staffRes] = await Promise.all([
          supabase.from("playlist_modules").select("id", { count: "exact", head: true }).eq("playlist_id", p.id),
          supabase.from("staff_playlist_assignments").select("id", { count: "exact", head: true }).eq("playlist_id", p.id),
        ]);
        return { ...p, module_count: modRes.count || 0, staff_count: staffRes.count || 0 };
      })
    );

    setPlaylists(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchPlaylists(); }, [profile]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !profile?.establishment_id) return;
    setCreating(true);
    const { error } = await supabase.from("playlists").insert({
      name: newName.trim(),
      establishment_id: profile.establishment_id,
    });
    setCreating(false);
    if (error) { toast({ title: "Failed to create playlist", variant: "destructive" }); return; }
    setNewName("");
    toast({ title: "Playlist created" });
    fetchPlaylists();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("playlists").delete().eq("id", id);
    toast({ title: "Playlist deleted" });
    fetchPlaylists();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold">Playlists</h1>
        <p className="text-sm text-muted-foreground">Group modules into training playlists</p>
      </header>

      <form onSubmit={handleCreate} className="flex gap-2 px-5 pt-3">
        <Input
          placeholder="New playlist name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <Button type="submit" size="sm" disabled={creating}>
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </form>

      <section className="px-5 pt-4">
        {playlists.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ListMusic className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No playlists yet. Create one above!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {playlists.map((pl) => (
              <motion.div
                key={pl.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-xl border bg-card p-4"
              >
                <button
                  onClick={() => navigate(`/manager/playlists/${pl.id}`)}
                  className="flex items-center gap-3 text-left flex-1 min-w-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <ListMusic className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{pl.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {pl.module_count} module{pl.module_count !== 1 ? "s" : ""} · {pl.staff_count} staff
                    </p>
                  </div>
                </button>
                <ConfirmDeleteDialog
                  trigger={<button className="ml-2 p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>}
                  title="Delete playlist?"
                  description="This will remove the playlist and unassign it from all staff."
                  onConfirm={() => handleDelete(pl.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <BottomNav />
    </div>
  );
};

export default ManagerPlaylists;
