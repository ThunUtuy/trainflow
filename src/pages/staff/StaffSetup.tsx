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

const StaffSetup = () => {
  const navigate = useNavigate();
  const { user, refetch } = useAuthContext();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    // Find unused invite code
    const { data: invite, error: findErr } = await supabase
      .from("invite_codes")
      .select("id, establishment_id")
      .eq("code", code.trim().toUpperCase())
      .is("used_by", null)
      .maybeSingle();

    if (findErr || !invite) {
      toast({ title: "Invalid or used invite code", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Claim invite code, update profile, and add to staff_establishments
    const [claimRes, profileRes, membershipRes] = await Promise.all([
      supabase.from("invite_codes").update({ used_by: user.id, used_at: new Date().toISOString() }).eq("id", invite.id),
      supabase.from("profiles").update({ establishment_id: invite.establishment_id }).eq("user_id", user.id),
      supabase.from("staff_establishments").insert({ user_id: user.id, establishment_id: invite.establishment_id }),
    ]);

    setLoading(false);
    if (claimRes.error || profileRes.error || membershipRes.error) {
      toast({ title: "Failed to join. Try again.", variant: "destructive" });
    } else {
      toast({ title: "You're in! 🎉" });
      refetch();
      navigate("/staff/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleJoin}
        className="w-full max-w-sm space-y-5"
      >
        <button type="button" onClick={() => navigate("/staff/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div>
          <h1 className="text-2xl font-bold">Join your team</h1>
          <p className="text-sm text-muted-foreground">Enter the code your manager gave you.</p>
        </div>

        <div>
          <Label htmlFor="code">Invite code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. ABC123"
            className="text-center text-lg tracking-widest uppercase"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Joining..." : "Join establishment"}
        </Button>
      </motion.form>
    </div>
  );
};

export default StaffSetup;
