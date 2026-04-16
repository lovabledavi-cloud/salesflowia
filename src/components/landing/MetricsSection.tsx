import RevealSection from "./RevealSection";

const MetricsSection = () => (
  <section id="metricas" className="py-20 sm:py-24 bg-orange-500">
    <RevealSection className="max-w-[1000px] mx-auto px-5 sm:px-[5%]">
      <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-1 text-white">
        Cada métrica, cada lead.
      </h2>
      <p className="text-sm sm:text-base text-orange-100 mb-8">Tudo sob controle.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white/15 border border-white/20 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-white leading-none mb-1">1.2k</h3>
          <p className="text-orange-100 text-xs sm:text-sm">Leads qualificados</p>
        </div>
        <div className="bg-white/15 border border-white/20 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-white leading-none mb-1">&lt;2<span className="text-orange-200 text-lg">s</span></h3>
          <p className="text-orange-100 text-xs sm:text-sm">Tempo de resposta</p>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white/15 border border-white/20 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-white leading-none mb-1">24<span className="text-orange-200 text-lg">%</span></h3>
          <p className="text-orange-100 text-xs sm:text-sm">Taxa de conversão</p>
        </div>

        {/* Wide chart card */}
        <div className="col-span-2 sm:col-span-3 bg-white/15 border border-white/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-2">
            <div>
              <h4 className="font-semibold text-sm text-white">Qualificados / mês</h4>
              <p className="text-orange-100 text-xs">Crescimento contínuo</p>
            </div>
            <span className="font-space text-white text-sm font-bold">+18% ▲</span>
          </div>
          <div className="flex items-end gap-1.5 h-[80px] sm:h-[100px] border-b border-white/20 pb-px">
            {[20, 35, 45, 50, 60, 55, 80, 100].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all duration-1000 ${i === 7 ? "bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "bg-white/20"}`}
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
