import { describe, it, expect } from "vitest"
import { clothingItemSchema } from "@/lib/schemas/clothing"

describe("clothingItemSchema", () => {
  const valid = {
    name: "White linen shirt",
    category: "top" as const,
    colors: ["white"],
    is_active: true,
  }

  it("accepts valid item", () => {
    const result = clothingItemSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("rejects empty name", () => {
    const result = clothingItemSchema.safeParse({ ...valid, name: "" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid category", () => {
    const result = clothingItemSchema.safeParse({ ...valid, category: "socks" })
    expect(result.success).toBe(false)
  })

  it("rejects empty colors array", () => {
    const result = clothingItemSchema.safeParse({ ...valid, colors: [] })
    expect(result.success).toBe(false)
  })

  it("accepts optional fields as empty string", () => {
    const result = clothingItemSchema.safeParse({ ...valid, brand: "", size: "", notes: "" })
    expect(result.success).toBe(true)
  })

  it("rejects notes over 500 chars", () => {
    const result = clothingItemSchema.safeParse({ ...valid, notes: "a".repeat(501) })
    expect(result.success).toBe(false)
  })
})
