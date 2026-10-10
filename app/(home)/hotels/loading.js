export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading stays">
      <div className="h-72 animate-pulse bg-gradient-to-br from-navy via-[#173a63] to-[#0f5c78] md:h-80" />
      <div className="container grid grid-cols-1 gap-6 py-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-8">
        <div className="hidden h-96 animate-pulse rounded-2xl bg-gray-200 lg:block" />
        <div className="space-y-5">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-64 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
