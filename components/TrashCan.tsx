'use client'

import { useDroppable } from '@dnd-kit/core'

export default function TrashCan() {
  const { setNodeRef, isOver } = useDroppable({ id: 'trash' })

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
        isOver
          ? 'bg-red-500 scale-125 shadow-red-400/50 shadow-xl'
          : 'bg-white/80 hover:bg-white/90'
      }`}
    >
      <span className="text-2xl" role="img" aria-label="trash">
        🗑️
      </span>
    </div>
  )
}
