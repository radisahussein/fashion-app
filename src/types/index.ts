export type Category = "top" | "bottom" | "shoes" | "accessory" | "outerwear" | "dress"

export interface ClothingItem {
  id: string
  user_id: string
  name: string
  category: Category
  colors: string[]
  brand: string | null
  size: string | null
  date_purchased: string | null
  photo_url: string | null
  notes: string | null
  is_active: boolean
  created_at: string
}

export type CreateClothingItem = Omit<ClothingItem, "id" | "user_id" | "created_at">
export type UpdateClothingItem = Partial<CreateClothingItem>
