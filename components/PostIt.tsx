'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Note, Task } from '@/types'
import ColorPicker from './ColorPicker'

interface PostItProps {
  note: Note
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
}

export default function PostIt({ note, onUpdate }: PostItProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: note.id })

  const [newTaskText, setNewTaskText] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  const style = {
    position: 'absolute' as const,
    left: note.position.x,
    top: note.position.y,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.85 : 1,
    backgroundColor: note.color,
  }

  const handleTitleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent?.trim() || 'Nueva nota'
    if (newTitle !== note.title) {
      onUpdate(note.id, { title: newTitle })
    }
  }

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = note.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    )
    onUpdate(note.id, { tasks: updatedTasks })
  }

  const handleAddTask = () => {
    const text = newTaskText.trim()
    if (!text) {
      setIsAddingTask(false)
      return
    }
    const newTask: Task = { id: uuidv4(), text, completed: false }
    onUpdate(note.id, { tasks: [...note.tasks, newTask] })
    setNewTaskText('')
    setIsAddingTask(false)
  }

  const handleColorChange = (color: string) => {
    onUpdate(note.id, { color })
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-64 rounded-lg shadow-xl flex flex-col select-none"
    >
      {/* Header / Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="px-3 pt-3 pb-1 cursor-grab active:cursor-grabbing rounded-t-lg"
        style={{ backgroundColor: note.color }}
      >
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleBlur}
          className="text-gray-800 font-bold text-sm outline-none border-b border-transparent focus:border-gray-400 bg-transparent w-full"
          style={{ cursor: 'text' }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {note.title}
        </h2>
      </div>

      {/* Body */}
      <div
        className="px-3 py-2 flex-1"
        style={{ backgroundColor: note.color }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {note.tasks.length > 0 && (
          <ul className="space-y-1 mb-2">
            {note.tasks.map((task) => (
              <li key={task.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="mt-0.5 cursor-pointer accent-gray-700 flex-shrink-0"
                />
                <span
                  className={`text-xs text-gray-800 break-words ${
                    task.completed ? 'line-through opacity-50' : ''
                  }`}
                >
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        {isAddingTask ? (
          <div className="flex gap-1 mt-1">
            <input
              autoFocus
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask()
                if (e.key === 'Escape') {
                  setIsAddingTask(false)
                  setNewTaskText('')
                }
              }}
              onBlur={handleAddTask}
              placeholder="Nueva tarea..."
              className="flex-1 text-xs bg-white/50 rounded px-1.5 py-0.5 outline-none border border-gray-300 focus:border-gray-500"
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="text-xs text-gray-600 hover:text-gray-900 mt-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            + Agregar tarea
          </button>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-3 pb-3 pt-1 flex items-center justify-between rounded-b-lg"
        style={{ backgroundColor: note.color }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ColorPicker current={note.color} onChange={handleColorChange} />
        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
          {formattedDate}
        </span>
      </div>
    </div>
  )
}
