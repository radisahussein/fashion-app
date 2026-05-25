import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Pencil } from "lucide-react"
import { getClothingItem } from "@/lib/db/clothing"
import { Badge } from "@/components/ui/badge"
import { DeleteItemButton } from "@/components/closet/delete-item-button"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClothingItemPage({ params }: Props) {
  const { id } = await params
  const item = await getClothingItem(id)
  if (!item) notFound()

  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/closet" className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <div className="flex items-center gap-3">
          <Link href={`/closet/${id}/edit`} className="text-primary">
            <Pencil size={18} strokeWidth={1.5} />
          </Link>
          <DeleteItemButton id={id} />
        </div>
      </div>

      <div className="space-y-5">
        {/* Photo */}
        <div className="aspect-[3/4] max-w-[240px] mx-auto rounded-2xl bg-muted overflow-hidden relative">
          {item.photo_url ? (
            <Image src={item.photo_url} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl text-muted-foreground/30 font-light">
                {item.category.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold">{item.name}</h1>
            <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.colors.map((color) => (
              <Badge key={color} variant="outline" className="rounded-full capitalize text-xs">
                {color}
              </Badge>
            ))}
          </div>

          <div className="rounded-2xl border border-border divide-y divide-border">
            {item.brand && (
              <Row label="Brand" value={item.brand} />
            )}
            {item.size && (
              <Row label="Size" value={item.size} />
            )}
            {item.date_purchased && (
              <Row label="Purchased" value={new Date(item.date_purchased).toLocaleDateString()} />
            )}
            {item.notes && (
              <Row label="Notes" value={item.notes} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}
