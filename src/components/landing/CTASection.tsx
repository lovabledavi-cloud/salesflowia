import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import RevealSection from "./RevealSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CTASection = () => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [volume, setVolume] = useState("Abaixo de 50 pedidos");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name,
        whatsapp,
        email: "",
        source: "landing_page",
        notes: `Volume: ${volume}`,
        status: "novo",
        pipeline_stage: "novo",
      });
      if (error) throw error;
      toast.success("Enviado com sucesso! Entraremos em contato em breve.");
      setName("");
      setWhatsapp("");
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="agendar" className="py-20 sm:py-24 bg-[#030005] border-t border-white/[0.02]">
      <RevealSection className="max-w-[560px] mx-auto px-5 sm:px-[5%]">
        <div className="text-center mb-10">
          <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.2rem)] leading-tight mb-3">
            Pronto para transformar<br />seus leads em <span className="text-purple-500 font-playfair italic">vendas?</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
          />
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="(00) 00000-0000"
            required
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
          />
          <select
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3.5 text-sm text-white appearance-none focus:outline-none focus:border-purple-500/50 transition-all"
          >
            <option>Abaixo de 50 pedidos</option>
            <option>50 a 150 pedidos</option>
            <option>Acima de 150 pedidos</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)",
              boxShadow: "0 6px 24px rgba(168,85,247,0.35)",
            }}
          >
            {loading ? "Enviando..." : (
              <>Solicitar Diagnóstico Gratuito <ArrowUpRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </RevealSection>

      {/* Footer */}
      <div className="max-w-[560px] mx-auto mt-16 text-center flex flex-col items-center gap-3 border-t border-white/[0.04] pt-6 px-5">
        <img src="/images/logo.png" alt="SalesFlow.IA" className="h-8 object-contain opacity-60" />
        <p className="text-slate-600 text-xs">&copy; 2026 SalesFlow.IA - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default CTASection;
