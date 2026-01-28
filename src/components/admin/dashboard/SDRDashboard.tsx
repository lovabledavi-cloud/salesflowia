import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  Phone,
  MessageSquare,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Lead, TeamMember, Goal } from "@/types/crm";
import { isToday, isPast, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import EnhancedGoalCard from "./EnhancedGoalCard";

interface SDRDashboardProps {
  leads: Lead[];
  teamMember: TeamMember | null;
  allLeads: Lead[];
  goal?: Goal | null;
  onOpenFollowup?: (lead: Lead) => void;
  onOpenNotes?: (lead: Lead) => void;
}

const SDRDashboard = ({
  leads,
  teamMember,
  allLeads,
  goal,
  onOpenFollowup,
  onOpenNotes,
}: SDRDashboardProps) => {
  const stats = useMemo(() => {
    // Leads created by this SDR
    const leadsCreated = allLeads.filter(
      (l) => l.created_by === teamMember?.id
    ).length;

    // Leads contacted by this SDR
    const leadsContacted = allLeads.filter(
      (l) => l.contacted_by === teamMember?.id
    ).length;

    // Meetings scheduled by this SDR
    const meetingsScheduled = allLeads.filter(
      (l) => l.meeting_scheduled_by === teamMember?.id
    ).length;

    // Meetings scheduled today
    const meetingsToday = allLeads.filter(
      (l) =>
        l.meeting_scheduled_by === teamMember?.id &&
        l.meeting_date &&
        isToday(new Date(l.meeting_date))
    ).length;

    // Pending follow-ups
    const pendingFollowups = leads.filter((l) => {
      if (!l.next_followup_date) return false;
      const date = new Date(l.next_followup_date);
      return isToday(date) || isPast(date);
    }).length;

    // Today's follow-ups
    const todayFollowups = leads.filter((l) => {
      if (!l.next_followup_date) return false;
      return isToday(new Date(l.next_followup_date));
    });

    // Qualified leads by this SDR
    const qualifiedLeads = allLeads.filter(
      (l) => l.qualified_by === teamMember?.id
    ).length;

    return {
      leadsCreated,
      leadsContacted,
      meetingsScheduled,
      meetingsToday,
      pendingFollowups,
      todayFollowups,
      qualifiedLeads,
    };
  }, [leads, allLeads, teamMember]);

  const goalProgress = useMemo(() => {
    if (!goal) return null;

    const leadsProgress = goal.leads_goal > 0
      ? (stats.leadsCreated / goal.leads_goal) * 100
      : 0;
    const contactsProgress = goal.contacts_goal > 0
      ? (stats.leadsContacted / goal.contacts_goal) * 100
      : 0;
    const meetingsProgress = goal.meetings_goal > 0
      ? (stats.meetingsScheduled / goal.meetings_goal) * 100
      : 0;

    const leadsExceeded = leadsProgress > 100;
    const contactsExceeded = contactsProgress > 100;
    const meetingsExceeded = meetingsProgress > 100;
    const anyExceeded = leadsExceeded || contactsExceeded || meetingsExceeded;

    return {
      leadsProgress,
      contactsProgress,
      meetingsProgress,
      leadsExceeded,
      contactsExceeded,
      meetingsExceeded,
      anyExceeded,
    };
  }, [goal, stats]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Olá, {teamMember?.name?.split(" ")[0] || "SDR"}! 👋
          </h2>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        {goalProgress?.anyExceeded && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full"
          >
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">Meta batida!</span>
          </motion.div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.leadsCreated}</p>
              <p className="text-xs text-muted-foreground">Leads Captados</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Phone className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.leadsContacted}</p>
              <p className="text-xs text-muted-foreground">Contatos Feitos</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <CalendarCheck className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.meetingsScheduled}</p>
              <p className="text-xs text-muted-foreground">Reuniões Agendadas</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pendingFollowups}</p>
              <p className="text-xs text-muted-foreground">Follow-ups Pendentes</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goals Progress - Enhanced with exceeded highlights */}
      {goal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "bg-card border rounded-xl p-6",
            goalProgress?.anyExceeded ? "border-amber-500/30" : "border-border"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Minhas Metas do Mês</h3>
            </div>
            {goalProgress?.anyExceeded && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-amber-500">Superando expectativas!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedGoalCard
              title="Leads Captados"
              icon={Users}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              current={stats.leadsCreated}
              goal={goal.leads_goal}
              compact
            />
            <EnhancedGoalCard
              title="Contatos Realizados"
              icon={Phone}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
              current={stats.leadsContacted}
              goal={goal.contacts_goal}
              compact
            />
            <EnhancedGoalCard
              title="Reuniões Agendadas"
              icon={CalendarCheck}
              iconColor="text-purple-500"
              iconBg="bg-purple-500/10"
              current={stats.meetingsScheduled}
              goal={goal.meetings_goal}
              compact
            />
          </div>
        </motion.div>
      )}

      {/* Today's Follow-ups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Follow-ups de Hoje</h3>
          </div>
          {stats.todayFollowups.length > 0 && (
            <Badge variant="secondary">{stats.todayFollowups.length}</Badge>
          )}
        </div>

        {stats.todayFollowups.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum follow-up para hoje 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {stats.todayFollowups.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.followup_notes || "Sem notas"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {onOpenNotes && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenNotes(lead)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                  {onOpenFollowup && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenFollowup(lead)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* My Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Meus Leads Recentes</h3>
          </div>
          <Badge variant="secondary">{leads.length}</Badge>
        </div>

        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum lead atribuído
          </p>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
                <Badge
                  variant={
                    lead.pipeline_stage === "qualificado"
                      ? "default"
                      : "secondary"
                  }
                >
                  {lead.pipeline_stage}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SDRDashboard;
