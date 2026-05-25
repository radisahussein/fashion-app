import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { buildComposite } from "@/lib/image/composite"
import { saveLookbookComposite } from "@/lib/db/lookbooks"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(request: NextRequest) {
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

  const body = await request.json()
  const { lookbookId, photoUrls } = body as { lookbookId: string; photoUrls: string[] }

  if (!lookbookId || !Array.isArray(photoUrls) || photoUrls.length === 0) {
    return NextResponse.json({ error: "lookbookId and photoUrls required" }, { status: 400 })
  }

  const compositeBuffer = await buildComposite(photoUrls)
  const url = await saveLookbookComposite(lookbookId, compositeBuffer, user.id)

  // Update lookbook record with composite URL
  await supabase.from("lookbooks").update({ composite_image_url: url }).eq("id", lookbookId)

  return NextResponse.json({ url })
}
