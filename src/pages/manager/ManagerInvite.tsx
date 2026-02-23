import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, RefreshCw } from "lucide-react";

const ManagerInvite = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [codes, setCodes] = useState<{ code: string; used_by: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCodes = async () => {
    if (!profile?.establishment_id) return;
    const { data } = await supabase
      .from("invite_codes")
      .select("code, used_by")
      .eq("establishment_id", profile.establishment_id)
      .order("created_at", { ascending: false })
      .limit(10);
    setCodes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, [profile]);

  const generateCode = async () => {
    if (!profile?.establishment_id) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await supabase.from("invite_codes").insert({ establishment_id: profile.establishment_id, code });
    toast({ title: "New code generated!" });
    fetchCodes();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Code copied!" });
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const activeCode = codes.find((c) => !c.used_by);

  return (
    <div className="min-h-screen px-5 pt-6 pb-20">
      <button onClick={() => navigate("/manager/team")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold mb-1">Invite staff</h1>
      <p className="text-sm text-muted-foreground mb-6">Share this code with new team members.</p>

      {activeCode ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-primary/10 p-6 text-center space-y-4"
        >
          <p className="text-sm text-muted-foreground">Active invite code</p>
          <p className="text-4xl font-bold tracking-[0.3em] text-primary">{activeCode.code}</p>
          <Button variant="outline" onClick={() => copyCode(activeCode.code)}>
            <Copy className="mr-2 h-4 w-4" /> Copy code
          </Button>
        </motion.div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <p className="text-muted-foreground">No active invite codes.</p>
        </div>
      )}

      <Button className="w-full mt-6" variant="outline" onClick={generateCode}>
        <RefreshCw className="mr-2 h-4 w-4" /> Generate new code
      </Button>

      {codes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent codes</h3>
          <div className="space-y-2">
            {codes.map((c) => (
              <div key={c.code} className="flex items-center justify-between rounded-lg border px-4 py-2 text-sm">
                <span className="font-mono tracking-wider">{c.code}</span>
                <span className={c.used_by ? "text-muted-foreground" : "text-success font-medium"}>
                  {c.used_by ? "Used" : "Active"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerInvite;
