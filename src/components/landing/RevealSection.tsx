import { useEffect, useRef, ReactNode } from "react";

const RevealSection = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("active");
          obs.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
    );
    obs.observe(el);

    // Fallback: if element is already in viewport on mount, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("active");
      obs.unobserve(el);
    }

    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
};

export default RevealSection;
