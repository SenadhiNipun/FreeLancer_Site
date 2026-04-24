"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    if (isOpen) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen])

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef<HTMLDivElement, { asChild?: boolean; children: React.ReactNode }>(
  ({ children, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)
    return (
      <div 
        ref={ref} 
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="cursor-pointer"
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = ({ children, align = "end", className }: { children: React.ReactNode, align?: "start" | "end", className?: string }) => {
  const { isOpen } = React.useContext(DropdownMenuContext)
  
  if (!isOpen) return null

  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-card p-1 text-popover-foreground shadow-md animate-in fade-in zoom-in-95 mt-2",
      align === "end" ? "right-0" : "left-0",
      className
    )}>
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const { setIsOpen } = React.useContext(DropdownMenuContext)
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
        setIsOpen(false)
      }}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      {children}
    </div>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
}
