import Logo from "./Logo";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-4 relative overflow-hidden border-t border-border/30">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet/10 rounded-full blur-[150px]" />
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <Logo size="xl" />

          {/* Description */}
          <p className="text-muted-foreground text-center max-w-md">
            O sistema de automação de vendas feito por donos de depósito, 
            para donos de depósito.
          </p>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-violet text-sm">
            <Sparkles className="w-4 h-4 text-violet" />
            <span className="text-muted-foreground">Powered by</span>
            <span className="text-violet font-semibold">Inteligência Artificial</span>
          </div>

          {/* Divider */}
          <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SalesFlowIA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;