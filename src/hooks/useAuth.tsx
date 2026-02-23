import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "manager" | "staff";

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: { name: string; establishment_id: string | null } | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    profile: null,
    loading: true,
  });

  const fetchUserData = useCallback(async (user: User) => {
    const [roleRes, profileRes] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("name, establishment_id").eq("user_id", user.id).maybeSingle(),
    ]);
    setState((prev) => ({
      ...prev,
      user,
      role: (roleRes.data?.role as AppRole) ?? null,
      profile: profileRes.data ?? null,
      loading: false,
    }));
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setState((prev) => ({ ...prev, session, user: session.user }));
          // Defer data fetch to avoid Supabase deadlock
          setTimeout(() => fetchUserData(session.user), 0);
        } else {
          setState({ user: null, session: null, role: null, profile: null, loading: false });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState((prev) => ({ ...prev, session, user: session.user }));
        fetchUserData(session.user);
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refetch = () => {
    if (state.user) fetchUserData(state.user);
  };

  return { ...state, signOut, refetch };
}
