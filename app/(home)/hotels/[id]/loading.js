export default function Loading() {
  return (
    <div className="container space-y-6 py-6" aria-busy="true" aria-label="Loading hotel">
      <div className="h-[260px] animate-pulse rounded-2xl bg-gray-200 md:h-[420px]" />
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-72 animate-pulse rounded-2xl bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
