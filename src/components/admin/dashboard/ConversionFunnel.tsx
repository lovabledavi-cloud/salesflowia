import { useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Phone, CheckCircle, XCircle } from "lucide-react";

interface Lead {
  id: string;
  status: string;
}

interface ConversionFunnelProps {
  leads: Lead[];
}

const ConversionFunnel = ({ leads }: ConversionFunnelProps) => {
  const stats = useMemo(() => {
    const total = leads.length;
    const novo = leads.filter((l) => l.status === "novo").length;
    const contactado = leads.filter((l) => l.status === "contactado").length;
    const convertido = leads.filter((l) => l.status === "convertido").length;
    const perdido = leads.filter((l) => l.status === "perdido").length;

    // Para o funil, calculamos a progressão
    const emProcesso = contactado + convertido; // Já foram contactados
    const finalizados = convertido + perdido; // Já tiveram resultado final

    return {
      total,
      novo,
      contactado,
      convertido,
      perdido,
      emProcesso,
      conversionRate: total > 0 ? ((convertido / total) * 100).toFixed(1) : "0",
      contactRate: total > 0 ? ((emProcesso / total) * 100).toFixed(1) : "0",
    };
  }, [leads]);

  const funnelSteps = [
    {
      label: "Total de Leads",
      value: stats.total,
      percentage: 100,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Contactados",
      value: stats.contactado + stats.convertido,
      percentage: stats.total > 0 ? ((stats.contactado + stats.convertido) / stats.total) * 100 : 0,
      icon: Phone,
      color: "bg-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Convertidos",
      value: stats.convertido,
      percentage: stats.total > 0 ? (stats.convertido / stats.total) * 100 : 0,
      icon: CheckCircle,
      color: "bg-emerald",
      bgColor: "bg-emerald/10",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Funil de Conversão</h3>
          <p className="text-sm text-muted-foreground">Jornada dos leads</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald">{stats.conversionRate}%</p>
          <p className="text-sm text-muted-foreground">Taxa de conversão</p>
        </div>
      </div>

      <div className="space-y-4">
        {funnelSteps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${step.bgColor}`}>
                <step.icon className={`w-5 h-5 ${step.color.replace("bg-", "text-")}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{step.label}</span>
                  <span className="text-sm font-bold text-foreground">{step.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full ${step.color} rounded-full`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-500/10">
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Novos</p>
            <p className="text-lg font-semibold text-foreground">{stats.novo}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Perdidos</p>
            <p className="text-lg font-semibold text-foreground">{stats.perdido}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnel;
