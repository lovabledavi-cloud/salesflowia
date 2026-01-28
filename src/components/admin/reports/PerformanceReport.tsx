import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead, DateRange, PIPELINE_STAGES } from "@/types/crm";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, parseISO, isSameDay, isSameWeek, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PerformanceReportProps {
  leads: Lead[];
  dateRange: DateRange;
}

const PerformanceReport = ({ leads, dateRange }: PerformanceReportProps) => {
  // Determine granularity based on date range
  const granularity = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return "day";
    const diffDays = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 31) return "day";
    if (diffDays <= 90) return "week";
    return "month";
  }, [dateRange]);

  // Generate chart data
  const chartData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return [];

    let intervals: Date[];
    let formatStr: string;
    let isSameInterval: (d1: Date, d2: Date) => boolean;

    if (granularity === "day") {
      intervals = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
      formatStr = "dd/MM";
      isSameInterval = isSameDay;
    } else if (granularity === "week") {
      intervals = eachWeekOfInterval({ start: dateRange.from, end: dateRange.to }, { weekStartsOn: 1 });
      formatStr = "'Sem' w";
      isSameInterval = isSameWeek;
    } else {
      intervals = eachMonthOfInterval({ start: dateRange.from, end: dateRange.to });
      formatStr = "MMM";
      isSameInterval = isSameMonth;
    }

    return intervals.map((intervalDate) => {
      const leadsInInterval = leads.filter((lead) => 
        isSameInterval(parseISO(lead.created_at), intervalDate)
      );
      
      const convertedInInterval = leads.filter((lead) => {
        if (lead.pipeline_stage !== "ganho" || !lead.closed_at) return false;
        return isSameInterval(parseISO(lead.closed_at), intervalDate);
      });

      const lostInInterval = leads.filter((lead) => {
        if (lead.pipeline_stage !== "perdido" || !lead.stage_changed_at) return false;
        return isSameInterval(parseISO(lead.stage_changed_at), intervalDate);
      });

      return {
        date: format(intervalDate, formatStr, { locale: ptBR }),
        novos: leadsInInterval.length,
        convertidos: convertedInInterval.length,
        perdidos: lostInInterval.length,
        valor: convertedInInterval.reduce((sum, l) => sum + (l.value || 0), 0),
      };
    });
  }, [leads, dateRange, granularity]);

  // Pipeline stage distribution
  const stageData = useMemo(() => {
    return PIPELINE_STAGES.map((stage) => ({
      name: stage.label,
      value: leads.filter((l) => l.pipeline_stage === stage.stage).length,
      fill: stage.color.replace("bg-", ""),
    }));
  }, [leads]);

  // Conversion funnel data
  const funnelData = useMemo(() => {
    const stages = ["novo", "prospeccao", "qualificado", "negociacao", "proposta", "ganho"];
    return stages.map((stage, index) => {
      const count = leads.filter((l) => {
        const stageOrder = stages.indexOf(l.pipeline_stage || "novo");
        return stageOrder >= index;
      }).length;
      
      const stageConfig = PIPELINE_STAGES.find((s) => s.stage === stage);
      return {
        stage: stageConfig?.label || stage,
        count,
        percentage: leads.length > 0 ? ((count / leads.length) * 100).toFixed(0) : 0,
      };
    });
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Leads over time chart */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ao Longo do Tempo</CardTitle>
          <CardDescription>
            Evolução de novos leads, conversões e perdas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="novos" 
                  name="Novos Leads"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="convertidos" 
                  name="Convertidos"
                  stroke="#10b981" 
                  fill="rgba(16, 185, 129, 0.2)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="perdidos" 
                  name="Perdidos"
                  stroke="#ef4444" 
                  fill="rgba(239, 68, 68, 0.2)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue over time */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Período</CardTitle>
            <CardDescription>Valor total dos leads convertidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => 
                      new Intl.NumberFormat("pt-BR", { 
                        style: "currency", 
                        currency: "BRL",
                        notation: "compact"
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value: number) => 
                      new Intl.NumberFormat("pt-BR", { 
                        style: "currency", 
                        currency: "BRL" 
                      }).format(value)
                    }
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar 
                    dataKey="valor" 
                    name="Receita"
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
            <CardDescription>Leads em cada estágio do pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((stage, index) => (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.count} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ 
                        width: `${stage.percentage}%`,
                        opacity: 1 - (index * 0.12)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceReport;
