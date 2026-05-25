"use server"

import { createClient } from "@/lib/supabase/server"
import type { Lookbook, CreateLookbook, UpdateLookbook } from "@/types"

export async function getLookbooks(): Promise<Lookbook[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("lookbooks")
    .select(`*, items:lookbook_items(layer_order, clothing_item:clothing_items(*))`)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(normalizeEntry)
}

export async function getLookbook(id: string): Promise<Lookbook | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("lookbooks")
    .select(`*, items:lookbook_items(layer_order, clothing_item:clothing_items(*))`)
    .eq("id", id)
    .single()

  if (error) return null
  return normalizeEntry(data)
}

export async function createLookbook(
  lookbook: CreateLookbook,
  itemIds: string[]
): Promise<Lookbook> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("lookbooks")
    .insert({ ...lookbook, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (itemIds.length > 0) {
    const { error: itemsError } = await supabase.from("lookbook_items").insert(
      itemIds.map((clothing_item_id, i) => ({
        lookbook_id: data.id,
        clothing_item_id,
        layer_order: i,
      }))
    )
    if (itemsError) throw new Error(itemsError.message)
  }

  return data
}

export async function updateLookbook(
  id: string,
  updates: UpdateLookbook,
  itemIds?: string[]
): Promise<Lookbook> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("lookbooks")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (itemIds !== undefined) {
    await supabase.from("lookbook_items").delete().eq("lookbook_id", id)
    if (itemIds.length > 0) {
      await supabase.from("lookbook_items").insert(
        itemIds.map((clothing_item_id, i) => ({
          lookbook_id: id,
          clothing_item_id,
          layer_order: i,
        }))
      )
    }
  }

  return data
}

export async function deleteLookbook(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("lookbooks").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function saveLookbookComposite(id: string, file: Buffer, userId: string): Promise<string> {
  const supabase = await createClient()
  const path = `${userId}/${id}.png`

  const { error } = await supabase.storage
    .from("lookbook-composites")
    .upload(path, file, { contentType: "image/png", upsert: true })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from("lookbook-composites").getPublicUrl(path)
  return data.publicUrl
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeEntry(raw: any): Lookbook {
  const { items, ...rest } = raw
  return {
    ...rest,
    items: (items ?? [])
      .sort((a: any, b: any) => a.layer_order - b.layer_order)
      .map((i: any) => i.clothing_item),
  }
}
