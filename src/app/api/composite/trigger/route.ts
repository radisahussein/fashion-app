import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getLookbook } from "@/lib/db/lookbooks"
import { buildComposite } from "@/lib/image/composite"
import { saveLookbookComposite } from "@/lib/db/lookbooks"

export const runtime = "nodejs"
export const maxDuration = 30

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = request.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const lookbook = await getLookbook(id)
  if (!lookbook) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const photoUrls = (lookbook.items ?? [])
    .map((i) => i.photo_url)
    .filter(Boolean) as string[]

  if (photoUrls.length === 0) {
    return NextResponse.json({ error: "No photos on items" }, { status: 400 })
  }

  const buf = await buildComposite(photoUrls)
  const url = await saveLookbookComposite(id, buf, user.id)
  await supabase.from("lookbooks").update({ composite_image_url: url }).eq("id", id)

  return NextResponse.json({ url })
}
