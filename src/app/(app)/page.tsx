import Link from "next/link"
import Image from "next/image"
import { BarChart2, ChevronRight, Star } from "lucide-react"
import { getOutfitLogs } from "@/lib/db/outfit-logs"
import { getClothingItems } from "@/lib/db/clothing"
import { getLaundrySessions } from "@/lib/db/laundry"
import { format, parseISO, subDays } from "date-fns"

export default async function HomePage() {
  const [logs, allItems, laundrySessions] = await Promise.all([
    getOutfitLogs(14),
    getClothingItems(),
    getLaundrySessions(),
  ])
  const ongoingLaundry = laundrySessions.filter((s) => s.status === "ongoing")

  const yesterday = subDays(new Date(), 1).toISOString().split("T")[0]
  const yesterdayLog = logs.find((l) => l.worn_date === yesterday)

  // Suggest items worn least in last 14 days
  const wornIds = new Set(logs.flatMap((l) => l.items?.map((i) => i.id) ?? []))
  const suggestions = allItems.filter((i) => !wornIds.has(i.id)).slice(0, 3)

  return (
    <main className="px-4 pt-6 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Wardrobe</h1>
          <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</p>
        </div>
        <Link href="/statistics" className="flex items-center gap-1 text-sm text-muted-foreground">
          <BarChart2 size={18} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Yesterday's outfit */}
      <Section title="Yesterday's outfit" href={yesterdayLog ? `/outfit-log/${yesterdayLog.id}` : "/outfit-log/new"}>
        {yesterdayLog ? (
          <div className="flex items-center gap-3">
            <div className="w-14 h-16 rounded-xl bg-muted overflow-hidden relative shrink-0">
              {yesterdayLog.photo_url && (
                <Image src={yesterdayLog.photo_url} alt="Yesterday" fill className="object-cover" sizes="56px" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {yesterdayLog.occasion && (
                <p className="text-xs text-muted-foreground capitalize mb-0.5">{yesterdayLog.occasion}</p>
              )}
              {(yesterdayLog.items?.length ?? 0) > 0 && (
                <p className="text-sm truncate">{yesterdayLog.items!.map((i) => i.name).join(", ")}</p>
              )}
              {yesterdayLog.rating && (
                <div className="flex items-center gap-0.5 mt-1">
                  <Star size={12} className="fill-primary text-primary" />
                  <span className="text-xs text-muted-foreground">{yesterdayLog.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing logged yet</p>
        )}
      </Section>

      {/* Outfit streak */}
      <div className="rounded-2xl bg-card border border-border p-4 shadow-[0_2px_12px_rgba(45,38,38,0.06)]">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Logged</p>
        <p className="text-2xl font-semibold">{logs.length} <span className="text-base font-normal text-muted-foreground">outfits this month</span></p>
      </div>

      {/* Laundry widget */}
      {ongoingLaundry.length > 0 && (
        <Section title="In laundry" href="/laundry">
          {ongoingLaundry.map((s) => {
            const total = s.items?.length ?? 0
            const returned = s.items?.filter((i) => i.returned).length ?? 0
            return (
              <div key={s.id} className="flex justify-between items-center text-sm">
                <span className="font-medium truncate">{s.location_name}</span>
                <span className="text-muted-foreground shrink-0 ml-2">{returned}/{total}</span>
              </div>
            )
          })}
        </Section>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Section title="Haven't worn recently" href="/closet">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((item) => (
              <Link key={item.id} href={`/closet/${item.id}`} className="shrink-0">
                <div className="w-16 h-20 rounded-xl bg-muted overflow-hidden relative">
                  {item.photo_url ? (
                    <Image src={item.photo_url} alt={item.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg text-muted-foreground/30">{item.category.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-medium mt-1 w-16 truncate">{item.name}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-[0_2px_12px_rgba(45,38,38,0.06)] space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
        {href && (
          <Link href={href} className="text-muted-foreground">
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}
