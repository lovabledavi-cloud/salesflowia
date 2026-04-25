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
  <section className="py-20 sm:py-24 bg-white border-t border-slate-100 relative">
    <RevealSection className="max-w-[800px] mx-auto px-5 sm:px-[5%]">
      <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-3 text-center text-slate-900">
        Não é ferramenta, é<br /><span className="text-orange-500 font-playfair italic">estratégia e resultado.</span>
      </h2>
      <p className="text-sm text-slate-600 text-center max-w-[480px] mx-auto mb-8">
        Veja como o SalesFlow se compara às soluções tradicionais para depósitos de gás.
      </p>

      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_120px_120px] text-xs sm:text-sm">
          {/* Header */}
          <div className="px-4 py-3 text-slate-500 font-medium border-b border-slate-200">Funcionalidade</div>
          <div className="px-3 py-3 text-orange-600 font-semibold text-center border-b border-slate-200 bg-orange-50">SalesFlow</div>
          <div className="px-3 py-3 text-slate-500 font-medium text-center border-b border-slate-200">Tradicional</div>
          
          {rows.map((row, i) => (
            <div key={i} className="contents">
              <div className={`px-4 py-3.5 text-slate-700 text-xs sm:text-sm ${i < rows.length - 1 ? "border-b border-slate-100" : ""}`}>{row.feature}</div>
              <div className={`px-3 py-3.5 flex items-center justify-center bg-orange-50/40 ${i < rows.length - 1 ? "border-b border-slate-100" : ""}`}>
                {row.sf === true ? <Check className="w-4 h-4 text-orange-500" /> : <span className="text-orange-600 font-semibold text-xs">{row.sf}</span>}
              </div>
              <div className={`px-3 py-3.5 flex items-center justify-center ${i < rows.length - 1 ? "border-b border-slate-100" : ""}`}>
                {row.trad === false ? <X className="w-4 h-4 text-slate-400" /> : <span className="text-slate-500 text-xs">{row.trad}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  </section>
);

export default ComparisonSection;
