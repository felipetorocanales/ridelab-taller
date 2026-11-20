import React, { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Globe,
  Calendar,
  Zap,
  Check,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";
import Modal from "./ui/Modal";
import { SERVICE_CATEGORIES } from "../data/serviceCatalog";
import { formatCLP } from "../services/storage";

const createEmptyServiceForm = (nextOrder = 1) => ({
  code: `SRV-${String(nextOrder).padStart(3, "0")}`,
  name: "",
  description: "",
  price: "",
  priceLabel: "",
  category: "mantencion",
  showInLanding: false,
  showInBooking: true,
  showInQuickAdd: true,
  active: true,
  sortOrder: nextOrder,
});

export default function ServicesManagerView({
  services = [],
  onAddService,
  onUpdateService,
  onDeleteService,
}) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [onlyLanding, setOnlyLanding] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(() => createEmptyServiceForm(services.length + 1));

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      const orderDiff = (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
      if (orderDiff !== 0) return orderDiff;
      return (a.code || "").localeCompare(b.code || "");
    });
  }, [services]);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedServices.filter((s) => {
      if (onlyLanding && !s.showInLanding) return false;
      if (categoryFilter !== "todos" && s.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        (s.name || "").toLowerCase().includes(q) ||
        (s.code || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q)
      );
    });
  }, [sortedServices, query, categoryFilter, onlyLanding]);

  const landingCount = services.filter((s) => s.active !== false && s.showInLanding).length;
  const activeCount = services.filter((s) => s.active !== false).length;

  const getCategoryLabel = (value) => {
    const found = SERVICE_CATEGORIES.find((c) => c.value === value);
    return found ? found.label : value || "Otro";
  };

  const handleOpenNew = () => {
    setEditingService(null);
    setFormData(createEmptyServiceForm(services.length + 1));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      ...createEmptyServiceForm(services.length + 1),
      ...service,
      price: String(service.price ?? ""),
    });
    setIsModalOpen(true);
  };

  const handleToggleLanding = (service) => {
    onUpdateService({
      ...service,
      showInLanding: !service.showInLanding,
    });
  };

  const handleDelete = (service) => {
    if (window.confirm(`¿Eliminar el servicio "${service.name}" (${service.code})?`)) {
      onDeleteService(service.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Por favor ingresa el nombre del servicio.");
      return;
    }

    const numericPrice = parseInt(String(formData.price).replace(/\D/g, ""), 10) || 0;
    const payload = {
      ...formData,
      code: (formData.code || "").trim().toUpperCase() || `SRV-${String(services.length + 1).padStart(3, "0")}`,
      name: formData.name.trim(),
      description: (formData.description || "").trim(),
      price: numericPrice,
      priceLabel: (formData.priceLabel || "").trim(),
      sortOrder: Number(formData.sortOrder) || services.length + 1,
    };

    if (editingService) {
      onUpdateService({ ...editingService, ...payload });
    } else {
      onAddService(payload);
    }

    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <section className="space-y-4">
      {/* Header & Summary */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(28,27,24,0.03)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold tracking-tight text-stone-900">
              Mantenedor de Servicios & Precios
            </h1>
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-900">
              {activeCount} activos
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Edita precios, códigos o marca el check <strong className="text-stone-700">"Mostrar en Landing"</strong> para publicar servicios en la página principal ({landingCount} visibles ahora).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 text-amber-300" strokeWidth={2.5} />
          Nuevo Servicio
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, código (SRV-001) o descripción..."
              className="h-10 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyLanding((prev) => !prev)}
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold transition ${
              onlyLanding
                ? "border-amber-300 bg-amber-50 text-amber-900 shadow-sm"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Globe className={`h-3.5 w-3.5 ${onlyLanding ? "text-amber-700" : "text-stone-400"}`} />
            Solo en Landing ({landingCount})
          </button>
        </div>

        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategoryFilter("todos")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              categoryFilter === "todos"
                ? "bg-stone-900 text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            Todos ({services.length})
          </button>
          {SERVICE_CATEGORIES.map((cat) => {
            const count = services.filter((s) => s.category === cat.value).length;
            if (count === 0) return null;
            const active = categoryFilter === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategoryFilter(cat.value)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-stone-900 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Services List */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredServices.map((service) => {
            const isInactive = service.active === false;
            return (
              <div
                key={service.id}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
                  isInactive
                    ? "border-stone-200/70 bg-stone-50/70 opacity-70"
                    : service.showInLanding
                      ? "border-amber-200/90 bg-white shadow-[0_1px_3px_rgba(28,27,24,0.05)]"
                      : "border-stone-200/90 bg-white shadow-[0_1px_2px_rgba(28,27,24,0.03)]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-stone-700">
                          <Tag className="h-2.5 w-2.5 text-stone-500" />
                          {service.code || "SIN-COD"}
                        </span>
                        <span className="rounded bg-sand-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700">
                          {getCategoryLabel(service.category)}
                        </span>
                        {isInactive ? (
                          <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                            Inactivo
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-1.5 text-sm font-bold text-stone-900">
                        {service.name}
                      </h3>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-block rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-xs font-extrabold text-amber-900">
                        {service.priceLabel ? service.priceLabel : formatCLP(service.price)}
                      </span>
                      {service.priceLabel ? (
                        <span className="mt-0.5 block font-mono text-[10px] text-stone-400">
                          Base: {formatCLP(service.price)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {service.description ? (
                    <p className="mt-2 text-xs leading-relaxed text-stone-500">
                      {service.description}
                    </p>
                  ) : null}
                </div>

                {/* Footer Controls: Direct Landing Check + Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
                  <label className="inline-flex cursor-pointer select-none items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(service.showInLanding)}
                      onChange={() => handleToggleLanding(service)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                        service.showInLanding
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-stone-300 bg-white text-transparent"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-stone-700">
                      {service.showInLanding ? (
                        <>
                          <Eye className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-800">Visible en Landing</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5 text-stone-400" />
                          <span className="text-stone-500">Mostrar en Landing</span>
                        </>
                      )}
                    </span>
                  </label>

                  <div className="flex items-center gap-1.5">
                    {service.showInBooking !== false ? (
                      <span
                        title="Disponible en formulario de agendamiento online"
                        className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-1.5 py-1 text-[10px] font-semibold text-stone-600"
                      >
                        <Calendar className="h-3 w-3 text-amber-700" />
                        Agenda
                      </span>
                    ) : null}
                    {service.showInQuickAdd !== false ? (
                      <span
                        title="Disponible como botón rápido en taller"
                        className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-1.5 py-1 text-[10px] font-semibold text-stone-600"
                      >
                        <Zap className="h-3 w-3 text-amber-600" />
                        1-Toque
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(service)}
                      aria-label={`Editar ${service.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service)}
                      aria-label={`Eliminar ${service.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
          <p className="text-sm font-bold text-stone-800">No se encontraron servicios</p>
          <p className="mt-1 text-xs text-stone-500">
            Prueba cambiando los filtros o crea un servicio nuevo.
          </p>
        </div>
      )}

      {/* Create / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Editar Servicio" : "Nuevo Servicio"}
        subtitle="Actualiza precios, código, descripción y dónde se muestra"
        maxWidth="max-w-lg"
        footer={
          <div className="flex w-full items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 transition hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="service-editor-form"
              className="rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800"
            >
              {editingService ? "Guardar Cambios" : "Crear Servicio"}
            </button>
          </div>
        }
      >
        <form id="service-editor-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Código *
              </label>
              <input
                type="text"
                required
                placeholder="SRV-021"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 font-mono text-xs font-bold uppercase text-stone-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-900 focus:border-amber-500 focus:outline-none"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-600">
              Nombre del Servicio / Repuesto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Mantención Completa MTB"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-xs font-semibold text-stone-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Precio (CLP) *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="55000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 font-mono text-xs font-bold text-stone-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Texto de precio (opcional)
              </label>
              <input
                type="text"
                placeholder='Ej: "Desde $14.000"'
                value={formData.priceLabel}
                onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-600">
              Descripción (se muestra en la Landing Page)
            </label>
            <textarea
              rows={3}
              placeholder="Describe brevemente qué incluye este servicio..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Visibilidad y Opciones
            </p>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2.5">
              <div>
                <span className="block text-xs font-bold text-stone-900">
                  Mostrar en Landing Page
                </span>
                <span className="block text-[11px] text-stone-500">
                  Aparece en las tarjetas de "Nuestros Servicios" del sitio público
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(formData.showInLanding)}
                onChange={(e) => setFormData({ ...formData, showInLanding: e.target.checked })}
                className="h-4 w-4 accent-emerald-600"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2.5">
              <div>
                <span className="block text-xs font-bold text-stone-900">
                  Mostrar en Agendamiento Online
                </span>
                <span className="block text-[11px] text-stone-500">
                  El cliente puede elegirlo al agendar su bicicleta en la web
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.showInBooking !== false}
                onChange={(e) => setFormData({ ...formData, showInBooking: e.target.checked })}
                className="h-4 w-4 accent-amber-600"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2.5">
              <div>
                <span className="block text-xs font-bold text-stone-900">
                  Botón rápido (1-Toque) en Intranet
                </span>
                <span className="block text-[11px] text-stone-500">
                  Aparece como acceso rápido al crear o editar órdenes de trabajo
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.showInQuickAdd !== false}
                onChange={(e) => setFormData({ ...formData, showInQuickAdd: e.target.checked })}
                className="h-4 w-4 accent-amber-600"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2.5">
              <div>
                <span className="block text-xs font-bold text-stone-900">
                  Servicio Activo
                </span>
                <span className="block text-[11px] text-stone-500">
                  Si lo desmarcas, se oculta temporalmente sin borrarlo
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.active !== false}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 accent-stone-900"
              />
            </label>
          </div>
        </form>
      </Modal>
    </section>
  );
}
