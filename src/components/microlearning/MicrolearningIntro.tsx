import { Button } from "@/components/ui/button";
import { Clock, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface MicrolearningIntroProps {
  title: string;
  description?: string;
  totalCards: number;
  onStart: () => void;
}

const MicrolearningIntro = ({ title, description, totalCards, onStart }: MicrolearningIntroProps) => {
  const estimatedMinutes = Math.max(1, Math.ceil(totalCards * 0.5));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
    >
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <Layers className="h-10 w-10 text-primary" />
      </div>

      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
      )}

      <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {estimatedMinutes} min
        </span>
        <span className="flex items-center gap-1.5">
          <Layers className="h-4 w-4" />
          {totalCards} quick steps
        </span>
      </div>

      <Button size="lg" onClick={onStart} className="px-10">
        Start
      </Button>
    </motion.div>
  );
};

export default MicrolearningIntro;
