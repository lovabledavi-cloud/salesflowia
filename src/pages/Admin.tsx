import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Menu, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LeadStats from "@/components/admin/LeadStats";
import LeadFilters from "@/components/admin/LeadFilters";
import LeadTable from "@/components/admin/LeadTable";
import LeadNotesDialog from "@/components/admin/LeadNotesDialog";
import NewLeadDialog from "@/components/admin/NewLeadDialog";
import DeleteLeadDialog from "@/components/admin/DeleteLeadDialog";
import ExportButton from "@/components/admin/ExportButton";
import { LeadStatus } from "@/components/admin/LeadStatusBadge";
import LeadsChart from "@/components/admin/dashboard/LeadsChart";
import ConversionFunnel from "@/components/admin/dashboard/ConversionFunnel";
import DateRangeFilter from "@/components/admin/dashboard/DateRangeFilter";
import TodayFollowups from "@/components/admin/followup/TodayFollowups";
import FollowupDialog from "@/components/admin/followup/FollowupDialog";
import KanbanBoard from "@/components/admin/kanban/KanbanBoard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useRealtimeLeads } from "@/hooks/useRealtimeLeads";
import { AdminThemeProvider } from "@/hooks/useAdminTheme";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { isToday, isPast, isWithinInterval, startOfDay, endOfDay } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  next_followup_date: string | null;
  followup_notes: string | null;
  last_contact_date: string | null;
}

