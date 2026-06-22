import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

const emptyForm = { piscina_id: '', tecnico_id: '', fecha_programada: '', notas: '' };

const estadoBadge = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_progreso: 'bg-blue-100 text-blue-800',
  completada: 'bg-green-100 text-green-800',
};

const estadoLabel = {
  pendiente: 'Pendiente',
  en_progreso: 'En Progreso',
  completada: 'Completada',
};

export default function Visitas() {
  const [items, setItems] = useState([]);
  const [piscinas, setPiscinas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get('/visitas').then((r) => setItems(r.data));
    api.get('/piscinas').then((r) => setPiscinas(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/visitas/${editing}`, { estado: form.estado, notas: form.notas });
    } else {
      await api.post('/visitas', form);
    }
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      piscina_id: item.piscina_id,
      tecnico_id: item.tecnico_id,
      fecha_programada: item.fecha_programada?.slice(0, 16) || '',
      notas: item.notas || '',
      estado: item.estado,
    });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta visita?')) return;
    await api.delete(`/visitas/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Visitas Técnicas</h2>
        <button
          onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Visita
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {!editing && (
            <>
              <select className="border rounded-lg px-3 py-2" required value={form.piscina_id} onChange={(e) => setForm({ ...form, piscina_id: e.target.value })}>
                <option value="">Seleccionar piscina...</option>
                {piscinas.map((p) => <option key={p.id} value={p.id}>{p.cliente_nombre} - {p.ubicacion_detallada}</option>)}
              </select>
              <input className="border rounded-lg px-3 py-2" placeholder="ID Técnico" type="number" min="1" required value={form.tecnico_id} onChange={(e) => setForm({ ...form, tecnico_id: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" type="datetime-local" required value={form.fecha_programada} onChange={(e) => setForm({ ...form, fecha_programada: e.target.value })} />
            </>
          )}
          {editing && (
            <select className="border rounded-lg px-3 py-2" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          )}
          <input className="border rounded-lg px-3 py-2" placeholder="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">{editing ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="border px-6 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Cliente</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Técnico</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Fecha</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Estado</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{item.cliente_nombre}</td>
                <td className="px-6 py-3">{item.tecnico_nombre}</td>
                <td className="px-6 py-3">{new Date(item.fecha_programada).toLocaleString('es-CL')}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[item.estado]}`}>
                    {estadoLabel[item.estado]}
                  </span>
                </td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4 inline" /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay visitas registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
