import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
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

export async function GET() {
  const notes = readNotes()
  return NextResponse.json(notes)
}

export async function POST(request: Request) {
  const body = await request.json()
  const notes = readNotes()

  const newNote: Note = {
    id: uuidv4(),
    title: body.title ?? 'Nueva nota',
    color: body.color ?? '#fef08a',
    createdAt: new Date().toISOString(),
    position: body.position ?? { x: 100, y: 100 },
    tasks: body.tasks ?? [],
  }

  notes.push(newNote)
  writeNotes(notes)

  return NextResponse.json(newNote, { status: 201 })
}
