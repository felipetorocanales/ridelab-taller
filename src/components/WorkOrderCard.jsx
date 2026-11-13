import React from "react";
import { ORDER_STATUSES } from "../data/serviceCatalog";
import { formatCLP, formatDateShort, getLocalDateISO } from "../services/storage";
import { Bike, ChevronRight, Calendar } from "lucide-react";

export default function WorkOrderCard({ order, onSelect }) {
  const statusInfo = ORDER_STATUSES[order.status] || ORDER_STATUSES.en_taller;
  const items = order.items || [];
  const firstItem = items[0]?.description || "Sin trabajos detallados";
  const extraItems = Math.max(items.length - 1, 0);
  const dateLabel = order.deliveryDate ? "Entrega" : "Ingreso";
  const dateValue = order.deliveryDate || order.entryDate;
  const isOverdue =
    Boolean(order.deliveryDate) &&
    order.deliveryDate < getLocalDateISO() &&
    order.status !== "entregado";

  const openCard = () => onSelect(order);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openCard}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCard();
        }
      }}
      aria-label={`Ver mantención de ${order.clientName}`}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-stone-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(28,27,24,0.03)] transition hover:border-amber-300/80 hover:shadow-[0_8px_24px_-12px_rgba(28,27,24,0.25)] focus-visible:border-amber-400"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold leading-tight tracking-tight text-stone-900 transition group-hover:text-amber-900">
            {order.clientName}
          </h3>
          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[13px] text-stone-500">
            <Bike className="h-3.5 w-3.5 shrink-0 text-amber-700/80" />
            <span className="truncate">
              {order.bikeBrand} {order.bikeModel}
            </span>
            {order.bikeSize ? (
              <span className="shrink-0 text-[11px] text-stone-400">· {order.bikeSize}</span>
            ) : null}
          </div>
        </div>

        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold ${statusInfo.bg}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
          {statusInfo.shortLabel}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-stone-100 pt-3">
        <div className="min-w-0">
          <p className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-stone-500">
            <span className="truncate">{firstItem}</span>
            {extraItems > 0 ? (
              <span className="shrink-0 rounded bg-stone-100 px-1 py-0.5 text-[9px] font-bold text-stone-500">
                +{extraItems}
              </span>
            ) : null}
          </p>
          <p
            className={`mt-1 flex items-center gap-1 text-[11px] ${
              isOverdue ? "font-semibold text-rose-600" : "text-stone-500"
            }`}
          >
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {dateLabel} {formatDateShort(dateValue)}
              {order.code ? <span className="text-stone-400"> · {order.code}</span> : null}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="font-mono text-[15px] font-bold tracking-tight text-stone-900">
            {formatCLP(order.total)}
          </span>
          <ChevronRight className="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-700" />
        </div>
      </div>
    </article>
  );
}
