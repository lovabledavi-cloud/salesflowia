import { useEffect, useRef, useState } from "react";
import RevealSection from "./RevealSection";

// Animate a number counting up from 0 → target when in view
const useCountUp = (target: number, duration = 1600, decimals = 0) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(target * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        } else if (!e.isIntersecting) {
          // reset to allow re-animation when scrolling back
          started.current = false;
          setValue(0);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return { ref, display };
};

const StatNumber = ({
  target,
  duration = 1600,
  decimals = 0,
  format,
  suffix,
  suffixClass,
}: {
  target: number;
  duration?: number;
  decimals?: number;
  format?: (n: string) => string;
  suffix?: string;
  suffixClass?: string;
}) => {
  const { ref, display } = useCountUp(target, duration, decimals);
  const formatted = format ? format(display) : display;
  return (
    <span ref={ref}>
      {formatted}
      {suffix && <span className={suffixClass}>{suffix}</span>}
    </span>
  );
};

const BARS = [20, 35, 45, 50, 60, 55, 80, 100];

const ChartBars = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // small delay so the animation feels deliberate
          setTimeout(() => setAnimated(true), 150);
        } else {
          setAnimated(false);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-end gap-1.5 h-[80px] sm:h-[100px] border-b border-slate-200 pb-px">
      {BARS.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t transition-all ease-out ${
            i === 7 ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.35)]" : "bg-slate-200"
          }`}
          style={{
            height: animated ? `${h}%` : "0%",
            transitionDuration: "1100ms",
            transitionDelay: `${i * 90}ms`,
          }}
        />
      ))}
    </div>
  );
};

const MetricsSection = () => (
  <section id="metricas" className="py-20 sm:py-24 bg-transparent">
    <RevealSection className="max-w-[1000px] mx-auto px-5 sm:px-[5%]">
      <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-1 text-slate-900">
        Cada métrica, cada lead.
      </h2>
      <p className="text-sm sm:text-base text-slate-600 mb-8">Tudo sob controle.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 text-center shadow-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-orange-500 leading-none mb-1 tabular-nums">
            <StatNumber
              target={1.2}
              decimals={1}
              format={(d) => d}
              suffix="k"
              suffixClass="text-orange-400"
            />
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm">Leads qualificados</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 text-center shadow-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-orange-500 leading-none mb-1 tabular-nums">
            &lt;<StatNumber target={2} suffix="s" suffixClass="text-orange-400 text-lg" />
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm">Tempo de resposta</p>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 text-center shadow-sm">
          <h3 className="font-space text-3xl sm:text-4xl font-bold text-orange-500 leading-none mb-1 tabular-nums">
            <StatNumber target={24} suffix="%" suffixClass="text-orange-400 text-lg" />
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm">Taxa de conversão</p>
        </div>

        {/* Wide chart card */}
        <div className="col-span-2 sm:col-span-3 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-2">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">Qualificados / mês</h4>
              <p className="text-slate-600 text-xs">Crescimento contínuo</p>
            </div>
            <span className="font-space text-orange-500 text-sm font-bold tabular-nums">
              +<StatNumber target={18} />% ▲
            </span>
          </div>
          <ChartBars />
        </div>
      </div>
    </RevealSection>
  </section>
);

export default MetricsSection;
