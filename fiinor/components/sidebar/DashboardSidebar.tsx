"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Network,
  BookOpen,
  Wallet,
  Users,
  UserCog,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useTheme } from "@/providers/ThemeProvider"
import { Sun, Moon, User } from "lucide-react"

const navItems = [
  {
    label: "Tableau de Bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Structure du Groupe",
    href: "/dashboard/structure",
    icon: Network,
  },
  {
    label: "Pédagogie & Examens",
    href: "/dashboard/pedagogie",
    icon: BookOpen,
  },
  {
    label: "Finances Académiques",
    href: "/dashboard/finances",
    icon: Wallet,
  },
  {
    label: "Services aux Élèves",
    href: "/dashboard/services",
    icon: Users,
  },
  {
    label: "Ressources Humaines",
    href: "/dashboard/rh",
    icon: UserCog,
  },
  {
    label: "Rapports & Analyses",
    href: "/dashboard/rapports",
    icon: BarChart3,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 28 },
  },
}

const logoVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 24, delay: 0.05 },
  },
}

export function DashboardSidebar() {
  const pathname  = usePathname()
  const { theme, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo */}
      <SidebarHeader className="px-3 py-4">
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 px-1"
        >
          {/* Logo mark — vert forêt avec gradient subtil */}
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #1d8b93 0%, #b8d070 100%)", boxShadow: "0 2px 8px rgba(0,0,0,0.30)" }}>
            <span className="font-heading text-sm font-black text-white tracking-tight">F</span>
          </div>
          {/* Wordmark — hidden when collapsed */}
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-sm font-black leading-tight tracking-[0.15em] text-white">
              FIINOR
            </span>
            <span className="truncate text-[9px] leading-tight font-medium" style={{ color: "rgba(255,255,255,0.40)" }}>
              Infrastructure Pédagogique
            </span>
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent className="px-1 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-0.5"
              >
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href))

                  return (
                    <motion.div key={item.href} variants={itemVariants}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          isActive={isActive}
                          tooltip={item.label}
                          size="lg"
                          className={cn(
                            "gap-3 rounded-xl px-3 transition-all duration-200",
                            isActive
                              ? "font-semibold shadow-sm"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                          )}
                          style={isActive ? { background: "#b8d070", color: "#174548" } : undefined}
                        >
                          <item.icon
                            className="shrink-0 transition-colors size-4"
                            style={{ color: isActive ? "#174548" : undefined, opacity: isActive ? 1 : 0.6 }}
                          />
                          <span className="truncate text-sm">
                            {item.label}
                          </span>
                          {isActive && (
                            <ChevronRight className="ml-auto size-3.5 opacity-60" style={{ color: "#174548" }} />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  )
                })}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarSeparator />
      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard/parametres" />}
              tooltip="Paramètres"
              size="lg"
              className="gap-3 rounded-xl px-3 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Settings className="shrink-0 size-4 opacity-60" />
              <span className="text-sm">Paramètres</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Theme toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggle}
              tooltip={mounted ? (theme === "dark" ? "Mode clair" : "Mode sombre") : "Thème"}
              size="lg"
              className="gap-3 rounded-xl px-3 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer"
            >
              {mounted && (theme === "dark"
                ? <Sun className="shrink-0 size-4" style={{ color: "#b8d070" }} />
                : <Moon className="shrink-0 size-4" style={{ color: "#b8d070" }} />)}
              {!mounted && <Sun className="shrink-0 size-4 opacity-0" />}
              <span className="text-sm group-data-[collapsible=icon]:hidden">
                {mounted ? (theme === "dark" ? "Mode clair" : "Mode sombre") : ""}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* User pill — comme la v1 */}
          <SidebarMenuItem>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl mt-1"
              style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1d8b93, #b8d070)" }}>N</div>
              <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                <span className="text-[11px] font-semibold text-white leading-tight truncate">Owner Admin</span>
                <span className="text-[9px] leading-tight truncate" style={{ color: "#b8d070" }}>Administrateur</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
