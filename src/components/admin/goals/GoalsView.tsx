import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Edit2, Target, TrendingUp, DollarSign, Calendar, Phone, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyGoal, Goal, TeamMember, Lead, ROLE_CONFIG } from "@/types/crm";
import GoalCard from "./GoalCard";
import GoalEditDialog from "./GoalEditDialog";

interface GoalsViewProps {
  companyGoals: CompanyGoal[];
  goals: Goal[];
  teamMembers: TeamMember[];
  leads: Lead[];
  onUpdateCompanyGoal: (id: string, data: Partial<CompanyGoal>) => Promise<boolean | void>;
  onCreateCompanyGoal: (data: Omit<CompanyGoal, "id" | "created_at" | "updated_at">) => Promise<CompanyGoal | null | void>;
  onUpdateGoal: (id: string, data: Partial<Goal>) => Promise<boolean | void>;
  onCreateGoal: (data: Omit<Goal, "id" | "created_at" | "updated_at">) => Promise<Goal | null | void>;
  onRefresh?: () => Promise<void>;
  // Role-based permissions
  currentUserRole?: "admin" | "manager" | "sdr" | "closer";
  currentTeamMemberId?: string | null;
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
  currentUserRole,
  currentTeamMemberId,
}: GoalsViewProps) => {
  const [editingGoal, setEditingGoal] = useState<EditingGoal | null>(null);

  // Permission checks
  const isAdminOrManager = currentUserRole === "admin" || currentUserRole === "manager";
  const canEditCompanyGoals = isAdminOrManager;
  const canEditOtherMemberGoals = isAdminOrManager;
  const canSeeAllMembers = isAdminOrManager;

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

  const getMemberMetrics = (memberId: string, role: string) => {
    // SDR metrics: based on created_by, contacted_by, and meeting_scheduled_by
    // Closer metrics: based on assigned_to and closed_by
    
    if (role === "sdr") {
      // SDR - Count leads they created, contacted, or scheduled meetings for
      const leadsCreated = leads.filter((l) => l.created_by === memberId).length;
      const leadsContacted = leads.filter((l) => l.contacted_by === memberId).length;
      const meetingsScheduled = leads.filter((l) => l.meeting_scheduled_by === memberId).length;
      
      return {
        leads: leadsCreated,
        contacts: leadsContacted,
        conversions: 0,
        revenue: 0,
        meetings: meetingsScheduled,
        meetingsCompleted: 0,
        noShows: 0,
      };
    } else if (role === "closer") {
      // Closer - Count leads assigned to them or closed by them
      const assignedLeads = leads.filter((l) => l.assigned_to === memberId);
      const closedByMember = leads.filter((l) => l.closed_by === memberId);
      const wonByMember = closedByMember.filter((l) => l.pipeline_stage === "ganho");
      
      return {
        leads: assignedLeads.length,
        contacts: assignedLeads.filter((l) => l.status === "contactado" || l.last_contact_date).length,
        conversions: wonByMember.length,
        revenue: wonByMember.reduce((acc, l) => acc + (l.value || 0), 0),
        meetings: assignedLeads.filter((l) => l.meeting_scheduled).length,
        meetingsCompleted: assignedLeads.filter((l) => l.meeting_completed).length,
        noShows: assignedLeads.filter((l) => l.no_show).length,
      };
    } else {
      // Manager/Admin - All leads
      const memberLeads = leads.filter((l) => l.assigned_to === memberId);
      return {
        leads: memberLeads.length,
        contacts: memberLeads.filter((l) => l.status === "contactado" || l.last_contact_date).length,
        conversions: memberLeads.filter((l) => l.pipeline_stage === "ganho").length,
        revenue: memberLeads
          .filter((l) => l.pipeline_stage === "ganho")
          .reduce((acc, l) => acc + (l.value || 0), 0),
        meetings: memberLeads.filter((l) => l.meeting_scheduled).length,
        meetingsCompleted: memberLeads.filter((l) => l.meeting_completed).length,
        noShows: memberLeads.filter((l) => l.no_show).length,
      };
    }
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

  // Group team members by role - filter based on permissions
  const filterByVisibility = (members: TeamMember[]) => {
    if (canSeeAllMembers) return members;
    // SDR/Closer can only see their own goals
    return members.filter((m) => m.id === currentTeamMemberId);
  };

  const sdrs = filterByVisibility(teamMembers.filter((m) => m.role === "sdr" && m.is_active));
  const closers = filterByVisibility(teamMembers.filter((m) => m.role === "closer" && m.is_active));
  const managers = canSeeAllMembers 
    ? teamMembers.filter((m) => (m.role === "manager" || m.role === "admin") && m.is_active)
    : [];

  // Check if user can edit a specific member's goal - ONLY Admin/Manager can edit
  const canEditMemberGoal = (memberId: string) => {
    // SDRs and Closers cannot edit any goals (not even their own)
    return canEditOtherMemberGoals;
  };

  const renderMemberGoalCard = (member: TeamMember, index: number) => {
    const memberGoal = getMemberGoal(member.id);
    const metrics = getMemberMetrics(member.id, member.role);
    const isSDR = member.role === "sdr";
    const isCloser = member.role === "closer";
    const roleConfig = ROLE_CONFIG[member.role];
    const canEdit = canEditMemberGoal(member.id);

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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${roleConfig.color}`}>
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <Badge variant="outline" className="text-[10px]">
                {roleConfig.label}
              </Badge>
            </div>
          </div>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditMemberGoal(member.id)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              {memberGoal ? "Editar" : "Definir Metas"}
            </Button>
          )}
        </div>

        {/* Role-specific metrics */}
        {isSDR ? (
          // SDR Focus: Meetings Scheduled
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <GoalCard
              title="Reuniões Agendadas"
              icon={Calendar}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              current={metrics.meetings}
              goal={memberGoal?.meetings_goal || 0}
              compact
            />
            <GoalCard
              title="Leads Captados"
              icon={Users}
              iconColor="text-violet"
              iconBg="bg-violet/10"
              current={metrics.leads}
              goal={memberGoal?.leads_goal || 0}
              compact
            />
            <GoalCard
              title="Contatos"
              icon={Phone}
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
              current={metrics.contacts}
              goal={memberGoal?.contacts_goal || 0}
              compact
            />
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground mb-1">Taxa de Conversão</p>
              <p className="text-xl font-bold text-emerald">
                {metrics.leads > 0 ? ((metrics.meetings / metrics.leads) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-[10px] text-muted-foreground">Lead → Reunião</p>
            </div>
          </div>
        ) : isCloser ? (
          // Closer Focus: Conversions & Revenue
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <GoalCard
              title="Vendas Fechadas"
              icon={Target}
              iconColor="text-emerald"
              iconBg="bg-emerald/10"
              current={metrics.conversions}
              goal={memberGoal?.conversions_goal || 0}
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
            <GoalCard
              title="Reuniões Realizadas"
              icon={UserCheck}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              current={metrics.meetingsCompleted}
              goal={memberGoal?.meetings_goal || 0}
              compact
            />
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground mb-1">Taxa de Fechamento</p>
              <p className="text-xl font-bold text-emerald">
                {metrics.meetingsCompleted > 0 ? ((metrics.conversions / metrics.meetingsCompleted) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-[10px] text-muted-foreground">Reunião → Venda</p>
            </div>
          </div>
        ) : (
          // Managers/Admins: All metrics
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
        )}
      </motion.div>
    );
  };

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
          {canEditCompanyGoals && (
            <Button variant="outline" size="sm" onClick={handleEditCompanyGoal} className="gap-2">
              <Edit2 className="h-4 w-4" />
              Editar Metas
            </Button>
          )}
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
            title="Reuniões"
            icon={Calendar}
            iconColor="text-amber-500"
            iconBg="bg-amber-500/10"
            current={getActualMetrics.meetings}
            goal={currentCompanyGoal?.meetings_goal || 0}
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

      {/* SDR Goals - Focus on Meetings */}
      {sdrs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Metas SDR</h2>
              <p className="text-sm text-muted-foreground">
                Meta principal: Reuniões Agendadas
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {sdrs.map((member, index) => renderMemberGoalCard(member, index))}
          </div>
        </div>
      )}

      {/* Closer Goals - Focus on Conversions & Revenue */}
      {closers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald/10">
              <DollarSign className="h-5 w-5 text-emerald" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Metas Closer</h2>
              <p className="text-sm text-muted-foreground">
                Meta principal: Conversão e Faturamento
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {closers.map((member, index) => renderMemberGoalCard(member, index))}
          </div>
        </div>
      )}

      {/* Manager/Admin Goals */}
      {managers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet/10">
              <Users className="h-5 w-5 text-violet" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Metas Gestão</h2>
              <p className="text-sm text-muted-foreground">
                Visão completa de todas as métricas
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {managers.map((member, index) => renderMemberGoalCard(member, index))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {sdrs.length === 0 && closers.length === 0 && managers.length === 0 && (
        <div className="text-center py-8 bg-card border border-border rounded-xl">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum membro da equipe cadastrado</p>
        </div>
      )}

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
        memberRole={
          editingGoal?.type === "individual" && editingGoal.memberId
            ? teamMembers.find((m) => m.id === editingGoal.memberId)?.role
            : undefined
        }
        onSave={handleSaveGoal}
      />
    </div>
  );
};

export default GoalsView;
