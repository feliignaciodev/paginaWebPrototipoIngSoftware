import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import PoolBackground from '../components/PoolBackground';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { correo, password });
      login(data.user, data.token);
      // Clientes van a su portal; el resto al dashboard
      navigate(data.user.rol === 'cliente' ? '/portal' : '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <PoolBackground />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-sm mx-4 animate-fade-in-up">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-4">
              <Logo size={52} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-wide">PoolTech</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">
              Gestión de Piscinas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                placeholder="usuario@pooltech.cl"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Ingrese su contraseña"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 animate-fade-in-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !correo.trim() || !password}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mt-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Ingresar
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/60 mt-4">
          PoolTech © 2026 · Sistema de Gestión
        </p>
      </div>
    </div>
  );
}
