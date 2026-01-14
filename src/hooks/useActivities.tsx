import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Activity, ActivityType } from "@/types/crm";

interface UseActivitiesReturn {
  loading: boolean;
  createActivity: (data: {
    lead_id: string;
    team_member_id?: string | null;
    type: ActivityType;
    description?: string;
  }) => Promise<Activity | null>;
  getActivitiesByLead: (leadId: string) => Promise<Activity[]>;
}

export const useActivities = (): UseActivitiesReturn => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createActivity = useCallback(
    async (data: {
      lead_id: string;
      team_member_id?: string | null;
      type: ActivityType;
      description?: string;
    }): Promise<Activity | null> => {
      setLoading(true);
      try {
        const { data: newActivity, error } = await supabase
          .from("activities")
          .insert([
            {
              lead_id: data.lead_id,
              team_member_id: data.team_member_id || null,
              type: data.type,
              description: data.description || null,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        return newActivity as Activity;
      } catch (error: any) {
        console.error("Error creating activity:", error);
        toast({
          title: "Erro ao registrar atividade",
          description: error.message,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const getActivitiesByLead = useCallback(
    async (leadId: string): Promise<Activity[]> => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("activities")
          .select(`
            *,
            team_member:team_members(id, name, avatar_url, role)
          `)
          .eq("lead_id", leadId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        return (data as Activity[]) || [];
      } catch (error: any) {
        console.error("Error fetching activities:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    createActivity,
    getActivitiesByLead,
  };
};
