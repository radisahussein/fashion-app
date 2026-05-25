"use server"

import { createClient } from "@/lib/supabase/server"
import type { OutfitLog, CreateOutfitLog } from "@/types"

export async function getOutfitLogs(limit = 30): Promise<OutfitLog[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("outfit_logs")
    .select(`*, items:outfit_log_items(clothing_item:clothing_items(*))`)
    .order("worn_date", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return (data ?? []).map(normalizeLog)
}

export async function getOutfitLog(id: string): Promise<OutfitLog | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("outfit_logs")
    .select(`*, items:outfit_log_items(clothing_item:clothing_items(*))`)
    .eq("id", id)
    .single()

  if (error) return null
  return normalizeLog(data)
}

export async function getOutfitLogByDate(date: string): Promise<OutfitLog | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("outfit_logs")
    .select(`*, items:outfit_log_items(clothing_item:clothing_items(*))`)
    .eq("worn_date", date)
    .maybeSingle()

  if (error) return null
  return data ? normalizeLog(data) : null
}

export async function createOutfitLog(
  log: CreateOutfitLog,
  itemIds: string[]
): Promise<OutfitLog> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("outfit_logs")
    .insert({ ...log, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (itemIds.length > 0) {
    const { error: itemsError } = await supabase.from("outfit_log_items").insert(
      itemIds.map((clothing_item_id) => ({
        outfit_log_id: data.id,
        clothing_item_id,
      }))
    )
    if (itemsError) throw new Error(itemsError.message)
  }

  return data
}

export async function updateOutfitLog(
  id: string,
  log: Partial<CreateOutfitLog>,
  itemIds?: string[]
): Promise<OutfitLog> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("outfit_logs")
    .update(log)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (itemIds !== undefined) {
    await supabase.from("outfit_log_items").delete().eq("outfit_log_id", id)
    if (itemIds.length > 0) {
      await supabase.from("outfit_log_items").insert(
        itemIds.map((clothing_item_id) => ({
          outfit_log_id: id,
          clothing_item_id,
        }))
      )
    }
  }

  return data
}

export async function deleteOutfitLog(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("outfit_logs").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function uploadOutfitPhoto(logId: string, file: File): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const ext = file.name.split(".").pop()
  const path = `${user.id}/${logId}.${ext}`

  const { error } = await supabase.storage
    .from("outfit-photos")
    .upload(path, file, { upsert: true })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from("outfit-photos").getPublicUrl(path)
  return data.publicUrl
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeLog(raw: any): OutfitLog {
  const { items, ...rest } = raw
  return {
    ...rest,
    items: (items ?? []).map((i: { clothing_item: unknown }) => i.clothing_item),
  }
}
