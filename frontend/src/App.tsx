import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import './styles/main.css';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  comments: { text: string; date: string }[];
}

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(`${API_URL}/tarefas`);
      const data = await res.json();

      const loadedTasks = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.status === 'concluída',
        comments: task.comments || [],
      }));

      setTasks(loadedTasks);
    };

    fetchTasks();
  }, []);

  const addTask = async (title: string, description: string) => {
    const response = await fetch(`${API_URL}/tarefas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    const newTask = await response.json();
    setTasks([
      ...tasks,
      {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        completed: newTask.status === 'concluída',
        comments: newTask.comments || [],
      },
    ]);
  };

  const removeTask = async (id: string) => {
    await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'DELETE',
    });

    setTasks(tasks.filter((task) => task.id !== id));
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
    newDescription: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });

      if (!response.ok) {
        throw new Error('Erro ao editar tarefa');
      }

      setTasks(
        tasks.map((t) =>
          t.id === id
            ? { ...t, title: newTitle, description: newDescription }
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

  return (
    <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <TaskForm onAdd={addTask} />

      <section style={{ marginTop: '2rem' }}>
        <h2 className="tarefa-titulo" style={{ marginBottom: '1rem' }}>
          Suas Tarefas
        </h2>

        {tasks.length === 0 ? (
          <p className="tarefa-descricao">
            Nenhuma tarefa adicionada ainda.
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              completed={task.completed}
              comments={task.comments}
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
