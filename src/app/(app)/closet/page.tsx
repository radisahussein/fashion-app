import Link from "next/link"
import { Plus } from "lucide-react"
import { getClothingItems } from "@/lib/db/clothing"
import { ClothingItemCard } from "@/components/closet/clothing-item-card"

export default async function ClosetPage() {
  const items = await getClothingItems()

  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Closet</h1>
        <Link
          href="/closet/new"
          className="flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Plus size={18} strokeWidth={1.5} />
          Add item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
          <p className="text-4xl">👗</p>
          <p className="text-base font-semibold">Your closet is empty</p>
          <p className="text-sm text-muted-foreground max-w-[200px]">
            Add your first clothing item to get started
          </p>
          <Link
            href="/closet/new"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium"
          >
            <Plus size={16} strokeWidth={1.5} />
            Add item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <ClothingItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  )
}
