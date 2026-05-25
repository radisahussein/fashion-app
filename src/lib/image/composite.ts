import sharp from "sharp"

const TILE_SIZE = 400
const GAP = 8
const BG_COLOR = { r: 250, g: 247, b: 244, alpha: 1 } // warm ivory

interface CompositeInput {
  photoUrl: string
  index: number
  cols: number
  rows: number
}

async function fetchImage(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

async function resizeTile(buf: Buffer): Promise<Buffer> {
  return sharp(buf)
    .resize(TILE_SIZE, Math.round(TILE_SIZE * 1.2), { fit: "cover", position: "top" })
    .png()
    .toBuffer()
}

export async function buildComposite(photoUrls: string[]): Promise<Buffer> {
  if (photoUrls.length === 0) throw new Error("No photos to composite")

  const count = Math.min(photoUrls.length, 6)
  const urls = photoUrls.slice(0, count)

  const cols = count <= 2 ? count : count <= 4 ? 2 : 3
  const rows = Math.ceil(count / cols)
  const tileH = Math.round(TILE_SIZE * 1.2)

  const canvasW = cols * TILE_SIZE + (cols + 1) * GAP
  const canvasH = rows * tileH + (rows + 1) * GAP

  // Fetch + resize all tiles in parallel
  const tiles = await Promise.all(
    urls.map(async (url, i): Promise<CompositeInput> => ({ photoUrl: url, index: i, cols, rows }))
  )

  const compositeOps = await Promise.all(
    tiles.map(async ({ photoUrl, index }) => {
      const raw = await fetchImage(photoUrl)
      const tile = await resizeTile(raw)
      const col = index % cols
      const row = Math.floor(index / cols)
      return {
        input: tile,
        left: GAP + col * (TILE_SIZE + GAP),
        top: GAP + row * (tileH + GAP),
      }
    })
  )

  return sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite(compositeOps)
    .png({ compressionLevel: 8 })
    .toBuffer()
}
