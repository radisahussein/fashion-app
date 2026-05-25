import Link from "next/link"
import Image from "next/image"
import type { Lookbook } from "@/types"

export function LookbookCard({ lookbook }: { lookbook: Lookbook }) {
  const itemCount = lookbook.items?.length ?? 0

  return (
    <Link href={`/lookbook/${lookbook.id}`} className="block">
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-[0_2px_12px_rgba(45,38,38,0.06)] active:scale-[0.98] transition-transform">
        <div className="aspect-[4/5] bg-muted relative overflow-hidden">
          {lookbook.composite_image_url ? (
            <Image
              src={lookbook.composite_image_url}
              alt={lookbook.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl text-muted-foreground/20 font-light">✦</span>
            </div>
          )}
          {/* Frosted glass label */}
          <div className="absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm px-3 py-2">
            <p className="text-sm font-semibold truncate">{lookbook.name}</p>
            <p className="text-xs text-muted-foreground">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
