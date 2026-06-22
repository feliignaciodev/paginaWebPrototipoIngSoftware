import { useState, useEffect } from 'react';
import {
  Droplets,
  FlaskConical,
  Gauge,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Send,
} from 'lucide-react';
import api from '../services/api';

const initialForm = {
  visita_id: '',
  ph: '',
  cloro: '',
  nivel_agua: '',
  observaciones: '',
};

export default function FormularioReporte() {
  const [form, setForm] = useState(initialForm);
  const [visitas, setVisitas] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api
      .get('/visitas')
      .then((r) => setVisitas(r.data.filter((v) => v.estado !== 'completada')))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await api.post('/reportes', {
        visita_id: Number(form.visita_id),
        ph: parseFloat(form.ph),
        cloro: parseFloat(form.cloro),
        nivel_agua: form.nivel_agua,
        observaciones: form.observaciones || null,
      });

      setStatus('success');
      setForm(initialForm);
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err.response?.data?.error ||
          err.message ||
          'Error al enviar el reporte'
      );
    }
  };

  const inputBase =
    'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900">
          Reporte de Calidad
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Registre los parámetros de la visita técnica
        </p>
      </div>

      {/* Banner de error */}
      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 animate-[fadeIn_0.2s_ease-out]">
          <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Error al enviar el reporte
            </p>
            <p className="text-sm text-red-600 mt-0.5">{errorMsg}</p>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner de éxito */}
      {status === 'success' && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-semibold text-emerald-800">
            Reporte enviado correctamente
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5 animate-fade-in-up stagger-1"
      >
        {/* Visita */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <FileText className="w-4 h-4 text-primary-600" />
            Visita Técnica
          </label>
          <select
            name="visita_id"
            value={form.visita_id}
            onChange={handleChange}
            required
            className={inputBase}
          >
            <option value="">Seleccione una visita...</option>
            {visitas.map((v) => (
              <option key={v.id} value={v.id}>
                #{v.id} — {v.cliente_nombre || `Piscina #${v.piscina_id}`}{' '}
                ({new Date(v.fecha_programada).toLocaleDateString('es-CL')})
              </option>
            ))}
          </select>
        </div>

        {/* pH y Cloro en grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Droplets className="w-4 h-4 text-accent-500" />
              pH
            </label>
            <input
              type="number"
              name="ph"
              value={form.ph}
              onChange={handleChange}
              required
              min="0"
              max="14"
              step="0.01"
              placeholder="Ej: 7.20"
              className={inputBase}
            />
            <p className="text-xs text-gray-400 mt-1">Rango válido: 0 – 14</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <FlaskConical className="w-4 h-4 text-accent-500" />
              Cloro (ppm)
            </label>
            <input
              type="number"
              name="cloro"
              value={form.cloro}
              onChange={handleChange}
              required
              min="0"
              step="0.001"
              placeholder="Ej: 1.500"
              className={inputBase}
            />
            <p className="text-xs text-gray-400 mt-1">Partes por millón</p>
          </div>
        </div>

        {/* Nivel de agua */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <Gauge className="w-4 h-4 text-primary-600" />
            Nivel de Agua
          </label>
          <select
            name="nivel_agua"
            value={form.nivel_agua}
            onChange={handleChange}
            required
            className={inputBase}
          >
            <option value="">Seleccione nivel...</option>
            <option value="normal">Normal</option>
            <option value="bajo">Bajo</option>
            <option value="alto">Alto</option>
            <option value="critico">Crítico</option>
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <FileText className="w-4 h-4 text-gray-400" />
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            rows={3}
            placeholder="Notas adicionales sobre el estado de la piscina..."
            className={`${inputBase} resize-none`}
          />
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar Reporte
            </>
          )}
        </button>
      </form>
    </div>
  );
}
