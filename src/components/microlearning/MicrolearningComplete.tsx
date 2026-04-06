import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface MicrolearningCompleteProps {
  title: string;
  onReview: () => void;
  onContinue: () => void;
}

const MicrolearningComplete = ({ title, onReview, onContinue }: MicrolearningCompleteProps) => {
  useEffect(() => {
    const end = Date.now() + 600;
    const burst = () => {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#e8772e", "#2d9f6f", "#f5a623", "#4a90d9"],
      });
      if (Date.now() < end) requestAnimationFrame(burst);
    };
    burst();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.15, stiffness: 200 }}
        className="mb-6"
      >
        <CheckCircle2 className="h-20 w-20 text-primary" strokeWidth={1.5} />
      </motion.div>

      <h1 className="text-2xl font-bold mb-1">Module Complete</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        You've finished <span className="font-medium text-foreground">{title}</span>
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={onContinue} size="lg">
          <ArrowRight className="mr-2 h-4 w-4" /> Continue
        </Button>
        <Button variant="outline" onClick={onReview} size="lg">
          <RotateCcw className="mr-2 h-4 w-4" /> Review module
        </Button>
      </div>
    </motion.div>
  );
};

export default MicrolearningComplete;
