import { useEffect, useRef, useState } from "react";
import { Bot, Play, CheckSquare, Flame } from "lucide-react";

const conversation = [
  { type: "bot", text: "Olá! Consultando nosso sistema, vi que faz uns 35 dias do seu último pedido de gás.", delay: 1000 },
  { type: "bot", text: "audio", delay: 2500, isAudio: true },
  { type: "user", text: "Nossa, bem lembrado! O meu acabou de secar aqui 😅", delay: 5000 },
  { type: "bot", text: "Perfeito! Já mandei a ordem pro entregador. Daqui 15 min ele tá aí!", delay: 8500 },
];

const PhoneMockup = () => {
  const [messages, setMessages] = useState<{ type: string; text: string; isAudio?: boolean }[]>([]);
  const [typing, setTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [played, setPlayed] = useState(false);
  const [hovered, setHovered] = useState(false);
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
      { threshold: 0.3 }
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
    <div className="relative w-[260px] sm:w-[280px] mx-auto" style={{ perspective: "1000px" }}>
      {/* Floating badges */}
      <div className="absolute top-12 -right-4 sm:-right-8 z-30 bg-orange-500 text-white border border-orange-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_12px_rgba(249,115,22,0.4)] animate-float">
        <Flame className="w-3 h-3" /> Pedido Feito
      </div>
      <div className={`absolute bottom-8 -left-4 sm:-left-12 z-30 bg-[#1a0f05] border border-orange-500/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.8)] transition-all duration-500 ${showBadge ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
        style={{ animation: showBadge ? "float 5s ease-in-out infinite reverse" : "none" }}>
        <CheckSquare className="w-3 h-3" /> Lead qualificado
      </div>

      {/* Phone */}
      <div
        className="w-full h-[520px] sm:h-[560px] bg-black rounded-[32px] border-[6px] border-[#1a1622] overflow-hidden relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered
            ? "rotateY(0deg) rotateX(0deg) rotateZ(0deg)"
            : "rotateY(-12deg) rotateX(4deg) rotateZ(1.5deg)",
          transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease",
          boxShadow: hovered
            ? "inset 0 0 0 1px #44390a, 0 30px 50px rgba(0,0,0,0.9), 0 0 60px rgba(249,115,22,0.2)"
            : "inset 0 0 0 1px #332b0a, 0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(249,115,22,0.08)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-6 bg-[#1a1622] rounded-b-xl z-20" />

        <div className="w-full h-full bg-[#07040a] flex flex-col pt-7">
          {/* Chat header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.02] bg-white/[0.015] backdrop-blur-xl">
            <div className="w-7 h-7 rounded-full bg-[#1a1008] border border-orange-500/30 flex items-center justify-center text-orange-300">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-xs leading-tight flex-1">
              <strong className="text-slate-50">Agente SalesFlow.IA</strong>
              <span className="text-orange-300 text-[10px] flex items-center gap-1">
                <span className="w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_4px_rgba(249,115,22,1)]" />
                Online
              </span>
            </div>
          </div>

          {/* Chat body */}
          <div ref={containerRef} className="flex-1 px-3 py-4 overflow-y-hidden flex flex-col gap-2.5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[88%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed animate-fade-in ${
                  msg.type === "bot"
                    ? "bg-[#150f1c] rounded-bl self-start text-slate-300 border border-white/[0.03]"
                    : "bg-[#2d1b0a] rounded-br self-end text-slate-50 border border-orange-500/20"
                }`}
              >
                {msg.isAudio ? <AudioBubble /> : msg.text}
              </div>
            ))}
            {typing && (
              <div className="bg-[#150f1c] rounded-2xl rounded-bl px-3 py-2.5 self-start border border-white/[0.03] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: "160ms" }} />
                <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: "320ms" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AudioBubble = () => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white">
      <Play className="w-3 h-3" />
    </div>
    <div className="w-5 h-5 rounded-full bg-[#1a1008] border border-orange-500/30 flex items-center justify-center text-orange-300 text-[10px]">
      <Bot className="w-2.5 h-2.5" />
    </div>
    <div className="flex-1 flex items-center gap-0.5 h-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="w-[2px] bg-orange-300 rounded"
          style={{
            height: `${30 + Math.random() * 70}%`,
            animation: `wave-anim 1s infinite alternate ease-in-out`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
    <span className="text-[10px] text-slate-400 font-mono">0:34</span>
  </div>
);

export default PhoneMockup;
