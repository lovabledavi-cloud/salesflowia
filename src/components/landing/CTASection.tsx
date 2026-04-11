import { useState } from "react";
import { ArrowUpRight, Shield, Lock } from "lucide-react";
import RevealSection from "./RevealSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CTASection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [revenda, setRevenda] = useState("");
  const [botijoes, setBotijoes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name,
        whatsapp: phone,
        email: "",
        source: "landing_page",
        notes: `Depósito: ${revenda} | Botijões: ${botijoes}`,
        status: "novo",
        pipeline_stage: "novo",
      });
      if (error) throw error;
      toast.success("Enviado com sucesso! Entraremos em contato em breve.");
      setName("");
      setPhone("");
      setRevenda("");
      setBotijoes("");
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="agendar" className="py-20 sm:py-28 bg-[#030005]">
      <RevealSection className="max-w-[520px] mx-auto px-5 sm:px-6">
        {/* Label */}
        <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-slate-500 text-center mb-4 font-medium">
          Comece agora mesmo
        </p>

        {/* Title */}
        <h2 className="font-extrabold text-[clamp(1.5rem,3.5vw,2rem)] leading-tight text-center mb-3">
          Pronto para escalar as<br />vendas do seu <span className="text-purple-500 font-playfair italic">depósito?</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-500 text-center max-w-[400px] mx-auto mb-6">
          Agende uma conversa gratuita. Sem compromisso, sem cartão de crédito.
        </p>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Shield className="w-3.5 h-3.5" />
            <span>Dados seguros</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Lock className="w-3.5 h-3.5" />
            <span>100% gratuito</span>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="divide-y divide-white/[0.06]">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="w-full bg-transparent px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.02] transition-colors"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
                className="w-full bg-transparent px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.02] transition-colors"
              />
              <input
                type="text"
                value={revenda}
                onChange={(e) => setRevenda(e.target.value)}
                placeholder="Nome do depósito"
                className="w-full bg-transparent px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.02] transition-colors"
              />
              <select
                value={botijoes}
                onChange={(e) => setBotijoes(e.target.value)}
                className="w-full bg-transparent px-5 py-4 text-sm text-white appearance-none focus:outline-none focus:bg-white/[0.02] transition-colors"
              >
                <option value="" disabled className="bg-[#0a0510]">Quantidade de botijões / mês</option>
                <option value="Até 500" className="bg-[#0a0510]">Até 500 botijões</option>
                <option value="500 a 2.000" className="bg-[#0a0510]">500 a 2.000 botijões</option>
                <option value="2.000 a 5.000" className="bg-[#0a0510]">2.000 a 5.000 botijões</option>
                <option value="Acima de 5.000" className="bg-[#0a0510]">Acima de 5.000 botijões</option>
              </select>
            </div>

            <div className="p-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)",
                  boxShadow: "0 4px 20px rgba(168,85,247,0.3)",
                }}
              >
                {loading ? "Enviando..." : (
                  <>Solicitar Demonstração Gratuita <ArrowUpRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </RevealSection>

      {/* Footer */}
      <div className="max-w-[520px] mx-auto mt-14 text-center flex flex-col items-center gap-3 border-t border-white/[0.04] pt-6 px-5">
        <img src="/images/logo.png" alt="SalesFlow.IA" className="h-10 object-contain opacity-50" />
        <p className="text-slate-700 text-[11px]">&copy; 2026 SalesFlow.IA · Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default CTASection;
