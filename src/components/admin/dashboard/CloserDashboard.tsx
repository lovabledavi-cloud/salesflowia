import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CalendarCheck,
  Target,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Lead, TeamMember, Goal } from "@/types/crm";
import { isToday, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EnhancedGoalCard from "./EnhancedGoalCard";

interface CloserDashboardProps {
  leads: Lead[];
  teamMember: TeamMember | null;
  allLeads: Lead[];
  goal?: Goal | null;
  onOpenDetails?: (lead: Lead) => void;
}

const CloserDashboard = ({
  leads,
  teamMember,
  allLeads,
  goal,
  onOpenDetails,
}: CloserDashboardProps) => {
  const stats = useMemo(() => {
    // Leads assigned to this closer
    const assignedLeads = allLeads.filter(
      (l) => l.assigned_to === teamMember?.id
    );

    // Leads in active pipeline stages
    const inPipeline = assignedLeads.filter(
      (l) =>
        l.pipeline_stage !== "ganho" &&
        l.pipeline_stage !== "perdido" &&
        l.pipeline_stage !== "novo"
    ).length;

    // Meetings today
    const meetingsToday = assignedLeads.filter(
      (l) => l.meeting_date && isToday(new Date(l.meeting_date))
    );

    // Won leads (closed by this closer)
    const wonLeads = allLeads.filter(
      (l) => l.closed_by === teamMember?.id && l.pipeline_stage === "ganho"
    );

    // Lost leads
    const lostLeads = assignedLeads.filter(
      (l) => l.pipeline_stage === "perdido"
    ).length;

    // Revenue
    const revenue = wonLeads.reduce((acc, l) => acc + (l.value || 0), 0);

    // Conversion rate
    const closedDeals = wonLeads.length + lostLeads;
    const conversionRate = closedDeals > 0
      ? (wonLeads.length / closedDeals) * 100
      : 0;

    // Meetings completed
    const meetingsCompleted = assignedLeads.filter(
      (l) => l.meeting_completed
    ).length;

    // No-shows
    const noShows = assignedLeads.filter((l) => l.no_show).length;

    // Average ticket
    const avgTicket = wonLeads.length > 0 ? revenue / wonLeads.length : 0;

    return {
      inPipeline,
      meetingsToday,
      wonLeads: wonLeads.length,
      lostLeads,
      revenue,
      conversionRate,
      meetingsCompleted,
      noShows,
      assignedLeads,
      avgTicket,
    };
  }, [leads, allLeads, teamMember]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const goalProgress = useMemo(() => {
    if (!goal) return null;

    const conversionsProgress = goal.conversions_goal > 0
      ? (stats.wonLeads / goal.conversions_goal) * 100
      : 0;
    const revenueProgress = goal.revenue_goal > 0
      ? (stats.revenue / goal.revenue_goal) * 100
      : 0;
    const meetingsProgress = goal.meetings_goal > 0
      ? (stats.meetingsCompleted / goal.meetings_goal) * 100
      : 0;

    const conversionsExceeded = conversionsProgress > 100;
    const revenueExceeded = revenueProgress > 100;
    const meetingsExceeded = meetingsProgress > 100;
    const anyExceeded = conversionsExceeded || revenueExceeded || meetingsExceeded;

    return {
      conversionsProgress,
      revenueProgress,
      meetingsProgress,
      conversionsExceeded,
      revenueExceeded,
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
            Olá, {teamMember?.name?.split(" ")[0] || "Closer"}! 💼
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
            <span className="text-sm font-medium text-amber-500">Meta superada!</span>
          </motion.div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "bg-card border rounded-xl p-4",
            goalProgress?.revenueExceeded ? "border-amber-500/50" : "border-border"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className={cn(
                "text-lg font-bold",
                goalProgress?.revenueExceeded && "text-amber-500"
              )}>
                {formatCurrency(stats.revenue)}
              </p>
              <p className="text-xs text-muted-foreground">Receita Gerada</p>
            </div>
            {goalProgress?.revenueExceeded && (
              <Trophy className="h-4 w-4 text-amber-500 ml-auto" />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inPipeline}</p>
              <p className="text-xs text-muted-foreground">No Pipeline</p>
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
              <p className="text-2xl font-bold">{stats.meetingsToday.length}</p>
              <p className="text-xs text-muted-foreground">Reuniões Hoje</p>
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
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.conversionRate.toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">Taxa de Conversão</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goals Progress - Enhanced */}
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
              title="Vendas Fechadas"
              icon={CheckCircle}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
              current={stats.wonLeads}
              goal={goal.conversions_goal}
              compact
            />
            <EnhancedGoalCard
              title="Receita"
              icon={DollarSign}
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
              current={stats.revenue}
              goal={goal.revenue_goal}
              isCurrency
              compact
            />
            <EnhancedGoalCard
              title="Reuniões Realizadas"
              icon={CalendarCheck}
              iconColor="text-purple-500"
              iconBg="bg-purple-500/10"
              current={stats.meetingsCompleted}
              goal={goal.meetings_goal}
              compact
            />
          </div>
        </motion.div>
      )}

      {/* Today's Meetings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Reuniões de Hoje</h3>
          </div>
          {stats.meetingsToday.length > 0 && (
            <Badge variant="secondary">{stats.meetingsToday.length}</Badge>
          )}
        </div>

        {stats.meetingsToday.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma reunião agendada para hoje
          </p>
        ) : (
          <div className="space-y-3">
            {stats.meetingsToday.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.meeting_date &&
                      format(new Date(lead.meeting_date), "HH:mm", {
                        locale: ptBR,
                      })}
                    {" • "}
                    {formatCurrency(lead.value || 0)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {onOpenDetails && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenDetails(lead)}
                    >
                      Ver Detalhes
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={cn(
            "bg-card border rounded-xl p-6",
            goalProgress?.conversionsExceeded ? "border-emerald/50" : "border-border"
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className={cn(
              "h-5 w-5",
              goalProgress?.conversionsExceeded ? "text-amber-500" : "text-emerald-500"
            )} />
            <h3 className="font-semibold">Vendas do Mês</h3>
            {goalProgress?.conversionsExceeded && (
              <Trophy className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-3xl font-bold",
                goalProgress?.conversionsExceeded ? "text-amber-500" : "text-emerald-500"
              )}>
                {stats.wonLeads}
              </p>
              <p className="text-sm text-muted-foreground">
                vendas fechadas
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {formatCurrency(stats.revenue)}
              </p>
              <p className="text-sm text-muted-foreground">
                ticket médio: {formatCurrency(stats.avgTicket)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">Métricas de Reunião</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">{stats.meetingsCompleted}</p>
              <p className="text-sm text-muted-foreground">realizadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{stats.noShows}</p>
              <p className="text-sm text-muted-foreground">no-shows</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Meu Pipeline</h3>
          </div>
          <Badge variant="secondary">{stats.assignedLeads.length}</Badge>
        </div>

        {stats.assignedLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum lead no pipeline
          </p>
        ) : (
          <div className="space-y-3">
            {stats.assignedLeads
              .filter(
                (l) =>
                  l.pipeline_stage !== "ganho" && l.pipeline_stage !== "perdido"
              )
              .slice(0, 5)
              .map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => onOpenDetails?.(lead)}
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(lead.value || 0)}
                    </p>
                  </div>
                  <Badge>{lead.pipeline_stage}</Badge>
                </div>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CloserDashboard;
