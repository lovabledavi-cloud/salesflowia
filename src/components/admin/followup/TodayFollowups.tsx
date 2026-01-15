import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, Calendar, User, Phone, CheckCircle2, CalendarCheck, Send, MessageCircle, AlertCircle } from "lucide-react";
import { format, isToday, isPast, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowupStatus, FOLLOWUP_STATUS_CONFIG } from "@/types/crm";
import FollowupStatusSelect from "./FollowupStatusSelect";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: string;
  next_followup_date: string | null;
  followup_notes?: string | null;
  followup_status?: FollowupStatus;
}

interface TodayFollowupsProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  onFollowupStatusChange?: (leadId: string, status: FollowupStatus) => Promise<void>;
}

const TodayFollowups = ({ leads, onSelectLead, onFollowupStatusChange }: TodayFollowupsProps) => {
  const { todayFollowups, overdueFollowups, upcomingFollowups, statusCounts } = useMemo(() => {
    const today: Lead[] = [];
    const overdue: Lead[] = [];
    const upcoming: Lead[] = [];
    const counts: Record<FollowupStatus, number> = {
      pendente: 0,
      enviado: 0,
      respondido: 0,
      sem_resposta: 0,
      concluido: 0,
    };

    leads.forEach((lead) => {
      // Count by status
      const followupStatus = lead.followup_status || 'pendente';
      counts[followupStatus]++;

      if (!lead.next_followup_date) return;
      
      const followupDate = new Date(lead.next_followup_date);
      
      if (isToday(followupDate)) {
        today.push(lead);
      } else if (isPast(followupDate)) {
        overdue.push(lead);
      } else if (isFuture(followupDate)) {
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        if (followupDate <= sevenDaysFromNow) {
          upcoming.push(lead);
        }
      }
    });

    // Sort by date
    overdue.sort((a, b) => 
      new Date(a.next_followup_date!).getTime() - new Date(b.next_followup_date!).getTime()
    );
    upcoming.sort((a, b) => 
      new Date(a.next_followup_date!).getTime() - new Date(b.next_followup_date!).getTime()
    );

    return {
      todayFollowups: today,
      overdueFollowups: overdue,
      upcomingFollowups: upcoming,
      statusCounts: counts,
    };
  }, [leads]);

  const totalPending = todayFollowups.length + overdueFollowups.length;

  // Date-based stats
  const dateStats = [
    {
      label: "Atrasados",
      value: overdueFollowups.length,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Para Hoje",
      value: todayFollowups.length,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Próximos 7 dias",
      value: upcomingFollowups.length,
      icon: CalendarCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Total Pendente",
      value: totalPending,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  // Status-based stats
  const statusStats = [
    {
      label: "Pendente",
      value: statusCounts.pendente,
      icon: Clock,
      color: "text-slate-400",
      bgColor: "bg-slate-500/10",
    },
    {
      label: "Enviado",
      value: statusCounts.enviado,
      icon: Send,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Respondido",
      value: statusCounts.respondido,
      icon: MessageCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Sem Resposta",
      value: statusCounts.sem_resposta,
      icon: AlertCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Concluído",
      value: statusCounts.concluido,
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
  ];

  if (totalPending === 0 && upcomingFollowups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Tudo em dia!
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          Não há follow-ups pendentes ou agendados para os próximos dias.
          Continue o ótimo trabalho!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date-based Stats Grid */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Por Data</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dateStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status-based Stats Grid */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Por Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statusStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Overdue Section */}
      {overdueFollowups.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Follow-ups Atrasados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                {overdueFollowups.map((lead) => (
                  <FollowupItem
                    key={lead.id}
                    lead={lead}
                    type="overdue"
                    onSelect={onSelectLead}
                    onStatusChange={onFollowupStatusChange}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Today Section */}
      {todayFollowups.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-500">
                <Clock className="w-5 h-5" />
                Para Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                {todayFollowups.map((lead) => (
                  <FollowupItem
                    key={lead.id}
                    lead={lead}
                    type="today"
                    onSelect={onSelectLead}
                    onStatusChange={onFollowupStatusChange}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upcoming Section */}
      {upcomingFollowups.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-500">
                <CalendarCheck className="w-5 h-5" />
                Próximos 7 dias
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                {upcomingFollowups.map((lead) => (
                  <FollowupItem
                    key={lead.id}
                    lead={lead}
                    type="upcoming"
                    onSelect={onSelectLead}
                    onStatusChange={onFollowupStatusChange}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

interface FollowupItemProps {
  lead: Lead & { next_followup_date: string };
  type: "overdue" | "today" | "upcoming";
  onSelect: (leadId: string) => void;
  onStatusChange?: (leadId: string, status: FollowupStatus) => Promise<void>;
}

const FollowupItem = ({ lead, type, onSelect, onStatusChange }: FollowupItemProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case "overdue":
        return {
          badge: "bg-destructive/10 text-destructive border-destructive/20",
          label: format(new Date(lead.next_followup_date), "dd/MM", { locale: ptBR }),
        };
      case "today":
        return {
          badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          label: "Hoje",
        };
      case "upcoming":
        return {
          badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          label: format(new Date(lead.next_followup_date), "dd/MM", { locale: ptBR }),
        };
    }
  };

  const styles = getTypeStyles();
  const currentStatus = lead.followup_status || 'pendente';

  const handleStatusChange = async (newStatus: FollowupStatus) => {
    if (onStatusChange) {
      await onStatusChange(lead.id, newStatus);
    }
  };

  return (
    <div className="py-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="p-2 rounded-full bg-muted shrink-0">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{lead.name}</p>
          <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
          {lead.followup_notes && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              "{lead.followup_notes}"
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {onStatusChange && (
          <FollowupStatusSelect
            status={currentStatus}
            onStatusChange={handleStatusChange}
          />
        )}
        <Badge variant="outline" className={styles.badge}>
          <Calendar className="w-3 h-3 mr-1" />
          {styles.label}
        </Badge>
        <a
          href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-emerald/10 text-emerald hover:bg-emerald/20 transition-colors"
        >
          <Phone className="w-4 h-4" />
        </a>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect(lead.id)}
        >
          Ver
        </Button>
      </div>
    </div>
  );
};

export default TodayFollowups;
