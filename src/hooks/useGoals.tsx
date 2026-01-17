import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Goal, CompanyGoal } from "@/types/crm";

interface UseGoalsReturn {
  goals: Goal[];
  companyGoals: CompanyGoal[];
  loading: boolean;
  createGoal: (data: Omit<Goal, "id" | "created_at" | "updated_at">) => Promise<Goal | null>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  createCompanyGoal: (data: Omit<CompanyGoal, "id" | "created_at" | "updated_at">) => Promise<CompanyGoal | null>;
  updateCompanyGoal: (id: string, data: Partial<CompanyGoal>) => Promise<boolean>;
  getGoalByMemberAndMonth: (memberId: string, month: number, year: number) => Goal | undefined;
  getCompanyGoalByMonth: (month: number, year: number) => CompanyGoal | undefined;
  getCurrentMonthGoals: () => { individual: Goal[]; company: CompanyGoal | undefined };
  refreshGoals: () => Promise<void>;
}

export const useGoals = (): UseGoalsReturn => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [companyGoals, setCompanyGoals] = useState<CompanyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch individual goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("goals")
        .select("*")
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (goalsError) throw goalsError;
      setGoals((goalsData as Goal[]) || []);

      // Fetch company goals
      const { data: companyData, error: companyError } = await supabase
        .from("company_goals")
        .select("*")
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (companyError) throw companyError;
      setCompanyGoals((companyData as CompanyGoal[]) || []);
    } catch (error: any) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Erro ao carregar metas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGoals();

    // Subscribe to realtime changes
    const goalsChannel = supabase
      .channel("goals_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "goals" },
        () => fetchGoals()
      )
      .subscribe();

    const companyChannel = supabase
      .channel("company_goals_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "company_goals" },
        () => fetchGoals()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(goalsChannel);
      supabase.removeChannel(companyChannel);
    };
  }, [fetchGoals]);

  const createGoal = async (
    data: Omit<Goal, "id" | "created_at" | "updated_at">
  ): Promise<Goal | null> => {
    try {
      const { data: newGoal, error } = await supabase
        .from("goals")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Meta criada",
        description: "A meta individual foi criada com sucesso.",
      });

      return newGoal as Goal;
    } catch (error: any) {
      console.error("Error creating goal:", error);
      toast({
        title: "Erro ao criar meta",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateGoal = async (id: string, data: Partial<Goal>): Promise<boolean> => {
    try {
      const { error } = await supabase.from("goals").update(data).eq("id", id);

      if (error) throw error;

      // Immediately refresh goals to ensure UI is updated
      await fetchGoals();

      toast({
        title: "Meta atualizada",
        description: "A meta foi atualizada com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Error updating goal:", error);
      toast({
        title: "Erro ao atualizar meta",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteGoal = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("goals").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Meta removida",
        description: "A meta foi removida com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Erro ao remover meta",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const createCompanyGoal = async (
    data: Omit<CompanyGoal, "id" | "created_at" | "updated_at">
  ): Promise<CompanyGoal | null> => {
    try {
      const { data: newGoal, error } = await supabase
        .from("company_goals")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Meta da empresa criada",
        description: "A meta mensal da empresa foi criada com sucesso.",
      });

      return newGoal as CompanyGoal;
    } catch (error: any) {
      console.error("Error creating company goal:", error);
      toast({
        title: "Erro ao criar meta",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCompanyGoal = async (
    id: string,
    data: Partial<CompanyGoal>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("company_goals")
        .update(data)
        .eq("id", id);

      if (error) throw error;

      // Immediately refresh goals to ensure UI is updated
      await fetchGoals();

      toast({
        title: "Meta atualizada",
        description: "A meta da empresa foi atualizada com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Error updating company goal:", error);
      toast({
        title: "Erro ao atualizar meta",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const getGoalByMemberAndMonth = useCallback(
    (memberId: string, month: number, year: number) =>
      goals.find(
        (g) =>
          g.team_member_id === memberId && g.month === month && g.year === year
      ),
    [goals]
  );

  const getCompanyGoalByMonth = useCallback(
    (month: number, year: number) =>
      companyGoals.find((g) => g.month === month && g.year === year),
    [companyGoals]
  );

  const getCurrentMonthGoals = useCallback(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return {
      individual: goals.filter((g) => g.month === month && g.year === year),
      company: companyGoals.find((g) => g.month === month && g.year === year),
    };
  }, [goals, companyGoals]);

  return {
    goals,
    companyGoals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    createCompanyGoal,
    updateCompanyGoal,
    getGoalByMemberAndMonth,
    getCompanyGoalByMonth,
    getCurrentMonthGoals,
    refreshGoals: fetchGoals,
  };
};
