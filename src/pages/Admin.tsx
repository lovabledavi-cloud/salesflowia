import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Users, Loader2, Mail, Phone, Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  created_at: string;
}

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

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
      setLeads(data || []);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatWhatsApp = (phone: string) => {
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Leads</p>
                  <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-violet" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
                  <p className="text-2xl font-bold text-foreground">
                    {leads.filter(l => {
                      const date = new Date(l.created_at);
                      const now = new Date();
                      const diff = now.getTime() - date.getTime();
                      return diff < 7 * 24 * 60 * 60 * 1000;
                    }).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                  <p className="text-2xl font-bold text-foreground">
                    {leads.filter(l => {
                      const date = new Date(l.created_at);
                      const now = new Date();
                      return date.toDateString() === now.toDateString();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Leads Capturados</h2>
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

            {loadingLeads ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum lead capturado ainda</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-emerald hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`https://wa.me/55${lead.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {formatWhatsApp(lead.whatsapp)}
                          </a>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(lead.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Admin;
