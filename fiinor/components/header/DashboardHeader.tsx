"use client"

import { motion } from "framer-motion"
import { Search, Bell, ChevronDown, Globe } from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/useThemeTokens"

const headerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 28, delay: 0.2 },
  },
}

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
}

export function DashboardHeader({
  title = "TABLEAU DE BORD",
  subtitle = "Conseil d'Administration",
}: DashboardHeaderProps) {
  const t = useT()
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 px-4 backdrop-blur-md md:px-6"
      style={{
        background: `${t.surfaceGlass}`,
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      {/* Left: trigger + title */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="size-8 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-5 opacity-40" />
        <div className="hidden flex-col sm:flex">
          <span className="font-heading text-xs font-bold tracking-[0.12em] uppercase leading-none" style={{ color: t.teal }}>
            {title}
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Center: org badge (desktop) */}
      <div className="hidden flex-1 items-center justify-center md:flex">
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{ border: `1px solid ${t.tealMuted}`, background: t.tealFaint }}>
          <Globe className="size-3" style={{ color: t.teal }} />
          <span className="text-xs font-medium" style={{ color: t.teal }}>
            Aether Educational Group
          </span>
        </div>
      </div>

      {/* Right: search + notifications + user */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div
          className={cn(
            "hidden items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 transition-all duration-200 sm:flex",
            searchFocused
              ? "bg-background w-52"
              : "border-border/50 w-36"
          )}
          style={searchFocused ? { borderColor: t.teal, boxShadow: `0 0 0 2px ${t.tealMuted}` } : undefined}
        >
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex size-8 items-center justify-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5 items-center justify-center rounded-full" style={{ background: t.gold }}>
            <span className="size-1.5 rounded-full" style={{ background: t.surface0 }} />
          </span>
        </motion.button>

        <Separator orientation="vertical" className="h-5 opacity-40" />

        {/* User */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/50"
        >
          <Avatar className="size-7">
            <AvatarFallback className="text-[10px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${t.teal}, ${t.lime})` }}>
              DG
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col lg:flex">
            <span className="text-xs font-medium leading-none text-foreground">
              Directeur Général
            </span>
            <Badge
              variant="secondary"
              className="mt-0.5 h-3.5 rounded px-1 text-[9px] leading-none"
            >
              Super Admin
            </Badge>
          </div>
          <ChevronDown className="hidden size-3 text-muted-foreground lg:block" />
        </motion.div>
      </div>
    </motion.header>
  )
}
