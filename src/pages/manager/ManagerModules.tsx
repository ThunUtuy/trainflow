import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Plus, BookOpen, Trash2 } from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
}

const ManagerModules = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    if (!profile?.establishment_id) return;
    const { data } = await supabase
      .from("modules")
      .select("id, title, description")
      .eq("establishment_id", profile.establishment_id)
      .order("sort_order");
    setModules((data as Module[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchModules(); }, [profile]);

  const handleDelete = async (id: string) => {
    await supabase.from("modules").delete().eq("id", id);
    toast({ title: "Module deleted" });
    fetchModules();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold">Modules</h1>
        <Button size="sm" onClick={() => navigate("/manager/modules/create")}>
          <Plus className="mr-1 h-4 w-4" /> New
        </Button>
      </header>

      <section className="px-5 pt-4">
        {modules.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No modules yet. Create your first!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {modules.map((mod) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-xl border bg-card p-4"
              >
                <button
                  onClick={() => navigate(`/manager/modules/${mod.id}/edit`)}
                  className="flex items-center gap-3 text-left flex-1 min-w-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{mod.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
                  </div>
                </button>
                <ConfirmDeleteDialog
                  trigger={<button className="ml-2 p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>}
                  title="Delete module?"
                  description="This will permanently delete this module, all its pages, and quiz data."
                  onConfirm={() => handleDelete(mod.id)}
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

export default ManagerModules;
