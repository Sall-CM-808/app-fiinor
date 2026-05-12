"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Handshake, Award, Bell, X, MoreHorizontal } from "lucide-react"

type NotifType = "validation" | "partenariat" | "bourse"

interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  initials: string
  avatarColor: string
  read: boolean
}

const initialNotifs: Notification[] = [
  {
    id: "n1",
    type: "validation",
    title: "Rapport annuel validé",
    body: "Le rapport de l'Université de Conakry 2025–2026 a été approuvé par le Conseil d'Administration.",
    time: "Il y a 37 min",
    initials: "UC",
    avatarColor: "#C9A84C",
    read: false,
  },
  {
    id: "n2",
    type: "partenariat",
    title: "Nouveau partenariat signé",
    body: "Accord de coopération académique conclu avec l'Université de Columbia — échanges d'étudiants dès 2027.",
    time: "Il y a 27 min",
    initials: "UC",
    avatarColor: "#3B82F6",
    read: false,
  },
  {
    id: "n3",
    type: "bourse",
    title: "Attribution de bourses",
    body: "42 bourses d'excellence attribuées aux meilleurs étudiants du réseau Fiinor pour l'année 2026.",
    time: "Il y a 1 h",
    initials: "FB",
    avatarColor: "#10B981",
    read: true,
  },
  {
    id: "n4",
    type: "validation",
    title: "Audit pédagogique terminé",
    body: "L'audit annuel des programmes de l'Institut Supérieur Dakar a été finalisé avec succès.",
    time: "Il y a 2 h",
    initials: "IS",
    avatarColor: "#8B5CF6",
    read: true,
  },
]

const typeConfig: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  validation: {
    icon: CheckCircle2,
    color: "#10B981",
    bg: "bg-[#10B981]/10",
    label: "Validation",
  },
  partenariat: {
    icon: Handshake,
    color: "#3B82F6",
    bg: "bg-[#3B82F6]/10",
    label: "Partenariat",
  },
  bourse: {
    icon: Award,
    color: "#C9A84C",
    bg: "bg-[#C9A84C]/10",
    label: "Bourse",
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20, height: 0 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    height: "auto",
    transition: {
      delay: i * 0.08,
      type: "spring" as const,
      stiffness: 300,
      damping: 28,
    },
  }),
  exit: {
    opacity: 0,
    x: 40,
    height: 0,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
}

export function NotificationsPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifs)

  const unreadCount = notifs.filter((n) => !n.read).length

  function dismiss(id: string) {
    setNotifs((prev) => prev.filter((n) => n.id !== id))
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <Card ref={ref} className="border-border/50 bg-card">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="size-3.5 text-muted-foreground" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-[#EF4444] text-[8px] font-bold text-white"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
            <CardTitle className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              Notifications Live
            </CardTitle>
          </div>
          <button
            onClick={markAllRead}
            className="text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Tout marquer lu
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3">
        <AnimatePresence initial={false} mode="popLayout">
          {notifs.map((notif, i) => {
            const cfg = typeConfig[notif.type]
            const Icon = cfg.icon
            return (
              <motion.div
                key={notif.id}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                exit="exit"
                layout
                className={`group relative mb-1.5 overflow-hidden rounded-lg border px-2.5 py-2 transition-colors last:mb-0 ${
                  notif.read
                    ? "border-border/20 bg-muted/5"
                    : "border-border/40 bg-muted/20"
                }`}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <span className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#C9A84C]" />
                )}

                <div className="flex items-start gap-2 pl-1.5">
                  {/* Avatar */}
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback
                      className="text-[10px] font-bold"
                      style={{ backgroundColor: `${notif.avatarColor}20`, color: notif.avatarColor }}
                    >
                      {notif.initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`flex size-4 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}
                      >
                        <Icon className="size-2.5" style={{ color: cfg.color }} />
                      </span>
                      <span className="truncate text-[10px] font-semibold text-foreground">
                        {notif.title}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[10px] leading-snug text-muted-foreground">
                      {notif.body}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge
                        className="h-4 border-0 px-1.5 text-[9px]"
                        style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
                      >
                        {cfg.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/60">
                        {notif.time}
                      </span>
                    </div>
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={() => dismiss(notif.id)}
                    className="shrink-0 rounded p-0.5 text-muted-foreground/0 transition-all group-hover:text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {notifs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2 py-8 text-center"
          >
            <MoreHorizontal className="size-8 text-muted-foreground/30" />
            <p className="text-[12px] text-muted-foreground">Aucune notification</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
