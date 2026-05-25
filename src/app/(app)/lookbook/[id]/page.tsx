import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Pencil } from "lucide-react"
import { getLookbook } from "@/lib/db/lookbooks"
import { Badge } from "@/components/ui/badge"
import { CompositePreview } from "@/components/lookbook/composite-preview"
import { RequirementViolations } from "@/components/lookbook/requirement-violations"
import { validateLookbookRequirements } from "@/lib/lookbook/requirements"
import { DeleteLookbookButton } from "@/components/lookbook/delete-lookbook-button"

interface Props {
  params: Promise<{ id: string }>
}

export default async function LookbookDetailPage({ params }: Props) {
  const { id } = await params
  const lookbook = await getLookbook(id)
  if (!lookbook) notFound()

  const items = lookbook.items ?? []
  const violations = validateLookbookRequirements(items, lookbook.requirements)
  const hasPhotos = items.some((i) => i.photo_url)

  return (
    <main className="px-4 pt-6 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/lookbook" className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <div className="flex items-center gap-3">
          <Link href={`/lookbook/${id}/edit`} className="text-primary">
            <Pencil size={18} strokeWidth={1.5} />
          </Link>
          <DeleteLookbookButton id={id} />
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold">{lookbook.name}</h1>
        {lookbook.description && <p className="text-sm text-muted-foreground mt-0.5">{lookbook.description}</p>}
      </div>

      <CompositePreview lookbookId={id} compositeUrl={lookbook.composite_image_url} hasPhotos={hasPhotos} />

      <RequirementViolations violations={violations} />

      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Items</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Link key={item.id} href={`/closet/${item.id}`}>
                <Badge variant="secondary" className="rounded-full text-xs capitalize">{item.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {Object.keys(lookbook.requirements).length > 0 && (
        <div className="rounded-2xl border border-border divide-y divide-border">
          {lookbook.requirements.min_accessories !== undefined && (
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Min accessories</span>
              <span className="font-medium">{lookbook.requirements.min_accessories}</span>
            </div>
          )}
          {lookbook.requirements.min_colors !== undefined && (
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Min colors</span>
              <span className="font-medium">{lookbook.requirements.min_colors}</span>
            </div>
          )}
          {lookbook.requirements.required_categories?.length ? (
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Required</span>
              <span className="font-medium capitalize">{lookbook.requirements.required_categories.join(", ")}</span>
            </div>
          ) : null}
        </div>
      )}
    </main>
  )
}
