import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead, TeamMember, ROLE_CONFIG } from "@/types/crm";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, TrendingUp, Phone, Calendar, Target } from "lucide-react";

interface TeamComparisonReportProps {
  leads: Lead[];
  teamMembers: TeamMember[];
}

const TeamComparisonReport = ({ leads, teamMembers }: TeamComparisonReportProps) => {
  // Calculate performance for each team member
  const memberPerformance = useMemo(() => {
    return teamMembers
      .filter((m) => m.is_active && (m.role === "sdr" || m.role === "closer"))
      .map((member) => {
        // SDR metrics
        const createdLeads = leads.filter((l) => l.created_by === member.id).length;
        const contactedLeads = leads.filter((l) => l.contacted_by === member.id).length;
        const qualifiedLeads = leads.filter((l) => l.qualified_by === member.id).length;
        const scheduledMeetings = leads.filter((l) => l.meeting_scheduled_by === member.id).length;
        
        // Closer metrics
        const assignedLeads = leads.filter((l) => l.assigned_to === member.id).length;
        const closedWon = leads.filter((l) => 
          l.closed_by === member.id && l.pipeline_stage === "ganho"
        ).length;
        const closedLost = leads.filter((l) => 
          l.assigned_to === member.id && l.pipeline_stage === "perdido"
        ).length;
        const revenue = leads
          .filter((l) => l.closed_by === member.id && l.pipeline_stage === "ganho")
          .reduce((sum, l) => sum + (l.value || 0), 0);

        const conversionRate = assignedLeads > 0 
          ? ((closedWon / assignedLeads) * 100).toFixed(1) 
          : "0";

        return {
          id: member.id,
          name: member.name,
          avatar: member.avatar_url,
          role: member.role,
          createdLeads,
          contactedLeads,
          qualifiedLeads,
          scheduledMeetings,
          assignedLeads,
          closedWon,
          closedLost,
          revenue,
          conversionRate: parseFloat(conversionRate),
          // Overall score (weighted)
          score: member.role === "sdr"
            ? (createdLeads * 1) + (contactedLeads * 2) + (qualifiedLeads * 3) + (scheduledMeetings * 4)
            : (closedWon * 10) + (revenue / 100) - (closedLost * 2),
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [leads, teamMembers]);

  // Separate SDRs and Closers
  const sdrs = memberPerformance.filter((m) => m.role === "sdr");
  const closers = memberPerformance.filter((m) => m.role === "closer");

  // Bar chart data for SDRs
  const sdrChartData = useMemo(() => {
    return sdrs.map((m) => ({
      name: m.name.split(" ")[0],
      "Leads Criados": m.createdLeads,
      "Contactados": m.contactedLeads,
      "Qualificados": m.qualifiedLeads,
      "Reuniões": m.scheduledMeetings,
    }));
  }, [sdrs]);

  // Bar chart data for Closers
  const closerChartData = useMemo(() => {
    return closers.map((m) => ({
      name: m.name.split(" ")[0],
      "Ganhos": m.closedWon,
      "Perdidos": m.closedLost,
      "Taxa (%)": m.conversionRate,
    }));
  }, [closers]);

  // Top performers
  const topSDR = sdrs[0];
  const topCloser = closers[0];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topSDR && (
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base">Melhor SDR</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={topSDR.avatar || undefined} />
                  <AvatarFallback>{getInitials(topSDR.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{topSDR.name}</div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {topSDR.createdLeads} leads
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {topSDR.scheduledMeetings} reuniões
                    </span>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                  {topSDR.score} pts
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {topCloser && (
          <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-base">Melhor Closer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={topCloser.avatar || undefined} />
                  <AvatarFallback>{getInitials(topCloser.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{topCloser.name}</div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {topCloser.conversionRate}% conversão
                    </span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", { 
                        style: "currency", 
                        currency: "BRL",
                        notation: "compact"
                      }).format(topCloser.revenue)}
                    </span>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                  {topCloser.closedWon} ganhos
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* SDR Performance Chart */}
      {sdrs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance dos SDRs</CardTitle>
            <CardDescription>Comparativo de atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sdrChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Leads Criados" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Contactados" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Qualificados" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Reuniões" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Closer Performance Chart */}
      {closers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance dos Closers</CardTitle>
            <CardDescription>Leads ganhos vs perdidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={closerChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Ganhos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Perdidos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SDR Ranking */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking SDRs</CardTitle>
            <CardDescription>Por pontuação geral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sdrs.map((sdr, index) => (
                <div 
                  key={sdr.id} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? "bg-amber-500/20 text-amber-600" : 
                    index === 1 ? "bg-slate-300/20 text-slate-500" : 
                    index === 2 ? "bg-orange-500/20 text-orange-600" : 
                    "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sdr.avatar || undefined} />
                    <AvatarFallback className="text-xs">{getInitials(sdr.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{sdr.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {sdr.createdLeads} leads • {sdr.scheduledMeetings} reuniões
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{sdr.score}</div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                </div>
              ))}
              {sdrs.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum SDR encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Closer Ranking */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking Closers</CardTitle>
            <CardDescription>Por receita gerada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {closers
                .sort((a, b) => b.revenue - a.revenue)
                .map((closer, index) => (
                  <div 
                    key={closer.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? "bg-emerald-500/20 text-emerald-600" : 
                      index === 1 ? "bg-slate-300/20 text-slate-500" : 
                      index === 2 ? "bg-orange-500/20 text-orange-600" : 
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={closer.avatar || undefined} />
                      <AvatarFallback className="text-xs">{getInitials(closer.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{closer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {closer.closedWon} ganhos • {closer.conversionRate}% conversão
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-600">
                        {new Intl.NumberFormat("pt-BR", { 
                          style: "currency", 
                          currency: "BRL",
                          notation: "compact"
                        }).format(closer.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              {closers.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum Closer encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamComparisonReport;
