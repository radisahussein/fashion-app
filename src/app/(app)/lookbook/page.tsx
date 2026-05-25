import Link from "next/link"
import { Plus } from "lucide-react"
import { getLookbooks } from "@/lib/db/lookbooks"
import { LookbookCard } from "@/components/lookbook/lookbook-card"

export default async function LookbookPage() {
  const lookbooks = await getLookbooks()

  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Lookbook</h1>
        <Link href="/lookbook/new" className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <Plus size={18} strokeWidth={1.5} />
          New
        </Link>
      </div>

      {lookbooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
          <p className="text-4xl">✦</p>
          <p className="text-base font-semibold">No lookbooks yet</p>
          <p className="text-sm text-muted-foreground max-w-[200px]">Curate your favourite outfit combinations</p>
          <Link href="/lookbook/new" className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            <Plus size={16} strokeWidth={1.5} />
            Create lookbook
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {lookbooks.map((lb) => (
            <LookbookCard key={lb.id} lookbook={lb} />
          ))}
        </div>
      )}
    </main>
  )
}
