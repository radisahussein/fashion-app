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

export interface OutfitLog {
  id: string
  user_id: string
  worn_date: string
  photo_url: string | null
  occasion: string | null
  rating: number | null
  notes: string | null
  created_at: string
  items?: ClothingItem[]
}

export type CreateOutfitLog = Omit<OutfitLog, "id" | "user_id" | "created_at" | "items">

export interface ItemStat {
  item: ClothingItem
  count: number
}

export interface CategoryStat {
  category: Category
  count: number
}

export interface LookbookRequirements {
  min_accessories?: number
  min_colors?: number
  required_categories?: Category[]
}

export interface Lookbook {
  id: string
  user_id: string
  name: string
  description: string | null
  requirements: LookbookRequirements
  composite_image_url: string | null
  created_at: string
  updated_at: string
  items?: ClothingItem[]
}

export type CreateLookbook = Omit<Lookbook, "id" | "user_id" | "created_at" | "updated_at" | "items">
export type UpdateLookbook = Partial<CreateLookbook>

export interface RequirementViolation {
  rule: string
  message: string
}

export interface OutfitStats {
  totalLogs: number
  mostWornItems: ItemStat[]
  leastWornItems: ItemStat[]
  recentLogs: OutfitLog[]
  categoryBreakdown: CategoryStat[]
}
