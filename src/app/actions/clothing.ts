"use server"

import { revalidatePath } from "next/cache"
import { clothingItemSchema } from "@/lib/schemas/clothing"
import {
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
  uploadClothingPhoto,
} from "@/lib/db/clothing"

export async function createClothingItemAction(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    category: formData.get("category"),
    colors: formData.getAll("colors"),
    brand: formData.get("brand") || undefined,
    size: formData.get("size") || undefined,
    date_purchased: formData.get("date_purchased") || undefined,
    notes: formData.get("notes") || undefined,
    is_active: true,
    photo_url: formData.get("photo_url") || undefined,
  }

  const parsed = clothingItemSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const item = await createClothingItem({
    ...parsed.data,
    is_active: parsed.data.is_active ?? true,
    brand: parsed.data.brand || null,
    size: parsed.data.size || null,
    date_purchased: parsed.data.date_purchased || null,
    notes: parsed.data.notes || null,
    photo_url: parsed.data.photo_url ?? null,
  })

  // Handle photo upload if file provided
  const photoFile = formData.get("photo") as File | null
  if (photoFile && photoFile.size > 0) {
    const photoUrl = await uploadClothingPhoto(item.id, photoFile)
    await updateClothingItem(item.id, { photo_url: photoUrl })
  }

  revalidatePath("/closet")
  return { success: true, id: item.id }
}

export async function updateClothingItemAction(id: string, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    category: formData.get("category"),
    colors: formData.getAll("colors"),
    brand: formData.get("brand") || undefined,
    size: formData.get("size") || undefined,
    date_purchased: formData.get("date_purchased") || undefined,
    notes: formData.get("notes") || undefined,
    is_active: true,
    photo_url: formData.get("photo_url") || undefined,
  }

  const parsed = clothingItemSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Handle photo upload if new file provided
  const photoFile = formData.get("photo") as File | null
  let photo_url = parsed.data.photo_url ?? null
  if (photoFile && photoFile.size > 0) {
    photo_url = await uploadClothingPhoto(id, photoFile)
  }

  await updateClothingItem(id, {
    ...parsed.data,
    is_active: parsed.data.is_active ?? true,
    brand: parsed.data.brand || null,
    size: parsed.data.size || null,
    date_purchased: parsed.data.date_purchased || null,
    notes: parsed.data.notes || null,
    photo_url,
  })

  revalidatePath("/closet")
  revalidatePath(`/closet/${id}`)
  return { success: true }
}

export async function deleteClothingItemAction(id: string) {
  await deleteClothingItem(id)
  revalidatePath("/closet")
  return { success: true }
}
