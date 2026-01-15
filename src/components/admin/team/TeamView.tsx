import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Users, UserCheck, Phone, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMember, Lead, AppRole, ROLE_CONFIG } from "@/types/crm";
import TeamMemberCard from "./TeamMemberCard";
import TeamMemberDialog from "./TeamMemberDialog";

interface TeamViewProps {
  teamMembers: TeamMember[];
  leads: Lead[];
  onCreateMember: (data: Omit<TeamMember, "id" | "created_at" | "updated_at">) => Promise<void>;
  onUpdateMember: (id: string, data: Partial<TeamMember>) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
}

const TeamView = ({
  teamMembers,
  leads,
  onCreateMember,
  onUpdateMember,
  onDeleteMember,
}: TeamViewProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const stats = useMemo(() => {
    const sdrs = teamMembers.filter((m) => m.role === "sdr" && m.is_active);
    const closers = teamMembers.filter((m) => m.role === "closer" && m.is_active);
    const managers = teamMembers.filter((m) => m.role === "manager" && m.is_active);
    
    return {
      total: teamMembers.filter((m) => m.is_active).length,
      sdrs: sdrs.length,
      closers: closers.length,
      managers: managers.length,
    };
  }, [teamMembers]);

  const getMemberMetrics = (memberId: string) => {
    const memberLeads = leads.filter((l) => l.assigned_to === memberId);
    const converted = memberLeads.filter((l) => l.pipeline_stage === "ganho");
    const revenue = converted.reduce((acc, l) => acc + (l.value || 0), 0);
    const meetings = memberLeads.filter((l) => l.meeting_completed).length;
    const conversionRate = memberLeads.length > 0 
      ? (converted.length / memberLeads.length) * 100 
      : 0;

    return {
      leads: memberLeads.length,
      converted: converted.length,
      revenue,
      meetings,
      conversionRate,
    };
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleSave = async (data: Omit<TeamMember, "id" | "created_at" | "updated_at">) => {
    if (editingMember) {
      await onUpdateMember(editingMember.id, data);
    } else {
      await onCreateMember(data);
    }
    setDialogOpen(false);
    setEditingMember(null);
  };

  const groupedMembers = useMemo(() => {
    const groups: Record<AppRole, TeamMember[]> = {
      admin: [],
      manager: [],
      sdr: [],
      closer: [],
    };

    teamMembers.forEach((member) => {
      if (groups[member.role]) {
        groups[member.role].push(member);
      }
    });

    return groups;
  }, [teamMembers]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Ativos</p>
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
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Phone className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.sdrs}</p>
              <p className="text-xs text-muted-foreground">SDRs</p>
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
            <div className="p-2 rounded-lg bg-emerald/10">
              <Target className="h-5 w-5 text-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.closers}</p>
              <p className="text-xs text-muted-foreground">Closers</p>
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
            <div className="p-2 rounded-lg bg-blue-500/10">
              <UserCheck className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.managers}</p>
              <p className="text-xs text-muted-foreground">Gerentes</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Member Button */}
      <div className="flex justify-end">
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      {/* Team Members by Role */}
      {(["manager", "sdr", "closer"] as AppRole[]).map((role) => {
        const members = groupedMembers[role];
        if (members.length === 0) return null;

        return (
          <div key={role} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_CONFIG[role].color} text-white`}>
                {ROLE_CONFIG[role].label}s
              </span>
              <span className="text-sm text-muted-foreground">
                ({members.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  metrics={getMemberMetrics(member.id)}
                  index={index}
                  onEdit={() => handleOpenEdit(member)}
                  onDelete={() => onDeleteMember(member.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum membro cadastrado</p>
          <Button onClick={handleOpenCreate} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Primeiro Membro
          </Button>
        </div>
      )}

      <TeamMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        onSave={handleSave}
      />
    </div>
  );
};

export default TeamView;
