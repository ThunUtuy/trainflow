import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, LogOut, Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EstablishmentItem {
  establishment_id: string;
  name: string;
}

const StaffSelectEstablishment = () => {
  const navigate = useNavigate();
  const { user, profile, refetch, signOut } = useAuthContext();
  const [establishments, setEstablishments] = useState<EstablishmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("staff_establishments")
        .select("establishment_id, establishments(name)")
        .eq("user_id", user.id);

      const items: EstablishmentItem[] = (data || []).map((row: any) => ({
        establishment_id: row.establishment_id,
        name: row.establishments?.name || "Unknown",
      }));
      setEstablishments(items);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSelect = async (establishmentId: string) => {
    if (!user) return;
    setSwitching(establishmentId);
    await supabase
      .from("profiles")
      .update({ establishment_id: establishmentId })
      .eq("user_id", user.id);
    refetch();
    navigate("/staff/dashboard");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center">
          <Store className="mx-auto h-10 w-10 text-primary mb-3" />
          <h1 className="text-2xl font-bold">Your restaurants</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose which restaurant to view</p>
        </div>

        <div className="space-y-3">
          {establishments.map((est, i) => (
            <motion.button
              key={est.establishment_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(est.establishment_id)}
              disabled={switching !== null}
              className={`glass-card w-full rounded-xl p-5 text-center transition-shadow hover:shadow-lg ${
                switching === est.establishment_id ? "opacity-60" : ""
              } ${
                profile?.establishment_id === est.establishment_id
                  ? "border-l-[3px] border-l-primary"
                  : ""
              }`}
            >
              <p className="text-lg font-semibold">{est.name}</p>
              {profile?.establishment_id === est.establishment_id && (
                <p className="text-xs text-primary mt-0.5">Currently active</p>
              )}
            </motion.button>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/staff/setup")}
        >
          <Plus className="mr-2 h-4 w-4" /> Join another restaurant
        </Button>

        <Button variant="ghost" className="w-full text-muted-foreground" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </motion.div>
    </div>
  );
};

export default StaffSelectEstablishment;
