import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ModulePage {
  id: string;
  type: string;
  title: string;
  content: any;
  sort_order: number;
}

const StaffModuleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [moduleInfo, setModuleInfo] = useState<{ title: string; description: string } | null>(null);
  const [pages, setPages] = useState<ModulePage[]>([]);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const [modRes, pagesRes, quizRes] = await Promise.all([
        supabase.from("modules").select("title, description").eq("id", id).single(),
        supabase.from("module_pages").select("*").eq("module_id", id).order("sort_order"),
        supabase.from("quizzes").select("id").eq("module_id", id).limit(1),
      ]);
      setModuleInfo(modRes.data);
      setPages(pagesRes.data as ModulePage[] || []);
      setHasQuiz((quizRes.data?.length ?? 0) > 0);
      setLoading(false);

      // Mark as in_progress only if not already completed
      if (user) {
        const { data: existing } = await supabase
          .from("staff_module_progress")
          .select("status")
          .eq("user_id", user.id)
          .eq("module_id", id)
          .maybeSingle();
        if (!existing || existing.status !== "completed") {
          await supabase.from("staff_module_progress").upsert(
            { user_id: user.id, module_id: id, status: "in_progress" as any, updated_at: new Date().toISOString() },
            { onConflict: "user_id,module_id" }
          );
        }
      }
    };
    fetch();
  }, [id, user]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const renderPage = (page: ModulePage) => {
    switch (page.type) {
      case "text":
        return <p className="whitespace-pre-wrap text-sm leading-relaxed">{page.content?.text || ""}</p>;
      case "image":
        return (
          <div className="space-y-2">
            {page.content?.text && <p className="text-sm">{page.content.text}</p>}
            {page.content?.url && <img src={page.content.url} alt={page.title} className="rounded-lg w-full" />}
          </div>
        );
      case "video":
        return (
          <div className="space-y-2">
            {page.content?.text && <p className="text-sm">{page.content.text}</p>}
            {page.content?.url && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe src={page.content.url} className="h-full w-full" allowFullScreen />
              </div>
            )}
          </div>
        );
      case "checklist":
        return (
          <ul className="space-y-3">
            {(page.content?.items || []).map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <Checkbox
                  id={`${page.id}-${i}`}
                  className="mt-0.5"
                  onCheckedChange={() => {}}
                />
                <label htmlFor={`${page.id}-${i}`} className="text-sm cursor-pointer select-none">{item}</label>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <header className="px-5 pt-6 pb-4">
        <button onClick={() => navigate("/staff/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold">{moduleInfo?.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{moduleInfo?.description}</p>
      </header>

      <div className="px-5 space-y-6">
        {pages.map((page, i) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-4"
          >
            <h3 className="font-semibold mb-2">{page.title}</h3>
            {renderPage(page)}
          </motion.div>
        ))}

        {hasQuiz && (
          <Button className="w-full" onClick={() => navigate(`/staff/modules/${id}/quiz`)}>
            <Play className="mr-2 h-4 w-4" /> Take quiz
          </Button>
        )}

        {!hasQuiz && pages.length > 0 && (
          <Button
            className="w-full"
            onClick={async () => {
              if (user && id) {
                await supabase.from("staff_module_progress").upsert(
                  { user_id: user.id, module_id: id, status: "completed" as any, updated_at: new Date().toISOString() },
                  { onConflict: "user_id,module_id" }
                );
                toast({ title: "Module completed! ✅" });
                navigate("/staff/dashboard");
              }
            }}
          >
            Mark as completed
          </Button>
        )}
      </div>
    </div>
  );
};

export default StaffModuleDetail;
