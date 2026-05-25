import { Skeleton } from "@/components/ui/skeleton"

export default function OutfitLogLoading() {
  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <Skeleton className="h-6 w-16 rounded-xl" />
      </div>
      <div className="grid grid-cols-7 gap-1 mb-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-9 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-4 flex gap-3">
            <Skeleton className="w-14 h-16 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3 rounded-lg" />
              <Skeleton className="h-3 w-2/3 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
