import { useState } from "react";
import { KeyRound, LogOut, Loader2, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_CONFIG } from "@/types/crm";

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { roles, teamMember } = useUserProfile();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingReset(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado de todos os dispositivos.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Informações da Conta</h3>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Funções</p>
              <div className="flex gap-2 mt-1">
                {roles.map((role) => (
                  <span
                    key={role}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_CONFIG[role].color} text-white`}
                  >
                    {ROLE_CONFIG[role].label}
                  </span>
                ))}
                {roles.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Nenhuma função atribuída
                  </span>
                )}
              </div>
            </div>
          </div>

          {teamMember && (
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Membro da Equipe</p>
                <p className="text-sm text-muted-foreground">
                  {teamMember.name} ({ROLE_CONFIG[teamMember.role].label})
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Reset */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Alterar Senha</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Para alterar sua senha, enviaremos um link de redefinição para seu
          email cadastrado.
        </p>

        <Button
          variant="outline"
          onClick={handlePasswordReset}
          disabled={sendingReset}
          className="gap-2"
        >
          {sendingReset ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          Enviar Link de Redefinição
        </Button>
      </div>

      {/* Sign Out */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LogOut className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Encerrar Sessão</h3>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair de Todos os Dispositivos
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Encerrar todas as sessões?</AlertDialogTitle>
              <AlertDialogDescription>
                Você será desconectado de todos os dispositivos e precisará
                fazer login novamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSignOutAllDevices}
                disabled={signingOut}
              >
                {signingOut ? "Saindo..." : "Confirmar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AccountSettings;
