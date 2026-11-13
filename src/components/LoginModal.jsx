import React, { useEffect, useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck, X } from "lucide-react";
import { signInWithEmail } from "../services/supabase";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmail(email.trim(), password.trim());
      if (result.error) throw result.error;
      if (onSuccess) onSuccess(result.data.session);
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-sm animate-fade-in sm:items-center sm:p-4">
      <div className="animate-sheet-in relative max-h-[calc(100dvh-0.5rem-env(safe-area-inset-top))] w-full overflow-y-auto rounded-t-[28px] border border-stone-200 bg-white shadow-2xl sm:max-h-[92vh] sm:max-w-md sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver al sitio público"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-stone-100 bg-sand-50/60 px-6 pb-5 pt-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-amber-200 bg-sand-100 shadow-sm">
            <img src="./logo.jpg" alt="RIDE LAB" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-stone-900">Intranet RIDE LAB</h2>
          <p className="mt-0.5 text-[11px] font-medium text-stone-500">
            Acceso exclusivo para el equipo del taller
          </p>
        </div>

        <div className="px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">
          {error ? (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="taller@ridelab.cl"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-3 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-11 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-stone-900 text-sm font-bold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Verificando...</span>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-amber-300" />
                  <span>Ingresar</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-2 border-t border-stone-100 pt-4 text-[11px] text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-left font-medium underline underline-offset-2 hover:text-stone-800"
            >
              Volver al sitio público
            </button>
            <span className="flex items-center gap-1 text-[10px] text-stone-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Conexión segura
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
