import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Filter } from "lucide-react";
import { Lead, PipelineStage, PIPELINE_STAGES, TeamMember } from "@/types/crm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PipelineColumn from "./PipelineColumn";
import LostReasonDialog from "./LostReasonDialog";
import LeadAssignDialog from "./LeadAssignDialog";

interface PipelineBoardProps {
  leads: Lead[];
  teamMembers: TeamMember[];
  onOpenNotes: (lead: Lead) => void;
  onOpenFollowup: (lead: Lead) => void;
  onOpenDetails: (lead: Lead) => void;
  onLeadUpdate?: () => void;
  // Role-based props
  currentUserRole?: "admin" | "manager" | "sdr" | "closer";
  currentTeamMemberId?: string | null;
}

const PipelineBoard = ({
  leads,
  teamMembers,
  onOpenNotes,
  onOpenFollowup,
  onOpenDetails,
  onLeadUpdate,
  currentUserRole,
  currentTeamMemberId,
}: PipelineBoardProps) => {
  const { toast } = useToast();
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ leadId: string; newStage: PipelineStage } | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [leadToAssign, setLeadToAssign] = useState<Lead | null>(null);
  const [memberFilter, setMemberFilter] = useState<string>("all");

  // Permission checks
  const isAdminOrManager = currentUserRole === "admin" || currentUserRole === "manager";
  const canAssignLeads = isAdminOrManager;
  const canSeeAllLeads = isAdminOrManager;

  // Filter leads based on role and selected filter
  const filteredLeads = useMemo(() => {
    let filtered = leads;

    // SDR/Closer can only see leads they work with
    if (!canSeeAllLeads && currentTeamMemberId) {
      if (currentUserRole === "sdr") {
        // SDR sees: leads they created, contacted, scheduled, or are assigned to them
        filtered = leads.filter((l) => 
          l.assigned_to === currentTeamMemberId ||
          l.created_by === currentTeamMemberId ||
          l.contacted_by === currentTeamMemberId ||
          l.meeting_scheduled_by === currentTeamMemberId
        );
      } else if (currentUserRole === "closer") {
        // Closer sees: leads assigned to them or that they closed
        filtered = leads.filter((l) => 
          l.assigned_to === currentTeamMemberId ||
          l.closed_by === currentTeamMemberId
        );
      } else {
        // Fallback: only assigned leads
        filtered = leads.filter((l) => l.assigned_to === currentTeamMemberId);
      }
    }

    // Apply member filter for admins/managers
    if (canSeeAllLeads && memberFilter !== "all") {
      if (memberFilter === "unassigned") {
        filtered = leads.filter((l) => !l.assigned_to);
      } else {
        filtered = leads.filter((l) => l.assigned_to === memberFilter);
      }
    }

    return filtered;
  }, [leads, canSeeAllLeads, currentTeamMemberId, memberFilter, currentUserRole]);

  // Get team members with leads count for filter
  const membersWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    leads.forEach((lead) => {
      if (lead.assigned_to) {
        counts.set(lead.assigned_to, (counts.get(lead.assigned_to) || 0) + 1);
      }
    });
    
    return teamMembers
      .filter((m) => m.is_active && (m.role === "sdr" || m.role === "closer"))
      .map((m) => ({
        ...m,
        leadCount: counts.get(m.id) || 0,
      }));
  }, [teamMembers, leads]);

  const unassignedCount = useMemo(() => {
    return leads.filter((l) => !l.assigned_to).length;
  }, [leads]);

  const leadsByStage = useMemo(() => {
    const grouped: Record<PipelineStage, Lead[]> = {
      novo: [],
      prospeccao: [],
      qualificado: [],
      negociacao: [],
      proposta: [],
      ganho: [],
      perdido: [],
    };

    filteredLeads.forEach((lead) => {
      const stage = lead.pipeline_stage || "novo";
      if (grouped[stage]) {
        grouped[stage].push(lead);
      }
    });

    // Sort by stage_changed_at or created_at
    Object.keys(grouped).forEach((stage) => {
      grouped[stage as PipelineStage].sort((a, b) => {
        const dateA = new Date(a.stage_changed_at || a.created_at).getTime();
        const dateB = new Date(b.stage_changed_at || b.created_at).getTime();
        return dateB - dateA;
      });
    });

    return grouped;
  }, [filteredLeads]);

  const stageTotals = useMemo(() => {
    const totals: Record<PipelineStage, number> = {
      novo: 0,
      prospeccao: 0,
      qualificado: 0,
      negociacao: 0,
      proposta: 0,
      ganho: 0,
      perdido: 0,
    };

    filteredLeads.forEach((lead) => {
      const stage = lead.pipeline_stage || "novo";
      totals[stage] += lead.value || 0;
    });

    return totals;
  }, [filteredLeads]);

  const handleStageChange = useCallback(async (leadId: string, newStage: PipelineStage, lostReason?: string) => {
    const updateData: Record<string, unknown> = {
      pipeline_stage: newStage,
      stage_changed_at: new Date().toISOString(),
    };

    if (newStage === "perdido" && lostReason) {
      updateData.lost_reason = lostReason;
      updateData.status = "perdido";
    }

    if (newStage === "ganho") {
      updateData.status = "convertido";
      updateData.closed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", leadId);

    if (error) {
      toast({
        title: "Erro ao atualizar estágio",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Estágio atualizado",
        description: "O lead foi movido com sucesso.",
      });
      onLeadUpdate?.();
    }
  }, [toast, onLeadUpdate]);

  const handleDrop = async (leadId: string, newStage: PipelineStage) => {
    const lead = filteredLeads.find((l) => l.id === leadId);
    if (!lead || lead.pipeline_stage === newStage) return;

    if (newStage === "perdido") {
      setPendingMove({ leadId, newStage });
      setLostDialogOpen(true);
    } else {
      await handleStageChange(leadId, newStage);
    }
  };

  const handleLostConfirm = async (reason: string) => {
    if (pendingMove) {
      await handleStageChange(pendingMove.leadId, pendingMove.newStage, reason);
      setPendingMove(null);
    }
    setLostDialogOpen(false);
  };

  const handleDeleteLead = useCallback(async (lead: Lead) => {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", lead.id);

    if (error) {
      toast({
        title: "Erro ao excluir lead",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Lead excluído",
        description: "O lead foi excluído com sucesso.",
      });
      onLeadUpdate?.();
    }
  }, [toast, onLeadUpdate]);

  const handleOpenAssign = (lead: Lead) => {
    setLeadToAssign(lead);
    setAssignDialogOpen(true);
  };

  const handleAssignLead = async (leadId: string, teamMemberId: string | null) => {
    const { error } = await supabase
      .from("leads")
      .update({ assigned_to: teamMemberId })
      .eq("id", leadId);

    if (error) {
      toast({
        title: "Erro ao atribuir lead",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Lead atribuído",
      description: teamMemberId 
        ? "O lead foi atribuído com sucesso." 
        : "A atribuição foi removida.",
    });
    onLeadUpdate?.();
  };

  const getTeamMember = (memberId: string | null) => {
    if (!memberId) return null;
    return teamMembers.find((m) => m.id === memberId) || null;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Filter bar - only for admins/managers */}
      {canSeeAllLeads && (
        <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filtrar por:</span>
          </div>
          
          <Select value={memberFilter} onValueChange={setMemberFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos os leads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Todos os leads</span>
                  <Badge variant="secondary" className="ml-auto">
                    {leads.length}
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="unassigned">
                <div className="flex items-center gap-2">
                  <span>Não atribuídos</span>
                  <Badge variant="outline" className="ml-auto">
                    {unassignedCount}
                  </Badge>
                </div>
              </SelectItem>
              {membersWithCounts.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="text-[9px]">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[100px]">{member.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {member.leadCount}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {memberFilter !== "all" && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMemberFilter("all")}
              className="text-xs"
            >
              Limpar filtro
            </Button>
          )}

          <div className="ml-auto text-sm text-muted-foreground">
            {filteredLeads.length} de {leads.length} leads
          </div>
        </div>
      )}

      {/* Pipeline columns */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {PIPELINE_STAGES.map((stageConfig, index) => (
            <PipelineColumn
              key={stageConfig.stage}
              stage={stageConfig.stage}
              label={stageConfig.label}
              color={stageConfig.color}
              leads={leadsByStage[stageConfig.stage]}
              total={stageTotals[stageConfig.stage]}
              index={index}
              getTeamMember={getTeamMember}
              onDrop={handleDrop}
              onOpenNotes={onOpenNotes}
              onOpenFollowup={onOpenFollowup}
              onDeleteLead={handleDeleteLead}
              onOpenDetails={onOpenDetails}
              onAssignLead={canAssignLeads ? handleOpenAssign : undefined}
              canAssign={canAssignLeads}
            />
          ))}
        </div>
      </div>

      <LostReasonDialog
        open={lostDialogOpen}
        onOpenChange={setLostDialogOpen}
        onConfirm={handleLostConfirm}
      />

      <LeadAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        lead={leadToAssign}
        teamMembers={teamMembers}
        onAssign={handleAssignLead}
      />
    </motion.div>
  );
};

export default PipelineBoard;