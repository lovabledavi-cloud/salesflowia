import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Edit2, Target, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyGoal, Goal, TeamMember, Lead } from "@/types/crm";
import GoalCard from "./GoalCard";
import GoalEditDialog from "./GoalEditDialog";

interface GoalsViewProps {
  companyGoals: CompanyGoal[];
  goals: Goal[];
  teamMembers: TeamMember[];
  leads: Lead[];
  onUpdateCompanyGoal: (id: string, data: Partial<CompanyGoal>) => Promise<void>;
  onCreateCompanyGoal: (data: Omit<CompanyGoal, "id" | "created_at" | "updated_at">) => Promise<void>;
  onUpdateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  onCreateGoal: (data: Omit<Goal, "id" | "created_at" | "updated_at">) => Promise<void>;
}

type GoalType = "company" | "individual";

interface EditingGoal {
  type: GoalType;
  goal: CompanyGoal | Goal | null;
  memberId?: string;
}

const GoalsView = ({
  companyGoals,
  goals,
  teamMembers,
  leads,
  onUpdateCompanyGoal,
  onCreateCompanyGoal,
  onUpdateGoal,
  onCreateGoal,
}: GoalsViewProps) => {
  const [editingGoal, setEditingGoal] = useState<EditingGoal | null>(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const currentCompanyGoal = useMemo(() => {
    return companyGoals.find(
      (g) => g.month === currentMonth && g.year === currentYear
    );
  }, [companyGoals, currentMonth, currentYear]);

  const getActualMetrics = useMemo(() => {
    const totalLeads = leads.length;
    const contactedLeads = leads.filter((l) => l.status === "contactado" || l.last_contact_date).length;
    const convertedLeads = leads.filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho").length;
    const revenue = leads
      .filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho")
      .reduce((acc, l) => acc + (l.value || 0), 0);
    const meetings = leads.filter((l) => l.meeting_scheduled).length;

    return { totalLeads, contactedLeads, convertedLeads, revenue, meetings };
  }, [leads]);

  const getMemberMetrics = (memberId: string) => {
    const memberLeads = leads.filter((l) => l.assigned_to === memberId);
    return {
      leads: memberLeads.length,
      contacts: memberLeads.filter((l) => l.status === "contactado" || l.last_contact_date).length,
      conversions: memberLeads.filter((l) => l.pipeline_stage === "ganho").length,
      revenue: memberLeads
        .filter((l) => l.pipeline_stage === "ganho")
        .reduce((acc, l) => acc + (l.value || 0), 0),
      meetings: memberLeads.filter((l) => l.meeting_scheduled).length,
    };
  };

  const getMemberGoal = (memberId: string) => {
    return goals.find(
      (g) => g.team_member_id === memberId && g.month === currentMonth && g.year === currentYear
    );
  };

  const handleEditCompanyGoal = () => {
    setEditingGoal({
      type: "company",
      goal: currentCompanyGoal || null,
    });
  };

  const handleEditMemberGoal = (memberId: string) => {
    const memberGoal = getMemberGoal(memberId);
    setEditingGoal({
      type: "individual",
      goal: memberGoal || null,
      memberId,
    });
  };

  const handleSaveGoal = async (data: Partial<CompanyGoal | Goal>) => {
    if (!editingGoal) return;

    if (editingGoal.type === "company") {
      if (editingGoal.goal) {
        await onUpdateCompanyGoal(editingGoal.goal.id, data as Partial<CompanyGoal>);
      } else {
        await onCreateCompanyGoal({
          month: currentMonth,
          year: currentYear,
          leads_goal: data.leads_goal || 0,
          contacts_goal: data.contacts_goal || 0,
          conversions_goal: data.conversions_goal || 0,
          revenue_goal: data.revenue_goal || 0,
          meetings_goal: (data as Partial<CompanyGoal>).meetings_goal || 0,
        });
      }
    } else {
      if (editingGoal.goal) {
        await onUpdateGoal(editingGoal.goal.id, data as Partial<Goal>);
      } else if (editingGoal.memberId) {
        await onCreateGoal({
          team_member_id: editingGoal.memberId,
          month: currentMonth,
          year: currentYear,
          leads_goal: data.leads_goal || 0,
          contacts_goal: data.contacts_goal || 0,
          conversions_goal: data.conversions_goal || 0,
          revenue_goal: data.revenue_goal || 0,
          meetings_goal: (data as Partial<Goal>).meetings_goal || 0,
        });
      }
    }
    setEditingGoal(null);
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="space-y-8">
      {/* Company Goals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Metas da Empresa</h2>
              <p className="text-sm text-muted-foreground">
                {monthNames[currentMonth - 1]} {currentYear}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleEditCompanyGoal} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Editar Metas
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <GoalCard
            title="Leads"
            icon={Users}
            iconColor="text-blue-500"
            iconBg="bg-blue-500/10"
            current={getActualMetrics.totalLeads}
            goal={currentCompanyGoal?.leads_goal || 0}
          />
          <GoalCard
            title="Contatos"
            icon={TrendingUp}
            iconColor="text-violet"
            iconBg="bg-violet/10"
            current={getActualMetrics.contactedLeads}
            goal={currentCompanyGoal?.contacts_goal || 0}
          />
          <GoalCard
            title="Conversões"
            icon={Target}
            iconColor="text-emerald"
            iconBg="bg-emerald/10"
            current={getActualMetrics.convertedLeads}
            goal={currentCompanyGoal?.conversions_goal || 0}
          />
          <GoalCard
            title="Reuniões"
            icon={Calendar}
            iconColor="text-amber-500"
            iconBg="bg-amber-500/10"
            current={getActualMetrics.meetings}
            goal={currentCompanyGoal?.meetings_goal || 0}
          />
          <GoalCard
            title="Faturamento"
            icon={DollarSign}
            iconColor="text-emerald"
            iconBg="bg-emerald/10"
            current={getActualMetrics.revenue}
            goal={currentCompanyGoal?.revenue_goal || 0}
            isCurrency
          />
        </div>
      </div>

      {/* Individual Goals */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet/10">
            <Users className="h-5 w-5 text-violet" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Metas Individuais</h2>
            <p className="text-sm text-muted-foreground">
              Clique em um membro para definir suas metas
            </p>
          </div>
        </div>

        {teamMembers.filter((m) => m.is_active).length === 0 ? (
          <div className="text-center py-8 bg-card border border-border rounded-xl">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum membro da equipe cadastrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teamMembers
              .filter((m) => m.is_active)
              .map((member, index) => {
                const memberGoal = getMemberGoal(member.id);
                const metrics = getMemberMetrics(member.id);

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <span className="text-xs text-muted-foreground capitalize">{member.role}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMemberGoal(member.id)}
                        className="gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        {memberGoal ? "Editar" : "Definir Metas"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <GoalCard
                        title="Leads"
                        icon={Users}
                        iconColor="text-blue-500"
                        iconBg="bg-blue-500/10"
                        current={metrics.leads}
                        goal={memberGoal?.leads_goal || 0}
                        compact
                      />
                      <GoalCard
                        title="Contatos"
                        icon={TrendingUp}
                        iconColor="text-violet"
                        iconBg="bg-violet/10"
                        current={metrics.contacts}
                        goal={memberGoal?.contacts_goal || 0}
                        compact
                      />
                      <GoalCard
                        title="Conversões"
                        icon={Target}
                        iconColor="text-emerald"
                        iconBg="bg-emerald/10"
                        current={metrics.conversions}
                        goal={memberGoal?.conversions_goal || 0}
                        compact
                      />
                      <GoalCard
                        title="Reuniões"
                        icon={Calendar}
                        iconColor="text-amber-500"
                        iconBg="bg-amber-500/10"
                        current={metrics.meetings}
                        goal={memberGoal?.meetings_goal || 0}
                        compact
                      />
                      <GoalCard
                        title="Faturamento"
                        icon={DollarSign}
                        iconColor="text-emerald"
                        iconBg="bg-emerald/10"
                        current={metrics.revenue}
                        goal={memberGoal?.revenue_goal || 0}
                        isCurrency
                        compact
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}
      </div>

      <GoalEditDialog
        open={!!editingGoal}
        onOpenChange={(open) => !open && setEditingGoal(null)}
        goal={editingGoal?.goal || null}
        type={editingGoal?.type || "company"}
        memberName={
          editingGoal?.type === "individual" && editingGoal.memberId
            ? teamMembers.find((m) => m.id === editingGoal.memberId)?.name
            : undefined
        }
        onSave={handleSaveGoal}
      />
    </div>
  );
};

export default GoalsView;
