// CRM Types - Shared across all components

export type AppRole = 'admin' | 'manager' | 'sdr' | 'closer';

export type PipelineStage = 
  | 'novo'
  | 'prospeccao'
  | 'qualificado'
  | 'negociacao'
  | 'proposta'
  | 'ganho'
  | 'perdido';

export type LeadStatus = 'novo' | 'contactado' | 'convertido' | 'perdido';

export type FollowupStatus = 'pendente' | 'enviado' | 'respondido' | 'sem_resposta' | 'concluido';

export type ActivityType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'note' | 'status_change';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  avatar_url: string | null;
  role: AppRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  team_member_id: string | null;
  month: number;
  year: number;
  leads_goal: number;
  contacts_goal: number;
  conversions_goal: number;
  revenue_goal: number;
  meetings_goal: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyGoal {
  id: string;
  month: number;
  year: number;
  leads_goal: number;
  contacts_goal: number;
  conversions_goal: number;
  revenue_goal: number;
  meetings_goal: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  next_followup_date: string | null;
  followup_notes: string | null;
  last_contact_date: string | null;
  // CRM fields
  assigned_to: string | null;
  value: number;
  source: string | null;
  qualified_by: string | null;
  closed_by: string | null;
  closed_at: string | null;
  lost_reason: string | null;
  pipeline_stage: PipelineStage;
  stage_changed_at: string | null;
  // Meeting tracking
  meeting_scheduled: boolean;
  meeting_date: string | null;
  meeting_completed: boolean;
  no_show: boolean;
  // Follow-up tracking
  followup_status: FollowupStatus;
  // Action tracking - who did what
  created_by: string | null;
  contacted_by: string | null;
  contacted_at: string | null;
  meeting_scheduled_by: string | null;
  followup_by: string | null;
}

export interface Activity {
  id: string;
  lead_id: string;
  team_member_id: string | null;
  type: ActivityType;
  description: string | null;
  created_at: string;
  // Joined data
  team_member?: TeamMember;
}

// View types for admin
export type AdminView = 
  | 'dashboard' 
  | 'pipeline' 
  | 'leads' 
  | 'followups' 
  | 'meetings'
  | 'team' 
  | 'goals' 
  | 'reports'
  | 'settings';

// Pipeline stage config
export const PIPELINE_STAGES: { stage: PipelineStage; label: string; color: string }[] = [
  { stage: 'novo', label: 'Novo', color: 'bg-slate-500' },
  { stage: 'prospeccao', label: 'Prospecção', color: 'bg-blue-500' },
  { stage: 'qualificado', label: 'Qualificado', color: 'bg-amber-500' },
  { stage: 'negociacao', label: 'Negociação', color: 'bg-purple-500' },
  { stage: 'proposta', label: 'Proposta', color: 'bg-cyan-500' },
  { stage: 'ganho', label: 'Ganho', color: 'bg-emerald-500' },
  { stage: 'perdido', label: 'Perdido', color: 'bg-red-500' },
];

// Role config
export const ROLE_CONFIG: Record<AppRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-violet-500' },
  manager: { label: 'Gerente', color: 'bg-blue-500' },
  sdr: { label: 'SDR', color: 'bg-amber-500' },
  closer: { label: 'Closer', color: 'bg-emerald-500' },
};

// Followup status config
export const FOLLOWUP_STATUS_CONFIG: Record<FollowupStatus, { label: string; color: string; icon: string }> = {
  pendente: { label: 'Pendente', color: 'bg-slate-500', icon: 'clock' },
  enviado: { label: 'Enviado', color: 'bg-blue-500', icon: 'send' },
  respondido: { label: 'Respondido', color: 'bg-emerald-500', icon: 'message-circle' },
  sem_resposta: { label: 'Sem Resposta', color: 'bg-amber-500', icon: 'alert-circle' },
  concluido: { label: 'Concluído', color: 'bg-green-500', icon: 'check-circle' },
};

// Date range type
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
