import { createClient } from "@supabase/supabase-js";

const CONFIG_STORAGE_KEY = "ridelab_supabase_config_v1";

// 1. Obtener credenciales desde localStorage o desde variables de entorno .env
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
    "";
  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    import.meta.env.SUPABASE_ANON_KEY ||
    "";

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  return { url: "", anonKey: "" };
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
  const { data, error } = await client.from("orders").upsert(payload, { onConflict: "id" });
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
