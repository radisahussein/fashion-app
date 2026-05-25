import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Pencil, Star } from "lucide-react"
import { getOutfitLog } from "@/lib/db/outfit-logs"
import { Badge } from "@/components/ui/badge"
import { DeleteLogButton } from "@/components/outfit-log/delete-log-button"
import { format, parseISO } from "date-fns"

interface Props {
  params: Promise<{ id: string }>
}

export default async function OutfitLogDetailPage({ params }: Props) {
  const { id } = await params
  const log = await getOutfitLog(id)
  if (!log) notFound()

  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/outfit-log" className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <div className="flex items-center gap-3">
          <Link href={`/outfit-log/${id}/edit`} className="text-primary">
            <Pencil size={18} strokeWidth={1.5} />
          </Link>
          <DeleteLogButton id={id} />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold">{format(parseISO(log.worn_date), "EEEE, MMMM d, yyyy")}</h1>
          {log.occasion && <p className="text-sm text-muted-foreground capitalize mt-0.5">{log.occasion}</p>}
        </div>

        {log.photo_url && (
          <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
            <Image src={log.photo_url} alt="Outfit" fill className="object-cover" />
          </div>
        )}

        {log.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                strokeWidth={1.5}
                className={i < log.rating! ? "fill-primary text-primary" : "text-border"}
              />
            ))}
          </div>
        )}

        {(log.items?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Items worn</p>
            <div className="flex flex-wrap gap-2">
              {log.items!.map((item) => (
                <Link key={item.id} href={`/closet/${item.id}`}>
                  <Badge variant="secondary" className="rounded-full text-xs capitalize">
                    {item.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {log.notes && (
          <div className="rounded-2xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{log.notes}</p>
          </div>
        )}
      </div>
    </main>
  )
}
