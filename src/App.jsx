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
import { getOrders, saveOrders, addOrder, updateOrder, deleteOrder, syncWithSupabase } from "./services/storage";
import { isSupabaseConfigured, subscribeToOrdersRealtime, getAuthSession, signOutUser, subscribeToAuthChanges } from "./services/supabase";
import { ORDER_STATUSES } from "./data/serviceCatalog";
import { Wrench, Calendar, Users, Plus, CheckCircle2, SlidersHorizontal, Sparkles, Bike } from "lucide-react";

export default function App() {
  const [orders, setOrders] = useState([]);
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
    return "workshop_public"; // Por defecto, sitio web de RIDE LAB
  });
  const [currentTab, setCurrentTab] = useState("taller"); // 'taller' | 'agenda' | 'clientes'
  const [statusFilter, setStatusFilter] = useState("activos"); // 'activos' | 'todos' | 'en_taller' | 'listo' | 'entregado' | 'agendado'
  const [searchQuery, setSearchQuery] = useState("");

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [session, setSession] = useState(null);

  // Load orders and auth session on mount
  useEffect(() => {
    const loaded = getOrders();
    setOrders(loaded);

    // Check existing auth session
    getAuthSession().then((s) => {
      setSession(s);
    }).catch(console.error);

    const authSub = subscribeToAuthChanges((event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setViewMode("intranet");
      }
    });

    // Initial sync with Supabase in background
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

    // Realtime subscription if configured
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

  // Filter orders for the 'taller' tab
  const filteredOrders = orders.filter((o) => {
    // Status filter
    if (statusFilter === "activos") {
      if (o.status === "entregado") return false;
    } else if (statusFilter !== "todos") {
      if (o.status !== statusFilter) return false;
    }

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchName = (o.clientName || "").toLowerCase().includes(q);
    const matchBrand = (o.bikeBrand || "").toLowerCase().includes(q);
    const matchModel = (o.bikeModel || "").toLowerCase().includes(q);
    const matchCode = (o.code || "").toLowerCase().includes(q);
    const matchNotes = (o.notes || "").toLowerCase().includes(q);
    const matchItems = (o.items || []).some((item) =>
      (item.description || "").toLowerCase().includes(q)
    );

    return matchName || matchBrand || matchModel || matchCode || matchNotes || matchItems;
  });

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

  // 1. Vista SaaS corporativa TC Digital (si se entra por #saas)
  if (viewMode === "saas_tc") {
    return <LandingPage onEnterApp={handleOpenIntranet} />;
  }

  // 2. Si no hay sesión iniciada y se intenta entrar a la intranet, mostramos la página pública con el modal de login
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

  // 3. Vista Pública de RIDE LAB Taller (Página personalizada del taller con agendamiento online)
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

  // 4. Intranet del Taller (Panel del mecánico autenticado con bicicletas, agenda y clientes)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16 md:pb-6">
      {/* Top Fixed Header with Logo and Brand */}
      <Header
        orders={orders}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewOrder={() => {
          setEditingOrder(null);
          setIsNewModalOpen(true);
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onViewPublicSite={handleOpenPublicWorkshop}
        onLogout={handleLogout}
        userEmail={session?.user?.email}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* TAB 1: TALLER / TRABAJOS */}
        {currentTab === "taller" && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {[
                { id: "activos", label: "Activos en Taller" },
                { id: "todos", label: "Todos los Trabajos" },
                { id: "en_taller", label: "En Proceso" },
                { id: "listo", label: "Listos" },
                { id: "entregado", label: "Histórico Entregados" },
                { id: "agendado", label: "Agendados" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition border ${
                    statusFilter === pill.id
                      ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredOrders.map((order) => (
                  <WorkOrderCard
                    key={order.id}
                    order={order}
                    onSelect={(ord) => setSelectedOrder(ord)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200">
                  <Bike className="w-7 h-7 text-amber-700" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  ¡Tu Taller RIDE LAB está listo para operar!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Aún no hay bicicletas ingresadas. Registra tu primera mantención o espera a que tus clientes agenden en línea desde tu sitio web.
                </p>
                <div className="mt-5 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditingOrder(null);
                      setIsNewModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    Ingresar Primera Mantención
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="w-12 h-12 bg-sand-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  {searchQuery ? "No se encontraron coincidencias" : "No hay mantenciones en este estado"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? `Intenta con otro término o revisa el filtro aplicado.`
                    : `Puedes registrar una nueva mantención con el botón "+ Nueva Mantención".`}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 rounded-lg hover:bg-amber-100"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AGENDA Y CALENDARIO */}
        {currentTab === "agenda" && (
          <AgendaView
            orders={orders}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
          />
        )}

        {/* TAB 3: CLIENTES E HISTORIAL DETALLADO */}
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

      {/* Floating Action Button for mobile quick new order */}
      <button
        onClick={() => {
          setEditingOrder(null);
          setIsNewModalOpen(true);
        }}
        className="md:hidden fixed right-4 bottom-20 z-40 bg-stone-900 text-amber-400 p-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition border-2 border-white"
        title="Nueva Mantención"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation Bar (iOS App Style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 py-1.5 px-4 shadow-lg md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-3 md:rounded-2xl md:border">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentTab("taller")}
            className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition ${
              currentTab === "taller"
                ? "text-stone-900 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[10px]">Taller</span>
          </button>

          <button
            onClick={() => setCurrentTab("agenda")}
            className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition ${
              currentTab === "agenda"
                ? "text-stone-900 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Agenda</span>
          </button>

          <button
            onClick={() => setCurrentTab("clientes")}
            className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition ${
              currentTab === "clientes"
                ? "text-stone-900 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Clientes</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
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
