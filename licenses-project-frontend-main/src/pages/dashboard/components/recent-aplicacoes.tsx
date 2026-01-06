import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useGetAplicacoesPaginated } from '@/pages/application/aplicacoes/queries/aplicacoes-queries';
import { format, parseISO, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function RecentAplicacoes() {
  const { data: aplicacoesResponse, isLoading } = useGetAplicacoesPaginated(
    1,
    100,
    null,
    null
  );
  const aplicacoes = aplicacoesResponse?.info?.data || [];

  if (isLoading) return <div>Loading...</div>;

  // Process data to show applications created in the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const processedData = last7Days.map((date) => {
    const count = aplicacoes.filter(
      (app) => format(parseISO(app.createdOn), 'yyyy-MM-dd') === date
    ).length;

    return {
      date: format(parseISO(date), 'd MMM', { locale: ptBR }),
      quantidade: count
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#888888" fontSize={12} />
          <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="quantidade"
            name="Novas Aplicações"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ fill: '#4ade80' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
