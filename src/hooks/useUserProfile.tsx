import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppRole, TeamMember } from "@/types/crm";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  roles: AppRole[];
  teamMember: TeamMember | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSdr: boolean;
  isCloser: boolean;
  hasRole: (role: AppRole) => boolean;
  refreshProfile: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setRoles([]);
      setTeamMember(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData as UserProfile);
      }

      // Fetch roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (rolesData) {
        setRoles(rolesData.map((r) => r.role as AppRole));
      }

      // Fetch team member
      const { data: teamData } = await supabase
        .from("team_members")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (teamData) {
        setTeamMember(teamData as TeamMember);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const hasRole = useCallback(
    (role: AppRole) => roles.includes(role),
    [roles]
  );

  return {
    profile,
    roles,
    teamMember,
    loading,
    isAdmin: hasRole("admin"),
    isManager: hasRole("manager"),
    isSdr: hasRole("sdr"),
    isCloser: hasRole("closer"),
    hasRole,
    refreshProfile: fetchProfile,
  };
};
