import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { signInWithEmail } from "../services/supabase";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signInWithEmail(email.trim(), password.trim());
      if (res.error) {
        throw res.error;
      }
      if (onSuccess) {
        onSuccess(res.data.session);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.message === "Invalid login credentials"
          ? "Credenciales incorrectas. Verifica el correo y la contraseña."
          : err.message || "Error al iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 text-center bg-sand-50/60 border-b border-slate-200/80">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-200 shadow-md bg-sand-100 mx-auto mb-3">
            <img src="./logo.jpg" alt="RIDE LAB" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Intranet RIDE LAB
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Acceso seguro exclusivo para el equipo del taller
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="taller@ridelab.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 active:scale-95 mt-2"
            >
              {loading ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Ingresar a la Intranet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={onClose}
              className="hover:text-slate-800 underline font-medium"
            >
              ← Volver al sitio público
            </button>

            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Conexión SSL Segura
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
