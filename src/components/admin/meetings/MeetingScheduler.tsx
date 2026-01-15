import { useState } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Video, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lead, TeamMember } from "@/types/crm";

interface MeetingSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  teamMembers: TeamMember[];
  onSchedule: (data: {
    leadId: string;
    date: Date;
    type: "video" | "presencial" | "phone";
    notes?: string;
    assignedTo?: string;
  }) => Promise<void>;
}

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00"
];

const MeetingScheduler = ({
  open,
  onOpenChange,
  lead,
  teamMembers,
  onSchedule,
}: MeetingSchedulerProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("10:00");
  const [type, setType] = useState<"video" | "presencial" | "phone">("video");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const closers = teamMembers.filter((m) => m.role === "closer" && m.is_active);

  const handleSchedule = async () => {
    if (!lead || !date) return;

    setLoading(true);
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const meetingDate = setMinutes(setHours(date, hours), minutes);

      await onSchedule({
        leadId: lead.id,
        date: meetingDate,
        type,
        notes: notes || undefined,
        assignedTo: assignedTo || undefined,
      });

      // Reset form
      setDate(undefined);
      setTime("10:00");
      setType("video");
      setNotes("");
      setAssignedTo("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
    }
    setLoading(false);
  };

  const getTypeIcon = (meetingType: string) => {
    switch (meetingType) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "presencial":
        return <MapPin className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Agendar Reunião
          </DialogTitle>
          <DialogDescription>
            {lead ? `Agendar reunião com ${lead.name}` : "Selecione um lead para agendar"}
          </DialogDescription>
        </DialogHeader>

        {lead && (
          <div className="space-y-5">
            {/* Lead Info */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium">{lead.name}</p>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
              {lead.value > 0 && (
                <p className="text-sm text-emerald font-medium mt-1">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(lead.value)}
                </p>
              )}
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Data da Reunião</Label>
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
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label>Horário</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {time}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Type */}
            <div className="space-y-2">
              <Label>Tipo de Reunião</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as "video" | "presencial" | "phone")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                    <Video className="h-4 w-4" />
                    Vídeo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="presencial" id="presencial" />
                  <Label htmlFor="presencial" className="flex items-center gap-2 cursor-pointer">
                    <MapPin className="h-4 w-4" />
                    Presencial
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Assign Closer */}
            {closers.length > 0 && (
              <div className="space-y-2">
                <Label>Atribuir Closer (opcional)</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um closer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {closers.map((closer) => (
                      <SelectItem key={closer.id} value={closer.id}>
                        {closer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre a reunião..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSchedule} disabled={!date || !lead || loading}>
            {loading ? "Agendando..." : "Agendar Reunião"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingScheduler;
