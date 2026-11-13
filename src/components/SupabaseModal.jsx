import React, { useState, useEffect } from "react";
import {
  X,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  UploadCloud,
  Unlink,
  Database,
} from "lucide-react";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  isSupabaseConfigured,
  fetchOrdersFromSupabase,
  uploadBatchToSupabase,
} from "../services/supabase";
import { getOrders } from "../services/storage";

export default function SupabaseModal({ isOpen, onClose, onSyncSuccess }) {
  if (!isOpen) return null;

  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url || "");
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || "");
  const [isConnected, setIsConnected] = useState(isSupabaseConfigured());
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    setIsConnected(isSupabaseConfigured());
  }, [isOpen]);

  const handleSaveAndTest = async (e) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage({ type: "error", text: "Por favor ingresa tanto la URL como la Anon Key." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      saveSupabaseConfig(url.trim(), anonKey.trim());
      // Test fetch
      const testData = await fetchOrdersFromSupabase();
      setIsConnected(true);
      setStatusMessage({
        type: "success",
        text: `¡Conexión exitosa! Se encontraron ${testData.length} órdenes en Supabase.`,
      });
      if (onSyncSuccess) onSyncSuccess();
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: `Error de conexión: ${err.message || "Verifica la URL, la Anon Key o si ejecutaste el SQL de la tabla orders en Supabase."}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm("¿Deseas desconectar Supabase? El sistema volverá a guardar los datos en modo local.")) {
      clearSupabaseConfig();
      setUrl("");
      setAnonKey("");
      setIsConnected(false);
      setStatusMessage({
        type: "info",
        text: "Supabase desconectado. El sistema ahora opera en almacenamiento local.",
      });
      if (onSyncSuccess) onSyncSuccess();
    }
  };

  const handleUploadCurrentData = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const localOrders = getOrders();
      await uploadBatchToSupabase(localOrders);
      setStatusMessage({
        type: "success",
        text: `¡Se subieron exitosamente ${localOrders.length} mantenciones locales a Supabase!`,
      });
      if (onSyncSuccess) onSyncSuccess();
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: `Error al subir: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const copySqlNotice = () => {
    setCopiedSql(true);
    navigator.clipboard?.writeText?.(`-- Encontrarás el script completo en el archivo 'supabase/schema.sql' del proyecto.`);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-900">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base leading-tight">
                Sincronización en la Nube (Supabase)
              </h2>
              <p className="text-xs text-slate-500">
                PostgreSQL multi-dispositivo y agendamiento en línea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status Badge Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isConnected
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            {isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <div className="font-bold text-sm">
                {isConnected
                  ? "🟢 Supabase Conectado (Nube Activa)"
                  : "🟡 Modo Local Activo"}
              </div>
              <p className="mt-0.5 opacity-90 leading-relaxed">
                {isConnected
                  ? "Tus mantenciones se sincronizan en tiempo real con Supabase. Puedes abrir la app en tu celular y computador simultáneamente."
                  : "Actualmente los datos se guardan en la memoria local del navegador. Conecta Supabase gratis para tener sincronización automática."}
              </p>
            </div>
          </div>

          {/* Feedback message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : statusMessage.type === "info"
                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {statusMessage.text}
            </div>
          )}

          {/* Configuration Form */}
          <form onSubmit={handleSaveAndTest} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project URL de Supabase *
              </label>
              <input
                type="url"
                required
                placeholder="https://abcdefghijklm.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Anon / Public API Key *
              </label>
              <input
                type="password"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                {isConnected ? "Actualizar & Probar Conexión" : "Conectar con Supabase"}
              </button>

              {isConnected && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold rounded-xl text-xs flex items-center gap-1 transition"
                  title="Desconectar Supabase"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  Desconectar
                </button>
              )}
            </div>
          </form>

          {/* Quick upload local data to Supabase */}
          {isConnected && (
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleUploadCurrentData}
                disabled={loading}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                Subir mis datos locales actuales a Supabase ({getOrders().length} órdenes)
              </button>
            </div>
          )}

          {/* 3 Step Guide */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>¿Cómo configurar Supabase gratis? (3 pasos)</span>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold normal-case"
              >
                supabase.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="text-slate-600 space-y-1.5 pl-4 list-decimal leading-relaxed">
              <li>
                Crea un proyecto gratuito en <strong>Supabase.com</strong> (ej: "RideLab").
              </li>
              <li>
                Ve al menú <strong>SQL Editor</strong>, abre el archivo{" "}
                <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
                  supabase/schema.sql
                </code>{" "}
                de este proyecto, pégalo y haz clic en <strong>Run</strong>. (Crea la tabla y carga las 13 notas reales).
              </li>
              <li>
                En Supabase ve a <strong>Project Settings -&gt; API</strong>, copia la <strong>Project URL</strong> y la <strong>anon public key</strong>, y pégalas arriba.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
