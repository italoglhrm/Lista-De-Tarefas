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
    tempo_medio_conclusao: number;
    taxa_conclusao_semanal: number;
  };
}

export default function UserDashboardCharts({ user, data }: UserDashboardProps) {
  const status = data?.status || {};
  const statusData = [
    { name: 'Pendentes', value: status.pendentes ?? 0, color: '#FACC15' },
    { name: 'Em Andamento', value: status.em_andamento ?? 0, color: '#3B82F6' },
    { name: 'Concluídas', value: status.concluídas ?? 0, color: '#9333EA' },
  ];

  const pieColors = ['#9333EA', '#FACC15', '#3B82F6', '#10B981', '#EC4899'];

  return (
    <section style={{ marginTop: '3rem' }}>
      <h3 className="tarefa-secao-titulo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        Seu Dashboard
      </h3>

      {/* Indicadores de produtividade */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '1rem', minWidth: '220px' }}>
          <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>Tempo médio de conclusão</p>
          <h4 style={{ fontSize: '1.5rem', margin: 0 }}>{data.tempo_medio_conclusao} dias</h4>
        </div>
        <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '1rem', minWidth: '220px' }}>
          <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>Taxa de conclusão semanal</p>
          <h4 style={{ fontSize: '1.5rem', margin: 0 }}>{data.taxa_conclusao_semanal} tarefas/dia</h4>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
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

        {/* Conclusões por data */}
        <div style={{ flex: '1 1 320px', background: '#111', padding: '1rem', borderRadius: '1rem' }}>
          <h4>Por Data</h4>
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
