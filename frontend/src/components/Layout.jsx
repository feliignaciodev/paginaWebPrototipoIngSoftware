import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Waves,
  CalendarCheck,
  Package,
  ClipboardCheck,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/piscinas', label: 'Piscinas', icon: Waves },
  { to: '/visitas', label: 'Visitas', icon: CalendarCheck },
  { to: '/reportes', label: 'Reportes', icon: ClipboardCheck },
  { to: '/inventario', label: 'Inventario', icon: Package },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`sidebar-wave bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 text-white flex flex-col shrink-0 sidebar-transition ${
          collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
      >
        <div className="p-5 border-b border-primary-700/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <Logo size={42} className="shrink-0" />
            <div className={`sidebar-text ${collapsed ? 'sidebar-text-hidden' : ''}`}>
              <h1 className="text-lg font-bold tracking-wide whitespace-nowrap">PoolTech</h1>
              <p className="text-primary-400 text-[10px] uppercase tracking-widest whitespace-nowrap">
                Gestión de Piscinas
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }, i) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-slide-in-left stagger-${i + 1} ${
                  isActive
                    ? 'nav-link-active bg-primary-600/60 text-white shadow-sm shadow-primary-900/30'
                    : 'text-primary-300 hover:bg-primary-700/50 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={`sidebar-text ${collapsed ? 'sidebar-text-hidden' : ''}`}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-primary-700/50 space-y-1">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`sidebar-text ${collapsed ? 'sidebar-text-hidden' : ''}`}>
              Cerrar sesión
            </span>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 rounded-lg text-primary-300 hover:bg-primary-700/50 hover:text-white transition-colors duration-200"
            title={collapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
