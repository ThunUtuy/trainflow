import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShieldCheck, User } from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6 text-center"
      >
        <div>
          <h1 className="text-2xl font-bold">I am a...</h1>
          <p className="mt-1 text-muted-foreground">Choose your role to continue</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => navigate("/signup?role=manager")}
            className="flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Manager</p>
              <p className="text-sm text-muted-foreground">Create modules, manage your team</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/signup?role=staff")}
            className="flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <User className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold">Staff</p>
              <p className="text-sm text-muted-foreground">Complete training & quizzes</p>
            </div>
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-primary underline">
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SelectRole;
