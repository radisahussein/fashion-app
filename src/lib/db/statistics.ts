"use server"

import { createClient } from "@/lib/supabase/server"
import type { OutfitStats, ItemStat, CategoryStat } from "@/types"

export async function getOutfitStats(): Promise<OutfitStats> {
  const supabase = await createClient()

  // Fetch recent logs with items
  const { data: logs } = await supabase
    .from("outfit_logs")
    .select(`id, worn_date, photo_url, occasion, rating, notes, created_at, user_id,
             items:outfit_log_items(clothing_item:clothing_items(*))`)
    .order("worn_date", { ascending: false })
    .limit(60)

  const recentLogs = (logs ?? []).map((raw: any) => ({
    ...raw,
    items: (raw.items ?? []).map((i: any) => i.clothing_item),
  }))

  // Count item appearances
  const itemCounts = new Map<string, { item: any; count: number }>()
  for (const log of recentLogs) {
    for (const item of log.items ?? []) {
      const existing = itemCounts.get(item.id)
      if (existing) {
        existing.count++
      } else {
        itemCounts.set(item.id, { item, count: 1 })
      }
    }
  }

  const sorted = [...itemCounts.values()].sort((a, b) => b.count - a.count)
  const mostWornItems: ItemStat[] = sorted.slice(0, 5)
  const leastWornItems: ItemStat[] = [...sorted].reverse().slice(0, 5)

  // Category breakdown across all items used
  const catCounts = new Map<string, number>()
  for (const { item } of itemCounts.values()) {
    catCounts.set(item.category, (catCounts.get(item.category) ?? 0) + 1)
  }
  const categoryBreakdown: CategoryStat[] = [...catCounts.entries()]
    .map(([category, count]) => ({ category: category as any, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalLogs: recentLogs.length,
    mostWornItems,
    leastWornItems,
    recentLogs: recentLogs.slice(0, 7),
    categoryBreakdown,
  }
}
