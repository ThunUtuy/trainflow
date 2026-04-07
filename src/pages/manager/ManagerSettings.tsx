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
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const ManagerSettings = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!profile?.establishment_id) return;
    const fetch = async () => {
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
      setLoading(false);
    };
    fetch();
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
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default ManagerSettings;
