import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Waves,
  ArrowLeft,
  CalendarCheck,
  FlaskConical,
  DollarSign,
  User,
  Droplets,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import api from '../services/api';

const formatCLP = (n) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);

const estadoBadge = {
  pendiente: 'bg-amber-100 text-amber-800',
  en_progreso: 'bg-sky-100 text-sky-800',
  completada: 'bg-emerald-100 text-emerald-800',
};

const estadoLabel = {
  pendiente: 'Pendiente',
  en_progreso: 'En Progreso',
  completada: 'Completada',
};

const tipoAguaLabel = {
  dulce: 'Dulce',
  salada: 'Salada',
  climatizada: 'Climatizada',
};

export default function ResumenPiscina() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVisita, setExpandedVisita] = useState(null);

  useEffect(() => {
    api
      .get(`/resumen/piscinas/${id}`)
      .then((r) => setData(r.data))
      .catch((err) =>
        setError(err.response?.data?.error || 'Error al cargar el resumen')
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/piscinas" className="text-primary-600 hover:underline">
          Volver a piscinas
        </Link>
      </div>
    );
  }

  const { piscina, visitas, totales } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/piscinas"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Resumen de Piscina
          </h2>
          <p className="text-sm text-gray-500">{piscina.cliente_nombre}</p>
        </div>
      </div>

      {/* Info piscina */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary-600 p-3 rounded-xl text-white">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {piscina.ubicacion_detallada}
            </h3>
            <p className="text-sm text-gray-500">
              Piscina #{piscina.id}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Capacidad</p>
            <p className="text-lg font-bold text-gray-900">
              {Number(piscina.capacidad_litros).toLocaleString('es-CL')} L
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Tipo de agua</p>
            <p className="text-lg font-bold text-gray-900">
              {tipoAguaLabel[piscina.tipo_agua]}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Estado</p>
            <p className="text-lg font-bold text-emerald-600">
              {piscina.activa ? 'Activa' : 'Inactiva'}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Cliente</p>
            <p className="text-lg font-bold text-gray-900 truncate">
              {piscina.cliente_nombre}
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de totales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up stagger-2">
        <div className="card-hover bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="bg-accent-500 p-3 rounded-xl text-white">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Visitas realizadas</p>
            <p className="text-2xl font-bold text-gray-900">
              {totales.visitas_realizadas}
            </p>
          </div>
        </div>
        <div className="card-hover bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-xl text-white">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Visitas pendientes</p>
            <p className="text-2xl font-bold text-gray-900">
              {totales.visitas_pendientes}
            </p>
          </div>
        </div>
        <div className="card-hover bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="bg-primary-700 p-3 rounded-xl text-white">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Costo total insumos</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCLP(totales.costo_total)}
            </p>
          </div>
        </div>
      </div>

      {/* Historial de visitas con insumos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in-up stagger-3">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            Historial de visitas e insumos
          </h3>
        </div>

        {visitas.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-400">
            Sin visitas registradas para esta piscina
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {visitas.map((v) => {
              const isOpen = expandedVisita === v.id;
              return (
                <div key={v.id}>
                  {/* Fila de visita */}
                  <button
                    onClick={() =>
                      setExpandedVisita(isOpen ? null : v.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(v.fecha_programada).toLocaleDateString(
                            'es-CL',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <User className="w-3.5 h-3.5" />
                          {v.tecnico_nombre}
                        </span>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadge[v.estado]}`}
                        >
                          {estadoLabel[v.estado]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {v.costo_visita > 0 && (
                        <span className="text-sm font-semibold text-primary-700">
                          {formatCLP(v.costo_visita)}
                        </span>
                      )}
                      {v.insumos.length > 0 && (
                        isOpen ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )
                      )}
                    </div>
                  </button>

                  {/* Detalle de insumos expandido */}
                  {isOpen && v.insumos.length > 0 && (
                    <div className="px-6 pb-4">
                      <div className="bg-slate-50 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left px-4 py-2 font-medium text-gray-600">
                                <span className="flex items-center gap-1.5">
                                  <Droplets className="w-3.5 h-3.5 text-accent-500" />
                                  Insumo
                                </span>
                              </th>
                              <th className="text-right px-4 py-2 font-medium text-gray-600">
                                Cantidad
                              </th>
                              <th className="text-right px-4 py-2 font-medium text-gray-600">
                                Precio unit.
                              </th>
                              <th className="text-right px-4 py-2 font-medium text-gray-600">
                                Subtotal
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {v.insumos.map((ins, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-2 text-gray-900">
                                  {ins.nombre_quimico}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-600">
                                  {ins.cantidad_usada} {ins.unidad_medida}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-600">
                                  {formatCLP(ins.precio_unitario_momento)}
                                </td>
                                <td className="px-4 py-2 text-right font-medium text-gray-900">
                                  {formatCLP(ins.subtotal)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gray-200 bg-white">
                              <td
                                colSpan={3}
                                className="px-4 py-2 text-right font-semibold text-gray-700"
                              >
                                Total visita
                              </td>
                              <td className="px-4 py-2 text-right font-bold text-primary-700">
                                {formatCLP(v.costo_visita)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      {v.notas && (
                        <p className="mt-2 text-xs text-gray-500 italic">
                          {v.notas}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
