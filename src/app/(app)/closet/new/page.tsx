import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ClothingItemForm } from "@/components/closet/clothing-item-form"

export default function NewClosetItemPage() {
  return (
    <main className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/closet" className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Add item</h1>
      </div>
      <ClothingItemForm />
    </main>
  )
}
