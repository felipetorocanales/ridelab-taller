import { createClient } from "@supabase/supabase-js";

const CONFIG_STORAGE_KEY = "ridelab_supabase_config_v1";

const DEFAULT_SUPABASE_URL = "https://hvbjvnrmtlhlcosootsw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2Ymp2bnJtdGxobGNvc29vdHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzE3NTYsImV4cCI6MjExMDE0Nzc1Nn0.gaxPUYjFVfGSwK0llxAhOnjU0KGgZe0XNNwpLv03Vac";

// 1. Obtener credenciales desde localStorage, variables .env o defaults del proyecto
export const getSupabaseConfig = () => {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading supabase config from storage:", e);
  }

  const envUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    import.meta.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    import.meta.env.SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
};

export const saveSupabaseConfig = (url, anonKey) => {
  const cleanUrl = (url || "").trim();
  const cleanKey = (anonKey || "").trim();
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ url: cleanUrl, anonKey: cleanKey }));
  _supabaseInstance = null; // Reiniciar instancia
  window.dispatchEvent(new CustomEvent("ridelab_supabase_config_changed"));
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  _supabaseInstance = null;
  window.dispatchEvent(new CustomEvent("ridelab_supabase_config_changed"));
};

let _supabaseInstance = null;

export const getSupabaseClient = () => {
  if (_supabaseInstance) return _supabaseInstance;
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      _supabaseInstance = createClient(config.url, config.anonKey);
      return _supabaseInstance;
    } catch (e) {
      console.error("Error creating Supabase client:", e);
      return null;
    }
  }
  return null;
};

export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

// Conversión de formato Supabase (snake_case) a formato interno (camelCase)
export const mapSupabaseToOrder = (row) => ({
  id: row.id,
  code: row.code,
  clientName: row.client_name,
  clientPhone: row.client_phone || "",
  bikeBrand: row.bike_brand || "",
  bikeModel: row.bike_model || "",
  bikeType: row.bike_type || "mtb",
  bikeSize: row.bike_size || "",
  notes: row.notes || "",
  serviceType: row.service_type || "Servicio Mantención",
  items: Array.isArray(row.items) ? row.items : [],
  total: Number(row.total) || 0,
  status: row.status || "en_taller",
  entryDate: row.entry_date || "",
  deliveryDate: row.delivery_date || "",
  completedDate: row.completed_date || "",
  createdAt: row.created_at || new Date().toISOString(),
});

// Conversión de formato interno (camelCase) a Supabase (snake_case)
export const mapOrderToSupabase = (order) => ({
  id: order.id,
  code: order.code,
  client_name: order.clientName,
  client_phone: order.clientPhone || "",
  bike_brand: order.bikeBrand || "",
  bike_model: order.bikeModel,
  bike_type: order.bikeType || "mtb",
  bike_size: order.bikeSize || "",
  notes: order.notes || "",
  service_type: order.serviceType || "Servicio Mantención",
  items: order.items || [],
  total: Number(order.total) || 0,
  status: order.status || "en_taller",
  entry_date: order.entryDate || "",
  delivery_date: order.deliveryDate || "",
  completed_date: order.completedDate || null,
  updated_at: new Date().toISOString(),
});

// Operaciones remotas con Supabase
export const fetchOrdersFromSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase no está configurado");

  const { data, error } = await client
    .from("orders")
    .select("*")
    .order("entry_date", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapSupabaseToOrder);
};

export const insertOrderToSupabase = async (order) => {
  const client = getSupabaseClient();
  if (!client) return null;
  const payload = mapOrderToSupabase(order);
  const { data, error } = await client.from("orders").insert([payload]).select();
  if (error) {
    console.error("Error inserting to Supabase:", error);
    throw error;
  }
  return data?.[0] ? mapSupabaseToOrder(data[0]) : order;
};

export const updateOrderInSupabase = async (order) => {
  const client = getSupabaseClient();
  if (!client) return null;
  const payload = mapOrderToSupabase(order);
  const { data, error } = await client
    .from("orders")
    .update(payload)
    .eq("id", order.id)
    .select();
  if (error) {
    console.error("Error updating Supabase:", error);
    throw error;
  }
  return data?.[0] ? mapSupabaseToOrder(data[0]) : order;
};

