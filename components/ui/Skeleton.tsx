export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#E5E5E5] rounded-lg ${className}`} />
  );
}

export function PhoneCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function PhoneGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PhoneCardSkeleton key={i} />
      ))}
    </div>
  );
}
