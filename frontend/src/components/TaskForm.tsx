import { useState } from 'react';
import catGif from '../assets/gatinho-gato.gif';

interface TaskFormProps {
  onAdd: (title: string, description: string) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description);
    setTitle('');
    setDescription('');
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
      }}
    >
      {/* FORMULÁRIO - ESQUERDA */}
      <form
        onSubmit={handleSubmit}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          maxWidth: '340px',
        }}
      >
        <div style={{ marginBottom: '0.5rem' }}>
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

        <button
          type="submit"
          className="botao-invertido"
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1.25rem',
            fontWeight: 600,
            borderRadius: '8px',
          }}
        >
          Adicionar
        </button>
      </form>

      {/* TÍTULO + SUBTÍTULO + GIF - DIREITA */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'center',
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
        <h2
          style={{
            fontSize: '0.75rem',
            marginBottom: '1rem',
            maxWidth: '300px',
            lineHeight: '1.4',
          }}
        >
          Criado por <strong>Ítalo e Julia</strong>
          <br />
          Banco de Dados – Prof. Fábio Castro
          <br />
          Ulbra Palmas 2025/1
        </h2>
      </div>
    </div>
  );
}
