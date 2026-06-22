import { useEffect, useState } from 'react';
import {
  Waves,
  CalendarCheck,
  AlertTriangle,
  FlaskConical,
  Clock,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';

const STOCK_MIN_THRESHOLD = 1.5;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/piscinas'),
      api.get('/visitas'),
      api.get('/inventario'),
    ])
      .then(([piscinas, visitas, inventario]) => {
        const piscinasActivas = piscinas.data.filter((p) => p.activa);
        const visitasPendientes = visitas.data.filter(
          (v) => v.estado === 'pendiente'
        );
        const visitasEnProgreso = visitas.data.filter(
          (v) => v.estado === 'en_progreso'
        );
        const alertasStock = inventario.data.filter(
          (i) =>
            parseFloat(i.stock_actual) <=
            parseFloat(i.stock_minimo) * STOCK_MIN_THRESHOLD
        );

        setStats({
          piscinasActivas: piscinasActivas.length,
          piscinasTotal: piscinas.data.length,
          visitasPendientes: visitasPendientes.length,
          visitasEnProgreso: visitasEnProgreso.length,
          visitasRecientes: visitas.data.slice(0, 5),
          alertasStock,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="text-gray-500">No se pudieron cargar los datos.</p>
    );
  }

  const cards = [
    {
      label: 'Piscinas Activas',
      value: stats.piscinasActivas,
      sub: `de ${stats.piscinasTotal} totales`,
      icon: Waves,
      iconBg: 'bg-primary-600',
      glow: false,
    },
    {
      label: 'Visitas Pendientes',
      value: stats.visitasPendientes,
      sub: 'programadas hoy o próximas',
      icon: CalendarCheck,
      iconBg: 'bg-accent-500',
      glow: stats.visitasPendientes > 0,
    },
    {
      label: 'En Progreso',
      value: stats.visitasEnProgreso,
      sub: 'técnicos en terreno',
      icon: Clock,
      iconBg: 'bg-amber-500',
      glow: false,
    },
    {
      label: 'Alertas Químicos',
      value: stats.alertasStock.length,
      sub: 'insumos con stock bajo',
      icon: AlertTriangle,
      iconBg:
        stats.alertasStock.length > 0 ? 'bg-red-500' : 'bg-emerald-500',
      glow: stats.alertasStock.length > 0,
    },
  ];

  const estadoBadge = {
    pendiente: 'bg-amber-100 text-amber-800',
    en_progreso: 'bg-primary-100 text-primary-800',
    completada: 'bg-emerald-100 text-emerald-800',
  };

  const estadoLabel = {
    pendiente: 'Pendiente',
    en_progreso: 'En Progreso',
    completada: 'Completada',
  };

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Resumen general del sistema
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, sub, icon: Icon, iconBg, glow }, i) => (
          <div
            key={label}
            className={`card-hover animate-fade-in-up stagger-${i + 1} bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4`}
          >
            <div
              className={`${iconBg} p-3 rounded-xl text-white shrink-0 ${glow ? 'animate-pulse-glow' : ''}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 animate-count-up">
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in-up stagger-5">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">
              Últimas Visitas
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.visitasRecientes.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-400">
                Sin visitas registradas
              </p>
            ) : (
              stats.visitasRecientes.map((v) => (
                <div
                  key={v.id}
                  className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {v.cliente_nombre || `Piscina #${v.piscina_id}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {v.tecnico_nombre || `Técnico #${v.tecnico_id}`}
                      {' · '}
                      {new Date(v.fecha_programada).toLocaleDateString(
                        'es-CL'
                      )}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadge[v.estado]}`}
                  >
                    {estadoLabel[v.estado]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel de alertas de stock */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in-up stagger-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">
              Alertas de Insumos
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.alertasStock.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-3">
                  <FlaskConical className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-500">
                  Todos los insumos con stock normal
                </p>
              </div>
            ) : (
              stats.alertasStock.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.nombre_quimico}
                    </p>
                    <p className="text-xs text-gray-400">
                      Mín: {item.stock_minimo} {item.unidad_medida}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {item.stock_actual} {item.unidad_medida}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
