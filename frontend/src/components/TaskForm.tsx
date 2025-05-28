import { useState } from 'react';
import catGif from '../assets/cat-meme-cat-type.gif';

interface TaskFormProps {
  onAdd: (title: string, description: string, tags: string[]) => void;
  predefinedTags: Array<{ id: string; label: string, color: string }>;
}

export default function TaskForm({ onAdd, predefinedTags }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description, selectedTags);
    setTitle('');
    setDescription('');
    setSelectedTags([]);
  };

  const handleTagSelection = (tagId: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((t) => t !== tagId)
        : [...prevTags, tagId]
    );
  };

  return (
    <div
      className="card-invertido"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2rem',
        marginBottom: '2rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1rem',
          width: '100%',
          maxWidth: '380px',
        }}
      >
        <div style={{ marginBottom: '0.5rem', width: '100%' }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}
          >
            Criar nova tarefa
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Preencha os campos abaixo para adicionar uma tarefa à sua lista.
          </p>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da tarefa"
          className="input-estilizado"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
          className="input-estilizado"
          rows={3}
          style={{ resize: 'none' }}
        />

        <div style={{ width: '100%' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
            Tags:
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {predefinedTags.map((tagOption) => { // Assuming prop is named predefinedTags
              const isSelected = selectedTags.includes(tagOption.id);
              return (
                <button
                  type="button"
                  key={tagOption.id}
                  onClick={() => handleTagSelection(tagOption.id)}
                  className={`botao-tag-selector ${isSelected ? 'selected' : ''}`} // Keep classes for potential CSS overrides
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: '12px',
                    backgroundColor: tagOption.color,
                    color: '#000000',
                    border: isSelected ? '2px solid #000000' : '2px solid #d1d5db', // Black border if selected, light grey otherwise
                    cursor: 'pointer',
                    fontWeight: isSelected ? 'bold' : '500',
                    textAlign: 'center',
                    minWidth: '60px',
                    transition: 'border-color 0.2s ease-in-out, font-weight 0.2s ease-in-out',
                  }}
                >
                  {tagOption.label} {isSelected ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="botao-invertido"
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1.25rem',
            fontWeight: 600,
            borderRadius: '8px',
          }}
        >
          Adicionar Tarefa
        </button>
      </form>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
        }}
      >
        <h1
          style={{
            fontSize: '2.3rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}
        >
          Lista de Tarefas
        </h1>
        <h2
          style={{
            fontSize: '1rem',
            marginBottom: '1rem',
            maxWidth: '300px',
            lineHeight: '1.4',
          }}
        >
          Criado por <strong>Ítalo e Júlia</strong>
          <br />
          Banco de Dados – Prof. Fábio Castro
          <br />
          Ulbra Palmas 2025/1
        </h2>
        <img
          src={catGif}
          alt="Gato programador digitando"
          style={{
            maxWidth: '220px',
            height: 'auto',
            objectFit: 'cover',
            boxShadow: 'none',
          }}
        />
      </div>
    </div>
  );
}