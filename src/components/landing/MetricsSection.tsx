import RevealSection from "./RevealSection";

const MetricsSection = () => (
  <section id="metricas" className="py-24 bg-[#030005] border-t border-white/[0.02]">
    <RevealSection className="max-w-[1200px] mx-auto px-[5%]">
      <h2 className="font-heading font-extrabold text-[clamp(2.2rem,4vw,3.5rem)] tracking-tight mb-1">
        Cada métrica, cada lead.
      </h2>
      <p className="text-lg text-slate-400 mb-10">Tudo sob controle.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/[0.02] border border-white/[0.03] rounded-2xl p-10 text-center">
          <h3 className="font-space text-6xl font-bold text-slate-50 leading-none mb-2">120</h3>
          <p className="text-slate-400 text-sm">Agendamentos essa semana</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.03] rounded-2xl p-10 text-center">
          <h3 className="font-space text-6xl font-bold text-slate-50 leading-none mb-2">2.4<span className="text-slate-400 text-2xl">min</span></h3>
          <p className="text-slate-400 text-sm">Tempo Médio de Resposta (SLA)</p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.03] rounded-2xl p-10 text-center">
          <h3 className="font-space text-6xl font-bold text-slate-50 leading-none mb-2">91<span className="text-purple-500 text-2xl">%</span></h3>
          <p className="text-slate-400 text-sm">Taxa de Leitura</p>
        </div>

        {/* Wide card with chart */}
        <div className="md:col-span-3 bg-white/[0.02] border border-white/[0.03] rounded-2xl p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4">
            <div>
              <h4 className="font-heading font-semibold text-sm">Visão Mensal (Qualificados)</h4>
              <p className="text-slate-400 text-sm">Aumento exponencial contínuo.</p>
            </div>
            <h3 className="font-space text-purple-500 text-lg font-bold">+ 315% ▲</h3>
          </div>
          <div className="flex items-end gap-2 h-[120px] border-b border-white/10 pb-px">
            {[20, 35, 45, 50, 60, 55, 80, 100].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all duration-1000 ${i === 7 ? "bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "bg-white/10"}`}
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
