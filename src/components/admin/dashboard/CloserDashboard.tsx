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
} from "lucide-react";
import { Lead, TeamMember, Goal } from "@/types/crm";
import { isToday, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

    return {
      conversionsProgress: Math.min(conversionsProgress, 100),
      revenueProgress: Math.min(revenueProgress, 100),
      meetingsProgress: Math.min(meetingsProgress, 100),
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold">{formatCurrency(stats.revenue)}</p>
              <p className="text-xs text-muted-foreground">Receita Gerada</p>
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

      {/* Goals Progress */}
      {goalProgress && goal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Minhas Metas do Mês</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Vendas Fechadas</span>
                <span className="text-sm font-medium">
                  {stats.wonLeads} / {goal.conversions_goal}
                </span>
              </div>
              <Progress value={goalProgress.conversionsProgress} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Receita</span>
                <span className="text-sm font-medium">
                  {formatCurrency(stats.revenue)} / {formatCurrency(goal.revenue_goal)}
                </span>
              </div>
              <Progress value={goalProgress.revenueProgress} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Reuniões Realizadas</span>
                <span className="text-sm font-medium">
                  {stats.meetingsCompleted} / {goal.meetings_goal}
                </span>
              </div>
              <Progress value={goalProgress.meetingsProgress} className="h-2" />
            </div>
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
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <h3 className="font-semibold">Vendas do Mês</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-emerald-500">
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
              <p className="text-sm text-muted-foreground">receita total</p>
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
