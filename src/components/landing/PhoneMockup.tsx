import { useEffect, useRef, useState } from "react";
import { Bot, Play, CheckSquare, Flame } from "lucide-react";

const conversation = [
  { type: "bot", text: "Olá! Consultando nosso sistema, vi que faz uns 35 dias do seu último pedido de gás.", delay: 1000 },
  { type: "bot", text: "audio", delay: 2500, isAudio: true },
  { type: "user", text: "Nossa, bem lembrado! O meu acabou de secar aqui, estava quase saindo pra comprar 😅", delay: 5000 },
  { type: "bot", text: "Perfeito! Já mandei a ordem direto pro entregador e avisei pra levar a maquininha.", delay: 8500 },
  { type: "bot", text: "Daqui a uns 15 minutinhos ele buzina aí na sua porta, beleza?", delay: 11500 },
];

const PhoneMockup = () => {
  const [messages, setMessages] = useState<{ type: string; text: string; isAudio?: boolean }[]>([]);
  const [typing, setTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [played, setPlayed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played) {
          setPlayed(true);
          playChat();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [played]);

  const playChat = () => {
    conversation.forEach((msg, index) => {
      if (msg.type === "bot") {
        setTimeout(() => setTyping(true), msg.delay - 600);
      }
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, msg]);
        if (index === conversation.length - 1) {
          setTimeout(() => setShowBadge(true), 500);
        }
      }, msg.delay);
    });
  };

  return (
    <div className="relative w-[340px] mx-auto" style={{ perspective: "1000px" }}>
      {/* Floating badges */}
      <div className="absolute top-16 -right-10 z-30 bg-purple-500 text-white border border-purple-300 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(168,85,247,0.4)] animate-float">
        <Flame className="w-4 h-4" /> Pedido Feito
      </div>
      <div className={`absolute bottom-10 -left-16 z-30 bg-[#160c24] border border-purple-500/50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold text-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(168,85,247,0.4)] transition-all duration-500 ${showBadge ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
        style={{ animation: showBadge ? "float 5s ease-in-out infinite reverse" : "none" }}>
        <CheckSquare className="w-4 h-4" /> Lead qualificado
      </div>

      {/* Phone */}
      <div className="w-full h-[680px] bg-black rounded-[40px] border-[8px] border-[#1a1622] overflow-hidden relative transition-all duration-400 hover:[transform:rotateY(-5deg)_rotateX(2deg)_rotateZ(0deg)]"
        style={{
          transform: "rotateY(-15deg) rotateX(5deg) rotateZ(2deg)",
          boxShadow: "inset 0 0 0 1px #332b42, 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(168,85,247,0.1)",
          transformStyle: "preserve3d",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-7 bg-[#1a1622] rounded-b-2xl z-20" />

        <div className="w-full h-full bg-[#07040a] flex flex-col pt-9">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.02] bg-white/[0.015] backdrop-blur-xl">
            <div className="w-9 h-9 rounded-full bg-[#1c1428] border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-sm leading-tight flex-1">
              <strong className="text-slate-50 text-sm">Agente SalesFlow.IA</strong>
              <span className="text-purple-300 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_5px_rgba(168,85,247,1)]" />
                Online
              </span>
            </div>
          </div>

          {/* Chat body */}
          <div ref={containerRef} className="flex-1 px-4 py-5 overflow-y-hidden flex flex-col gap-3.5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[88%] px-4 py-3 rounded-[20px] text-sm leading-relaxed animate-fade-in ${
                  msg.type === "bot"
                    ? "bg-[#150f1c] rounded-bl self-start text-slate-300 border border-white/[0.03]"
                    : "bg-[#2d1b46] rounded-br self-end text-slate-50 border border-purple-500/20"
                }`}
              >
                {msg.isAudio ? <AudioBubble /> : msg.text}
              </div>
            ))}
            {typing && (
              <div className="bg-[#150f1c] rounded-[20px] rounded-bl px-4 py-3 self-start border border-white/[0.03] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "160ms" }} />
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "320ms" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AudioBubble = () => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
      <Play className="w-4 h-4" />
    </div>
    <div className="w-6 h-6 rounded-full bg-[#1c1428] border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs">
      <Bot className="w-3 h-3" />
    </div>
    <div className="flex-1 flex items-center gap-0.5 h-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] bg-purple-300 rounded"
          style={{
            height: `${30 + Math.random() * 70}%`,
            animation: `wave-anim 1s infinite alternate ease-in-out`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
    <span className="text-xs text-slate-400 font-mono">0:34</span>
  </div>
);

export default PhoneMockup;
