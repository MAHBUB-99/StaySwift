// Navy-to-teal sunset backdrop with a soft sun and a wave edge that flows into
// the page background. Purely decorative. Place it inside a `relative isolate`
// container; it sits behind the content.
export default function SceneBackdrop({ waveClass = "h-8 md:h-12" }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#173a63] to-[#0f5c78]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 80% at 95% 10%, rgba(255,140,60,0.5), transparent 70%), radial-gradient(40% 70% at 0% 0%, rgba(90,120,255,0.3), transparent 70%)",
        }}
      />
      <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-amber-200 via-orange-400 to-primary opacity-60 blur-3xl motion-safe:animate-glow-pulse" />
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`absolute inset-x-0 bottom-0 w-full ${waveClass}`}
      >
        <path d="M0 40 C 240 0, 480 70, 720 40 S 1200 5, 1440 38 L1440 80 L0 80 Z" fill="#F4F5F8" fillOpacity="0.35" />
        <path d="M0 56 C 260 30, 520 76, 800 54 S 1240 36, 1440 58 L1440 80 L0 80 Z" fill="#F4F5F8" fillOpacity="0.6" />
        <path d="M0 68 C 300 56, 600 80, 900 68 S 1260 60, 1440 70 L1440 80 L0 80 Z" fill="#F4F5F8" />
      </svg>
    </div>
  );
}
