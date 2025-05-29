import { useState, useEffect, useRef } from 'react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import './styles/main.css';
import { Filter, X, ChevronDown } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  creationDate: string;
  comments: { text: string; date: string }[];
  tags: string[];
  idUsuario: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [showMainFilterDropdown, setShowMainFilterDropdown] = useState<boolean>(false);
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const filterUIDropdownContainerRef = useRef<HTMLDivElement>(null);

  const [availableUsers, setAvailableUsers] = useState<string[]>(['Ítalo', 'Júlia']);
  const [currentUser, setCurrentUser] = useState<string>('Ítalo');
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const userSwitcherContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/tarefas`);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); }
        const data = await res.json();
        const loadedTasks = data.map((task: any, index: number) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.status === 'concluída',
          creationDate: task.creationDate || new Date().toISOString(),
          comments: task.comments || [],
          tags: task.tags || [],
          idUsuario: task.idUsuario || (index % availableUsers.length === 0 ? availableUsers[0] : availableUsers[1] || availableUsers[0]),
        }));
        setTasks(loadedTasks);
      } catch (error) { console.error("Failed to fetch tasks:", error); }
    };
    fetchTasks();
  }, [availableUsers]);

  useEffect(() => {
    function handleClickOutsideFilter(event: MouseEvent) {
      if (filterUIDropdownContainerRef.current && !filterUIDropdownContainerRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('.botao-filtro-principal')) {
        setShowMainFilterDropdown(false);
        setActiveSubFilter(null);
      }
    }
    if (showMainFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutsideFilter);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideFilter);
    };
  }, [showMainFilterDropdown]);

  useEffect(() => {
    function handleClickOutsideUser(event: MouseEvent) {
      if (userSwitcherContainerRef.current && !userSwitcherContainerRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('.user-switch-button-minimalist')) {
        setShowUserDropdown(false);
      }
    }
    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutsideUser);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUser);
    };
  }, [showUserDropdown]);

  const addTask = async (title: string, description: string, tags: string[]) => {
    const newTaskPayload = {
      title, description, tags,
      creationDate: new Date().toISOString(),
      status: 'pendente',
      idUsuario: currentUser,
    };
    const newTaskData = { ...newTaskPayload, id: `mock-${Date.now()}`, status: 'pendente' };
    const newTaskWithAllFields: Task = {
      id: newTaskData.id, title: newTaskData.title, description: newTaskData.description,
      completed: newTaskData.status === 'concluída',
      creationDate: newTaskData.creationDate,
      comments: [], tags: newTaskData.tags,
      idUsuario: newTaskData.idUsuario,
    };
    setTasks(prevTasks => [...prevTasks, newTaskWithAllFields]);
  };

  const removeTask = async (id: string) => {
    setTasks(tasks.filter((task) => !(task.id === id && task.idUsuario === currentUser)));
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id && t.idUsuario === currentUser);
    if (!task) return;
    setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const editTask = async (id: string, newTitle: string, newDescription: string, newTags: string[]) => {
    const taskToEdit = tasks.find(t => t.id === id && t.idUsuario === currentUser);
    if (!taskToEdit) { alert("Não pode editar esta tarefa."); return; }
    setTasks(tasks.map((t) => t.id === id ? { ...t, title: newTitle, description: newDescription, tags: newTags } : t));
  };

  const addComment = async (taskId: string, commentText: string) => {
     const taskToComment = tasks.find(t => t.id === taskId && t.idUsuario === currentUser);
     if (!taskToComment) { alert("Não pode comentar nesta tarefa."); return; }
    const newComment = { text: commentText, date: new Date().toISOString() };
    setTasks(tasks.map((task) => task.id === taskId ? { ...task, comments: [...(task.comments || []), newComment] } : task));
  };

  const tasksToDisplay = tasks.filter(task => {
    if (task.idUsuario !== currentUser) return false;
    const textSearchMatch = searchTerm === '' ||
                           (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const taskTags = task.tags || [];
    const tagFilterMatch = selectedFilterTags.length === 0 ||
                          selectedFilterTags.some(filterTag => taskTags.includes(filterTag));
    const statusMatch = statusFilter === 'todos' ||
                       (statusFilter === 'concluída' && task.completed) ||
                       (statusFilter === 'pendente' && !task.completed);
    const creationDateOnly = task.creationDate ? task.creationDate.substring(0, 10) : '';
    const dateMatch = dateFilter === '' || creationDateOnly === dateFilter;
    return textSearchMatch && tagFilterMatch && statusMatch && dateMatch;
  });

  const clearAllFilters = () => {
    setSearchTerm(''); setSelectedFilterTags([]); setStatusFilter('todos');
    setDateFilter(''); setActiveSubFilter(null);
  };

  const handleSubFilterToggle = (filterName: string) => {
    setActiveSubFilter(prev => prev === filterName ? null : filterName);
  };

  const handleUserChange = (user: string) => {
    setCurrentUser(user); setShowUserDropdown(false); clearAllFilters();
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '960px', margin: '2rem auto' }}> {/* Margem superior de volta ao normal */}
      <div className="user-switcher-container" ref={userSwitcherContainerRef}>
        <button type="button" onClick={() => setShowUserDropdown(!showUserDropdown)} className="user-switch-button-minimalist">
          {currentUser}
          <ChevronDown size={16} style={{ transition: 'transform 0.2s ease-in-out', transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>
        {showUserDropdown && (
          <div className="user-dropdown">
            {availableUsers.filter(user => user !== currentUser).map(user => (
              <button key={user} type="button" onClick={() => handleUserChange(user)} className="user-dropdown-item">
                {user}
              </button>
            ))}
            {availableUsers.filter(user => user !== currentUser).length === 0 && (
              <div className="user-dropdown-item-none">Não há outros usuários</div>
            )}
          </div>
        )}
      </div>

      <TaskForm onAdd={addTask} predefinedTags={PREDEFINED_TAGS} />
      
      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="tarefa-secao-titulo" style={{ margin: 0 }}>
            Suas Tarefas 
          </h2>
          <div style={{ position: 'relative' }} ref={filterUIDropdownContainerRef}>
            <button type="button" onClick={() => { setShowMainFilterDropdown(!showMainFilterDropdown); if (showMainFilterDropdown && activeSubFilter) setActiveSubFilter(null); }} title="Pesquisar e Filtrar Tarefas" className="botao-filtro-principal input-estilizado">
              Pesquisar / Filtrar <Filter size={18} />
            </button>
            {showMainFilterDropdown && (
              <div className="dropdown-filtros-principal">
                <div className="filtro-item-dropdown">
                  <input type="text" placeholder="Pesquisar por título/descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-estilizado" style={{ width: '100%' }}/>
                </div>
                {['Status', 'Tags', 'Data'].map(filterType => (
                  <div key={filterType} className="filtro-categoria-dropdown">
                    <button type="button" onClick={() => handleSubFilterToggle(filterType.toLowerCase())} className="botao-submenu-trigger">
                      Filtrar por {filterType}
                      <span style={{ marginLeft: 'auto', transform: activeSubFilter === filterType.toLowerCase() ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
                    </button>
                    {activeSubFilter === filterType.toLowerCase() && (
                      <div className="submenu-content">
                        {filterType === 'Status' && (
                          <div className="badge-group-selector">
                            {[{value: 'todos', label: 'Todos'}, {value: 'pendente', label: 'Pendente'}, {value: 'concluída', label: 'Concluída'}].map(statusOpt => {
                              const isActive = statusFilter === statusOpt.value;
                              return ( <button key={statusOpt.value} type="button" onClick={() => setStatusFilter(statusOpt.value)} className={`badge-selector status-badge ${isActive ? 'active' : ''}`}> {statusOpt.label} </button> );
                            })}
                          </div>
                        )}
                        {filterType === 'Tags' && (
                          <div className="badge-group-selector">
                            {PREDEFINED_TAGS.map(tagOption => {
                              const isSelected = selectedFilterTags.includes(tagOption.id);
                              return ( <button key={tagOption.id} type="button" onClick={() => setSelectedFilterTags(prev => prev.includes(tagOption.id) ? prev.filter(tId => tId !== tagOption.id) : [...prev, tagOption.id])} className={`badge-selector tag-badge ${isSelected ? 'active' : ''}`} style={{ backgroundColor: tagOption.color, color: '#000000', border: isSelected ? '2px solid #000000' : `2px solid ${tagOption.color}` }}> {tagOption.label} {isSelected ? '✓' : ''} </button> );
                            })}
                          </div>
                        )}
                        {filterType === 'Data' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-estilizado" style={{ flexGrow: 1, height: '38px' }} />
                            {dateFilter && (<button type="button" onClick={() => setDateFilter('')} title="Limpar data" className="botao-limpar-data-mini"> <X size={16} /> </button>)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {(searchTerm || selectedFilterTags.length > 0 || statusFilter !== 'todos' || dateFilter) && (
                  <div style={{padding: '0.75rem', borderTop: '1px solid var(--input-border, #374151)', marginTop: '0.5rem' }}>
                    <button onClick={clearAllFilters} className="botao-limpar-filtros" style={{width: '100%', padding: '0.5rem'}}>Limpar Todos os Filtros</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {tasksToDisplay.length === 0 ? (
          <p className="tarefa-descricao">
            {currentUser && (searchTerm || selectedFilterTags.length > 0 || statusFilter !== 'todos' || dateFilter) ? `Nenhuma tarefa corresponde aos critérios para ${currentUser}.` : `Nenhuma tarefa para ${currentUser} ainda.`}
          </p>
        ) : (
          tasksToDisplay.map((task) => (
            <TaskCard
              key={task.id} id={task.id} title={task.title} description={task.description}
              completed={task.completed} creationDate={task.creationDate}
              comments={task.comments} tags={task.tags || []}
              onToggle={toggleTaskStatus} onRemove={removeTask} onEdit={editTask} onAddComment={addComment}
            />
          ))
        )}
      </section>
    </main>
  );
}