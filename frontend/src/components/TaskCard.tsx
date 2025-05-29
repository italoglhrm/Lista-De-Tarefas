import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Pencil, Trash2, MessageSquare } from 'lucide-react';
import type { Tag } from '../App';

interface Comment {
  text: string;
  date: string;
}

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: 'pendente' | 'em andamento' | 'concluída';
  creationDate: string;
  comments: Comment[];
  tags: Tag[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, newTitle: string, newDescription: string, newTags: Tag[]) => void;
  onAddComment: (id: string, comment: string) => void;
}

export default function TaskCard({
  id, title, description, status,
  creationDate, comments, tags,
  onToggle, onRemove, onEdit, onAddComment
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedTags, setEditedTags] = useState<Tag[]>(tags);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isEditing) {
      setEditedTitle(title);
      setEditedDescription(description);
      setEditedTags(tags);
    }
  }, [isEditing]);

  const handleEditSubmit = () => {
    onEdit(id, editedTitle, editedDescription, editedTags);
    setIsEditing(false);
  };

  let statusColor = '#FACC15'; // amarelo
  let statusLabel = 'Pendente';
  let statusIcon = <Circle size={20} color={statusColor} />;

  if (status === 'concluída') {
    statusColor = '#10B981';
    statusLabel = 'Concluída';
    statusIcon = <CheckCircle size={20} color={statusColor} />;
  } else if (status === 'em andamento') {
    statusColor = '#3B82F6';
    statusLabel = 'Em andamento';
    statusIcon = <Circle size={20} color={statusColor} />;
  }

  return (
    <div className="card-tarefa">
      {isEditing ? (
        <>
          <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="input-estilizado" />
          <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="input-estilizado" rows={3} />
          <button className="botao-invertido" onClick={handleEditSubmit}>Salvar</button>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button onClick={() => onToggle(id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {statusIcon}
              </button>
              <span className="tarefa-titulo" style={{ textDecoration: status === 'concluída' ? 'line-through' : 'none' }}>{title}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="tag-badge" style={{ backgroundColor: statusColor, color: '#fff', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem' }}>{statusLabel}</span>
              <button onClick={() => setShowComments(!showComments)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <MessageSquare size={18} color="#fff" />
              </button>
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Pencil size={18} color="#fff" />
              </button>
              <button onClick={() => onRemove(id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Trash2 size={18} color="#fff" />
              </button>
            </div>
          </div>
          {description && <p className="tarefa-descricao">{description}</p>}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span key={tag.id} className="tag-badge" style={{ backgroundColor: tag.color, color: '#000' }}>
                {tag.label}
              </span>
            ))}
          </div>
          {showComments && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Comentários:</strong>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {comments.map((c, i) => (
                  <li key={i}>{c.text}<br /><small>{new Date(c.date).toLocaleString()}</small></li>
                ))}
              </ul>
              <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} className="input-estilizado" placeholder="Novo comentário..." />
              <button className="botao-invertido" style={{ marginTop: '0.5rem' }} onClick={() => { if (newComment.trim()) { onAddComment(id, newComment); setNewComment(''); } }}>Enviar</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
