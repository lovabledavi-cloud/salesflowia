import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LeadStats from "@/components/admin/LeadStats";
import LeadFilters from "@/components/admin/LeadFilters";
import LeadTable from "@/components/admin/LeadTable";
import LeadNotesDialog from "@/components/admin/LeadNotesDialog";
import ExportButton from "@/components/admin/ExportButton";
import { LeadStatus } from "@/components/admin/LeadStatusBadge";
import LeadsChart from "@/components/admin/dashboard/LeadsChart";
import ConversionFunnel from "@/components/admin/dashboard/ConversionFunnel";
import TodayFollowups from "@/components/admin/followup/TodayFollowups";
import FollowupDialog from "@/components/admin/followup/FollowupDialog";
import KanbanBoard from "@/components/admin/kanban/KanbanBoard";
import ViewToggle from "@/components/admin/ViewToggle";
import { useRealtimeLeads } from "@/hooks/useRealtimeLeads";

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

type ViewMode = "table" | "kanban";

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showDashboard, setShowDashboard] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days">("all");

  // Notes dialog state
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Followup dialog state
  const [followupDialogOpen, setFollowupDialogOpen] = useState(false);
  const [followupLead, setFollowupLead] = useState<Lead | null>(null);

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
    
    // Se o status for "contactado" ou posterior, registrar data do último contato
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
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.whatsapp.includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      // Date filter
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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-4 px-4 md:px-8 bg-card border-b border-border">
        <div className="container flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Today's Follow-ups */}
          <TodayFollowups leads={leads} onSelectLead={handleSelectLeadById} />

          {/* Dashboard Toggle */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              {showDashboard ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ocultar Dashboard
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Mostrar Dashboard
                </>
              )}
            </Button>
          </div>

          {/* Dashboard with Charts */}
          {showDashboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <LeadsChart leads={leads} days={30} />
                <ConversionFunnel leads={leads} />
              </div>
              <LeadStats leads={leads} />
            </motion.div>
          )}

          {/* View Toggle and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
            
            {viewMode === "table" && (
              <div className="flex-1">
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
              </div>
            )}
          </div>

          {/* Main Content */}
          {viewMode === "table" ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Leads Capturados</h2>
                <div className="flex items-center gap-2">
                  <ExportButton leads={filteredLeads} disabled={loadingLeads} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchLeads}
                    disabled={loadingLeads}
                    className="gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingLeads ? "animate-spin" : ""}`} />
                    Atualizar
                  </Button>
                </div>
              </div>

              <LeadTable
                leads={filteredLeads}
                loading={loadingLeads}
                onStatusChange={handleStatusChange}
                onOpenNotes={handleOpenNotes}
                updatingLeadId={updatingLeadId}
              />
            </div>
          ) : (
            <KanbanBoard
              leads={filteredLeads}
              onStatusChange={handleStatusChange}
              onOpenNotes={handleOpenNotes}
              onOpenFollowup={handleOpenFollowup}
            />
          )}
        </motion.div>
      </div>

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
    </main>
  );
};

export default Admin;
