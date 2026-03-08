import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ClipboardCheck, CheckCircle2 } from "lucide-react";

type QuestionType = "single_choice" | "multi_choice" | "true_false";

interface QuizQuestion {
  id: string;
  quiz_id: string;
  type: QuestionType;
  question_text: string;
  options: string[];
  correct_answers: number[];
  sort_order: number;
}

interface Quiz {
  id: string;
  module_id: string;
  title: string;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: "Single Choice",
  multi_choice: "Multi Choice",
  true_false: "True / False",
};

export const QuizEditor = ({ moduleId }: { moduleId: string }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = async () => {
    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("module_id", moduleId)
      .maybeSingle();

    if (quizData) {
      setQuiz(quizData as Quiz);
      const { data: qData } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizData.id)
        .order("sort_order");
      setQuestions(
        (qData || []).map((q: any) => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : [],
          correct_answers: Array.isArray(q.correct_answers) ? q.correct_answers : [],
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuiz();
  }, [moduleId]);

  const createQuiz = async () => {
    const { data } = await supabase
      .from("quizzes")
      .insert({ module_id: moduleId, title: "Quiz" })
      .select("*")
      .single();
    if (data) {
      setQuiz(data as Quiz);
      toast({ title: "Quiz created!" });
    }
  };

  const deleteQuiz = async () => {
    if (!quiz) return;
    await supabase.from("quiz_questions").delete().eq("quiz_id", quiz.id);
    await supabase.from("quizzes").delete().eq("id", quiz.id);
    setQuiz(null);
    setQuestions([]);
    toast({ title: "Quiz deleted" });
  };

  const updateQuizTitle = async (title: string) => {
    if (!quiz) return;
    setQuiz({ ...quiz, title });
    await supabase.from("quizzes").update({ title }).eq("id", quiz.id);
  };

  const addQuestion = async (type: QuestionType) => {
    if (!quiz) return;
    const defaultOptions = type === "true_false" ? ["True", "False"] : ["Option 1", "Option 2"];
    const { data } = await supabase
      .from("quiz_questions")
      .insert({
        quiz_id: quiz.id,
        type,
        question_text: "",
        options: defaultOptions,
        correct_answers: [0],
        sort_order: questions.length,
      })
      .select("*")
      .single();
    if (data) {
      setQuestions([
        ...questions,
        {
          ...data,
          options: Array.isArray(data.options) ? data.options : [],
          correct_answers: Array.isArray(data.correct_answers) ? data.correct_answers : [],
        } as QuizQuestion,
      ]);
    }
  };

  const updateQuestion = async (qId: string, field: string, value: any) => {
    setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, [field]: value } : q)));
    await supabase.from("quiz_questions").update({ [field]: value }).eq("id", qId);
  };

  const deleteQuestion = async (qId: string) => {
    await supabase.from("quiz_questions").delete().eq("id", qId);
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
    toast({ title: "Question deleted" });
  };

  const toggleCorrectAnswer = (question: QuizQuestion, idx: number) => {
    let newCorrect: number[];
    if (question.type === "single_choice" || question.type === "true_false") {
      newCorrect = [idx];
    } else {
      newCorrect = question.correct_answers.includes(idx)
        ? question.correct_answers.filter((i) => i !== idx)
        : [...question.correct_answers, idx];
    }
    updateQuestion(question.id, "correct_answers", newCorrect);
  };

  const updateOption = (question: QuizQuestion, idx: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[idx] = value;
    updateQuestion(question.id, "options", newOptions);
  };

  const addOption = (question: QuizQuestion) => {
    const newOptions = [...question.options, `Option ${question.options.length + 1}`];
    updateQuestion(question.id, "options", newOptions);
  };

  const removeOption = (question: QuizQuestion, idx: number) => {
    const newOptions = question.options.filter((_, i) => i !== idx);
    const newCorrect = question.correct_answers
      .filter((i) => i !== idx)
      .map((i) => (i > idx ? i - 1 : i));
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id ? { ...q, options: newOptions, correct_answers: newCorrect } : q
      )
    );
    supabase.from("quiz_questions").update({ options: newOptions, correct_answers: newCorrect }).eq("id", question.id);
  };

  if (loading) return null;

  return (
    <div className="mt-8">
      <Separator className="mb-6" />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          Assessment Quiz
        </h2>
        {!quiz ? (
          <Button variant="outline" size="sm" onClick={createQuiz} className="gap-1">
            <Plus className="h-4 w-4" /> Add Quiz
          </Button>
        ) : (
          <ConfirmDeleteDialog
            trigger={
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-1">
                <Trash2 className="h-4 w-4" /> Remove Quiz
              </Button>
            }
            title="Remove quiz?"
            description="This will delete the quiz and all its questions permanently."
            onConfirm={deleteQuiz}
          />
        )}
      </div>

      {!quiz ? (
        <p className="text-center text-muted-foreground py-6 text-sm">
          No quiz yet. Add one to test understanding after the module.
        </p>
      ) : (
        <div className="space-y-4">
          <div>
            <Label>Quiz title</Label>
            <Input
              value={quiz.title}
              onChange={(e) => updateQuizTitle(e.target.value)}
            />
          </div>

          <AnimatePresence>
            {questions.map((q, qIdx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Q{qIdx + 1} · {QUESTION_TYPE_LABELS[q.type]}
                  </span>
                  <ConfirmDeleteDialog
                    trigger={
                      <button className="p-1 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    }
                    title="Delete question?"
                    description="This question will be permanently removed."
                    onConfirm={() => deleteQuestion(q.id)}
                  />
                </div>

                {/* Type selector */}
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                  {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const newOptions = type === "true_false" ? ["True", "False"] : q.options;
                        updateQuestion(q.id, "type", type);
                        if (type === "true_false") {
                          updateQuestion(q.id, "options", ["True", "False"]);
                        }
                        updateQuestion(q.id, "correct_answers", []);
                      }}
                      className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                        q.type === type
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {QUESTION_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>

                {/* Question text */}
                <Input
                  placeholder="Enter your question..."
                  value={q.question_text}
                  onChange={(e) => updateQuestion(q.id, "question_text", e.target.value)}
                />

                {/* Options */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    {q.type === "single_choice" || q.type === "true_false"
                      ? "Click to mark the correct answer"
                      : "Click to mark all correct answers"}
                  </Label>
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCorrectAnswer(q, idx)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          q.correct_answers.includes(idx)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 hover:border-primary/50"
                        }`}
                      >
                        {q.correct_answers.includes(idx) && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </button>
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(q, idx, e.target.value)}
                        disabled={q.type === "true_false"}
                        className="flex-1"
                      />
                      {q.type !== "true_false" && q.options.length > 2 && (
                        <button
                          onClick={() => removeOption(q, idx)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {q.type !== "true_false" && q.options.length < 6 && (
                    <Button variant="ghost" size="sm" onClick={() => addOption(q)} className="gap-1 text-xs">
                      <Plus className="h-3 w-3" /> Add option
                    </Button>
                  )}
                  {q.correct_answers.length === 0 && (
                    <p className="text-xs text-destructive font-medium flex items-center gap-1 bg-destructive/10 rounded-md px-2 py-1.5">
                      ⚠ You must mark at least one correct answer
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add question buttons */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addQuestion(type)}
                className="gap-1 text-xs"
              >
                <Plus className="h-3 w-3" /> {QUESTION_TYPE_LABELS[type]}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
