import React, { useRef, useState } from "react";
import { X, Download, Upload, RefreshCw, Smartphone, Cloud, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { exportBackupJSON, importBackupJSON, resetToInitial } from "../services/storage";

export default function BackupModal({ isOpen, onClose, onDataRestored, totalOrders }) {
  if (!isOpen) return null;

  const fileInputRef = useRef(null);
  const [feedback, setFeedback] = useState(null);

  const handleExport = () => {
    exportBackupJSON();
    setFeedback({ type: "success", text: "¡Respaldo descargado con éxito!" });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const res = importBackupJSON(content);
        if (res.success) {
          setFeedback({
            type: "success",
            text: `¡Se restauraron ${res.count} órdenes de mantención correctamente!`,
          });
          onDataRestored();
        } else {
          setFeedback({
            type: "error",
            text: `Error al restaurar: ${res.error}`,
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      confirm(
        "¿Deseas restablecer la base de datos a los 13 registros iniciales de las notas de RIDELAB? Los cambios no respaldados se perderán."
      )
    ) {
      resetToInitial();
      setFeedback({
        type: "success",
        text: "Base de datos restablecida a los datos iniciales de RIDELAB.",
      });
      onDataRestored();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base leading-tight">
                Datos, Respaldo & App Móvil
              </h2>
              <p className="text-xs text-slate-500">
                Seguridad de datos de RIDELAB Taller
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {feedback.text}
            </div>
          )}

          {/* Device storage status */}
          <div className="bg-sand-50 p-4 rounded-xl border border-sand-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Almacenamiento Local Activo
                </span>
                <span className="text-xs text-slate-600 mt-0.5 block">
                  Tienes <strong>{totalOrders} mantenciones</strong> registradas en la memoria persistente de tu navegador.
                </span>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          {/* Backup options */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Copias de Seguridad (Backup)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition flex items-center gap-3 group"
              >
                <div className="p-2 bg-amber-100 text-amber-900 rounded-lg group-hover:scale-105 transition">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Descargar Respaldo</div>
                  <div className="text-[11px] text-slate-500">Guarda archivo .json</div>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition flex items-center gap-3 group"
              >
                <div className="p-2 bg-blue-100 text-blue-900 rounded-lg group-hover:scale-105 transition">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Restaurar Respaldo</div>
                  <div className="text-[11px] text-slate-500">Cargar archivo .json</div>
                </div>
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

          {/* Como instalar en iPhone */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-amber-600" />
              Cómo usar como App en iPhone
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Para que tu amigo no tenga que abrir pestañas ni ver barras de navegador:
            </p>
            <ol className="text-xs text-slate-600 space-y-1 pl-4 list-decimal">
              <li>Abre el link de la app en <strong>Safari</strong> de su iPhone.</li>
              <li>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba).</li>
              <li>Selecciona <strong>"Agregar al inicio"</strong>.</li>
              <li>¡Listo! Le quedará el logo de <strong>RIDE LAB</strong> como una App nativa.</li>
            </ol>
          </div>

          {/* Reset initial data */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restablecer a los datos iniciales de RIDELAB
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
