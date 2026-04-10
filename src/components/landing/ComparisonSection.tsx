import { Check, X } from "lucide-react";
import RevealSection from "./RevealSection";

const rows = [
  { feature: "Integração rápida nativa", sf: true, trad: false },
  { feature: "Tempo de rampagem", sf: "Instantâneo", trad: "2–4 meses" },
  { feature: "Escalabilidade sem limites", sf: true, trad: false },
  { feature: "Análise de sentimento em tempo real", sf: true, trad: false },
  { feature: "Follow-up por áudio humanizado", sf: true, trad: false },
];

const ComparisonSection = () => (
  <section className="py-20 sm:py-24 bg-[#030005] border-t border-white/[0.02] relative">
    <RevealSection className="max-w-[800px] mx-auto px-5 sm:px-[5%]">
      <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-3 text-center">
        Não é ferramenta, é<br /><span className="text-purple-500 font-playfair italic">estratégia e resultado.</span>
      </h2>
      <p className="text-sm text-slate-400 text-center max-w-[480px] mx-auto mb-8">
        Veja como o SalesFlow se compara às soluções tradicionais.
      </p>

      <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.015]">
        <div className="grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_120px_120px] text-xs sm:text-sm">
          {/* Header */}
          <div className="px-4 py-3 text-slate-500 font-medium border-b border-white/[0.06]">Funcionalidade</div>
          <div className="px-3 py-3 text-purple-400 font-semibold text-center border-b border-white/[0.06] bg-purple-500/5">SalesFlow</div>
          <div className="px-3 py-3 text-slate-500 font-medium text-center border-b border-white/[0.06]">Tradicional</div>
          
          {rows.map((row, i) => (
            <div key={i} className="contents">
              <div className={`px-4 py-3.5 text-slate-300 text-xs sm:text-sm ${i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}`}>{row.feature}</div>
              <div className={`px-3 py-3.5 flex items-center justify-center bg-purple-500/[0.03] ${i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                {row.sf === true ? <Check className="w-4 h-4 text-purple-400" /> : <span className="text-purple-400 font-semibold text-xs">{row.sf}</span>}
              </div>
              <div className={`px-3 py-3.5 flex items-center justify-center ${i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                {row.trad === false ? <X className="w-4 h-4 text-slate-600" /> : <span className="text-slate-500 text-xs">{row.trad}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  </section>
);

export default ComparisonSection;
