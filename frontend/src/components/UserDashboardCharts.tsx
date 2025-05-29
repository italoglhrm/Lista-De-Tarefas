import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

interface UserDashboardProps {
  user: string;
  data: {
    status: { pendentes: number; em_andamento: number; concluídas: number };
    por_dia: { date: string; count: number }[];
    tags_top: { label: string; count: number }[];
  };
}

export default function UserDashboardCharts({ user, data }: UserDashboardProps) {
  const statusData = [
    { name: 'Pendentes', value: data.status?.pendentes || 0, color: '#FACC15' },
    { name: 'Em Andamento', value: data.status?.em_andamento || 0, color: '#3B82F6' },
    { name: 'Concluídas', value: data.status?.concluídas || 0, color: '#9333EA' },
  ];

  const pieColors = ['#9333EA', '#FACC15', '#3B82F6', '#10B981', '#EC4899'];

  return (
    <section style={{ marginTop: '3rem' }}>
      <h3 className="tarefa-secao-titulo" style={{ textAlign: 'center' }}>
        Seu Dashboard
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem', justifyContent: 'center' }}>
        {/* Barras de status */}
        <div style={{ flex: '1 1 320px', background: '#111', padding: '1rem', borderRadius: '1rem' }}>
          <h4>Status</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conclusões por dia */}
        <div style={{ flex: '1 1 320px', background: '#111', padding: '1rem', borderRadius: '1rem' }}>
          <h4>Conclusões por Dia</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.por_dia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#9333EA" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Pizza com legenda */}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '2.5rem', gap: '2rem', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 320px', background: '#111', padding: '1rem', borderRadius: '1rem' }}>
          <h4>Tags mais usadas</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.tags_top}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                label={({ name }) => name}
              >
                {data.tags_top.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
