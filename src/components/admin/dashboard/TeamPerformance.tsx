import { useMemo } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TeamMember, Lead, ROLE_CONFIG } from "@/types/crm";

interface TeamPerformanceProps {
  teamMembers: TeamMember[];
  leads: Lead[];
}

const TeamPerformance = ({ teamMembers, leads }: TeamPerformanceProps) => {
  const memberStats = useMemo(() => {
    return teamMembers
      .filter((m) => m.is_active)
      .map((member) => {
        const assignedLeads = leads.filter((l) => l.assigned_to === member.id);
        const convertedLeads = assignedLeads.filter(
          (l) => l.status === "convertido" || l.pipeline_stage === "ganho"
        );
        const revenue = convertedLeads.reduce((acc, l) => acc + (l.value || 0), 0);
        const conversionRate =
          assignedLeads.length > 0
            ? (convertedLeads.length / assignedLeads.length) * 100
            : 0;

        return {
          ...member,
          totalLeads: assignedLeads.length,
          converted: convertedLeads.length,
          revenue,
          conversionRate,
        };
      })
      .sort((a, b) => b.converted - a.converted);
  }, [teamMembers, leads]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (memberStats.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance do Time</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhum membro ativo na equipe.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Performance do Time</h3>
          <p className="text-sm text-muted-foreground">Ranking por conversões</p>
        </div>
      </div>

      <div className="space-y-4">
        {memberStats.slice(0, 5).map((member, index) => {
          const roleConfig = ROLE_CONFIG[member.role];
          
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {/* Rank */}
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">#{index + 1}</span>
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">{member.name}</p>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 ${roleConfig.color} text-white`}
                  >
                    {roleConfig.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span>{member.totalLeads} leads</span>
                  <span>•</span>
                  <span className="text-emerald">{member.converted} conv.</span>
                  <span>•</span>
                  <span>{member.conversionRate.toFixed(0)}%</span>
                </div>
              </div>

              {/* Revenue */}
              <div className="text-right">
                <p className="font-semibold text-foreground">{formatCurrency(member.revenue)}</p>
                <p className="text-xs text-muted-foreground">faturado</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPerformance;
