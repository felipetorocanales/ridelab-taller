import React from "react";
import {
  MessageCircle,
  Printer,
  Edit2,
  Trash2,
  Bike,
  Wrench,
} from "lucide-react";
import Modal from "./ui/Modal";
import { ORDER_STATUSES } from "../data/serviceCatalog";
import { formatCLP, formatDateDisplay } from "../services/storage";
import confetti from "canvas-confetti";

const BIKE_TYPE_LABELS = {
  mtb: "MTB",
  ebike: "E-Bike",
  gravel: "Gravel",
  ruta: "Ruta / Pista",
  urbana: "Urbana",
  otro: "Otra",
};

export default function DetailModal({
  order,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const statusInfo = order ? ORDER_STATUSES[order.status] || ORDER_STATUSES.en_taller : null;

  if (!order) return null;

  const handleStatusClick = (nextStatus) => {
    if (nextStatus === "listo" || nextStatus === "entregado") {
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
    onStatusChange(order.id, nextStatus);
  };

  const handleWhatsApp = () => {
    const phone = (order.clientPhone || "").replace(/\D/g, "");
    const totalFormatted = formatCLP(order.total);
    const itemsText = (order.items || [])
      .map((item) => `  • ${item.description}: ${formatCLP(item.price)}`)
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

  const headerActions = (
    <div className="no-print flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => onEdit(order)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
        title="Editar orden"
        aria-label="Editar orden"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
        title="Imprimir comprobante"
        aria-label="Imprimir comprobante"
      >
        <Printer className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          if (confirm(`¿Estás seguro de eliminar la mantención de ${order.clientName}?`)) {
            onDelete(order.id);
            onClose();
          }
        }}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
        title="Eliminar orden"
        aria-label="Eliminar orden"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mantención"
      subtitle={`${order.clientName} · ${formatCLP(order.total)}`}
      icon={<Wrench className="h-5 w-5" />}
      headerActions={headerActions}
      maxWidth="sm:max-w-xl"
      bodyClassName="print:p-0"
      footer={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 shrink-0 rounded-xl border border-stone-200 px-4 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
          >
            <MessageCircle className="h-4 w-4" />
            Enviar por WhatsApp
          </button>
        </div>
      }
    >
      <div className="print-card">
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-200/80 bg-sand-100 shadow-sm">
              <img
                src="./logo.jpg"
                alt="RIDE LAB"
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  if (event.currentTarget.nextSibling) {
                    event.currentTarget.nextSibling.style.display = "flex";
                  }
                }}
              />
              <div className="hidden h-full w-full items-center justify-center bg-stone-900 text-[10px] font-bold text-amber-300">
                RL
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-black tracking-tight text-stone-900">RIDE LAB</h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-amber-800">
                Taller de MTB
              </p>
              <p className="mt-0.5 truncate text-[10px] text-stone-400">@ridelab.taller</p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-stone-400">
              Orden de trabajo
            </p>
            <p className="font-mono text-sm font-black text-stone-900">{order.code}</p>
            <p className="mt-0.5 text-[10px] text-stone-500">
              {formatDateDisplay(order.entryDate)}
            </p>
          </div>
        </div>

        <div className="no-print my-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500">
            Estado del trabajo
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {Object.entries(ORDER_STATUSES).map(([key, config]) => {
              const isCurrent = order.status === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleStatusClick(key)}
                  className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-[11px] font-semibold transition ${
                    isCurrent
                      ? `${config.bg} ring-2 ring-stone-900/10`
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                  {config.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 border-b border-stone-200 py-4 sm:grid-cols-2">
          <div className="rounded-xl border border-sand-200/60 bg-sand-50/60 p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400">
              Cliente
            </p>
            <p className="mt-0.5 break-words text-sm font-bold text-stone-900">
              {order.clientName}
            </p>
            {order.clientPhone ? (
              <p className="mt-0.5 font-mono text-[10px] text-stone-600">
                Tel: {order.clientPhone}
              </p>
            ) : (
              <p className="mt-0.5 text-[10px] italic text-stone-400">Sin teléfono registrado</p>
            )}
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400">
              <Bike className="h-3 w-3 text-amber-700" />
              Bicicleta
            </p>
            <p className="mt-0.5 break-words text-sm font-bold text-stone-900">
              {order.bikeBrand} {order.bikeModel}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-stone-600">
              <span className="font-medium">
                {BIKE_TYPE_LABELS[order.bikeType] || order.bikeType || "MTB"}
              </span>
              {order.bikeSize ? (
                <span className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-semibold text-stone-700">
                  Talla {order.bikeSize}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {order.notes ? (
          <div className="border-b border-stone-200 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400">
              Notas técnicas
            </p>
            <p className="mt-1 rounded-xl border border-amber-200/60 bg-amber-50/60 p-3 text-xs leading-relaxed text-stone-700">
              {order.notes}
            </p>
          </div>
        ) : null}

        <div className="py-4">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500">
            Detalle de trabajos y repuestos
          </p>

          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            {(order.items || []).length === 0 ? (
              <p className="px-3 py-4 text-center text-[11px] text-stone-400">
                Sin trabajos detallados.
              </p>
            ) : (
              (order.items || []).map((item, index) => (
                <div
                  key={`${item.description}-${index}`}
                  className="flex items-start justify-between gap-3 border-b border-stone-100 px-3.5 py-2.5 last:border-0"
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-stone-300">
                      {index + 1}.
                    </span>
                    <span className="break-words text-xs font-medium text-stone-800">
                      {item.description}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-bold text-stone-900">
                    {formatCLP(item.price)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-stone-900 p-3.5 text-white shadow-sm">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-stone-300">
                Total del servicio
              </p>
              <p className="truncate text-[10px] text-amber-300">
                Garantía de servicio RIDE LAB
              </p>
            </div>
            <span className="shrink-0 font-mono text-xl font-black text-amber-400">
              {formatCLP(order.total)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 pt-3 text-[10px] text-stone-500">
          <p>
            <span className="font-semibold text-stone-700">Ingreso:</span>{" "}
            {formatDateDisplay(order.entryDate)}
          </p>
          {order.deliveryDate ? (
            <p>
              <span className="font-semibold text-stone-700">Entrega:</span>{" "}
              {formatDateDisplay(order.deliveryDate)}
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
