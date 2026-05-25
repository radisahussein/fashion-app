import { Skeleton } from "@/components/ui/skeleton"

export default function LaundryLoading() {
  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-6 w-16 rounded-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-4 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-2/5 rounded-lg" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-1/3 rounded-lg" />
            <Skeleton className="h-3 w-1/4 rounded-lg" />
          </div>
        ))}
      </div>
    </main>
  )
}
