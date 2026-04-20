import { useEffect, useRef, useState } from "react";

const items = [
  { value: 30, suffix: "%", prefix: "+", label: "Recuperação de Base" },
  { value: 24, suffix: "/7", prefix: "", label: "Atendimento Online", isLiteral: true },
  { value: 0, suffix: "", prefix: "", label: "Contatos Esquecidos", literalText: "Zero" },
  { value: 100, suffix: "%", prefix: "", label: "Venda de Gás Automática" },
];

const useCountUp = (target: number, active: boolean, duration = 1600) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
};

const AnimatedItem = ({ item, active }: { item: typeof items[number]; active: boolean }) => {
  const v = useCountUp(item.value, active);
  const display = item.literalText ?? `${item.prefix}${Math.round(v)}${item.suffix}`;
  return (
    <div className="text-lg font-medium inline-flex items-center gap-3 text-white">
      <span className="text-3xl text-white font-bold font-space tabular-nums">{display}</span>
      {item.label}
    </div>
  );
};

const MarqueeSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative z-10 bg-orange-500 py-6 overflow-hidden whitespace-nowrap">
      <div className="flex w-max animate-marquee">
        {[...Array(3)].map((_, g) => (
          <div key={g} className="flex gap-20 px-10">
            {items.map((item, i) => (
              <AnimatedItem key={`${g}-${i}`} item={item} active={active} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeSection;
