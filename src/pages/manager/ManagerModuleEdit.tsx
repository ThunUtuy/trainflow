import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, GripVertical, Upload, ImageIcon } from "lucide-react";

type PageType = "text" | "image" | "video" | "checklist";

interface ModulePage {
  id: string;
  type: PageType;
  title: string;
  content: any;
  sort_order: number;
}

const ManagerModuleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromRole = searchParams.get("from") === "role";
  const roleId = searchParams.get("roleId");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [pages, setPages] = useState<ModulePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

  const handleImageUpload = async (pageId: string, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 200MB.", variant: "destructive" });
      return;
    }
    setUploading(pageId);
    const ext = file.name.split(".").pop();
    const filePath = `${id}/${pageId}.${ext}`;
    const { error } = await supabase.storage.from("module-images").upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(null);
      return;
    }
    const { data: urlData } = supabase.storage.from("module-images").getPublicUrl(filePath);
    const page = pages.find((p) => p.id === pageId);
    await updatePage(pageId, "content", { ...page?.content, url: urlData.publicUrl });
    setUploading(null);
    toast({ title: "Image uploaded!" });
  };

  const handleVideoUpload = async (pageId: string, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 200MB.", variant: "destructive" });
      return;
    }
    setUploading(pageId);
    const ext = file.name.split(".").pop();
    const filePath = `${id}/${pageId}.${ext}`;
    const { error } = await supabase.storage.from("module-videos").upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(null);
      return;
    }
    const { data: urlData } = supabase.storage.from("module-videos").getPublicUrl(filePath);
    const page = pages.find((p) => p.id === pageId);
    await updatePage(pageId, "content", { ...page?.content, url: urlData.publicUrl });
    setUploading(null);
    toast({ title: "Video uploaded!" });
  };

  const fetchData = async () => {
    if (!id) return;
    const [modRes, pagesRes] = await Promise.all([
      supabase.from("modules").select("title, description").eq("id", id).single(),
      supabase.from("module_pages").select("*").eq("module_id", id).order("sort_order"),
    ]);
    setModuleTitle(modRes.data?.title || "");
    setModuleDesc(modRes.data?.description || "");
    setPages((pagesRes.data as ModulePage[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const saveModule = async () => {
    if (!id) return;
    await supabase.from("modules").update({ title: moduleTitle, description: moduleDesc }).eq("id", id);
    toast({ title: "Module saved!" });
  };

  const addPage = async (type: string) => {
    if (!id) return;
    const pageType = type as PageType;
    const defaultContent = pageType === "checklist" ? { items: [""] } : pageType === "text" ? { text: "" } : { text: "", url: "" };
    const { data } = await supabase
      .from("module_pages")
      .insert({ module_id: id, type: pageType, title: "Untitled", content: defaultContent, sort_order: pages.length })
      .select("*")
      .single();
    if (data) setPages([...pages, data as ModulePage]);
  };

  const updatePage = async (pageId: string, field: string, value: any) => {
    setPages(pages.map((p) => p.id === pageId ? { ...p, [field]: value } : p));
    await supabase.from("module_pages").update({ [field]: value }).eq("id", pageId);
  };

  const deletePage = async (pageId: string) => {
    await supabase.from("module_pages").delete().eq("id", pageId);
    setPages(pages.filter((p) => p.id !== pageId));
    toast({ title: "Page deleted" });
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-10">
      <button onClick={() => navigate(fromRole && roleId ? `/manager/groups/${roleId}` : "/manager/modules")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> {fromRole ? "Back to role" : "Back to modules"}
      </button>

      <div className="space-y-3 mb-6">
        <div>
          <Label>Module title</Label>
          <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} onBlur={saveModule} />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={moduleDesc} onChange={(e) => setModuleDesc(e.target.value)} onBlur={saveModule} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Pages</h2>
        <Popover open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add page
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1" align="end">
            {["text", "image", "video", "checklist"].map((type) => (
              <button
                key={type}
                className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent capitalize"
                onClick={() => { addPage(type); setAddMenuOpen(false); }}
              >
                {type}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs uppercase text-muted-foreground font-medium">{page.type}</span>
              </div>
              <ConfirmDeleteDialog
                trigger={<button className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>}
                title="Delete page?"
                description="This page will be permanently removed."
                onConfirm={() => deletePage(page.id)}
              />
            </div>

            <Input
              placeholder="Page title"
              value={page.title}
              onChange={(e) => updatePage(page.id, "title", e.target.value)}
            />

            {(page.type === "text") && (
              <Textarea
                placeholder="Enter text content..."
                value={page.content?.text || ""}
                onChange={(e) => updatePage(page.id, "content", { ...page.content, text: e.target.value })}
                rows={4}
              />
            )}

            {page.type === "image" && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Description text..."
                  value={page.content?.text || ""}
                  onChange={(e) => updatePage(page.id, "content", { ...page.content, text: e.target.value })}
                  rows={2}
                />
                {page.content?.url && (
                  <img src={page.content.url} alt={page.title} className="rounded-lg w-full max-h-48 object-cover" />
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    disabled={uploading === page.id}
                    onClick={() => document.getElementById(`upload-${page.id}`)?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading === page.id ? "Uploading..." : page.content?.url ? "Replace image" : "Upload image"}
                  </Button>
                  <input
                    id={`upload-${page.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(page.id, file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            )}

            {page.type === "video" && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Description text..."
                  value={page.content?.text || ""}
                  onChange={(e) => updatePage(page.id, "content", { ...page.content, text: e.target.value })}
                  rows={2}
                />
                {page.content?.url && (
                  <video src={page.content.url} controls className="rounded-lg w-full max-h-48" />
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    disabled={uploading === page.id}
                    onClick={() => document.getElementById(`upload-video-${page.id}`)?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading === page.id ? "Uploading..." : page.content?.url ? "Replace video" : "Upload video"}
                  </Button>
                  <input
                    id={`upload-video-${page.id}`}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoUpload(page.id, file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            )}

            {page.type === "checklist" && (
              <div className="space-y-2">
                {(page.content?.items || []).map((item: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const items = [...(page.content?.items || [])];
                        items[idx] = e.target.value;
                        updatePage(page.id, "content", { items });
                      }}
                      placeholder={`Item ${idx + 1}`}
                    />
                    <button
                      onClick={() => {
                        const items = (page.content?.items || []).filter((_: string, i: number) => i !== idx);
                        updatePage(page.id, "content", { items });
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const items = [...(page.content?.items || []), ""];
                    updatePage(page.id, "content", { items });
                  }}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add item
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {pages.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No pages yet. Add one using the button above.</p>
      )}
    </div>
  );
};

export default ManagerModuleEdit;
