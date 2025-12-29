import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, Calendar, User, Phone } from "lucide-react";
import { format, isToday, isPast, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: string;
  next_followup_date: string | null;
}

interface TodayFollowupsProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
}

const TodayFollowups = ({ leads, onSelectLead }: TodayFollowupsProps) => {
  const { todayFollowups, overdueFollowups, upcomingFollowups } = useMemo(() => {
    const today: Lead[] = [];
    const overdue: Lead[] = [];
    const upcoming: Lead[] = [];

    leads.forEach((lead) => {
      if (!lead.next_followup_date) return;
      
      const followupDate = new Date(lead.next_followup_date);
      
      if (isToday(followupDate)) {
        today.push(lead);
      } else if (isPast(followupDate)) {
        overdue.push(lead);
      } else if (isFuture(followupDate)) {
        // Próximos 3 dias
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        if (followupDate <= threeDaysFromNow) {
          upcoming.push(lead);
        }
      }
    });

    return {
      todayFollowups: today,
      overdueFollowups: overdue,
      upcomingFollowups: upcoming,
    };
  }, [leads]);

  const totalPending = todayFollowups.length + overdueFollowups.length;

  if (totalPending === 0 && upcomingFollowups.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Follow-ups Pendentes</h3>
                <p className="text-sm text-muted-foreground">
                  {totalPending} para hoje/atrasados, {upcomingFollowups.length} nos próximos dias
                </p>
              </div>
            </div>
            {overdueFollowups.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                {overdueFollowups.length} atrasado{overdueFollowups.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        <div className="divide-y divide-border max-h-64 overflow-y-auto">
          {/* Overdue */}
          {overdueFollowups.map((lead) => (
            <FollowupItem
              key={lead.id}
              lead={lead}
              type="overdue"
              onSelect={onSelectLead}
            />
          ))}

          {/* Today */}
          {todayFollowups.map((lead) => (
            <FollowupItem
              key={lead.id}
              lead={lead}
              type="today"
              onSelect={onSelectLead}
            />
          ))}

          {/* Upcoming */}
          {upcomingFollowups.map((lead) => (
            <FollowupItem
              key={lead.id}
              lead={lead}
              type="upcoming"
              onSelect={onSelectLead}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface FollowupItemProps {
  lead: Lead & { next_followup_date: string };
  type: "overdue" | "today" | "upcoming";
  onSelect: (leadId: string) => void;
}

const FollowupItem = ({ lead, type, onSelect }: FollowupItemProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case "overdue":
        return {
          badge: "bg-red-500/10 text-red-500 border-red-500/20",
          label: "Atrasado",
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

  return (
    <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-muted">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{lead.name}</p>
          <p className="text-sm text-muted-foreground">{lead.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

export default TodayFollowups;
