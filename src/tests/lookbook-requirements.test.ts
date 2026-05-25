import { describe, it, expect } from "vitest"
import { validateLookbookRequirements } from "@/lib/lookbook/requirements"
import type { ClothingItem } from "@/types"

function makeItem(overrides: Partial<ClothingItem>): ClothingItem {
  return {
    id: "1",
    user_id: "u1",
    name: "Item",
    category: "top",
    colors: ["white"],
    brand: null,
    size: null,
    date_purchased: null,
    photo_url: null,
    notes: null,
    is_active: true,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe("validateLookbookRequirements", () => {
  it("returns no violations when requirements empty", () => {
    const items = [makeItem({})]
    expect(validateLookbookRequirements(items, {})).toHaveLength(0)
  })

  it("passes min_accessories when count meets threshold", () => {
    const items = [makeItem({ category: "accessory" }), makeItem({ category: "accessory" })]
    expect(validateLookbookRequirements(items, { min_accessories: 2 })).toHaveLength(0)
  })

  it("violates min_accessories when count below threshold", () => {
    const items = [makeItem({ category: "top" })]
    const violations = validateLookbookRequirements(items, { min_accessories: 1 })
    expect(violations).toHaveLength(1)
    expect(violations[0].rule).toBe("min_accessories")
    expect(violations[0].message).toMatch(/Need at least 1 accessory/)
  })

  it("uses plural 'accessories' for threshold > 1", () => {
    const items: ClothingItem[] = []
    const violations = validateLookbookRequirements(items, { min_accessories: 2 })
    expect(violations[0].message).toMatch(/accessories/)
  })

  it("passes min_colors when unique colors meet threshold", () => {
    const items = [
      makeItem({ colors: ["red", "blue"] }),
      makeItem({ colors: ["green"] }),
    ]
    expect(validateLookbookRequirements(items, { min_colors: 3 })).toHaveLength(0)
  })

  it("violates min_colors when unique colors below threshold", () => {
    const items = [makeItem({ colors: ["red"] }), makeItem({ colors: ["red"] })]
    const violations = validateLookbookRequirements(items, { min_colors: 2 })
    expect(violations).toHaveLength(1)
    expect(violations[0].rule).toBe("min_colors")
    expect(violations[0].message).toMatch(/Need at least 2 colors \(have 1\)/)
  })

  it("passes required_categories when all present", () => {
    const items = [makeItem({ category: "top" }), makeItem({ category: "bottom" })]
    expect(validateLookbookRequirements(items, { required_categories: ["top", "bottom"] })).toHaveLength(0)
  })

  it("violates required_categories for each missing category", () => {
    const items = [makeItem({ category: "top" })]
    const violations = validateLookbookRequirements(items, { required_categories: ["top", "bottom", "shoes"] })
    expect(violations).toHaveLength(2)
    const rules = violations.map((v) => v.rule)
    expect(rules.every((r) => r === "required_categories")).toBe(true)
    const messages = violations.map((v) => v.message)
    expect(messages).toContain("Missing required category: bottom")
    expect(messages).toContain("Missing required category: shoes")
  })

  it("accumulates multiple violation types", () => {
    const items = [makeItem({ category: "top", colors: ["white"] })]
    const violations = validateLookbookRequirements(items, {
      min_accessories: 1,
      min_colors: 3,
      required_categories: ["bottom"],
    })
    expect(violations).toHaveLength(3)
  })

  it("returns no violations when items is empty and no requirements set", () => {
    expect(validateLookbookRequirements([], {})).toHaveLength(0)
  })
})
