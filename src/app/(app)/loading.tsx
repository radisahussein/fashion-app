import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <main className="px-4 pt-6 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-4 w-36 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border p-4 space-y-3">
          <Skeleton className="h-3 w-24 rounded-lg" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ))}
    </main>
  )
}
