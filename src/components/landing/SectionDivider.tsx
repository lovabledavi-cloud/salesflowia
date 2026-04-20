interface Props {
  variant?: "glow" | "line" | "fade";
}

const SectionDivider = ({ variant = "glow" }: Props) => {
  if (variant === "line") {
    return (
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
    );
  }
  if (variant === "fade") {
    return (
      <div className="relative h-24 w-full pointer-events-none" style={{
        background: "linear-gradient(to bottom, transparent 0%, rgba(249,115,22,0.04) 50%, transparent 100%)"
      }} />
    );
  }
  // glow
  return (
    <div className="relative h-32 w-full pointer-events-none overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-24 rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.4) 0%, transparent 70%)" }}
      />
    </div>
  );
};

export default SectionDivider;
