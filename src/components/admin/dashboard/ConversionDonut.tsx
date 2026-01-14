import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Lead } from "@/types/crm";

interface ConversionDonutProps {
  leads: Lead[];
}

const COLORS = {
  novo: "hsl(215 20% 65%)",
  contactado: "hsl(45 93% 47%)",
  convertido: "hsl(142 71% 45%)",
  perdido: "hsl(0 84% 60%)",
};

const STATUS_LABELS = {
  novo: "Novos",
  contactado: "Contactados",
  convertido: "Convertidos",
  perdido: "Perdidos",
};

const ConversionDonut = ({ leads }: ConversionDonutProps) => {
  const data = useMemo(() => {
    const counts = {
      novo: leads.filter((l) => l.status === "novo").length,
      contactado: leads.filter((l) => l.status === "contactado").length,
      convertido: leads.filter((l) => l.status === "convertido").length,
      perdido: leads.filter((l) => l.status === "perdido").length,
    };

    return Object.entries(counts)
      .map(([status, value]) => ({
        name: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
        value,
        status,
        color: COLORS[status as keyof typeof COLORS],
      }))
      .filter((item) => item.value > 0);
  }, [leads]);

  const total = leads.length;
  const conversionRate = useMemo(() => {
    const converted = leads.filter((l) => l.status === "convertido").length;
    return total > 0 ? ((converted / total) * 100).toFixed(1) : "0";
  }, [leads, total]);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Funil de Conversão</h3>
          <p className="text-sm text-muted-foreground">Distribuição por status</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald">{conversionRate}%</p>
          <p className="text-xs text-muted-foreground">Taxa de conversão</p>
        </div>
      </div>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              formatter={(value: number, name: string) => [
                `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-3xl font-bold text-foreground"
            >
              {total}
            </motion.p>
            <p className="text-xs text-muted-foreground">Total Leads</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item, index) => (
          <motion.div
            key={item.status}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-2"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="text-sm font-medium text-foreground ml-auto">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ConversionDonut;
