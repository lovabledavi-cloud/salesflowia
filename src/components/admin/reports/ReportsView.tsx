import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FileDown, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle,
  Calendar,
  Filter
} from "lucide-react";
import { Lead, TeamMember, DateRange, PIPELINE_STAGES } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  format, 
  isWithinInterval,
  startOfDay,
  endOfDay,
  parseISO
} from "date-fns";
import { ptBR } from "date-fns/locale";
import PerformanceReport from "./PerformanceReport";
import SourcesReport from "./SourcesReport";
import LostReasonsReport from "./LostReasonsReport";
import TeamComparisonReport from "./TeamComparisonReport";
import { exportReportToPDF, exportReportToCSV } from "./reportExport";

interface ReportsViewProps {
  leads: Lead[];
  teamMembers: TeamMember[];
}

type ReportPeriod = "current" | "last" | "last3" | "last6" | "year";

const ReportsView = ({ leads, teamMembers }: ReportsViewProps) => {
  const [period, setPeriod] = useState<ReportPeriod>("current");
  const [activeTab, setActiveTab] = useState("performance");
  const [exporting, setExporting] = useState(false);

  // Calculate date range based on period
  const dateRange = useMemo((): DateRange => {
    const now = new Date();
    switch (period) {
      case "current":
        return { from: startOfMonth(now), to: endOfMonth(now) };
      case "last":
        const lastMonth = subMonths(now, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      case "last3":
        return { from: startOfMonth(subMonths(now, 2)), to: endOfMonth(now) };
      case "last6":
        return { from: startOfMonth(subMonths(now, 5)), to: endOfMonth(now) };
      case "year":
        return { from: new Date(now.getFullYear(), 0, 1), to: now };
      default:
        return { from: startOfMonth(now), to: endOfMonth(now) };
    }
  }, [period]);

  // Filter leads by date range
  const filteredLeads = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return leads;
    
    return leads.filter((lead) => {
      const leadDate = parseISO(lead.created_at);
      return isWithinInterval(leadDate, {
        start: startOfDay(dateRange.from!),
        end: endOfDay(dateRange.to!),
      });
    });
  }, [leads, dateRange]);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    const total = filteredLeads.length;
    const converted = filteredLeads.filter((l) => l.status === "convertido" || l.pipeline_stage === "ganho").length;
    const lost = filteredLeads.filter((l) => l.status === "perdido" || l.pipeline_stage === "perdido").length;
    const totalValue = filteredLeads
      .filter((l) => l.pipeline_stage === "ganho")
      .reduce((sum, l) => sum + (l.value || 0), 0);
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : "0";

    return { total, converted, lost, totalValue, conversionRate };
  }, [filteredLeads]);

  const getPeriodLabel = () => {
    switch (period) {
      case "current": return "Mês Atual";
      case "last": return "Mês Anterior";
      case "last3": return "Últimos 3 Meses";
      case "last6": return "Últimos 6 Meses";
      case "year": return "Ano Atual";
      default: return "";
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportReportToPDF({
        leads: filteredLeads,
        teamMembers,
        dateRange,
        periodLabel: getPeriodLabel(),
        metrics,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    exportReportToCSV({
      leads: filteredLeads,
      teamMembers,
      dateRange,
      periodLabel: getPeriodLabel(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Relatórios</h2>
          <p className="text-muted-foreground">
            Análise detalhada de performance e leads
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as ReportPeriod)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Mês Atual</SelectItem>
              <SelectItem value="last">Mês Anterior</SelectItem>
              <SelectItem value="last3">Últimos 3 Meses</SelectItem>
              <SelectItem value="last6">Últimos 6 Meses</SelectItem>
              <SelectItem value="year">Ano Atual</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExportCSV}>
            <FileDown className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={handleExportPDF} disabled={exporting}>
            <FileDown className="h-4 w-4 mr-2" />
            {exporting ? "Gerando..." : "PDF"}
          </Button>
        </div>
      </div>

      {/* Period indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>
          Período: {dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : ""} 
          {" - "} 
          {dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : ""}
        </span>
        <span className="text-foreground font-medium">({filteredLeads.length} leads)</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Leads</CardDescription>
            <CardTitle className="text-3xl">{metrics.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              No período
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Convertidos</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">{metrics.converted}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              {metrics.conversionRate}% taxa
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Perdidos</CardDescription>
            <CardTitle className="text-3xl text-red-500">{metrics.lost}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {metrics.total > 0 ? ((metrics.lost / metrics.total) * 100).toFixed(1) : 0}% perda
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receita Total</CardDescription>
            <CardTitle className="text-3xl">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(metrics.totalValue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Target className="h-4 w-4 mr-1" />
              Leads ganhos
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="sources">Origens</TabsTrigger>
          <TabsTrigger value="lost">Motivos de Perda</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceReport leads={filteredLeads} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <SourcesReport leads={filteredLeads} />
        </TabsContent>

        <TabsContent value="lost" className="space-y-4">
          <LostReasonsReport leads={filteredLeads} />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <TeamComparisonReport leads={filteredLeads} teamMembers={teamMembers} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ReportsView;
