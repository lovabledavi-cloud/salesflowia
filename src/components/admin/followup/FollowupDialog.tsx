import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FollowupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadName: string;
  currentFollowupDate: string | null;
  currentFollowupNotes: string | null;
  onSave: (date: Date | null, notes: string) => Promise<void>;
}

const FollowupDialog = ({
  open,
  onOpenChange,
  leadName,
  currentFollowupDate,
  currentFollowupNotes,
  onSave,
}: FollowupDialogProps) => {
  const [date, setDate] = useState<Date | undefined>(
    currentFollowupDate ? new Date(currentFollowupDate) : undefined
  );
  const [notes, setNotes] = useState(currentFollowupNotes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(date || null, notes);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setSaving(true);
    try {
      await onSave(null, "");
      setDate(undefined);
      setNotes("");
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  // Quick date options
  const quickDates = [
    { label: "Amanhã", days: 1 },
    { label: "Em 3 dias", days: 3 },
    { label: "Em 1 semana", days: 7 },
    { label: "Em 2 semanas", days: 14 },
  ];

  const setQuickDate = (days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald" />
            Agendar Follow-up
          </DialogTitle>
          <DialogDescription>
            Defina a data do próximo contato com <strong>{leadName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quick dates */}
          <div className="flex flex-wrap gap-2">
            {quickDates.map((option) => (
              <Button
                key={option.days}
                variant="outline"
                size="sm"
                onClick={() => setQuickDate(option.days)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Date picker */}
          <div className="space-y-2">
            <Label>Data do Follow-up</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notas do Follow-up</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Ligar às 14h, perguntar sobre o orçamento..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {(currentFollowupDate || currentFollowupNotes) && (
            <Button
              variant="ghost"
              onClick={handleClear}
              disabled={saving}
              className="text-destructive hover:text-destructive"
            >
              Limpar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald hover:bg-emerald/90"
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FollowupDialog;
