import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { ClothingItem } from "@/types"

interface Props {
  item: ClothingItem
  isInLaundry?: boolean
}

export function ClothingItemCard({ item, isInLaundry = false }: Props) {
  return (
    <Link href={`/closet/${item.id}`} className="block">
      <div className="relative rounded-2xl bg-card border border-border shadow-[0_2px_12px_rgba(45,38,38,0.06)] overflow-hidden active:scale-[0.98] transition-transform">
        {isInLaundry && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-laundry text-white text-[10px] px-2 py-0.5 rounded-full">
              In Laundry
            </Badge>
          </div>
        )}

        <div className="aspect-[3/4] bg-muted relative">
          {item.photo_url ? (
            <Image
              src={item.photo_url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl text-muted-foreground/30 font-light select-none">
                {item.category.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <p className="text-sm font-semibold leading-tight truncate">{item.name}</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full capitalize">
              {item.category}
            </Badge>
            {item.colors.slice(0, 2).map((color) => (
              <Badge
                key={color}
                variant="outline"
                className="text-[10px] px-2 py-0.5 rounded-full capitalize border-border"
              >
                {color}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
