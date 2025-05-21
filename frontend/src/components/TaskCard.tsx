import { useState } from 'react';
import {
  CheckCircle,
  Circle,
  Pencil,
  Trash2,
  MessageSquare,
} from 'lucide-react';

interface Comment {
  text: string;
  date: string;
}

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  comments: Comment[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, newTitle: string, newDescription: string) => void;
  onAddComment: (id: string, comment: string) => void;
}

export default function TaskCard({
  id,
  title,
  description,
  completed,
  comments,
  onToggle,
  onRemove,
  onEdit,
  onAddComment
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleEditSubmit = () => {
    onEdit(id, editedTitle, editedDescription);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    onAddComment(id, newComment);
    setNewComment('');
  };

  return (
    <div className="card-tarefa" style={{ position: 'relative', marginBottom: '1rem' }}>
      {isEditing ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '875px',
            width: '100%'
          }}
        >
          <input
            className="input-estilizado"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{
              maxWidth: '100%',
              width: '100%',
            }}
          />

          <textarea
            className="input-estilizado"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={3}
            style={{
              maxWidth: '100%',
              width: '100%',
              resize: 'none',
            }}
          />

          <button
            className="botao-invertido"
            onClick={handleEditSubmit}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
              alignSelf: 'flex-start',
              backgroundColor: '#ffffff',
              color: '#000000',
              boxShadow: '0 2px 4px rgba(255, 255, 255, 0.1)',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            Salvar
          </button>
        </div>
      ) : (
        <>
          {/* Cabeçalho do Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => onToggle(id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                title="Marcar como concluída"
              >
                {completed ? (
                  <CheckCircle size={20} color="#10B981" />
                ) : (
                  <Circle size={20} color="#6B7280" />
                )}
              </button>

              <span
                className="tarefa-titulo"
                style={{ textDecoration: completed ? 'line-through' : 'none' }}
              >
                {title}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className={completed ? 'status-concluida' : 'status-pendente'}>
                {completed ? 'Concluída' : 'Pendente'}
              </span>

              <button
                onClick={() => setShowComments(!showComments)}
                className="botao-invertido"
                title="Ver comentários"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                <MessageSquare size={18} />
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="botao-invertido"
                title="Editar"
                style={{ background: 'none', border: 'none', padding: '0.25rem' }}
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onRemove(id)}
                className="botao-remover"
                title="Remover"
                style={{ background: 'none', border: 'none', padding: '0.25rem' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Descrição */}
          {description && (
            <div
              className="tarefa-descricao"
              style={{ textDecoration: completed ? 'line-through' : 'none', marginTop: '0.5rem' }}
            >
              {description}
            </div>
          )}

          {/* Seção de comentários */}
          {showComments && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
              <strong style={{ marginBottom: '0.5rem', display: 'block' }}>Comentários:</strong>

              {comments.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#666' }}>Nenhum comentário ainda.</p>
              ) : (
                <ul style={{ marginTop: '0.5rem' }}>
                  {comments.map((comment, idx) => (
                    <li key={idx}>
                      • {comment.text}
                      <br />
                      <small style={{ color: "#999" }}>
                        {new Date(comment.date).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center', // 🔥 Alinhamento vertical
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                }}
              >
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicionar comentário..."
                  className="input-estilizado input-comentario"
                />
                <button
                  onClick={handleAddComment}
                  className="botao-invertido botao-comentario"
                >
                  Enviar
                </button>
              </div>


            </div>
          )}
        </>
      )}
    </div>
  );
}
