import React, { useState } from "react";
import {
  Bike,
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  ChevronRight,
  Send,
} from "lucide-react";
import { QUICK_SERVICES, BIKE_TYPES } from "../data/serviceCatalog";
import { formatCLP } from "../services/storage";
import confetti from "canvas-confetti";

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function WorkshopPublicPage({ onOpenIntranet, onBookingSubmitted }) {
  const [booking, setBooking] = useState({
    clientName: "",
    clientPhone: "",
    bikeBrand: "",
    bikeModel: "",
    bikeType: "mtb",
    serviceDescription: "Mantención completa MTB ($55.000)",
    notes: "",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const [submitted, setSubmitted] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!booking.clientName.trim() || !booking.bikeModel.trim()) {
      alert("Por favor completa tu nombre y el modelo de tu bicicleta.");
      return;
    }

    // Determine estimated price
    const matchedService = QUICK_SERVICES.find((s) =>
      booking.serviceDescription.includes(s.description)
    );
    const estimatedPrice = matchedService ? matchedService.price : 50000;

    const newOrder = {
      clientName: booking.clientName.trim(),
      clientPhone: booking.clientPhone.trim(),
      bikeBrand: booking.bikeBrand.trim() || "Bicicleta",
      bikeModel: booking.bikeModel.trim(),
      bikeType: booking.bikeType,
      notes: booking.notes ? `Agendado en línea: ${booking.notes}` : "Agendado en línea por el cliente",
      serviceType: booking.serviceDescription,
      items: [
        {
          id: "online-" + Date.now(),
          description: booking.serviceDescription,
          price: estimatedPrice,
        },
      ],
      total: estimatedPrice,
      status: "agendado",
      entryDate: booking.date,
      deliveryDate: new Date(new Date(booking.date).getTime() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    if (onBookingSubmitted) {
      const saved = onBookingSubmitted(newOrder);
      setBookingCode(saved?.code || "RL-" + Math.floor(1000 + Math.random() * 9000));
    }

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    setSubmitted(true);
  };

  const handleWhatsAppConfirm = () => {
    const msg = `¡Hola RIDE LAB! 🚵‍♂️ Acabo de agendar una mantención a través de su sitio web:
• *Nombre:* ${booking.clientName}
• *Bici:* ${booking.bikeBrand} ${booking.bikeModel}
• *Servicio:* ${booking.serviceDescription}
• *Fecha preferida:* ${booking.date}
• *Código:* ${bookingCode}

¿Me confirman la recepción? ¡Muchas gracias! 🔧`;
    const url = "https://wa.me/?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-200 shadow-sm bg-sand-100 flex-shrink-0">
              <img src="./logo.jpg" alt="RIDE LAB" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900 tracking-tight leading-none">
                  RIDE LAB
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Taller de MTB
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Mecánica Biker Especializada</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/ridelab.taller"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-600 hover:text-amber-800 hover:bg-slate-100 rounded-lg transition"
              title="Instagram @ridelab.taller"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenIntranet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm"
              title="Acceso exclusivo para el mecánico del taller"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Intranet Taller</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-sand-50/50 to-slate-50 py-12 sm:py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-4">
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
            <span>Siempre apoyando al Rider en sus aventuras ⛰️🔧</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Servicio Técnico MTB &{" "}
            <span className="text-amber-800">Mecánica Especializada</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Mantenciones completas, purgado de frenos, armado de ruedas y tubeless para Enduro, Downhill, Trail, E-Bikes y Gravel.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#agendar"
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              Agendar Mantención en Línea
            </a>

            <a
              href="https://www.instagram.com/ridelab.taller"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
            >
              <InstagramIcon className="w-4 h-4 text-amber-600" />
              Ver Trabajos en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Main Content: Services Catalog + Booking Form */}
      <main className="max-w-5xl mx-auto px-4 py-12 flex-1 w-full space-y-12">
        {/* Services Showcase */}
        <section>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Nuestros Servicios & Especialidades
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Trabajamos con herramientas profesionales de precisión, torquímetros y repuestos de alta gama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                title: "Mantención Completa MTB",
                price: "$55.000",
                desc: "Desarme, limpieza ultrasónica, lubricación de pivotes, engrase general, regulación de cambios y torques.",
              },
              {
                title: "Mantención E-Bike Eléctrica",
                price: "$60.000",
                desc: "Servicio mecánico completo adaptado a bicicletas eléctricas, revisión de cableados, motor y batería.",
              },
              {
                title: "Servicio de Frenos & Purgado",
                price: "$20.000",
                desc: "Purgado con aceite mineral / DOT, eliminación de aire, limpieza de pistones y cambio de pastillas.",
              },
              {
                title: "Armado de Ruedas & Enrayado",
                price: "$25.000",
                desc: "Enrayado desde cero o centrado fino con tensiómetro de rayos de alta precisión.",
              },
              {
                title: "Conversión Tubeless & Sellado",
                price: "Desde $14.000",
                desc: "Instalación de cintas especiales, válvulas de aluminio con color y recarga de líquido sellante.",
              },
              {
                title: "Rodamientos de Maza & Motor",
                price: "Desde $20.000",
                desc: "Extracción e instalación de rodamientos sellados de precisión para mazas y caja de pedalier.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-amber-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                    <span className="text-xs font-mono font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex-shrink-0">
                      {s.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Form Section */}
        <section id="agendar" className="scroll-mt-20">
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Agenda tu Bicicleta en RIDE LAB
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa tus datos y te guardaremos un cupo en el taller para ingresar tu máquina.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">¡Agendamiento Registrado!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Tu código de orden es: <strong className="font-mono text-slate-900">{bookingCode}</strong>
                  </p>
                  <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
                    Ya quedó agendada tu <strong>{booking.bikeBrand} {booking.bikeModel}</strong> para el día{" "}
                    <strong>{booking.date}</strong>.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleWhatsAppConfirm}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Confirmación por WhatsApp a RIDE LAB
                  </button>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setBooking({
                        clientName: "",
                        clientPhone: "",
                        bikeBrand: "",
                        bikeModel: "",
                        bikeType: "mtb",
                        serviceDescription: "Mantención completa MTB ($55.000)",
                        notes: "",
                        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      });
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium pt-2"
                  >
                    Agendar otra bicicleta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tu Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Matías Vásquez"
                    value={booking.clientName}
                    onChange={(e) => setBooking({ ...booking, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 1234 5678"
                    value={booking.clientPhone}
                    onChange={(e) => setBooking({ ...booking, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Marca Bici
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Trek, Polygon, Whyte"
                      value={booking.bikeBrand}
                      onChange={(e) => setBooking({ ...booking, bikeBrand: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Collosus N7, Clash"
                      value={booking.bikeModel}
                      onChange={(e) => setBooking({ ...booking, bikeModel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Servicio Requerido
                  </label>
                  <select
                    value={booking.serviceDescription}
                    onChange={(e) => setBooking({ ...booking, serviceDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option value="Mantención completa MTB ($55.000)">Mantención completa MTB ($55.000)</option>
                    <option value="Mantención completa E-Bike ($60.000)">Mantención completa E-Bike ($60.000)</option>
                    <option value="Servicio de Frenos & Purgado ($20.000)">Servicio de Frenos & Purgado ($20.000)</option>
                    <option value="Armado / Enrayado de Ruedas ($25.000)">Armado / Enrayado de Ruedas ($25.000)</option>
                    <option value="Conversión Tubeless & Líquido">Conversión Tubeless & Líquido</option>
                    <option value="Revisión General / Ajuste de Cambios">Revisión General / Ajuste de Cambios</option>
                    <option value="Otro servicio personalizado">Otro servicio personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fecha deseada para llevarla al taller *
                  </label>
                  <input
                    type="date"
                    required
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Detalles adicionales (ruidos, fallas o preferencias)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Freno trasero sin presión, cambiar rodamientos..."
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Confirmar Agendamiento
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">RIDE LAB | TALLER DE MTB</span>
            <span>•</span>
            <a
              href="https://www.instagram.com/ridelab.taller"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-800 underline"
            >
              @ridelab.taller
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenIntranet}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Intranet del Mecánico
            </button>
            <span>•</span>
            <span>
              Powered by{" "}
              <a href="https://tcdigital.cl" target="_blank" rel="noreferrer" className="font-bold text-slate-700 hover:underline">
                TC Digital
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
