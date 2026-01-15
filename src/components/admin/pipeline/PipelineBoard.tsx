import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Lead, PipelineStage, PIPELINE_STAGES, TeamMember } from "@/types/crm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PipelineColumn from "./PipelineColumn";
import LostReasonDialog from "./LostReasonDialog";

interface PipelineBoardProps {
  leads: Lead[];
  teamMembers: TeamMember[];
  onOpenNotes: (lead: Lead) => void;
  onOpenFollowup: (lead: Lead) => void;
  onLeadUpdate?: () => void;
}

const PipelineBoard = ({
  leads,
  teamMembers,
  onOpenNotes,
  onOpenFollowup,
  onLeadUpdate,
}: PipelineBoardProps) => {
  const { toast } = useToast();
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ leadId: string; newStage: PipelineStage } | null>(null);

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

    leads.forEach((lead) => {
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
  }, [leads]);

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

    leads.forEach((lead) => {
      const stage = lead.pipeline_stage || "novo";
      totals[stage] += lead.value || 0;
    });

    return totals;
  }, [leads]);

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
    const lead = leads.find((l) => l.id === leadId);
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

  const getTeamMember = (memberId: string | null) => {
    if (!memberId) return null;
    return teamMembers.find((m) => m.id === memberId) || null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto pb-4"
    >
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
          />
        ))}
      </div>

      <LostReasonDialog
        open={lostDialogOpen}
        onOpenChange={setLostDialogOpen}
        onConfirm={handleLostConfirm}
      />
    </motion.div>
  );
};

export default PipelineBoard;