import { Lead, TeamMember, DateRange } from "@/types/crm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExportData {
  leads: Lead[];
  teamMembers: TeamMember[];
  dateRange: DateRange;
  periodLabel: string;
  metrics?: {
    total: number;
    converted: number;
    lost: number;
    totalValue: number;
    conversionRate: string;
  };
}

export const exportReportToCSV = ({ leads, teamMembers, dateRange, periodLabel }: ExportData) => {
  // Create CSV content
  const headers = [
    "Nome",
    "Email",
    "WhatsApp",
    "Status",
    "Estágio Pipeline",
    "Origem",
    "Valor",
    "Data Criação",
    "Data Fechamento",
    "Motivo Perda",
    "Responsável",
  ];

  const getTeamMemberName = (id: string | null) => {
    if (!id) return "";
    const member = teamMembers.find((m) => m.id === id);
    return member?.name || "";
  };

  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.whatsapp,
    lead.status,
    lead.pipeline_stage,
    lead.source || "",
    lead.value?.toString() || "0",
    format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    lead.closed_at ? format(new Date(lead.closed_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "",
    lead.lost_reason || "",
    getTeamMemberName(lead.assigned_to),
  ]);

  // Add BOM for UTF-8
  const BOM = "\uFEFF";
  const csvContent = BOM + [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");

  // Download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `relatorio-leads-${periodLabel.toLowerCase().replace(/\s/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportReportToPDF = async ({ 
  leads, 
  teamMembers, 
  dateRange, 
  periodLabel, 
  metrics 
}: ExportData): Promise<void> => {
  // Create a printable HTML content
  const getTeamMemberName = (id: string | null) => {
    if (!id) return "-";
    const member = teamMembers.find((m) => m.id === id);
    return member?.name || "-";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  // Group leads by source
  const sourceStats = leads.reduce((acc, lead) => {
    const source = lead.source || "Não informado";
    if (!acc[source]) {
      acc[source] = { total: 0, converted: 0, value: 0 };
    }
    acc[source].total += 1;
    if (lead.pipeline_stage === "ganho") {
      acc[source].converted += 1;
      acc[source].value += lead.value || 0;
    }
    return acc;
  }, {} as Record<string, { total: number; converted: number; value: number }>);

  // Group by lost reason
  const lostReasons = leads
    .filter((l) => l.pipeline_stage === "perdido")
    .reduce((acc, lead) => {
      const reason = lead.lost_reason || "Não informado";
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Leads - ${periodLabel}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 { color: #1a1a2e; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
        h2 { color: #4338ca; margin-top: 30px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .date { color: #666; font-size: 14px; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
        .metric { background: #f8fafc; border-radius: 8px; padding: 15px; text-align: center; }
        .metric-value { font-size: 28px; font-weight: bold; color: #1a1a2e; }
        .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .metric.green .metric-value { color: #10b981; }
        .metric.red .metric-value { color: #ef4444; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f8fafc; font-weight: 600; color: #374151; }
        tr:hover { background: #f9fafb; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Leads</h1>
        <div class="date">
          ${periodLabel}<br>
          ${dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : ""} - 
          ${dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : ""}
        </div>
      </div>

      ${metrics ? `
      <div class="metrics">
        <div class="metric">
          <div class="metric-value">${metrics.total}</div>
          <div class="metric-label">Total de Leads</div>
        </div>
        <div class="metric green">
          <div class="metric-value">${metrics.converted}</div>
          <div class="metric-label">Convertidos</div>
        </div>
        <div class="metric red">
          <div class="metric-value">${metrics.lost}</div>
          <div class="metric-label">Perdidos</div>
        </div>
        <div class="metric">
          <div class="metric-value">${formatCurrency(metrics.totalValue)}</div>
          <div class="metric-label">Receita Total</div>
        </div>
      </div>
      ` : ""}

      <h2>Por Origem</h2>
      <table>
        <thead>
          <tr>
            <th>Origem</th>
            <th>Total</th>
            <th>Convertidos</th>
            <th>Taxa</th>
            <th>Receita</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(sourceStats)
            .sort((a, b) => b[1].total - a[1].total)
            .map(([source, stats]) => `
              <tr>
                <td>${source}</td>
                <td>${stats.total}</td>
                <td>${stats.converted}</td>
                <td>${stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%</td>
                <td>${formatCurrency(stats.value)}</td>
              </tr>
            `).join("")}
        </tbody>
      </table>

      <h2>Motivos de Perda</h2>
      <table>
        <thead>
          <tr>
            <th>Motivo</th>
            <th>Quantidade</th>
            <th>Percentual</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(lostReasons)
            .sort((a, b) => b[1] - a[1])
            .map(([reason, count]) => {
              const lostTotal = leads.filter(l => l.pipeline_stage === "perdido").length;
              return `
                <tr>
                  <td>${reason}</td>
                  <td>${count}</td>
                  <td>${lostTotal > 0 ? ((count / lostTotal) * 100).toFixed(1) : 0}%</td>
                </tr>
              `;
            }).join("")}
        </tbody>
      </table>

      <h2>Detalhamento de Leads</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Origem</th>
            <th>Estágio</th>
            <th>Valor</th>
            <th>Responsável</th>
          </tr>
        </thead>
        <tbody>
          ${leads.slice(0, 50).map((lead) => `
            <tr>
              <td>${lead.name}</td>
              <td>${lead.source || "-"}</td>
              <td>
                <span class="badge ${lead.pipeline_stage === 'ganho' ? 'badge-green' : lead.pipeline_stage === 'perdido' ? 'badge-red' : ''}">
                  ${lead.pipeline_stage}
                </span>
              </td>
              <td>${formatCurrency(lead.value || 0)}</td>
              <td>${getTeamMemberName(lead.assigned_to)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      ${leads.length > 50 ? `<p style="color: #666; font-style: italic;">Mostrando 50 de ${leads.length} leads. Exporte em CSV para lista completa.</p>` : ""}

      <div class="footer">
        Relatório gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
      </div>
    </body>
    </html>
  `;

  // Open in new window and print
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }
};
