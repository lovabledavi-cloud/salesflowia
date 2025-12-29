import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadStatus } from "./LeadStatusBadge";

interface LeadStatusSelectProps {
  value: LeadStatus;
  onValueChange: (value: LeadStatus) => void;
  disabled?: boolean;
}

const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  { value: "novo", label: "Novo", color: "bg-blue-500" },
  { value: "contactado", label: "Contactado", color: "bg-yellow-500" },
  { value: "convertido", label: "Convertido", color: "bg-emerald" },
  { value: "perdido", label: "Perdido", color: "bg-red-500" },
];

const LeadStatusSelect = ({ value, onValueChange, disabled }: LeadStatusSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[140px] h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border z-50">
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${option.color}`} />
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LeadStatusSelect;
