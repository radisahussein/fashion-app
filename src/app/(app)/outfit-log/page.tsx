import Link from "next/link"
import Image from "next/image"
import { Plus, Star } from "lucide-react"
import { getOutfitLogs } from "@/lib/db/outfit-logs"
import { format, parseISO } from "date-fns"

export default async function OutfitLogPage() {
  const logs = await getOutfitLogs(60)

  return (
    <main className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Outfit Log</h1>
        <Link href="/outfit-log/new" className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <Plus size={18} strokeWidth={1.5} />
          Log outfit
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
          <p className="text-4xl">📅</p>
          <p className="text-base font-semibold">No outfits logged yet</p>
          <p className="text-sm text-muted-foreground max-w-[200px]">Start tracking what you wear each day</p>
          <Link href="/outfit-log/new" className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            <Plus size={16} strokeWidth={1.5} />
            Log today's outfit
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Link key={log.id} href={`/outfit-log/${log.id}`} className="block">
              <div className="flex gap-3 rounded-2xl bg-card border border-border p-3 shadow-[0_2px_12px_rgba(45,38,38,0.06)] active:scale-[0.99] transition-transform">
                <div className="w-16 h-20 rounded-xl bg-muted overflow-hidden shrink-0 relative">
                  {log.photo_url ? (
                    <Image src={log.photo_url} alt="Outfit" fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground/40">
                        {(log.items?.length ?? 0) > 0 ? `${log.items!.length}` : "–"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {format(parseISO(log.worn_date), "EEE, MMM d")}
                    </p>
                    {log.rating && (
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Star size={12} className="fill-primary text-primary" />
                        <span className="text-xs text-muted-foreground">{log.rating}</span>
                      </div>
                    )}
                  </div>
                  {log.occasion && (
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{log.occasion}</p>
                  )}
                  {(log.items?.length ?? 0) > 0 && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {log.items!.map((i) => i.name).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
