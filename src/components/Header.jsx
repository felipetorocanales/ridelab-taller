import React, { useEffect, useRef, useState } from "react";
import {
  Wrench,
  Plus,
  Database,
  Calendar,
  Search,
  Users,
  Cloud,
  Globe,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { isSupabaseConfigured } from "../services/supabase";

const NAV_ITEMS = [
  { id: "taller", label: "Taller", icon: Wrench },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "clientes", label: "Clientes", icon: Users },
];

export default function Header({
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const showSearch = currentTab !== "agenda";

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const runMenuAction = (action) => {
    setMenuOpen(false);
    action?.();
  };

  const searchField = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <input
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Buscar cliente o repuesto"
        aria-label="Buscar mantención"
        className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-10 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/15 lg:h-10 [&::-webkit-search-cancel-button]:hidden"
      />
      {searchQuery ? (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200 hover:text-stone-800"
        >
          <span aria-hidden="true" className="text-base leading-none">×</span>
        </button>
      ) : null}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f8f6f1]/95 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3 lg:h-16">
          <div className="flex min-w-0 items-center">
            <div className="mr-2.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[11px] border border-stone-200 bg-sand-100 shadow-sm">
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
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-extrabold leading-none tracking-tight text-stone-900">
                  RIDE LAB
                </span>
                <span className="hidden rounded-md border border-amber-200/70 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800 xl:inline">
                  Taller
                </span>
              </div>
              <p className="mt-1 truncate text-[10px] font-medium text-stone-500">
                Panel de mantención
              </p>
            </div>
          </div>

          <nav aria-label="Navegación principal" className="ml-2 hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setCurrentTab(item.id);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition ${
                    isActive
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-500 hover:bg-stone-200/60 hover:text-stone-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-amber-300" : "text-stone-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {showSearch ? <div className="hidden w-64 lg:block xl:w-72">{searchField}</div> : null}

            <button
              type="button"
              onClick={onOpenNewOrder}
              className="hidden h-10 items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.98] lg:inline-flex"
            >
              <Plus className="h-4 w-4 text-amber-300" strokeWidth={2.5} />
              Nueva mantención
            </button>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Menú y opciones"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white/70 text-stone-600 transition hover:bg-white hover:text-stone-900"
              >
                <MoreHorizontal className="h-5 w-5" />
                {isCloudActive ? (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                ) : null}
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="animate-sheet-in absolute right-0 top-[calc(100%+8px)] z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl"
                >
                  <div className="px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-stone-400">
                      Sesión activa
                    </p>
                    <p className="mt-0.5 truncate text-xs font-semibold text-stone-800">
                      {userEmail || "Mecánico RIDE LAB"}
                    </p>
                  </div>

                  <div className="my-1 h-px bg-stone-100" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => runMenuAction(onViewPublicSite)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    <Globe className="h-4 w-4 text-amber-700" />
                    Ver sitio público
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => runMenuAction(onOpenSupabase)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    <Cloud className="h-4 w-4 text-emerald-700" />
                    <span className="flex-1">Nube y sincronización</span>
                    <span
                      className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                        isCloudActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isCloudActive ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {isCloudActive ? "Conectado" : "Local"}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => runMenuAction(onOpenBackup)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    <Database className="h-4 w-4 text-stone-500" />
                    Respaldos y datos
                  </button>

                  {onLogout ? (
                    <>
                      <div className="my-1 h-px bg-stone-100" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => runMenuAction(onLogout)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {showSearch ? <div className="pb-3 lg:hidden">{searchField}</div> : null}
      </div>
    </header>
  );
}
