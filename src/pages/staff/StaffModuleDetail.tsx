import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import MicrolearningIntro from "@/components/microlearning/MicrolearningIntro";
import MicrolearningCard from "@/components/microlearning/MicrolearningCard";
import MicrolearningProgress from "@/components/microlearning/MicrolearningProgress";
import MicrolearningComplete from "@/components/microlearning/MicrolearningComplete";

interface ModulePage {
  id: string;
  type: string;
  title: string;
  content: any;
  sort_order: number;
}

type Phase = "intro" | "cards" | "complete";

const StaffModuleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [moduleInfo, setModuleInfo] = useState<{ title: string; description: string } | null>(null);
  const [pages, setPages] = useState<ModulePage[]>([]);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("intro");
  const [cardIndex, setCardIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const [modRes, pagesRes, quizRes] = await Promise.all([
        supabase.from("modules").select("title, description").eq("id", id).single(),
        supabase.from("module_pages").select("*").eq("module_id", id).order("sort_order"),
        supabase.from("quizzes").select("id").eq("module_id", id).limit(1),
      ]);
      setModuleInfo(modRes.data);
      setPages((pagesRes.data as ModulePage[]) || []);
      setHasQuiz((quizRes.data?.length ?? 0) > 0);
      setLoading(false);

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
    fetchData();
  }, [id, user]);

  const goNext = useCallback(() => {
    if (cardIndex < pages.length - 1) {
      setDirection(1);
      setCardIndex((i) => i + 1);
    } else {
      // Last card — go to quiz or complete
      if (hasQuiz) {
        navigate(`/staff/modules/${id}/quiz`);
      } else {
        setPhase("complete");
      }
    }
  }, [cardIndex, pages.length, hasQuiz, id, navigate]);

  const goBack = useCallback(() => {
    if (cardIndex > 0) {
      setDirection(-1);
      setCardIndex((i) => i - 1);
    }
  }, [cardIndex]);

  const handleComplete = async () => {
    if (user && id) {
      await supabase.from("staff_module_progress").upsert(
        { user_id: user.id, module_id: id, status: "completed" as any, updated_at: new Date().toISOString() },
        { onConflict: "user_id,module_id" }
      );
      toast({ title: "Module completed! ✅" });
      navigate("/staff/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header — always visible */}
      <header className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          onClick={() => {
            if (phase === "cards" && cardIndex === 0) {
              setPhase("intro");
            } else if (phase === "cards") {
              goBack();
            } else {
              navigate("/staff/dashboard");
            }
          }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        {phase === "cards" && (
          <div className="flex-1">
            <MicrolearningProgress current={cardIndex + 1} total={pages.length} />
          </div>
        )}
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center px-5">
        {phase === "intro" && moduleInfo && (
          <MicrolearningIntro
            title={moduleInfo.title}
            description={moduleInfo.description}
            totalCards={pages.length}
            onStart={() => {
              setCardIndex(0);
              setDirection(1);
              setPhase("cards");
            }}
          />
        )}

        {phase === "cards" && pages.length > 0 && (
          <>
            <div className="flex-1 flex items-center justify-center overflow-hidden max-w-full">
              <AnimatePresence mode="wait" custom={direction}>
                <MicrolearningCard
                  key={pages[cardIndex].id}
                  page={pages[cardIndex]}
                  direction={direction}
                />
              </AnimatePresence>
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between gap-3 py-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                disabled={cardIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button onClick={goNext} className="flex-1 max-w-[200px]">
                {cardIndex === pages.length - 1
                  ? hasQuiz
                    ? <>Take quiz <Play className="ml-2 h-4 w-4" /></>
                    : "Finish"
                  : <>Next <ChevronRight className="ml-1 h-4 w-4" /></>}
              </Button>

              <div className="w-10" /> {/* spacer for symmetry */}
            </div>
          </>
        )}

        {phase === "complete" && moduleInfo && (
          <MicrolearningComplete
            title={moduleInfo.title}
            onReview={() => {
              setCardIndex(0);
              setDirection(1);
              setPhase("cards");
            }}
            onContinue={handleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default StaffModuleDetail;
