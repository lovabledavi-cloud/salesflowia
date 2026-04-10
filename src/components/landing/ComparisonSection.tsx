import { Check, Minus } from "lucide-react";
import RevealSection from "./RevealSection";

const rows = [
  { feature: "Integração Rápida nativa e Zapier", sf: "check", trad: "minus" },
  { feature: "Tempo de aprendizado (Rampagem)", sf: "Instantâneo", trad: "2 a 4 meses" },
  { feature: "Escalabilidade Absoluta (Sem limites diários)", sf: "check", trad: "minus" },
  { feature: "Sentimento analítico em tempo real", sf: "check", trad: "minus" },
  { feature: "Follow-up por voz (Áudios Humanos)", sf: "check", trad: "minus" },
];

const ComparisonSection = () => (
  <section className="py-24 bg-[#030005] border-t border-white/[0.02] relative">
    <div className="absolute bottom-[10%] -left-[300px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.4)_0%,transparent_60%)] blur-[80px] rounded-full opacity-50 pointer-events-none" />

    <RevealSection className="max-w-[1200px] mx-auto px-[5%]">
      <h2 className="font-heading font-extrabold text-[clamp(2.2rem,4vw,3.5rem)] tracking-tight mb-4 text-center">
        Não é só uma ferramenta.<br />É <span className="text-purple-500 font-serif italic">estratégia e resultado.</span>
      </h2>
      <p className="text-lg text-slate-400 text-center max-w-[600px] mx-auto mb-10">
        Veja como o SalesFlow se sai quando comparado as soluções antiquadas que encarecem a operação da sua empresa.
      </p>

      <div className="bg-white/[0.015] border border-white/[0.08] rounded-3xl overflow-x-auto shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <table className="w-full border-collapse text-left bg-[#0a0510]" style={{ borderRadius: "inherit" }}>
          <thead>
            <tr>
              <th className="px-6 py-6 font-space font-medium text-sm text-slate-400 uppercase tracking-wider">Funcionalidade</th>
              <th className="px-6 py-6 font-space font-medium text-sm text-purple-500 uppercase tracking-wider bg-purple-500/5 rounded-t-3xl">SalesFlow.IA</th>
              <th className="px-6 py-6 font-space font-medium text-sm text-slate-400 uppercase tracking-wider">Modelos Tradicionais</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i === rows.length - 1 ? "" : "border-b border-white/5"}>
                <td className="px-6 py-6 text-base">{row.feature}</td>
                <td className="px-6 py-6 bg-purple-500/[0.03] font-semibold">
                  {row.sf === "check" ? <Check className="w-5 h-5 text-purple-500" /> : <strong className="text-purple-500">{row.sf}</strong>}
                </td>
                <td className="px-6 py-6">
                  {row.trad === "minus" ? <Minus className="w-5 h-5 text-slate-500" /> : <span className="text-slate-400">{row.trad}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RevealSection>
  </section>
);

export default ComparisonSection;
