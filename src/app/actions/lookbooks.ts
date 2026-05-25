"use server"

import { revalidatePath } from "next/cache"
import { lookbookSchema } from "@/lib/schemas/lookbook"
import { createLookbook, updateLookbook, deleteLookbook } from "@/lib/db/lookbooks"
import type { LookbookRequirements } from "@/types"

export async function createLookbookAction(formData: FormData) {
  const itemIds = formData.getAll("item_ids") as string[]
  const parsed = lookbookSchema.safeParse(parseFormData(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const requirements = buildRequirements(parsed.data)
  const lookbook = await createLookbook(
    {
      name: parsed.data.name,
      description: parsed.data.description || null,
      requirements,
      composite_image_url: null,
    },
    itemIds
  )

  revalidatePath("/lookbook")
  return { success: true, id: lookbook.id }
}

export async function updateLookbookAction(id: string, formData: FormData) {
  const itemIds = formData.getAll("item_ids") as string[]
  const parsed = lookbookSchema.safeParse(parseFormData(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const requirements = buildRequirements(parsed.data)
  await updateLookbook(
    id,
    {
      name: parsed.data.name,
      description: parsed.data.description || null,
      requirements,
    },
    itemIds
  )

  revalidatePath("/lookbook")
  revalidatePath(`/lookbook/${id}`)
  return { success: true }
}

export async function deleteLookbookAction(id: string) {
  await deleteLookbook(id)
  revalidatePath("/lookbook")
  return { success: true }
}

function parseFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    min_accessories: formData.get("min_accessories") || undefined,
    min_colors: formData.get("min_colors") || undefined,
    required_categories: formData.getAll("required_categories"),
  }
}

function buildRequirements(data: ReturnType<typeof lookbookSchema.parse>): LookbookRequirements {
  const req: LookbookRequirements = {}
  if (data.min_accessories) req.min_accessories = data.min_accessories
  if (data.min_colors) req.min_colors = data.min_colors
  if (data.required_categories?.length) req.required_categories = data.required_categories
  return req
}
