import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMember, ROLE_CONFIG } from "@/types/crm";
import { UserX } from "lucide-react";

interface LeadAssignSelectProps {
  value: string | null;
  teamMembers: TeamMember[];
  onValueChange: (value: string | null) => void;
  disabled?: boolean;
}

const LeadAssignSelect = ({
  value,
  teamMembers,
  onValueChange,
  disabled = false,
}: LeadAssignSelectProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedMember = value 
    ? teamMembers.find((m) => m.id === value) 
    : null;

  return (
    <Select
      value={value || "unassigned"}
      onValueChange={(v) => onValueChange(v === "unassigned" ? null : v)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedMember ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={selectedMember.avatar_url || undefined} />
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                  {getInitials(selectedMember.name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-xs">{selectedMember.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserX className="h-4 w-4" />
              <span className="text-xs">Sem responsável</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserX className="h-4 w-4" />
            <span>Sem responsável</span>
          </div>
        </SelectItem>
        {teamMembers
          .filter((m) => m.is_active)
          .map((member) => (
            <SelectItem key={member.id} value={member.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <span>{member.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${ROLE_CONFIG[member.role].color} text-white`}>
                  {ROLE_CONFIG[member.role].label}
                </span>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default LeadAssignSelect;
