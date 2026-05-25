import { describe, it, expect } from "vitest"
import { outfitLogSchema } from "@/lib/schemas/outfit-log"

describe("outfitLogSchema", () => {
  const valid = { worn_date: "2026-05-26" }

  it("accepts minimal valid log", () => {
    expect(outfitLogSchema.safeParse(valid).success).toBe(true)
  })

  it("rejects empty worn_date", () => {
    expect(outfitLogSchema.safeParse({ worn_date: "" }).success).toBe(false)
  })

  it("accepts all optional fields", () => {
    const result = outfitLogSchema.safeParse({
      ...valid,
      occasion: "work",
      rating: 4,
      notes: "Felt great",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid occasion", () => {
    const result = outfitLogSchema.safeParse({ ...valid, occasion: "wedding" })
    expect(result.success).toBe(false)
  })

  it("rejects rating out of range", () => {
    expect(outfitLogSchema.safeParse({ ...valid, rating: 6 }).success).toBe(false)
    expect(outfitLogSchema.safeParse({ ...valid, rating: 0 }).success).toBe(false)
  })

  it("rejects notes over 500 chars", () => {
    expect(outfitLogSchema.safeParse({ ...valid, notes: "a".repeat(501) }).success).toBe(false)
  })
})
