import { z } from "zod"

export const CATEGORIES = ["top", "bottom", "shoes", "accessory", "outerwear", "dress"] as const

export const clothingItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.enum(CATEGORIES, { error: "Select a category" }),
  colors: z.array(z.string()).min(1, "Add at least one color"),
  brand: z.string().max(100).optional().or(z.literal("")),
  size: z.string().max(20).optional().or(z.literal("")),
  date_purchased: z.string().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  is_active: z.boolean().optional(),
  photo_url: z.string().nullable().optional(),
})

export type ClothingItemFormValues = z.infer<typeof clothingItemSchema>
