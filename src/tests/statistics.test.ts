import { describe, it, expect } from "vitest"
import type { ClothingItem } from "@/types"

// Pure logic extracted from statistics queries for unit testing

function getMostWornItems(
  logs: { items?: Pick<ClothingItem, "id" | "name">[] }[],
  limit = 5
) {
  const counts = new Map<string, { name: string; count: number }>()
  for (const log of logs) {
    for (const item of log.items ?? []) {
      const e = counts.get(item.id)
      if (e) e.count++
      else counts.set(item.id, { name: item.name, count: 1 })
    }
  }
  return [...counts.entries()]
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

describe("getMostWornItems", () => {
  const logs = [
    { items: [{ id: "a", name: "A" }, { id: "b", name: "B" }] },
    { items: [{ id: "a", name: "A" }] },
    { items: [{ id: "c", name: "C" }] },
  ]

  it("sorts by count descending", () => {
    const result = getMostWornItems(logs)
    expect(result[0].id).toBe("a")
    expect(result[0].count).toBe(2)
  })

  it("handles empty logs", () => {
    expect(getMostWornItems([])).toHaveLength(0)
  })

  it("respects limit", () => {
    expect(getMostWornItems(logs, 1)).toHaveLength(1)
  })

  it("handles logs with no items", () => {
    const result = getMostWornItems([{ items: [] }, { items: undefined }])
    expect(result).toHaveLength(0)
  })
})
