'use client'

import { motion } from 'framer-motion'

interface Props {
  phase: string
}

export function LoadingPhase({ phase }: Props) {
  if (!phase) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 text-slate-500 text-sm py-4"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />
      {phase}
    </motion.div>
  )
}
