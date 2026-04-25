interface Props {
  variant?: "glow" | "line" | "fade";
}

const SectionDivider = ({ variant = "glow" }: Props) => {
  if (variant === "line") {
    return (
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    );
  }
  if (variant === "fade") {
    return (
      <div className="relative h-16 w-full pointer-events-none" style={{
        background: "linear-gradient(to bottom, transparent 0%, rgba(249,115,22,0.05) 50%, transparent 100%)"
      }} />
    );
  }
  // glow — soft orange dot + line for white theme
  return (
    <div className="relative h-20 w-full pointer-events-none overflow-hidden flex items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-16 rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.35) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
    </div>
  );
};

export default SectionDivider;
