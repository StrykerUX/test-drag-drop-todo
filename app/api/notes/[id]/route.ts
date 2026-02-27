import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { Note } from '@/types'

const DATA_PATH = path.join(process.cwd(), 'data', 'notes.json')

function readNotes(): Note[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeNotes(notes: Note[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(notes, null, 2))
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const notes = readNotes()

  const index = notes.findIndex((n) => n.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  notes[index] = { ...notes[index], ...body, id }
  writeNotes(notes)

  return NextResponse.json(notes[index])
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const notes = readNotes()

  const filtered = notes.filter((n) => n.id !== id)
  writeNotes(filtered)

  return NextResponse.json({ success: true })
}
