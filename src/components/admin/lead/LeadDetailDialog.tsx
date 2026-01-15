import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lead, TeamMember, PIPELINE_STAGES, ROLE_CONFIG } from "@/types/crm";
import { 
  User, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  UserCheck,
  Users,
  Target,
  Loader2,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  teamMembers: TeamMember[];
  onSave: (leadId: string, data: Partial<Lead>) => Promise<void>;
}

const LeadDetailDialog = ({
  open,
  onOpenChange,
  lead,
  teamMembers,
  onSave,
}: LeadDetailDialogProps) => {
  const [saving, setSaving] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});

  useEffect(() => {
    if (lead) {
      setEditedLead({
        name: lead.name,
        email: lead.email,
        whatsapp: lead.whatsapp,
        value: lead.value,
        source: lead.source,
        notes: lead.notes,
        assigned_to: lead.assigned_to,
        created_by: lead.created_by,
        contacted_by: lead.contacted_by,
        meeting_scheduled_by: lead.meeting_scheduled_by,
        qualified_by: lead.qualified_by,
        closed_by: lead.closed_by,
        followup_by: lead.followup_by,
      });
    }
  }, [lead]);

  if (!lead) return null;

  const sdrs = teamMembers.filter((m) => m.role === "sdr" && m.is_active);
  const closers = teamMembers.filter((m) => m.role === "closer" && m.is_active);
  const allActive = teamMembers.filter((m) => m.is_active);

  const handleSave = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      await onSave(lead.id, editedLead);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getMemberName = (memberId: string | null) => {
    if (!memberId) return null;
    const member = teamMembers.find((m) => m.id === memberId);
    return member?.name || null;
  };

  const currentStage = PIPELINE_STAGES.find((s) => s.stage === lead.pipeline_stage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <span>Detalhes do Lead</span>
            </div>
            {currentStage && (
              <Badge className={`${currentStage.color} text-white`}>
                {currentStage.label}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="team">Responsáveis</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editedLead.name || ""}
                  onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={editedLead.email || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                  />
                  <Button variant="outline" size="icon" asChild>
                    <a href={`mailto:${lead.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="flex gap-2">
                  <Input
                    id="whatsapp"
                    value={editedLead.whatsapp || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, whatsapp: e.target.value.replace(/\D/g, "") })}
                  />
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://wa.me/55${lead.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Input
                  id="source"
                  value={editedLead.source || ""}
                  onChange={(e) => setEditedLead({ ...editedLead, source: e.target.value })}
                  placeholder="Ex: Google Ads, Indicação..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald" />
                Valor do Negócio
              </Label>
              <Input
                id="value"
                type="number"
                min={0}
                value={editedLead.value || 0}
                onChange={(e) => setEditedLead({ ...editedLead, value: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={editedLead.notes || ""}
                onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                placeholder="Observações sobre o lead..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Team Responsibilities Tab */}
          <TabsContent value="team" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SDR who captured the lead */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  SDR que Captou
                </Label>
                <Select
                  value={editedLead.created_by || "none"}
                  onValueChange={(value) => 
                    setEditedLead({ ...editedLead, created_by: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não definido</SelectItem>
                    {sdrs.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SDR who contacted */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  SDR que Contatou
                </Label>
                <Select
                  value={editedLead.contacted_by || "none"}
                  onValueChange={(value) => 
                    setEditedLead({ ...editedLead, contacted_by: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não definido</SelectItem>
                    {sdrs.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SDR who scheduled meeting */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-violet" />
                  SDR que Agendou Reunião
                </Label>
                <Select
                  value={editedLead.meeting_scheduled_by || "none"}
                  onValueChange={(value) => 
                    setEditedLead({ ...editedLead, meeting_scheduled_by: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não definido</SelectItem>
                    {sdrs.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SDR responsible for follow-up */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Responsável Follow-up
                </Label>
                <Select
                  value={editedLead.followup_by || "none"}
                  onValueChange={(value) => 
                    setEditedLead({ ...editedLead, followup_by: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não definido</SelectItem>
                    {allActive.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({ROLE_CONFIG[m.role].label})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Closer assigned */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald" />
                  Closer Responsável
                </Label>
                <Select
                  value={editedLead.assigned_to || "none"}
                  onValueChange={(value) => 
                    setEditedLead({ ...editedLead, assigned_to: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não definido</SelectItem>
                    {closers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Who qualified */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  Qualificado por
                </Label>
                <Select
                  value={editedLead.qualified_by || "none"}
                  onValueChange={(value) => 
                    setEditedLead({ ...editedLead, qualified_by: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não definido</SelectItem>
                    {allActive.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({ROLE_CONFIG[m.role].label})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Who closed */}
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald" />
                  Fechado por
                </Label>
                <Select
                  value={editedLead.closed_by || "none"}
                  onValueChange={(value) => 
                    setEditedLead({ ...editedLead, closed_by: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não definido</SelectItem>
                    {closers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Data de Cadastro</span>
                </div>
                <span className="text-sm font-medium">{formatDate(lead.created_at)}</span>
              </div>

              {lead.contacted_at && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Primeiro Contato</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatDate(lead.contacted_at)}</span>
                    {getMemberName(lead.contacted_by) && (
                      <p className="text-xs text-muted-foreground">por {getMemberName(lead.contacted_by)}</p>
                    )}
                  </div>
                </div>
              )}

              {lead.last_contact_date && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Último Contato</span>
                  </div>
                  <span className="text-sm font-medium">{formatDate(lead.last_contact_date)}</span>
                </div>
              )}

              {lead.meeting_date && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-violet" />
                    <span className="text-sm">Reunião Agendada</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatDate(lead.meeting_date)}</span>
                    {getMemberName(lead.meeting_scheduled_by) && (
                      <p className="text-xs text-muted-foreground">por {getMemberName(lead.meeting_scheduled_by)}</p>
                    )}
                  </div>
                </div>
              )}

              {lead.stage_changed_at && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Mudou para {currentStage?.label}</span>
                  </div>
                  <span className="text-sm font-medium">{formatDate(lead.stage_changed_at)}</span>
                </div>
              )}

              {lead.closed_at && (
                <div className="flex items-center justify-between p-3 bg-emerald/10 rounded-lg border border-emerald/20">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald" />
                    <span className="text-sm font-medium text-emerald">Venda Fechada</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatDate(lead.closed_at)}</span>
                    {getMemberName(lead.closed_by) && (
                      <p className="text-xs text-muted-foreground">por {getMemberName(lead.closed_by)}</p>
                    )}
                    <p className="text-sm font-semibold text-emerald">{formatCurrency(lead.value)}</p>
                  </div>
                </div>
              )}

              {lead.lost_reason && (
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-sm font-medium text-destructive mb-1">Motivo da Perda:</p>
                  <p className="text-sm text-muted-foreground">{lead.lost_reason}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;
