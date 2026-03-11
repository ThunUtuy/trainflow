import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { staffId } = await req.json();
    if (!staffId) {
      return new Response(JSON.stringify({ error: "Missing staffId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [{ data: isManager, error: roleError }, { data: managerProfile, error: profileError }] = await Promise.all([
      serviceClient.rpc("has_role", { _user_id: user.id, _role: "manager" }),
      serviceClient.from("profiles").select("establishment_id").eq("user_id", user.id).maybeSingle(),
    ]);

    if (roleError || profileError || !isManager || !managerProfile?.establishment_id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (staffId === user.id) {
      return new Response(JSON.stringify({ error: "You cannot remove yourself" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: staffProfile, error: staffError } = await serviceClient
      .from("profiles")
      .select("user_id, establishment_id")
      .eq("user_id", staffId)
      .maybeSingle();

    if (staffError || !staffProfile) {
      return new Response(JSON.stringify({ error: "Staff member not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (staffProfile.establishment_id !== managerProfile.establishment_id) {
      return new Response(JSON.stringify({ error: "Staff member is not in your establishment" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [playlistDelete, moduleDelete, profileUpdate] = await Promise.all([
      serviceClient.from("staff_playlist_assignments").delete().eq("user_id", staffId),
      serviceClient.from("staff_module_assignments").delete().eq("user_id", staffId),
      serviceClient.from("profiles").update({ establishment_id: null }).eq("user_id", staffId),
    ]);

    const dbError = playlistDelete.error || moduleDelete.error || profileUpdate.error;
    if (dbError) {
      throw dbError;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
