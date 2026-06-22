import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Waves,
  CalendarCheck,
  Package,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/piscinas', label: 'Piscinas', icon: Waves },
  { to: '/visitas', label: 'Visitas', icon: CalendarCheck },
  { to: '/inventario', label: 'Inventario', icon: Package },
];

export default function Layout() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-primary-800 text-white flex flex-col">
        <div className="p-6 border-b border-primary-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Waves className="w-6 h-6" />
            PoolTech
          </h1>
          <p className="text-primary-300 text-xs mt-1">Gestión de Piscinas</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-700 text-xs text-primary-400">
          MVP v1.0.0
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
