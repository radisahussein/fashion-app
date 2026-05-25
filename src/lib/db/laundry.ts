"use server"

import { createClient } from "@/lib/supabase/server"
import type { ClothingItem, LaundrySession, LaundryItem, LaundryStatus } from "@/types"

function normalizeSession(row: Record<string, unknown>): LaundrySession {
  const rawItems = (row.laundry_items as Record<string, unknown>[] | null) ?? []
  const items: LaundryItem[] = rawItems.map((li) => ({
    id: li.id as string,
    session_id: li.session_id as string,
    clothing_item_id: li.clothing_item_id as string,
    returned: li.returned as boolean,
    condition_note: (li.condition_note as string | null) ?? null,
    clothing_item: (li.clothing_item as ClothingItem | null) ?? undefined,
  }))

  return {
    id: row.id as string,
    user_id: row.user_id as string,
    location_name: row.location_name as string,
    start_date: row.start_date as string,
    end_date: (row.end_date as string | null) ?? null,
    price: (row.price as number | null) ?? null,
    weight_kg: (row.weight_kg as number | null) ?? null,
    status: row.status as LaundryStatus,
    notes: (row.notes as string | null) ?? null,
    created_at: row.created_at as string,
    items,
  }
}

export async function getLaundrySessions(): Promise<LaundrySession[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("laundry_sessions")
    .select(`*, laundry_items(*, clothing_item:clothing_items(*))`)
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeSession)
}

export async function getLaundrySession(id: string): Promise<LaundrySession | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("laundry_sessions")
    .select(`*, laundry_items(*, clothing_item:clothing_items(*))`)
    .eq("id", id)
    .single()
  if (error) return null
  return normalizeSession(data)
}

export async function getActiveSessionItemIds(): Promise<Set<string>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("laundry_items")
    .select("clothing_item_id, laundry_sessions!inner(status)")
    .eq("laundry_sessions.status", "ongoing")
  const ids = new Set<string>()
  for (const row of data ?? []) {
    ids.add(row.clothing_item_id)
  }
  return ids
}

export async function createLaundrySession(
  input: {
    location_name: string
    start_date: string
    price: number | null
    weight_kg: number | null
    notes: string | null
  },
  itemIds: string[]
): Promise<LaundrySession> {
  const supabase = await createClient()
  const { data: session, error } = await supabase
    .from("laundry_sessions")
    .insert({ ...input, status: "ongoing" })
    .select()
    .single()
  if (error) throw error

  if (itemIds.length > 0) {
    const { error: itemError } = await supabase.from("laundry_items").insert(
      itemIds.map((clothing_item_id) => ({ session_id: session.id, clothing_item_id, returned: false }))
    )
    if (itemError) throw itemError
  }

  return getLaundrySession(session.id) as Promise<LaundrySession>
}

export async function updateReturnedItems(
  sessionId: string,
  returnedIds: string[]
): Promise<LaundrySession> {
  const supabase = await createClient()

  const session = await getLaundrySession(sessionId)
  if (!session) throw new Error("Session not found")

  const allIds = (session.items ?? []).map((i) => i.clothing_item_id)
  const returnedSet = new Set(returnedIds)

  await Promise.all(
    allIds.map((id) =>
      supabase
        .from("laundry_items")
        .update({ returned: returnedSet.has(id) })
        .eq("session_id", sessionId)
        .eq("clothing_item_id", id)
    )
  )

  const allReturned = allIds.every((id) => returnedSet.has(id))
  const noneReturned = allIds.every((id) => !returnedSet.has(id))
  const newStatus: LaundryStatus = allReturned ? "completed" : noneReturned ? "ongoing" : "partial"

  const { error } = await supabase
    .from("laundry_sessions")
    .update({ status: newStatus, end_date: allReturned ? new Date().toISOString().split("T")[0] : null })
    .eq("id", sessionId)
  if (error) throw error

  return getLaundrySession(sessionId) as Promise<LaundrySession>
}

export async function deleteLaundrySession(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("laundry_sessions").delete().eq("id", id)
  if (error) throw error
}
