export interface Task {
  id: string
  text: string
  completed: boolean
}

export interface Note {
  id: string
  title: string
  color: string
  createdAt: string
  position: { x: number; y: number }
  tasks: Task[]
}

export const COLOR_PALETTE = [
  '#fef08a', // yellow
  '#86efac', // green
  '#93c5fd', // blue
  '#f9a8d4', // pink
  '#fdba74', // orange
  '#d8b4fe', // purple
]
