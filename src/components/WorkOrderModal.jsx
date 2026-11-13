import React, { useEffect, useState } from "react";
import { Plus, Trash2, Bike, Wrench, Check, Calendar, Sparkles } from "lucide-react";
import Modal from "./ui/Modal";
import { QUICK_SERVICES, BIKE_TYPES, ORDER_STATUSES } from "../data/serviceCatalog";
import { formatCLP, getLocalDateISO } from "../services/storage";

const emptyForm = (todayStr, defaultDelivery) => ({
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

const createDefaultForm = () => {
  const today = new Date();
  const delivery = new Date();
  delivery.setDate(delivery.getDate() + 2);
  return emptyForm(getLocalDateISO(today), getLocalDateISO(delivery));
};

export default function WorkOrderModal({ isOpen, onClose, onSave, editingOrder, existingOrders = [] }) {
  const [formData, setFormData] = useState(createDefaultForm);
  const [customItemDesc, setCustomItemDesc] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const clientSuggestions = Array.from(
    new Set(existingOrders.map((order) => order.clientName).filter(Boolean))
  ).map((name) => {
    const lastOrder = existingOrders.find((order) => order.clientName === name);
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
        ...createDefaultForm(),
        ...editingOrder,
        items: editingOrder.items ? [...editingOrder.items] : [],
      });
    } else {
      setFormData(createDefaultForm());
    }
    setCustomItemDesc("");
    setCustomItemPrice("");
    setShowSuggestions(false);
  }, [editingOrder, isOpen]);

  const total = formData.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const handleAddQuickService = (service) => {
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      description: service.description,
      price: service.price,
    };
    setFormData((previous) => ({ ...previous, items: [...previous.items, newItem] }));
  };

  const handleAddCustomItem = (event) => {
    event.preventDefault();
    if (!customItemDesc.trim()) return;
    const priceNumber = parseInt(customItemPrice.replace(/\D/g, ""), 10) || 0;
    const newItem = {
      id: `custom-${Date.now()}`,
      description: customItemDesc.trim(),
      price: priceNumber,
    };
    setFormData((previous) => ({ ...previous, items: [...previous.items, newItem] }));
    setCustomItemDesc("");
    setCustomItemPrice("");
  };

  const handleRemoveItem = (id) => {
    setFormData((previous) => ({
      ...previous,
      items: previous.items.filter((item) => item.id !== id),
    }));
  };

  const handleSelectClient = (client) => {
    setFormData((previous) => ({
      ...previous,
      clientName: client.name,
      clientPhone: client.phone || previous.clientPhone,
      bikeBrand: client.bikeBrand || previous.bikeBrand,
      bikeModel: client.bikeModel || previous.bikeModel,
      bikeSize: client.bikeSize || previous.bikeSize,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (event) => {
    event?.preventDefault();
    if (!formData.clientName.trim()) {
      alert("Por favor ingresa el nombre del cliente");
      return;
    }
    if (!formData.bikeModel.trim()) {
      alert("Por favor ingresa el modelo o tipo de bicicleta");
      return;
    }

    onSave({
      ...formData,
      total,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingOrder ? "Editar mantención" : "Nueva mantención"}
      subtitle={editingOrder ? `Código ${editingOrder.code}` : "Registro rápido de taller"}
      icon={<Wrench className="h-5 w-5" />}
      footer={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 shrink-0 rounded-xl border border-stone-200 px-4 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.99]"
          >
            <Check className="h-4 w-4 text-amber-300" />
            {editingOrder ? (
              <>
                <span className="sm:hidden">Guardar</span>
                <span className="hidden sm:inline">Guardar cambios</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">Ingresar</span>
                <span className="hidden sm:inline">Ingresar mantención</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <label
            htmlFor="client-name"
            className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500"
          >
            Cliente
          </label>
          <input
            id="client-name"
            type="text"
            required
            autoComplete="off"
            placeholder="Nombre del cliente"
            value={formData.clientName}
            onChange={(event) => {
              setFormData({ ...formData, clientName: event.target.value });
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
          />

          {showSuggestions && formData.clientName && clientSuggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-44 overflow-y-auto rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
              {clientSuggestions
                .filter((client) =>
                  client.name.toLowerCase().includes(formData.clientName.toLowerCase())
                )
                .map((client) => (
                  <button
                    type="button"
                    key={client.name}
                    onClick={() => handleSelectClient(client)}
                    className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left transition hover:bg-amber-50"
                  >
                    <span className="truncate text-xs font-semibold text-stone-800">
                      {client.name}
                    </span>
                    <span className="shrink-0 truncate text-[10px] text-stone-400">
                      {client.bikeBrand} {client.bikeModel}
                      {client.bikeSize ? ` (${client.bikeSize})` : ""}
                    </span>
                  </button>
                ))}
            </div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="client-phone"
            className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500"
          >
            Teléfono WhatsApp <span className="font-medium normal-case text-stone-400">(opcional)</span>
          </label>
          <input
            id="client-phone"
            type="tel"
            inputMode="tel"
            placeholder="+56 9 1234 5678"
            value={formData.clientPhone}
            onChange={(event) => setFormData({ ...formData, clientPhone: event.target.value })}
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
          />
        </div>

        <div className="space-y-3 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-600">
            <Bike className="h-4 w-4 text-amber-700" />
            Datos de la bicicleta
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="bike-brand" className="mb-1 block text-[10px] font-semibold text-stone-500">
                Marca
              </label>
              <input
                id="bike-brand"
                type="text"
                placeholder="Polygon"
                value={formData.bikeBrand}
                onChange={(event) => setFormData({ ...formData, bikeBrand: event.target.value })}
                className="h-10 w-full rounded-lg border border-stone-200 bg-white px-2.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="bike-model" className="mb-1 block text-[10px] font-semibold text-stone-500">
                Modelo *
              </label>
              <input
                id="bike-model"
                type="text"
                required
                placeholder="Collosus N7"
                value={formData.bikeModel}
                onChange={(event) => setFormData({ ...formData, bikeModel: event.target.value })}
                className="h-10 w-full rounded-lg border border-stone-200 bg-white px-2.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="bike-type" className="mb-1 block text-[10px] font-semibold text-stone-500">
                Tipo
              </label>
              <select
                id="bike-type"
                value={formData.bikeType}
                onChange={(event) => setFormData({ ...formData, bikeType: event.target.value })}
                className="h-10 w-full rounded-lg border border-stone-200 bg-white px-2 text-sm text-stone-800 focus:border-amber-400 focus:outline-none"
              >
                {BIKE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bike-size" className="mb-1 block text-[10px] font-semibold text-stone-500">
                Talla
              </label>
              <input
                id="bike-size"
                type="text"
                placeholder="M, L, S4..."
                value={formData.bikeSize}
                onChange={(event) => setFormData({ ...formData, bikeSize: event.target.value })}
                className="h-10 w-full rounded-lg border border-stone-200 bg-white px-2.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bike-notes" className="mb-1 block text-[10px] font-semibold text-stone-500">
              Notas técnicas <span className="font-normal text-stone-400">(presiones, desgaste, calibración)</span>
            </label>
            <textarea
              id="bike-notes"
              rows={2}
              placeholder="Ej: horquilla a 75 psi, pastillas al 80%, cadena OK..."
              value={formData.notes}
              onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
              className="w-full resize-none rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
              Trabajos y repuestos
            </label>
            <span className="font-mono text-sm font-bold text-stone-900">{formatCLP(total)}</span>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1 text-[10px] font-medium text-stone-500">
              <Sparkles className="h-3 w-3 text-amber-600" />
              Agregar con un toque
            </p>
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-xl border border-stone-200 bg-stone-50/70 p-1.5">
              {QUICK_SERVICES.map((service) => (
                <button
                  type="button"
                  key={service.description}
                  onClick={() => handleAddQuickService(service)}
                  className="shrink-0 whitespace-nowrap rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-stone-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900 active:scale-[0.97]"
                >
                  + {service.description}
                  <span className="ml-1 text-[10px] text-stone-400">
                    {formatCLP(service.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            {formData.items.length === 0 ? (
              <div className="px-3 py-4 text-center text-[11px] text-stone-400">
                Aún no hay trabajos agregados.
              </div>
            ) : (
              formData.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center gap-2 border-b border-stone-100 px-3 py-2.5 last:border-0"
                >
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-stone-800">
                    {item.description}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] font-bold text-stone-900">
                    {formatCLP(item.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Quitar ${item.description}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Otro servicio o repuesto"
              value={customItemDesc}
              onChange={(event) => setCustomItemDesc(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-lg border border-stone-200 bg-white px-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="$"
              value={customItemPrice}
              onChange={(event) => setCustomItemPrice(event.target.value)}
              className="h-10 w-20 shrink-0 rounded-lg border border-stone-200 bg-white px-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              aria-label="Agregar ítem"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-white transition hover:bg-stone-900 active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="entry-date"
              className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500"
            >
              <Calendar className="h-3 w-3" />
              Ingreso
            </label>
            <input
              id="entry-date"
              type="date"
              value={formData.entryDate}
              onChange={(event) => setFormData({ ...formData, entryDate: event.target.value })}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-2.5 text-sm text-stone-800 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="delivery-date"
              className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500"
            >
              <Calendar className="h-3 w-3" />
              Entrega
            </label>
            <input
              id="delivery-date"
              type="date"
              value={formData.deliveryDate}
              onChange={(event) => setFormData({ ...formData, deliveryDate: event.target.value })}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-2.5 text-sm text-stone-800 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
            Estado del trabajo
          </span>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {Object.entries(ORDER_STATUSES).map(([key, config]) => {
              const isSelected = formData.status === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFormData({ ...formData, status: key })}
                  className={`flex h-10 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-semibold transition ${
                    isSelected
                      ? `${config.bg} ring-2 ring-stone-900/10`
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                  {config.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}
