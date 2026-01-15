import { motion } from "framer-motion";
import { Edit2, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamMember, ROLE_CONFIG } from "@/types/crm";

interface TeamMemberCardProps {
  member: TeamMember;
  metrics: {
    leads: number;
    converted: number;
    revenue: number;
    meetings: number;
    conversionRate: number;
  };
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamMemberCard = ({
  member,
  metrics,
  index,
  onEdit,
  onDelete,
}: TeamMemberCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors ${
        !member.is_active ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            {member.is_active && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald rounded-full border-2 border-card" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{member.name}</h3>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${ROLE_CONFIG[member.role].color} text-white`}>
              {ROLE_CONFIG[member.role].label}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="gap-2">
              <Edit2 className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete} 
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {member.email && (
        <p className="text-xs text-muted-foreground mb-4 truncate">{member.email}</p>
      )}

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <div>
          <p className="text-lg font-bold text-foreground">{metrics.leads}</p>
          <p className="text-[10px] text-muted-foreground">Leads</p>
        </div>
        <div>
          <p className="text-lg font-bold text-emerald">{metrics.converted}</p>
          <p className="text-[10px] text-muted-foreground">Conversões</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{formatCurrency(metrics.revenue)}</p>
          <p className="text-[10px] text-muted-foreground">Faturamento</p>
        </div>
        <div>
          <p className="text-lg font-bold text-violet">{metrics.conversionRate.toFixed(0)}%</p>
          <p className="text-[10px] text-muted-foreground">Taxa Conv.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;
