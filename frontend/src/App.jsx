import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Piscinas from './pages/Piscinas';
import Visitas from './pages/Visitas';
import Inventario from './pages/Inventario';
import FormularioReporte from './components/FormularioReporte';
import ResumenPiscina from './pages/ResumenPiscina';

function ProtectedRoute({ children }) {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { authenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={authenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/piscinas" element={<Piscinas />} />
        <Route path="/piscinas/:id/resumen" element={<ResumenPiscina />} />
        <Route path="/visitas" element={<Visitas />} />
        <Route path="/reportes" element={<FormularioReporte />} />
        <Route path="/inventario" element={<Inventario />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