export const deleteOrderFromSupabase = async (orderId) => {
  const client = getSupabaseClient();
  if (!client) return false;
  const { error } = await client.from("orders").delete().eq("id", orderId);
  if (error) {
    console.error("Error deleting from Supabase:", error);
    throw error;
  }
  return true;
};

export const uploadBatchToSupabase = async (ordersList) => {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase no configurado");
  const payload = ordersList.map(mapOrderToSupabase);
  const { error } = await client.from("orders").upsert(payload, { onConflict: "id" });
  if (error) throw error;
  return true;
};

// Suscripción en tiempo real (WebSockets de Supabase)
export const subscribeToOrdersRealtime = (onChangeCallback) => {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const channel = client
    .channel("public:orders")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      (payload) => {
        onChangeCallback(payload);
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};

// -------------------------------------------------------------
// Catálogo de Servicios en Supabase
// -------------------------------------------------------------
export const mapSupabaseToService = (row) => ({
  id: row.id,
  code: row.code || "",
  name: row.name || "",
  description: row.description || "",
  price: Number(row.price) || 0,
  priceLabel: row.price_label || "",
  category: row.category || "mantencion",
  showInLanding: Boolean(row.show_in_landing),
  showInBooking: row.show_in_booking !== false,
  showInQuickAdd: row.show_in_quick_add !== false,
  active: row.active !== false,
  sortOrder: Number(row.sort_order) || 0,
  createdAt: row.created_at || new Date().toISOString(),
});

export const mapServiceToSupabase = (service) => ({
  id: service.id,
  code: service.code || "",
  name: service.name || "",
  description: service.description || "",
  price: Number(service.price) || 0,
  price_label: service.priceLabel || "",
  category: service.category || "mantencion",
  show_in_landing: Boolean(service.showInLanding),
  show_in_booking: service.showInBooking !== false,
  show_in_quick_add: service.showInQuickAdd !== false,
  active: service.active !== false,
  sort_order: Number(service.sortOrder) || 0,
  updated_at: new Date().toISOString(),
});

export const fetchServicesFromSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase no está configurado");

  const { data, error } = await client
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("code", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapSupabaseToService);
};

export const insertServiceToSupabase = async (service) => {
  const client = getSupabaseClient();
  if (!client) return null;
  const payload = mapServiceToSupabase(service);
  const { data, error } = await client.from("services").insert([payload]).select();
  if (error) {
    console.error("Error inserting service to Supabase:", error);
    throw error;
  }
  return data?.[0] ? mapSupabaseToService(data[0]) : service;
};

export const updateServiceInSupabase = async (service) => {
  const client = getSupabaseClient();
  if (!client) return null;
  const payload = mapServiceToSupabase(service);
  const { data, error } = await client
    .from("services")
    .update(payload)
    .eq("id", service.id)
    .select();
  if (error) {
    console.error("Error updating service in Supabase:", error);
    throw error;
  }
  return data?.[0] ? mapSupabaseToService(data[0]) : service;
};

export const deleteServiceFromSupabase = async (serviceId) => {
  const client = getSupabaseClient();
  if (!client) return false;
  const { error } = await client.from("services").delete().eq("id", serviceId);
  if (error) {
    console.error("Error deleting service from Supabase:", error);
    throw error;
  }
  return true;
};

export const subscribeToServicesRealtime = (onChangeCallback) => {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const channel = client
    .channel("public:services")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "services" },
      (payload) => {
        onChangeCallback(payload);
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};

// -------------------------------------------------------------
// Autenticación de Supabase (Para la Intranet del Taller)
// -------------------------------------------------------------
export const signInWithEmail = async (email, password) => {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase no inicializado");
  return await client.auth.signInWithPassword({ email, password });
};

export const signOutUser = async () => {
  const client = getSupabaseClient();
  if (!client) return;
  return await client.auth.signOut();
};

export const getAuthSession = async () => {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data?.session || null;
};

export const subscribeToAuthChanges = (callback) => {
  const client = getSupabaseClient();
  if (!client) return { unsubscribe: () => {} };
  const { data } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return data.subscription;
};
