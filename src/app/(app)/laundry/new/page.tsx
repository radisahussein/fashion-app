import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getClothingItems } from "@/lib/db/clothing"
import { getActiveSessionItemIds } from "@/lib/db/laundry"
import { LaundrySessionForm } from "@/components/laundry/laundry-session-form"

export default async function NewLaundryPage() {
  const [allItems, activeIds] = await Promise.all([getClothingItems(), getActiveSessionItemIds()])
  const availableItems = allItems.filter((i) => !activeIds.has(i.id))

  return (
    <main className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/laundry" className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">New laundry session</h1>
      </div>
      <LaundrySessionForm availableItems={availableItems} />
    </main>
  )
}
