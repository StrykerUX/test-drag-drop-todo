'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { Note } from '@/types'
import PostIt from './PostIt'
import TrashCan from './TrashCan'
import AddNoteButton from './AddNoteButton'

export default function Canvas() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  useEffect(() => {
    fetch('/api/notes')
      .then((r) => r.json())
      .then(setNotes)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const note = notes.find((n) => n.id === event.active.id)
    setActiveNote(note ?? null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveNote(null)
    const { active, over, delta } = event

    if (over?.id === 'trash') {
      // Delete note
      await fetch(`/api/notes/${active.id}`, { method: 'DELETE' })
      setNotes((prev) => prev.filter((n) => n.id !== active.id))
      return
    }

    // Update position
    const note = notes.find((n) => n.id === active.id)
    if (!note) return

    const newPosition = {
      x: note.position.x + delta.x,
      y: note.position.y + delta.y,
    }

    await fetch(`/api/notes/${active.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position: newPosition }),
    })

    setNotes((prev) =>
      prev.map((n) =>
        n.id === active.id ? { ...n, position: newPosition } : n
      )
    )
  }

  const handleUpdate = async (id: string, updates: Partial<Note>) => {
    await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    )
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const handleAdd = (note: Note) => {
    setNotes((prev) => [...prev, note])
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="canvas-bg w-full h-screen overflow-hidden relative">
        <AddNoteButton onAdd={handleAdd} />

        {notes.map((note) => (
          <PostIt
            key={note.id}
            note={note}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}

        <TrashCan />
      </div>

      <DragOverlay>
        {activeNote && (
          <div
            className="w-64 rounded-lg shadow-2xl opacity-80 rotate-2"
            style={{ backgroundColor: activeNote.color, height: '160px' }}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
