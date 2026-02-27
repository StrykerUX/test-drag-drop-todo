'use client'

export type FilterType = 'all' | 'pending' | 'recent'

interface FilterBarProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'recent', label: 'Más recientes' },
  ]

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-2 py-2 flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                activeFilter === filter.id
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
