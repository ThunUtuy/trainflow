import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import microlearningIntroImg from "@/assets/onboarding/microlearning-intro.png";
import brainChunksImg from "@/assets/onboarding/brain-chunks.png";
import stackedCardsImg from "@/assets/onboarding/stacked-cards.png";

const STORAGE_KEY = "manager_microlearning_onboarding_seen";

const cards = [
  {
    image: microlearningIntroImg,
    title: "What is Microlearning?",
    lines: [
      "Microlearning delivers training in short,",
      "focused lessons instead of long manuals.",
      "Each lesson teaches one simple idea",
      "and can be completed in just a few minutes.",
    ],
  },
  {
    image: brainChunksImg,
    title: "Why Short Lessons Work Better",
    lines: [
      "People remember information better",
      "when it is delivered in small chunks.",
      "Short lessons reduce information overload",
      "and are easier to learn on mobile devices.",
    ],
    footnote: "Based on learning science research.",
  },
  {
    image: stackedCardsImg,
    title: "How to Create Good Microlearning",
    lines: [
      "Good training modules are short and focused.",
    ],
    bullets: [
      "One idea per screen",
      "Simple language",
      "Short videos (under 2 minutes)",
    ],
    bulletLabel: "Best practice:",
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 260 : -260, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -260 : 260, opacity: 0 }),
};

export function shouldShowOnboarding(): boolean {
  return !localStorage.getItem(STORAGE_KEY);
}

export function markOnboardingSeen(): void {
  localStorage.setItem(STORAGE_KEY, "true");
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const ManagerMicrolearningOnboarding = ({ open, onClose }: Props) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!open) return null;

  const isLast = current === cards.length - 1;

  const goNext = () => {
    if (isLast) {
      markOnboardingSeen();
      onClose();
      return;
    }
    setDirection(1);
    setCurrent((p) => p + 1);
  };

  const skip = () => {
    markOnboardingSeen();
    onClose();
  };

  const card = cards[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-5"
    >
      <div className="relative w-full max-w-sm rounded-2xl border bg-card shadow-lg overflow-hidden">
        {/* Skip button */}
        <button
          onClick={skip}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Skip"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 flex flex-col items-center">
          {/* Image */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center w-full"
            >
              <div className="w-48 h-36 flex items-center justify-center mb-5">
                <img
                  src={card.image}
                  alt={card.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-center mb-3">{card.title}</h2>

              {/* Body */}
              <div className="text-center space-y-0.5 mb-1">
                {card.lines.map((line, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>

              {/* Bullets */}
              {card.bulletLabel && (
                <div className="mt-3 w-full">
                  <p className="text-sm font-medium mb-1.5">{card.bulletLabel}</p>
                  <ul className="space-y-1">
                    {card.bullets?.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footnote */}
              {card.footnote && (
                <p className="text-xs text-muted-foreground/70 mt-3 italic">
                  {card.footnote}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dots & Next */}
          <div className="flex items-center justify-between w-full mt-6">
            <div className="flex gap-1.5">
              {cards.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button size="sm" onClick={goNext}>
              {isLast ? "Got it" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerMicrolearningOnboarding;
