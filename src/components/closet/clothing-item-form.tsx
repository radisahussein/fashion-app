"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Camera, X } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "./color-picker"
import { clothingItemSchema, CATEGORIES, type ClothingItemFormValues } from "@/lib/schemas/clothing"
import { createClothingItemAction, updateClothingItemAction } from "@/app/actions/clothing"
import type { ClothingItem } from "@/types"

interface Props {
  item?: ClothingItem
}

export function ClothingItemForm({ item }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [photoPreview, setPhotoPreview] = useState<string | null>(item?.photo_url ?? null)
  const [serverError, setServerError] = useState<string | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClothingItemFormValues>({
    resolver: zodResolver(clothingItemSchema),
    defaultValues: {
      name: item?.name ?? "",
      category: item?.category ?? "top",
      colors: item?.colors ?? [],
      brand: item?.brand ?? "",
      size: item?.size ?? "",
      date_purchased: item?.date_purchased ?? "",
      notes: item?.notes ?? "",
      is_active: item?.is_active ?? true,
      photo_url: item?.photo_url ?? null,
    },
  })

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setServerError("Photo must be under 5MB")
      return
    }
    setPhotoPreview(URL.createObjectURL(file))
    setServerError(null)
  }

  function onSubmit() {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)

    startTransition(async () => {
      const result = item
        ? await updateClothingItemAction(item.id, formData)
        : await createClothingItemAction(formData)

      if ("error" in result) {
        setServerError("Please fix the errors above")
        return
      }

      router.push("/closet")
      router.refresh()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-6">
      {/* Photo upload */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Photo</Label>
        <div
          className="aspect-[3/4] max-w-[180px] rounded-2xl border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer relative overflow-hidden"
          onClick={() => photoRef.current?.click()}
        >
          {photoPreview ? (
            <>
              <Image src={photoPreview} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation()
                  setPhotoPreview(null)
                  if (photoRef.current) photoRef.current.value = ""
                }}
              >
                <X size={12} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera size={24} strokeWidth={1.5} />
              <span className="text-xs">Add photo</span>
            </div>
          )}
        </div>
        <input
          ref={photoRef}
          name="photo"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
        <Input
          id="name"
          {...register("name")}
          name="name"
          placeholder="White linen shirt"
          className="rounded-xl"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
        <select
          id="category"
          {...register("category")}
          name="category"
          className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="capitalize">
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      {/* Colors */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Colors *</Label>
        <Controller
          name="colors"
          control={control}
          render={({ field }) => (
            <>
              {/* hidden inputs so formData picks up colors */}
              {field.value.map((c) => (
                <input key={c} type="hidden" name="colors" value={c} />
              ))}
              <ColorPicker value={field.value} onChange={field.onChange} />
            </>
          )}
        />
        {errors.colors && <p className="text-xs text-destructive">{errors.colors.message}</p>}
      </div>

      {/* Brand */}
      <div className="space-y-1.5">
        <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
        <Input id="brand" {...register("brand")} name="brand" placeholder="Uniqlo" className="rounded-xl" />
      </div>

      {/* Size */}
      <div className="space-y-1.5">
        <Label htmlFor="size" className="text-sm font-medium">Size</Label>
        <Input id="size" {...register("size")} name="size" placeholder="M / 32 / EU 42" className="rounded-xl" />
      </div>

      {/* Date purchased */}
      <div className="space-y-1.5">
        <Label htmlFor="date_purchased" className="text-sm font-medium">Date purchased</Label>
        <Input id="date_purchased" {...register("date_purchased")} name="date_purchased" type="date" className="rounded-xl" />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
        <textarea
          id="notes"
          {...register("notes")}
          name="notes"
          placeholder="Any notes about this item…"
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {serverError && <p className="text-xs text-destructive">{serverError}</p>}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPending ? "Saving…" : item ? "Save changes" : "Add item"}
        </Button>
      </div>
    </form>
  )
}
