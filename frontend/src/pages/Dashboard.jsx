import { useEffect, useState } from 'react';
import { Users, Waves, CalendarCheck, Package } from 'lucide-react';
import api from '../services/api';

const statCards = [
  { key: 'clientes', label: 'Clientes', icon: Users, color: 'bg-blue-500' },
  { key: 'piscinas', label: 'Piscinas', icon: Waves, color: 'bg-cyan-500' },
  { key: 'visitas', label: 'Visitas', icon: CalendarCheck, color: 'bg-amber-500' },
  { key: 'inventario', label: 'Insumos', icon: Package, color: 'bg-emerald-500' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({
    clientes: 0,
    piscinas: 0,
    visitas: 0,
    inventario: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/clientes'),
      api.get('/piscinas'),
      api.get('/visitas'),
      api.get('/inventario'),
    ])
      .then(([c, p, v, i]) => {
        setCounts({
          clientes: c.data.length,
          piscinas: p.data.length,
          visitas: v.data.length,
          inventario: i.data.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4"
            >
              <div className={`${color} p-3 rounded-lg text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{counts[key]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
