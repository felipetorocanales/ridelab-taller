import React, { useState } from "react";
import { User, Bike, ChevronRight, Search, Calendar, History, Plus, Wrench, MessageCircle } from "lucide-react";
import { formatCLP, formatDateDisplay } from "../services/storage";
import { ORDER_STATUSES } from "../data/serviceCatalog";

export default function ClientHistoryView({
  orders,
  onSelectOrder,
  onNewOrderForClient,
  searchQuery,
  setSearchQuery,
}) {
  const [selectedClientName, setSelectedClientName] = useState(null);

  // Group all orders by normalized client name
  const clientMap = {};
  orders.forEach((o) => {
    const rawName = (o.clientName || "Sin Nombre").trim();
    const key = rawName.toLowerCase();
    if (!clientMap[key]) {
      clientMap[key] = {
        name: rawName,
        phone: o.clientPhone || "",
        orders: [],
        bikes: new Set(),
      };
    }
    clientMap[key].orders.push(o);
    if (o.clientPhone && !clientMap[key].phone) {
      clientMap[key].phone = o.clientPhone;
    }
    if (o.bikeBrand || o.bikeModel) {
      clientMap[key].bikes.add(
        `${o.bikeBrand || ""} ${o.bikeModel || ""}`.trim() + (o.bikeSize ? ` (Talla ${o.bikeSize})` : "")
      );
    }
  });

  const clientsList = Object.values(clientMap).map((c) => ({
    ...c,
    bikes: Array.from(c.bikes),
    totalSpent: c.orders.reduce((sum, o) => sum + (o.total || 0), 0),
    lastVisit: c.orders.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))[0],
  }));

  // Filter clients based on search query
  const filteredClients = clientsList.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchName = c.name.toLowerCase().includes(q);
    const matchBikes = c.bikes.some((b) => b.toLowerCase().includes(q));
    const matchItems = c.orders.some((o) =>
      (o.items || []).some((item) => item.description.toLowerCase().includes(q))
    );
    const matchNotes = c.orders.some((o) => (o.notes || "").toLowerCase().includes(q));
    return matchName || matchBikes || matchItems || matchNotes;
  });

  const selectedClient = clientsList.find(
    (c) => c.name.toLowerCase() === (selectedClientName || "").toLowerCase()
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Intro Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-sand-100 text-stone-900 rounded-xl border border-sand-200">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Historial de Clientes & Bicicletas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Si un cliente te pregunta "¿Qué le hicimos a mi bici hace 2 meses y con qué talla/repuesto quedó?", búscalo aquí al instante.
            </p>
          </div>
        </div>
      </div>

      {/* Main split: List of Clients & Selected Client History */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Client Directory (Col 5) */}
        <div className="md:col-span-5 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Clientes Registrados ({filteredClients.length})
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredClients.map((c, idx) => {
              const isSelected = selectedClient?.name.toLowerCase() === c.name.toLowerCase();
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedClientName(c.name)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-amber-50/80 border-amber-300 shadow-sm ring-1 ring-amber-400"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{c.name}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <Bike className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span className="truncate">{c.bikes.join(", ") || "Bici no especificada"}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex-shrink-0">
                      {c.orders.length} {c.orders.length === 1 ? "visita" : "visitas"}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Último: {formatDateDisplay(c.lastVisit?.entryDate)}</span>
                    <span className="font-semibold text-slate-700 font-mono">
                      {formatCLP(c.totalSpent)}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200 p-4">
                No se encontraron clientes con "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Selected Client Full History Sheet (Col 7) */}
        <div className="md:col-span-7">
          {selectedClient ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              {/* Header profile */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-sand-200 text-stone-900 font-black flex items-center justify-center text-sm">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                        {selectedClient.name}
                      </h3>
                      {selectedClient.phone ? (
                        <p className="text-xs text-slate-500 font-mono">
                          {selectedClient.phone}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">Sin teléfono</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedClient.bikes.map((b, i) => (
                      <span
                        key={i}
                        className="text-xs bg-amber-50 text-amber-900 font-medium px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1"
                      >
                        <Bike className="w-3 h-3 text-amber-600" />
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Invertido</span>
                  <span className="text-lg font-black font-mono text-slate-900">
                    {formatCLP(selectedClient.totalSpent)}
                  </span>
                </div>
              </div>

              {/* Quick action button for this client */}
              <button
                onClick={() => onNewOrderForClient(selectedClient)}
                className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                Ingresar Nueva Mantención para {selectedClient.name}
              </button>

              {/* Chronological maintenance records list */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Línea de Tiempo de Trabajos ({selectedClient.orders.length})
                </h4>

                <div className="space-y-3">
                  {selectedClient.orders.map((o) => {
                    const st = ORDER_STATUSES[o.status] || ORDER_STATUSES.en_taller;
                    return (
                      <div
                        key={o.id}
                        onClick={() => onSelectOrder(o)}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition">
                                {o.bikeBrand} {o.bikeModel}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${st.bg}`}>
                                {st.shortLabel}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">
                              Fecha: {formatDateDisplay(o.entryDate)}
                            </span>
                          </div>

                          <span className="text-xs font-extrabold font-mono text-slate-900">
                            {formatCLP(o.total)}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg space-y-0.5">
                          {(o.items || []).map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>• {it.description}</span>
                              <span className="font-mono text-slate-700 font-medium">
                                {formatCLP(it.price)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Specs notes */}
                        {o.notes && (
                          <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
                            <strong>Nota técnica:</strong> {o.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
              <User className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">
                Selecciona un cliente para ver su ficha técnica completa
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Verás todas las mantenciones, repuestos instalados, fechas y detalles técnicos acumulados en el tiempo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
