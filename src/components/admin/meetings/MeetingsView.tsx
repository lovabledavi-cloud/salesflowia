import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lead, TeamMember } from "@/types/crm";
import MeetingsCalendar from "./MeetingsCalendar";
import MeetingScheduler from "./MeetingScheduler";
import MeetingDetailDialog from "./MeetingDetailDialog";

interface MeetingsViewProps {
  leads: Lead[];
  teamMembers: TeamMember[];
  onLeadUpdate: () => Promise<void>;
  onOpenNotes: (lead: Lead) => void;
}

const MeetingsView = ({
  leads,
  teamMembers,
  onLeadUpdate,
  onOpenNotes,
}: MeetingsViewProps) => {
  const { toast } = useToast();
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [leadToSchedule, setLeadToSchedule] = useState<Lead | null>(null);

  // Get leads without scheduled meetings for the scheduler
  const leadsWithoutMeeting = leads.filter((l) => !l.meeting_scheduled);

  const handleScheduleMeeting = async (data: {
    leadId: string;
    date: Date;
    type: "video" | "presencial" | "phone";
    notes?: string;
    assignedTo?: string;
  }) => {
    const updateData: Record<string, unknown> = {
      meeting_scheduled: true,
      meeting_date: data.date.toISOString(),
      meeting_completed: false,
      no_show: false,
    };

    if (data.assignedTo) {
      updateData.assigned_to = data.assignedTo;
    }

    if (data.notes) {
      updateData.followup_notes = data.notes;
    }

    const { error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", data.leadId);

    if (error) {
      toast({
        title: "Erro ao agendar reunião",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Reunião agendada!",
      description: "A reunião foi agendada com sucesso.",
    });

    await onLeadUpdate();
  };

  const handleSelectMeeting = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailDialogOpen(true);
  };

  const handleMarkCompleted = async (leadId: string, completed: boolean) => {
    const { error } = await supabase
      .from("leads")
      .update({
        meeting_completed: completed,
        no_show: false,
      })
      .eq("id", leadId);

    if (error) {
      toast({
        title: "Erro ao atualizar reunião",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: completed ? "Reunião marcada como realizada!" : "Status atualizado",
    });

    await onLeadUpdate();
    setDetailDialogOpen(false);
  };

  const handleMarkNoShow = async (leadId: string, noShow: boolean) => {
    const { error } = await supabase
      .from("leads")
      .update({
        no_show: noShow,
        meeting_completed: false,
      })
      .eq("id", leadId);

    if (error) {
      toast({
        title: "Erro ao atualizar reunião",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: noShow ? "Marcado como No-Show" : "Status atualizado",
      variant: noShow ? "destructive" : "default",
    });

    await onLeadUpdate();
    setDetailDialogOpen(false);
  };

  const getTeamMember = (id: string | null) => {
    if (!id) return null;
    return teamMembers.find((m) => m.id === id) || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Calendário de Reuniões</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie todas as reuniões agendadas
          </p>
        </div>
        <Button onClick={() => setSchedulerOpen(true)} className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Nova Reunião
        </Button>
      </div>

      {/* Calendar */}
      <MeetingsCalendar
        leads={leads}
        teamMembers={teamMembers}
        onSelectMeeting={handleSelectMeeting}
        onMarkCompleted={(id, completed) => handleMarkCompleted(id, completed)}
        onMarkNoShow={(id, noShow) => handleMarkNoShow(id, noShow)}
      />

      {/* Schedule Meeting Dialog */}
      <MeetingScheduler
        open={schedulerOpen}
        onOpenChange={setSchedulerOpen}
        lead={leadToSchedule || leadsWithoutMeeting[0] || null}
        teamMembers={teamMembers}
        onSchedule={handleScheduleMeeting}
      />

      {/* Meeting Detail Dialog */}
      <MeetingDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        lead={selectedLead}
        teamMember={getTeamMember(selectedLead?.assigned_to || null)}
        onMarkCompleted={(completed) =>
          selectedLead && handleMarkCompleted(selectedLead.id, completed)
        }
        onMarkNoShow={(noShow) =>
          selectedLead && handleMarkNoShow(selectedLead.id, noShow)
        }
        onOpenNotes={() => {
          if (selectedLead) {
            setDetailDialogOpen(false);
            onOpenNotes(selectedLead);
          }
        }}
      />
    </div>
  );
};

export default MeetingsView;
