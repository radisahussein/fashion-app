"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  lookbookId: string
  compositeUrl: string | null
  hasPhotos: boolean
}

export function CompositePreview({ lookbookId, compositeUrl: initialUrl, hasPhotos }: Props) {
  const [url, setUrl] = useState(initialUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function regenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/composite/trigger?id=${lookbookId}`)
      const data = await res.json()
      if (data.url) setUrl(data.url)
      else setError("Could not generate composite")
    } catch {
      setError("Failed to generate composite")
    } finally {
      setLoading(false)
    }
  }

  if (!hasPhotos) {
    return (
      <div className="aspect-[4/5] rounded-2xl bg-muted flex items-center justify-center">
        <p className="text-xs text-muted-foreground text-center px-4">Add items with photos to see a preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="aspect-[4/5] rounded-2xl bg-muted overflow-hidden relative">
        {url ? (
          <Image src={url} alt="Lookbook composite" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-muted-foreground">No preview yet</p>
            <Button size="sm" variant="outline" onClick={regenerate} disabled={loading} className="rounded-xl text-xs">
              {loading ? <Loader2 size={12} className="animate-spin mr-1" /> : null}
              Generate preview
            </Button>
          </div>
        )}
      </div>
      {url && (
        <Button size="sm" variant="ghost" onClick={regenerate} disabled={loading} className="w-full rounded-xl text-xs text-muted-foreground">
          {loading ? <Loader2 size={12} className="animate-spin mr-1" /> : <RefreshCw size={12} className="mr-1" />}
          Regenerate
        </Button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
