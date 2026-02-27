'use client'

import type { Note } from '@/types'

interface AddNoteButtonProps {
  onAdd: (note: Note) => void
}

export default function AddNoteButton({ onAdd }: AddNoteButtonProps) {
  const handleClick = async () => {
    const position = {
      x: 50 + Math.floor(Math.random() * 250),
      y: 50 + Math.floor(Math.random() * 250),
    }

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Nueva nota',
        color: '#fef08a',
        position,
        tasks: [],
      }),
    })

    if (res.ok) {
      const note: Note = await res.json()
      onAdd(note)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 font-semibold px-4 py-2 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 text-sm"
    >
      <span className="text-lg leading-none">+</span>
      Nueva nota
    </button>
  )
}
