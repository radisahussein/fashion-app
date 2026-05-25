import { Skeleton } from "@/components/ui/skeleton"

export default function StatisticsLoading() {
  return (
    <main className="px-4 pt-6 pb-6 space-y-5">
      <Skeleton className="h-8 w-28 rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-4 space-y-2">
            <Skeleton className="h-3 w-2/3 rounded-lg" />
            <Skeleton className="h-8 w-1/2 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="w-10 h-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <Skeleton className="h-3 w-1/4 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
