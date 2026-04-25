import { useEffect, useRef, useState } from "react";

const items = [
  { display: "+30%", label: "Recuperação de Base" },
  { display: "24/7", label: "Atendimento Online" },
  { display: "Zero", label: "Contatos Esquecidos" },
  { display: "100%", label: "Venda de Gás Automática" },
];

const StaticItem = ({ item }: { item: typeof items[number] }) => (
  <div className="text-lg font-medium inline-flex items-center gap-3 text-white">
    <span className="text-3xl text-white font-bold font-space tabular-nums">{item.display}</span>
    {item.label}
  </div>
);

const MarqueeSection = () => {
  return (
    <div className="relative z-10 bg-orange-500 py-6 overflow-hidden whitespace-nowrap">
      <div className="flex w-max animate-marquee">
        {[...Array(3)].map((_, g) => (
          <div key={g} className="flex gap-20 px-10">
            {items.map((item, i) => (
              <StaticItem key={`${g}-${i}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeSection;
