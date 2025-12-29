import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Lead {
  id: string;
  created_at: string;
}

interface LeadsChartProps {
  leads: Lead[];
  days?: number;
}

const LeadsChart = ({ leads, days = 30 }: LeadsChartProps) => {
  const chartData = useMemo(() => {
    const data = [];
    const today = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const count = leads.filter((lead) =>
        isSameDay(new Date(lead.created_at), date)
      ).length;

      data.push({
        date: format(date, "dd/MM", { locale: ptBR }),
        leads: count,
        fullDate: format(date, "dd 'de' MMMM", { locale: ptBR }),
      });
    }

    return data;
  }, [leads, days]);

  const totalPeriod = chartData.reduce((acc, item) => acc + item.leads, 0);
  const avgPerDay = (totalPeriod / days).toFixed(1);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Leads por Dia</h3>
          <p className="text-sm text-muted-foreground">Últimos {days} dias</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald">{totalPeriod}</p>
          <p className="text-sm text-muted-foreground">~{avgPerDay}/dia</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--emerald))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--emerald))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              formatter={(value: number) => [value, "Leads"]}
              labelFormatter={(label, payload) => 
                payload?.[0]?.payload?.fullDate || label
              }
            />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="hsl(var(--emerald))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLeads)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadsChart;
