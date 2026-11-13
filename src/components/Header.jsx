import React from "react";
import { Wrench, Plus, Database, Calendar, Search, Bike, CheckCircle2, Cloud, Globe, LogOut } from "lucide-react";
import { isSupabaseConfigured } from "../services/supabase";

export default function Header({
  orders,
  currentTab,
  setCurrentTab,
  onOpenNewOrder,
  onOpenBackup,
  onOpenSupabase,
  onViewPublicSite,
  onLogout,
  userEmail,
  searchQuery,
  setSearchQuery,
}) {
  const isCloudActive = isSupabaseConfigured();
  const inWorkshopCount = orders.filter((o) => o.status === "en_taller").length;
  const readyCount = orders.filter((o) => o.status === "listo").length;
  const scheduledCount = orders.filter((o) => o.status === "agendado").length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Top brand bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-amber-200/60 shadow-sm bg-sand-100 flex-shrink-0">
              <img
                src="./logo.jpg"
                alt="RIDE LAB"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                style={{ display: "none" }}
                className="w-full h-full bg-stone-900 text-amber-300 font-bold items-center justify-center text-xs"
              >
                RL
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                  RIDE LAB
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300/60">
                  Intranet Taller
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Panel de Control & Mantenciones
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onViewPublicSite}
              title="Ver Sitio Público y Agendamiento Online de RIDE LAB"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>Sitio Público</span>
            </button>

            <button
              onClick={onViewPublicSite}
              title="Ver Sitio Público"
              className="sm:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Globe className="w-4 h-4 text-amber-600" />
            </button>

            <button
              onClick={onOpenSupabase}
              title={isCloudActive ? "Supabase Conectado (Nube)" : "Conectar Supabase (Nube)"}
              className={`p-2 rounded-lg transition-colors border flex items-center gap-1.5 ${
                isCloudActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span
                className={`w-2 h-2 rounded-full ${
                  isCloudActive ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                }`}
              ></span>
            </button>

            <button
              onClick={onOpenBackup}
              title="Copias de seguridad y opciones"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Database className="w-4 h-4" />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                title={`Cerrar Sesión (${userEmail || "Mecánico"})`}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenNewOrder}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-stone-800 transition shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Nueva</span> Mantención
            </button>
          </div>
        </div>

        {/* Status badges summary */}
        <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-100 text-xs overflow-x-auto no-scrollbar pb-0.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>{inWorkshopCount} en taller</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{readyCount} listos para entrega</span>
          </div>

          {scheduledCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-100 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{scheduledCount} agendados</span>
            </div>
          )}

          <div className="ml-auto text-slate-400 font-medium text-[11px] hidden sm:block">
            Total histórico: {orders.length} bicis
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, bicicleta, repuesto (ej: Miguel, Polygon, tubeless)..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm rounded-xl border border-transparent focus:border-amber-400 focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
