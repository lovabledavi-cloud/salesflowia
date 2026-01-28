import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/types/crm";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SourcesReportProps {
  leads: Lead[];
}

const COLORS = [
  "hsl(var(--primary))",
  "#10b981",
  "#f59e0b", 
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

const SourcesReport = ({ leads }: SourcesReportProps) => {
  // Group leads by source
  const sourceData = useMemo(() => {
    const sourceMap = new Map<string, { total: number; converted: number; lost: number; value: number }>();
    
    leads.forEach((lead) => {
      const source = lead.source || "Não informado";
      const current = sourceMap.get(source) || { total: 0, converted: 0, lost: 0, value: 0 };
      
      current.total += 1;
      if (lead.pipeline_stage === "ganho") {
        current.converted += 1;
        current.value += lead.value || 0;
      }
      if (lead.pipeline_stage === "perdido") {
        current.lost += 1;
      }
      
      sourceMap.set(source, current);
    });

    return Array.from(sourceMap.entries())
      .map(([name, data]) => ({
        name,
        ...data,
        conversionRate: data.total > 0 ? ((data.converted / data.total) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.total - a.total);
  }, [leads]);

  // Pie chart data
  const pieData = useMemo(() => {
    return sourceData.map((source) => ({
      name: source.name,
      value: source.total,
    }));
  }, [sourceData]);

  // Best and worst performing sources by conversion rate
  const sourcePerformance = useMemo(() => {
    const sourcesWithEnoughData = sourceData.filter((s) => s.total >= 3);
    const sorted = [...sourcesWithEnoughData].sort(
      (a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate)
    );
    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1],
    };
  }, [sourceData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Origem</CardTitle>
            <CardDescription>De onde vêm seus leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} leads`, "Total"]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion by source */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão por Origem</CardTitle>
            <CardDescription>Qual origem converte melhor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    width={100}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, "Taxa de Conversão"]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar 
                    dataKey="conversionRate" 
                    fill="#10b981" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sourcePerformance.best && (
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-base">Melhor Origem</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sourcePerformance.best.name}</div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{sourcePerformance.best.total} leads</span>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">
                  {sourcePerformance.best.conversionRate}% conversão
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {sourcePerformance.worst && sourcePerformance.worst !== sourcePerformance.best && (
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base">Precisa de Atenção</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sourcePerformance.worst.name}</div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{sourcePerformance.worst.total} leads</span>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-600">
                  {sourcePerformance.worst.conversionRate}% conversão
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Origem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Origem</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Total</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Convertidos</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Perdidos</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Conversão</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Receita</th>
                </tr>
              </thead>
              <tbody>
                {sourceData.map((source, index) => (
                  <tr key={source.name} className="border-b border-border/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        {source.name}
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">{source.total}</td>
                    <td className="text-right py-3 px-2 text-emerald-500">{source.converted}</td>
                    <td className="text-right py-3 px-2 text-red-500">{source.lost}</td>
                    <td className="text-right py-3 px-2">
                      <Badge variant="secondary">{source.conversionRate}%</Badge>
                    </td>
                    <td className="text-right py-3 px-2 font-medium">
                      {new Intl.NumberFormat("pt-BR", { 
                        style: "currency", 
                        currency: "BRL" 
                      }).format(source.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourcesReport;
