import { useState } from 'react';
import { Search, CalendarDays, Filter } from 'lucide-react';

interface TaskFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: 'pendente' | 'em andamento' | 'concluída' | 'todos';
  setStatusFilter: (value: 'pendente' | 'em andamento' | 'concluída' | 'todos') => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  tagFilters: string[];
  toggleTagFilter: (tagId: string) => void;
  availableTags: { id: string; label: string }[];
}

export default function TaskFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  tagFilters,
  toggleTagFilter,
  availableTags,
}: TaskFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
      <button
        className="botao-invertido"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.8rem',
          background: 'transparent',
          color: '#fff',
          border: '1px solid #555',
          padding: '0.3rem 0.75rem',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
        onClick={() => setOpen(!open)}
      >
        <Filter size={14} color="#fff" /> Filtrar
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRadius: '0.5rem',
            padding: '1rem',
            width: '300px',
            zIndex: 999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="input-estilizado"
              style={{ width: '100%', height: '32px', fontSize: '0.8rem', paddingLeft: '28px' }}
            />
            <Search size={14} style={{ position: 'absolute', top: '8px', left: '8px', color: '#888' }} />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskFiltersProps['statusFilter'])}
            className="input-estilizado"
            style={{ width: '100%', height: '32px', fontSize: '0.8rem' }}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="em andamento">Em andamento</option>
            <option value="concluída">Concluída</option>
          </select>

          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-estilizado"
              style={{ width: '100%', height: '32px', fontSize: '0.8rem', paddingLeft: '28px' }}
            />
            <CalendarDays size={14} style={{ position: 'absolute', top: '8px', left: '8px', color: '#888' }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTagFilter(tag.id)}
                className={`botao-tag-selector ${tagFilters.includes(tag.id) ? 'selected' : ''}`}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.7rem',
                  borderRadius: '10px',
                  border: '1px solid #444',
                  background: tagFilters.includes(tag.id) ? '#ccc' : 'transparent',
                  color: tagFilters.includes(tag.id) ? '#000' : '#fff',
                  cursor: 'pointer'
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
