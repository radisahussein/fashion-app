import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getClothingItem } from "@/lib/db/clothing"
import { ClothingItemForm } from "@/components/closet/clothing-item-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditClothingItemPage({ params }: Props) {
  const { id } = await params
  const item = await getClothingItem(id)
  if (!item) notFound()

  return (
    <main className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/closet/${id}`} className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Edit item</h1>
      </div>
      <ClothingItemForm item={item} />
    </main>
  )
}
