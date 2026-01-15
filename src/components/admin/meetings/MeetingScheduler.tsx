import { useState, useMemo } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Video, MapPin, Phone, Search } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lead, TeamMember } from "@/types/crm";

interface MeetingSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leads: Lead[];
  preSelectedLead?: Lead | null;
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
  leads,
  preSelectedLead,
  teamMembers,
  onSchedule,
}: MeetingSchedulerProps) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [leadSearch, setLeadSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("10:00");
  const [type, setType] = useState<"video" | "presencial" | "phone">("video");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const closers = teamMembers.filter((m) => m.role === "closer" && m.is_active);

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    if (!leadSearch) return leads;
    const search = leadSearch.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.whatsapp.includes(search)
    );
  }, [leads, leadSearch]);

  // Get currently selected lead
  const selectedLead = useMemo(() => {
    if (preSelectedLead && !selectedLeadId) {
      return preSelectedLead;
    }
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId, preSelectedLead]);

  // Reset form when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedLeadId(preSelectedLead?.id || "");
      setLeadSearch("");
      setDate(undefined);
      setTime("10:00");
      setType("video");
      setNotes("");
      setAssignedTo("");
    }
    onOpenChange(isOpen);
  };

  const handleSchedule = async () => {
    const leadToSchedule = selectedLead;
    if (!leadToSchedule || !date) return;

    setLoading(true);
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const meetingDate = setMinutes(setHours(date, hours), minutes);

      await onSchedule({
        leadId: leadToSchedule.id,
        date: meetingDate,
        type,
        notes: notes || undefined,
        assignedTo: assignedTo && assignedTo !== "none" ? assignedTo : undefined,
      });

      // Reset form
      setSelectedLeadId("");
      setLeadSearch("");
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Agendar Reunião
          </DialogTitle>
          <DialogDescription>
            Selecione um lead e agende uma reunião
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 pb-2">
            {/* Lead Selection */}
            <div className="space-y-2">
              <Label>Selecione o Lead *</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou telefone..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="border rounded-lg max-h-[180px] overflow-y-auto">
                  {filteredLeads.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      {leads.length === 0 
                        ? "Nenhum lead sem reunião agendada"
                        : "Nenhum lead encontrado"}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredLeads.map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() => setSelectedLeadId(lead.id)}
                          className={cn(
                            "w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors",
                            selectedLead?.id === lead.id && "bg-primary/10 border-l-2 border-l-primary"
                          )}
                        >
                          <p className="font-medium text-sm">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                          {lead.value > 0 && (
                            <p className="text-xs text-emerald font-medium">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(lead.value)}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Lead Info */}
            {selectedLead && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Lead selecionado:</p>
                <p className="font-medium">{selectedLead.name}</p>
                <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
              </div>
            )}

            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Data da Reunião *</Label>
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
              <Label>Horário *</Label>
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
                    <SelectItem value="none">Nenhum</SelectItem>
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
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSchedule} disabled={!date || !selectedLead || loading}>
            {loading ? "Agendando..." : "Agendar Reunião"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingScheduler;
