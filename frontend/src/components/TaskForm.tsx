import { useState } from 'react';
import catGif from '../assets/cat-meme-cat-type.gif';
import type { Tag } from '../App';

interface TaskFormProps {
  onAdd: (title: string, description: string, tags: Tag[]) => void;
}

function generateColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}`;
  return color.slice(0, 7);
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, insira um título para a tarefa.');
      return;
    }
    onAdd(title, description, tags);
    setTitle('');
    setDescription('');
    setTags([]);
    setNewTag('');
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    const tagId = trimmed.toLowerCase().replace(/\s+/g, '-');
    if (tags.some(t => t.id === tagId)) return;
    setTags([...tags, { id: tagId, label: trimmed, color: generateColor(tagId) }]);
    setNewTag('');
  };

  const removeTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  return (
    <div className="card-invertido">
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>Criar nova tarefa</h2>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Preencha os campos abaixo para adicionar uma tarefa à sua lista.
          </p>
        </div>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título da tarefa"
          className="input-estilizado"
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descrição"
          className="input-estilizado"
          rows={3}
          style={{ resize: 'none' }}
        />
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Tags:</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span
                key={tag.id}
                className="tag-badge"
                style={{ backgroundColor: tag.color, color: '#000', padding: '0.25rem 0.6rem', borderRadius: '12px' }}
              >
                {tag.label}
                <button
                  onClick={() => removeTag(tag.id)}
                  style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '300px' }}>
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Nova tag"
              className="input-estilizado"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="botao-invertido"
              style={{ whiteSpace: 'nowrap' }}
            >
              +
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="botao-invertido"
          style={{
            marginTop: '1.5rem',
            fontSize: '1rem',
            padding: '0.75rem 1.5rem',
            fontWeight: '600'
          }}
        >
          Adicionar Tarefa
        </button>

      </form>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Lista de Tarefas</h1>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', maxWidth: '300px', lineHeight: '1.4' }}>
          Criado por <strong>Ítalo e Julia</strong><br />
          Banco de Dados – Prof. Fábio Castro<br />
          Ulbra Palmas 2025/1
        </h2>
        <img src={catGif} alt="Gato programador digitando" style={{ maxWidth: '220px', height: 'auto' }} />
      </div>
    </div>
  );
}
