const items = [
  { value: "+30%", label: "Recuperação de Base" },
  { value: "24/7", label: "Atendimento Online" },
  { value: "Zero", label: "Contatos Esquecidos" },
  { value: "100%", label: "Venda de Gás Automática" },
];

const MarqueeSection = () => (
  <div
    className="relative z-30 border-y border-white/[0.08] py-6 overflow-hidden whitespace-nowrap backdrop-blur-md"
    style={{ background: "rgba(5, 0, 16, 0.72)" }}
  >
    <div className="flex w-max animate-marquee">
      {[...Array(3)].map((_, g) => (
        <div key={g} className="flex gap-20 px-10">
          {items.map((item, i) => (
            <div key={i} className="text-lg font-medium inline-flex items-center gap-3">
              <span className="text-3xl text-purple-500 font-bold font-space">{item.value}</span>
              {item.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default MarqueeSection;
