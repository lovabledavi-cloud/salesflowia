import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Target, ArrowUp, ArrowDown } from "lucide-react";
import { Lead, CompanyGoal } from "@/types/crm";

interface DashboardMetricsProps {
  leads: Lead[];
  companyGoal?: CompanyGoal;
  previousPeriodLeads?: Lead[];
}

const DashboardMetrics = ({ leads, companyGoal, previousPeriodLeads = [] }: DashboardMetricsProps) => {
  const stats = useMemo(() => {
    const total = leads.length;
    const converted = leads.filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho").length;
    const contacted = leads.filter((l) => l.status === "contactado" || l.pipeline_stage === "qualificado" || l.pipeline_stage === "negociacao" || l.pipeline_stage === "proposta").length;
    const revenue = leads
      .filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho")
      .reduce((acc, l) => acc + (l.value || 0), 0);
    
    // Previous period stats
    const prevTotal = previousPeriodLeads.length;
    const prevConverted = previousPeriodLeads.filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho").length;
    const prevRevenue = previousPeriodLeads
      .filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho")
      .reduce((acc, l) => acc + (l.value || 0), 0);

    // Calculate percentage changes
    const leadsChange = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;
    const conversionChange = prevConverted > 0 ? ((converted - prevConverted) / prevConverted) * 100 : 0;
    const revenueChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Goals progress
    const leadsGoalProgress = companyGoal?.leads_goal ? (total / companyGoal.leads_goal) * 100 : 0;
    const conversionsGoalProgress = companyGoal?.conversions_goal ? (converted / companyGoal.conversions_goal) * 100 : 0;
    const revenueGoalProgress = companyGoal?.revenue_goal ? (revenue / Number(companyGoal.revenue_goal)) * 100 : 0;

    const revenueGoalRemaining = companyGoal?.revenue_goal 
      ? Math.max(0, Number(companyGoal.revenue_goal) - revenue) 
      : 0;

    return {
      total,
      converted,
      contacted,
      revenue,
      leadsChange,
      conversionChange,
      revenueChange,
      leadsGoalProgress: Math.min(leadsGoalProgress, 100),
      conversionsGoalProgress: Math.min(conversionsGoalProgress, 100),
      revenueGoalProgress: Math.min(revenueGoalProgress, 100),
      revenueGoalRemaining,
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

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const metrics = [
    {
      title: "Faturamento",
      value: formatCurrency(stats.revenue),
      change: stats.revenueChange,
      icon: DollarSign,
      iconBg: "bg-emerald/10",
      iconColor: "text-emerald",
      subtitle: stats.revenueChange !== 0 ? "vs período anterior" : undefined,
    },
    {
      title: "Meta de Leads",
      value: `${stats.total}${companyGoal?.leads_goal ? `/${companyGoal.leads_goal}` : ""}`,
      progress: stats.leadsGoalProgress,
      icon: Users,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      subtitle: companyGoal?.leads_goal ? `${stats.leadsGoalProgress.toFixed(0)}% da meta` : "Sem meta definida",
    },
    {
      title: "Métricas do Time",
      value: `${stats.converted} conv.`,
      secondaryValue: `${stats.contacted} qualif.`,
      icon: TrendingUp,
      iconBg: "bg-violet/10",
      iconColor: "text-violet",
      subtitle: `Taxa: ${stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%`,
    },
    {
      title: "Meta do Mês",
      value: `${stats.revenueGoalProgress.toFixed(0)}%`,
      progress: stats.revenueGoalProgress,
      icon: Target,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      subtitle: stats.revenueGoalRemaining > 0 
        ? `Faltam ${formatCurrency(stats.revenueGoalRemaining)}` 
        : "Meta atingida! 🎉",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${metric.iconBg}`}>
              <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
            </div>
            {metric.change !== undefined && metric.change !== 0 && (
              <div className={`flex items-center gap-1 text-xs font-medium ${
                metric.change > 0 ? "text-emerald" : "text-destructive"
              }`}>
                {metric.change > 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {formatPercentage(Math.abs(metric.change))}
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground">{metric.value}</p>
            {metric.secondaryValue && (
              <p className="text-sm text-muted-foreground">{metric.secondaryValue}</p>
            )}
          </div>

          {metric.progress !== undefined && (
            <div className="mt-3">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    metric.progress >= 100 ? "bg-emerald" : "bg-primary"
                  }`}
                />
              </div>
            </div>
          )}

          {metric.subtitle && (
            <p className="text-xs text-muted-foreground mt-2">{metric.subtitle}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
