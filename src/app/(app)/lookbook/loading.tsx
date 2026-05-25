import { Skeleton } from "@/components/ui/skeleton"

export default function LookbookLoading() {
  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <Skeleton className="h-6 w-16 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border">
            <Skeleton className="aspect-[4/5] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/3 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
