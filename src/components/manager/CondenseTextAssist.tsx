import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowLeft, Check, Pencil, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CondenseTextAssistProps {
  open: boolean;
  onClose: () => void;
  originalText: string;
  onAccept: (text: string) => void;
  charLimit?: number;
}

const CondenseTextAssist = ({ open, onClose, originalText, onAccept, charLimit = 150 }: CondenseTextAssistProps) => {
  const [condensed, setCondensed] = useState("");
  const [editedCondensed, setEditedCondensed] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("condensed");

  useEffect(() => {
    if (open && originalText) {
      setIsEditing(false);
      setActiveTab("condensed");
      setCondensed("");
      setEditedCondensed("");
      condenseWithAI();
    }
  }, [open, originalText, charLimit]);

  const condenseWithAI = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("condense-text", {
        body: { text: originalText, charLimit },
      });

      if (error) throw error;

      const result = data?.condensed || originalText.slice(0, charLimit - 3) + "...";
      setCondensed(result);
      setEditedCondensed(result);
    } catch (e: any) {
      console.error("Condense error:", e);
      toast({
        title: "Couldn't condense text",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
      // Fallback to simple truncation
      const fallback = originalText.slice(0, charLimit - 3).trim() + "...";
      setCondensed(fallback);
      setEditedCondensed(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCondensed = isEditing ? editedCondensed : condensed;
  const condensedLen = currentCondensed.length;
  const isWithinLimit = condensedLen <= charLimit;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Condense Text
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Compare your original with a shorter version. Edit or accept.
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-5">
          <TabsList className="w-full">
            <TabsTrigger value="original" className="flex-1 text-xs">Original</TabsTrigger>
            <TabsTrigger value="condensed" className="flex-1 text-xs">
              ✨ Condensed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="original" className="mt-3">
            <div className="rounded-lg border bg-muted/30 p-3 min-h-[120px]">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{originalText}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {originalText.length} characters
            </p>
          </TabsContent>

          <TabsContent value="condensed" className="mt-3">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-primary/20 bg-primary/5 p-3 min-h-[120px] flex items-center justify-center"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Condensing with AI...
                  </div>
                </motion.div>
              ) : isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Textarea
                    value={editedCondensed}
                    onChange={(e) => setEditedCondensed(e.target.value)}
                    rows={4}
                    className="text-sm"
                    autoFocus
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-primary/20 bg-primary/5 p-3 min-h-[120px]"
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{condensed}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!isLoading && (
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${isWithinLimit ? "text-green-600" : "text-warning"}`}>
                  {condensedLen} / {charLimit} characters
                  {isWithinLimit && " ✓"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1 h-7"
                  onClick={() => {
                    if (isEditing) {
                      setCondensed(editedCondensed);
                    }
                    setIsEditing(!isEditing);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                  {isEditing ? "Done editing" : "Edit"}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="px-5 pb-5 pt-4 flex-row gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={onClose}>
            <ArrowLeft className="h-3 w-3" />
            Keep original
          </Button>
          <Button size="sm" className="flex-1 gap-1" disabled={isLoading} onClick={() => onAccept(currentCondensed)}>
            <Check className="h-3 w-3" />
            Use condensed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CondenseTextAssist;
