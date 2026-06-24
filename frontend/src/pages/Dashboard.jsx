import { useEffect, useState } from 'react';
import {
  Waves,
  CalendarCheck,
  AlertTriangle,
  FlaskConical,
  Clock,
  TrendingUp,
  X,
  Droplets,
  MapPin,
  User,
  ShoppingCart,
  ArrowUpCircle,
  Package,
  DollarSign,
} from 'lucide-react';
import api from '../services/api';

const STOCK_MIN_THRESHOLD = 1.5;
const STOCK_RESTOCK_TARGET = 2;
const PLAN_MENSUAL = 55000;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/piscinas'),
      api.get('/visitas'),
      api.get('/inventario'),
    ])
      .then(([piscinas, visitas, inventario]) => {
        const piscinasActivas = piscinas.data.filter((p) => p.activa);
        const piscinasInactivas = piscinas.data.filter((p) => !p.activa);
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
          rawPiscinasActivas: piscinasActivas,
          rawPiscinasInactivas: piscinasInactivas,
          rawVisitasPendientes: visitasPendientes,
          rawVisitasEnProgreso: visitasEnProgreso,
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
      id: 'piscinas',
      label: 'Piscinas Activas',
      value: stats.piscinasActivas,
      sub: `de ${stats.piscinasTotal} totales`,
      icon: Waves,
      iconBg: 'bg-primary-600',
      glow: false,
    },
    {
      id: 'pendientes',
      label: 'Visitas Pendientes',
      value: stats.visitasPendientes,
      sub: 'programadas hoy o próximas',
      icon: CalendarCheck,
      iconBg: 'bg-accent-500',
      glow: stats.visitasPendientes > 0,
    },
    {
      id: 'progreso',
      label: 'En Progreso',
      value: stats.visitasEnProgreso,
      sub: 'técnicos en terreno',
      icon: Clock,
      iconBg: 'bg-amber-500',
      glow: false,
    },
    {
      id: 'alertas',
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
        {cards.map(({ id, label, value, sub, icon: Icon, iconBg, glow }, i) => (
          <div
            key={label}
            onClick={() => setActiveModal(id)}
            className={`card-interactive card-hover animate-fade-in-up stagger-${i + 1} bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4 cursor-pointer select-none`}
          >
            <div
              className={`${iconBg} p-3 rounded-xl text-white shrink-0 ${glow ? 'animate-pulse-glow' : ''}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 card-label">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 animate-count-up card-value">
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-1 card-sub">{sub}</p>
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

      {/* Modal de detalle */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {activeModal === 'piscinas' && 'Piscinas Activas'}
                {activeModal === 'pendientes' && 'Visitas Pendientes'}
                {activeModal === 'progreso' && 'Visitas En Progreso'}
                {activeModal === 'alertas' && 'Alertas de Stock'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-64px)] p-6">
              {activeModal === 'piscinas' && (
                <div className="space-y-3">
                  {stats.rawPiscinasActivas.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No hay piscinas activas</p>
                  ) : (
                    <>
                      {stats.rawPiscinasActivas.map((p) => (
                        <div key={p.id} className="border border-gray-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{p.cliente_nombre}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Activa</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{p.ubicacion_detallada}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Droplets className="w-3.5 h-3.5" />
                              <span>{p.tipo_agua}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Waves className="w-3.5 h-3.5" />
                              <span>{Number(p.capacidad_litros).toLocaleString('es-CL')} litros</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>${PLAN_MENSUAL.toLocaleString('es-CL')}/mes</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="mt-4 pt-4 border-t border-gray-100 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                          <span className="font-semibold text-gray-800">Resumen de ingresos</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Ingreso mensual</p>
                            <p className="text-lg font-bold text-emerald-700">
                              ${(stats.rawPiscinasActivas.length * PLAN_MENSUAL).toLocaleString('es-CL')}
                            </p>
                            <p className="text-xs text-gray-400">
                              {stats.rawPiscinasActivas.length} piscina{stats.rawPiscinasActivas.length !== 1 ? 's' : ''} × ${PLAN_MENSUAL.toLocaleString('es-CL')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Proyección anual</p>
                            <p className="text-lg font-bold text-primary-700">
                              ${(stats.rawPiscinasActivas.length * PLAN_MENSUAL * 12).toLocaleString('es-CL')}
                            </p>
                            <p className="text-xs text-gray-400">Estimado 12 meses</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {stats.rawPiscinasInactivas.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-400 mb-2">
                        {stats.rawPiscinasInactivas.length} piscina(s) inactiva(s)
                      </p>
                      {stats.rawPiscinasInactivas.map((p) => (
                        <div key={p.id} className="border border-gray-100 rounded-xl p-3 mb-2 opacity-60">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{p.cliente_nombre}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Inactiva</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{p.ubicacion_detallada}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeModal === 'pendientes' && (
                <div className="space-y-3">
                  {stats.rawVisitasPendientes.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No hay visitas pendientes</p>
                  ) : (
                    stats.rawVisitasPendientes.map((v) => (
                      <div key={v.id} className="border border-gray-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{v.cliente_nombre}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pendiente</span>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <User className="w-3.5 h-3.5" />
                            <span>Técnico: {v.tecnico_nombre}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <CalendarCheck className="w-3.5 h-3.5" />
                            <span>Programada: {new Date(v.fecha_programada).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{v.piscina_ubicacion}</span>
                          </div>
                          {v.notas && (
                            <p className="text-xs text-gray-400 mt-2 italic bg-gray-50 rounded-lg p-2">
                              {v.notas}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeModal === 'progreso' && (
                <div className="space-y-3">
                  {stats.rawVisitasEnProgreso.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No hay visitas en progreso</p>
                  ) : (
                    stats.rawVisitasEnProgreso.map((v) => (
                      <div key={v.id} className="border border-gray-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{v.cliente_nombre}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">En Progreso</span>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <User className="w-3.5 h-3.5" />
                            <span>Técnico: {v.tecnico_nombre}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <CalendarCheck className="w-3.5 h-3.5" />
                            <span>Inicio: {new Date(v.fecha_programada).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{v.piscina_ubicacion}</span>
                          </div>
                          {v.notas && (
                            <p className="text-xs text-gray-400 mt-2 italic bg-gray-50 rounded-lg p-2">
                              {v.notas}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeModal === 'alertas' && (
                <div className="space-y-3">
                  {stats.alertasStock.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">Todos los insumos tienen stock suficiente</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 mb-4">
                        Insumos con stock por debajo del umbral recomendado ({STOCK_MIN_THRESHOLD}x del mínimo).
                      </p>
                      {stats.alertasStock.map((item) => {
                        const actual = parseFloat(item.stock_actual);
                        const minimo = parseFloat(item.stock_minimo);
                        const objetivo = minimo * STOCK_RESTOCK_TARGET;
                        const necesario = Math.max(0, objetivo - actual);
                        const porcentaje = minimo > 0 ? Math.min(100, (actual / objetivo) * 100) : 0;
                        const costoRestock = necesario * parseFloat(item.precio_unitario || 0);

                        return (
                          <div key={item.id} className="border border-gray-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-gray-900">{item.nombre_quimico}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actual <= minimo ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                {actual <= minimo ? 'Crítico' : 'Bajo'}
                              </span>
                            </div>

                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Stock actual</span>
                                <span>{actual} / {objetivo} {item.unidad_medida}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${actual <= minimo ? 'bg-red-500' : 'bg-amber-400'}`}
                                  style={{ width: `${porcentaje}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs mt-1">
                                <span className="text-gray-400">Mínimo: {minimo} {item.unidad_medida}</span>
                                <span className="text-gray-400">Objetivo: {objetivo} {item.unidad_medida}</span>
                              </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-3 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-sm font-medium text-blue-800">
                                <ShoppingCart className="w-4 h-4" />
                                <span>Recomendación de compra</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-blue-700">
                                <ArrowUpCircle className="w-3.5 h-3.5" />
                                <span>Comprar: <strong>{necesario.toFixed(1)} {item.unidad_medida}</strong></span>
                              </div>
                              {costoRestock > 0 && (
                                <div className="flex items-center gap-1.5 text-sm text-blue-700">
                                  <Package className="w-3.5 h-3.5" />
                                  <span>Costo estimado: <strong>${costoRestock.toLocaleString('es-CL', { minimumFractionDigits: 0 })}</strong></span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">Resumen de compra total</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          ${stats.alertasStock.reduce((sum, item) => {
                            const necesario = Math.max(0, parseFloat(item.stock_minimo) * STOCK_RESTOCK_TARGET - parseFloat(item.stock_actual));
                            return sum + necesario * parseFloat(item.precio_unitario || 0);
                          }, 0).toLocaleString('es-CL', { minimumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Para llevar todos los insumos al nivel objetivo ({STOCK_RESTOCK_TARGET}x del mínimo)</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
