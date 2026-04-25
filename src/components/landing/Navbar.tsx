import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <nav
        className={`max-w-[1200px] mx-auto rounded-2xl transition-all duration-400 px-4 sm:px-6 ${
          scrolled
            ? "bg-white/85 border border-orange-500/30 py-2.5 shadow-sm"
            : "bg-white/70 border border-slate-200 py-3"
        }`}
        style={{ backdropFilter: "blur(16px)" }}
      >
        <div className="flex justify-between items-center">
          <a href="#" className="no-underline">
            <img src="/images/logo.png" alt="SalesFlow.IA" className="h-10 sm:h-12 object-contain" />
          </a>
          <div className="flex gap-3 items-center">
            <a href="#metricas" className="hidden sm:inline-flex border border-slate-200 bg-transparent text-slate-700 text-xs px-5 py-2 rounded-full font-medium hover:border-orange-500/60 hover:text-orange-600 transition-all">
              Dashboard
            </a>
            <a href="#agendar" className="inline-flex bg-orange-500 text-white text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full font-bold hover:bg-orange-600 transition-all">
              Agende uma Demonstração
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
