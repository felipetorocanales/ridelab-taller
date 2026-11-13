import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import WorkshopPublicPage from "./components/WorkshopPublicPage";
import WorkOrderCard from "./components/WorkOrderCard";
import WorkOrderModal from "./components/WorkOrderModal";
import DetailModal from "./components/DetailModal";
import AgendaView from "./components/AgendaView";
import ClientHistoryView from "./components/ClientHistoryView";
import BackupModal from "./components/BackupModal";
import SupabaseModal from "./components/SupabaseModal";
import LoginModal from "./components/LoginModal";
import { getOrders, addOrder, updateOrder, deleteOrder, syncWithSupabase } from "./services/storage";
import { isSupabaseConfigured, subscribeToOrdersRealtime, getAuthSession, signOutUser, subscribeToAuthChanges } from "./services/supabase";
import { Wrench, Calendar, Users, Plus, Bike, SearchX, ChevronRight } from "lucide-react";

const TAB_ITEMS = [
  { id: "taller", label: "Taller", icon: Wrench },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "clientes", label: "Clientes", icon: Users },
];

const STATUS_FILTERS = [
  { id: "activos", label: "Activos" },
  { id: "en_taller", label: "En taller" },
  { id: "listo", label: "Listos" },
  { id: "agendado", label: "Agendados" },
  { id: "entregado", label: "Entregados" },
];

