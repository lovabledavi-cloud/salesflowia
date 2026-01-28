import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Target, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Phone,
  Trophy,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Percent,
  UserCheck
} from "lucide-react";
import { Lead, CompanyGoal, TeamMember } from "@/types/crm";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DashboardMetricsAdvancedProps {
  leads: Lead[];
  companyGoal?: CompanyGoal;
  teamMembers: TeamMember[];
  previousPeriodLeads?: Lead[];
}

const DashboardMetricsAdvanced = ({ 
  leads, 
  companyGoal, 
  teamMembers,
  previousPeriodLeads = [] 
}: DashboardMetricsAdvancedProps) => {
  const stats = useMemo(() => {
    // Revenue
    const revenue = leads
      .filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho")
      .reduce((acc, l) => acc + (l.value || 0), 0);

    // Previous period revenue
    const prevRevenue = previousPeriodLeads
      .filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho")
      .reduce((acc, l) => acc + (l.value || 0), 0);

    // Leads metrics
    const totalLeads = leads.length;
    const leadsGoal = companyGoal?.leads_goal || 0;
    const leadsProgress = leadsGoal > 0 ? (totalLeads / leadsGoal) * 100 : 0;
    const leadsExceeded = leadsProgress > 100;

    // SDR Metrics - Meetings
    const meetingsScheduled = leads.filter((l) => l.meeting_scheduled).length;
    const meetingsGoal = companyGoal?.meetings_goal || 0;
    const meetingsProgress = meetingsGoal > 0 ? (meetingsScheduled / meetingsGoal) * 100 : 0;
    const meetingsExceeded = meetingsProgress > 100;

    // Contacts metrics
    const leadsContacted = leads.filter((l) => 
      l.status === "contactado" || 
      l.status === "convertido" ||
      l.contacted_by !== null
    ).length;
    const contactsGoal = companyGoal?.contacts_goal || 0;
    const contactsProgress = contactsGoal > 0 ? (leadsContacted / contactsGoal) * 100 : 0;

    // Qualified leads (SDR success)
    const qualifiedLeads = leads.filter((l) => 
      l.pipeline_stage === "qualificado" || 
      l.pipeline_stage === "negociacao" || 
      l.pipeline_stage === "proposta" ||
      l.pipeline_stage === "ganho"
    ).length;

    // SDR efficiency rate
    const sdrEfficiencyRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

    // Team Metrics
    const meetingsCompleted = leads.filter((l) => l.meeting_completed).length;
    const salesClosed = leads.filter((l) => l.pipeline_stage === "ganho").length;
    const conversionsGoal = companyGoal?.conversions_goal || 0;
    const conversionsProgress = conversionsGoal > 0 ? (salesClosed / conversionsGoal) * 100 : 0;
    const conversionsExceeded = conversionsProgress > 100;

    const noShows = leads.filter((l) => l.no_show).length;
    const noShowRate = meetingsScheduled > 0 ? (noShows / meetingsScheduled) * 100 : 0;
    const conversionRate = meetingsCompleted > 0 ? (salesClosed / meetingsCompleted) * 100 : 0;

    // Monthly Goal Progress
    const revenueGoal = companyGoal?.revenue_goal ? Number(companyGoal.revenue_goal) : 0;
    const revenueProgress = revenueGoal > 0 ? (revenue / revenueGoal) * 100 : 0;
    const revenueRemaining = Math.max(0, revenueGoal - revenue);
    const revenueExceeded = revenueProgress > 100;
    const revenueExceededAmount = revenueExceeded ? revenue - revenueGoal : 0;

    // Trend calculations
    const revenueTrend = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Average ticket
    const avgTicket = salesClosed > 0 ? revenue / salesClosed : 0;

    // Leads in pipeline (active)
    const leadsInPipeline = leads.filter((l) => 
      l.pipeline_stage !== "ganho" && 
      l.pipeline_stage !== "perdido"
    ).length;

    // Pipeline value
    const pipelineValue = leads
      .filter((l) => 
        l.pipeline_stage !== "ganho" && 
        l.pipeline_stage !== "perdido"
      )
      .reduce((acc, l) => acc + (l.value || 0), 0);

    return {
      revenue,
      prevRevenue,
      revenueTrend,
      totalLeads,
      leadsGoal,
      leadsProgress,
      leadsExceeded,
      leadsContacted,
      contactsGoal,
      contactsProgress,
      meetingsScheduled,
      meetingsGoal,
      meetingsProgress,
      meetingsExceeded,
      qualifiedLeads,
      sdrEfficiencyRate,
      meetingsCompleted,
      salesClosed,
      conversionsGoal,
      conversionsProgress,
      conversionsExceeded,
      noShows,
      noShowRate,
      conversionRate,
      revenueGoal,
      revenueProgress,
      revenueRemaining,
      revenueExceeded,
      revenueExceededAmount,
      avgTicket,
      leadsInPipeline,
      pipelineValue,
    };
  }, [leads, companyGoal, previousPeriodLeads]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyCompact = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="space-y-4">
      {/* Main KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento with exceeded highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className={cn(
            "relative bg-card border rounded-xl p-5 overflow-hidden transition-all",
            stats.revenueExceeded 
              ? "border-amber-500/50 ring-1 ring-amber-500/20" 
              : "border-border hover:border-primary/30"
          )}
        >
          {stats.revenueExceeded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              className="absolute inset-0 bg-gradient-to-br from-amber-500 to-emerald"
            />
          )}
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-emerald/10">
                <DollarSign className="h-5 w-5 text-emerald" />
              </div>
              <div className="flex items-center gap-2">
                {stats.revenueExceeded && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Trophy className="h-4 w-4 text-amber-500" />
                  </motion.div>
                )}
                {stats.revenueTrend !== 0 && (
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    stats.revenueTrend > 0 ? "text-emerald" : "text-destructive"
                  )}>
                    {stats.revenueTrend > 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(stats.revenueTrend).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1">Faturamento</p>
            <p className={cn(
              "text-3xl font-bold",
              stats.revenueExceeded ? "text-amber-500" : "text-foreground"
            )}>
              {formatCurrency(stats.revenue)}
            </p>
            
            {stats.revenueExceeded ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 mt-2"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-amber-500 font-medium">
                  +{formatCurrency(stats.revenueExceededAmount)} acima da meta! 🏆
                </span>
              </motion.div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                {stats.salesClosed} vendas • Ticket médio: {formatCurrency(stats.avgTicket)}
              </p>
            )}
          </div>
        </motion.div>

        {/* Card 2: Metas SDR - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "bg-card border rounded-xl p-5 transition-colors",
            (stats.leadsExceeded || stats.meetingsExceeded) 
              ? "border-blue-500/50" 
              : "border-border hover:border-primary/30"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center gap-1">
              {(stats.leadsExceeded || stats.meetingsExceeded) && (
                <Trophy className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-xs text-muted-foreground">SDR</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Metas SDR</p>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Reuniões Marcadas</span>
                <span className={cn(
                  "font-medium",
                  stats.meetingsExceeded ? "text-amber-500" : "text-blue-500"
                )}>
                  {stats.meetingsScheduled}/{stats.meetingsGoal}
                  {stats.meetingsExceeded && ` (${stats.meetingsProgress.toFixed(0)}%)`}
                </span>
              </div>
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stats.meetingsProgress, 100)}%` }}
                  transition={{ duration: 0.8 }}
                  className={cn(
                    "h-full rounded-full",
                    stats.meetingsExceeded 
                      ? "bg-gradient-to-r from-blue-500 to-amber-500" 
                      : "bg-blue-500"
                  )}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Leads Captados</span>
                <span className={cn(
                  "font-medium",
                  stats.leadsExceeded ? "text-amber-500" : "text-blue-500"
                )}>
                  {stats.totalLeads}/{stats.leadsGoal}
                  {stats.leadsExceeded && ` (${stats.leadsProgress.toFixed(0)}%)`}
                </span>
              </div>
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stats.leadsProgress, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className={cn(
                    "h-full rounded-full",
                    stats.leadsExceeded 
                      ? "bg-gradient-to-r from-blue-500 to-amber-500" 
                      : "bg-blue-500"
                  )}
                />
              </div>
            </div>
            
            <div className="pt-1 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Taxa de Aproveitamento</span>
                <span className={cn(
                  "font-medium",
                  stats.sdrEfficiencyRate >= 50 ? "text-emerald" : "text-amber-500"
                )}>
                  {stats.sdrEfficiencyRate.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Métricas do Time - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "bg-card border rounded-xl p-5 transition-colors",
            stats.conversionsExceeded 
              ? "border-emerald/50" 
              : "border-border hover:border-primary/30"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-violet/10">
              <Users className="h-5 w-5 text-violet" />
            </div>
            <div className="flex items-center gap-1">
              {stats.conversionsExceeded && (
                <Trophy className="h-4 w-4 text-emerald" />
              )}
              <span className="text-xs text-muted-foreground">Time</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Métricas do Time</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-lg font-bold text-blue-500">{stats.meetingsCompleted}</p>
                <p className="text-[10px] text-muted-foreground">Reuniões</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className={cn(
                "h-4 w-4",
                stats.conversionsExceeded ? "text-amber-500" : "text-emerald"
              )} />
              <div>
                <p className={cn(
                  "text-lg font-bold",
                  stats.conversionsExceeded ? "text-amber-500" : "text-emerald"
                )}>
                  {stats.salesClosed}
                  {stats.conversionsExceeded && (
                    <span className="text-xs ml-0.5">🏆</span>
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Vendas {stats.conversionsGoal > 0 && `/ ${stats.conversionsGoal}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-lg font-bold text-destructive">{stats.noShows}</p>
                <p className="text-[10px] text-muted-foreground">No-Show ({stats.noShowRate.toFixed(0)}%)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-lg font-bold text-amber-500">{stats.conversionRate.toFixed(0)}%</p>
                <p className="text-[10px] text-muted-foreground">Taxa Conv.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Meta do Mês - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "relative bg-card border rounded-xl p-5 overflow-hidden transition-colors",
            stats.revenueExceeded 
              ? "border-amber-500/50 ring-1 ring-amber-500/20" 
              : "border-border hover:border-primary/30"
          )}
        >
          {stats.revenueExceeded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              className="absolute inset-0 bg-gradient-to-br from-amber-500 to-emerald"
            />
          )}
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-2.5 rounded-lg",
                stats.revenueExceeded ? "bg-amber-500/10" : "bg-amber-500/10"
              )}>
                <Target className={cn(
                  "h-5 w-5",
                  stats.revenueExceeded ? "text-amber-500" : "text-amber-500"
                )} />
              </div>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1",
                stats.revenueExceeded 
                  ? "bg-amber-500/20 text-amber-500"
                  : stats.revenueProgress >= 100 
                    ? "bg-emerald/20 text-emerald" 
                    : stats.revenueProgress >= 70
                      ? "bg-amber-500/20 text-amber-500"
                      : "bg-destructive/20 text-destructive"
              )}>
                {stats.revenueExceeded && <Trophy className="h-3 w-3" />}
                {stats.revenueProgress.toFixed(0)}%
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1">Meta do Mês</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.revenueGoal)}</p>
            
            <div className="mt-3">
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stats.revenueProgress, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    stats.revenueExceeded 
                      ? "bg-gradient-to-r from-emerald to-amber-500" 
                      : stats.revenueProgress >= 100 
                        ? "bg-emerald" 
                        : "bg-primary"
                  )}
                />
              </div>
            </div>
            
            {stats.revenueExceeded ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 mt-3"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-amber-500 font-medium">
                  Meta ultrapassada em {(stats.revenueProgress - 100).toFixed(0)}%!
                </span>
              </motion.div>
            ) : (
              <div className="flex justify-between mt-3 text-xs">
                <span className="text-muted-foreground">
                  Concluído: <span className="text-emerald font-medium">{formatCurrency(stats.revenue)}</span>
                </span>
                <span className="text-muted-foreground">
                  Falta: <span className="text-foreground font-medium">{formatCurrency(stats.revenueRemaining)}</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Secondary KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="h-4 w-4 text-emerald" />
            <span className="text-xs text-muted-foreground">Qualificados</span>
          </div>
          <p className="text-xl font-bold">{stats.qualifiedLeads}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Contatos</span>
          </div>
          <p className="text-xl font-bold">
            {stats.leadsContacted}
            {stats.contactsGoal > 0 && (
              <span className="text-xs text-muted-foreground font-normal">/{stats.contactsGoal}</span>
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-violet" />
            <span className="text-xs text-muted-foreground">No Pipeline</span>
          </div>
          <p className="text-xl font-bold">{stats.leadsInPipeline}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-card border border-border rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Valor Pipeline</span>
          </div>
          <p className="text-xl font-bold">{formatCurrencyCompact(stats.pipelineValue)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Percent className="h-4 w-4 text-emerald" />
            <span className="text-xs text-muted-foreground">Ticket Médio</span>
          </div>
          <p className="text-xl font-bold">{formatCurrencyCompact(stats.avgTicket)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-card border border-border rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Time Ativo</span>
          </div>
          <p className="text-xl font-bold">{teamMembers.filter(m => m.is_active).length}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardMetricsAdvanced;
