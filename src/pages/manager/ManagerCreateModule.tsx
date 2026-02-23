import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, ShieldCheck, Shirt, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

const templates = [
  {
    key: "health_safety",
    icon: ShieldCheck,
    title: "Health & Safety",
    description: "Food handling, hygiene, and workplace safety",
    pages: [
      { type: "text" as const, title: "Introduction", content: { text: "Welcome to the Health & Safety module. This training covers essential hygiene and safety practices for your workplace." } },
      { type: "checklist" as const, title: "Daily Hygiene Checklist", content: { items: ["Wash hands before starting shift", "Wear clean uniform and apron", "Tie back hair and remove jewelry", "Check food temperatures", "Clean and sanitise workstations"] } },
      { type: "text" as const, title: "Emergency Procedures", content: { text: "In case of fire: Alert others, call emergency services, evacuate via nearest exit. In case of injury: Apply first aid, report to manager, fill incident form." } },
    ],
    quiz: {
      title: "Health & Safety Quiz",
      questions: [
        { question_text: "How often should you wash your hands?", type: "single_choice" as const, options: ["Once a day", "Before and after handling food", "Only when they look dirty", "Every hour"], correct_answers: [1] },
        { question_text: "Which of these are correct food storage practices?", type: "multi_choice" as const, options: ["Store raw meat above cooked food", "Label all containers with dates", "Keep fridges at 5°C or below", "Leave food at room temperature"], correct_answers: [1, 2] },
        { question_text: "You should report all workplace injuries, no matter how minor.", type: "true_false" as const, options: ["True", "False"], correct_answers: [0] },
      ],
    },
  },
  {
    key: "dress_code",
    icon: Shirt,
    title: "Dress Code",
    description: "Uniform standards and personal presentation",
    pages: [
      { type: "text" as const, title: "Uniform Standards", content: { text: "All staff must wear the provided uniform. Uniforms must be clean, pressed, and in good condition. Name badges should be worn at all times." } },
      { type: "checklist" as const, title: "Before Your Shift", content: { items: ["Clean, pressed uniform", "Name badge visible", "Closed-toe non-slip shoes", "Minimal jewelry", "Neat hair tied back"] } },
    ],
    quiz: {
      title: "Dress Code Quiz",
      questions: [
        { question_text: "When should you wear your name badge?", type: "single_choice" as const, options: ["Only when serving customers", "At all times during shifts", "Only on your first week", "Never"], correct_answers: [1] },
        { question_text: "Open-toe shoes are acceptable in the kitchen.", type: "true_false" as const, options: ["True", "False"], correct_answers: [1] },
      ],
    },
  },
  {
    key: "workflow",
    icon: Workflow,
    title: "Workflow",
    description: "Daily tasks, opening and closing procedures",
    pages: [
      { type: "text" as const, title: "Opening Procedures", content: { text: "Arrive 15 minutes before opening. Turn on all equipment. Check stock levels. Set up your station. Brief with manager on daily specials." } },
      { type: "checklist" as const, title: "Closing Checklist", content: { items: ["Clean all surfaces", "Restock supplies", "Empty bins", "Turn off equipment", "Lock up and set alarm"] } },
    ],
    quiz: {
      title: "Workflow Quiz",
      questions: [
        { question_text: "How early should you arrive before opening?", type: "single_choice" as const, options: ["5 minutes", "15 minutes", "30 minutes", "Exactly on time"], correct_answers: [1] },
      ],
    },
  },
];

const ManagerCreateModule = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [selected, setSelected] = useState<string | "blank" | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!profile?.establishment_id) return;
    setLoading(true);

    const template = templates.find((t) => t.key === selected);
    const finalTitle = selected === "blank" ? title : template?.title || title;
    const finalDesc = selected === "blank" ? description : template?.description || description;

    // Create module
    const { data: mod, error } = await supabase
      .from("modules")
      .insert({
        establishment_id: profile.establishment_id,
        title: finalTitle,
        description: finalDesc,
        template_source: selected === "blank" ? null : selected,
      })
      .select("id")
      .single();

    if (error || !mod) {
      toast({ title: "Failed to create module", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Add template pages and quiz
    if (template) {
      const pages = template.pages.map((p, i) => ({
        module_id: mod.id,
        type: p.type,
        title: p.title,
        content: p.content,
        sort_order: i,
      }));
      await supabase.from("module_pages").insert(pages);

      // Create quiz
      const { data: quiz } = await supabase
        .from("quizzes")
        .insert({ module_id: mod.id, title: template.quiz.title })
        .select("id")
        .single();

      if (quiz) {
        const questions = template.quiz.questions.map((q, i) => ({
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

    setLoading(false);
    toast({ title: "Module created! ✨" });
    navigate(`/manager/modules/${mod.id}/edit`);
  };

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate("/manager/modules")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold mb-1">New module</h1>
      <p className="text-sm text-muted-foreground mb-6">Choose a template or start blank</p>

      <div className="grid gap-3 mb-6">
        {templates.map((t) => (
          <button
            key={t.key}
            onClick={() => setSelected(t.key)}
            className={cn(
              "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
              selected === t.key ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <t.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </div>
          </button>
        ))}

        <button
          onClick={() => setSelected("blank")}
          className={cn(
            "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
            selected === "blank" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Blank module</p>
            <p className="text-xs text-muted-foreground">Start from scratch</p>
          </div>
        </button>
      </div>

      {selected === "blank" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 mb-6">
          <div>
            <Label htmlFor="title">Module title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Customer Service" />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
          </div>
        </motion.div>
      )}

      <Button
        className="w-full"
        disabled={!selected || (selected === "blank" && !title) || loading}
        onClick={handleCreate}
      >
        {loading ? "Creating..." : "Create module"}
      </Button>
    </div>
  );
};

export default ManagerCreateModule;
