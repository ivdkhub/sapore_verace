import React, { useState } from 'react';
import { X, Lock, LogIn } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

// Login dell'area admin: la password viene verificata dal server (api/auth.php)
export const AdminLoginModal = () => {
  const { isLoginOpen, setIsLoginOpen, login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setIsSubmitting(true);
    setError('');
    try {
      await login(password);
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md p-4" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={() => setIsLoginOpen(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2 cursor-pointer"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#d2401e]/20 text-[#d2401e] flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 id="admin-login-title" className="font-oswald text-2xl font-bold text-white uppercase tracking-tight">Area amministratore</h2>
        <p className="text-xs text-white/60 mt-1 mb-5">Accesso riservato al personale di Sapore Verace.</p>

        <label htmlFor="admin-password" className="block text-xs font-oswald tracking-wider uppercase text-white/70 mb-1.5">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-[#242424] text-white border border-white/15 rounded-xl text-base sm:text-sm focus:outline-none focus:border-[#d2401e]"
        />

        {error && (
          <p role="alert" className="mt-3 text-xs text-rose-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !password}
          className="mt-5 w-full py-3 bg-gradient-to-r from-[#d2401e] to-[#ffa323] text-white font-oswald text-sm font-bold tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          <span>{isSubmitting ? 'Verifica...' : 'Accedi'}</span>
        </button>
      </form>
    </div>
  );
};