export default function App() {
  const [orders, setOrders] = useState(() => getOrders());
  const [viewMode, setViewMode] = useState(() => {
    try {
      const path = (window.location.pathname || "").toLowerCase();
      const hash = (window.location.hash || "").toLowerCase();
      if (path.includes("intranet") || path.includes("app") || path.includes("taller") ||
          hash.includes("intranet") || hash.includes("app") || hash.includes("taller")) {
        return "intranet";
      }
      if (path.includes("saas") || hash.includes("saas") || hash.includes("tcdigital")) {
        return "saas_tc";
      }
      const saved = localStorage.getItem("ridelab_view_mode");
      if (saved === "intranet") return "intranet";
    } catch {}
    return "workshop_public";
  });
  const [currentTab, setCurrentTab] = useState("taller");
  const [statusFilter, setStatusFilter] = useState("activos");
  const [searchQuery, setSearchQuery] = useState("");

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const loaded = getOrders();
    setOrders(loaded);

    getAuthSession().then((s) => {
      setSession(s);
    }).catch(console.error);

    const authSub = subscribeToAuthChanges((event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setViewMode("intranet");
      }
    });

    if (isSupabaseConfigured()) {
      syncWithSupabase().then((remote) => {
        if (remote) setOrders(remote);
      }).catch(console.error);
    }

    const handleStorageChange = (e) => {
      if (e.detail) {
        setOrders(e.detail);
      } else {
        setOrders(getOrders());
      }
    };

    const handleConfigChange = () => {
      if (isSupabaseConfigured()) {
        syncWithSupabase().then((remote) => {
          if (remote) setOrders(remote);
        }).catch(console.error);
      }
    };

    const handleNavigationChange = () => {
      try {
        const path = (window.location.pathname || "").toLowerCase();
        const hash = (window.location.hash || "").toLowerCase();
        if (path.includes("intranet") || path.includes("app") || path.includes("taller") ||
            hash.includes("intranet") || hash.includes("app") || hash.includes("taller")) {
          setViewMode("intranet");
        } else if (path.includes("saas") || hash.includes("saas") || hash.includes("tcdigital")) {
          setViewMode("saas_tc");
        } else {
          setViewMode("workshop_public");
        }
      } catch {}
    };

    window.addEventListener("hashchange", handleNavigationChange);
    window.addEventListener("popstate", handleNavigationChange);
    window.addEventListener("ridelab_data_changed", handleStorageChange);
    window.addEventListener("ridelab_supabase_config_changed", handleConfigChange);

    let unsubscribe = () => {};
    if (isSupabaseConfigured()) {
      unsubscribe = subscribeToOrdersRealtime(() => {
        syncWithSupabase();
      });
    }

    return () => {
      window.removeEventListener("hashchange", handleNavigationChange);
      window.removeEventListener("popstate", handleNavigationChange);
      window.removeEventListener("ridelab_data_changed", handleStorageChange);
      window.removeEventListener("ridelab_supabase_config_changed", handleConfigChange);
      if (authSub && typeof authSub.unsubscribe === "function") {
        authSub.unsubscribe();
      }
      unsubscribe();
    };
  }, []);

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      updateOrder(orderData);
      if (selectedOrder && selectedOrder.id === orderData.id) {
        setSelectedOrder(orderData);
      }
    } else {
      addOrder(orderData);
    }
    setEditingOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    const updated = {
      ...target,
      status: newStatus,
      completedDate: newStatus === "listo" || newStatus === "entregado" ? new Date().toISOString().split("T")[0] : target.completedDate,
    };
    updateOrder(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated);
    }
  };

  const handleDeleteOrder = (orderId) => {
    deleteOrder(orderId);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(null);
    }
  };

  const handleNewOrderForClient = (client) => {
    setEditingOrder({
      clientName: client.name,
      clientPhone: client.phone || "",
      bikeBrand: client.lastVisit?.bikeBrand || "",
      bikeModel: client.lastVisit?.bikeModel || "",
      bikeSize: client.lastVisit?.bikeSize || "",
      bikeType: client.lastVisit?.bikeType || "mtb",
      serviceType: "Servicio Mantención",
      status: "en_taller",
      items: [{ id: "i1", description: "Mantención completa MTB", price: 55000 }],
      entryDate: new Date().toISOString().split("T")[0],
    });
    setIsNewModalOpen(true);
  };

  const handleOpenNewOrder = () => {
    setEditingOrder(null);
    setIsNewModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  // Búsqueda global: cuando hay texto, se ignoran los filtros de estado.
  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      if (statusFilter === "activos") {
        if (o.status === "entregado") return false;
      } else if (statusFilter !== "todos" && o.status !== statusFilter) {
        return false;
      }
      return true;
    }

    return (
      (o.clientName || "").toLowerCase().includes(query) ||
      (o.bikeBrand || "").toLowerCase().includes(query) ||
      (o.bikeModel || "").toLowerCase().includes(query) ||
      (o.code || "").toLowerCase().includes(query) ||
      (o.notes || "").toLowerCase().includes(query) ||
      (o.items || []).some((item) => (item.description || "").toLowerCase().includes(query))
    );
  });

  const counts = {
    activos: orders.filter((o) => o.status !== "entregado").length,
    en_taller: orders.filter((o) => o.status === "en_taller").length,
    listo: orders.filter((o) => o.status === "listo").length,
    agendado: orders.filter((o) => o.status === "agendado").length,
    entregado: orders.filter((o) => o.status === "entregado").length,
  };

  const handleOpenIntranet = () => {
    if (!session) {
      setIsLoginModalOpen(true);
      return;
    }
    setViewMode("intranet");
    localStorage.setItem("ridelab_view_mode", "intranet");
    window.location.hash = "#intranet";
  };

  const handleLoginSuccess = (newSession) => {
    setSession(newSession);
    setIsLoginModalOpen(false);
    setViewMode("intranet");
    localStorage.setItem("ridelab_view_mode", "intranet");
    window.location.hash = "#intranet";
  };

  const handleLogout = async () => {
    await signOutUser();
    setSession(null);
    setViewMode("workshop_public");
    localStorage.removeItem("ridelab_view_mode");
    window.location.hash = "";
  };

  const handleOpenPublicWorkshop = () => {
    setViewMode("workshop_public");
    localStorage.removeItem("ridelab_view_mode");
    window.location.hash = "";
  };

  const handleBookingSubmitted = (newBookingOrder) => {
    const saved = addOrder(newBookingOrder);
    setOrders(getOrders());
    return saved;
  };

  if (viewMode === "saas_tc") {
    return <LandingPage onEnterApp={handleOpenIntranet} />;
  }

  if (viewMode === "intranet" && !session) {
    return (
      <>
        <WorkshopPublicPage
          onOpenIntranet={handleOpenIntranet}
          onBookingSubmitted={handleBookingSubmitted}
        />
        <LoginModal
          isOpen={true}
          onClose={() => {
            setIsLoginModalOpen(false);
            setViewMode("workshop_public");
            window.location.hash = "";
          }}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  if (viewMode === "workshop_public") {
    return (
      <>
        <WorkshopPublicPage
          onOpenIntranet={handleOpenIntranet}
          onBookingSubmitted={handleBookingSubmitted}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#f6f4ef] text-stone-900">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewOrder={handleOpenNewOrder}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onViewPublicSite={handleOpenPublicWorkshop}
        onLogout={handleLogout}
        userEmail={session?.user?.email}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pb-mobile-nav mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 sm:pt-6 lg:pb-12">
        {currentTab === "taller" && (
          <section aria-labelledby="trabajos-title">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800/80">
                  Panel de taller
                </p>
                <h1
                  id="trabajos-title"
                  className="mt-0.5 text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl"
                >
                  Trabajos
                </h1>
              </div>
              <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                {orders.length === 0
                  ? "Sin trabajos"
                  : `${filteredOrders.length} ${filteredOrders.length === 1 ? "trabajo" : "trabajos"}`}
              </span>
            </div>

            {searchQuery ? (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200/70 bg-amber-50/70 px-3 py-2.5">
                <p className="min-w-0 truncate text-xs font-medium text-amber-900">
                  Resultados para “{searchQuery}” en todos los estados
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 text-xs font-bold text-amber-900 underline underline-offset-2 hover:text-amber-950"
                >
                  Limpiar
                </button>
              </div>
            ) : orders.length > 0 ? (
              <div className="relative -mx-4 mb-4 sm:mx-0">
                <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 pr-8 sm:px-0">
                  {STATUS_FILTERS.map((filter) => {
                    const isActive = statusFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setStatusFilter(filter.id)}
                        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition ${
                          isActive
                            ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                            : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
                        }`}
                      >
                        {filter.label}
                        <span
                          className={`text-[10px] font-bold tabular-nums ${
                            isActive ? "text-amber-300" : "text-stone-500"
                          }`}
                        >
                          {counts[filter.id]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-end bg-gradient-to-l from-[#f6f4ef] via-[#f6f4ef]/85 to-transparent sm:hidden">
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                </div>
              </div>
            ) : null}

            {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
                {filteredOrders.map((order) => (
                  <WorkOrderCard
                    key={order.id}
                    order={order}
                    onSelect={(ord) => setSelectedOrder(ord)}
                  />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <EmptyPanel
                icon={<Bike className="h-7 w-7" />}
                title="Aún no hay trabajos registrados"
                description="Ingresa la primera mantención desde el botón Nueva, en la barra inferior. También puedes recibir reservas desde tu sitio público."
              />
            ) : searchQuery ? (
              <EmptyPanel
                icon={<SearchX className="h-6 w-6" />}
                title="Sin resultados"
                description={`No encontramos coincidencias para “${searchQuery}”. Prueba con el nombre del cliente, la marca o un repuesto.`}
                action={
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                  >
                    Limpiar búsqueda
                  </button>
                }
              />
            ) : (
              <EmptyPanel
                icon={<Wrench className="h-6 w-6" />}
                title="No hay trabajos en este estado"
                description="Cambia el filtro para ver otros trabajos del taller."
                action={
                  <button
                    type="button"
                    onClick={() => setStatusFilter("activos")}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                  >
                    Ver activos
                  </button>
                }
              />
            )}
          </section>
        )}

        {currentTab === "agenda" && (
          <AgendaView orders={orders} onSelectOrder={(ord) => setSelectedOrder(ord)} />
        )}

        {currentTab === "clientes" && (
          <ClientHistoryView
            orders={orders}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onNewOrderForClient={handleNewOrderForClient}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </main>

      <nav
        aria-label="Navegación de la aplicación"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200/80 bg-white shadow-[0_-4px_16px_-12px_rgba(28,27,24,0.25)] lg:hidden"
      >
        <div className="mx-auto grid w-full max-w-md grid-cols-4 gap-0.5 px-2 pb-[env(safe-area-inset-bottom)]">
          {TAB_ITEMS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-[58px] flex-col items-center justify-center gap-0.5 py-1.5"
              >
                <span
                  className={`flex h-8 w-11 items-center justify-center rounded-full transition ${
                    isActive ? "bg-amber-100 text-stone-900" : "text-stone-500"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.3 : 1.9} />
                </span>
                <span
                  className={`text-[10px] leading-none ${
                    isActive ? "font-bold text-stone-900" : "font-medium text-stone-500"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleOpenNewOrder}
            aria-label="Nueva mantención"
            className="flex min-h-[58px] flex-col items-center justify-center gap-0.5 py-1.5"
          >
            <span className="flex h-8 w-11 items-center justify-center rounded-full bg-stone-900 text-amber-300 shadow-sm transition active:scale-95">
              <Plus className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </span>
            <span className="text-[10px] font-bold leading-none text-stone-900">Nueva</span>
          </button>
        </div>
      </nav>

      <WorkOrderModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveOrder}
        editingOrder={editingOrder}
        existingOrders={orders}
      />

      <DetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onEdit={(ord) => {
          setEditingOrder(ord);
          setSelectedOrder(null);
          setIsNewModalOpen(true);
        }}
        onDelete={handleDeleteOrder}
        onStatusChange={handleStatusChange}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={() => setOrders(getOrders())}
        totalOrders={orders.length}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSyncSuccess={() => {
          syncWithSupabase().then((remote) => {
            if (remote) setOrders(remote);
          });
        }}
      />
    </div>
  );
}

function EmptyPanel({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200/90 bg-white px-6 py-10 text-center shadow-[0_1px_2px_rgba(28,27,24,0.03)] sm:py-12">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/70 bg-amber-50 text-amber-800">
        {icon}
      </div>
      <h2 className="text-[15px] font-bold text-stone-900">{title}</h2>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-stone-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
