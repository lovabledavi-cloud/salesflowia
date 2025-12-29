import { Badge } from "@/components/ui/badge";

export type LeadStatus = "novo" | "contactado" | "convertido" | "perdido";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  novo: {
    label: "Novo",
    className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
  },
  contactado: {
    label: "Contactado",
    className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20",
  },
  convertido: {
    label: "Convertido",
    className: "bg-emerald/10 text-emerald hover:bg-emerald/20 border-emerald/20",
  },
  perdido: {
    label: "Perdido",
    className: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
  },
};

const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default LeadStatusBadge;
