import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LeadStatus } from "./LeadStatusBadge";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

interface ExportButtonProps {
  leads: Lead[];
  disabled?: boolean;
}

const statusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  contactado: "Contactado",
  convertido: "Convertido",
  perdido: "Perdido",
};

const ExportButton = ({ leads, disabled }: ExportButtonProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatWhatsApp = (phone: string) => {
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

  const exportToCSV = () => {
    const headers = ["Nome", "Email", "WhatsApp", "Status", "Notas", "Data de Cadastro"];
    
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      formatWhatsApp(lead.whatsapp),
      statusLabels[lead.status],
      lead.notes?.replace(/"/g, '""') || "",
      formatDate(lead.created_at),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const today = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${today}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToCSV}
      disabled={disabled || leads.length === 0}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      Exportar CSV
    </Button>
  );
};

export default ExportButton;
