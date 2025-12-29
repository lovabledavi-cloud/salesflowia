import { useMemo } from "react";
import { motion } from "framer-motion";
import { LeadStatus } from "@/components/admin/LeadStatusBadge";
import KanbanColumn from "./KanbanColumn";

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

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onOpenNotes: (lead: Lead) => void;
  onOpenFollowup: (lead: Lead) => void;
}

const statuses: LeadStatus[] = ["novo", "contactado", "convertido", "perdido"];

const KanbanBoard = ({
  leads,
  onStatusChange,
  onOpenNotes,
  onOpenFollowup,
}: KanbanBoardProps) => {
  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      novo: [],
      contactado: [],
      convertido: [],
      perdido: [],
    };

    leads.forEach((lead) => {
      if (grouped[lead.status]) {
        grouped[lead.status].push(lead);
      }
    });

    // Ordenar por data de criação (mais recente primeiro)
    Object.keys(grouped).forEach((status) => {
      grouped[status as LeadStatus].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return grouped;
  }, [leads]);

  const handleDrop = async (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead && lead.status !== newStatus) {
      await onStatusChange(leadId, newStatus);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statuses.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          leads={leadsByStatus[status]}
          onOpenNotes={onOpenNotes}
          onOpenFollowup={onOpenFollowup}
          onDrop={handleDrop}
        />
      ))}
    </motion.div>
  );
};

export default KanbanBoard;
