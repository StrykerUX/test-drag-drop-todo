'use client'

import { COLOR_PALETTE } from '@/types'

interface ColorPickerProps {
  current: string
  onChange: (color: string) => void
}

export default function ColorPicker({ current, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-1">
      {COLOR_PALETTE.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
          style={{
            backgroundColor: color,
            borderColor: current === color ? '#1f2937' : 'transparent',
            transform: current === color ? 'scale(1.2)' : undefined,
          }}
          title={color}
        />
      ))}
    </div>
  )
}
