import React from "react";
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight, Bike } from "lucide-react";
import { formatCLP, formatDateDisplay } from "../services/storage";
import { ORDER_STATUSES } from "../data/serviceCatalog";

export default function AgendaView({ orders, onSelectOrder }) {
  const activeOrders = orders.filter((o) => o.status !== "entregado");
  const today = new Date().toISOString().split("T")[0];

  // Group active orders by deliveryDate or entryDate
  const groups = {
    hoy: [],
    manana: [],
    estaSemana: [],
    proximos: [],
    sinFecha: [],
  };

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const inOneWeek = new Date(todayDate);
  inOneWeek.setDate(inOneWeek.getDate() + 7);

  activeOrders.forEach((o) => {
    const targetDateStr = o.deliveryDate || o.entryDate;
    if (!targetDateStr) {
      groups.sinFecha.push(o);
      return;
    }
    const d = new Date(targetDateStr + "T00:00:00");
    if (isNaN(d.getTime())) {
      groups.sinFecha.push(o);
      return;
    }

    if (d < todayDate) {
      // Overdue or past due
      groups.hoy.push(o);
    } else if (d.toDateString() === todayDate.toDateString()) {
      groups.hoy.push(o);
    } else if (d.toDateString() === tomorrowDate.toDateString()) {
      groups.manana.push(o);
    } else if (d <= inOneWeek) {
      groups.estaSemana.push(o);
    } else {
      groups.proximos.push(o);
    }
  });

  const renderOrderRow = (order) => {
    const statusCfg = ORDER_STATUSES[order.status] || ORDER_STATUSES.en_taller;
    return (
      <div
        key={order.id}
        onClick={() => onSelectOrder(order)}
        className="p-3.5 bg-white rounded-xl border border-slate-200/90 hover:border-amber-300 shadow-sm hover:shadow transition cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition truncate">
              {order.clientName}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusCfg.bg}`}>
              {statusCfg.shortLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
            <Bike className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="truncate font-medium">
              {order.bikeBrand} {order.bikeModel}
            </span>
            {order.bikeSize && (
              <span className="text-[11px] text-slate-400">({order.bikeSize})</span>
            )}
          </div>
        </div>

        <div className="text-right flex items-center gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block">Total</span>
            <span className="text-xs font-bold text-slate-900 font-mono">
              {formatCLP(order.total)}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition" />
        </div>
      </div>
    );
  };

  const renderSection = (title, items, icon, badgeColor, tip) => {
    if (!items || items.length === 0) return null;
    const isOverload = items.length >= 4;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${badgeColor}`}>{icon}</div>
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold font-mono">
              {items.length} {items.length === 1 ? "bici" : "bicis"}
            </span>
          </div>

          {isOverload && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Alta carga de trabajo
            </span>
          )}
        </div>

        {tip && <p className="text-xs text-slate-500 italic pl-1">{tip}</p>}

        <div className="space-y-2">{items.map(renderOrderRow)}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-sand-100 to-amber-50 p-4 rounded-2xl border border-sand-200">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white text-amber-800 rounded-xl shadow-sm border border-amber-200/80">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Agenda & Flujo de Taller RIDELAB
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Organiza los compromisos de entrega para no colapsar tus tiempos. Mantén un máximo recomendado de 2 a 3 entregas por jornada.
            </p>
          </div>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-base">¡Taller al día!</h3>
          <p className="text-xs text-slate-500 mt-1">
            No hay mantenciones pendientes de entrega en este momento.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {renderSection(
            "Entregas para Hoy o Pendientes",
            groups.hoy,
            <Clock className="w-4 h-4 text-rose-600" />,
            "bg-rose-50 text-rose-700",
            "Prioridad máxima: avisar al cliente o terminar hoy."
          )}

          {renderSection(
            "Entregas de Mañana",
            groups.manana,
            <Calendar className="w-4 h-4 text-amber-600" />,
            "bg-amber-50 text-amber-700"
          )}

          {renderSection(
            "Esta Semana",
            groups.estaSemana,
            <Calendar className="w-4 h-4 text-blue-600" />,
            "bg-blue-50 text-blue-700"
          )}

          {renderSection(
            "Próximos Días & En Espera",
            groups.proximos,
            <Calendar className="w-4 h-4 text-slate-600" />,
            "bg-slate-100 text-slate-700"
          )}

          {renderSection(
            "Sin Fecha Asignada",
            groups.sinFecha,
            <AlertTriangle className="w-4 h-4 text-slate-500" />,
            "bg-slate-100 text-slate-600"
          )}
        </div>
      )}
    </div>
  );
}
