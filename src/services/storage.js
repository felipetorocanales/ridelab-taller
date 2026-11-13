import { INITIAL_ORDERS } from "../data/initialData";
import {
  isSupabaseConfigured,
  fetchOrdersFromSupabase,
  insertOrderToSupabase,
  updateOrderInSupabase,
  deleteOrderFromSupabase,
} from "./supabase";

const STORAGE_KEY = "ridelab_orders_v1";

export const getOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ORDERS;
  } catch (err) {
    console.error("Error reading orders from localStorage:", err);
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("ridelab_data_changed", { detail: orders }));
  } catch (err) {
    console.error("Error saving orders to localStorage:", err);
  }
};

export const addOrder = async (newOrder) => {
  const current = getOrders();
  const nextNumber = current.length + 1001;
  const orderWithCode = {
    ...newOrder,
    id: newOrder.id || `RL-${nextNumber}`,
    code: newOrder.code || `RL-${nextNumber}`,
    createdAt: newOrder.createdAt || new Date().toISOString(),
  };

  // 1. Guardado local inmediato (Optimistic UI)
  const updated = [orderWithCode, ...current];
  saveOrders(updated);

  // 2. Guardado en Supabase si está conectado
  if (isSupabaseConfigured()) {
    try {
      await insertOrderToSupabase(orderWithCode);
    } catch (e) {
      console.warn("No se pudo sincronizar inmediatamente con Supabase:", e);
    }
  }

  return orderWithCode;
};

export const updateOrder = async (updatedOrder) => {
  const current = getOrders();
  const updated = current.map((item) =>
    item.id === updatedOrder.id ? { ...item, ...updatedOrder } : item
  );

  // 1. Actualización local inmediata
  saveOrders(updated);

  // 2. Actualización en Supabase si está conectado
  if (isSupabaseConfigured()) {
    try {
      await updateOrderInSupabase(updatedOrder);
    } catch (e) {
      console.warn("No se pudo actualizar en Supabase:", e);
    }
  }

  return updatedOrder;
};

export const deleteOrder = async (orderId) => {
  const current = getOrders();
  const updated = current.filter((item) => item.id !== orderId);

  // 1. Eliminación local inmediata
  saveOrders(updated);

  // 2. Eliminación en Supabase si está conectado
  if (isSupabaseConfigured()) {
    try {
      await deleteOrderFromSupabase(orderId);
    } catch (e) {
      console.warn("No se pudo eliminar en Supabase:", e);
    }
  }

  return updated;
};

export const syncWithSupabase = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const remoteOrders = await fetchOrdersFromSupabase();
    if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
      saveOrders(remoteOrders);
      return remoteOrders;
    }
    return getOrders();
  } catch (e) {
    console.error("Error syncing with Supabase:", e);
    return null;
  }
};

export const resetToInitial = () => {
  saveOrders(INITIAL_ORDERS);
  return INITIAL_ORDERS;
};

export const exportBackupJSON = () => {
  const data = {
    appName: "RIDE LAB Taller",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    orders: getOrders(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `ridelab-respaldo-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importBackupJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    let ordersToLoad = [];
    if (Array.isArray(parsed)) {
      ordersToLoad = parsed;
    } else if (parsed && Array.isArray(parsed.orders)) {
      ordersToLoad = parsed.orders;
    } else {
      throw new Error("Formato de respaldo no válido");
    }
    saveOrders(ordersToLoad);
    return { success: true, count: ordersToLoad.length };
  } catch (err) {
    console.error("Error importing backup:", err);
    return { success: false, error: err.message };
  }
};

export const formatCLP = (amount) => {
  const num = Number(amount) || 0;
  return "$" + num.toLocaleString("es-CL");
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "Sin fecha";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
      ];
      return `${day} de ${months[month]}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};
