import React, { useState } from "react";
import {
  X,
  MessageCircle,
  Printer,
  Edit2,
  Trash2,
  Bike,
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { ORDER_STATUSES } from "../data/serviceCatalog";
import { formatCLP, formatDateDisplay } from "../services/storage";
import confetti from "canvas-confetti";

export default function DetailModal({
  order,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (!isOpen || !order) return null;

  const statusInfo = ORDER_STATUSES[order.status] || ORDER_STATUSES.en_taller;

  const handleStatusClick = (nextStatus) => {
    if (nextStatus === "listo" || nextStatus === "entregado") {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
    onStatusChange(order.id, nextStatus);
  };

  const handleWhatsApp = () => {
    const phone = (order.clientPhone || "").replace(/\D/g, "");
    const totalFormatted = formatCLP(order.total);
    const itemsText = (order.items || [])
      .map((i) => `  • ${i.description}: ${formatCLP(i.price)}`)
      .join("\n");

    const msg = `¡Hola ${order.clientName}! 🚵‍♂️
Te escribimos desde *RIDE LAB | Taller de MTB* 🔧

Tu bicicleta *${order.bikeBrand} ${order.bikeModel}* (${order.bikeSize ? `Talla ${order.bikeSize}` : "Servicio técnico"}) se encuentra:
*${statusInfo.label.toUpperCase()}* 📍

📋 *Resumen de trabajos realizados:*
${itemsText}

💰 *Total a pagar:* ${totalFormatted}
${order.notes ? `\n📝 *Notas técnicas del taller:* ${order.notes}` : ""}

¡Cualquier consulta estamos atentos! Puedes pasar a retirarla según lo coordinado.
*RIDE LAB Taller* ⛰️🔧
Instagram: @ridelab.taller`;

    const encoded = encodeURIComponent(msg);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Top bar with buttons (hidden on print) */}
        <div className="no-print px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-200 text-slate-800 rounded">
              {order.code}
            </span>
            <span className="text-xs text-slate-500 font-medium">Ficha de Mantención</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(order)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
              title="Editar orden"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
              title="Imprimir comprobante"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Estás seguro de eliminar la mantención de ${order.clientName}?`)) {
                  onDelete(order.id);
                  onClose();
                }
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Eliminar orden"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Card */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 print-card">
          {/* Header of Receipt / Ficha */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-200/80 shadow-sm bg-sand-100 flex-shrink-0">
                <img
                  src="./logo.jpg"
                  alt="RIDE LAB"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  RIDE LAB
                </h1>
                <p className="text-xs font-bold text-amber-800 tracking-wider uppercase mt-1">
                  Taller de MTB & Mecánica Biker
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  @ridelab.taller • Servicio Técnico Especializado
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-500">ORDEN DE TRABAJO</div>
              <div className="text-lg font-black font-mono text-slate-900">{order.code}</div>
              <div className="text-xs text-slate-500 mt-1">
                {formatDateDisplay(order.entryDate)}
              </div>
            </div>
          </div>

          {/* Status Quick Changer (No-print) */}
          <div className="no-print my-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Cambiar Estado del Trabajo:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {Object.entries(ORDER_STATUSES).map(([key, cfg]) => {
                const isCurrent = order.status === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleStatusClick(key)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition text-center flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? `${cfg.bg} ring-2 ring-slate-900/10 font-bold shadow-sm`
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                    {cfg.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client & Bike Information Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200">
            <div className="bg-sand-50/60 p-3.5 rounded-xl border border-sand-200/60">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Cliente
              </div>
              <div className="text-base font-bold text-slate-900">{order.clientName}</div>
              {order.clientPhone ? (
                <div className="text-xs text-slate-600 mt-0.5 font-mono">
                  Tel: {order.clientPhone}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">Sin teléfono registrado</div>
              )}
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-amber-600" />
                Bicicleta & Talla
              </div>
              <div className="text-base font-bold text-slate-900">
                {order.bikeBrand} {order.bikeModel}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                <span className="capitalize font-medium">{order.bikeType || "MTB"}</span>
                {order.bikeSize && (
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">
                    Talla: {order.bikeSize}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Notes / Specs */}
          {order.notes && (
            <div className="py-3 border-b border-slate-200">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Especificaciones & Notas Técnicas
              </div>
              <div className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                {order.notes}
              </div>
            </div>
          )}

          {/* Services & Spare Parts Breakdown */}
          <div className="py-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Detalle de Mantención & Repuestos
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {(order.items || []).map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-xs">{idx + 1}.</span>
                    <span className="font-medium text-slate-800">{item.description}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatCLP(item.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-300 block uppercase tracking-wider font-semibold">
                  Total del Servicio
                </span>
                <span className="text-[11px] text-amber-300">
                  Garantía de servicio RIDELAB Taller
                </span>
              </div>
              <span className="text-2xl font-black font-mono text-amber-400">
                {formatCLP(order.total)}
              </span>
            </div>
          </div>

          {/* Dates & Signature row */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap justify-between text-xs text-slate-500 gap-2">
            <div>
              <span className="font-semibold text-slate-700">Ingreso:</span>{" "}
              {formatDateDisplay(order.entryDate)}
            </div>
            {order.deliveryDate && (
              <div>
                <span className="font-semibold text-slate-700">Compromiso Entrega:</span>{" "}
                {formatDateDisplay(order.deliveryDate)}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions (hidden on print) */}
        <div className="no-print p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
          >
            Cerrar
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow transition active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
