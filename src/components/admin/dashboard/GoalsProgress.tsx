import { useMemo } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Users, DollarSign } from "lucide-react";
import { Lead, CompanyGoal } from "@/types/crm";

interface GoalsProgressProps {
  leads: Lead[];
  leadsClosedInMonth?: Lead[]; // Leads closed in the selected month for revenue
  companyGoal?: CompanyGoal;
}

const GoalsProgress = ({ leads, leadsClosedInMonth, companyGoal }: GoalsProgressProps) => {
  const progress = useMemo(() => {
    if (!companyGoal) return null;

    // Use leadsClosedInMonth for revenue if provided, otherwise calculate from leads
    const closedLeads = leadsClosedInMonth || leads.filter(l => l.pipeline_stage === "ganho");
    const converted = closedLeads.length;
    const revenue = closedLeads.reduce((acc, l) => acc + (l.value || 0), 0);

    const totalLeads = leads.length;
    const contacted = leads.filter(
      (l) =>
        l.status === "contactado" ||
        l.status === "convertido" ||
        l.pipeline_stage === "qualificado" ||
        l.pipeline_stage === "negociacao" ||
        l.pipeline_stage === "proposta" ||
        l.pipeline_stage === "ganho"
    ).length;

    return {
      leads: {
        current: totalLeads,
        goal: companyGoal.leads_goal,
        percentage: companyGoal.leads_goal > 0 ? Math.min((totalLeads / companyGoal.leads_goal) * 100, 100) : 0,
      },
      contacts: {
        current: contacted,
        goal: companyGoal.contacts_goal,
        percentage: companyGoal.contacts_goal > 0 ? Math.min((contacted / companyGoal.contacts_goal) * 100, 100) : 0,
      },
      conversions: {
        current: converted,
        goal: companyGoal.conversions_goal,
        percentage: companyGoal.conversions_goal > 0 ? Math.min((converted / companyGoal.conversions_goal) * 100, 100) : 0,
      },
      revenue: {
        current: revenue,
        goal: Number(companyGoal.revenue_goal),
        percentage: Number(companyGoal.revenue_goal) > 0 ? Math.min((revenue / Number(companyGoal.revenue_goal)) * 100, 100) : 0,
      },
    };
  }, [leads, leadsClosedInMonth, companyGoal]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return `R$ ${value}`;
  };

  if (!progress) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Metas do Mês</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma meta definida para este mês.
        </p>
      </div>
    );
  }

  const goals = [
    {
      label: "Leads",
      icon: Users,
      current: progress.leads.current,
      goal: progress.leads.goal,
      percentage: progress.leads.percentage,
      color: "bg-blue-500",
      format: (v: number) => v.toString(),
    },
    {
      label: "Contatos",
      icon: TrendingUp,
      current: progress.contacts.current,
      goal: progress.contacts.goal,
      percentage: progress.contacts.percentage,
      color: "bg-amber-500",
      format: (v: number) => v.toString(),
    },
    {
      label: "Conversões",
      icon: Target,
      current: progress.conversions.current,
      goal: progress.conversions.goal,
      percentage: progress.conversions.percentage,
      color: "bg-emerald-500",
      format: (v: number) => v.toString(),
    },
    {
      label: "Faturamento",
      icon: DollarSign,
      current: progress.revenue.current,
      goal: progress.revenue.goal,
      percentage: progress.revenue.percentage,
      color: "bg-violet-500",
      format: formatCurrency,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Metas do Mês</h3>
          <p className="text-sm text-muted-foreground">Progresso geral</p>
        </div>
      </div>

      <div className="space-y-5">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${goal.color}/10`}>
                  <goal.icon className={`h-4 w-4 ${goal.color.replace("bg-", "text-")}`} />
                </div>
                <span className="text-sm font-medium text-foreground">{goal.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {goal.format(goal.current)}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {goal.format(goal.goal)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-full rounded-full ${goal.color}`}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {goal.percentage.toFixed(0)}% concluído
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GoalsProgress;
