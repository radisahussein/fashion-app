import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getOutfitLog } from "@/lib/db/outfit-logs"
import { getClothingItems } from "@/lib/db/clothing"
import { OutfitLogForm } from "@/components/outfit-log/outfit-log-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditOutfitLogPage({ params }: Props) {
  const { id } = await params
  const [log, closetItems] = await Promise.all([getOutfitLog(id), getClothingItems()])
  if (!log) notFound()

  return (
    <main className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/outfit-log/${id}`} className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Edit outfit</h1>
      </div>
      <OutfitLogForm closetItems={closetItems} log={log} />
    </main>
  )
}
