import React, { useRef, useState } from "react";
import {
  Download,
  Upload,
  RefreshCw,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Modal from "./ui/Modal";
import { exportBackupJSON, importBackupJSON, resetToInitial } from "../services/storage";

export default function BackupModal({ isOpen, onClose, onDataRestored, totalOrders }) {
  const fileInputRef = useRef(null);
  const [feedback, setFeedback] = useState(null);

  const handleExport = () => {
    exportBackupJSON();
    setFeedback({ type: "success", text: "Respaldo descargado correctamente." });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const content = loadEvent.target?.result;
      if (typeof content === "string") {
        const result = importBackupJSON(content);
        if (result.success) {
          setFeedback({
            type: "success",
            text: `Se restauraron ${result.count} mantenciones correctamente.`,
          });
          onDataRestored();
        } else {
          setFeedback({ type: "error", text: `Error al restaurar: ${result.error}` });
        }
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleReset = () => {
    if (
      confirm(
        "¿Deseas restablecer la base de datos a los registros iniciales de RIDELAB? Los cambios no respaldados se perderán."
      )
    ) {
      resetToInitial();
      setFeedback({ type: "success", text: "Base de datos restablecida." });
      onDataRestored();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Datos y respaldo"
      subtitle="Seguridad de la información del taller"
      icon={<ShieldCheck className="h-5 w-5" />}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="h-11 w-full rounded-xl bg-stone-900 text-sm font-bold text-white transition hover:bg-stone-800"
        >
          Entendido
        </button>
      }
    >
      {feedback ? (
        <div
          className={`mb-4 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 rounded-xl border border-sand-200 bg-sand-50/70 p-3.5">
        <div>
          <p className="text-xs font-bold text-stone-800">Almacenamiento local activo</p>
          <p className="mt-0.5 text-[11px] text-stone-500">
            <strong className="font-semibold text-stone-700">{totalOrders}</strong>{" "}
            {totalOrders === 1 ? "mantención registrada" : "mantenciones registradas"} en este navegador.
          </p>
        </div>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
          Copia de seguridad
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 text-left transition hover:border-amber-300 hover:bg-amber-50/40"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-900">
              <Download className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-bold text-stone-900">Descargar respaldo</span>
              <span className="block text-[10px] text-stone-500">Archivo .json</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 text-left transition hover:border-amber-300 hover:bg-amber-50/40"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
              <Upload className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-bold text-stone-900">Restaurar respaldo</span>
              <span className="block text-[10px] text-stone-500">Cargar archivo .json</span>
            </span>
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />
      </div>

      <details className="group mt-4 rounded-xl border border-stone-200 bg-stone-50/70">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-xs font-bold text-stone-800 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-amber-700" />
            Cómo usar la app en iPhone
          </span>
          <ChevronDown className="h-4 w-4 text-stone-400 transition group-open:rotate-180" />
        </summary>
        <ol className="space-y-1.5 border-t border-stone-200 px-3.5 py-3 pl-8 text-[11px] leading-relaxed text-stone-600 list-decimal">
          <li>Abre el sitio en <strong>Safari</strong>.</li>
          <li>Toca <strong>Compartir</strong> y elige <strong>Agregar al inicio</strong>.</li>
          <li>Se abrirá a pantalla completa con el logo de RIDE LAB.</li>
        </ol>
      </details>

      <div className="mt-5 border-t border-stone-100 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-stone-200 text-[11px] font-semibold text-stone-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Restablecer datos iniciales
        </button>
      </div>
    </Modal>
  );
}
