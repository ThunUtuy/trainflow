import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Question {
  id: string;
  question_text: string;
  type: string;
  options: string[];
  correct_answers: number[];
  sort_order: number;
}

const StaffQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data: quiz } = await supabase.from("quizzes").select("id").eq("module_id", id).limit(1).single();
      if (!quiz) { setLoading(false); return; }
      setQuizId(quiz.id);
      const { data: qs } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quiz.id).order("sort_order");
      setQuestions((qs as Question[]) || []);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-muted-foreground">No questions in this quiz yet.</p>
      </div>
    );
  }

  const q = questions[current];
  const isMulti = q?.type === "multi_choice";

  const toggleOption = (idx: number) => {
    if (submitted) return;
    if (isMulti) {
      setSelected((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
    } else {
      setSelected([idx]);
    }
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected([]);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      let correct = 0;
      newAnswers.forEach((ans, i) => {
        const ca = questions[i].correct_answers;
        if (JSON.stringify([...ans].sort()) === JSON.stringify([...ca].sort())) correct++;
      });
      setScore(correct);
      setSubmitted(true);

      // Confetti on pass
      const pct = Math.round((correct / questions.length) * 100);
      if (pct >= 70) {
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 }, colors: ["#e8772e", "#2d9f6f", "#f5a623"] });
        }, 300);
      }

      if (user && quizId) {
        const saveResults = async () => {
          await supabase.from("staff_quiz_attempts").insert({
            user_id: user.id,
            quiz_id: quizId,
            score: correct,
            total: questions.length,
            answers: newAnswers,
          });
          if (correct / questions.length >= 0.7 && id) {
            await supabase.from("staff_module_progress").upsert(
              { user_id: user.id, module_id: id, status: "completed" as any, updated_at: new Date().toISOString() },
              { onConflict: "user_id,module_id" }
            );
          }
        };
        saveResults();
      }
    }
  };

  if (submitted) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center space-y-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            {passed
              ? <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
              : <motion.div animate={{ x: [0, -8, 8, -8, 8, 0] }} transition={{ duration: 0.5 }}>
                  <XCircle className="mx-auto h-16 w-16 text-destructive" />
                </motion.div>
            }
          </motion.div>
          <h1 className="text-2xl font-bold">{passed ? "Great job!" : "Keep trying!"}</h1>
          <p className="text-3xl font-bold text-primary">{score}/{questions.length}</p>
          <p className="text-muted-foreground">{pct}% — {passed ? "You passed!" : "You need 70% to pass."}</p>
          <Button className="w-full" onClick={() => navigate("/staff/dashboard")}>Back to dashboard</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-10">
      <button onClick={() => navigate(`/staff/modules/${id}`)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to module
      </button>

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">Question {current + 1} of {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={cn("h-1.5 w-6 rounded-full transition-colors", i <= current ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
      </div>

      <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
        <h2 className="text-lg font-semibold">{q.question_text}</h2>
        {isMulti && <p className="text-xs text-muted-foreground">Select all that apply</p>}

        <div className="grid gap-2">
          {q.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleOption(idx)}
              className={cn(
                "rounded-xl border p-4 text-left text-sm transition-all",
                selected.includes(idx)
                  ? "border-primary bg-primary/10 font-medium"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        <Button className="w-full" onClick={nextQuestion} disabled={selected.length === 0}>
          {current < questions.length - 1 ? "Next" : "Finish"}
        </Button>
      </motion.div>
    </div>
  );
};

export default StaffQuiz;
