import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Waves,
  CalendarCheck,
  Package,
  ClipboardCheck,
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/piscinas', label: 'Piscinas', icon: Waves },
  { to: '/visitas', label: 'Visitas', icon: CalendarCheck },
  { to: '/reportes', label: 'Reportes', icon: ClipboardCheck },
  { to: '/inventario', label: 'Inventario', icon: Package },
];

export default function Layout() {
  return (
    <div className="flex h-screen">
      <aside className="sidebar-wave w-64 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 text-white flex flex-col">
        <div className="p-5 border-b border-primary-700/50">
          <div className="flex items-center gap-3">
            <Logo size={42} />
            <div>
              <h1 className="text-lg font-bold tracking-wide">PoolTech</h1>
              <p className="text-primary-400 text-[10px] uppercase tracking-widest">
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
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-slide-in-left stagger-${i + 1} ${
                  isActive
                    ? 'nav-link-active bg-primary-600/60 text-white shadow-sm shadow-primary-900/30'
                    : 'text-primary-300 hover:bg-primary-700/50 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-3 border-t border-primary-700/50 flex items-center justify-between">
          <span className="text-[10px] text-primary-500 uppercase tracking-wider">
            MVP v1.0.0
          </span>
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
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
