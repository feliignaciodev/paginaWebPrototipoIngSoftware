import { useEffect, useState } from 'react';
import {
  Waves,
  DollarSign,
  CalendarCheck,
  ArrowUpCircle,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Loader2,
  X,
  LogOut,
  ChevronRight,
  Droplets,
  Zap,
  Star,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const TIPO_AGUA = { dulce: 'Dulce', salada: 'Salada', climatizada: 'Climatizada' };

const PLAN_ICONS = { basico: Droplets, estandar: Zap, premium: Star };

function formatCLP(n) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function PortalCliente() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [modal, setModal]         = useState(null); // 'anomalia' | 'mantencion' | 'plan'
  const [piscinaId, setPiscinaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/portal')
      .then((r) => setData(r.data))
      .catch((err) => setError(err.response?.data?.error || 'Error al cargar el portal'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const openModal = (tipo, pid = '') => {
    setModal(tipo);
    setPiscinaId(pid || data?.piscinas?.[0]?.id?.toString() || '');
    setDescripcion('');
    setSuccess('');
  };

  const handleSolicitud = async (tipo) => {
    if (!descripcion.trim() || !piscinaId) return;
    setSubmitting(true);
    try {
      await api.post('/portal/solicitud', {
        tipo,
        descripcion: descripcion.trim(),
        piscina_id: Number(piscinaId),
      });
      setSuccess(tipo === 'anomalia'
        ? 'Anomalía reportada. Te contactaremos pronto.'
        : 'Solicitud enviada. Coordinaremos una visita en los próximos días.');
      setDescripcion('');
    } catch (err) {
      setSuccess('Error: ' + (err.response?.data?.error || 'Intente nuevamente'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const { cliente, piscinas, planes, plan_actual, costo_mensual } = data;
  const piscinasActivas = piscinas.filter((p) => p.activa);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <h1 className="text-base font-bold text-gray-900">PoolTech</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Mi Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.nombre}</p>
              <p className="text-xs text-gray-400">Cliente</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Bienvenida */}
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {cliente.nombre_empresa}</h2>
          <p className="text-gray-500 mt-1">Aquí puedes ver tus piscinas y gestionar tu servicio de mantención.</p>
        </div>

        {/* Resumen de plan */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-6 text-white animate-fade-in-up shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-200 text-sm font-medium">Tu plan actual</p>
              <h3 className="text-3xl font-bold mt-1">{plan_actual.nombre}</h3>
              <p className="text-primary-200 text-sm mt-1">{plan_actual.descripcion} · {piscinasActivas.length} piscina{piscinasActivas.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-primary-200 text-sm">Mensualidad total</p>
              <p className="text-3xl font-bold">{formatCLP(costo_mensual)}</p>
              <p className="text-primary-200 text-xs mt-0.5">{formatCLP(55000)}/piscina</p>
            </div>
          </div>
          <button
            onClick={() => setModal('plan')}
            className="mt-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowUpCircle className="w-4 h-4" />
            Mejorar mi plan
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Piscinas */}
        <div className="animate-fade-in-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mis piscinas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {piscinas.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-primary-100 p-2.5 rounded-xl">
                    <Waves className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.activa ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{p.ubicacion_detallada}</h4>
                <p className="text-xs text-gray-400 mb-3">
                  {TIPO_AGUA[p.tipo_agua]} · {Number(p.capacidad_litros).toLocaleString('es-CL')} litros
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Realizadas</p>
                    <p className="text-base font-bold text-gray-900">{p.visitas_realizadas}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Pendientes</p>
                    <p className="text-base font-bold text-gray-900">{p.visitas_pendientes}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Mensualidad</p>
                    <p className="text-xs font-bold text-emerald-700">$55.000</p>
                  </div>
                </div>
                {p.proxima_visita && (
                  <div className="flex items-center gap-1.5 text-xs text-primary-600 bg-primary-50 rounded-lg px-3 py-2 mb-3">
                    <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                    Próxima visita: {new Date(p.proxima_visita).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal('anomalia', p.id.toString())}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Anomalía
                  </button>
                  <button
                    onClick={() => openModal('mantencion', p.id.toString())}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Mantención
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Anomalía */}
      {modal === 'anomalia' && (
        <Modal title="Reportar anomalía" onClose={() => setModal(null)}>
          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">{success}</p>
              <button onClick={() => setModal(null)} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
                Cerrar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Piscina afectada</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  value={piscinaId}
                  onChange={(e) => setPiscinaId(e.target.value)}
                >
                  {piscinas.map((p) => (
                    <option key={p.id} value={p.id}>{p.ubicacion_detallada}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Describe la anomalía</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                  rows={4}
                  placeholder="Ej: El agua tiene color verde, la bomba hace ruido extraño, el pH está fuera de rango..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSolicitud('anomalia')}
                  disabled={submitting || !descripcion.trim()}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  {submitting ? 'Enviando...' : 'Reportar anomalía'}
                </button>
                <button onClick={() => setModal(null)} className="border border-gray-200 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Modal Mantención Extraordinaria */}
      {modal === 'mantencion' && (
        <Modal title="Solicitar mantención extraordinaria" onClose={() => setModal(null)}>
          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">{success}</p>
              <button onClick={() => setModal(null)} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
                Cerrar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Piscina</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  value={piscinaId}
                  onChange={(e) => setPiscinaId(e.target.value)}
                >
                  {piscinas.map((p) => (
                    <option key={p.id} value={p.id}>{p.ubicacion_detallada}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Motivo de la solicitud</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                  rows={4}
                  placeholder="Ej: Evento especial el próximo fin de semana, necesito la piscina en óptimas condiciones..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 bg-slate-50 rounded-lg p-3">
                La mantención extraordinaria puede tener un costo adicional dependiendo del servicio requerido. Te contactaremos para confirmar.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSolicitud('mantencion_extraordinaria')}
                  disabled={submitting || !descripcion.trim()}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  {submitting ? 'Enviando...' : 'Enviar solicitud'}
                </button>
                <button onClick={() => setModal(null)} className="border border-gray-200 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Modal Mejorar Plan */}
      {modal === 'plan' && (
        <Modal title="Mejorar mi plan" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Elige un plan que se ajuste mejor a tus necesidades.</p>
            {data.planes.map((plan) => {
              const Icon = PLAN_ICONS[plan.id] ?? Droplets;
              const isActual = plan.id === plan_actual.id;
              return (
                <div
                  key={plan.id}
                  className={`border-2 rounded-xl p-4 transition-all ${isActual ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-primary-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActual ? 'bg-primary-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-4 h-4 ${isActual ? 'text-primary-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{plan.nombre}</p>
                        <p className="text-xs text-gray-400">{plan.descripcion}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCLP(plan.precio)}</p>
                      <p className="text-xs text-gray-400">por piscina/mes</p>
                    </div>
                  </div>
                  {isActual ? (
                    <p className="mt-2 text-xs text-primary-600 font-medium">Plan actual</p>
                  ) : (
                    <button className="mt-2 w-full text-xs text-primary-600 hover:text-primary-700 font-medium text-left">
                      Solicitar upgrade → Contactar a PoolTech
                    </button>
                  )}
                </div>
              );
            })}
            <p className="text-xs text-gray-400 text-center pt-2">
              Para cambiar de plan contáctanos a <span className="text-primary-600">contacto@pooltech.cl</span>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
