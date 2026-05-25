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
import { ItemSelector } from "./item-selector"
import { RatingStars } from "./rating-stars"
import { outfitLogSchema, OCCASIONS, type OutfitLogFormValues } from "@/lib/schemas/outfit-log"
import { createOutfitLogAction, updateOutfitLogAction } from "@/app/actions/outfit-logs"
import type { ClothingItem, OutfitLog } from "@/types"

interface Props {
  closetItems: ClothingItem[]
  log?: OutfitLog
  defaultDate?: string
}

export function OutfitLogForm({ closetItems, log, defaultDate }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [photoPreview, setPhotoPreview] = useState<string | null>(log?.photo_url ?? null)
  const [selectedItems, setSelectedItems] = useState<string[]>(
    log?.items?.map((i) => i.id) ?? []
  )
  const [serverError, setServerError] = useState<string | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { register, control, handleSubmit, formState: { errors } } = useForm<OutfitLogFormValues>({
    resolver: zodResolver(outfitLogSchema),
    defaultValues: {
      worn_date: log?.worn_date ?? defaultDate ?? new Date().toISOString().split("T")[0],
      occasion: log?.occasion as typeof OCCASIONS[number] | undefined,
      rating: log?.rating ?? undefined,
      notes: log?.notes ?? "",
    },
  })

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setServerError("Photo must be under 10MB")
      return
    }
    setPhotoPreview(URL.createObjectURL(file))
    setServerError(null)
  }

  function onSubmit() {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    selectedItems.forEach((id) => formData.append("item_ids", id))

    startTransition(async () => {
      const result = log
        ? await updateOutfitLogAction(log.id, formData)
        : await createOutfitLogAction(formData)

      if ("error" in result) {
        setServerError("Please fix the errors above")
        return
      }

      router.push("/outfit-log")
      router.refresh()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-6">
      {/* Date */}
      <div className="space-y-1.5">
        <Label htmlFor="worn_date" className="text-sm font-medium">Date *</Label>
        <Input id="worn_date" {...register("worn_date")} name="worn_date" type="date" className="rounded-xl" />
        {errors.worn_date && <p className="text-xs text-destructive">{errors.worn_date.message}</p>}
      </div>

      {/* Photo */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Photo</Label>
        <div
          className="aspect-[4/3] max-w-[240px] rounded-2xl border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer relative overflow-hidden"
          onClick={() => photoRef.current?.click()}
        >
          {photoPreview ? (
            <>
              <Image src={photoPreview} alt="Outfit preview" fill className="object-cover" />
              <button
                type="button"
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); setPhotoPreview(null); if (photoRef.current) photoRef.current.value = "" }}
              >
                <X size={12} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera size={24} strokeWidth={1.5} />
              <span className="text-xs">Add outfit photo</span>
            </div>
          )}
        </div>
        <input ref={photoRef} name="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      {/* Items from closet */}
      {closetItems.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Items worn</Label>
          <ItemSelector items={closetItems} selected={selectedItems} onChange={setSelectedItems} />
        </div>
      )}

      {/* Occasion */}
      <div className="space-y-1.5">
        <Label htmlFor="occasion" className="text-sm font-medium">Occasion</Label>
        <select
          id="occasion"
          {...register("occasion")}
          name="occasion"
          className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize"
        >
          <option value="">None</option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o} className="capitalize">{o}</option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Rating</Label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <>
              <input type="hidden" name="rating" value={field.value ?? ""} />
              <RatingStars value={field.value ?? null} onChange={(r) => field.onChange(r)} />
            </>
          )}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
        <textarea
          id="notes"
          {...register("notes")}
          name="notes"
          placeholder="How did this outfit feel?"
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {serverError && <p className="text-xs text-destructive">{serverError}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
          {isPending ? "Saving…" : log ? "Save changes" : "Log outfit"}
        </Button>
      </div>
    </form>
  )
}
