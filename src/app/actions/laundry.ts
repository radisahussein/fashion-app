"use server"

import { revalidatePath } from "next/cache"
import { createLaundrySession, updateReturnedItems, deleteLaundrySession } from "@/lib/db/laundry"

export async function createLaundrySessionAction(formData: FormData) {
  try {
    const location_name = formData.get("location_name") as string
    const start_date = formData.get("start_date") as string
    const priceRaw = formData.get("price") as string
    const weightRaw = formData.get("weight_kg") as string
    const notes = (formData.get("notes") as string) || null
    const itemIds = formData.getAll("item_ids") as string[]

    if (!location_name?.trim()) return { error: "Location name is required" }
    if (!start_date) return { error: "Start date is required" }

    const price = priceRaw ? parseFloat(priceRaw) : null
    const weight_kg = weightRaw ? parseFloat(weightRaw) : null

    const session = await createLaundrySession(
      { location_name: location_name.trim(), start_date, price, weight_kg, notes },
      itemIds
    )
    revalidatePath("/laundry")
    revalidatePath("/closet")
    return { id: session.id }
  } catch {
    return { error: "Failed to create laundry session" }
  }
}

export async function updateReturnedItemsAction(sessionId: string, returnedIds: string[]) {
  try {
    await updateReturnedItems(sessionId, returnedIds)
    revalidatePath(`/laundry/${sessionId}`)
    revalidatePath("/laundry")
    revalidatePath("/closet")
    return { ok: true }
  } catch {
    return { error: "Failed to update returned items" }
  }
}

export async function deleteLaundrySessionAction(id: string) {
  try {
    await deleteLaundrySession(id)
    revalidatePath("/laundry")
    revalidatePath("/closet")
    return { ok: true }
  } catch {
    return { error: "Failed to delete session" }
  }
}
