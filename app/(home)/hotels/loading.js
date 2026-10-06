export default function Loading() {
  return (
    <div className="container py-6" aria-busy="true" aria-label="Loading stays">
      <div className="h-14 animate-pulse rounded-xl bg-gray-200" />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden h-96 animate-pulse rounded-2xl bg-gray-200 lg:block" />
        <div className="space-y-4">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-56 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
