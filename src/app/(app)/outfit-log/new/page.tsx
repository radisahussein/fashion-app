import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getClothingItems } from "@/lib/db/clothing"
import { OutfitLogForm } from "@/components/outfit-log/outfit-log-form"

export default async function NewOutfitLogPage() {
  const closetItems = await getClothingItems()

  return (
    <main className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/outfit-log" className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Log outfit</h1>
      </div>
      <OutfitLogForm closetItems={closetItems} />
    </main>
  )
}
