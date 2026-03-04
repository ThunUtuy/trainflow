import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { roleTemplates } from "@/data/roleTemplates";

const ManagerCreateRole = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [selected, setSelected] = useState<string | "blank" | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!profile?.establishment_id) return;
    setLoading(true);

    const template = roleTemplates.find((t) => t.key === selected);
    const finalName = selected === "blank" ? name : template?.title || name;

    // Create the playlist (role)
    const { data: playlist, error } = await supabase
      .from("playlists")
      .insert({ name: finalName, establishment_id: profile.establishment_id })
      .select("id")
      .single();

    if (error || !playlist) {
      toast({ title: "Failed to create role", variant: "destructive" });
      setLoading(false);
      return;
    }

    // If a template is selected, create all modules and link them
    if (template) {
      for (let mi = 0; mi < template.modules.length; mi++) {
        const mod = template.modules[mi];

        // Check if module with same title already exists in this establishment
        const { data: existing } = await supabase
          .from("modules")
          .select("id")
          .eq("establishment_id", profile.establishment_id)
          .eq("title", mod.title)
          .maybeSingle();

        let moduleId: string;

        if (existing) {
          moduleId = existing.id;
        } else {
          // Create the module
          const { data: newMod, error: modErr } = await supabase
            .from("modules")
            .insert({
              establishment_id: profile.establishment_id,
              title: mod.title,
              description: mod.description,
              template_source: template.key,
              sort_order: mi,
            })
            .select("id")
            .single();

          if (modErr || !newMod) continue;
          moduleId = newMod.id;

          // Create pages
          const pages = mod.pages.map((p, i) => ({
            module_id: moduleId,
            type: p.type,
            title: p.title,
            content: p.content,
            sort_order: i,
          }));
          await supabase.from("module_pages").insert(pages);

          // Create quiz
          const { data: quiz } = await supabase
            .from("quizzes")
            .insert({ module_id: moduleId, title: mod.quiz.title })
            .select("id")
            .single();

          if (quiz) {
            const questions = mod.quiz.questions.map((q, i) => ({
              quiz_id: quiz.id,
              question_text: q.question_text,
              type: q.type,
              options: q.options,
              correct_answers: q.correct_answers,
              sort_order: i,
            }));
            await supabase.from("quiz_questions").insert(questions);
          }
        }

        // Link module to playlist
        await supabase.from("playlist_modules").insert({
          playlist_id: playlist.id,
          module_id: moduleId,
          sort_order: mi,
        });
      }
    }

    setLoading(false);
    toast({ title: "Role created! ✨" });
    navigate(`/manager/groups/${playlist.id}`);
  };

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button
        onClick={() => navigate("/manager/groups")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold mb-1">New role</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Choose a recommended template or start blank
      </p>

      <div className="grid gap-3 mb-6">
        {roleTemplates.map((t) => (
          <div key={t.key}>
            <button
              onClick={() => setSelected(selected === t.key ? null : t.key)}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                selected === t.key
                  ? "border-primary bg-primary/5 rounded-b-none"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <t.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
                <p className="text-xs text-primary/70 mt-1">
                  {t.modules.length} modules included
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  selected === t.key && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {selected === t.key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-2 border-t-0 border-primary rounded-b-xl bg-primary/5"
                >
                  <ul className="px-4 py-3 space-y-1">
                    {t.modules.map((m, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {m.title}
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 pb-4">
                    <Button
                      className="w-full"
                      disabled={loading}
                      onClick={handleCreate}
                    >
                      {loading ? "Creating..." : "Create role"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <button
          onClick={() => setSelected("blank")}
          className={cn(
            "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
            selected === "blank"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Blank role</p>
            <p className="text-xs text-muted-foreground">
              Start from scratch and add modules manually
            </p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {selected === "blank" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 mb-6"
          >
            <div>
              <Label htmlFor="name">Role name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Barista, Kitchen Porter"
              />
            </div>
            <Button
              className="w-full"
              disabled={!name.trim() || loading}
              onClick={handleCreate}
            >
              {loading ? "Creating..." : "Create role"}
            </Button>
          </motion.div>
        )}
    </div>
  );
};

export default ManagerCreateRole;
