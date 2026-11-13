import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Bike, Wrench, Check, Calendar, DollarSign, Sparkles } from "lucide-react";
import { QUICK_SERVICES, BIKE_TYPES, ORDER_STATUSES } from "../data/serviceCatalog";
import { formatCLP } from "../services/storage";

export default function WorkOrderModal({ isOpen, onClose, onSave, editingOrder, existingOrders = [] }) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const defaultDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    bikeBrand: "",
    bikeModel: "",
    bikeType: "mtb",
    bikeSize: "",
    notes: "",
    serviceType: "Servicio Mantención",
    status: "en_taller",
    entryDate: todayStr,
    deliveryDate: defaultDelivery,
    items: [],
  });

  const [customItemDesc, setCustomItemDesc] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extract unique clients for auto-completion
  const clientSuggestions = Array.from(
    new Set(existingOrders.map((o) => o.clientName).filter(Boolean))
  ).map((name) => {
    const lastOrder = existingOrders.find((o) => o.clientName === name);
    return {
      name,
      bikeBrand: lastOrder?.bikeBrand || "",
      bikeModel: lastOrder?.bikeModel || "",
      bikeSize: lastOrder?.bikeSize || "",
      phone: lastOrder?.clientPhone || "",
    };
  });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        ...editingOrder,
        items: editingOrder.items ? [...editingOrder.items] : [],
      });
    } else {
      setFormData({
        clientName: "",
        clientPhone: "",
        bikeBrand: "",
        bikeModel: "",
        bikeType: "mtb",
        bikeSize: "",
        notes: "",
        serviceType: "Servicio Mantención",
        status: "en_taller",
        entryDate: todayStr,
        deliveryDate: defaultDelivery,
        items: [],
      });
    }
  }, [editingOrder, isOpen]);

  const total = formData.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const handleAddQuickService = (service) => {
    const newItem = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      description: service.description,
      price: service.price,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customItemDesc.trim()) return;
    const priceNum = parseInt(customItemPrice.replace(/\D/g, ""), 10) || 0;
    const newItem = {
      id: "custom-" + Date.now(),
      description: customItemDesc.trim(),
      price: priceNum,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setCustomItemDesc("");
    setCustomItemPrice("");
  };

  const handleRemoveItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleSelectClient = (c) => {
    setFormData((prev) => ({
      ...prev,
      clientName: c.name,
      clientPhone: c.phone || prev.clientPhone,
      bikeBrand: c.bikeBrand || prev.bikeBrand,
      bikeModel: c.bikeModel || prev.bikeModel,
      bikeSize: c.bikeSize || prev.bikeSize,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      alert("Por favor ingresa el nombre del cliente");
      return;
    }
    if (!formData.bikeModel.trim()) {
      alert("Por favor ingresa el modelo o tipo de bicicleta");
      return;
    }

    const orderToSave = {
      ...formData,
      total,
      updatedAt: new Date().toISOString(),
    };

    onSave(orderToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-900">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg leading-tight">
                {editingOrder ? "Editar Mantención" : "Nueva Mantención"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingOrder ? `Código: ${editingOrder.code}` : "Registro rápido de taller"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Cliente */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cliente *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Miguel Ángel, Patricio, Cristian Pinto"
              value={formData.clientName}
              onChange={(e) => {
                setFormData({ ...formData, clientName: e.target.value });
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-medium"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && formData.clientName && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {clientSuggestions
                  .filter((c) => c.name.toLowerCase().includes(formData.clientName.toLowerCase()))
                  .map((c, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => handleSelectClient(c)}
                      className="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-xs flex items-center justify-between border-b border-slate-100 last:border-0"
                    >
                      <span className="font-semibold text-slate-800">{c.name}</span>
                      <span className="text-slate-500 text-[11px]">
                        {c.bikeBrand} {c.bikeModel} {c.bikeSize ? `(${c.bikeSize})` : ""}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Teléfono WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Teléfono WhatsApp (opcional)
            </label>
            <input
              type="tel"
              placeholder="+56 9 1234 5678"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-amber-500 text-sm"
            />
          </div>

          {/* Bicicleta: Marca & Modelo & Talla */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Bike className="w-4 h-4 text-amber-600" />
              Datos de la Bicicleta
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Marca
                </label>
                <input
                  type="text"
                  placeholder="Ej: Polygon, Whyte, Trek"
                  value={formData.bikeBrand}
                  onChange={(e) => setFormData({ ...formData, bikeBrand: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Modelo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Collosus N7, Clash"
                  value={formData.bikeModel}
                  onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Tipo
                </label>
                <select
                  value={formData.bikeType}
                  onChange={(e) => setFormData({ ...formData, bikeType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  {BIKE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Talla / Especificación
                </label>
                <input
                  type="text"
                  placeholder="Ej: M, L, S4, 54cm"
                  value={formData.bikeSize}
                  onChange={(e) => setFormData({ ...formData, bikeSize: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Notas técnicas / Calibración (presiones, tokens, desgaste)
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Quedó con 75 psi en horquilla, pastillas al 80%, cadena OK..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          {/* Servicios y Repuestos Realizados */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Trabajos & Repuestos
              </label>
              <span className="text-xs font-bold text-slate-900 font-mono">
                Total: {formatCLP(total)}
              </span>
            </div>

            {/* Quick chips buttons */}
            <div>
              <p className="text-[11px] text-slate-500 mb-1.5 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" /> Toque rápido para agregar:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                {QUICK_SERVICES.map((s, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleAddQuickService(s)}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-amber-100 hover:text-amber-900 border border-slate-200 rounded-lg text-slate-700 font-medium transition active:scale-95"
                  >
                    + {s.description} ({formatCLP(s.price)})
                  </button>
                ))}
              </div>
            </div>

            {/* Current Items Table / List */}
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {formData.items.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  No hay ítems agregados aún. Usa los botones arriba o añade uno personalizado.
                </div>
              ) : (
                formData.items.map((item, idx) => (
                  <div key={item.id || idx} className="p-2.5 flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-800 flex-1 truncate">
                      {item.description}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatCLP(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Custom Item Inputs */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Otro servicio o repuesto..."
                value={customItemDesc}
                onChange={(e) => setCustomItemDesc(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
              <input
                type="number"
                placeholder="Precio ($)"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddCustomItem}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Fechas y Estado */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fecha Ingreso
              </label>
              <input
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fecha Entrega
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          {/* Estado Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Estado del Trabajo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {Object.entries(ORDER_STATUSES).map(([key, cfg]) => {
                const isSelected = formData.status === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setFormData({ ...formData, status: key })}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                      isSelected
                        ? `${cfg.bg} ring-2 ring-slate-900/10 font-bold`
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cfg.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm shadow transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 text-amber-400" />
            {editingOrder ? "Guardar Cambios" : "Ingresar Mantención"}
          </button>
        </div>
      </div>
    </div>
  );
}
