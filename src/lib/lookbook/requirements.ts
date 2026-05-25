import type { ClothingItem, LookbookRequirements, RequirementViolation } from "@/types"

export function validateLookbookRequirements(
  items: ClothingItem[],
  requirements: LookbookRequirements
): RequirementViolation[] {
  const violations: RequirementViolation[] = []

  if (requirements.min_accessories !== undefined) {
    const count = items.filter((i) => i.category === "accessory").length
    if (count < requirements.min_accessories) {
      violations.push({
        rule: "min_accessories",
        message: `Need at least ${requirements.min_accessories} accessor${requirements.min_accessories === 1 ? "y" : "ies"} (have ${count})`,
      })
    }
  }

  if (requirements.min_colors !== undefined) {
    const uniqueColors = new Set(items.flatMap((i) => i.colors)).size
    if (uniqueColors < requirements.min_colors) {
      violations.push({
        rule: "min_colors",
        message: `Need at least ${requirements.min_colors} colors (have ${uniqueColors})`,
      })
    }
  }

  if (requirements.required_categories?.length) {
    const presentCategories = new Set(items.map((i) => i.category))
    for (const cat of requirements.required_categories) {
      if (!presentCategories.has(cat)) {
        violations.push({
          rule: "required_categories",
          message: `Missing required category: ${cat}`,
        })
      }
    }
  }

  return violations
}
