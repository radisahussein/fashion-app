import { z } from "zod"

export const OCCASIONS = [
  "casual", "campus", "work", "formal", "festival",
  "gym", "date", "travel", "home", "other",
] as const

export const outfitLogSchema = z.object({
  worn_date: z.string().min(1, "Date is required"),
  occasion: z.enum(OCCASIONS).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
  photo_url: z.string().nullable().optional(),
})

export type OutfitLogFormValues = z.infer<typeof outfitLogSchema>
