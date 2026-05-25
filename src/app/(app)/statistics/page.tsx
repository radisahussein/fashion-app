import Link from "next/link"
import Image from "next/image"
import { BarChart2 } from "lucide-react"
import { getOutfitStats } from "@/lib/db/statistics"
import { format, parseISO } from "date-fns"

export default async function StatisticsPage() {
  const stats = await getOutfitStats()

  return (
    <main className="px-4 pt-6 pb-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>

      {/* Summary */}
      <div className="rounded-2xl bg-card border border-border p-4 shadow-[0_2px_12px_rgba(45,38,38,0.06)]">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 size={16} className="text-primary" strokeWidth={1.5} />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Overview</span>
        </div>
        <p className="text-2xl font-semibold">{stats.totalLogs}</p>
        <p className="text-sm text-muted-foreground">outfits logged</p>
      </div>

      {/* Category breakdown */}
      {stats.categoryBreakdown.length > 0 && (
        <Section title="Category breakdown">
          <div className="space-y-2">
            {stats.categoryBreakdown.map(({ category, count }) => {
              const max = stats.categoryBreakdown[0].count
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{category}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Most worn */}
      {stats.mostWornItems.length > 0 && (
        <Section title="Most worn">
          <ItemStatList items={stats.mostWornItems} />
        </Section>
      )}

      {/* Least worn */}
      {stats.leastWornItems.length > 0 && (
        <Section title="Worn least recently">
          <ItemStatList items={stats.leastWornItems} />
        </Section>
      )}

      {/* Recent logs */}
      {stats.recentLogs.length > 0 && (
        <Section title="Recent outfits">
          <div className="space-y-2">
            {stats.recentLogs.map((log) => (
              <Link key={log.id} href={`/outfit-log/${log.id}`} className="flex items-center gap-3 py-1">
                <div className="w-10 h-12 rounded-xl bg-muted overflow-hidden relative shrink-0">
                  {log.photo_url && <Image src={log.photo_url} alt="" fill className="object-cover" sizes="40px" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{format(parseISO(log.worn_date), "EEE, MMM d")}</p>
                  {log.occasion && <p className="text-xs text-muted-foreground capitalize">{log.occasion}</p>}
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {stats.totalLogs === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
          <p className="text-3xl">📊</p>
          <p className="text-base font-semibold">No data yet</p>
          <p className="text-sm text-muted-foreground">Log some outfits to see your stats</p>
        </div>
      )}
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-[0_2px_12px_rgba(45,38,38,0.06)] space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function ItemStatList({ items }: { items: { item: { id: string; name: string; photo_url: string | null; category: string }; count: number }[] }) {
  return (
    <div className="space-y-2">
      {items.map(({ item, count }) => (
        <Link key={item.id} href={`/closet/${item.id}`} className="flex items-center gap-3">
          <div className="w-9 h-11 rounded-xl bg-muted overflow-hidden relative shrink-0">
            {item.photo_url && <Image src={item.photo_url} alt="" fill className="object-cover" sizes="36px" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
          </div>
          <span className="text-sm font-semibold text-primary shrink-0">{count}×</span>
        </Link>
      ))}
    </div>
  )
}
