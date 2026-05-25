import { z } from "zod"
import { CATEGORIES } from "./clothing"

export const lookbookSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(300).optional().or(z.literal("")),
  min_accessories: z.coerce.number().int().min(0).max(10).optional(),
  min_colors: z.coerce.number().int().min(0).max(20).optional(),
  required_categories: z.array(z.enum(CATEGORIES)).optional(),
})

export type LookbookFormValues = z.infer<typeof lookbookSchema>
