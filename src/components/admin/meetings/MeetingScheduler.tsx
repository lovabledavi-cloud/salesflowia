import { useState, useMemo } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Video, MapPin, Phone, Search, User, ChevronDown } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  const [leadSelectorOpen, setLeadSelectorOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("10:00");
  const [type, setType] = useState<"video" | "presencial" | "phone">("video");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const closers = teamMembers.filter((m) => m.role === "closer" && m.is_active);

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    if (!leadSearch) return leads.slice(0, 50); // Limit initial display
    const search = leadSearch.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.whatsapp.includes(search)
    ).slice(0, 50);
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
      setLeadSelectorOpen(!preSelectedLead);
      setDate(undefined);
      setTime("10:00");
      setType("video");
      setNotes("");
      setAssignedTo("");
    }
    onOpenChange(isOpen);
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setLeadSelectorOpen(false);
    setLeadSearch("");
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
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Agendar Reunião
          </DialogTitle>
          <DialogDescription>
            Selecione um lead e agende uma reunião
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-4 pb-2 pr-4">
            {/* Lead Selection - Collapsible */}
            <div className="space-y-2">
              <Label>Lead *</Label>
              
              {/* Selected Lead Display */}
              {selectedLead && !leadSelectorOpen && (
                <div 
                  className="bg-primary/5 border border-primary/20 rounded-lg p-3 cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => setLeadSelectorOpen(true)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{selectedLead.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedLead.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Alterar
                    </Button>
                  </div>
                </div>
              )}

              {/* Lead Selector - Collapsible */}
              <Collapsible open={leadSelectorOpen || !selectedLead} onOpenChange={setLeadSelectorOpen}>
                <CollapsibleContent className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, email ou telefone..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <ScrollArea className="h-[140px]">
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
                              onClick={() => handleSelectLead(lead.id)}
                              className={cn(
                                "w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors",
                                selectedLead?.id === lead.id && "bg-primary/10 border-l-2 border-l-primary"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm truncate">{lead.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                                </div>
                                {lead.value > 0 && (
                                  <span className="text-xs text-emerald font-medium ml-2 flex-shrink-0">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                      minimumFractionDigits: 0,
                                    }).format(lead.value)}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    {leads.length > 50 && !leadSearch && (
                      <div className="px-3 py-1.5 bg-muted/30 text-xs text-muted-foreground text-center border-t">
                        Mostrando 50 de {leads.length} leads. Use a busca para filtrar.
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Date and Time - Side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Data *</Label>
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
                      {date ? format(date, "dd/MM/yy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
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
                  <SelectContent className="z-50">
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  <Label htmlFor="video" className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <Video className="h-3.5 w-3.5" />
                    Vídeo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <Phone className="h-3.5 w-3.5" />
                    Telefone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="presencial" id="presencial" />
                  <Label htmlFor="presencial" className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <MapPin className="h-3.5 w-3.5" />
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
                  <SelectContent className="z-50">
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
                className="min-h-[70px] resize-none"
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-4 border-t">
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