type ActiveView = "dashboard" | "table" | "kanban" | "followups";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const AdminContent = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");

  // Date range filter for dashboard
  const [dashboardDateRange, setDashboardDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days">("all");

  // Notes dialog state
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New lead dialog state
  const [newLeadDialogOpen, setNewLeadDialogOpen] = useState(false);

  // Delete lead dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Followup dialog state
  const [followupDialogOpen, setFollowupDialogOpen] = useState(false);
  const [followupLead, setFollowupLead] = useState<Lead | null>(null);

  // Calculate pending followups count
  const pendingFollowupsCount = useMemo(() => {
    return leads.filter((lead) => {
      if (!lead.next_followup_date) return false;
      const followupDate = new Date(lead.next_followup_date);
      return isToday(followupDate) || isPast(followupDate);
    }).length;
  }, [leads]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar leads",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoadingLeads(false);
  };

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  // Realtime updates
  const handleNewLead = useCallback((newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  }, []);

  const handleUpdateLead = useCallback((updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
  }, []);

  const handleDeleteLead = useCallback((leadId: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
  }, []);

  useRealtimeLeads({
    onNewLead: handleNewLead,
    onUpdateLead: handleUpdateLead,
    onDeleteLead: handleDeleteLead,
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingLeadId(leadId);
    
    const updateData: Record<string, unknown> = { status: newStatus };
    
    if (newStatus === "contactado" || newStatus === "convertido") {
      updateData.last_contact_date = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", leadId);

    if (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus, ...updateData } as Lead : lead
        )
      );
      toast({
        title: "Status atualizado",
        description: "O status do lead foi atualizado com sucesso.",
      });
    }
    
    setUpdatingLeadId(null);
  };

  const handleOpenNotes = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = async (notes: string) => {
    if (!selectedLead) return;

    const { error } = await supabase
      .from("leads")
      .update({ notes })
      .eq("id", selectedLead.id);

    if (error) {
      toast({
        title: "Erro ao salvar notas",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id ? { ...lead, notes } : lead
        )
      );
      toast({
        title: "Notas salvas",
        description: "As notas foram salvas com sucesso.",
      });
    }
  };

  const handleOpenFollowup = (lead: Lead) => {
    setFollowupLead(lead);
    setFollowupDialogOpen(true);
  };

  const handleSaveFollowup = async (date: Date | null, notes: string) => {
    if (!followupLead) return;

    const { error } = await supabase
      .from("leads")
      .update({
        next_followup_date: date?.toISOString() || null,
        followup_notes: notes || null,
      })
      .eq("id", followupLead.id);

    if (error) {
      toast({
        title: "Erro ao salvar follow-up",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === followupLead.id
            ? { ...lead, next_followup_date: date?.toISOString() || null, followup_notes: notes || null }
            : lead
        )
      );
      toast({
        title: "Follow-up salvo",
        description: date ? "O follow-up foi agendado com sucesso." : "Follow-up removido.",
      });
    }
  };

  const handleCreateLead = async (data: { name: string; email: string; whatsapp: string; notes?: string }) => {
    const { error } = await supabase
      .from("leads")
      .insert([{ ...data, status: "novo" as LeadStatus }]);

    if (error) {
      toast({
        title: "Erro ao cadastrar lead",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } else {
      toast({
        title: "Lead cadastrado",
        description: "O lead foi cadastrado com sucesso.",
      });
    }
  };

  const handleOpenDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;

    setDeleting(true);
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", leadToDelete.id);

    if (error) {
      toast({
        title: "Erro ao excluir lead",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeads((prev) => prev.filter((lead) => lead.id !== leadToDelete.id));
      toast({
        title: "Lead excluído",
        description: "O lead foi excluído com sucesso.",
      });
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
    setDeleting(false);
  };

  const handleSelectLeadById = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      handleOpenNotes(lead);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.whatsapp.includes(query);
        if (!matchesSearch) return false;
      }

      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      if (dateFilter !== "all") {
        const leadDate = new Date(lead.created_at);
        const now = new Date();
        const diffMs = now.getTime() - leadDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === "today" && leadDate.toDateString() !== now.toDateString()) {
          return false;
        }
        if (dateFilter === "7days" && diffDays > 7) {
          return false;
        }
        if (dateFilter === "30days" && diffDays > 30) {
          return false;
        }
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, dateFilter]);

  // Filter leads for dashboard based on date range
  const dashboardLeads = useMemo(() => {
    if (!dashboardDateRange.from && !dashboardDateRange.to) {
      return leads;
    }

    return leads.filter((lead) => {
      const leadDate = new Date(lead.created_at);
      
      if (dashboardDateRange.from && dashboardDateRange.to) {
        return isWithinInterval(leadDate, {
          start: startOfDay(dashboardDateRange.from),
          end: endOfDay(dashboardDateRange.to),
        });
      }
      
      if (dashboardDateRange.from) {
        return leadDate >= startOfDay(dashboardDateRange.from);
      }
      
      return true;
    });
  }, [leads, dashboardDateRange]);

  // Calculate days for chart based on date range
  const chartDays = useMemo(() => {
    if (!dashboardDateRange.from || !dashboardDateRange.to) {
      return 30;
    }
    const diffMs = dashboardDateRange.to.getTime() - dashboardDateRange.from.getTime();
    return Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1, 7);
  }, [dashboardDateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar
          onSignOut={handleSignOut}
          userEmail={user.email}
          activeView={activeView}
          onViewChange={setActiveView}
          pendingFollowups={pendingFollowupsCount}
        />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 py-4 px-4 md:px-8 bg-card/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
                <h1 className="text-xl font-semibold text-foreground">
                  {activeView === "dashboard" && "Dashboard"}
                  {activeView === "table" && "Leads"}
                  {activeView === "kanban" && "Kanban"}
                  {activeView === "followups" && "Follow-ups"}
                </h1>
              </div>
              
              {activeView === "dashboard" && (
                <DateRangeFilter
                  dateRange={dashboardDateRange}
                  onDateRangeChange={setDashboardDateRange}
                />
              )}

              {activeView === "table" && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setNewLeadDialogOpen(true)}
                    className="gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Novo Lead</span>
                  </Button>
                  <ExportButton leads={filteredLeads} disabled={loadingLeads} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchLeads}
                    disabled={loadingLeads}
                    className="gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingLeads ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Atualizar</span>
                  </Button>
                </div>
              )}

              {activeView === "kanban" && (
                <Button
                  size="sm"
                  onClick={() => setNewLeadDialogOpen(true)}
                  className="gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Novo Lead</span>
                </Button>
              )}
            </div>
          </header>

          <div className="p-4 md:p-8">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Dashboard View */}
              {activeView === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LeadsChart leads={dashboardLeads} days={chartDays} />
                    <ConversionFunnel leads={dashboardLeads} />
                  </div>
                  <LeadStats leads={dashboardLeads} />
                </div>
              )}

              {/* Table View */}
              {activeView === "table" && (
                <div className="space-y-4">
                  <LeadFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    dateFilter={dateFilter}
                    onDateFilterChange={setDateFilter}
                    onClearFilters={handleClearFilters}
                    resultCount={filteredLeads.length}
                    totalCount={leads.length}
                  />

                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <LeadTable
                      leads={filteredLeads}
                      loading={loadingLeads}
                      onStatusChange={handleStatusChange}
                      onOpenNotes={handleOpenNotes}
                      onDeleteLead={handleOpenDeleteLead}
                      updatingLeadId={updatingLeadId}
                    />
                  </div>
                </div>
              )}

              {/* Kanban View */}
              {activeView === "kanban" && (
                <KanbanBoard
                  leads={filteredLeads}
                  onStatusChange={handleStatusChange}
                  onOpenNotes={handleOpenNotes}
                  onOpenFollowup={handleOpenFollowup}
                  onDeleteLead={handleOpenDeleteLead}
                />
              )}

              {/* Follow-ups View */}
              {activeView === "followups" && (
                <TodayFollowups leads={leads} onSelectLead={handleSelectLeadById} />
              )}
            </motion.div>
          </div>
        </main>

        {/* Notes Dialog */}
        {selectedLead && (
          <LeadNotesDialog
            open={notesDialogOpen}
            onOpenChange={setNotesDialogOpen}
            leadName={selectedLead.name}
            currentNotes={selectedLead.notes}
            onSave={handleSaveNotes}
          />
        )}

        {/* Followup Dialog */}
        {followupLead && (
          <FollowupDialog
            open={followupDialogOpen}
            onOpenChange={setFollowupDialogOpen}
            leadName={followupLead.name}
            currentFollowupDate={followupLead.next_followup_date}
            currentFollowupNotes={followupLead.followup_notes}
            onSave={handleSaveFollowup}
          />
        )}

        {/* New Lead Dialog */}
        <NewLeadDialog
          open={newLeadDialogOpen}
          onOpenChange={setNewLeadDialogOpen}
          onSave={handleCreateLead}
        />

        {/* Delete Lead Dialog */}
        {leadToDelete && (
          <DeleteLeadDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            leadName={leadToDelete.name}
            onConfirm={handleConfirmDelete}
            deleting={deleting}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

const Admin = () => {
  return (
    <AdminThemeProvider>
      <AdminContent />
    </AdminThemeProvider>
  );
};

export default Admin;
