import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-400 ${
        scrolled
          ? "bg-[rgba(10,5,16,0.9)] border-b border-purple-500/30 py-3"
          : "bg-[rgba(255,255,255,0.015)] border-b border-white/[0.02] py-5"
      }`}
      style={{ backdropFilter: "blur(10px)" }}
    >
      <div className="max-w-[1400px] mx-auto px-[5%] flex justify-between items-center">
        <a href="#" className="no-underline">
          <img src="/images/logo.png" alt="SalesFlow.IA" className="h-14 object-contain" />
        </a>
        <div className="flex gap-4 items-center">
          <a href="#metricas" className="hidden sm:inline-flex border border-white/10 bg-transparent text-slate-50 text-sm px-6 py-2.5 rounded-full font-medium hover:border-purple-500/50 transition-all">
            Dashboard
          </a>
          <a href="#agendar" className="inline-flex bg-slate-50 text-[#07040a] text-sm px-6 py-2.5 rounded-full font-bold hover:bg-white transition-all">
            Diagnóstico Gratuito
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
