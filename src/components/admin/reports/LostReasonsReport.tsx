import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/types/crm";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Ban, MessageSquareX, DollarSign, HelpCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LostReasonsReportProps {
  leads: Lead[];
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#ec4899",
  "#8b5cf6",
  "#6366f1",
  "#64748b",
];

// Common lost reason categories
const REASON_ICONS: Record<string, React.ReactNode> = {
  "Preço": <DollarSign className="h-4 w-4" />,
  "Sem resposta": <MessageSquareX className="h-4 w-4" />,
  "Não respondeu": <MessageSquareX className="h-4 w-4" />,
  "Timing": <Clock className="h-4 w-4" />,
  "Concorrência": <Ban className="h-4 w-4" />,
  "Não qualificado": <AlertTriangle className="h-4 w-4" />,
};

const LostReasonsReport = ({ leads }: LostReasonsReportProps) => {
  // Filter only lost leads
  const lostLeads = useMemo(() => {
    return leads.filter((l) => l.pipeline_stage === "perdido" || l.status === "perdido");
  }, [leads]);

  // Group by reason
  const reasonData = useMemo(() => {
    const reasonMap = new Map<string, number>();
    
    lostLeads.forEach((lead) => {
      const reason = lead.lost_reason || "Não informado";
      reasonMap.set(reason, (reasonMap.get(reason) || 0) + 1);
    });

    return Array.from(reasonMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: lostLeads.length > 0 ? ((value / lostLeads.length) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.value - a.value);
  }, [lostLeads]);

  // Recent lost leads
  const recentLost = useMemo(() => {
    return [...lostLeads]
      .sort((a, b) => {
        const dateA = a.stage_changed_at ? new Date(a.stage_changed_at).getTime() : 0;
        const dateB = b.stage_changed_at ? new Date(b.stage_changed_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [lostLeads]);

  // Calculate potential lost value
  const potentialLostValue = useMemo(() => {
    // Estimate based on average deal value of won deals
    const wonLeads = leads.filter((l) => l.pipeline_stage === "ganho");
    const avgValue = wonLeads.length > 0 
      ? wonLeads.reduce((sum, l) => sum + (l.value || 0), 0) / wonLeads.length 
      : 0;
    return lostLeads.length * avgValue;
  }, [leads, lostLeads]);

  const getReasonIcon = (reason: string) => {
    for (const [key, icon] of Object.entries(REASON_ICONS)) {
      if (reason.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return <HelpCircle className="h-4 w-4" />;
  };

  if (lostLeads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-emerald-500/10 p-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold">Nenhum lead perdido!</h3>
          <p className="text-muted-foreground text-center mt-2">
            Não há leads perdidos no período selecionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Total de Leads Perdidos</CardDescription>
            <CardTitle className="text-3xl text-red-500">{lostLeads.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {leads.length > 0 
                ? `${((lostLeads.length / leads.length) * 100).toFixed(1)}% do total` 
                : "0% do total"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Principal Motivo</CardDescription>
            <CardTitle className="text-xl truncate">
              {reasonData[0]?.name || "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {reasonData[0]?.value || 0} leads ({reasonData[0]?.percentage || 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receita Potencial Perdida</CardDescription>
            <CardTitle className="text-xl">
              {new Intl.NumberFormat("pt-BR", { 
                style: "currency", 
                currency: "BRL",
                notation: "compact"
              }).format(potentialLostValue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Baseado no valor médio de vendas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Motivos</CardTitle>
            <CardDescription>Por que os leads foram perdidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reasonData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                    }
                  >
                    {reasonData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value} leads`, 
                      name
                    ]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {reasonData.slice(0, 5).map((reason, index) => (
                <div key={reason.name} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate max-w-[100px]">{reason.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Motivos</CardTitle>
            <CardDescription>Quantidade por motivo de perda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reasonData.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={120}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value} leads`, "Total"]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent lost leads */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Perdidos Recentemente</CardTitle>
          <CardDescription>Últimos leads que foram perdidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLost.map((lead) => (
              <div 
                key={lead.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-500/10">
                    {getReasonIcon(lead.lost_reason || "")}
                  </div>
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {lead.lost_reason || "Motivo não informado"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {lead.stage_changed_at 
                      ? format(parseISO(lead.stage_changed_at), "dd/MM/yyyy", { locale: ptBR })
                      : "Data não informada"}
                  </div>
                  {lead.source && (
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LostReasonsReport;
