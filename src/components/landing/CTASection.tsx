import { useState } from "react";
import { ArrowRight } from "lucide-react";
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
    <footer id="agendar" className="py-24 bg-[#030005] border-t border-white/[0.02]">
      <RevealSection className="max-w-[1200px] mx-auto px-[5%]">
        <div className="max-w-[800px] mx-auto rounded-3xl border border-purple-500/50 bg-gradient-to-br from-[#160c24] to-[#030005] shadow-[0_20px_60px_rgba(168,85,247,0.15)] backdrop-blur-xl">
          <div className="p-16 md:px-20 text-center">
            <h2 className="font-heading font-extrabold text-[2.5rem] mb-5 leading-tight">
              Pronto para transformar<br />seu depósito em uma <span className="text-purple-500 font-playfair italic">máquina de vendas?</span>
            </h2>
            <p className="text-slate-400 mb-8">Preencha os dados e receba sua arquitetura da SalesFlow IA sem custo em nossa Call Estratégica.</p>

            <form onSubmit={handleSubmit} className="text-left space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-400">Seu Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite seu nome completo" required
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-400">Seu WhatsApp</label>
                <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(00) 00000-0000" required
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-400">Quantas entregas faz por dia?</label>
                <select value={volume} onChange={(e) => setVolume(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-4 text-white appearance-none focus:outline-none focus:border-purple-500 transition-all">
                  <option>Abaixo de 50 pedidos</option>
                  <option>50 a 150 pedidos</option>
                  <option>Acima de 150 pedidos</option>
                </select>
              </div>
              <button type="submit" disabled={loading}
                className="landing-glow-btn w-full inline-flex items-center justify-center gap-2.5 px-10 py-5 rounded-full bg-purple-500 text-white font-bold text-lg border border-white/20 hover:bg-purple-300 hover:text-gray-900 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                {loading ? "Enviando..." : <>Mudar o Rumo do Meu Depósito <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 text-center flex flex-col items-center gap-4 border-t border-white/5 pt-8">
          <img src="/images/logo.png" alt="SalesFlow.IA" className="h-10 object-contain opacity-80" />
          <p className="text-slate-600 text-sm">&copy; 2026 SalesFlow.IA - Todos os direitos reservados. Feito para distribuidoras de sucesso.</p>
        </div>
      </RevealSection>
    </footer>
  );
};

export default CTASection;
