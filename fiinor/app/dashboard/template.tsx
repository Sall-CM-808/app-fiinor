"use client"

import { motion, useReducedMotion } from "framer-motion"

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -8 }}
      transition={{
        duration: reduced ? 0 : 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  )
}
