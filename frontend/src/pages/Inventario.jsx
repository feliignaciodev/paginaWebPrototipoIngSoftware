import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const emptyForm = { nombre_quimico: '', stock_actual: '', unidad_medida: '', stock_minimo: '' };

export default function Inventario() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/inventario').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/inventario/${editing}`, form);
    } else {
      await api.post('/inventario', form);
    }
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      nombre_quimico: item.nombre_quimico,
      stock_actual: item.stock_actual,
      unidad_medida: item.unidad_medida,
      stock_minimo: item.stock_minimo,
    });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este insumo?')) return;
    await api.delete(`/inventario/${id}`);
    load();
  };

  const isLowStock = (item) => Number(item.stock_actual) <= Number(item.stock_minimo);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Inventario de Insumos</h2>
        <button
          onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Insumo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded-lg px-3 py-2" placeholder="Nombre químico" required value={form.nombre_quimico} onChange={(e) => setForm({ ...form, nombre_quimico: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Stock actual" type="number" min="0" step="0.01" required value={form.stock_actual} onChange={(e) => setForm({ ...form, stock_actual: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Unidad de medida (kg, litros...)" required value={form.unidad_medida} onChange={(e) => setForm({ ...form, unidad_medida: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Stock mínimo" type="number" min="0" step="0.01" value={form.stock_minimo} onChange={(e) => setForm({ ...form, stock_minimo: e.target.value })} />
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
              <th className="text-left px-6 py-3 font-medium text-gray-600">Insumo</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Stock</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Unidad</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Mínimo</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${isLowStock(item) ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-3 font-medium flex items-center gap-2">
                  {isLowStock(item) && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {item.nombre_quimico}
                </td>
                <td className="px-6 py-3">{Number(item.stock_actual).toLocaleString('es-CL')}</td>
                <td className="px-6 py-3">{item.unidad_medida}</td>
                <td className="px-6 py-3">{Number(item.stock_minimo).toLocaleString('es-CL')}</td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4 inline" /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay insumos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
