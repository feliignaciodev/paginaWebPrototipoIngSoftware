import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Droplets,
  Circle,
  Package,
  X,
} from 'lucide-react';
import api from '../services/api';

const emptyForm = {
  nombre_quimico: '',
  stock_actual: '',
  unidad_medida: 'kg',
  stock_minimo: '',
  precio_unitario: '',
};

const UNIDADES = [
  { value: 'kg', label: 'Kilogramos (kg)', tipo: 'solido' },
  { value: 'litros', label: 'Litros (lt)', tipo: 'liquido' },
  { value: 'unidades', label: 'Unidades (un)', tipo: 'solido' },
  { value: 'gramos', label: 'Gramos (g)', tipo: 'solido' },
  { value: 'ml', label: 'Mililitros (ml)', tipo: 'liquido' },
];

function getTipo(unidad) {
  const found = UNIDADES.find((u) => u.value === unidad);
  return found ? found.tipo : 'solido';
}

function TipoIcon({ unidad, size = 'normal' }) {
  const tipo = getTipo(unidad);
  const sizeClass = size === 'small' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

  if (tipo === 'liquido') {
    return (
      <div className={`${sizeClass} rounded-lg bg-blue-100 flex items-center justify-center shrink-0`}>
        <Droplets className={`${iconSize} text-blue-600`} />
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-lg bg-amber-100 flex items-center justify-center shrink-0`}>
      <Circle className={`${iconSize} text-amber-600`} />
    </div>
  );
}

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
      precio_unitario: item.precio_unitario || '',
    });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este insumo?')) return;
    await api.delete(`/inventario/${id}`);
    load();
  };

  const getStockStatus = (item) => {
    const actual = Number(item.stock_actual);
    const minimo = Number(item.stock_minimo);
    if (actual <= minimo) return 'critico';
    if (actual <= minimo * 1.5) return 'bajo';
    return 'normal';
  };

  const stockStatusConfig = {
    critico: { label: 'Crítico', badge: 'bg-red-100 text-red-700', bar: 'bg-red-500' },
    bajo: { label: 'Bajo', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400' },
    normal: { label: 'Normal', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario de Insumos</h2>
          <p className="text-sm text-gray-500 mt-1">Control de stock de productos químicos</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Insumo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border animate-fade-in-up">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">
              {editing ? 'Editar Insumo' : 'Nuevo Insumo'}
            </h3>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Nombre del producto</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                placeholder="Ej: Cloro granulado"
                required
                value={form.nombre_quimico}
                onChange={(e) => setForm({ ...form, nombre_quimico: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Unidad de medida</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 bg-white"
                value={form.unidad_medida}
                onChange={(e) => setForm({ ...form, unidad_medida: e.target.value })}
              >
                {UNIDADES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                {getTipo(form.unidad_medida) === 'liquido' ? (
                  <><Droplets className="w-3 h-3 text-blue-500" /> Producto líquido</>
                ) : (
                  <><Circle className="w-3 h-3 text-amber-500" /> Producto sólido</>
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Stock actual</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                placeholder="Ej: 50.00"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.stock_actual}
                onChange={(e) => setForm({ ...form, stock_actual: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Stock mínimo</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                placeholder="Ej: 10.00"
                type="number"
                min="0"
                step="0.01"
                value={form.stock_minimo}
                onChange={(e) => setForm({ ...form, stock_minimo: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Se alertará cuando el stock baje de este valor</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Precio unitario ($)</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                placeholder="Ej: 8500"
                type="number"
                min="0"
                step="1"
                value={form.precio_unitario}
                onChange={(e) => setForm({ ...form, precio_unitario: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Precio por {form.unidad_medida === 'litros' || form.unidad_medida === 'ml' ? 'litro' : form.unidad_medida === 'kg' ? 'kilo' : 'unidad'}</p>
            </div>
            <div className="flex items-end">
              <div className="flex gap-2 w-full">
                <button type="submit" className="flex-1 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm">
                  {editing ? 'Actualizar' : 'Crear insumo'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null); }}
                  className="border border-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
            <Package className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-500">No hay insumos registrados</p>
          <p className="text-xs text-gray-400 mt-1">Agrega un nuevo insumo para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const status = getStockStatus(item);
            const config = stockStatusConfig[status];
            const actual = Number(item.stock_actual);
            const minimo = Number(item.stock_minimo);
            const objetivo = minimo * 2;
            const porcentaje = objetivo > 0 ? Math.min(100, (actual / objetivo) * 100) : 100;
            const precio = Number(item.precio_unitario || 0);

            return (
              <div
                key={item.id}
                className={`animate-fade-in-up stagger-${(i % 6) + 1} bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all ${
                  status === 'critico' ? 'ring-1 ring-red-200' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <TipoIcon unidad={item.unidad_medida} />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{item.nombre_quimico}</h4>
                      <p className="text-xs text-gray-400">
                        {getTipo(item.unidad_medida) === 'liquido' ? 'Líquido' : 'Sólido'} · {item.unidad_medida}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                    {status === 'critico' && <AlertTriangle className="w-3 h-3 inline mr-0.5 -mt-0.5" />}
                    {config.label}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Stock</span>
                    <span>{actual} / {objetivo} {item.unidad_medida}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${config.bar}`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Actual</p>
                    <p className="text-sm font-bold text-gray-900">{actual}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Mínimo</p>
                    <p className="text-sm font-bold text-gray-900">{minimo}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Precio</p>
                    <p className="text-sm font-bold text-gray-900">
                      {precio > 0 ? `$${precio.toLocaleString('es-CL')}` : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
