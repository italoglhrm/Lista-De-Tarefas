import { BarChart, Bar, XAxis, Cell, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserDashboardProps {
  user: string;
  data: {
    total: number;
    pendentes: number;
    em_andamento: number;
    concluídas: number;
  };
}

export default function UserDashboard({ user, data }: UserDashboardProps) {
  const chartData = [
    { name: 'Pendentes', value: data.pendentes, color: '#FACC15' },
    { name: 'Em Andamento', value: data.em_andamento, color: '#3B82F6' },
    { name: 'Concluídas', value: data.concluídas, color: '#9333EA' },
  ];

  return (
    <section style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <h2 className="tarefa-secao-titulo">Suas Tarefas</h2> </div>
      <div style={{ background: '#111', padding: '1rem', borderRadius: '1rem' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
