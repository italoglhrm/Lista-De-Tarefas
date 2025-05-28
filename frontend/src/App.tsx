import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import './styles/main.css';
import { Filter } from 'lucide-react';

export interface Task { 
  id: string;
  title: string;
  description: string;
  completed: boolean;
  comments: { text: string; date: string }[];
  tags: string[]; 
}

const API_URL = import.meta.env.VITE_API_URL;

export const PREDEFINED_TAGS = [
  { id: 'work',    label: 'Trabalho', color: '#FFCDD2' }, 
  { id: 'personal',label: 'Pessoal',  color: '#BBDEFB' }, 
  { id: 'study',   label: 'Estudo',   color: '#C8E6C9' }, 
  { id: 'urgent',  label: 'Urgente',  color: '#FFF9C4' }, 
  { id: 'project', label: 'Projeto',  color: '#D1C4E9' },
  { id: 'house',   label: 'Casa',     color: '#FFCCBC' }, 
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [showTagFilterDropdown, setShowTagFilterDropdown] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/tarefas`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        const loadedTasks = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.status === 'concluída',
          comments: task.comments || [],
          tags: task.tags || [], 
        }));
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (title: string, description: string, tags: string[]) => {
    try {
      const response = await fetch(`${API_URL}/tarefas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags }), // Include tags in the request
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const newTaskData = await response.json();
      // Ensure the new task from API response also correctly initializes tags
      const newTaskWithAllFields: Task = {
        id: newTaskData.id,
        title: newTaskData.title,
        description: newTaskData.description,
        completed: newTaskData.status === 'concluída',
        comments: newTaskData.comments || [],
        tags: newTaskData.tags || tags,
      };
      setTasks(prevTasks => [...prevTasks, newTaskWithAllFields]);
    } catch (error) {
      console.error("Failed to add task:", error);
      alert('Falha ao adicionar a tarefa.');
    }
  };

  const removeTask = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove task');
      }
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to remove task:", error);
      alert('Falha ao remover a tarefa.');
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const novoStatus = task.completed ? 'pendente' : 'concluída';

    try {
      const response = await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.error(error);
      alert('Falha ao atualizar status da tarefa.');
    }
  };

  const editTask = async (
    id: string,
    newTitle: string,
    newDescription: string,
    newTags: string[] 
  ) => {
    try {
      const response = await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription, tags: newTags }), // Include tags in the request
      });

      if (!response.ok) {
        throw new Error('Erro ao editar tarefa');
      }

      setTasks(
        tasks.map((t) =>
          t.id === id
            ? { ...t, title: newTitle, description: newDescription, tags: newTags } // Update tags here
            : t
        )
      );
    } catch (error) {
      console.error(error);
      alert('Falha ao editar a tarefa.');
    }
  };

  const addComment = async (taskId: string, commentText: string) => {
    try {
      const response = await fetch(
        `${API_URL}/tarefas/${taskId}/comment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: commentText }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao adicionar comentário');
      }
      const newComment = await response.json();
      setTasks(
        tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              comments: [...(task.comments || []), newComment],
            };
          }
          return task;
        })
      );
    } catch (error) {
      console.error(error);
      alert('Falha ao adicionar comentário.');
    }
  };

  // Filter tasks based on searchTerm and selectedFilterTags
  const tasksToDisplay = tasks.filter(task => {
    const textSearchMatch = searchTerm === '' ||
                           (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const taskTags = task.tags || []; 
    const tagFilterMatch = selectedFilterTags.length === 0 ||
                          selectedFilterTags.some(filterTag => taskTags.includes(filterTag));

    return textSearchMatch && tagFilterMatch;
  });

  return (
    <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <TaskForm onAdd={addTask} predefinedTags={PREDEFINED_TAGS} />

      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="suas-tarefas-titulo" style={{ margin: 0 }}>
            Suas Tarefas
          </h2>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div
              className="input-estilizado" 
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingRight: '0.5rem', 
                paddingLeft: '0.75rem',
              }}
            >
              <input
                type="text"
                placeholder="Pesquisar tarefa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'inherit', 
                  flexGrow: 1,
                  fontSize: '0.875rem',
                  paddingTop: '0.5rem', 
                  paddingBottom: '0.5rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowTagFilterDropdown(!showTagFilterDropdown)}
                title="Filter by tags"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0.25rem',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                  color: 'inherit', 
                }}
              >
                <Filter size={18} />
              </button>
            </div>

            {showTagFilterDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%', 
                  right: 0, 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '0.375rem',
                  padding: '0.75rem',
                  marginTop: '0.25rem', 
                  zIndex: 10, 
                  minWidth: '200px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                <h4 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600' }}>
                  Filtrar por Tags:
                </h4>
                {PREDEFINED_TAGS.map(tagOption => { // Renamed 'tag' to 'tagOption' for clarity
                  const isSelected = selectedFilterTags.includes(tagOption.id);
                  return (
                    <div key={tagOption.id} style={{ marginBottom: '0.5rem' }}>
                      <label
                        style={{
                          display: 'inline-flex', // Use inline-flex for better alignment of checkbox and text
                          alignItems: 'center',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '12px',
                          backgroundColor: tagOption.color, // Pastel background
                          color: '#000000',              // Black text
                          border: isSelected ? '2px solid #000000' : '2px solid #d1d5db', // Selection indicator
                          fontWeight: isSelected ? 'bold' : 'normal',
                          transition: 'border-color 0.2s ease-in-out, font-weight 0.2s ease-in-out',
                          width: '100%', // Make label take full width if desired for better click area
                          boxSizing: 'border-box',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedFilterTags(prev =>
                              prev.includes(tagOption.id)
                                ? prev.filter(tId => tId !== tagOption.id)
                                : [...prev, tagOption.id]
                            );
                          }}
                          style={{ marginRight: '0.75rem', cursor: 'pointer', transform: 'scale(1.1)' }} // Slightly larger checkbox
                        />
                        {tagOption.label}
                      </label>
                    </div>
                  );
                })}
                {PREDEFINED_TAGS.length === 0 && (
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>Nenhuma tag definida.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {tasksToDisplay.length === 0 ? (
          <p className="tarefa-descricao">
            {searchTerm || selectedFilterTags.length > 0 ? 'No tasks match your criteria.' : 'Nenhuma tarefa adicionada ainda.'}
          </p>
        ) : (
          tasksToDisplay.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              completed={task.completed}
              comments={task.comments}
              tags={task.tags || []} 
              onToggle={toggleTaskStatus}
              onRemove={removeTask}
              onEdit={editTask} 
              onAddComment={addComment}
            />
          ))
        )}
      </section>
    </main>
  );
}