import { useState } from "react";
import { motion } from "framer-motion";
import { Lead, PipelineStage, TeamMember } from "@/types/crm";
import PipelineCard from "./PipelineCard";

interface PipelineColumnProps {
  stage: PipelineStage;
  label: string;
  color: string;
  leads: Lead[];
  total: number;
  index: number;
  getTeamMember: (memberId: string | null) => TeamMember | null;
  onDrop: (leadId: string, newStage: PipelineStage) => Promise<void>;
  onOpenNotes: (lead: Lead) => void;
  onOpenFollowup: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onOpenDetails: (lead: Lead) => void;
}

const PipelineColumn = ({
  stage,
  label,
  color,
  leads,
  total,
  index,
  getTeamMember,
  onDrop,
  onOpenNotes,
  onOpenFollowup,
  onDeleteLead,
  onOpenDetails,
}: PipelineColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) {
      await onDrop(leadId, stage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`w-72 flex-shrink-0 rounded-xl border transition-colors ${
        isDragOver 
          ? "border-primary bg-primary/5" 
          : "border-border bg-card/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            <span className="font-medium text-sm">{label}</span>
          </div>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {leads.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Total: <span className="font-medium text-foreground">{formatCurrency(total)}</span>
        </p>
      </div>

      {/* Cards */}
      <div className="p-2 space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
        {leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs">
            Arraste leads para cá
          </div>
        ) : (
          leads.map((lead, cardIndex) => (
            <PipelineCard
              key={lead.id}
              lead={lead}
              teamMember={getTeamMember(lead.assigned_to)}
              index={cardIndex}
              onOpenNotes={() => onOpenNotes(lead)}
              onOpenFollowup={() => onOpenFollowup(lead)}
              onDelete={() => onDeleteLead(lead)}
              onOpenDetails={() => onOpenDetails(lead)}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default PipelineColumn;
