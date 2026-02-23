import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const ManagerSetup = () => {
  const navigate = useNavigate();
  const { user, refetch } = useAuthContext();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data: est, error } = await supabase
      .from("establishments")
      .insert({ name, created_by: user.id, invite_code: inviteCode })
      .select("id")
      .single();

    if (error || !est) {
      toast({ title: "Failed to create establishment", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Link profile + create first invite code
    await Promise.all([
      supabase.from("profiles").update({ establishment_id: est.id }).eq("user_id", user.id),
      supabase.from("invite_codes").insert({ establishment_id: est.id, code: inviteCode }),
    ]);

    setLoading(false);
    toast({ title: "Establishment created! 🎉" });
    refetch();
    navigate("/manager/team");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleCreate}
        className="w-full max-w-sm space-y-5"
      >
        <button type="button" onClick={() => navigate("/manager/team")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div>
          <h1 className="text-2xl font-bold">Set up your establishment</h1>
          <p className="text-sm text-muted-foreground">Name your business to get started.</p>
        </div>

        <div>
          <Label htmlFor="name">Establishment name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Golden Spoon" required />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create establishment"}
        </Button>
      </motion.form>
    </div>
  );
};

export default ManagerSetup;
