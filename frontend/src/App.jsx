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
import RutasInteligentes from './pages/RutasInteligentes';
import PortalCliente from './pages/PortalCliente';

function ProtectedRoute({ children, roles }) {
  const { authenticated, user } = useAuth();
  if (!authenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.rol)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { authenticated, user } = useAuth();

  const loginRedirect = authenticated
    ? <Navigate to={user?.rol === 'cliente' ? '/portal' : '/'} replace />
    : <Login />;

  return (
    <Routes>
      <Route path="/login" element={loginRedirect} />

      {/* Portal exclusivo para clientes */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute roles={['cliente']}>
            <PortalCliente />
          </ProtectedRoute>
        }
      />

      {/* App principal para admin, supervisor y técnico */}
      <Route
        element={
          <ProtectedRoute roles={['administrador', 'supervisor', 'tecnico']}>
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
        <Route
          path="/rutas"
          element={
            <ProtectedRoute roles={['administrador', 'supervisor']}>
              <RutasInteligentes />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
