import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

const emptyForm = { nombre_empresa: '', telefono: '', direccion: '', correo_contacto: '' };

export default function Clientes() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/clientes').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/clientes/${editing}`, form);
    } else {
      await api.post('/clientes', form);
    }
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      nombre_empresa: item.nombre_empresa,
      telefono: item.telefono || '',
      direccion: item.direccion || '',
      correo_contacto: item.correo_contacto || '',
    });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    await api.delete(`/clientes/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <button
          onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded-lg px-3 py-2" placeholder="Nombre empresa / persona" required value={form.nombre_empresa} onChange={(e) => setForm({ ...form, nombre_empresa: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Correo de contacto" type="email" value={form.correo_contacto} onChange={(e) => setForm({ ...form, correo_contacto: e.target.value })} />
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
              <th className="text-left px-6 py-3 font-medium text-gray-600">Nombre</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Teléfono</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Dirección</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Correo</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{item.nombre_empresa}</td>
                <td className="px-6 py-3">{item.telefono}</td>
                <td className="px-6 py-3">{item.direccion}</td>
                <td className="px-6 py-3">{item.correo_contacto}</td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4 inline" /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay clientes registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
