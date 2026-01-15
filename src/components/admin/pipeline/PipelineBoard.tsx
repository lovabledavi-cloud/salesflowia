import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lead, PipelineStage, PIPELINE_STAGES, TeamMember } from "@/types/crm";
import PipelineColumn from "./PipelineColumn";
import LostReasonDialog from "./LostReasonDialog";

interface PipelineBoardProps {
  leads: Lead[];
  teamMembers: TeamMember[];
  onStageChange: (leadId: string, newStage: PipelineStage, lostReason?: string) => Promise<void>;
  onOpenNotes: (lead: Lead) => void;
  onOpenFollowup: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

const PipelineBoard = ({
  leads,
  teamMembers,
  onStageChange,
  onOpenNotes,
  onOpenFollowup,
  onDeleteLead,
}: PipelineBoardProps) => {
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

  const handleDrop = async (leadId: string, newStage: PipelineStage) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.pipeline_stage === newStage) return;

    if (newStage === "perdido") {
      setPendingMove({ leadId, newStage });
      setLostDialogOpen(true);
    } else {
      await onStageChange(leadId, newStage);
    }
  };

  const handleLostConfirm = async (reason: string) => {
    if (pendingMove) {
      await onStageChange(pendingMove.leadId, pendingMove.newStage, reason);
      setPendingMove(null);
    }
    setLostDialogOpen(false);
  };

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
            onDeleteLead={onDeleteLead}
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
