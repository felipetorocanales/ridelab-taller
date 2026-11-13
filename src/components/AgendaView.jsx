import React from "react";
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight, Bike } from "lucide-react";
import { formatCLP, formatDateShort, getLocalDateISO } from "../services/storage";
import { ORDER_STATUSES } from "../data/serviceCatalog";

export default function AgendaView({ orders, onSelectOrder }) {
  const activeOrders = orders.filter((order) => order.status !== "entregado");
  const todayISO = getLocalDateISO();

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

  activeOrders.forEach((order) => {
    const targetDateStr = order.deliveryDate || order.entryDate;
    if (!targetDateStr) {
      groups.sinFecha.push(order);
      return;
    }
    const targetDate = new Date(`${targetDateStr}T00:00:00`);
    if (Number.isNaN(targetDate.getTime())) {
      groups.sinFecha.push(order);
      return;
    }

    if (targetDate < todayDate || targetDate.toDateString() === todayDate.toDateString()) {
      groups.hoy.push(order);
    } else if (targetDate.toDateString() === tomorrowDate.toDateString()) {
      groups.manana.push(order);
    } else if (targetDate <= inOneWeek) {
      groups.estaSemana.push(order);
    } else {
      groups.proximos.push(order);
    }
  });

  const sortByDate = (list) =>
    [...list].sort((a, b) =>
      String(a.deliveryDate || a.entryDate || "").localeCompare(String(b.deliveryDate || b.entryDate || ""))
    );

  Object.keys(groups).forEach((key) => {
    groups[key] = sortByDate(groups[key]);
  });

  const overdueCount = groups.hoy.filter(
    (order) => order.deliveryDate && order.deliveryDate < todayISO
  ).length;

  const todayLabel = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayLabelCapitalized = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);

  const renderOrderRow = (order) => {
    const statusCfg = ORDER_STATUSES[order.status] || ORDER_STATUSES.en_taller;
    const dueDate = order.deliveryDate || order.entryDate;
    const isOverdue = Boolean(order.deliveryDate) && order.deliveryDate < todayISO;

    return (
      <button
        key={order.id}
        type="button"
        onClick={() => onSelectOrder(order)}
        className="group flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone-50 active:bg-stone-100"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${statusCfg.dot}`} />
            <span className="truncate text-[13px] font-bold text-stone-900 group-hover:text-amber-900">
              {order.clientName}
            </span>
            {isOverdue ? (
              <span className="shrink-0 rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-700">
                Atrasado
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 pl-4 text-[11px] text-stone-500">
            <Bike className="h-3 w-3 shrink-0 text-amber-700/70" />
            <span className="truncate">
              {order.bikeBrand} {order.bikeModel}
            </span>
            <span className="shrink-0 text-stone-300">·</span>
            <span className="shrink-0">{formatDateShort(dueDate)}</span>
          </div>
        </div>

        <span className="shrink-0 font-mono text-xs font-bold text-stone-800">
          {formatCLP(order.total)}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:text-amber-700" />
      </button>
    );
  };

  const renderSection = (title, items, icon, toneClasses, description) => {
    if (!items || items.length === 0) return null;
    const isOverload = items.length >= 4;

    return (
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneClasses}`}>
              {icon}
            </div>
            <h2 className="truncate text-[13px] font-bold text-stone-800">{title}</h2>
            <span className="shrink-0 rounded-full bg-stone-200/70 px-2 py-0.5 text-[10px] font-bold tabular-nums text-stone-600">
              {items.length}
            </span>
          </div>

          {isOverload ? (
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">
              <AlertTriangle className="h-3 w-3" />
              Carga alta
            </span>
          ) : null}
        </div>

        {description ? (
          <p className="px-1 text-[11px] text-stone-500">{description}</p>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_1px_2px_rgba(28,27,24,0.03)]">
          <div className="divide-y divide-stone-100">{items.map(renderOrderRow)}</div>
        </div>
      </section>
    );
  };

  return (
    <section aria-labelledby="agenda-title">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800/80">
            Flujo de entregas
          </p>
          <h1
            id="agenda-title"
            className="mt-0.5 text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl"
          >
            Agenda
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            {todayLabelCapitalized} · {groups.hoy.length}{" "}
            {groups.hoy.length === 1 ? "entrega para hoy" : "entregas para hoy"}
          </p>
        </div>
      </div>

      {overdueCount > 0 ? (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="leading-relaxed">
            {overdueCount === 1
              ? "Hay 1 entrega atrasada. Revisa la sección de hoy y avisa al cliente."
              : `Hay ${overdueCount} entregas atrasadas. Revisa la sección de hoy y avisa a los clientes.`}
          </p>
        </div>
      ) : null}

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200/90 bg-white px-6 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-[15px] font-bold text-stone-900">Sin entregas pendientes</h2>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-stone-500">
            El taller está al día. Cuando registres una mantención, aparecerá organizada aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {renderSection(
            overdueCount > 0 ? "Hoy y atrasadas" : "Hoy",
            groups.hoy,
            <Clock className="h-3.5 w-3.5 text-rose-600" />,
            "bg-rose-50 text-rose-700"
          )}

          {renderSection(
            "Mañana",
            groups.manana,
            <Calendar className="h-3.5 w-3.5 text-amber-700" />,
            "bg-amber-50 text-amber-800"
          )}

          {renderSection(
            "Esta semana",
            groups.estaSemana,
            <Calendar className="h-3.5 w-3.5 text-blue-700" />,
            "bg-blue-50 text-blue-700"
          )}

          {renderSection(
            "Próximas",
            groups.proximos,
            <Calendar className="h-3.5 w-3.5 text-stone-600" />,
            "bg-stone-100 text-stone-700"
          )}

          {renderSection(
            "Sin fecha asignada",
            groups.sinFecha,
            <AlertTriangle className="h-3.5 w-3.5 text-stone-500" />,
            "bg-stone-100 text-stone-600",
            "Asigna una fecha de entrega para ordenar la carga del taller."
          )}
        </div>
      )}
    </section>
  );
}
