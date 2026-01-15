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
  Phone
} from "lucide-react";
import { Lead, CompanyGoal, TeamMember } from "@/types/crm";
import { Progress } from "@/components/ui/progress";

interface DashboardMetricsAdvancedProps {
  leads: Lead[];
  companyGoal?: CompanyGoal;
  teamMembers: TeamMember[];
}

const DashboardMetricsAdvanced = ({ leads, companyGoal, teamMembers }: DashboardMetricsAdvancedProps) => {
  const stats = useMemo(() => {
    // Revenue
    const revenue = leads
      .filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho")
      .reduce((acc, l) => acc + (l.value || 0), 0);

    // Leads metrics
    const totalLeads = leads.length;
    const leadsGoal = companyGoal?.leads_goal || 0;
    const leadsProgress = leadsGoal > 0 ? (totalLeads / leadsGoal) * 100 : 0;

    // SDR Metrics - Meetings
    const meetingsScheduled = leads.filter((l) => l.meeting_scheduled).length;
    const meetingsGoal = companyGoal?.meetings_goal || 0;
    const meetingsProgress = meetingsGoal > 0 ? (meetingsScheduled / meetingsGoal) * 100 : 0;

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
    const noShows = leads.filter((l) => l.no_show).length;
    const noShowRate = meetingsScheduled > 0 ? (noShows / meetingsScheduled) * 100 : 0;
    const conversionRate = meetingsCompleted > 0 ? (salesClosed / meetingsCompleted) * 100 : 0;

    // Monthly Goal Progress
    const revenueGoal = companyGoal?.revenue_goal ? Number(companyGoal.revenue_goal) : 0;
    const revenueProgress = revenueGoal > 0 ? (revenue / revenueGoal) * 100 : 0;
    const revenueRemaining = Math.max(0, revenueGoal - revenue);

    return {
      revenue,
      totalLeads,
      leadsGoal,
      leadsProgress: Math.min(leadsProgress, 100),
      meetingsScheduled,
      meetingsGoal,
      meetingsProgress: Math.min(meetingsProgress, 100),
      qualifiedLeads,
      sdrEfficiencyRate,
      meetingsCompleted,
      salesClosed,
      noShows,
      noShowRate,
      conversionRate,
      revenueGoal,
      revenueProgress: Math.min(revenueProgress, 100),
      revenueRemaining,
    };
  }, [leads, companyGoal]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Faturamento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-emerald/10">
            <DollarSign className="h-5 w-5 text-emerald" />
          </div>
          <span className="text-xs text-muted-foreground">Este período</span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Faturamento</p>
        <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.revenue)}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {stats.salesClosed} vendas fechadas
        </p>
      </motion.div>

      {/* Card 2: Metas SDR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-blue-500/10">
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-xs text-muted-foreground">SDR</span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Metas SDR</p>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Reuniões Marcadas</span>
              <span className="font-medium text-blue-500">{stats.meetingsScheduled}/{stats.meetingsGoal}</span>
            </div>
            <Progress value={stats.meetingsProgress} className="h-1.5" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Leads Captados</span>
              <span className="font-medium text-blue-500">{stats.totalLeads}/{stats.leadsGoal}</span>
            </div>
            <Progress value={stats.leadsProgress} className="h-1.5" />
          </div>
          
          <div className="pt-1 border-t border-border">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Taxa de Aproveitamento</span>
              <span className="font-medium text-emerald">{stats.sdrEfficiencyRate.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 3: Métricas do Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-violet/10">
            <Users className="h-5 w-5 text-violet" />
          </div>
          <span className="text-xs text-muted-foreground">Time</span>
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
            <CheckCircle className="h-4 w-4 text-emerald" />
            <div>
              <p className="text-lg font-bold text-emerald">{stats.salesClosed}</p>
              <p className="text-[10px] text-muted-foreground">Vendas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <div>
              <p className="text-lg font-bold text-destructive">{stats.noShows}</p>
              <p className="text-[10px] text-muted-foreground">No-Show</p>
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

      {/* Card 4: Meta do Mês */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-amber-500/10">
            <Target className="h-5 w-5 text-amber-500" />
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            stats.revenueProgress >= 100 
              ? "bg-emerald/20 text-emerald" 
              : stats.revenueProgress >= 70
                ? "bg-amber-500/20 text-amber-500"
                : "bg-destructive/20 text-destructive"
          }`}>
            {stats.revenueProgress.toFixed(0)}%
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Meta do Mês</p>
        <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.revenueGoal)}</p>
        
        <div className="mt-3">
          <Progress 
            value={stats.revenueProgress} 
            className={`h-2 ${stats.revenueProgress >= 100 ? "[&>div]:bg-emerald" : ""}`} 
          />
        </div>
        
        <div className="flex justify-between mt-3 text-xs">
          <span className="text-muted-foreground">
            Concluído: <span className="text-emerald font-medium">{formatCurrency(stats.revenue)}</span>
          </span>
          <span className="text-muted-foreground">
            Falta: <span className="text-foreground font-medium">{formatCurrency(stats.revenueRemaining)}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardMetricsAdvanced;
