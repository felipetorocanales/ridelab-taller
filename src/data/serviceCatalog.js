// Catálogo de servicios y repuestos frecuentes de RIDE LAB Taller
// Permite agregar ítems con 1 solo toque al registrar una mantención en el celular

export const QUICK_SERVICES = [
  { description: "Mantención completa MTB", price: 55000, category: "mantencion" },
  { description: "Mantención completa E-Bike", price: 60000, category: "mantencion" },
  { description: "Servicio freno trasero / delantero", price: 20000, category: "frenos" },
  { description: "Purgado de frenos", price: 20000, category: "frenos" },
  { description: "Pastillas de freno traseras", price: 9800, category: "repuestos" },
  { description: "Ajuste de cambios / transmisión", price: 4000, category: "ajustes" },
  { description: "Ajuste bicicleta nueva", price: 10000, category: "ajustes" },
  { description: "Enrayado / armado de rueda", price: 25000, category: "ruedas" },
  { description: "Cinta tubeless", price: 6000, category: "tubeless" },
  { description: "Cinta tubeless x2", price: 14000, category: "tubeless" },
  { description: "Recarga de líquido tubeless", price: 8000, category: "tubeless" },
  { description: "Recarga líquido tubeless x2", price: 16000, category: "tubeless" },
  { description: "Válvulas color x2", price: 15000, category: "repuestos" },
  { description: "Rodamientos maza trasera", price: 24000, category: "rodamientos" },
  { description: "Rodamientos motor", price: 20000, category: "rodamientos" },
  { description: "Rodamiento maneta", price: 5000, category: "rodamientos" },
  { description: "Neumático Maxxis DHR2", price: 73980, category: "neumaticos" },
  { description: "Neumático New HighRoller", price: 63000, category: "neumaticos" },
];

export const BIKE_TYPES = [
  { value: "mtb", label: "MTB Enduro / Trail / DH" },
  { value: "ebike", label: "E-Bike Eléctrica" },
  { value: "gravel", label: "Gravel" },
  { value: "ruta", label: "Ruta / Pista" },
  { value: "urbana", label: "Urbana / Paseo" },
  { value: "otro", label: "Otra" },
];

export const ORDER_STATUSES = {
  agendado: {
    label: "Agendado / Espera",
    shortLabel: "Agendado",
    bg: "bg-amber-50 text-amber-800 border-amber-200",
    badge: "bg-amber-100 text-amber-900",
    dot: "bg-amber-500",
    icon: "Clock",
  },
  en_taller: {
    label: "En Taller / Trabajando",
    shortLabel: "En Taller",
    bg: "bg-blue-50 text-blue-800 border-blue-200",
    badge: "bg-blue-100 text-blue-900",
    dot: "bg-blue-600",
    icon: "Wrench",
  },
  listo: {
    label: "Listo para Retiro",
    shortLabel: "Listo",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-900",
    dot: "bg-emerald-600",
    icon: "CheckCircle",
  },
  entregado: {
    label: "Entregado al Cliente",
    shortLabel: "Entregado",
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    badge: "bg-slate-200 text-slate-800",
    dot: "bg-slate-500",
    icon: "Archive",
  },
};
