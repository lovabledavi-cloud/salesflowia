import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeadStatus } from "@/components/admin/LeadStatusBadge";
import KanbanCard from "./KanbanCard";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  next_followup_date: string | null;
}

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onOpenNotes: (lead: Lead) => void;
  onOpenFollowup: (lead: Lead) => void;
  onDrop: (leadId: string, newStatus: LeadStatus) => void;
}

const statusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
  novo: {
    label: "Novos",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  contactado: {
    label: "Contactados",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  convertido: {
    label: "Convertidos",
    color: "text-emerald",
    bgColor: "bg-emerald/10 border-emerald/20",
  },
  perdido: {
    label: "Perdidos",
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
};

const KanbanColumn = ({
  status,
  leads,
  onOpenNotes,
  onOpenFollowup,
  onDrop,
}: KanbanColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const config = statusConfig[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    columnRef.current?.classList.add("ring-2", "ring-emerald/50");
  };

  const handleDragLeave = () => {
    columnRef.current?.classList.remove("ring-2", "ring-emerald/50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    columnRef.current?.classList.remove("ring-2", "ring-emerald/50");
    
    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId) {
      onDrop(leadId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      ref={columnRef}
      className={`flex flex-col rounded-xl border ${config.bgColor} min-h-[400px] transition-all`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
          <span className={`text-sm font-medium ${config.color} bg-background/50 px-2 py-0.5 rounded-full`}>
            {leads.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-400px)]">
        <AnimatePresence mode="popLayout">
          {leads.map((lead) => (
            <motion.div
              key={lead.id}
              layout
              draggable
              onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, lead.id)}
            >
              <KanbanCard
                lead={lead}
                onOpenNotes={onOpenNotes}
                onOpenFollowup={onOpenFollowup}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {leads.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
            Nenhum lead
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
