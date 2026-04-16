import RevealSection from "./RevealSection";

const MetricsSection = () => (
  <section id="metricas" className="py-20 sm:py-24 bg-[#030005]">
    <RevealSection className="max-w-[1000px] mx-auto px-5 sm:px-[5%]">
      <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-1 text-white">
        Cada métrica, cada lead.
      </h2>
      <p className="text-sm sm:text-base text-slate-400 mb-8">Tudo sob controle.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-orange-400 leading-none mb-1">1.2k</h3>
          <p className="text-slate-400 text-xs sm:text-sm">Leads qualificados</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-orange-400 leading-none mb-1">&lt;2<span className="text-orange-300 text-lg">s</span></h3>
          <p className="text-slate-400 text-xs sm:text-sm">Tempo de resposta</p>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-orange-400 leading-none mb-1">24<span className="text-orange-300 text-lg">%</span></h3>
          <p className="text-slate-400 text-xs sm:text-sm">Taxa de conversão</p>
        </div>

        {/* Wide chart card */}
        <div className="col-span-2 sm:col-span-3 bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-2">
            <div>
              <h4 className="font-semibold text-sm text-white">Qualificados / mês</h4>
              <p className="text-slate-400 text-xs">Crescimento contínuo</p>
            </div>
            <span className="font-space text-orange-400 text-sm font-bold">+18% ▲</span>
          </div>
          <div className="flex items-end gap-1.5 h-[80px] sm:h-[100px] border-b border-white/10 pb-px">
            {[20, 35, 45, 50, 60, 55, 80, 100].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all duration-1000 ${i === 7 ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-white/10"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  </section>
);

export default MetricsSection;
