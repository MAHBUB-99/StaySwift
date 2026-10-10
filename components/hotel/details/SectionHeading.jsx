export default function SectionHeading({ kicker, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{kicker}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{children}</h2>
    </div>
  );
}
