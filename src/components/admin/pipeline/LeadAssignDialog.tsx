import { useState } from "react";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lead, TeamMember, ROLE_CONFIG } from "@/types/crm";

interface LeadAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  teamMembers: TeamMember[];
  onAssign: (leadId: string, teamMemberId: string | null) => Promise<void>;
}

const LeadAssignDialog = ({
  open,
  onOpenChange,
  lead,
  teamMembers,
  onAssign,
}: LeadAssignDialogProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeMembers = teamMembers.filter((m) => m.is_active);
  
  const filteredMembers = activeMembers.filter((m) => {
    if (!searchQuery) return true;
    return m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sdrs = filteredMembers.filter((m) => m.role === "sdr");
  const closers = filteredMembers.filter((m) => m.role === "closer");

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && lead) {
      setSelectedMemberId(lead.assigned_to || "");
      setSearchQuery("");
    }
    onOpenChange(isOpen);
  };

  const handleAssign = async () => {
    if (!lead) return;

    setLoading(true);
    try {
      await onAssign(lead.id, selectedMemberId || null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning lead:", error);
    }
    setLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderMemberOption = (member: TeamMember) => {
    const roleConfig = ROLE_CONFIG[member.role];
    const isSelected = selectedMemberId === member.id;

    return (
      <button
        key={member.id}
        type="button"
        onClick={() => setSelectedMemberId(member.id)}
        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
          isSelected 
            ? "border-primary bg-primary/10" 
            : "border-transparent hover:bg-muted/50"
        }`}
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={member.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <p className="font-medium text-sm">{member.name}</p>
          <p className="text-xs text-muted-foreground">{member.email}</p>
        </div>
        <Badge variant="outline" className={roleConfig.color}>
          {roleConfig.label}
        </Badge>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Atribuir Lead
          </DialogTitle>
          <DialogDescription>
            {lead ? `Selecione um membro da equipe para ${lead.name}` : "Selecione um membro"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lead Info */}
          {lead && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="font-medium text-sm">{lead.name}</p>
              <p className="text-xs text-muted-foreground">{lead.email}</p>
              {lead.value > 0 && (
                <p className="text-xs text-emerald font-medium mt-1">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(lead.value)}
                </p>
              )}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar membro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Team Members List */}
          <ScrollArea className="h-[280px] pr-3">
            <div className="space-y-4">
              {/* Option to unassign */}
              <button
                type="button"
                onClick={() => setSelectedMemberId("")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  selectedMemberId === "" 
                    ? "border-primary bg-primary/10" 
                    : "border-transparent hover:bg-muted/50"
                }`}
              >
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">Não atribuído</p>
                  <p className="text-xs text-muted-foreground">Remover atribuição</p>
                </div>
              </button>

              {/* SDRs */}
              {sdrs.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    SDRs ({sdrs.length})
                  </p>
                  <div className="space-y-1">
                    {sdrs.map(renderMemberOption)}
                  </div>
                </div>
              )}

              {/* Closers */}
              {closers.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    Closers ({closers.length})
                  </p>
                  <div className="space-y-1">
                    {closers.map(renderMemberOption)}
                  </div>
                </div>
              )}

              {filteredMembers.length === 0 && searchQuery && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhum membro encontrado
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={loading}>
            {loading ? "Atribuindo..." : "Atribuir Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadAssignDialog;
