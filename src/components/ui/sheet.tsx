"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetContextValue {
  open: boolean
  setOpen: (v: boolean) => void
}
const SheetContext = React.createContext<SheetContextValue>({ open: false, setOpen: () => {} })

function Sheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>
}

function SheetTrigger({ children, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = React.useContext(SheetContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, { onClick: () => setOpen(true) })
  }
  return <button type="button" onClick={() => setOpen(true)} {...props}>{children}</button>
}

function SheetClose({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = React.useContext(SheetContext)
  return <button type="button" onClick={() => setOpen(false)} {...props}>{children}</button>
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SheetOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(SheetContext)
  return (
    <div
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-black/30 backdrop-blur-sm", className)}
      onClick={() => setOpen(false)}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "bottom",
  showCloseButton = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  const { open } = React.useContext(SheetContext)
  if (!open) return null

  const sideClasses: Record<string, string> = {
    bottom: "inset-x-0 bottom-0 rounded-t-2xl",
    top: "inset-x-0 top-0 rounded-b-2xl",
    left: "inset-y-0 left-0 h-full w-3/4",
    right: "inset-y-0 right-0 h-full w-3/4",
  }

  return (
    <>
      <SheetOverlay />
      <div
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover p-4 text-sm text-popover-foreground shadow-lg",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {showCloseButton && (
          <SheetClose className="absolute top-3 right-3 p-1 rounded-lg hover:bg-muted">
            <X size={16} strokeWidth={1.5} />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
        {children}
      </div>
    </>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-0.5", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="sheet-title" className={cn("text-base font-semibold", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
