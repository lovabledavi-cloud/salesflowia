import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <Logo size="xl" />

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center max-w-md">
            O sistema de automação de vendas feito por donos de depósito, 
            para donos de depósito.
          </p>

          {/* Divider */}
          <div className="h-px w-full max-w-xs bg-border" />

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SalesFlowIA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;