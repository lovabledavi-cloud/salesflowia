import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Lead } from "@/types/crm";

interface PerformanceChartProps {
  leads: Lead[];
  days?: number;
}

const PerformanceChart = ({ leads, days = 30 }: PerformanceChartProps) => {
  const chartData = useMemo(() => {
    const data = [];
    const today = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      
      const totalLeads = leads.filter((lead) =>
        isSameDay(new Date(lead.created_at), date)
      ).length;

      const convertedLeads = leads.filter((lead) => {
        const isConverted = lead.status === "convertido" || lead.pipeline_stage === "ganho";
        const closedOnDate = lead.closed_at && isSameDay(new Date(lead.closed_at), date);
        return isConverted && closedOnDate;
      }).length;

      data.push({
        date: format(date, "dd/MM", { locale: ptBR }),
        fullDate: format(date, "dd 'de' MMMM", { locale: ptBR }),
        leads: totalLeads,
        convertidos: convertedLeads,
      });
    }

    return data;
  }, [leads, days]);

  const totals = useMemo(() => {
    const totalLeads = chartData.reduce((acc, item) => acc + item.leads, 0);
    const totalConverted = chartData.reduce((acc, item) => acc + item.convertidos, 0);
    const avgPerDay = (totalLeads / days).toFixed(1);
    const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : "0";

    return { totalLeads, totalConverted, avgPerDay, conversionRate };
  }, [chartData, days]);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Performance de Leads</h3>
          <p className="text-sm text-muted-foreground">Últimos {days} dias</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{totals.totalLeads}</p>
            <p className="text-xs text-muted-foreground">Total de leads</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald">{totals.totalConverted}</p>
            <p className="text-xs text-muted-foreground">Convertidos</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-violet">{totals.conversionRate}%</p>
            <p className="text-xs text-muted-foreground">Taxa conv.</p>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeadsPerf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--emerald))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--emerald))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, marginBottom: 4 }}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground capitalize">{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLeadsPerf)"
            />
            <Area
              type="monotone"
              dataKey="convertidos"
              name="Convertidos"
              stroke="hsl(var(--emerald))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorConverted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
