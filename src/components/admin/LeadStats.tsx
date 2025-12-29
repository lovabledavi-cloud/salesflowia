import { Users, Calendar, TrendingUp, XCircle, CheckCircle, MessageCircle } from "lucide-react";
import { LeadStatus } from "./LeadStatusBadge";

interface Lead {
  id: string;
  status: LeadStatus;
  created_at: string;
}

interface LeadStatsProps {
  leads: Lead[];
}

const LeadStats = ({ leads }: LeadStatsProps) => {
  const totalLeads = leads.length;
  
  const last7Days = leads.filter((l) => {
    const date = new Date(l.created_at);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const statusCounts = {
    novo: leads.filter((l) => l.status === "novo").length,
    contactado: leads.filter((l) => l.status === "contactado").length,
    convertido: leads.filter((l) => l.status === "convertido").length,
    perdido: leads.filter((l) => l.status === "perdido").length,
  };

  const conversionRate = totalLeads > 0 
    ? ((statusCounts.convertido / totalLeads) * 100).toFixed(1) 
    : "0";

  const stats = [
    {
      label: "Total de Leads",
      value: totalLeads,
      icon: Users,
      bgColor: "bg-emerald/10",
      iconColor: "text-emerald",
    },
    {
      label: "Últimos 7 dias",
      value: last7Days,
      icon: Calendar,
      bgColor: "bg-violet/10",
      iconColor: "text-violet",
    },
    {
      label: "Novos",
      value: statusCounts.novo,
      icon: TrendingUp,
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      label: "Contactados",
      value: statusCounts.contactado,
      icon: MessageCircle,
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
    },
    {
      label: "Convertidos",
      value: statusCounts.convertido,
      icon: CheckCircle,
      bgColor: "bg-emerald/10",
      iconColor: "text-emerald",
    },
    {
      label: "Taxa Conversão",
      value: `${conversionRate}%`,
      icon: XCircle,
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadStats;
