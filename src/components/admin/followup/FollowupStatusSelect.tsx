import { useState } from "react";
import { Check, Clock, Send, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FollowupStatus, FOLLOWUP_STATUS_CONFIG } from "@/types/crm";
import { cn } from "@/lib/utils";

interface FollowupStatusSelectProps {
  status: FollowupStatus;
  onStatusChange: (status: FollowupStatus) => Promise<void>;
  disabled?: boolean;
}

const statusIcons: Record<FollowupStatus, React.ReactNode> = {
  pendente: <Clock className="w-3 h-3" />,
  enviado: <Send className="w-3 h-3" />,
  respondido: <MessageCircle className="w-3 h-3" />,
  sem_resposta: <AlertCircle className="w-3 h-3" />,
  concluido: <CheckCircle2 className="w-3 h-3" />,
};

const FollowupStatusSelect = ({
  status,
  onStatusChange,
  disabled = false,
}: FollowupStatusSelectProps) => {
  const [updating, setUpdating] = useState(false);
  // Ensure we always have a valid status, defaulting to 'pendente'
  const currentStatus: FollowupStatus = status || 'pendente';
  const config = FOLLOWUP_STATUS_CONFIG[currentStatus];

  const handleChange = async (newStatus: FollowupStatus) => {
    if (newStatus === currentStatus || !newStatus) return;
    setUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={disabled || updating}
    >
      <SelectTrigger
        className={cn(
          "h-8 w-[140px] text-xs font-medium border-0",
          config.color,
          "text-white hover:opacity-90"
        )}
      >
        <SelectValue>
          <span className="flex items-center gap-1.5">
            {statusIcons[currentStatus]}
            {config.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(FOLLOWUP_STATUS_CONFIG) as FollowupStatus[]).map(
          (statusKey) => {
            const statusConfig = FOLLOWUP_STATUS_CONFIG[statusKey];
            return (
              <SelectItem
                key={statusKey}
                value={statusKey}
                className="text-xs"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "p-1 rounded",
                      statusConfig.color,
                      "text-white"
                    )}
                  >
                    {statusIcons[statusKey]}
                  </span>
                  {statusConfig.label}
                  {statusKey === currentStatus && (
                    <Check className="w-3 h-3 ml-auto text-primary" />
                  )}
                </span>
              </SelectItem>
            );
          }
        )}
      </SelectContent>
    </Select>
  );
};

export default FollowupStatusSelect;