import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full max-w-sm flex-col items-center gap-8 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <UtensilsCrossed className="h-10 w-10 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">TrainFlow</h1>
          <p className="mt-2 text-muted-foreground">
            Onboarding & training made simple for your hospitality team.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full text-base"
          onClick={() => navigate("/select-role")}
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
};

export default Welcome;
