import { describe, it, expect } from "vitest"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs))
}

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2")
  })

  it("resolves tailwind conflicts (last wins)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })
})
