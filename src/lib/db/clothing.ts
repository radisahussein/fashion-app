"use server"

import { createClient } from "@/lib/supabase/server"
import type { ClothingItem, CreateClothingItem, UpdateClothingItem } from "@/types"

export async function getClothingItems(): Promise<ClothingItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getClothingItem(id: string): Promise<ClothingItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

export async function createClothingItem(item: CreateClothingItem): Promise<ClothingItem> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("clothing_items")
    .insert({ ...item, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateClothingItem(id: string, updates: UpdateClothingItem): Promise<ClothingItem> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("clothing_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteClothingItem(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("clothing_items")
    .update({ is_active: false })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export async function uploadClothingPhoto(itemId: string, file: File): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const ext = file.name.split(".").pop()
  const path = `${user.id}/${itemId}.${ext}`

  const { error } = await supabase.storage
    .from("clothing-photos")
    .upload(path, file, { upsert: true })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from("clothing-photos").getPublicUrl(path)
  return data.publicUrl
}

export async function getClothingPhotoUrl(photoUrl: string): Promise<string> {
  const supabase = await createClient()
  const path = photoUrl.split("clothing-photos/")[1]
  if (!path) return photoUrl

  const { data } = await supabase.storage
    .from("clothing-photos")
    .createSignedUrl(path, 3600)

  return data?.signedUrl ?? photoUrl
}
