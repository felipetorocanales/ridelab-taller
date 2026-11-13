import React, { useEffect, useState } from "react";
import { Bike, ChevronRight, ChevronLeft, Plus, UserRound, SearchX } from "lucide-react";
import { formatCLP, formatDateDisplay, formatDateShort } from "../services/storage";
import { ORDER_STATUSES } from "../data/serviceCatalog";

export default function ClientHistoryView({
  orders,
  onSelectOrder,
  onNewOrderForClient,
  searchQuery,
  setSearchQuery,
}) {
  const [selectedClientName, setSelectedClientName] = useState(null);

  const clientMap = {};
  orders.forEach((order) => {
    const rawName = (order.clientName || "Sin Nombre").trim();
    const key = rawName.toLowerCase();
    if (!clientMap[key]) {
      clientMap[key] = {
        name: rawName,
        phone: order.clientPhone || "",
        orders: [],
        bikes: new Set(),
      };
    }
    clientMap[key].orders.push(order);
    if (order.clientPhone && !clientMap[key].phone) {
      clientMap[key].phone = order.clientPhone;
    }
    if (order.bikeBrand || order.bikeModel) {
      clientMap[key].bikes.add(
        `${order.bikeBrand || ""} ${order.bikeModel || ""}`.trim() +
          (order.bikeSize ? ` (${order.bikeSize})` : "")
      );
    }
  });

  const clientsList = Object.values(clientMap)
    .map((client) => ({
      ...client,
      bikes: Array.from(client.bikes),
      totalSpent: client.orders.reduce((sum, order) => sum + (order.total || 0), 0),
      lastVisit: [...client.orders].sort(
        (a, b) => new Date(b.entryDate) - new Date(a.entryDate)
      )[0],
    }))
    .sort((a, b) => new Date(b.lastVisit?.entryDate || 0) - new Date(a.lastVisit?.entryDate || 0));

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredClients = clientsList.filter((client) => {
    if (!normalizedQuery) return true;
    const matchName = client.name.toLowerCase().includes(normalizedQuery);
    const matchBikes = client.bikes.some((bike) => bike.toLowerCase().includes(normalizedQuery));
    const matchItems = client.orders.some((order) =>
      (order.items || []).some((item) => (item.description || "").toLowerCase().includes(normalizedQuery))
    );
    const matchNotes = client.orders.some((order) =>
      (order.notes || "").toLowerCase().includes(normalizedQuery)
    );
    return matchName || matchBikes || matchItems || matchNotes;
  });

  const selectedClient = clientsList.find(
    (client) => client.name.toLowerCase() === (selectedClientName || "").toLowerCase()
  );

  useEffect(() => {
    if (normalizedQuery) {
      setSelectedClientName(null);
    }
  }, [normalizedQuery]);

  useEffect(() => {
    if (selectedClientName && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedClientName]);

  return (
    <section aria-labelledby="clientes-title">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800/80">
            Fichas de riders
          </p>
          <h1
            id="clientes-title"
            className="mt-0.5 text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl"
          >
            Clientes
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Historial de servicios por cliente y bicicleta.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
          {filteredClients.length} {filteredClients.length === 1 ? "cliente" : "clientes"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div
          className={`space-y-2 md:col-span-5 ${
            selectedClient ? "hidden md:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
              Directorio
            </span>
            {normalizedQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[11px] font-semibold text-amber-800 underline underline-offset-2"
              >
                Limpiar búsqueda
              </button>
            ) : null}
          </div>

          <div className="space-y-2 md:max-h-[calc(100dvh-15rem)] md:overflow-y-auto md:pr-1">
            {filteredClients.map((client, index) => {
              const isSelected =
                selectedClient?.name.toLowerCase() === client.name.toLowerCase();
              return (
                <button
                  key={`${client.name}-${index}`}
                  type="button"
                  onClick={() => setSelectedClientName(client.name)}
                  className={`flex w-full items-start gap-2.5 rounded-xl border p-3.5 text-left transition ${
                    isSelected
                      ? "border-amber-300 bg-amber-50/70 shadow-sm ring-1 ring-amber-300/40"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      isSelected
                        ? "bg-amber-200 text-amber-950"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="truncate text-[13px] font-bold text-stone-900">
                        {client.name}
                      </span>
                      <span className="shrink-0 rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-stone-500">
                        {client.orders.length} {client.orders.length === 1 ? "visita" : "visitas"}
                      </span>
                    </span>

                    <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[11px] text-stone-500">
                      <Bike className="h-3 w-3 shrink-0 text-amber-700/70" />
                      <span className="truncate">
                        {client.bikes.join(" · ") || "Bici no especificada"}
                      </span>
                    </span>

                    <span className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-stone-500">
                      <span>Último: {formatDateShort(client.lastVisit?.entryDate)}</span>
                      <span className="font-mono font-semibold text-stone-600">
                        {formatCLP(client.totalSpent)}
                      </span>
                    </span>
                  </span>

                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-stone-300" />
                </button>
              );
            })}

            {filteredClients.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-stone-200 bg-white px-4 py-8 text-center">
                {normalizedQuery ? (
                  <SearchX className="h-6 w-6 text-stone-300" />
                ) : (
                  <UserRound className="h-6 w-6 text-stone-300" />
                )}
                <p className="mt-2 text-xs font-semibold text-stone-600">
                  {normalizedQuery ? "Sin coincidencias" : "Aún no hay clientes"}
                </p>
                <p className="mt-1 max-w-[16rem] text-[11px] leading-relaxed text-stone-400">
                  {normalizedQuery
                    ? `No encontramos clientes para “${searchQuery}”. Prueba con otro nombre o bici.`
                    : "Los clientes aparecen automáticamente al registrar una mantención."}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={`md:col-span-7 ${
            selectedClient ? "block" : "hidden md:block"
          }`}
        >
          {selectedClient ? (
            <div className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(28,27,24,0.03)] sm:p-5">
              <button
                type="button"
                onClick={() => setSelectedClientName(null)}
                className="-ml-1 mb-3 flex items-center gap-1 rounded-lg py-1 pr-2 text-xs font-semibold text-stone-500 transition hover:text-stone-900 md:hidden"
              >
                <ChevronLeft className="h-4 w-4" />
                Clientes
              </button>

              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-black text-amber-300">
                    {selectedClient.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-extrabold leading-tight tracking-tight text-stone-900">
                      {selectedClient.name}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-stone-500">
                      {selectedClient.phone || "Sin teléfono registrado"}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400">
                    Total
                  </span>
                  <span className="font-mono text-[15px] font-black text-stone-900">
                    {formatCLP(selectedClient.totalSpent)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedClient.bikes.map((bike, index) => (
                  <span
                    key={`${bike}-${index}`}
                    className="flex items-center gap-1 rounded-lg border border-amber-200/70 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-900"
                  >
                    <Bike className="h-3 w-3 text-amber-700" />
                    {bike}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onNewOrderForClient(selectedClient)}
                title={`Nueva mantención para ${selectedClient.name}`}
                className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-800 transition hover:border-stone-400 hover:bg-stone-50 active:scale-[0.99]"
              >
                <Plus className="h-4 w-4 text-amber-700" />
                Nueva mantención
              </button>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                    Historial
                  </h3>
                  <span className="text-[10px] font-semibold text-stone-400">
                    {selectedClient.orders.length}{" "}
                    {selectedClient.orders.length === 1 ? "trabajo" : "trabajos"}
                  </span>
                </div>

                <div className="mt-2.5 space-y-2">
                  {[...selectedClient.orders]
                    .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
                    .map((order) => {
                      const statusCfg =
                        ORDER_STATUSES[order.status] || ORDER_STATUSES.en_taller;
                      const itemsSummary = (order.items || [])
                        .map((item) => item.description)
                        .join(" · ");

                      return (
                        <button
                          key={order.id}
                          type="button"
                          onClick={() => onSelectOrder(order)}
                          className="group w-full rounded-xl border border-stone-200 p-3 text-left transition hover:border-amber-300 hover:bg-amber-50/20"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-bold text-stone-900 group-hover:text-amber-900">
                                {order.bikeBrand} {order.bikeModel}
                              </p>
                              <p className="mt-0.5 text-[10px] text-stone-400">
                                {formatDateDisplay(order.entryDate)}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <span
                                className={`inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${statusCfg.bg}`}
                              >
                                {statusCfg.shortLabel}
                              </span>
                              <p className="mt-1 font-mono text-[11px] font-bold text-stone-800">
                                {formatCLP(order.total)}
                              </p>
                            </div>
                          </div>

                          {itemsSummary ? (
                            <p className="mt-2 truncate text-[11px] text-stone-500">
                              {itemsSummary}
                            </p>
                          ) : null}

                          {order.notes ? (
                            <p className="mt-2 line-clamp-2 rounded-lg border border-amber-100 bg-amber-50/70 px-2 py-1.5 text-[10px] leading-relaxed text-amber-900">
                              {order.notes}
                            </p>
                          ) : null}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white/60 px-6 py-10 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                <UserRound className="h-5 w-5" />
              </div>
              <p className="text-[13px] font-bold text-stone-700">
                Selecciona un cliente
              </p>
              <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-stone-400">
                Verás su ficha, las bicicletas y todo el historial de mantenciones.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
