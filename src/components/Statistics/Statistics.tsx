import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface StatisticsData {
  users: number;
  evaluations: number;
  user_manager: number;
  user_admin: number;
  user_employee: number;
  user_active: number;
}

const Statistics = () => {
  const [data, setData] = useState<StatisticsData | null>(null);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_SERVER}/api/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos de estadísticas');
        }

        const result: StatisticsData = await response.json();  
        setData(result);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (!data) {
    return <div>No se pudieron cargar las estadísticas</div>;
  }

  const userRolesData = [
    { name: 'Evaluadores', value: data.user_manager },
    { name: 'Administradores', value: data.user_admin },
    { name: 'Empleados', value: data.user_employee },
  ];

  const userStatusData = [
    { name: 'Activos', value: data.user_active },
    { name: 'Inactivos', value: data.users - data.user_active },
  ];

  const COLORS = ['#003366', '#B0B0B0', '#009688'];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Estadísticas de Evaluaciones</h1>

      <div className="flex space-x-4">
        <div className="bg-gray-50 p-4 rounded shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-center">Usuarios por Rol</h2>
          <BarChart
            width={300}
            height={200}
            data={userRolesData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="#009688"
            >
              {userRolesData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-center">Estado de Usuarios</h2>
          <PieChart width={300} height={200}>
            <Pie
              data={userStatusData}
              cx={150}
              cy={100}
              innerRadius={40}
              outerRadius={70}
              fill="#009688"
              paddingAngle={5}
              dataKey="value"
            >
              {userStatusData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
