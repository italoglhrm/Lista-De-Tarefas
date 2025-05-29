import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { PREDEFINED_TAGS } from '../App'; // Assumindo que App.tsx está no diretório pai

interface Comment {
  text: string;
  date: string;
}

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  creationDate: string;
  comments: Comment[];
  tags: string[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, newTitle: string, newDescription: string, newTags: string[]) => void;
  onAddComment: (id: string, comment: string) => void;
}

export default function TaskCard({
  id,
  title,
  description,
  completed,
  creationDate,
  comments,
  tags,
  onToggle,
  onRemove,
  onEdit,
  onAddComment
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isEditing) {
      setEditedTitle(title);
      setEditedDescription(description);
      setEditedTags(tags || []);
    }
  }, [isEditing, title, description, tags]);

  const handleEditSubmit = () => {
    onEdit(id, editedTitle, editedDescription, editedTags);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    onAddComment(id, newComment);
    setNewComment('');
  };

  const handleTagSelection = (tagId: string) => {
    setEditedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((t) => t !== tagId)
        : [...prevTags, tagId]
    );
  };

  return (
    <div className="card-tarefa" style={{ position: 'relative', marginBottom: '1rem' }}>
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input className="input-estilizado" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
          <textarea className="input-estilizado" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} rows={3} style={{ resize: 'none' }} />
          <div style={{ width: '100%' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Tags:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {PREDEFINED_TAGS.map((tagOption) => {
                const isSelected = editedTags.includes(tagOption.id);
                return (
                  <button
                    type="button"
                    key={tagOption.id}
                    onClick={() => handleTagSelection(tagOption.id)}
                    className={`botao-tag-selector ${isSelected ? 'selected' : ''}`}
                    style={{
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: tagOption.color,
                      color: '#000000',
                      border: isSelected ? '2px solid #000000' : '2px solid #d1d5db',
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
          <button className="botao-invertido" onClick={handleEditSubmit} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: 600, alignSelf: 'flex-start', backgroundColor: '#ffffff', color: '#000000' }}>
            Salvar
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => onToggle(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Marcar como concluída">
                {completed ? <CheckCircle size={20} color="#10B981" /> : <Circle size={20} color="#6B7280" />}
              </button>
              <span className="tarefa-titulo" style={{ textDecoration: completed ? 'line-through' : 'none' }}>
                {title}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className={completed ? 'status-concluida' : 'status-pendente'}>
                {completed ? 'Concluída' : 'Pendente'}
              </span>
              <button onClick={() => setShowComments(!showComments)} className="botao-invertido" title="Ver comentários" style={{ background: 'none', border: 'none', padding: '0.25rem', cursor: 'pointer' }}>
                <MessageSquare size={18} />
              </button>
              <button onClick={() => setIsEditing(true)} className="botao-invertido" title="Editar" style={{ background: 'none', border: 'none', padding: '0.25rem' }}>
                <Pencil size={18} />
              </button>
              <button onClick={() => onRemove(id)} className="botao-remover" title="Remover" style={{ background: 'none', border: 'none', padding: '0.25rem' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          {description && (
            <div className="tarefa-descricao" style={{ textDecoration: completed ? 'line-through' : 'none', marginTop: '0.5rem' }}>
              {description}
            </div>
          )}
          {/* <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>
            Criada em: {new Date(creationDate).toLocaleDateString('pt-BR')}
          </p> */}
          {tags && tags.length > 0 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tags.map((tagId) => {
                const tagObject = PREDEFINED_TAGS.find(t => t.id === tagId);
                if (!tagObject) {
                  return (<span key={tagId} className="tag-badge" style={{ backgroundColor: '#E0E0E0', color: '#333333', padding: '0.25em 0.6em', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>{tagId}</span> );
                }
                return (
                  <span key={tagObject.id} className="tag-badge" style={{ backgroundColor: tagObject.color, color: '#000000', padding: '0.25em 0.6em', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, display: 'inline-block' }}>
                    {tagObject.label}
                  </span>
                );
              })}
            </div>
          )}
          {showComments && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
              <strong style={{ marginBottom: '0.5rem', display: 'block' }}>Comentários:</strong>
              {comments.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#666' }}>Nenhum comentário ainda.</p>
              ) : (
                <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.5rem' }}>
                  {comments.map((comment, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      {comment.text} <br />
                      <small style={{ color: "#999" }}>
                        {new Date(comment.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </small>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Adicionar comentário..." className="input-estilizado input-comentario" />
                <button onClick={handleAddComment} className="botao-invertido botao-comentario"> Enviar </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}