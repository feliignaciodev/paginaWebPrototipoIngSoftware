import { useEffect, useState } from 'react';
import {
  Route,
  User,
  MapPin,
  Calendar,
  Waves,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Navigation,
} from 'lucide-react';
import api from '../services/api';

const estadoBadge = {
  pendiente:   'bg-amber-100 text-amber-800',
  en_progreso: 'bg-sky-100 text-sky-800',
};
const estadoLabel = {
  pendiente:   'Pendiente',
  en_progreso: 'En Progreso',
};
const tipoAguaLabel = {
  dulce:       'Dulce',
  salada:      'Salada',
  climatizada: 'Climatizada',
};

function urgencia(fechaStr) {
  const hoy  = new Date();
  const fecha = new Date(fechaStr);
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  const diff = Math.round((fecha - hoy) / 86400000);
  if (diff < 0)  return { label: 'Vencida',  color: 'text-red-600 bg-red-50 border-red-200' };
  if (diff === 0) return { label: 'Hoy',     color: 'text-orange-600 bg-orange-50 border-orange-200' };
  if (diff === 1) return { label: 'Mañana',  color: 'text-amber-600 bg-amber-50 border-amber-200' };
  return { label: `En ${diff} días`, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
}

export default function RutasInteligentes() {
  const [rutas, setRutas]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    api.get('/rutas')
      .then((r) => {
        setRutas(r.data);
        const init = {};
        r.data.forEach((t) => { init[t.tecnico_id] = true; });
        setExpanded(init);
      })
      .catch((err) => setError(err.response?.data?.error || 'Error al cargar las rutas'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-12">{error}</p>;
  }

  const totalVisitas = rutas.reduce((s, t) => s + t.visitas.length, 0);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <Navigation className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Rutas Inteligentes</h2>
        </div>
        <p className="text-sm text-gray-500 ml-9">
          Visitas pendientes organizadas por técnico · orden óptimo por fecha
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="bg-primary-600 p-3 rounded-xl text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Técnicos con rutas</p>
            <p className="text-2xl font-bold text-gray-900">{rutas.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="bg-accent-500 p-3 rounded-xl text-white">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Visitas programadas</p>
            <p className="text-2xl font-bold text-gray-900">{totalVisitas}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-xl text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">En progreso ahora</p>
            <p className="text-2xl font-bold text-gray-900">
              {rutas.reduce((s, t) => s + t.visitas.filter((v) => v.estado === 'en_progreso').length, 0)}
            </p>
          </div>
        </div>
      </div>

      {rutas.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay visitas pendientes</p>
          <p className="text-sm text-gray-400 mt-1">Todas las mantenciones están al día</p>
        </div>
      )}

      {/* Ruta por técnico */}
      {rutas.map((tecnico, ti) => (
        <div
          key={tecnico.tecnico_id}
          className={`bg-white rounded-xl border border-gray-100 shadow-sm animate-fade-in-up stagger-${(ti % 4) + 1}`}
        >
          {/* Header del técnico */}
          <button
            onClick={() => toggle(tecnico.tecnico_id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-t-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                {tecnico.tecnico_nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{tecnico.tecnico_nombre}</p>
                <p className="text-xs text-gray-400">{tecnico.visitas.length} parada{tecnico.visitas.length !== 1 ? 's' : ''} en ruta</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {tecnico.visitas.filter((v) => v.estado === 'en_progreso').length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                    {tecnico.visitas.filter((v) => v.estado === 'en_progreso').length} en progreso
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {tecnico.visitas.filter((v) => v.estado === 'pendiente').length} pendientes
                </span>
              </div>
              {expanded[tecnico.tecnico_id]
                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </button>

          {/* Paradas */}
          {expanded[tecnico.tecnico_id] && (
            <div className="px-6 pb-6">
              <div className="relative">
                {/* Línea de ruta */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />

                <div className="space-y-4">
                  {tecnico.visitas.map((v) => {
                    const urg = urgencia(v.fecha_programada);
                    return (
                      <div key={v.visita_id} className="relative pl-12">
                        {/* Nodo de parada */}
                        <div className={`absolute left-2 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                          v.estado === 'en_progreso'
                            ? 'bg-sky-500 border-sky-500 text-white'
                            : 'bg-white border-primary-400 text-primary-600'
                        }`}>
                          {v.orden}
                        </div>

                        <div className={`bg-slate-50 rounded-xl p-4 border ${
                          v.estado === 'en_progreso' ? 'border-sky-200 bg-sky-50/50' : 'border-gray-100'
                        }`}>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{v.cliente_nombre}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                <span>{v.ubicacion_detallada}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${estadoBadge[v.estado]}`}>
                              {estadoLabel[v.estado]}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(v.fecha_programada).toLocaleDateString('es-CL', {
                                weekday: 'short', day: 'numeric', month: 'short',
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(v.fecha_programada).toLocaleTimeString('es-CL', {
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Waves className="w-3 h-3" />
                              {tipoAguaLabel[v.tipo_agua]} · {Number(v.capacidad_litros).toLocaleString('es-CL')} L
                            </span>
                            <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${urg.color}`}>
                              {urg.label}
                            </span>
                          </div>

                          {v.notas && (
                            <p className="mt-2 text-xs text-gray-400 italic border-t border-gray-100 pt-2">
                              {v.notas}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
