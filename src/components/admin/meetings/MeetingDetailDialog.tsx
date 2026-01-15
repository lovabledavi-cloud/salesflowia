import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Video,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lead, TeamMember } from "@/types/crm";

interface MeetingDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  teamMember: TeamMember | null;
  onMarkCompleted: (completed: boolean) => void;
  onMarkNoShow: (noShow: boolean) => void;
  onOpenNotes: () => void;
}

const MeetingDetailDialog = ({
  open,
  onOpenChange,
  lead,
  teamMember,
  onMarkCompleted,
  onMarkNoShow,
  onOpenNotes,
}: MeetingDetailDialogProps) => {
  if (!lead) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = () => {
    if (lead.no_show) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          No-Show
        </Badge>
      );
    }
    if (lead.meeting_completed) {
      return (
        <Badge className="bg-emerald text-white gap-1">
          <CheckCircle className="h-3 w-3" />
          Realizada
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" />
        Pendente
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Detalhes da Reunião
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie os detalhes da reunião
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex justify-center">{getStatusBadge()}</div>

          {/* Lead Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(lead.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{lead.name}</h3>
                {lead.value > 0 && (
                  <p className="text-emerald font-medium">
                    {formatCurrency(lead.value)}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                {lead.email}
              </a>
              <a
                href={`https://wa.me/55${lead.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                {lead.whatsapp}
              </a>
            </div>
          </div>

          {/* Meeting Details */}
          {lead.meeting_date && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Data e Hora
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {format(new Date(lead.meeting_date), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    {format(new Date(lead.meeting_date), "HH:mm", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Team Member */}
          {teamMember && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Responsável
              </h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={teamMember.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-violet/10 text-violet">
                    {getInitials(teamMember.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{teamMember.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {teamMember.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Observações
              </h4>
              <p className="text-sm bg-muted/50 rounded-lg p-3">{lead.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onOpenNotes} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Notas
          </Button>

          {!lead.meeting_completed && !lead.no_show && (
            <>
              <Button
                variant="outline"
                onClick={() => onMarkNoShow(true)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <XCircle className="h-4 w-4" />
                No-Show
              </Button>
              <Button
                onClick={() => onMarkCompleted(true)}
                className="gap-2 bg-emerald hover:bg-emerald/90"
              >
                <CheckCircle className="h-4 w-4" />
                Realizada
              </Button>
            </>
          )}

          {(lead.meeting_completed || lead.no_show) && (
            <Button
              variant="outline"
              onClick={() => {
                onMarkCompleted(false);
                onMarkNoShow(false);
              }}
            >
              Resetar Status
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDetailDialog;
