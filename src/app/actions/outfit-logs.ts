"use server"

import { revalidatePath } from "next/cache"
import { outfitLogSchema } from "@/lib/schemas/outfit-log"
import {
  createOutfitLog,
  updateOutfitLog,
  deleteOutfitLog,
  uploadOutfitPhoto,
} from "@/lib/db/outfit-logs"

export async function createOutfitLogAction(formData: FormData) {
  const itemIds = formData.getAll("item_ids") as string[]

  const raw = {
    worn_date: formData.get("worn_date"),
    occasion: formData.get("occasion") || undefined,
    rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
    notes: formData.get("notes") || undefined,
  }

  const parsed = outfitLogSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const log = await createOutfitLog(
    {
      worn_date: parsed.data.worn_date,
      occasion: parsed.data.occasion ?? null,
      rating: parsed.data.rating ?? null,
      notes: parsed.data.notes || null,
      photo_url: null,
    },
    itemIds
  )

  const photoFile = formData.get("photo") as File | null
  if (photoFile && photoFile.size > 0) {
    const photoUrl = await uploadOutfitPhoto(log.id, photoFile)
    await updateOutfitLog(log.id, { photo_url: photoUrl })
  }

  revalidatePath("/outfit-log")
  revalidatePath("/")
  return { success: true, id: log.id }
}

export async function updateOutfitLogAction(id: string, formData: FormData) {
  const itemIds = formData.getAll("item_ids") as string[]

  const raw = {
    worn_date: formData.get("worn_date"),
    occasion: formData.get("occasion") || undefined,
    rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
    notes: formData.get("notes") || undefined,
  }

  const parsed = outfitLogSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const photoFile = formData.get("photo") as File | null
  let photo_url: string | null | undefined = undefined
  if (photoFile && photoFile.size > 0) {
    photo_url = await uploadOutfitPhoto(id, photoFile)
  }

  await updateOutfitLog(
    id,
    {
      worn_date: parsed.data.worn_date,
      occasion: parsed.data.occasion ?? null,
      rating: parsed.data.rating ?? null,
      notes: parsed.data.notes || null,
      ...(photo_url !== undefined && { photo_url }),
    },
    itemIds
  )

  revalidatePath("/outfit-log")
  revalidatePath("/")
  return { success: true }
}

export async function deleteOutfitLogAction(id: string) {
  await deleteOutfitLog(id)
  revalidatePath("/outfit-log")
  revalidatePath("/")
  return { success: true }
}
