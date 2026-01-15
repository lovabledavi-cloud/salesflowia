import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface LostReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
}

const COMMON_REASONS = [
  "Preço alto",
  "Escolheu concorrente",
  "Sem orçamento no momento",
  "Não respondeu mais",
  "Projeto cancelado",
  "Fora do perfil",
];

const LostReasonDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: LostReasonDialogProps) => {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleQuickReason = (quickReason: string) => {
    setReason(quickReason);
  };

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setSaving(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Motivo da Perda</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Motivos comuns</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_REASONS.map((commonReason) => (
                <Button
                  key={commonReason}
                  type="button"
                  variant={reason === commonReason ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickReason(commonReason)}
                  className="text-xs"
                >
                  {commonReason}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Ou descreva o motivo</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Por que este lead foi perdido?"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={saving || !reason.trim()}
            variant="destructive"
          >
            {saving ? "Salvando..." : "Confirmar Perda"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LostReasonDialog;
