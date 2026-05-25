import { describe, it, expect } from "vitest"

function deriveStatus(
  allIds: string[],
  returnedIds: Set<string>
): "ongoing" | "completed" | "partial" {
  if (allIds.length === 0) return "ongoing"
  const allReturned = allIds.every((id) => returnedIds.has(id))
  const noneReturned = allIds.every((id) => !returnedIds.has(id))
  if (allReturned) return "completed"
  if (noneReturned) return "ongoing"
  return "partial"
}

describe("laundry session status logic", () => {
  it("ongoing when nothing returned", () => {
    expect(deriveStatus(["a", "b"], new Set())).toBe("ongoing")
  })

  it("completed when all returned", () => {
    expect(deriveStatus(["a", "b"], new Set(["a", "b"]))).toBe("completed")
  })

  it("partial when some returned", () => {
    expect(deriveStatus(["a", "b", "c"], new Set(["a"]))).toBe("partial")
  })

  it("ongoing when empty item list", () => {
    expect(deriveStatus([], new Set())).toBe("ongoing")
  })

  it("completed when single item returned", () => {
    expect(deriveStatus(["x"], new Set(["x"]))).toBe("completed")
  })
})
