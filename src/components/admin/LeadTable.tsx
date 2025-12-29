import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Phone, FileText, Users, Loader2 } from "lucide-react";
import LeadStatusBadge, { LeadStatus } from "./LeadStatusBadge";
import LeadStatusSelect from "./LeadStatusSelect";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onOpenNotes: (lead: Lead) => void;
  updatingLeadId: string | null;
}

const LeadTable = ({
  leads,
  loading,
  onStatusChange,
  onOpenNotes,
  updatingLeadId,
}: LeadTableProps) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nenhum lead encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-[80px]">Notas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-emerald hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  {lead.email}
                </a>
              </TableCell>
              <TableCell>
                <a
                  href={`https://wa.me/55${lead.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  {formatWhatsApp(lead.whatsapp)}
                </a>
              </TableCell>
              <TableCell>
                <LeadStatusSelect
                  value={lead.status}
                  onValueChange={(value) => onStatusChange(lead.id, value)}
                  disabled={updatingLeadId === lead.id}
                />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(lead.created_at)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenNotes(lead)}
                  className={lead.notes ? "text-emerald" : "text-muted-foreground"}
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
