import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalLoading } from '../components/GlobalLoadingContext';

const API_URL = 'http://localhost:8000/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isRouteTransitioning } = useGlobalLoading();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Autentikasi gagal');
      }

      localStorage.setItem('admin_token', data.token || 'dummy-token');
      localStorage.setItem('admin_username', data.username);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isRouteTransitioning) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[url('/login-bg.jpg')] bg-cover bg-center">
      
      {/* Heavy Blur Overlay & Glassmorphism Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      
      {/* Tombol Kembali */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-full transition-all backdrop-blur-md shadow-lg font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Beranda</span>
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-8">
            <img src="/logo kosong no bg.png" alt="ByteShield Logo" className="w-20 h-20 object-contain mb-2 drop-shadow-lg" />
            <h1 className="text-3xl font-display text-white tracking-widest uppercase font-bold drop-shadow-md">
              ByteShield
            </h1>
            <p className="text-gray-300 text-xs mt-2 font-mono uppercase tracking-widest drop-shadow">
              Gerbang Akses Administrator
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-white" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono text-sm shadow-inner [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#0a1f14_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                  placeholder="NAMA PENGGUNA"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono text-sm shadow-inner [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#0a1f14_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                  placeholder="KATA SANDI"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-mono p-3 rounded-lg border bg-red-500/20 text-white border-red-500/50 backdrop-blur-md"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-[#007A3B] border border-white/50 font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all uppercase tracking-widest text-sm shadow-[0_4px_15px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Mulai Sesi Admin <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
