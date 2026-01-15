import { MessageSquare, Calendar, Trash2, Phone, Mail, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lead, TeamMember } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PipelineCardProps {
  lead: Lead;
  teamMember: TeamMember | null;
  index: number;
  onOpenNotes: () => void;
  onOpenFollowup: () => void;
  onDelete: () => void;
  onOpenDetails: () => void;
}

const PipelineCard = ({
  lead,
  teamMember,
  index,
  onOpenNotes,
  onOpenFollowup,
  onDelete,
  onOpenDetails,
}: PipelineCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDaysInStage = () => {
    const stageDate = lead.stage_changed_at || lead.created_at;
    return formatDistanceToNow(new Date(stageDate), { 
      locale: ptBR,
      addSuffix: false,
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("leadId", lead.id);
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
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{lead.name}</h4>
          {lead.value > 0 && (
            <p className="text-emerald font-semibold text-sm">
              {formatCurrency(lead.value)}
            </p>
          )}
        </div>
        {teamMember && (
          <Avatar className="h-6 w-6 ml-2 flex-shrink-0">
            <AvatarImage src={teamMember.avatar_url || undefined} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {getInitials(teamMember.name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Stage time badge */}
      <div className="flex items-center gap-1 mb-2">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">{getDaysInStage()}</span>
        {lead.meeting_scheduled && (
          <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-500 rounded">
            Reunião
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-1 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onOpenDetails}
          title="Ver detalhes"
        >
          <Eye className="h-3.5 w-3.5 text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          asChild
        >
          <a
            href={`https://wa.me/55${lead.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone className="h-3.5 w-3.5 text-emerald" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          asChild
        >
          <a href={`mailto:${lead.email}`}>
            <Mail className="h-3.5 w-3.5 text-blue-500" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onOpenNotes}
        >
          <MessageSquare className={`h-3.5 w-3.5 ${lead.notes ? "text-violet" : "text-muted-foreground"}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onOpenFollowup}
        >
          <Calendar className={`h-3.5 w-3.5 ${lead.next_followup_date ? "text-amber-500" : "text-muted-foreground"}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-auto"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default PipelineCard;
