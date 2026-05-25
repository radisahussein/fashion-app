"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ItemSelector } from "@/components/outfit-log/item-selector"
import { RequirementViolations } from "./requirement-violations"
import { validateLookbookRequirements } from "@/lib/lookbook/requirements"
import { lookbookSchema, type LookbookFormValues } from "@/lib/schemas/lookbook"
import { createLookbookAction, updateLookbookAction } from "@/app/actions/lookbooks"
import { CATEGORIES } from "@/lib/schemas/clothing"
import type { ClothingItem, Lookbook } from "@/types"

interface Props {
  closetItems: ClothingItem[]
  lookbook?: Lookbook
}

export function LookbookForm({ closetItems, lookbook }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedItems, setSelectedItems] = useState<string[]>(
    lookbook?.items?.map((i) => i.id) ?? []
  )
  const [serverError, setServerError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { register, control, watch, handleSubmit, formState: { errors } } = useForm<LookbookFormValues>({
    resolver: zodResolver(lookbookSchema) as Resolver<LookbookFormValues>,
    defaultValues: {
      name: lookbook?.name ?? "",
      description: lookbook?.description ?? "",
      min_accessories: lookbook?.requirements.min_accessories,
      min_colors: lookbook?.requirements.min_colors,
      required_categories: lookbook?.requirements.required_categories ?? [],
    },
  })

  const watchedReqs = watch(["min_accessories", "min_colors", "required_categories"])
  const selectedClothingItems = closetItems.filter((i) => selectedItems.includes(i.id))
  const violations = validateLookbookRequirements(selectedClothingItems, {
    min_accessories: watchedReqs[0],
    min_colors: watchedReqs[1],
    required_categories: watchedReqs[2],
  })

  function onSubmit() {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    selectedItems.forEach((id) => formData.append("item_ids", id))

    startTransition(async () => {
      const result = lookbook
        ? await updateLookbookAction(lookbook.id, formData)
        : await createLookbookAction(formData)

      if ("error" in result) {
        setServerError("Please fix the errors above")
        return
      }

      router.push("/lookbook")
      router.refresh()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-6">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
        <Input id="name" {...register("name")} name="name" placeholder="Summer fits" className="rounded-xl" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <textarea
          id="description"
          {...register("description")}
          name="description"
          rows={2}
          placeholder="What's this lookbook about?"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Items</Label>
        <ItemSelector items={closetItems} selected={selectedItems} onChange={setSelectedItems} />
      </div>

      {/* Requirements */}
      <div className="space-y-3 rounded-2xl border border-border p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Requirements</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="min_accessories" className="text-xs text-muted-foreground">Min accessories</Label>
            <Input
              id="min_accessories"
              {...register("min_accessories")}
              name="min_accessories"
              type="number"
              min={0}
              max={10}
              placeholder="0"
              className="rounded-xl h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="min_colors" className="text-xs text-muted-foreground">Min colors</Label>
            <Input
              id="min_colors"
              {...register("min_colors")}
              name="min_colors"
              type="number"
              min={0}
              max={20}
              placeholder="0"
              className="rounded-xl h-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Required categories</Label>
          <Controller
            name="required_categories"
            control={control}
            render={({ field }) => (
              <>
                {(field.value ?? []).map((c) => (
                  <input key={c} type="hidden" name="required_categories" value={c} />
                ))}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const active = (field.value ?? []).includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            active
                              ? (field.value ?? []).filter((c) => c !== cat)
                              : [...(field.value ?? []), cat]
                          )
                        }
                        className={`text-xs px-3 py-1 rounded-full border transition-colors capitalize ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border text-muted-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          />
        </div>
      </div>

      {/* Live requirement violations */}
      {selectedItems.length > 0 && <RequirementViolations violations={violations} />}

      {serverError && <p className="text-xs text-destructive">{serverError}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
          {isPending ? "Saving…" : lookbook ? "Save changes" : "Create lookbook"}
        </Button>
      </div>
    </form>
  )
}
