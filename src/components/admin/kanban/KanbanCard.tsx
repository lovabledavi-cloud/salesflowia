import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Clock, MessageSquare, Trash2 } from "lucide-react";
import { format, isToday, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: string;
  notes: string | null;
  created_at: string;
  next_followup_date: string | null;
}

interface KanbanCardProps {
  lead: Lead;
  onOpenNotes: (lead: Lead) => void;
  onOpenFollowup: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  isDragging?: boolean;
}

const KanbanCard = ({ lead, onOpenNotes, onOpenFollowup, onDeleteLead, isDragging }: KanbanCardProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM", { locale: ptBR });
  };

  const formatWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned;
  };

  const getFollowupStatus = () => {
    if (!lead.next_followup_date) return null;
    
    const followupDate = new Date(lead.next_followup_date);
    
    if (isPast(followupDate) && !isToday(followupDate)) {
      return { type: "overdue", label: "Atrasado" };
    }
    if (isToday(followupDate)) {
      return { type: "today", label: "Hoje" };
    }
    return { type: "upcoming", label: formatDate(lead.next_followup_date) };
  };

  const followupStatus = getFollowupStatus();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`
        bg-card border border-border rounded-lg p-4 cursor-grab active:cursor-grabbing
        transition-shadow hover:shadow-lg
        ${isDragging ? "shadow-xl ring-2 ring-emerald/50" : ""}
      `}
      draggable
      data-lead-id={lead.id}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-muted">
            <User className="w-3 h-3 text-muted-foreground" />
          </div>
          <span className="font-medium text-foreground text-sm truncate max-w-[120px]">
            {lead.name}
          </span>
        </div>
        {followupStatus && (
          <Badge
            variant="outline"
            className={`text-xs ${
              followupStatus.type === "overdue"
                ? "bg-red-500/10 text-red-500 border-red-500/20"
                : followupStatus.type === "today"
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
            }`}
          >
            <Clock className="w-2.5 h-2.5 mr-1" />
            {followupStatus.label}
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>Criado em {formatDate(lead.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <a
          href={`https://wa.me/${formatWhatsApp(lead.whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-emerald/10 text-emerald hover:bg-emerald/20 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="w-3 h-3" />
        </a>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onOpenFollowup(lead);
          }}
        >
          <Clock className="w-3 h-3 mr-1" />
          Follow-up
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onOpenNotes(lead);
          }}
        >
          <MessageSquare className="w-3 h-3" />
          {lead.notes && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteLead(lead);
          }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
};

export default KanbanCard;
