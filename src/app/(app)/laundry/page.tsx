import Link from "next/link"
import { Plus } from "lucide-react"
import { getLaundrySessions } from "@/lib/db/laundry"
import { LaundrySessionCard } from "@/components/laundry/laundry-session-card"

export default async function LaundryPage() {
  const sessions = await getLaundrySessions()

  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Laundry</h1>
        <Link href="/laundry/new" className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <Plus size={18} strokeWidth={1.5} />
          New
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
          <p className="text-4xl">✦</p>
          <p className="text-base font-semibold">No laundry sessions yet</p>
          <p className="text-sm text-muted-foreground max-w-[200px]">Track which items are at the laundromat</p>
          <Link
            href="/laundry/new"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium"
          >
            <Plus size={16} strokeWidth={1.5} />
            New session
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <LaundrySessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </main>
  )
}
