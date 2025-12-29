import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LeadStats from "@/components/admin/LeadStats";
import LeadFilters from "@/components/admin/LeadFilters";
import LeadTable from "@/components/admin/LeadTable";
import LeadNotesDialog from "@/components/admin/LeadNotesDialog";
import ExportButton from "@/components/admin/ExportButton";
import { LeadStatus } from "@/components/admin/LeadStatusBadge";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days">("all");

  // Notes dialog state
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingLeadId(leadId);
    
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
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
          lead.id === leadId ? { ...lead, status: newStatus } : lead
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
          {/* Stats */}
          <LeadStats leads={leads} />

          {/* Filters */}
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

          {/* Table */}
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
    </main>
  );
};

export default Admin;
