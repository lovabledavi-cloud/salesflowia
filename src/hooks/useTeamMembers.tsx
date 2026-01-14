import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TeamMember, AppRole } from "@/types/crm";

interface UseTeamMembersReturn {
  teamMembers: TeamMember[];
  loading: boolean;
  createTeamMember: (data: Omit<TeamMember, "id" | "created_at" | "updated_at">) => Promise<TeamMember | null>;
  updateTeamMember: (id: string, data: Partial<TeamMember>) => Promise<boolean>;
  deleteTeamMember: (id: string) => Promise<boolean>;
  getTeamMemberById: (id: string) => TeamMember | undefined;
  refreshTeamMembers: () => Promise<void>;
}

export const useTeamMembers = (): UseTeamMembersReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setTeamMembers((data as TeamMember[]) || []);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Erro ao carregar equipe",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeamMembers();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("team_members_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_members" },
        () => {
          fetchTeamMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTeamMembers]);

  const createTeamMember = async (
    data: Omit<TeamMember, "id" | "created_at" | "updated_at">
  ): Promise<TeamMember | null> => {
    try {
      const { data: newMember, error } = await supabase
        .from("team_members")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Membro adicionado",
        description: "O membro foi adicionado à equipe com sucesso.",
      });

      return newMember as TeamMember;
    } catch (error: any) {
      console.error("Error creating team member:", error);
      toast({
        title: "Erro ao adicionar membro",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTeamMember = async (
    id: string,
    data: Partial<TeamMember>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update(data)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Membro atualizado",
        description: "Os dados do membro foram atualizados com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Error updating team member:", error);
      toast({
        title: "Erro ao atualizar membro",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTeamMember = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Membro removido",
        description: "O membro foi removido da equipe.",
      });

      return true;
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Erro ao remover membro",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const getTeamMemberById = useCallback(
    (id: string) => teamMembers.find((m) => m.id === id),
    [teamMembers]
  );

  return {
    teamMembers,
    loading,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMemberById,
    refreshTeamMembers: fetchTeamMembers,
  };
};
