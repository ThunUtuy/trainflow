import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Loader2, Copy, RefreshCw } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Separator } from "@/components/ui/separator";

const ManagerSettings = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [codes, setCodes] = useState<{ code: string; used_by: string | null }[]>([]);

  const fetchCodes = async () => {
    if (!profile?.establishment_id) return;
    const { data } = await supabase
      .from("invite_codes")
      .select("code, used_by")
      .eq("establishment_id", profile.establishment_id)
      .order("created_at", { ascending: false })
      .limit(10);
    setCodes(data || []);
  };

  useEffect(() => {
    if (!profile?.establishment_id) return;
    const fetchAll = async () => {
      const { data } = await supabase
        .from("establishments")
        .select("name, description, image_url")
        .eq("id", profile.establishment_id!)
        .single();
      if (data) {
        setName(data.name);
        setDescription(data.description || "");
        setImageUrl(data.image_url || null);
      }
      await fetchCodes();
      setLoading(false);
    };
    fetchAll();
  }, [profile?.establishment_id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.establishment_id) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${profile.establishment_id}/logo.${ext}`;

    const { error } = await supabase.storage
      .from("establishment-images")
      .upload(path, file, { upsert: true });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("establishment-images")
      .getPublicUrl(path);

    setImageUrl(urlData.publicUrl + "?t=" + Date.now());
    setUploading(false);
  };

  const handleRemoveImage = () => setImageUrl(null);

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

  const handleSave = async () => {
    if (!profile?.establishment_id) return;
    setSaving(true);
    const { error } = await supabase
      .from("establishments")
      .update({
        name: name.trim(),
        description: description.trim() || null,
        image_url: imageUrl,
      })
      .eq("id", profile.establishment_id);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved ✓" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-5 pt-6 pb-4"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Restaurant name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your restaurant name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">About / Description</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell your staff about your restaurant..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Restaurant photo</Label>
          {imageUrl ? (
            <div className="relative w-full max-w-[200px]">
              <img
                src={imageUrl}
                alt="Restaurant"
                className="h-32 w-full rounded-xl object-cover border border-border"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex h-32 w-full max-w-[200px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Upload photo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        <Button onClick={handleSave} disabled={saving || !name.trim()} className="w-full">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save changes
        </Button>

        <Separator className="my-2" />

        {/* Invite codes section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Invite staff</h2>
            <p className="text-sm text-muted-foreground">Share a code with new team members.</p>
          </div>

          {(() => {
            const activeCode = codes.find((c) => !c.used_by);
            return activeCode ? (
              <div className="rounded-2xl bg-primary/10 p-6 text-center space-y-4">
                <p className="text-sm text-muted-foreground">Active invite code</p>
                <p className="text-4xl font-bold tracking-[0.3em] text-primary">{activeCode.code}</p>
                <Button variant="outline" onClick={() => copyCode(activeCode.code)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy code
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">No active invite codes.</p>
              </div>
            );
          })()}

          <Button className="w-full" variant="outline" onClick={generateCode}>
            <RefreshCw className="mr-2 h-4 w-4" /> Generate new code
          </Button>

          {codes.length > 0 && (
            <div>
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
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default ManagerSettings;
