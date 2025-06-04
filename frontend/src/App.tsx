import { useState, useEffect, useRef } from 'react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import TaskFilters from './components/TaskFilters';
import './styles/main.css';
import { ChevronDown } from 'lucide-react';
import UserDashboard from './components/UserDashboard';
import UserDashboardCharts from './components/UserDashboardCharts';

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pendente' | 'em andamento' | 'concluída';
  creationDate: string;
  comments: { text: string; date: string }[];
  tags: Tag[];
  idUsuario: string;
}

interface DashboardData {
  [user: string]: {
    status: { pendentes: number; em_andamento: number; concluidas: number };
    por_dia: { date: string; count: number }[];
    tags_top: { label: string; count: number }[];
    tempo_medio_conclusao: number;
    taxa_conclusao_semanal: number;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pendente' | 'em andamento' | 'concluída' | 'todos'>('todos');
  const [dateFilter, setDateFilter] = useState('');
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [availableUsers] = useState<string[]>(['Ítalo', 'Julia']);
  const [currentUser, setCurrentUser] = useState('Ítalo');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userSwitcherContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/tarefas`);
        const data = await res.json();
        const loadedTasks: Task[] = data.map((task: any) => ({
          id: task._id || task.id,
          title: task.title,
          description: task.description,
          status: task.status || 'pendente',
          creationDate: task.creationDate || new Date().toISOString(),
          comments: task.comments || [],
          tags: task.tags || [],
          idUsuario: task.idUsuario,
        }));
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard`);
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
      }
    };
    fetchDashboard();
  }, [currentUser]);

  const addTask = async (title: string, description: string, tags: Tag[]) => {
    const newTask = {
      title,
      description,
      status: 'pendente',
      tags,
      idUsuario: currentUser,
    };
    try {
      const res = await fetch(`${API_URL}/tarefas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const createdTask = await res.json();
      setTasks(prev => [...prev, {
        id: createdTask._id ?? createdTask.id,
        title: createdTask.title,
        description: createdTask.description,
        status: createdTask.status || 'pendente',
        creationDate: createdTask.creationDate || new Date().toISOString(),
        comments: createdTask.comments || [],
        tags: createdTask.tags || [],
        idUsuario: createdTask.idUsuario || currentUser
      }]);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/tarefas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const statusCycle: Record<Task['status'], Task['status']> = {
      pendente: 'em andamento',
      'em andamento': 'concluída',
      concluída: 'pendente'
    };
    const nextStatus = statusCycle[task.status];
    try {
      const res = await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: updatedTask.status } : t));
    } catch (error) {
      console.error("Erro ao mudar status:", error);
    }
  };

  const editTask = async (id: string, newTitle: string, newDescription: string, newTags: Tag[]) => {
    try {
      const res = await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription, tags: newTags }),
      });
      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedTask } : t));
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    }
  };

  const addComment = async (taskId: string, commentText: string) => {
    try {
      const res = await fetch(`${API_URL}/tarefas/${taskId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      });
      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: updatedTask.comments } : t));
    } catch (error) {
      console.error("Erro ao comentar:", error);
    }
  };

  const toggleTagFilter = (tagId: string) => {
    setTagFilters(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
  };

  const tasksToDisplay = tasks.filter(task => {
    if (task.idUsuario !== currentUser) return false;
    const matchesSearch = searchTerm === '' || task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || task.status === statusFilter;
    const matchesDate = dateFilter === '' || task.creationDate.startsWith(dateFilter);
    const matchesTags = tagFilters.length === 0 || tagFilters.every(tag => task.tags.some(t => t.id === tag));
    return matchesSearch && matchesStatus && matchesDate && matchesTags;
  });

  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags.map(tag => tag.id)))).map(id => {
    const label = tasks.find(t => t.tags.some(tag => tag.id === id))?.tags.find(tag => tag.id === id)?.label || id;
    return { id, label };
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
        <div style={{ width: '960px', display: 'flex', justifyContent: 'flex-end', position: 'relative' }} ref={userSwitcherContainerRef}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="user-switch-button-minimalist"
            >
              {currentUser}
              <ChevronDown size={16} style={{ transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {showUserDropdown && (
              <div className="user-dropdown" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 10 }}>
                {availableUsers.map(user => (
                  <button
                    key={user}
                    onClick={() => {
                      setCurrentUser(user);
                      setShowUserDropdown(false);
                    }}
                    className={`user-dropdown-item${user === currentUser ? ' active' : ''}`}
                  >
                    {user}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <main style={{ padding: '2rem', maxWidth: '960px', margin: '2rem auto' }}>
        <TaskForm onAdd={addTask} />

        <section style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <h2 className="tarefa-secao-titulo">Suas Tarefas</h2>
            <TaskFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              tagFilters={tagFilters}
              toggleTagFilter={toggleTagFilter}
              availableTags={allTags}
            />
          </div>

          {tasksToDisplay.length === 0 ? (
            <p className="tarefa-descricao">Nenhuma tarefa para você.</p>
          ) : (
            tasksToDisplay.map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                creationDate={task.creationDate}
                comments={task.comments}
                tags={task.tags}
                onToggle={toggleTaskStatus}
                onRemove={removeTask}
                onEdit={editTask}
                onAddComment={addComment}
              />
            ))
          )}
        </section>

        {dashboardData[currentUser] && (
          <UserDashboardCharts
            key={`charts-${currentUser}`}
            user={currentUser}
            data={{
              status: {
                pendentes: dashboardData[currentUser]?.status?.pendentes ?? 0,
                em_andamento: dashboardData[currentUser]?.status?.em_andamento ?? 0,
                concluidas: dashboardData[currentUser]?.status?.concluidas ?? 0,
              },
              por_dia: dashboardData[currentUser]?.por_dia ?? [],
              tags_top: dashboardData[currentUser]?.tags_top ?? [],
              tempo_medio_conclusao: dashboardData[currentUser]?.tempo_medio_conclusao ?? 0,
              taxa_conclusao_semanal: dashboardData[currentUser]?.taxa_conclusao_semanal ?? 0,
            }}
          />
        )}
      </main>
    </>
  );
}
