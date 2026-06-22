import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

const emptyForm = { cliente_id: '', capacidad_litros: '', tipo_agua: 'dulce', ubicacion_detallada: '' };

export default function Piscinas() {
  const [items, setItems] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get('/piscinas').then((r) => setItems(r.data));
    api.get('/clientes').then((r) => setClientes(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/piscinas/${editing}`, form);
    } else {
      await api.post('/piscinas', form);
    }
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      cliente_id: item.cliente_id,
      capacidad_litros: item.capacidad_litros,
      tipo_agua: item.tipo_agua,
      ubicacion_detallada: item.ubicacion_detallada || '',
    });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta piscina?')) return;
    await api.delete(`/piscinas/${id}`);
    load();
  };

  const tipoLabel = { dulce: 'Dulce', salada: 'Salada', climatizada: 'Climatizada' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Piscinas</h2>
        <button
          onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Piscina
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="border rounded-lg px-3 py-2" required value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}>
            <option value="">Seleccionar cliente...</option>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre_empresa}</option>)}
          </select>
          <input className="border rounded-lg px-3 py-2" placeholder="Capacidad (litros)" type="number" min="1" required value={form.capacidad_litros} onChange={(e) => setForm({ ...form, capacidad_litros: e.target.value })} />
          <select className="border rounded-lg px-3 py-2" value={form.tipo_agua} onChange={(e) => setForm({ ...form, tipo_agua: e.target.value })}>
            <option value="dulce">Dulce</option>
            <option value="salada">Salada</option>
            <option value="climatizada">Climatizada</option>
          </select>
          <input className="border rounded-lg px-3 py-2" placeholder="Ubicación detallada" value={form.ubicacion_detallada} onChange={(e) => setForm({ ...form, ubicacion_detallada: e.target.value })} />
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
              <th className="text-left px-6 py-3 font-medium text-gray-600">Capacidad (L)</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Tipo Agua</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Ubicación</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{item.cliente_nombre}</td>
                <td className="px-6 py-3">{Number(item.capacidad_litros).toLocaleString('es-CL')}</td>
                <td className="px-6 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">{tipoLabel[item.tipo_agua]}</span>
                </td>
                <td className="px-6 py-3">{item.ubicacion_detallada}</td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4 inline" /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay piscinas registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
