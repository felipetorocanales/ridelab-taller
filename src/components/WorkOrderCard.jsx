import React from "react";
import { ORDER_STATUSES } from "../data/serviceCatalog";
import { formatCLP, formatDateDisplay } from "../services/storage";
import { Bike, ChevronRight, Calendar, MessageCircle, CheckCircle2, Clock, Wrench } from "lucide-react";
import confetti from "canvas-confetti";

export default function WorkOrderCard({ order, onSelect, onStatusChange }) {
  const statusInfo = ORDER_STATUSES[order.status] || ORDER_STATUSES.en_taller;

  const handleQuickStatus = (e, nextStatus) => {
    e.stopPropagation();
    if (nextStatus === "listo" || nextStatus === "entregado") {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }
    onStatusChange(order.id, nextStatus);
  };

  const openWhatsApp = (e) => {
    e.stopPropagation();
    const phone = (order.clientPhone || "").replace(/\D/g, "");
    const totalFormatted = formatCLP(order.total);
    const itemsText = (order.items || []).map((i) => `• ${i.description} (${formatCLP(i.price)})`).join("\n");
    const msg = `¡Hola ${order.clientName}! 🚵‍♂️ Te escribimos de *RIDE LAB Taller*.
Tu bicicleta *${order.bikeBrand} ${order.bikeModel}* se encuentra *${statusInfo.label}*.

📋 *Detalle del trabajo:*
${itemsText}

💰 *Total:* ${totalFormatted}

¡Cualquier duda nos avisas! Nos vemos en el taller ⛰️🔧`;

    const encoded = encodeURIComponent(msg);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div
      onClick={() => onSelect(order)}
      className="group bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-300 shadow-sm hover:shadow transition-all cursor-pointer relative"
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors truncate">
              {order.clientName}
            </h3>
            {order.code && (
              <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {order.code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-slate-700 text-sm font-semibold">
            <Bike className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="truncate">
              {order.bikeBrand} {order.bikeModel}
            </span>
            {order.bikeSize && (
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                Talla: {order.bikeSize}
              </span>
            )}
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 flex items-center gap-1.5 ${statusInfo.bg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
          {statusInfo.shortLabel}
        </span>
      </div>

      {/* Services breakdown list */}
      <div className="mt-3 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
        <div className="space-y-1">
          {(order.items || []).slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs text-slate-600">
              <span className="truncate mr-2">• {item.description}</span>
              <span className="font-medium text-slate-800 flex-shrink-0 font-mono">
                {formatCLP(item.price)}
              </span>
            </div>
          ))}
          {(order.items || []).length > 3 && (
            <div className="text-[11px] text-amber-700 font-medium pt-0.5">
              + {(order.items || []).length - 3} ítems adicionales...
            </div>
          )}
        </div>

        {/* Notes preview if exists */}
        {order.notes && (
          <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-500 italic truncate">
            "{order.notes}"
          </div>
        )}
      </div>

      {/* Bottom info row: Date & Total & Quick action */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDateDisplay(order.entryDate)}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Total</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {formatCLP(order.total)}
            </span>
          </div>

          <button
            onClick={openWhatsApp}
            title="Enviar mensaje por WhatsApp"
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors border border-emerald-200"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>

          <div className="text-slate-400 group-hover:text-amber-600 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
