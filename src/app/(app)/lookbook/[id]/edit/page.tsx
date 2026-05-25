import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getLookbook } from "@/lib/db/lookbooks"
import { getClothingItems } from "@/lib/db/clothing"
import { LookbookForm } from "@/components/lookbook/lookbook-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditLookbookPage({ params }: Props) {
  const { id } = await params
  const [lookbook, closetItems] = await Promise.all([getLookbook(id), getClothingItems()])
  if (!lookbook) notFound()

  return (
    <main className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/lookbook/${id}`} className="text-muted-foreground">
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Edit lookbook</h1>
      </div>
      <LookbookForm closetItems={closetItems} lookbook={lookbook} />
    </main>
  )
}
