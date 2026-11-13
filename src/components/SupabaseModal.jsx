import React, { useState, useEffect } from "react";
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  UploadCloud,
  Unlink,
  ChevronDown,
} from "lucide-react";
import Modal from "./ui/Modal";
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
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url || "");
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || "");
  const [isConnected, setIsConnected] = useState(isSupabaseConfigured());
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsConnected(isSupabaseConfigured());
      setStatusMessage(null);
    }
  }, [isOpen]);

  const handleSaveAndTest = async (event) => {
    event.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage({ type: "error", text: "Ingresa la URL y la Anon Key." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      saveSupabaseConfig(url.trim(), anonKey.trim());
      const testData = await fetchOrdersFromSupabase();
      setIsConnected(true);
      setStatusMessage({
        type: "success",
        text: `Conexión exitosa. Se encontraron ${testData.length} órdenes en Supabase.`,
      });
      if (onSyncSuccess) onSyncSuccess();
    } catch (error) {
      console.error(error);
      setStatusMessage({
        type: "error",
        text: `Error de conexión: ${error.message || "Revisa la URL, la Anon Key y la tabla orders."}`,
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
        text: "Supabase desconectado. El sistema opera en almacenamiento local.",
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
        text: `Se subieron ${localOrders.length} mantenciones locales a Supabase.`,
      });
      if (onSyncSuccess) onSyncSuccess();
    } catch (error) {
      setStatusMessage({ type: "error", text: `Error al subir: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nube y sincronización"
      subtitle="PostgreSQL multi-dispositivo"
      icon={<Cloud className="h-5 w-5" />}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="h-11 w-full rounded-xl bg-stone-900 text-sm font-bold text-white transition hover:bg-stone-800"
        >
          Cerrar
        </button>
      }
    >
      <div
        className={`flex items-start gap-2.5 rounded-xl border p-3 ${
          isConnected
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        {isConnected ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold">
            {isConnected ? "Supabase conectado" : "Modo local activo"}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
            {isConnected
              ? "Tus mantenciones se sincronizan en tiempo real entre dispositivos."
              : "Los datos se guardan en este navegador. Conecta Supabase para sincronizar entre equipos."}
          </p>
        </div>
      </div>

      {statusMessage ? (
        <div
          className={`mt-3 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-medium ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : statusMessage.type === "info"
              ? "border-blue-200 bg-blue-50 text-blue-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      ) : null}

      <form onSubmit={handleSaveAndTest} className="mt-4 space-y-3">
        <div>
          <label htmlFor="supabase-url" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500">
            Project URL
          </label>
          <input
            id="supabase-url"
            type="url"
            required
            placeholder="https://abcdefghijklm.supabase.co"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 font-mono text-xs text-stone-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
          />
        </div>

        <div>
          <label htmlFor="supabase-key" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500">
            Anon / Public Key
          </label>
          <input
            id="supabase-key"
            type="password"
            required
            placeholder="eyJhbGciOiJIUzI1NiIs..."
            value={anonKey}
            onChange={(event) => setAnonKey(event.target.value)}
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 font-mono text-xs text-stone-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {isConnected ? "Probar conexión" : "Conectar Supabase"}
          </button>

          {isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="flex h-11 items-center gap-1.5 rounded-xl border border-rose-200 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              <Unlink className="h-3.5 w-3.5" />
              Desconectar
            </button>
          ) : null}
        </div>
      </form>

      {isConnected ? (
        <button
          type="button"
          onClick={handleUploadCurrentData}
          disabled={loading}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-900 text-[11px] font-bold text-white transition hover:bg-stone-800 disabled:opacity-50"
        >
          <UploadCloud className="h-4 w-4 text-emerald-400" />
          Subir datos locales ({getOrders().length})
        </button>
      ) : null}

      <details className="group mt-4 rounded-xl border border-stone-200 bg-stone-50/70">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-xs font-bold text-stone-800 [&::-webkit-details-marker]:hidden">
          Cómo configurar Supabase
          <ChevronDown className="h-4 w-4 text-stone-400 transition group-open:rotate-180" />
        </summary>
        <div className="space-y-2 border-t border-stone-200 px-3.5 py-3 text-[11px] leading-relaxed text-stone-600">
          <p>
            1. Crea un proyecto gratuito en{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-emerald-700 underline underline-offset-2"
            >
              supabase.com <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </p>
          <p>
            2. En <strong>SQL Editor</strong>, ejecuta el archivo{" "}
            <code className="rounded bg-stone-200 px-1 py-0.5 font-mono text-[10px] text-stone-800">
              supabase/schema.sql
            </code>
            .
          </p>
          <p>
            3. En <strong>Project Settings → API</strong>, copia la URL y la anon key y pégalas arriba.
          </p>
        </div>
      </details>
    </Modal>
  );
}
