import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Piscinas from './pages/Piscinas';
import Visitas from './pages/Visitas';
import Inventario from './pages/Inventario';
import FormularioReporte from './components/FormularioReporte';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/piscinas" element={<Piscinas />} />
        <Route path="/visitas" element={<Visitas />} />
        <Route path="/reportes" element={<FormularioReporte />} />
        <Route path="/inventario" element={<Inventario />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
