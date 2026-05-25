import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getClothingItems } from "@/lib/db/clothing"
import { LookbookForm } from "@/components/lookbook/lookbook-form"

export default async function NewLookbookPage() {
  const closetItems = await getClothingItems()

  return (
    <main className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/lookbook" className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">New lookbook</h1>
      </div>
      <LookbookForm closetItems={closetItems} />
    </main>
  )
}
