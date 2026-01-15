import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyGoal, Goal, AppRole } from "@/types/crm";
import { Users, TrendingUp, Target, DollarSign, Calendar, LucideIcon } from "lucide-react";

interface GoalEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: CompanyGoal | Goal | null;
  type: "company" | "individual";
  memberName?: string;
  memberRole?: AppRole;
  onSave: (data: Partial<CompanyGoal | Goal>) => Promise<void>;
}

interface GoalField {
  id: string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  value: number;
  onChange: (value: number) => void;
  isCurrency?: boolean;
  roles?: AppRole[]; // Which roles should see this field
}

const GoalEditDialog = ({
  open,
  onOpenChange,
  goal,
  type,
  memberName,
  memberRole,
  onSave,
}: GoalEditDialogProps) => {
  const [leadsGoal, setLeadsGoal] = useState(0);
  const [contactsGoal, setContactsGoal] = useState(0);
  const [conversionsGoal, setConversionsGoal] = useState(0);
  const [meetingsGoal, setMeetingsGoal] = useState(0);
  const [revenueGoal, setRevenueGoal] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (goal) {
      setLeadsGoal(goal.leads_goal || 0);
      setContactsGoal(goal.contacts_goal || 0);
      setConversionsGoal(goal.conversions_goal || 0);
      setMeetingsGoal((goal as CompanyGoal).meetings_goal || 0);
      setRevenueGoal(goal.revenue_goal || 0);
    } else {
      setLeadsGoal(0);
      setContactsGoal(0);
      setConversionsGoal(0);
      setMeetingsGoal(0);
      setRevenueGoal(0);
    }
  }, [goal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        leads_goal: leadsGoal,
        contacts_goal: contactsGoal,
        conversions_goal: conversionsGoal,
        meetings_goal: meetingsGoal,
        revenue_goal: revenueGoal,
      });
    } finally {
      setSaving(false);
    }
  };

  const currentMonth = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  // Define fields with role visibility
  // SDR: leads, contacts, meetings (agendadas)
  // Closer: conversions, revenue, meetings (realizadas)
  // Manager/Admin/Company: all
  const allGoalFields: GoalField[] = [
    {
      id: "leads",
      label: "Meta de Leads",
      icon: Users,
      iconColor: "text-blue-500",
      value: leadsGoal,
      onChange: setLeadsGoal,
      roles: ["sdr", "manager", "admin"],
    },
    {
      id: "contacts",
      label: "Meta de Contatos",
      icon: TrendingUp,
      iconColor: "text-violet",
      value: contactsGoal,
      onChange: setContactsGoal,
      roles: ["sdr", "manager", "admin"],
    },
    {
      id: "meetings",
      label: type === "company" ? "Meta de Reuniões" : memberRole === "sdr" ? "Meta de Reuniões Agendadas" : "Meta de Reuniões Realizadas",
      icon: Calendar,
      iconColor: "text-amber-500",
      value: meetingsGoal,
      onChange: setMeetingsGoal,
      roles: ["sdr", "closer", "manager", "admin"],
    },
    {
      id: "conversions",
      label: "Meta de Conversões",
      icon: Target,
      iconColor: "text-emerald",
      value: conversionsGoal,
      onChange: setConversionsGoal,
      roles: ["closer", "manager", "admin"],
    },
    {
      id: "revenue",
      label: "Meta de Faturamento (R$)",
      icon: DollarSign,
      iconColor: "text-emerald",
      value: revenueGoal,
      onChange: setRevenueGoal,
      isCurrency: true,
      roles: ["closer", "manager", "admin"],
    },
  ];

  // Filter fields based on type and role
  const goalFields = type === "company" 
    ? allGoalFields 
    : allGoalFields.filter(field => !field.roles || field.roles.includes(memberRole || "admin"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === "company" 
              ? "Metas da Empresa" 
              : `Metas de ${memberName}`
            }
          </DialogTitle>
          <p className="text-sm text-muted-foreground capitalize">{currentMonth}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {goalFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center gap-2">
                <field.icon className={`h-4 w-4 ${field.iconColor}`} />
                {field.label}
              </Label>
              <Input
                id={field.id}
                type="number"
                min={0}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          ))}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Metas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalEditDialog;
